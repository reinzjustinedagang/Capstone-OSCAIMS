import React, { useEffect, useState } from "react";
import { BellIcon, MenuIcon, UserIcon, Loader2 } from "lucide-react";
import axios from "axios";

const Header = () => {
  const [userName, setUserName] = useState("Guest");
  const [userRole, setUserRole] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Step 1: Call /me to get user ID only
      const meResponse = await axios.get(`${backendUrl}/api/me`, {
        withCredentials: true,
      });

      if (meResponse.status === 200 && meResponse.data.isAuthenticated) {
        const userId = meResponse.data.userId;

        const response = await axios.get(`${backendUrl}/api/user/${userId}`, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data.isAuthenticated) {
          const user = response.data;
          setUserName(user.userName || "Guest");
          setUserRole(user.userRole || "User");
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

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-4 py-3">
        <button className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100">
          <MenuIcon className="h-6 w-6" />
        </button>

        <div className="flex items-center space-x-4 ml-auto">
          <div className="relative">
            <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
            </button>
          </div>

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
            <div className="bg-blue-700 text-white rounded-full p-2">
              <UserIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
