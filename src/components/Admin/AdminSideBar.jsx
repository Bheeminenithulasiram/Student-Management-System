import React from "react";
import {
  ChartBarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  MegaphoneIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminSideBar = () => {
  const sidebarItems = [
    { name: "Dashboard", icon: ChartBarIcon, path: "/admin/dashboard" },
    { name: "Manage Teachers", icon: UserGroupIcon, path: "/admin/manageteachers" },
    { name: "Manage Warden", icon: BuildingOfficeIcon, path: "/admin/managewardans" },
    { name: "Manage Circulars", icon: MegaphoneIcon, path: "/admin/authcirculars" },
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userType");
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="w-64 bg-white shadow-lg h-screen p-6 border-r border-gray-200 fixed flex flex-col">
      {/* Sidebar Header */}
      <div className="flex items-center justify-center mb-10">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-extrabold text-gray-800">Admin Portal</span>
        </div>
      </div>

      {/* Sidebar Links */}
      <div className="flex-1 overflow-y-auto">
        <nav className="flex flex-col space-y-2">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition-all font-medium ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`
              }
            >
              <item.icon className="h-6 w-6 mr-3" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="pt-6">
        <button
          onClick={handleLogout}
          className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-600 transition-all w-full"
        >
          <LockClosedIcon className="h-6 w-6 mr-3" />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSideBar;
