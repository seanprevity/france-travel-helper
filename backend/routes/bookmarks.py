from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import text
from extensions import Session

bookmarks_bp = Blueprint("bookmarks", __name__, url_prefix="/api")

@bookmarks_bp.route("/bookmarks", methods=["GET"])
@jwt_required()
def get_bookmarks():
    user_id = int(get_jwt_identity())
    sql = text("SELECT town_name FROM bookmarks WHERE user_id = :uid")
    
    session = Session()
    try:
        result = session.execute(sql, {"uid": user_id}).fetchall()
        return jsonify({"bookmarks": [row[0] for row in result]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        Session.remove()

@bookmarks_bp.route("/bookmarks", methods=["POST"])
@jwt_required()
def add_bookmark():
    user_id = int(get_jwt_identity())
    town_name = request.json.get("town_name")

    if not town_name:
        return jsonify({"error": "Missing town_name"}), 400

    sql = text("""
        INSERT INTO bookmarks (user_id, town_name) 
        VALUES (:uid, :town) 
        ON CONFLICT DO NOTHING
        RETURNING town_name
    """)
    
    session = Session()
    try:
        result = session.execute(sql, {"uid": user_id, "town": town_name})
        session.commit()
        if result.rowcount > 0:
            return jsonify({"status": "added", "town": town_name}), 201
        return jsonify({"status": "already_exists"}), 200
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        Session.remove()

@bookmarks_bp.route("/bookmarks", methods=["DELETE"])
@jwt_required()
def remove_bookmark():
    user_id = int(get_jwt_identity())
    town_name = request.json.get("town_name")

    if not town_name:
        return jsonify({"error": "Missing town_name"}), 400

    sql = text("""
        DELETE FROM bookmarks 
        WHERE user_id = :uid AND town_name = :town
        RETURNING town_name
    """)
    
    session = Session()
    try:
        result = session.execute(sql, {"uid": user_id, "town": town_name})
        session.commit()
        if result.rowcount > 0:
            return jsonify({"status": "deleted", "town": town_name}), 200
        return jsonify({"error": "Bookmark not found"}), 404
    except Exception as e:
        session.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        Session.remove()
        