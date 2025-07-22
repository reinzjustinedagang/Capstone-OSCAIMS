import React, { useState } from "react";
import { SaveIcon, Loader2, CheckCircle, XCircle } from "lucide-react";
import Button from "../UI/Button"; // Assuming Button component path

// This component is designed to be reusable for both adding and editing benefits.
// When 'benefit' prop is null/undefined, it acts as an "Add" form.
// When 'benefit' prop is provided, it acts as an "Edit" form.
const AddBenefitForm = ({ benefit, onSubmit, onClose }) => {
  // Initialize formData with default values for adding, or existing benefit data for editing
  const [formData, setFormData] = useState(
    benefit || {
      name: "",
      description: "",
      type: "Financial Aid", // Default type
      eligibility: "",
      status: "Active", // Default status for new benefits
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handles changes to form input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setLoading(true);
    setError(""); // Clear any previous errors

    // Basic client-side validation
    if (
      !formData.name ||
      !formData.description ||
      !formData.type ||
      !formData.eligibility
    ) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      // --- Placeholder for actual API call ---
      // In a real application, you would make an API call here.
      // Example using axios:
      // const apiEndpoint = formData.id ? `/api/benefits/${formData.id}` : '/api/benefits';
      // const method = formData.id ? 'put' : 'post';
      // const response = await axios[method](apiEndpoint, formData);

      // Simulate network delay for demonstration purposes
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock success or failure for demonstration
      const isSuccess = true; // Set to 'false' to test error handling

      if (isSuccess) {
        onSubmit(formData); // Call the onSubmit prop function passed from the parent component
      } else {
        setError("Operation failed. Please try again.");
      }
    } catch (err) {
      console.error("Benefit form submission error:", err);
      // More detailed error handling based on API response
      setError(
        err.response?.data?.message ||
          "An unexpected error occurred during submission."
      );
    } finally {
      setLoading(false); // Always stop loading, regardless of success or failure
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Benefit Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        ></textarea>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Benefit Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="Financial Aid">Financial Aid</option>
            <option value="Medical Assistance">Medical Assistance</option>
            <option value="Social Program">Social Program</option>
            <option value="Discount">Discount</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="mb-6">
        <label
          htmlFor="eligibility"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Eligibility Criteria
        </label>
        <textarea
          id="eligibility"
          name="eligibility"
          value={formData.eligibility}
          onChange={handleChange}
          rows="2"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
        ></textarea>
      </div>

      {/* Error message display */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center"
          role="alert"
        >
          <XCircle className="h-5 w-5 mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        {/* Cancel button */}
        <Button variant="secondary" onClick={onClose} type="button">
          Cancel
        </Button>
        {/* Submit button with loading spinner */}
        <Button
          variant="primary"
          type="submit"
          icon={
            loading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <SaveIcon className="h-4 w-4 mr-2" />
            )
          }
          disabled={loading} // Disable button when loading
        >
          {loading ? "Saving..." : benefit ? "Update Benefit" : "Add Benefit"}
        </Button>
      </div>
    </form>
  );
};

export default AddBenefitForm;
