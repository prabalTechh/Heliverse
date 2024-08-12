import React, { useState } from "react";
import { createTimetable } from "../apiService";

const TimetableForm = ({ classroomId }) => {
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTimetable({ classroomId, teacherId, subject, day, startTime, endTime });
      setMessage("Timetable created successfully!");
    } catch (error) {
      setMessage(`Error creating timetable: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <div>
        <label>Subject</label>
        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
      </div>
      <div>
        <label>Day</label>
        <select value={day} onChange={(e) => setDay(e.target.value)} required>
          <option value="">Select a day</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
          <option value="Sunday">Sunday</option>
        </select>
      </div>
      <div>
        <label>Start Time</label>
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
      </div>
      <div>
        <label>End Time</label>
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
      </div>
      <div>
        <label>Teacher ID</label>
        <input type="text" value={teacherId} onChange={(e) => setTeacherId(e.target.value)} required />
      </div>
      <button type="submit">Create Timetable</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default TimetableForm;
