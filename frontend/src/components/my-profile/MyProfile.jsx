import React, { useState, useEffect } from "react";
import {
  UserCircle,
  SaveIcon,
  Loader2,
  CheckCircle,
  XCircle,
  MailIcon,
  PhoneCallIcon,
  UserCheck,
  Clock,
  UploadCloud,
  KeyRound,
} from "lucide-react";
import Button from "../UI/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

export default function MyProfile() {
  // State for user data, initialized to null
  const [userData, setUserData] = useState(null);

  // State for editable profile fields, initialized as empty
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  // State for password change fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // State for loading, error, and success messages
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [fetchLoading, setFetchLoading] = useState(true); // New state for initial data fetch
  const [fetchError, setFetchError] = useState(""); // New state for initial data fetch error

  const navigate = useNavigate(); // Initialize useNavigate
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  // --- Fetch User Data on Component Mount ---
  useEffect(() => {
    const fetchUserData = async () => {
      const userId = sessionStorage.getItem("id");
      if (!userId) {
        setFetchError("User ID not found. Please log in.");
        return;
      }

      setFetchLoading(true);
      setFetchError("");
      try {
        // Use the /me endpoint to get the currently authenticated user's data
        const response = await axios.get(`${backendUrl}/api/user/${userId}`, {
          withCredentials: true, // Essential for sending session cookies
        });

        if (response.status === 200 && response.data.isAuthenticated) {
          const fetchedData = {
            id: response.data.userId,
            fullName: response.data.userName,
            email: response.data.userEmail,
            contactNumber: response.data.userNumber,
            role: response.data.userRole,
            lastLogout: response.data.lastLogout,
          };
          setUserData(fetchedData);
          setFullName(fetchedData.fullName || "");
          setEmail(fetchedData.email || "");
          setContactNumber(fetchedData.contactNumber || "");
        } else {
          // If not authenticated or data is missing, redirect to login
          setFetchError("Not authenticated. Please log in.");
          navigate("/login"); // Redirect to your login page
        }
      } catch (err) {
        console.error("User data fetch error:", err);
        // If the API call fails (e.g., 401 Unauthorized), it means the session is invalid
        if (err.response && err.response.status === 401) {
          setFetchError(
            "Session expired or not logged in. Please log in again."
          );
          navigate("/login"); // Redirect to login on authentication failure
        } else {
          setFetchError(
            err.response?.data?.message ||
              "An error occurred while fetching user data."
          );
        }
      } finally {
        setFetchLoading(false);
      }
    };

    fetchUserData();
  }, [backendUrl, navigate]); // Add backendUrl and navigate to dependency array

  // Handler for saving profile information
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError("");
    setProfileSuccess("");

    if (!fullName || !email || !contactNumber) {
      setProfileError("All fields are required.");
      setProfileLoading(false);
      return;
    }

    if (!userData || !userData.id) {
      setProfileError("User ID not available. Please log in again.");
      setProfileLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `${backendUrl}/api/update/${userData.id}`,
        {
          fullName,
          email,
          contactNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // Update local state with new data
        setUserData((prev) => ({ ...prev, fullName, email, contactNumber }));
        // Inside your profile update handler, after a successful update:
        window.dispatchEvent(new Event("profileUpdated"));

        setProfileSuccess("Profile updated successfully!");
      } else {
        setProfileError("Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setProfileError(
        err.response?.data?.message ||
          "An error occurred during profile update."
      );
      if (err.response && err.response.status === 401) {
        navigate("/login"); // Redirect if session expires during an action
      }
    } finally {
      setProfileLoading(false);
    }
  };

  // Handler for changing password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordError("All password fields are required.");
      setPasswordLoading(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      setPasswordLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      setPasswordLoading(false);
      return;
    }

    if (!userData || !userData.id) {
      setPasswordError("User ID not available. Please log in again.");
      setPasswordLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `${backendUrl}/api/change-password/${userData.id}`, // Corrected path based on your backend
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setPasswordSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setPasswordError(
          "Failed to change password. Current password might be incorrect."
        );
      }
    } catch (err) {
      console.error("Password change error:", err);
      setPasswordError(
        err.response?.data?.message ||
          "An error occurred during password change."
      );
      if (err.response && err.response.status === 401) {
        navigate("/login"); // Redirect if session expires during an action
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handler for profile picture upload (mock for now)
  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({ ...prev, profilePicture: reader.result }));
        setProfileSuccess("Profile picture updated!");
        // In a real app, you'd send this file to your backend
        // and update the user's profilePicture URL in the database.
        // E.g., axios.post(`${backendUrl}/api/upload-profile-picture/${userData.id}`, formData);
      };
      reader.readAsDataURL(file);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700">
        <Loader2 className="animate-spin h-8 w-8 mr-2" /> Loading profile...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-700 p-4 text-center">
        <XCircle className="h-8 w-8 mb-2" />
        <p>{fetchError}</p>
        <Button onClick={() => navigate("/login")} className="mt-4">
          Go to Login
        </Button>
      </div>
    );
  }

  // Render the profile page only if userData is available
  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700">
        No user data available after loading. This should not happen if login is
        successful.
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen rounded-lg font-inter p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b pb-6 mb-6">
          {/* Profile Picture Section */}
          <div className="relative group">
            <img
              src={userData.profilePicture || "/default-profile.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 group-hover:border-blue-400 transition-colors duration-300"
            />
            <label
              htmlFor="profile-picture-upload"
              className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-md hover:bg-blue-700"
              title="Change profile picture"
            >
              <UploadCloud className="h-5 w-5" />
              <input
                id="profile-picture-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePictureUpload}
              />
            </label>
          </div>

          {/* User Basic Info */}
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-semibold text-gray-900">
              {userData.fullName}
            </h2>
            <p className="text-md text-gray-600 flex items-center justify-center sm:justify-start mt-1">
              <UserCheck className="h-4 w-4 mr-2 text-blue-500" />
              <span className="capitalize">{userData.role || "User"}</span>
            </p>
            <p className="text-md text-gray-600 flex items-center justify-center sm:justify-start mt-1">
              <MailIcon className="h-4 w-4 mr-2 text-gray-500" />
              {userData.email}
            </p>
            <p className="text-md text-gray-600 flex items-center justify-center sm:justify-start mt-1">
              <PhoneCallIcon className="h-4 w-4 mr-2 text-gray-500" />
              {userData.contactNumber}
            </p>
            <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start mt-2">
              <Clock className="h-4 w-4 mr-2 text-gray-400" />
              Last Logout:{" "}
              {userData.lastLogout
                ? new Date(userData.lastLogout).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Profile Information Form */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <UserCircle className="h-5 w-5 mr-2 text-blue-600" />
          Update Profile Information
        </h3>
        <form onSubmit={handleProfileSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {profileError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center"
              role="alert"
            >
              <XCircle className="h-5 w-5 mr-2" />
              <span className="block sm:inline">{profileError}</span>
            </div>
          )}
          {profileSuccess && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center"
              role="alert"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="block sm:inline">{profileSuccess}</span>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              icon={
                profileLoading ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <SaveIcon className="h-4 w-4 mr-2" />
                )
              }
              disabled={profileLoading}
            >
              {profileLoading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <KeyRound className="h-5 w-5 mr-2 text-indigo-600" />
          Change Password
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmNewPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
          </div>

          {passwordError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center"
              role="alert"
            >
              <XCircle className="h-5 w-5 mr-2" />
              <span className="block sm:inline">{passwordError}</span>
            </div>
          )}
          {passwordSuccess && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center"
              role="alert"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              <span className="block sm:inline">{passwordSuccess}</span>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              icon={
                passwordLoading ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <SaveIcon className="h-4 w-4 mr-2" />
                )
              }
              disabled={passwordLoading}
            >
              {passwordLoading ? "Updating..." : "Change Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
