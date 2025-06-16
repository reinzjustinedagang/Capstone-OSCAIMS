import React, { useState, useEffect } from "react";
import Button from "../UI/Button"; // Assuming you have a Button component
// No need to import Modal here, as it's handled by the parent component

const UserForm = ({
  user,
  onSubmit,
  onSubmitSuccess, // New prop for success callback
  onSubmitError, // New prop for error callback
  onClose,
  isLoading, // This prop is used by the parent to indicate overall loading,
  // but we'll add our own isSubmitting for the form's internal state.
}) => {
  const [formData, setFormData] = useState(
    user || {
      username: "",
      email: "",
      role: "staff",
      status: "active",
      cp_number: "",
      password: "",
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false); // New state for form submission loading
  const [formError, setFormError] = useState(""); // New state for displaying inline form errors

  useEffect(() => {
    // Update form data when `user` prop changes (e.g., when editing a different user or resetting for add)
    setFormData(
      user || {
        username: "",
        email: "",
        role: "staff",
        status: "active",
        cp_number: "",
        password: "",
      }
    );
    setFormError(""); // Clear any previous form errors when the user changes
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    // Made handleSubmit async
    e.preventDefault();
    setIsSubmitting(true); // Start loading state for the form
    setFormError(""); // Clear any previous errors

    const dataToSend = { ...formData };

    // If editing and password is blank, remove it
    if (user && !formData.password) {
      delete dataToSend.password;
    }

    try {
      // The onSubmit prop should now handle the actual API call
      // and return a success or throw an error.
      // We pass the dataToSend and let the parent handle the API logic.
      await onSubmit(dataToSend);
      // If onSubmit completes successfully, call the success callback
      onSubmitSuccess(
        user ? "User updated successfully!" : "New user added successfully!"
      );
    } catch (error) {
      console.error("Form submission error:", error);
      let errorMessage = "Failed to save user. Please try again.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setFormError(errorMessage); // Set form-specific error
      onSubmitError(errorMessage); // Pass error message to parent component
    } finally {
      setIsSubmitting(false); // End loading state
    }
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
          required={!user} // Required only when adding a new user
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
          type="tel"
          required
          autoComplete="tel"
          value={formData.cp_number}
          onChange={handleChange}
          className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-base transition-all duration-200"
          placeholder="e.g., 09171234567"
          inputMode="numeric"
          pattern="[0-9]{11}"
          maxLength="11"
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

      {/* Display form-specific error */}
      {formError && (
        <div className="text-red-600 text-sm text-center mt-4">{formError}</div>
      )}

      <div className="flex justify-end space-x-3 mt-6">
        <Button
          variant="secondary"
          onClick={onClose}
          type="button"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : user ? "Update User" : "Add User"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
