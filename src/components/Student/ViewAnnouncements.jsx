import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import StudentSidebar from './StudenttSidebar';
import axios from 'axios';
import api from "../utils/api"

const ViewAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await api.get('/student/circular-getAll');
        setAnnouncements(res.data.data);

      } catch (err) {
        setError('Failed to fetch announcements.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar />

      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Student Management System
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Announcements</h2>

          {loading ? (
            <p className="text-gray-600">Loading announcements...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : announcements.length === 0 ? (
            <p className="text-gray-600">No announcements found</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-blue-50 border border-blue-200 rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="text-lg font-bold text-blue-900 mb-2">
                    {announcement.title}
                  </h3>
                  <p className="text-gray-700 mb-4 whitespace-pre-line">
                    {announcement.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span className="italic">
                      Posted by: <span className="font-medium">{announcement.postedBy}</span>
                    </span>
                    <span className="text-red-500">
                      {format(new Date(announcement.dateIssued), "MMM dd, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAnnouncements;
