import React from "react";
import Button from "../UI/Button"; // Importing your Button component
import { Loader2, SaveIcon, XCircle } from "lucide-react"; // Importing necessary icons

const OfficialForm = ({
  formData,
  onChange,
  onFileChange,
  onSubmit, // This is the submit handler passed from parent
  onCancel, // This prop is used for the Cancel button's onClick
  error, // To display validation/API errors within the form
  isLoading, // Indicates if a save/update operation is in progress (crudLoading from parent)
  isEditing, // Boolean to tell if the form is in edit mode
  existingImage, // The filename of the existing image if in edit mode
  backendUrl, // Backend URL for constructing the image source
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Official Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter name"
          value={formData.name}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="position"
          className="block text-sm font-medium text-gray-700"
        >
          Position
        </label>
        <input
          type="text"
          id="position"
          name="position"
          placeholder="Enter position"
          value={formData.position}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700"
        >
          Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={onChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        >
          <option value="">Select type</option>
          <option value="head">Head</option>
          <option value="vice">Vice</option>
          <option value="officer">Officer</option>
        </select>
      </div>

      {/* Image Upload and Preview Section */}
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700"
        >
          Profile Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={onFileChange}
          className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm file:bg-white file:border file:border-gray-300 file:rounded-md file:py-1 file:px-2 file:text-sm hover:file:bg-gray-50"
        />
        {/* Display existing image info only if editing, an existing image is present, and no new file is selected */}
        {isEditing &&
          existingImage &&
          !formData.imageFile && ( // Assuming formData.imageFile would be set if a new file is chosen
            <p className="text-sm text-gray-500 mt-1">
              Current image:{" "}
              <a
                href={`${existingImage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {existingImage}
              </a>
            </p>
          )}
      </div>

      {/* Error display */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center"
          role="alert"
        >
          <XCircle className="h-5 w-5 mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        {/* Cancel Button */}
        <Button
          type="button" // Important: set type to "button" to prevent form submission
          variant="secondary"
          onClick={onCancel} // Calls the onCancel prop passed from the parent
          disabled={isLoading} // Disable while loading/saving
          icon={<XCircle className="h-4 w-4" />} // Icon for cancel
        >
          Cancel
        </Button>
        {/* Save/Update Button */}
        <Button
          type="submit" // This button will submit the form
          variant="primary"
          icon={
            isLoading ? ( // Show Loader2 icon when isLoading is true
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              // Show SaveIcon when not loading
              <SaveIcon className="h-4 w-4 mr-2" />
            )
          }
          disabled={isLoading} // Disable while loading/saving
        >
          {isLoading
            ? "Saving..." // Text when loading
            : isEditing
            ? "Update Official" // Text when editing
            : "Add Official"}{" "}
          {/* Text when adding new */}
        </Button>
      </div>
    </form>
  );
};

export default OfficialForm;
