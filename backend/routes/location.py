from flask import Blueprint, request, jsonify, current_app
from services.openai_service import get_description
from extensions import Session
from .images import fetch_wiki_images
from sqlalchemy import text

location_bp = Blueprint("location", __name__, url_prefix="/api")

@location_bp.route("/location")
def location_info():
    name = request.args.get("name")
    lang = request.args.get("lang", "en")

    if not name:
        return jsonify({"error": "Missing 'name' parameter"}), 400

    town = get_town_by_name(name)
    if not town:
        return jsonify({"error": f"No town named '{name}' found"}), 404

    town_code = town["code"]
    dept_code = town["department"]
    
    dept = get_department_by_code(dept_code)
    region_code = dept["region_code"]
    region = get_region_by_code(region_code) if dept else {"name": None}
    
    # fetch images from the wikipedia
    images_response = fetch_wiki_images(town_name=town["name"], department_name=dept["department_name"])
    images_list = images_response.get("images", [])
    
    metadata = {
        **town,
        "department_name": dept["department_name"],
        "department_code": dept_code,
        "region_code": dept["region_code"],
        "region_name": region["region_name"],
    }

    # Try cache first
    cached = get_cached_description(town_code, dept_code, lang)
    if cached:
        current_app.logger.info(f"Cache HIT for {town['name']} ({town_code}-{dept_code}) lang={lang}")
        return jsonify({
            "description": cached,
            "metadata": metadata,
            "images": images_list,
            "cached": True
        })

    # Generate & Cache description
    description = get_description(name, dept["department_name"], region["region_name"], lang)
    cache_description(town_code, dept_code, lang, description)
    current_app.logger.info(f"Cache MISS for {town['name']} ({town_code}-{dept_code}) lang={lang} – generated fresh")
    return jsonify({
        "description": description,
        "metadata": metadata,
        "images": images_list,
        "cached": False
    })
    
def get_town_by_name(town_name):
    query = text("""
        SELECT * FROM towns
        WHERE LOWER(name) = LOWER(:name)
        LIMIT 1
    """)
    
    session = Session()
    try:
        row = session.execute(query, {"name": town_name}).fetchone()
        return dict(row._mapping) if row else None
    finally:
        Session.remove()
        
def get_department_by_code(dept_code):
    query = text("""
                 SELECT code AS department_code, name AS department_name, region AS region_code
                 FROM departments
                 WHERE code = :code
                 LIMIT 1
                 """)
    session = Session()
    try:
        row = session.execute(query, {"code": dept_code}).fetchone()
        if not row:
            return {"department_code": dept_code, "department_name": None, "region_code": None}
        m = row._mapping
        return {"department_code": m["department_code"], "department_name": m["department_name"], "region_code": m["region_code"]}
    finally:
        Session.remove()

def get_region_by_code(region_code):
    query = text("""
                 SELECT code AS region_code, name AS region_name
                 FROM regions
                 WHERE code = :code
                 LIMIT 1
                 """)
    session = Session()
    try:
        row = session.execute(query, {"code": region_code}).fetchone()
        if not row:
            return {"region_code": region_code, "region_name": None}
        return {"region_code": row._mapping["region_code"], "region_name": row._mapping["region_name"]}
    finally:
        Session.remove()

def get_cached_description(town_code, department, lang):
    query = text("""
        SELECT description FROM descriptions
        WHERE town_code = :code AND department = :dept AND language = :lang
        LIMIT 1
    """)
    
    session = Session()
    try:
        result = session.execute(query, {
            "code": town_code,
            "dept": department,
            "lang": lang
        }).fetchone()
        return result[0] if result else None
    finally:
        Session.remove()

def cache_description(town_code, department, lang, description):
    insert = text("""
        INSERT INTO descriptions (town_code, department, language, description)
        VALUES (:code, :dept, :lang, :desc)
        ON CONFLICT (town_code, department, language) DO NOTHING
    """)
    
    session = Session()
    try:
        session.execute(insert, {
            "code": town_code,
            "dept": department,
            "lang": lang,
            "desc": description
        })
        session.commit()
    except Exception as e:
        session.rollback()
        raise e
    finally:
        Session.remove()

@location_bp.route("/descriptions", methods=["DELETE"])
def delete_cached_description():
    town_code = request.args.get("town_code")
    department = request.args.get("department")

    if not (town_code and department):
        return jsonify({"error": "Missing query parameter"}), 400

    delete_q = text("""
        DELETE FROM descriptions
        WHERE town_code  = :code
        AND department = :dept
    """)
    session = Session()
    try:
        result = session.execute(delete_q, {
            "code": town_code,
            "dept": department
        })
        session.commit()
        current_app.logger.info(f"Deleted {result.rowcount} rows from descriptions for {town_code}-{department}")
        return jsonify({"success": True}), 200
    except Exception as e:
        session.rollback()
        current_app.logger.error(f"Failed to delete cache: {e}", exc_info=True)
        return jsonify({"error": "Could not clear cache"}), 500
    finally:
        Session.remove()