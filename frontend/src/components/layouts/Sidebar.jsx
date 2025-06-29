import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../UI/Modal";
import logo from "../../assets/osca-logo.png";
import {
  HomeIcon,
  UsersIcon,
  MessageSquareIcon,
  UserCogIcon,
  SettingsIcon,
  LogOutIcon,
  FileTextIcon,
  GiftIcon,
  UserIcon,
  Wallet,
  MenuIcon,
  XIcon,
  UserCheck,
  ClipboardListIcon,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      {/* Burger menu button for small screens */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-blue-800 bg-white rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <XIcon className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Overlay for when sidebar is open on small screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar content */}
      <aside
        className={`
          bg-blue-800 text-white w-64 flex-shrink-0
          fixed inset-y-0 left-0 z-50
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:block md:shadow-none
          shadow-lg
          overflow-y-auto max-h-screen
        `}
      >
        <div className="p-6 flex flex-col items-center text-center">
          <img
            src={logo}
            alt="OSCA Logo"
            className="h-14 w-auto object-contain"
          />
          <h1 className="text-xl font-bold">
            Office of the Senior Citizen Affairs
          </h1>
          <p className="text-sm text-blue-200">San Jose, Occidental Mindoro</p>
        </div>

        <nav className="mt-6">
          {/* Dashboard Link */}
          <NavLink
            to="/admin-dashboard"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 hover:bg-blue-700 ${
                isActive ? "bg-blue-700" : ""
              }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <HomeIcon className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>

          {/* Senior Citizens Link */}
          <NavLink
            to="/admin-senior-citizen-list"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 hover:bg-blue-700 ${
                isActive ? "bg-blue-700" : ""
              }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <UsersIcon className="h-5 w-5 mr-3" />
            Senior Citizens
          </NavLink>

          {/* OSCA Officials Link */}
          <NavLink
            to="/admin-officials"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 hover:bg-blue-700 ${
                isActive ? "bg-blue-700" : ""
              }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <UserCheck className="h-5 w-5 mr-3" />
            OSCA Officials
          </NavLink>

          {/* Pension List Link */}
          <NavLink
            to="/admin-pension-list"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 hover:bg-blue-700 ${
                isActive ? "bg-blue-700" : ""
              }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <Wallet className="h-5 w-5 mr-3" />
            Pension List
          </NavLink>

          {/* Benefits Link */}
          <NavLink
            to="/admin-benefits"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 hover:bg-blue-700 ${
                isActive ? "bg-blue-700" : ""
              }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <GiftIcon className="h-5 w-5 mr-3" />
            Benefits
          </NavLink>

          {/* SMS Management Link */}
          <NavLink
            to="/admin-sms"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 hover:bg-blue-700 ${
                isActive ? "bg-blue-700" : ""
              }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <MessageSquareIcon className="h-5 w-5 mr-3" />
            SMS Management
          </NavLink>

          {/* Reports Link */}
          <NavLink
            to="/admin-reports"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 hover:bg-blue-700 ${
                isActive ? "bg-blue-700" : ""
              }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <FileTextIcon className="h-5 w-5 mr-3" />
            Reports
          </NavLink>

          {/* Audit Logs Link */}
          <NavLink
            to="/admin-audit-logs"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 hover:bg-blue-700 ${
                isActive ? "bg-blue-700" : ""
              }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <ClipboardListIcon className="h-5 w-5 mr-3" />
            Audit Logs
          </NavLink>

          {/* User Management Link */}
          <NavLink
            to="/admin-user-management"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 hover:bg-blue-700 ${
                isActive ? "bg-blue-700" : ""
              }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <UserCogIcon className="h-5 w-5 mr-3" />
            User Management
          </NavLink>

          {/* Settings Link */}
          <NavLink
            to="/admin-settings"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 hover:bg-blue-700 ${
                isActive ? "bg-blue-700" : ""
              }`
            }
            onClick={() => setIsSidebarOpen(false)}
          >
            <SettingsIcon className="h-5 w-5 mr-3" />
            Settings
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
