import React, { useEffect, useState } from "react";

function App() {
  // 1. State definitions
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [datetime, setDatetime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [reason, setReason] = useState("");

  const API_BASE = "http://localhost:5000/api";

  // 2. Load data function
  const loadData = () => {
    fetch(`${API_BASE}/slots`)
      .then((res) => res.json())
      .then((data) => setSlots(data))
      .catch((err) => console.error("Error:", err));

    fetch(`${API_BASE}/bookings`)
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error("Error:", err));
  };

  useEffect(() => {
    loadData();
  }, []);

  // 3. Actions
  const addSlot = () => {
    fetch(`${API_BASE}/slots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ datetime, capacity: parseInt(capacity) }),
    }).then(() => {
      loadData();
      setDatetime("");
      setCapacity("");
    });
  };

  const makeBooking = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slot_id: parseInt(selectedSlotId),
        student_name: studentName,
        student_id: studentId,
        reason: reason
      }),
    }).then((res) => {
      if (res.ok) {
        alert("Success!");
        loadData();
      } else {
        alert("Failed. Check if slot is full or ID is duplicate.");
      }
    });
  };

  // 4. UI Rendering
  return (
    <div style={{ padding: "20px" }}>
      <h1>QueueBuddy</h1>
      
      {/* Admin: Create Slot */}
      <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
        <h3>Admin: Add Slot</h3>
        <input placeholder="Time" value={datetime} onChange={(e) => setDatetime(e.target.value)} />
        <input placeholder="Capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
        <button onClick={addSlot}>Add</button>
      </div>

      {/* Student: Book */}
      <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "20px" }}>
        <h3>Student: Book</h3>
        <form onSubmit={makeBooking}>
          <select onChange={(e) => setSelectedSlotId(e.target.value)} required>
            <option value="">Select Slot</option>
            {slots.map(s => <option key={s.id} value={s.id}>{s.datetime}</option>)}
          </select>
          <input placeholder="Name" value={studentName} onChange={(e) => setStudentName(e.target.value)} />
          <input placeholder="ID" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
          <textarea placeholder="Reason" value={reason} onChange={(e) => setReason(e.target.value)} />
          <button type="submit">Book Now</button>
        </form>
      </div>

      {/* Admin: List */}
      <h3>Current Bookings</h3>
      <ul>
        {bookings.map(b => (
          <li key={b.id}>{b.student_name} - {b.status}</li>
        ))}
      </ul>
    </div>
  );
}

// THIS LINE IS THE MOST IMPORTANT:
export default App;