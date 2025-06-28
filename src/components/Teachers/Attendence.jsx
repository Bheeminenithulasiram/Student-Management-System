import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeaSidebar from "./TeaSidebar";
import api from "../utils/api";

const Attendance = () => {
  const navigate = useNavigate();
  const userdata = localStorage.getItem("data");
  const data = userdata ? JSON.parse(userdata) : null;

  const [selectedSubject] = useState(data?.subject || "");
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch students for the assigned subject
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedSubject) return;
      setIsLoading(true);
      try {
        const res = await api.get(`/teacher/student-getProfiles`);
        setStudents(res.data.data || []);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [selectedSubject]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };
  const handleSubmit = async () => {
    if (!selectedSubject || !date) {
      alert("Please select subject and date");
      return;
    }
  
    const payload = {
      subject: selectedSubject, // ✅ changed key from subjectId to subject
      date,
      time,
      records: students.map((student) => ({
        studentId: student.id,
        isPresent: attendanceRecords[student.id] === "present", // ✅ boolean as per requirement
      })),
    };
  
    try {
      await api.post("/teacher/attendance/add", payload);
      alert("Attendance saved successfully!");
      setAttendanceRecords({});
    } catch (err) {
      console.error("Failed to save attendance:", err);
      alert("Failed to save attendance.");
    }
  };
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TeaSidebar />

      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Student Management System
        </h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Attendance Management
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={selectedSubject}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="text"
              value={time}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : students.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Roll No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4">{student.id}</td>
                      <td className="px-6 py-4">{student.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`attendance-${student.id}`}
                              checked={attendanceRecords[student.id] === "present"}
                              onChange={() =>
                                handleAttendanceChange(student.id, "present")
                              }
                              className="h-4 w-4 text-green-600"
                            />
                            <span className="ml-2 text-gray-700">Present</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name={`attendance-${student.id}`}
                              checked={
                                attendanceRecords[student.id] === "absent" ||
                                !attendanceRecords[student.id]
                              }
                              onChange={() =>
                                handleAttendanceChange(student.id, "absent")
                              }
                              className="h-4 w-4 text-red-600"
                            />
                            <span className="ml-2 text-gray-700">Absent</span>
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Attendance
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No students found for this subject
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
