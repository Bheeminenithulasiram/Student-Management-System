import React, { useEffect, useState } from "react";
import StudentSidebar from "./StudenttSidebar";
import api from "../utils/api";

const ViewAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const id = JSON.parse(localStorage.getItem("data")).id;

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await api.get(`/teacher/attendance/student/${id}`);
        if (response.data && Array.isArray(response.data.data)) {
          const grouped = {};
          response.data.data.forEach((entry) => {
            const subject = entry.subject.toLowerCase();
            if (!grouped[subject]) {
              grouped[subject] = {
                subject: subject,
                total: 0,
                present: 0,
                records: [],
                student: entry.student, // single student, same for all
              };
            }
            grouped[subject].total += 1;
            if (entry.isPresent) grouped[subject].present += 1;
            grouped[subject].records.push(entry);
          });

          setAttendanceData(Object.values(grouped));
        } else {
          setError("Unexpected data format from server.");
        }
      } catch (err) {
        setError("Failed to load attendance data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const totalPresent = attendanceData.reduce((sum, sub) => sum + sub.present, 0);
  const totalClasses = attendanceData.reduce((sum, sub) => sum + sub.total, 0);
  const overallPercentage = totalClasses > 0
    ? ((totalPresent / totalClasses) * 100).toFixed(1)
    : 0;

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return "text-green-600";
    if (percentage >= 50) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar />

      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Student Management System
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Attendance Overview</h2>

          {loading ? (
            <p className="text-gray-600">Loading attendance...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <>
              {/* Overall Attendance */}
              <div className="bg-blue-50 p-4 rounded-lg mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800">Overall Attendance</h3>
                    <p className="text-gray-600">Total Classes Attended</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-blue-600">
                      {overallPercentage}%
                    </span>
                    <p className="text-sm text-gray-600">
                      {totalPresent}/{totalClasses} classes
                    </p>
                  </div>
                </div>
              </div>

              {/* Subject-Wise Table */}
              <div className="overflow-x-auto">
                <table className="w-full table-auto border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-600 font-medium">Subject</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-medium">Attended</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-medium">Total</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-medium">Percentage</th>
                      <th className="px-4 py-3 text-left text-gray-600 font-medium">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((subject, index) => {
                      const percentage = ((subject.present / subject.total) * 100).toFixed(1);
                      return (
                        <React.Fragment key={index}>
                          <tr className="border-b bg-gray-100">
                            <td className="px-4 py-3 capitalize font-semibold">{subject.subject}</td>
                            <td className="px-4 py-3">{subject.present}</td>
                            <td className="px-4 py-3">{subject.total}</td>
                            <td className={`px-4 py-3 font-semibold ${getAttendanceColor(percentage)}`}>
                              {percentage}%
                            </td>
                            <td className="px-4 py-3 w-1/4">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-blue-600 h-2.5 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </td>
                          </tr>
                          {/* Student Info & Attendance Records */}
                          <tr>
                            <td colSpan="5" className="px-4 py-3">
                              <div className="flex items-center gap-4 mb-2">
                                <img
                                  src={subject.student.imageUrl}
                                  alt="student"
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                  <p className="font-semibold text-gray-800">{subject.student.name}</p>
                                  <p className="text-sm text-gray-500">{subject.student.email}</p>
                                </div>
                              </div>
                              <ul className="pl-6 text-sm text-gray-700 list-disc">
                                {subject.records.map((rec, i) => (
                                  <li key={i}>
                                    {rec.date} at {rec.time} –{" "}
                                    <span className={rec.isPresent ? "text-green-600" : "text-red-600"}>
                                      {rec.isPresent ? "Present" : "Absent"}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAttendance;
