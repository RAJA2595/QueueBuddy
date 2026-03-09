from app import db

class Slot(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    datetime = db.Column(db.String(50))

    capacity = db.Column(db.Integer)


class Booking(db.Model):

    id = db.Column(db.Integer, primary_key=True)

    slot_id = db.Column(db.Integer)

    student_name = db.Column(db.String(100))

    student_id = db.Column(db.String(50))

    reason = db.Column(db.String(200))

    status = db.Column(db.String(20), default="pending")