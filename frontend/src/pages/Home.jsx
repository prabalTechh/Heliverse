import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URLL = 'https://heliverse-qmxf.onrender.com/api'; 

const Home = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [days, setDays] = useState([]);
  const [selectedClassroomId, setSelectedClassroomId] = useState("");
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState("");
  const [timetableStartTime, setTimetableStartTime] = useState("");
  const [timetableEndTime, setTimetableEndTime] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [timetables, setTimetables] = useState([]);
  const [teacherName, setTeacherName] = useState("")
  const navigate = useNavigate();

  //fetch the classroom
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get(
          `${API_URLL}/classrooms`
        );
        setClassrooms(response.data);
      } catch (error) {
        console.error("Error fetching classrooms", error);
      }
    };

    fetchClassrooms();
  }, []);

  const handleClassroomSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URLL}/classrooms`,
        {
          name,
          startTime,
          endTime,
          days,
        }
      );
      alert("Classroom created successfully!");
      setClassrooms([...classrooms, response.data]);
      setName("");
      setStartTime("");
      setEndTime("");
      setDays([]);
    } catch (error) {
      alert("Error creating classroom");
    }
  };

  const handleTimetableSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URLL}/Timetables`,
        {
          classroomId: selectedClassroomId,
          teacherId,
          teacherName,
          subject,
          day,
          startTime: timetableStartTime,
          endTime: timetableEndTime,
        }
      );
      alert("Timetable created successfully!");
      fetchTimetables(selectedClassroomId);
      setSubject("");
      setDay("");
      setTimetableStartTime("");
      setTimetableEndTime("");
      setTeacherId("");
      setTeacherName("")
    } catch (error) {
      console.error("Error response:", error.response);
      alert("Error creating timetable");
    }
  };

  const fetchTimetables = async (classroomId) => {
    try {
      const response = await axios.get(
        `${API_URLL}/Timetables/${classroomId}`
      );
      setTimetables(response.data);
    } catch (error) {
      console.error("Error fetching timetables", error);
    }
  };

  const handleDeleteClassroom = async (classroomId) => {
    try {
      await axios.delete(`${API_URLL}/classrooms/${classroomId}`);
      alert("Classroom deleted successfully!");
      setClassrooms(classrooms.filter((classroom) => classroom._id !== classroomId));
    } catch (error) {
      console.error("Error deleting classroom", error);
      alert("Error deleting classroom");
    }
  };

  const handleLogout = () => {
    // Clear user data (e.g., tokens, user info) from localStorage or context
    localStorage.removeItem("userToken");
    // Redirect to signup page
    navigate("/login");
  };

  return (
    <div className="h-full pb-6">
        <nav className="w-full h-20 bg-red-300 flex items-center justify-between px-28">
        <h1 className="text-4xl font-semibold font-schoolbellregular">Class Room</h1>
        <button
          onClick={handleLogout}
          className="px-3 py-1 border-2 border-red-400 ml-4 rounded-xl bg-gray-900 uppercase font-semibold text-white text-sm"
        >
          Logout
        </button>
      </nav>
      <div className="max-w-screen-xl mx-auto flex justify-center">
        <form
          onSubmit={handleClassroomSubmit}
          className="flex items-baseline mt-20 gap-4"
        >
          <div className="flex gap-2 text-sm items-center">
            <label htmlFor="name">Class Name</label>
            <input
              className="p-2 rounded-2xl"
              type="text"
              id="name"
              placeholder="ex-: 10th A"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2 text-sm items-center">
            <label htmlFor="startTime">Start Time</label>
            <input
              className="p-2 rounded-2xl"
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2 text-sm items-center">
            <label htmlFor="endTime">End Time</label>
            <input
              className="p-2 rounded-2xl"
              type="time"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2 text-sm items-center">
            <label htmlFor="days" className="text-sm">
              Days
            </label>
            <select
              id="days"
              className="h-5 bg-white"
              multiple
              value={days}
              onChange={(e) =>
                setDays(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-3 py-1 border-2 ml-4 rounded-xl bg-blue-400 text-white text-sm"
          >
            Create Classroom
          </button>
        </form>
      </div>

      <div className="relative max-w-screen-xl mx-auto overflow-x-auto mt-10">
        <table className="w-full text-sm text-left text-gray-500 bg-white border border-gray-300">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Class Name</th>
              <th scope="col" className="px-6 py-3">Start Time</th>
              <th scope="col" className="px-6 py-3">End Time</th>
              <th scope="col" className="px-6 py-3">Days</th>
              <th scope="col" className="px-6 py-3">Actions</th>
              <th scope="col" className="px-6 py-3">Timetable</th>
            </tr>
          </thead>
          <tbody>
            {classrooms.map((classroom) => (
              <tr key={classroom._id} className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900">{classroom.name}</td>
                <td className="px-6 py-4">{classroom.startTime}</td>
                <td className="px-6 py-4">{classroom.endTime}</td>
                <td className="px-6 py-4">{classroom.days.join(", ")}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      setSelectedClassroomId(classroom._id);
                      fetchTimetables(classroom._id);
                    }}
                    className="px-2 py-1 bg-green-500 text-white rounded"
                  >
                    View Timetables
                  </button>
                  <button
                    onClick={() => handleDeleteClassroom(classroom._id)}
                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
                <td className="px-6 py-4">
                  {selectedClassroomId === classroom._id && (
                    <button
                      onClick={() => fetchTimetables(classroom._id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Refresh Timetables
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedClassroomId && (
        <>
          <div className="max-w-screen-xl mx-auto mt-10 p-4 rounded-lg flex flex-col item">
            <h2 className="text-xl font-semibold mb-4">Create Timetable</h2>
            <form
              onSubmit={handleTimetableSubmit}
              className="flex flex-col gap-4"
            >
              <div className="flex gap-2 text-xs items-center">
                <label htmlFor="subject">Subject</label>
                <input
                  className="p-2 rounded-2xl border "
                  type="text"
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2 text-sm items-center">
                <label htmlFor="day">Day</label>
                <select
                  id="day"
                  className="p-2 rounded-2xl bg-white"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  required
                >
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
              <div className="flex gap-2 text-sm items-center">
                <label htmlFor="timetableStartTime">Start Time</label>
                <input
                  className="p-2 rounded-2xl"
                  type="time"
                  id="timetableStartTime"
                  value={timetableStartTime}
                  onChange={(e) => setTimetableStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2 text-sm items-center">
                <label htmlFor="timetableEndTime">End Time</label>
                <input
                  className="p-2 rounded-2xl"
                  type="time"
                  id="timetableEndTime"
                  value={timetableEndTime}
                  onChange={(e) => setTimetableEndTime(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2 text-sm items-center">
                <label htmlFor="teacherName">Teacher Name</label>
                <input
                  className="p-2 rounded-2xl border"
                  type="text"
                  id="teacherName"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2 text-sm items-center">
                <label htmlFor="teacherId">Teacher ID</label>
                <input
                  className="p-2 rounded-2xl border"
                  type="text"
                  id="teacherId"
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="px-3 py-1 border-2 rounded-xl bg-blue-400 text-white"
              >
                Create Timetable
              </button>
            </form>
          </div>

          <div className="max-w-screen-xl mx-auto mt-10 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Timetables</h2>
            {timetables.length > 0 ? (
              <table className="w-full text-sm text-left text-gray-500 bg-white border border-gray-300">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Subject</th>
                    <th scope="col" className="px-6 py-3">Day</th>
                    <th scope="col" className="px-6 py-3">Start Time</th>
                    <th scope="col" className="px-6 py-3">End Time</th>
                    <th scope="col" className="px-6 py-3">Teacher Id</th>
                    <th scope="col" className="px-6 py-3">Teacher Name</th>

                  </tr>
                </thead>
                <tbody>
                  {timetables.map((timetable) => (
                    <tr key={timetable._id} className="bg-white border-b">
                      <td className="px-6 py-4 font-bold">{timetable.subject}</td>
                      <td className="px-6 py-4">{timetable.day}</td>
                      <td className="px-6 py-4 font-semibold">{timetable.startTime}</td>
                      <td className="px-6 py-4 font-semibold">{timetable.endTime}</td>
                      <td className="px-6 py-4">{timetable.teacherId}</td>
                      <td className="px-6 py-4 ">{timetable.teacherName}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No timetables available for this classroom.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
