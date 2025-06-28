import React, { useState, useEffect } from "react";
import TeaSidebar from "./TeaSidebar";
import { FaRegUser, FaPhone, FaCheckCircle, FaEnvelope } from "react-icons/fa";
import api from "../utils/api";

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/teacher/student-getProfiles");
        setStudents(res.data.data || []);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TeaSidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Student Management System
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student Profiles</h2>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center text-gray-500">No students found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition-all duration-200"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    className="h-16 w-16 rounded-full object-cover border"
                    src={student.imageUrl || "https://via.placeholder.com/150"}
                    alt={student.name}
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.status}</p>
                  </div>
                </div>

                <div className="text-sm text-gray-700 space-y-2">
                  <p className="flex items-center">
                    <FaEnvelope className="mr-2 text-gray-500" />
                    {student.email}
                  </p>
                  <p className="flex items-center">
                    <FaPhone className="mr-2 text-gray-500" />
                    {student.mobile}
                  </p>
                  <p className="flex items-center">
                    <FaCheckCircle className="mr-2 text-gray-500" />
                    Enrolled on:{" "}
                    <span className="ml-1 text-gray-800 font-medium">
                      {student.enrollmentDate}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStudents;
