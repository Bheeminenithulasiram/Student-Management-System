import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { HiUsers, HiCalendar, HiClipboardList } from "react-icons/hi";
import TeaSidebar from "./TeaSidebar";
import api from "../utils/api";

ChartJS.register(ArcElement, Tooltip, Legend);

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentRes = await api.get("/teacher/student-getProfiles");
        const announceRes = await api.get("/teacher/circular-getAll");

  

        setStudents(studentRes.data.data || []);
        setAnnouncements(announceRes.data.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: ["Present", "Absent", "Leave"],
    datasets: [
      {
        label: "Student Attendance",
        data: [85, 10, 5],
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(255, 206, 86, 0.7)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pendingStu = students.filter(a=>  a.status === "PENDING");
  console.log(pendingStu);
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TeaSidebar />

      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Student Management System
        </h1>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Teacher Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <HiUsers className="text-2xl text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full mr-4">
                <HiClipboardList className="text-2xl text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-500">Pending Students</p>
                <p className="text-2xl font-bold">{pendingStu.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <HiCalendar className="mr-2 text-blue-600" />
              Recent Announcements
            </h2>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="border-b pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{announcement.title}</h3>
                    <span className="text-sm text-gray-500">
                      {announcement.dateIssued}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {announcement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
