import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "./StudenttSidebar";
import api from "../utils/api";

const ApplyOuting = () => {
  const id = JSON.parse(localStorage.getItem("data"))?.id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: id,
    wardenId: "",
    outingReason: "",
    startDate: "",
    endDate: "",
  });

  const [wardens, setWardens] = useState([]);
  const [outingData, setOutingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchWardens();
    fetchOutings();
  }, []);

  const fetchWardens = async () => {
    try {
      const response = await api.get("/admin/warden-getAll");
      setWardens(response.data.data); // Adjust if structure differs
    } catch (error) {
      console.error("Failed to fetch wardens:", error);
    }
  };

  const fetchOutings = async () => {
    try {
      const response = await api.get(`/student/outing/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOutingData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch outings:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const { studentId, wardenId, outingReason, startDate, endDate } = formData;

    if (!wardenId || !outingReason || !startDate || !endDate) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("End date cannot be before start date");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(
        "/student/outing/request",
        {
          studentId,
          wardenId,
          reason: outingReason,
          dateFrom: startDate,
          dateTo: endDate,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status === "success") {
        setSuccess("Outing request submitted successfully!");
        setFormData({
          studentId: id,
          wardenId: "",
          outingReason: "",
          startDate: "",
          endDate: "",
        });
        fetchOutings(); // Refresh history
      } else {
        setError(response.data.message || "Failed to submit outing request");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <StudentSidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Student Management System
        </h1>

        {/* Outing Request Form */}
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Apply for Outing
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Reason for Outing *
              </label>
              <textarea
                name="outingReason"
                value={formData.outingReason}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="4"
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Select Warden *</label>
              <select
                name="wardenId"
                value={formData.wardenId}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">-- Select Warden --</option>
                {wardens.map((warden) => (
                  <option key={warden.id} value={warden.id}>
                    {warden.name} ({warden.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Start Date *</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">End Date *</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  min={formData.startDate || new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </div>

        {/* Outing History */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Outing History</h2>

          {outingData.length === 0 ? (
            <p className="text-gray-600">No outing requests found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="py-2 px-4 text-left">Reason</th>
                    <th className="py-2 px-4 text-left">From</th>
                    <th className="py-2 px-4 text-left">To</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {outingData.map((outing, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="py-2 px-4">{outing.reason}</td>
                      <td className="py-2 px-4">
                        {new Date(outing.dateFrom).toLocaleString()}
                      </td>
                      <td className="py-2 px-4">
                        {new Date(outing.dateTo).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 capitalize">
                        {outing.status || "Pending"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyOuting;
