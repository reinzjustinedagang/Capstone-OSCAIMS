import React, { useState, useEffect, useMemo } from "react";
import Button from "../UI/Button"; // Assuming you have a Button component
import Modal from "../UI/Modal"; // Assuming you have a larger Modal component for forms
const UserForm = ({ user, onSubmit, onClose, isLoading }) => {
  const [formData, setFormData] = useState(
    user || {
      username: "", // ✅ not "name"
      email: "",
      role: "staff",
      status: "active",
      cp_number: "", // ✅ make sure this is consistent
      password: "", // Optional: ensures password is defined
    }
  );

  useEffect(() => {
    // Update form data when `user` prop changes (e.g., when editing a different user)
    setFormData(
      user || {
        username: "", // ✅ not "name"
        email: "",
        role: "staff",
        status: "active",
        cp_number: "", // ✅ make sure this is consistent
        password: "", // Optional: ensures password is defined
      }
    );
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = { ...formData };

    // If editing and password is blank, remove it
    if (user && !formData.password) {
      delete dataToSend.password;
    }

    onSubmit(dataToSend);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          User Name
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password {user ? "(leave blank to keep current)" : ""}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password || ""}
          onChange={handleChange}
          placeholder={user ? "Leave blank to keep current password" : ""}
          required={!user} // ✅ Required only when adding
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="cp_number"
          className="block text-sm font-medium text-gray-800 mb-1"
        >
          Cellphone Number
        </label>
        <input
          id="cp_number"
          name="cp_number"
          type="tel" // Use type="tel" for phone numbers
          required
          autoComplete="tel" // Use autoComplete="tel" for phone numbers
          value={formData.cp_number} // Bind to the new phoneNumber state
          onChange={handleChange} // Use the new handler
          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-base transition-all duration-200"
          placeholder="e.g., 09171234567" // Add a helpful placeholder
          inputMode="numeric" // Suggest numeric keyboard on mobile devices
          pattern="[0-9]{11}" // Optional: Basic pattern for 11 digits
          maxLength="11" // Enforce max length at browser level
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          variant="secondary"
          onClick={onClose}
          type="button"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : user ? "Update User" : "Add User"}
        </Button>
      </div>
    </form>
  );
};
export default UserForm;
