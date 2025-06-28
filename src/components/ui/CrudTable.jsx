import { useState, useEffect, useCallback } from "react";
import axios from "../utils/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

/**
 * @param {Array<{key:string,key:string}>} columns - Array of objects with `key` and `label` properties
 * @param {Array<{ key:string,label:string,type:string,options:[],hidden:boolean}>} formFields - Array of objects with `key`, `label`, `type`, and `options` properties
 * @param {string} baseUrl - Base URL for the CRUD operations
 * @param {number | undefined} numColumnsPerRow - Number of columns per row in the form
 * @param {string | undefined} role - Role for the user
 * @param {Array<{icon:string,path:Function | string}> | undefined} extraActions - Array of objects with `path` and `icon` properties
 * @param {boolean | undefined} canEdit - Boolean to enable/disable edit action
 * @param {boolean | undefined} canDelete - Boolean to enable/disable delete action
 * @param {boolean | undefined} canAdd - Boolean to enable/disable add action
 * @returns
 */
const CrudTable = ({
  columns = [],
  formFields = [],
  baseUrl = "",
  numColumnsPerRow = 2,
  role = "",
  extraActions = [],
  canEdit = true,
  canDelete = true,
  canAdd = true,
}) => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(5);

  if (!columns || !formFields || !baseUrl) {
    throw new Error("columns, formFields, and baseUrl are required");
  }

  // Fetch data with pagination
  const fetchData = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        // Use the URL API to construct the URL with proper query parameters
        const url = new URL(axios.defaults.baseURL + baseUrl);

        // Add or update the query parameters
        url.searchParams.set("page", page);
        url.searchParams.set("limit", limit);

        const response = await axios.get(url.toString());

        setData(response.data.data);
        setHasNext(response.data.hasNext);
        setHasPrev(response.data.hasPrev);
        setCurrentPage(page);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    },
    [limit, baseUrl]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = new URL(axios.defaults.baseURL + baseUrl);

      if (isEditing) {
        // Edit API call: Append `id` to the base URL
        const editUrl = new URL(`${url.pathname}/${formData._id}`, url.origin);

        if (url.search) {
          editUrl.search = url.search; // Preserve query parameters if any
        }

        await axios.put(editUrl.toString(), { ...formData, role });
        toast.success("Data updated successfully");
      } else {
        // Add API call: Use the base URL directly
        await axios.post(url.toString(), { ...formData, role });
        toast.success("Data added successfully");
      }

      fetchData(currentPage); // Refresh data after operation
    } catch (error) {
      console.error("Failed to submit data:", error);
      toast.error(
        error.response.data.msg || "An error occurred while submitting the form"
      );
    } finally {
      setLoading(false);
      setIsFormOpen(false);
      setFormData({});
      setIsEditing(false);
    }
  };

  // Handle edit action
  const handleEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  // Handle delete action
  const handleDelete = async (id) => {
    setLoading(true);

    try {
      const url = new URL(axios.defaults.baseURL + baseUrl);
      const deleteUrl = new URL(`${url.pathname}/${id}`, url.origin);

      if (url.search) {
        deleteUrl.search = url.search; // Preserve query parameters if any
      }

      if (role) {
        await axios.delete(deleteUrl.toString(), {
          data: {
            role,
          },
        });
      } else {
        await axios.delete(deleteUrl.toString());
      }
      toast.success("Data deleted successfully");
      fetchData(currentPage); // Refresh data after deletion
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error("An error occurred while deleting the item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Add Button and Limit Selector */}
      <div className="flex justify-between items-center mb-4">
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          {[5, 10, 15, 20].map((value) => (
            <option key={value} value={value}>
              {value} per page
            </option>
          ))}
        </select>
        {canAdd && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add New
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center p-4">
                  <div className="loader"></div>
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {item[column.key]}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {canEdit && (
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        ✏️
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️
                      </button>
                    )}
                    {extraActions.map((action, index) => (
                      <Link
                        key={index}
                        to={
                          typeof action.path === "function"
                            ? action.path(item._id)
                            : action.path
                        }
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        {action.icon || action.label}
                      </Link>
                    ))}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-2 mt-4">
        <button
          onClick={() => fetchData(currentPage - 1)}
          disabled={!hasPrev}
          className={`px-4 py-2 rounded-md ${
            hasPrev ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => fetchData(currentPage + 1)}
          disabled={!hasNext}
          className={`px-4 py-2 rounded-md ${
            hasNext ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          Next
        </button>
      </div>

      {/* Form for Add/Edit */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Item" : "Add New Item"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className={`grid grid-cols-${numColumnsPerRow} gap-4`}>
                {formFields.map((field, index) => (
                  <div
                    key={index}
                    className="mb-4"
                    hidden={field.hidden || false}
                  >
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    {field.type === "dropdown" ? (
                      <select
                        name={field.key}
                        value={formData[field.key] || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select an option</option>
                        {field.options.map((option, i) => (
                          <option key={i} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "file" ? (
                      <input
                        type="file"
                        name={field.key}
                        onChange={handleFileChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.key}
                        value={formData[field.key] || field.value || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 hidden:disabled"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  {isEditing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudTable;
