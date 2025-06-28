import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import TeaSidebar from './TeaSidebar';
import api from '../utils/api'; // axios instance

const Circulars = () => {
  const [circulars, setCirculars] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // toggle based on role

  useEffect(() => {
    const fetchCirculars = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/teacher/circular-getAll');
        setCirculars(res.data.data || []);
      } catch (err) {
        console.error('Error fetching circulars:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCirculars();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', content);
    if (file) formData.append('file', file);

    try {
      const res = await api.post('/teacher/circular-create', formData);
      const newCircular = res.data.data;
      setCirculars([newCircular, ...circulars]);
      setTitle('');
      setContent('');
      setFile(null);
    } catch (err) {
      console.error('Error creating circular:', err);
      alert('Failed to submit circular.');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.put(`/admin/circular-status-update/${id}`, { status: newStatus });
      setCirculars((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Could not update circular status.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <TeaSidebar />

      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Student Management System
        </h1>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Announcements & Circulars
        </h1>

        {!isAdmin && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Circular' : 'Create New Circular'}
            </h2>
            <form onSubmit={handleSubmit}>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Attach File</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full p-2 border border-gray-300 rounded-md bg-white"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingId ? 'Update Circular' : 'Submit Circular'}
              </button>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : circulars.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No circulars found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {circulars.map((circular) => (
              <div
                key={circular.id}
                className="bg-white shadow-md rounded-lg p-5 border-l-4 hover:shadow-lg transition-all duration-200
                  ${
                    circular.status === 'approved'
                      ? 'border-green-500'
                      : circular.status === 'rejected'
                      ? 'border-red-500'
                      : 'border-yellow-500'
                  }"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{circular.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {circular.author || 'Teacher'}, {circular.dateIssued}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(circular.status)}`}>
                    {circular.status || 'pending'}
                  </span>
                </div>
          
                <div className="text-sm text-gray-700 mb-3">
                  {expandedId === circular.id ? (
                    <p className="whitespace-pre-line">{circular.description || circular.content}</p>
                  ) : (
                    <p className="line-clamp-3">{circular.description || circular.content}</p>
                  )}
                  <button
                    onClick={() => setExpandedId(expandedId === circular.id ? null : circular.id)}
                    className="text-blue-600 text-xs mt-1 hover:underline"
                  >
                    {expandedId === circular.id ? 'Show less' : 'Read more'}
                  </button>
                </div>
          
                {circular.fileUrl && (
                  <div className="mb-3">
                    {/\.(jpg|jpeg|png)$/i.test(circular.fileUrl) ? (
                      <img
                        src={circular.fileUrl}
                        alt="Attachment"
                        className="w-full h-40 object-cover rounded-md border"
                      />
                    ) : (
                      <a
                        href={circular.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-blue-500 text-sm hover:underline"
                      >
                        📄 View Attached File
                      </a>
                    )}
                  </div>
                )}
          
                {isAdmin && (
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleUpdateStatus(circular.id, 'approved')}
                      className={`text-xs px-3 py-1 rounded-md ${
                        circular.status === 'approved'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                      disabled={circular.status === 'approved'}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(circular.id, 'rejected')}
                      className={`text-xs px-3 py-1 rounded-md ${
                        circular.status === 'rejected'
                          ? 'bg-red-200 text-red-800'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                      disabled={circular.status === 'rejected'}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(circular.id, 'pending')}
                      className={`text-xs px-3 py-1 rounded-md ${
                        circular.status === 'pending'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                      }`}
                      disabled={circular.status === 'pending'}
                    >
                      Pending
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          
            
          )}
        </div>
      </div>
    </div>
  );
};

export default Circulars;
