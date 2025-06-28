import React, { useState, useEffect } from "react";
import TeaSidebar from "./TeaSidebar";
import api from "../utils/api"; // Assuming Axios is set up here

const ReqStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentRequests();
  }, []);

  const fetchStudentRequests = async () => {
    try {
      const response = await api.get("/teacher/student-getProfiles");
      setStudents(response.data.data || []);
    } catch (error) {
      console.error("Error fetching student requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStudentStatus = async (studentId, status) => {
    try {
      const formattedStatus = status.toUpperCase(); // Ensure match with backend enum
      await api.put(`/teacher/student-update-status/${studentId}?status=${status}`);
      setStudents((prev) =>
        prev.map((student) =>
          student.id === studentId ? { ...student, status: formattedStatus } : student
        )
      );
    } catch (error) {
      console.error(`Failed to ${status} student:`, error);
    }
  };
  

  const handleAccept = (id) => updateStudentStatus(id, "ACCEPTED");
  const handleReject = (id) => updateStudentStatus(id, "REJECTED");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TeaSidebar />

      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Student Management System
        </h1>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Registration Requests
        </h1>

        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : students.length === 0 ? (
          <div className="text-center text-gray-500">
            No pending student requests
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            student.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : student.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {student.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleAccept(student.id)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(student.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReqStudents;
