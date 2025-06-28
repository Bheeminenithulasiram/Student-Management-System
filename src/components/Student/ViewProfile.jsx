import React, { useState, useEffect } from "react";
import StudentSidebar from "./StudenttSidebar";
import api from "../utils/api";

const ViewProfile = () => {
  const id = JSON.parse(localStorage.getItem("data"))?.id;

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    linkedin: "",
    instagram: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`/student/student-get/${id}`);
        const data = response.data.data;
        setProfile({
          name: data.name || "",
          email: data.email || "",
          mobile: data.mobile || "",
          address: data.address || "",
          linkedin: data.linkedin || "",
          instagram: data.instagram || "",
        });
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleInputChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        linkedin: profile.linkedin,
        instagram: profile.instagram,
      };

      const response = await api.put(`/student/update-profile/${id}`, payload);

      if (response.data.status === "success" || response.data.success) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
      } else {
        throw new Error(response.data.message || "Unknown error");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Student Management System
        </h1>

        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Student Profile</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}

          {loading ? (
            <div className="text-center">Loading profile...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-gray-700 mb-1">Name</label>
                  <p className="p-2">{profile.name}</p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 mb-1">Email</label>
                  <p className="p-2">{profile.email}</p>
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-gray-700 mb-1">Mobile</label>
                  <p className="p-2">{profile.mobile}</p>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-gray-700 mb-1">Address</label>
                  <p className="p-2 whitespace-pre-line">{profile.address}</p>
                </div>

                {/* Editable Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">LinkedIn</label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="linkedin"
                        value={profile.linkedin}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="https://linkedin.com/in/username"
                      />
                    ) : (
                      <p className="p-2">{profile.linkedin || "-"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Instagram</label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="instagram"
                        value={profile.instagram}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="https://instagram.com/username"
                      />
                    ) : (
                      <p className="p-2">{profile.instagram || "-"}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                {isEditing && (
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
