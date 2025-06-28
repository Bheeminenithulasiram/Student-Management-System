// components/StudentDashboard.js
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes, FaBullhorn, FaChartBar, FaCalendarAlt } from 'react-icons/fa';
import StudentSidebar from './StudenttSidebar';
import { useState } from 'react';

const StudentDashboard = () => {
  const navigate = useNavigate();

  // Sample data - replace with actual data from API
  const [dashboardData] = useState({
    circulars: 5,
    subjects: 6,
    attendance: 85.5,
    outingRequests: {
      total: 8,
      approved: 5,
      pending: 2,
      rejected: 1
    },
    recentCirculars: [
      { id: 1, title: 'Exam Schedule Update', date: '2023-08-20' },
      { id: 2, title: 'Hostel Rules Revision', date: '2023-08-18' }
    ],
    recentOutings: [
      { id: 1, date: '2023-08-22', status: 'Approved' },
      { id: 2, date: '2023-08-23', status: 'Pending' }
    ],
    attendanceDetails: [
      { subject: 'Mathematics', present: 45, total: 50 },
      { subject: 'Physics', present: 42, total: 50 },
      { subject: 'Chemistry', present: 48, total: 50 }
    ]
  });

  const handleLogout = () => {
    // Add logout logic
    navigate('/');
  };

  const handleOutingRequest = () => {
    navigate('/dashboard/outing');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Student Management System
        </h1>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Circulars Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Circulars/Announcements</h3>
                <p className="text-4xl font-bold text-blue-600">{dashboardData.circulars}</p>
              </div>
              <FaBullhorn className="w-12 h-12 text-blue-400" />
            </div>
            <Link to="/dashboard/circulars" className="text-blue-600 hover:underline mt-4 block">
              View All Circulars
            </Link>
          </div>

          {/* Attendance Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Subjects</h3>
                <p className="text-4xl font-bold text-green-600">{dashboardData.subjects}</p>
              </div>
              <FaChartBar className="w-12 h-12 text-green-400" />
            </div>
            <p className="text-gray-600 mt-2">Overall Attendance: {dashboardData.attendance}%</p>
          </div>

          {/* Outing Requests Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Outing Requests</h3>
                <p className="text-4xl font-bold text-purple-600">{dashboardData.outingRequests.total}</p>
              </div>
              <FaCalendarAlt className="w-12 h-12 text-purple-400" />
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-green-600">✓ {dashboardData.outingRequests.approved}</span>
              <span className="text-yellow-600">⏳ {dashboardData.outingRequests.pending}</span>
              <span className="text-red-600">✗ {dashboardData.outingRequests.rejected}</span>
            </div>
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Circulars */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FaBullhorn className="mr-2 text-blue-500" />
              Recent Announcements
            </h3>
            <div className="space-y-4">
              {dashboardData.recentCirculars.map(circular => (
                <div key={circular.id} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{circular.title}</h4>
                      <p className="text-sm text-gray-500">{circular.date}</p>
                    </div>
                    <Link to={`/dashboard/circulars/${circular.id}`} className="text-blue-600 hover:underline">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Outing Requests */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-purple-500" />
              Recent Outing Requests
            </h3>
            <div className="space-y-4">
              {dashboardData.recentOutings.map(outing => (
                <div key={outing.id} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{outing.date}</h4>
                      <span className={`text-sm ${
                        outing.status === 'Approved' ? 'text-green-600' :
                        outing.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {outing.status}
                      </span>
                    </div>
                    <button 
                      onClick={() => navigate(`/dashboard/outing/${outing.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleOutingRequest}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Apply New Outing Request
            </button>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default StudentDashboard;