import React, { useEffect, useState } from "react";
import WardenSidebar from "./WardenSidebar";
import api from "../utils/api";

const WardenDashboard = () => {
  // Sample data - replace with actual data from your backend
  const permissionStats = {
    totalRequests: 24,
    accepted: 18,
    rejected: 6,
  };


  const [outingRequests, setOutingRequests] = useState([]);
  const [app, setApp] = useState([]);
  const [rej, setRej] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const wardenId = 1; // You can make this dynamic if needed

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/warden/outing/pending');
      const res1 = await api.get("warden/outing/approved")
      console.log("Fetched Requests:", res.data.data);
      setOutingRequests(res.data.data || []);
      setApp(res1.data.data)
    } catch (err) {
      console.error(err);
      setMessage('Failed to load outing requests.');
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <WardenSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Student Management System
        </h1>
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Warden Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Requests Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Total Requests
            </h3>
            <p className="text-4xl font-bold text-blue-600">
              {outingRequests.length}
            </p>
          </div>

          {/* Accepted Card */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Approved
            </h3>
            <p className="text-4xl font-bold text-green-600">
              {app.length}
            </p>
          </div>

          {/* Rejected Card */}
          {/* <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Rejected
            </h3>
            <p className="text-4xl font-bold text-red-600">
              {permissionStats.rejected}
            </p>
          </div> */}
        </div>

        {/* Additional content can be added below */}
        {/* <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Recent Requests
          </h2>
        </div> */}
      </div>
    </div>
  );
};

export default WardenDashboard;
