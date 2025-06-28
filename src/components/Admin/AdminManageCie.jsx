import React, { useState, useEffect } from 'react';
import AdminSideBar from './AdminSideBar';
import api from '../utils/api';

const AdminManageCie = () => {
  const [circulars, setCirculars] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);
  const [role, setRole] = useState('admin');

  useEffect(() => {
    const userRole = localStorage.getItem('userType') || 'admin';
    setRole(userRole);

    api.get('/admin/circular-getAll')
      .then(response => {
        const all = response.data.data;
        const filtered = userRole === 'teacher'
          ? all.filter(c => c.organization === 'Teacher')
          : all;
        setCirculars(filtered);
      })
      .catch(error => {
        console.error("Error fetching circulars:", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('localDate', date);
    formData.append('status', 'pending');
    formData.append('organization', role === 'teacher' ? 'Teacher' : 'Admin');
    if (image) formData.append('file', image);

    api.post('/admin/circular-create', formData)
      .then(res => {
        setCirculars([res.data, ...circulars]);
        setTitle('');
        setDescription('');
        setDate('');
        setImage(null);
      })
      .catch(err => {
        console.error("Error posting circular:", err);
      });
  };

  const handleStatusChange = (id, newStatus) => {
   

    api.put(`/admin/circular-update-status`, { id,status: newStatus })
      .catch(error => {
        console.error("Error updating status:", error);
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSideBar />

      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">Student Management System</h1>
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage Circulars</h1>

        {/* Add Circular Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Add New Circular</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Post Circular
            </button>
          </form>
        </div>

        {/* Circular List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {circulars.length === 0 ? (
            <div className="text-center py-12 text-gray-500 col-span-2">
              No circulars available for review
            </div>
          ) : (
            circulars.map(circular => (
              <div
                key={circular.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
              >
                {circular.fileUrl && (
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={circular.fileUrl}
                      alt={circular.title}
                      className="object-cover h-full w-full"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{circular.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {circular.organization || 'Admin'}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        circular.status
                      )}`}
                    >
                      {circular.status}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{circular.description}</p>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(circular.dateIssued || circular.localDate).toLocaleDateString()}
                    </span>

                    {/* Show buttons only if status is pending */}
                    {circular.status === 'PENDING' && (
                      <div className="space-x-3">
                        <button
                          onClick={() => handleStatusChange(circular.id, 'APPROVED')}
                          className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(circular.id, 'REJECTED')}
                          className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManageCie;
