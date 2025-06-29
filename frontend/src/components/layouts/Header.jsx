import React, { useEffect, useState } from "react";
import { BellIcon, MenuIcon, UserIcon, Loader2, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Modal from "../UI/Modal";
import axios from "axios";

const Header = () => {
  const [userName, setUserName] = useState("Guest");
  const [userRole, setUserRole] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: Call /me to get user ID only
      const meResponse = await axios.get(`${backendUrl}/api/user/me`, {
        withCredentials: true,
      });

      if (meResponse.status === 200 && meResponse.data.isAuthenticated) {
        const userId = meResponse.data.id;

        const response = await axios.get(
          `${backendUrl}/api/user/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200 && response.data.isAuthenticated) {
          const user = response.data;
          setUserName(user.username || "Guest");
          setUserRole(user.role || "User");
        } else {
          setUserName("Guest");
          setUserRole("User");
        }
      }
    } catch (err) {
      console.error("Failed to fetch user data for header:", err);
      setError("Failed to load user info.");
      setUserName("Guest");
      setUserRole("User");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();

    // Listen for profile update events to refetch user info
    const handleProfileUpdate = () => {
      fetchUserData();
    };
    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, [backendUrl]);

  const handleLogout = async () => {
    try {
      const backendUrl = import.meta.env.VITE_API_BASE_URL;
      await axios.post(
        `${backendUrl}/api/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Always clear localStorage and navigate away
      // sessionStorage.removeItem("id");
      // sessionStorage.removeItem("user");
      localStorage.clear();
      navigate("/login");
      // Close sidebar and confirmation dialog
      setIsSidebarOpen(false);
      setShowLogoutConfirm(false);
    }
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-4 py-3">
        <button className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100">
          <MenuIcon className="h-6 w-6" />
        </button>

        <div className="flex items-center space-x-4 ml-auto">
          <NavLink
            to="/admin-notifications"
            className={({ isActive }) =>
              `relative inline-block ${
                isActive ? "bg-blue-200 rounded-full" : ""
              }`
            }
          >
            <div className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 transition duration-150">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-1 right-1 bg-red-500 border-2 border-white rounded-full w-2.5 h-2.5"></span>
            </div>
          </NavLink>

          <div className="flex items-center">
            <div className="mr-3 text-right hidden sm:block">
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 text-gray-400 mx-auto" />
              ) : error ? (
                <p className="text-sm font-medium text-red-500">Error</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-gray-700">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                </>
              )}
            </div>
            <div
              className="relative flex items-center group"
              onMouseEnter={() => setShowLogout(true)}
              onMouseLeave={() => setShowLogout(false)}
            >
              <div
                onClick={() => navigate("/admin-my-profile")}
                className="bg-blue-700 text-white rounded-full p-2 cursor-pointer transition-all duration-800"
              >
                <UserIcon className="h-5 w-5" />
              </div>

              <div
                className={`overflow-hidden transition-all duration-800 ease-in-out ml-1 ${
                  showLogout ? "w-[100px] opacity-100" : "w-0 opacity-0"
                }`}
              >
                <button
                  onClick={confirmLogout}
                  className="cursor-pointer flex items-center gap-1 bg-white border border-gray-300 text-sm text-red-600 px-2 py-1 rounded-r-md hover:bg-red-50 w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Logout Confirmation Modal using your Modal component */}
      <Modal
        isOpen={showLogoutConfirm}
        onClose={cancelLogout}
        title="Confirm Logout"
      >
        <div className="py-4">
          <p className="text-gray-700 mb-6">
            Are you sure you want to log out?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Yes, Logout
            </button>
            <button
              onClick={cancelLogout}
              className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </header>
  );
};

export default Header;
