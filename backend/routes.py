from flask import request, jsonify
from app import app, db
from models import Slot, Booking

@app.route("/api/slots", methods=["GET"])
def get_slots():
    slots = Slot.query.all()
    result = []
    for s in slots:
        result.append({
            "id": s.id,
            "datetime": s.datetime,
            "capacity": s.capacity
        })
    return jsonify(result)

# --- REPLACED FUNCTION START ---
@app.route("/api/slots", methods=["POST"])
def create_slot():
    data = request.json
    if not data or "datetime" not in data or "capacity" not in data:
        return {"error": "Missing required fields"}, 400 

    slot = Slot(
        datetime=data["datetime"],
        capacity=data["capacity"]
    )
    db.session.add(slot)
    db.session.commit()
    return {"message": "slot created"}, 201
# --- REPLACED FUNCTION END ---

@app.route("/api/bookings", methods=["GET"])
def get_bookings():
    bookings = Booking.query.all()
    result = []
    for b in bookings:
        result.append({
            "id": b.id,
            "student_name": b.student_name,
            "student_id": b.student_id,
            "reason": b.reason,
            "status": b.status
        })
    return jsonify(result)

@app.route("/api/bookings", methods=["POST"])
def create_booking():
    data = request.json
    slot = Slot.query.get(data["slot_id"])
    if not slot:
        return {"error": "slot not found"}, 404

    # Validation: Prevent double booking [cite: 44, 82]
    existing = Booking.query.filter_by(
        slot_id=data["slot_id"],
        student_id=data["student_id"]
    ).first()
    if existing:
        return {"error": "already booked"}, 400

    # Validation: Check capacity [cite: 45, 82]
    current_bookings_count = Booking.query.filter_by(slot_id=data["slot_id"]).count()
    if current_bookings_count >= slot.capacity:
        return {"error": "slot full"}, 400

    booking = Booking(
        slot_id=data["slot_id"],
        student_name=data["student_name"],
        student_id=data["student_id"],
        reason=data["reason"]
    )
    db.session.add(booking)
    db.session.commit()
    return {"message": "booking created"}, 201

# Added this to allow the Admin to change status (Confirmed/Canceled) [cite: 42, 60]
@app.route("/api/bookings/<int:id>", methods=["PATCH"])
def update_booking_status(id):
    data = request.json
    booking = Booking.query.get(id)
    if not booking:
        return {"error": "Booking not found"}, 404
    
    booking.status = data.get("status", booking.status)
    db.session.commit()
    return {"message": "Status updated"}, 200