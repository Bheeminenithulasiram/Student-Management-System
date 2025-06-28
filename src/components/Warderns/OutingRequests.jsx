import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WardenSidebar from './WardenSidebar';
import { FaCheck, FaTimes } from 'react-icons/fa';
import api from '../utils/api';

const OutingRequests = () => {
  const [outingRequests, setOutingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const wardenId = 1; // Optional: get from login/session

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/warden/outing/pending');
      setOutingRequests(res.data.data || []);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load outing requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (outingId, status) => {
    if (!outingId) {
      setMessage('Invalid outing ID');
      return;
    }
    try {
      await api.put(`/warden/outing/approve-reject/${outingId}?wardenId=${wardenId}&status=${status}`
      );
      setMessage(`Request ${status.toLowerCase()} successfully`);
      fetchRequests();
    } catch (err) {
      console.error(err);
      setMessage('Failed to update request status.');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <WardenSidebar />

      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-4 text-center">
          Student Management System
        </h1>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Outing Requests</h2>

        {message && (
          <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
            {message}
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Outing Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Return Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {outingRequests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No pending requests.
                    </td>
                  </tr>
                ) : (
                  outingRequests.map((request) => (
                    <tr key={request.outingId}>
                      <td className="px-6 py-4">{request.studentName}</td>
                      <td className="px-6 py-4">{new Date(request.dateFrom).toLocaleString()}</td>
                      <td className="px-6 py-4">{new Date(request.dateTo).toLocaleString()}</td>
                      <td className="px-6 py-4">{request.reason}</td>
                      <td className="px-6 py-4">{request.status}</td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleStatusChange(request.outingId, 'Approved')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <FaCheck className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(request.outingId, 'Rejected')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTimes className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutingRequests;
