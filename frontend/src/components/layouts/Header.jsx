import React, { useEffect, useState } from "react";
import {
  BellIcon,
  MenuIcon,
  UserIcon,
  Loader2,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Modal from "../UI/Modal";
import axios from "axios";

const Header = () => {
  const [profilePicture, setProfilePicture] = useState();
  const [userName, setUserName] = useState("Guest");
  const [userRole, setUserRole] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const backendUrl = import.meta.env.VITE_API_BASE_URL;
  const isProfilePage = location.pathname === "/admin/my-profile";

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
          setProfilePicture(user.image);
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
    <header className="bg-white border-b border-gray-200">
      <div className="flex justify-between items-center px-4 py-3">
        <button className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 mr-3">
          <MenuIcon className="h-6 w-6" />
        </button>
        {/* Page Title */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {location.pathname
              .split("/")
              .pop()
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </h1>
        </div>

        <div className="flex items-center space-x-4 ml-auto">
          <NavLink
            to="/admin/notifications"
            className={({ isActive }) =>
              `relative p-2 rounded-full transition duration-150 ${
                isActive
                  ? "bg-blue-100 text-blue-700 ring-2 ring-blue-500"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute top-1 right-1 bg-red-500 border-2 border-white rounded-full w-2.5 h-2.5"></span>
          </NavLink>

          <div className="flex items-center">
            <div className="mr-3 text-right hidden sm:block">
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 text-gray-400 mx-auto" />
              ) : error ? (
                <p className="text-sm font-medium text-red-500">Error</p>
              ) : (
                <>
                  <p className="text-sm font-medium text-blue-800">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                </>
              )}
            </div>
            <div className="relative flex items-center">
              <button
                onClick={() => setShowLogout(!showLogout)}
                className="h-10 w-10 rounded-full overflow-hidden border-2 border-blue-800 focus:outline-none"
                aria-label="Toggle profile menu"
              >
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-blue-200 w-full h-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-blue-800" />
                  </div>
                )}
              </button>

              {/* Dropdown Menu */}
              {showLogout && (
                <div className="absolute top-13 right-0 bg-white border border-gray-200 rounded-md shadow-md w-44 z-50">
                  <button
                    onClick={() => {
                      navigate("/admin/my-profile");
                      setShowLogout(false);
                    }}
                    className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left
    ${
      isProfilePage
        ? "bg-blue-700 text-white"
        : "text-blue-700 hover:bg-blue-700 hover:text-white hover:font-semibold"
    }`}
                  >
                    <UserIcon className="h-4 w-4" />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      setShowLogout(false);
                      confirmLogout();
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-700 hover:font-semibold hover:bg-red-700 hover:text-white text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
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
