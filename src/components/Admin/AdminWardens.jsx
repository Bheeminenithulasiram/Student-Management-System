import React, { useState, useEffect } from 'react';
import AdminSideBar from './AdminSideBar';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AdminWardens = () => {
  const [wardens, setWardens] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    photo: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewWarden, setViewWarden] = useState(null);

  // Fetch wardens from the API
  useEffect(() => {
    const fetchWardens = async () => {
      try {
        const response = await api.get('/admin/warden-getAll');
        setWardens(response.data.data);
      } catch (error) {
        console.error('Error fetching wardens:', error);
      }
    };

    fetchWardens();
  }, [wardens]);

  // Handle form field change
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle form submit (add or edit warden)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = { ...formData };

    const formDataObj = new FormData();
    formDataObj.append('name', formPayload.name);
    formDataObj.append('email', formPayload.email);
    formDataObj.append('password', formPayload.password);
    formDataObj.append('mobile', formPayload.mobile);
    formDataObj.append('address', formPayload.address);
    if (formPayload.photo) formDataObj.append('file', formPayload.photo);

    try {

      // Register new warden
      const response = await api.post('/admin/warden-register', formDataObj);
      setWardens([...wardens, response.data]);
      toast.success("Warden Added!")

      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving warden data:', error);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      mobile: '',
      photo: null,
    });
  };



  // Handle delete action
  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/warden-delete/${id}`);
      toast.success("Deleted Successfully!")
    } catch (error) {
      console.error('Error deleting warden:', error);
    }
  };

  // View warden details in a modal
  const handleView = (warden) => {
    setViewWarden(warden);
  };

  // Close modal
  const closeModal = () => {
    setViewWarden(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-2xl font-bold mb-4">Wardens Management</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600"
        >
          {showForm ? 'Close Form' : 'Add Warden'}
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
              {editingId ? 'Update Warden' : 'Add Warden'}
            </button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Profile</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Mobile</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {wardens.map((warden) => (
                <tr key={warden.id} className="hover:bg-gray-100">
                  <td className='flex justify-center p-2'><img src={warden.imageUrl} alt="" className='h-10 w-10 rounded-xl' /></td>
                  <td className="border p-2">{warden.name}</td>
                  <td className="border p-2">{warden.email}</td>
                  <td className="border p-2">{warden.mobile}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleView(warden)}
                      className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleDelete(warden.id)}
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

        {viewWarden && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Warden Details</h2>
              <p><strong>Name:</strong> {viewWarden.name}</p>
              <p><strong>Email:</strong> {viewWarden.email}</p>
              <p><strong>Mobile:</strong> {viewWarden.mobile}</p>
              <p><strong>Address:</strong> {viewWarden.address}</p>
              {viewWarden.imageUrl && (
                <img className='m-auto p-5' src={viewWarden.imageUrl} alt="" />
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

export default AdminWardens;
