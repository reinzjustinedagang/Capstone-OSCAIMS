import React, { useState, useEffect } from "react";
import Button from "../UI/Button";
import Modal from "../UI/Modal"; // Assuming the path is correct
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

export default function MyProfile() {
  // State for user data, initialized to null
  const [userData, setUserData] = useState(null);

  // State for editable profile fields, initialized as empty
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  // State for password change fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // State for loading, error, and success messages
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  // No longer need profileError/Success, passwordError/Success for inline messages
  // const [profileError, setProfileError] = useState("");
  // const [profileSuccess, setProfileSuccess] = useState("");
  // const [passwordError, setPasswordError] = useState("");
  // const [passwordSuccess, setPasswordSuccess] = useState("");
  const [fetchLoading, setFetchLoading] = useState(true); // New state for initial data fetch
  const [fetchError, setFetchError] = useState(""); // New state for initial data fetch error

  // State for general notification modal
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success"); // 'success' or 'error'

  // State for confirmation modal
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null); // 'profile' or 'password'
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  // --- Helper functions for notifications ---
  const showNotification = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotificationModal(true);
  };

  const closeNotificationModal = () => {
    setShowNotificationModal(false);
    setNotificationMessage(""); // Clear message on close
    // If you had any other state related to inline messages, clear them here too
  };

  const handleConfirmAction = () => {
    if (confirmationAction === "profile") {
      executeProfileSave();
    } else if (confirmationAction === "password") {
      executeChangePassword();
    }
    setConfirmationAction(null); // Clear action after execution
  };

  const handleCancelConfirmation = () => {
    setShowConfirmationModal(false);
    setConfirmationAction(null);
    setConfirmationMessage("");
  };

  // --- Fetch User Data on Component Mount ---
  useEffect(() => {
    const fetchUserData = async () => {
      setFetchLoading(true);
      setFetchError(""); // Clear previous fetch errors

      try {
        const meResponse = await axios.get(`${backendUrl}/api/me`, {
          withCredentials: true,
        });

        if (meResponse.status === 200 && meResponse.data.isAuthenticated) {
          const userId = meResponse.data.userId;

          const response = await axios.get(`${backendUrl}/api/user/${userId}`, {
            withCredentials: true,
          });

          if (response.status === 200 && response.data.isAuthenticated) {
            const fetchedData = {
              id: response.data.userId,
              username: response.data.userName,
              email: response.data.userEmail,
              contactNumber: response.data.userNumber,
              role: response.data.userRole,
              lastLogout: response.data.lastLogout,
            };
            setUserData(fetchedData);
            setUserName(fetchedData.username || "");
            setEmail(fetchedData.email || "");
            setContactNumber(fetchedData.contactNumber || "");
            return;
          }
        }
        setFetchError("Not authenticated. Please log in.");
        navigate("/login");
      } catch (err) {
        console.error("User data fetch error:", err);
        if (err.response && err.response.status === 401) {
          setFetchError(
            "Session expired or not logged in. Please log in again."
          );
          navigate("/login");
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
  }, [backendUrl, navigate]);

  // Handler for saving profile information (triggers confirmation)
  const handleProfileSave = async (e) => {
    e.preventDefault();
    // setProfileError(""); // No longer needed for inline messages
    // setProfileSuccess(""); // No longer needed for inline messages

    if (!username || !email || !contactNumber) {
      showNotification("All profile fields are required.", "error");
      return;
    }

    if (!userData || !userData.id) {
      showNotification("User ID not available. Please log in again.", "error");
      return;
    }

    // Trigger confirmation modal
    setConfirmationAction("profile");
    setConfirmationMessage(
      "Are you sure you want to update your profile with these changes?"
    );
    setShowConfirmationModal(true);
  };

  // Function to execute profile save after confirmation
  const executeProfileSave = async () => {
    setShowConfirmationModal(false); // Close confirmation modal immediately
    setProfileLoading(true);

    try {
      const response = await axios.put(
        `${backendUrl}/api/updateProfile/${userData.id}`,
        {
          username,
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
        setUserData((prev) => ({ ...prev, username, email, contactNumber }));
        window.dispatchEvent(new Event("profileUpdated"));
        showNotification("Profile updated successfully!", "success");
      } else {
        showNotification(
          "Failed to update profile. Please try again.",
          "error"
        );
      }
    } catch (err) {
      console.error("Profile update error:", err);
      let errorMessage =
        err.response?.data?.message ||
        "An error occurred during profile update.";
      showNotification(errorMessage, "error");
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setProfileLoading(false);
    }
  };

  // Handler for changing password (triggers confirmation)
  const handleChangePassword = async (e) => {
    e.preventDefault();
    // setPasswordError(""); // No longer needed for inline messages
    // setPasswordSuccess(""); // No longer needed for inline messages

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      showNotification("All password fields are required.", "error");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showNotification("New passwords do not match.", "error");
      return;
    }
    if (newPassword.length < 6) {
      showNotification(
        "New password must be at least 6 characters long.",
        "error"
      );
      return;
    }

    if (!userData || !userData.id) {
      showNotification("User ID not available. Please log in again.", "error");
      return;
    }

    // Trigger confirmation modal
    setConfirmationAction("password");
    setConfirmationMessage("Are you sure you want to change your password?");
    setShowConfirmationModal(true);
  };

  // Function to execute password change after confirmation
  const executeChangePassword = async () => {
    setShowConfirmationModal(false); // Close confirmation modal immediately
    setPasswordLoading(true);

    try {
      const response = await axios.put(
        `${backendUrl}/api/change-password/${userData.id}`,
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
        showNotification("Password changed successfully!", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        showNotification(
          "Failed to change password. Current password might be incorrect or an unknown error occurred.",
          "error"
        );
      }
    } catch (err) {
      console.error("Password change error:", err);
      let errorMessage =
        err.response?.data?.message ||
        "An error occurred during password change.";
      showNotification(errorMessage, "error");
      if (err.response && err.response.status === 401) {
        navigate("/login");
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
        showNotification("Profile picture updated!", "success"); // Use modal for feedback
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
              {userData.username}
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
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                User Name
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
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

      {/* --- Notification Modal --- */}
      <Modal
        isOpen={showNotificationModal}
        onClose={closeNotificationModal}
        title={notificationType === "success" ? "Success!" : "Error!"}
      >
        <div className="p-6 text-center">
          {notificationType === "success" ? (
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          )}
          <div
            className={`text-lg font-semibold mb-4 ${
              notificationType === "success" ? "text-green-700" : "text-red-700"
            }`}
          >
            {notificationMessage}
          </div>
          <Button
            variant={notificationType === "success" ? "primary" : "danger"}
            onClick={closeNotificationModal}
          >
            OK
          </Button>
        </div>
      </Modal>

      {/* --- Confirmation Modal --- */}
      <Modal
        isOpen={showConfirmationModal}
        onClose={handleCancelConfirmation}
        title="Confirm Action"
      >
        <div className="p-6 text-center">
          <p className="text-lg text-gray-700 mb-6">{confirmationMessage}</p>
          <div className="flex justify-center gap-4">
            <Button variant="secondary" onClick={handleCancelConfirmation}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmAction}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
