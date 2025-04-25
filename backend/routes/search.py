from flask import Blueprint, request, jsonify
from sqlalchemy import text
from extensions import Session 

search_bp = Blueprint("search", __name__, url_prefix="/api")

@search_bp.route("/search")
def search_towns():
    q = request.args.get("query", "").strip()
    if not q:
        return jsonify([])  # empty query → no suggestions

    sql = text("""
      SELECT id, name, latitude, longitude, department
      FROM towns
      WHERE name ILIKE :prefix
      ORDER BY name
      LIMIT 10
    """)
    
    session = Session()
    try:
        rows = session.execute(sql, {"prefix": f"{q}%"}).fetchall()
        towns = [dict(zip(row._fields, row)) for row in rows]  # More efficient conversion
        return jsonify(towns)
    except Exception as e:
        # Log error if needed
        return jsonify({"error": "Search failed"}), 500
    finally:
        Session.remove()  # Important - returns session to pool