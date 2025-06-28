import React, { useState, useEffect } from 'react';
import AdminSideBar from './AdminSideBar';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    subject: '',
    photo: null,
    address: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewTeacher, setViewTeacher] = useState(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get('/admin/teacher-getAll');
        setTeachers(response.data.data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = { ...formData };

    const formDataObj = new FormData();
    formDataObj.append('name', formPayload.name);
    formDataObj.append('email', formPayload.email);
    formDataObj.append('password', formPayload.password);
    formDataObj.append('mobile', formPayload.mobile);
    formDataObj.append('subject', formPayload.subject);
    if (formPayload.photo) formDataObj.append('file', formPayload.photo);

    try {
      if (editingId) {
        await api.put(`/api/teachers/edit/${editingId}`, formDataObj);
        setTeachers(teachers.map((teacher) => (teacher.id === editingId ? formPayload : teacher)));
        setEditingId(null);
      } else {
        const response = await api.post('/admin/teacher-register', formDataObj);
        setTeachers([...teachers, response.data]);
      }
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving teacher data:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      mobile: '',
      subject: '',
      photo: null,
      address: '',
    });
  };

  
  

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/teacher-delete/${id}`);
      toast.success('Deleted Successfully!');
      setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const handleView = (teacher) => {
    setViewTeacher(teacher);
  };

  const closeModal = () => {
    setViewTeacher(null);
  };


 
 
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSideBar />

      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">Student Management System</h1>
        <h1 className="text-2xl font-bold mb-4">Teachers Management</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
        >
          {showForm ? 'Close Form' : 'Add Teacher'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-100 rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Mobile</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Photo</label>
                <input
                  type="file"
                  name="photo"
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {editingId ? 'Update Teacher' : 'Add Teacher'}
            </button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th>Profile</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Mobile</th>
                <th className="border p-2">Subject</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-100">
                  <td className="flex justify-center p-2">
                    <img src={teacher.imageUrl} alt="" className="h-10 w-10 rounded-xl" />
                  </td>
                  <td className="border p-2">{teacher.name}</td>
                  <td className="border p-2">{teacher.email}</td>
                  <td className="border p-2">{teacher.mobile}</td>
                  <td className="border p-2">{teacher.subject}</td>
                  <td className="border p-2 flex justify-center">
                    <button
                      onClick={() => handleView(teacher)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(teacher.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {viewTeacher && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Teacher Details</h2>
              <p className="p-2"><strong>Name:</strong> {viewTeacher.name}</p>
              <p className="p-2"><strong>Email:</strong> {viewTeacher.email}</p>
              <p className="p-2"><strong>Mobile:</strong> {viewTeacher.mobile}</p>
              <p className="p-2"><strong>Subject:</strong> {viewTeacher.subject}</p>
              {viewTeacher.imageUrl && (
                <img className="m-auto p-5" src={viewTeacher.imageUrl} alt="Teacher" />
              )}
              <button
                onClick={closeModal}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTeachers;
