import React, { useEffect, useState } from "react";
import { BellIcon, MenuIcon, UserIcon } from "lucide-react";

const Header = () => {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("username") || "Guest";
    const role = localStorage.getItem("role") || "User";
    setUserName(name);
    setUserRole(role);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-4 py-3">
        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100">
          <MenuIcon className="h-6 w-6" />
        </button>

        {/* Push everything to the right */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Notification */}
          <div className="relative">
            <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
              <BellIcon className="h-5 w-5" />
              <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex items-center">
            <div className="mr-3 text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
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
