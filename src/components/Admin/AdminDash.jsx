import React, { useState, useEffect } from "react";
import AdminSideBar from "./AdminSideBar";
import api from "../utils/api";

const AdminDash = () => {
  // State for storing data
  const [students, setStudents] = useState([]);
  console.log(students);
  
  const [teachers, setTeachers] = useState([]);
  const [wardens, setWardens] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    // Fetch students
    api.get('/teacher/student-getProfiles')
      .then(response => {
        setStudents(response.data.data);
      })
      .catch(error => {
        console.error("Error fetching students:", error);
      });

    // Fetch teachers
    api.get('/admin/teacher-getAll')
      .then(response => {
        setTeachers(response.data.data);
      })
      .catch(error => {
        console.error("Error fetching teachers:", error);
      });

    // Fetch wardens
    api.get('/admin/warden-getAll')
      .then(response => {
        setWardens(response.data.data);
      })
      .catch(error => {
        console.error("Error fetching wardens:", error);
      });

    // Fetch permissions
    api.get('/api/permissions')
      .then(response => {
        setPermissions([response.data]);
      })
      .catch(error => {
        console.error("Error fetching permissions:", error);
      });
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  // Stats card component for reusability
  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">Student Management System</h1>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-8">
          <StatCard 
            title="Total Students" 
            value={students.length} 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
            color="blue"
          />
          
          <StatCard 
            title="Total Teachers" 
            value={teachers.length} 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            color="green"
          />
          
          <StatCard 
            title="Total Wardens" 
            value={wardens.length} 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
            color="purple"
          />
          
          {/* <StatCard 
            title="Total Permissions" 
            value={permissions.length} 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            color="yellow"
          /> */}
        </div>

        {/* Permissions Status Overview
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Approved Permissions" 
            value={permissions.filter(p => p.status === "Approved").length} 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
            color="green"
          />
          
          <StatCard 
            title="Pending Permissions" 
            value={permissions.filter(p => p.status === "Pending").length} 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            color="yellow"
          />
          
          <StatCard 
            title="Rejected Permissions" 
            value={permissions.filter(p => p.status === "Rejected").length} 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
            color="red"
          />
        </div> */}

      </div>
    </div>
  );
};

export default AdminDash;
