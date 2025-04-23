from flask import Blueprint, request, jsonify
from extensions import Session
from sqlalchemy import text

towns_bp = Blueprint("towns", __name__, url_prefix="/api")

@towns_bp.route("/nearest-town")
def nearest_town():
    try:
        lat = float(request.args["lat"])
        lng = float(request.args["lng"])
    except (KeyError, ValueError):
        return jsonify({"error": "Missing or invalid lat/lng"}), 400

    town = find_nearest_town(lat, lng)
    if not town:
        return jsonify({"error": "No town found"}), 404

    return jsonify(town)

def find_nearest_town(lat, lng, max_dist=0.5):
    max_d2 = max_dist * max_dist
    sql = text("""
        SELECT id, name, department, latitude, longitude
        FROM (
            SELECT id, name, department, latitude, longitude,
                ((latitude - :lat)*(latitude - :lat)
                + (longitude - :lng)*(longitude - :lng)) AS dist2
            FROM towns
        ) AS sub
        WHERE dist2 <= :max_d2
        ORDER BY dist2
        LIMIT 1
    """)
    
    session = Session()
    try:
        row = session.execute(sql, {"lat": lat, "lng": lng, "max_d2": max_d2}).fetchone()
        return dict(row._mapping) if row else None
    finally:
        Session.remove()
