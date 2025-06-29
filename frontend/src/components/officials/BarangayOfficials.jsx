import React, { useState, useEffect, useCallback } from "react";
import {
  UserIcon,
  EditIcon,
  TrashIcon,
  PlusIcon,
  Loader2,
  CheckCircle,
  XCircle,
  SaveIcon,
} from "lucide-react"; // Added SaveIcon
import axios from "axios";
import Button from "../UI/Button"; // Assuming you have a Button component
import Modal from "../UI/Modal"; // This will be your smaller modal for confirmation
import Modal2 from "../UI/Modal2"; // This is your larger modal for the form

const BarangayOfficials = () => {
  const [barangays, setBarangays] = useState([]); // State to hold the list of barangay officials
  const [showFormModal, setShowFormModal] = useState(false); // Controls visibility of Add/Edit form modal
  const [imageFile, setImageFile] = useState(null); // File object for image upload

  const backendUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"; // Fallback URL

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: "", // "delete" or "save-update"
    id: null,
    payload: null, // To store form data for confirmation before update
  });

  const [formData, setFormData] = useState({
    name: "", // Corresponds to barangay_name in backend
    president: "", // Corresponds to president_name in backend
    position: "",
    existingImage: "", // To hold the name of the existing image if editing
  });

  const [editingId, setEditingId] = useState(null); // Holds the ID of the official being edited

  const [isLoading, setIsLoading] = useState(true); // For initial data fetch
  const [crudLoading, setCrudLoading] = useState(false); // For Add/Edit/Delete operations
  const [error, setError] = useState(""); // General error for fetching or CRUD
  const [successMessage, setSuccessMessage] = useState(""); // General success message

  // --- Fetch Data ---
  const fetchBarangays = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setSuccessMessage(""); // Clear messages on new fetch
    try {
      // Using your original API endpoint for fetching
      const response = await axios.get(`${backendUrl}/api/officials/barangay`, {
        withCredentials: true,
      });
      setBarangays(response.data);
    } catch (err) {
      console.error("Error fetching barangay officials:", err);
      setError(
        err.response?.data?.message || "Failed to load barangay officials."
      );
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchBarangays();
  }, [fetchBarangays]); // Refetch when fetchBarangays callback changes

  // --- Form Handlers ---
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const maxSizeInBytes = 10 * 1024 * 1024; // 10MB

    const fileType = file.type.toLowerCase();
    const fileExtension = file.name.toLowerCase().split(".").pop();

    // Check MIME type
    if (!allowedMimeTypes.includes(fileType)) {
      setError("Only JPEG, JPG, and PNG files are allowed.");
      return;
    }

    // Check file extension
    if (!allowedExtensions.includes(fileExtension)) {
      setError("Only .jpeg, .jpg, and .png file extensions are allowed.");
      return;
    }

    // Check file size
    if (file.size > maxSizeInBytes) {
      setError("File size exceeds 10MB. Please select a smaller image.");
      return;
    }

    // Clear any previous errors and update state
    setError(null);
    setImageFile(file);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setFormData({ name: "", president: "", position: "", existingImage: "" });
    setImageFile(null);
    setEditingId(null);
    setError(""); // Clear error when closing modal
  };

  // Handles submission from the form modal (either Add or Edit)
  const handleSubmitFromForm = async () => {
    setError(""); // Clear previous errors
    if (
      !formData.name.trim() ||
      !formData.president.trim() ||
      !formData.position.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (editingId) {
      // If editing, show confirmation BEFORE saving the update
      setConfirmModal({
        open: true,
        type: "save-update",
        id: editingId,
        payload: { ...formData, imageFile: imageFile }, // Store current form data and image file for confirmation
      });
    } else {
      // If adding new, directly save without confirmation
      await saveOfficial(formData, imageFile);
    }
  };

  // Function to save/update an official (called after confirmation for updates)
  const saveOfficial = async (dataToSave, fileToUpload) => {
    setCrudLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const form = new FormData();
      form.append("barangay_name", dataToSave.name);
      form.append("president_name", dataToSave.president);
      form.append("position", dataToSave.position);

      if (dataToSave.id && dataToSave.existingImage) {
        // If it's an update and there's an existing image
        form.append("existing_image", dataToSave.existingImage);
      }

      if (fileToUpload) {
        // If a new image file is selected
        form.append("image", fileToUpload);
      }

      if (dataToSave.id) {
        // It's an update operation
        // Using your original API endpoint for updating
        await axios.put(
          `${backendUrl}/api/officials/barangay/${dataToSave.id}`,
          form,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setSuccessMessage("Barangay official updated successfully!");
      } else {
        // It's a create operation
        // Using your original API endpoint for creating
        await axios.post(`${backendUrl}/api/officials/barangay`, form, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMessage("New barangay official added successfully!");
      }

      closeFormModal(); // Close the form modal
      fetchBarangays(); // Re-fetch the updated list
    } catch (err) {
      console.error("Error saving barangay official:", err);
      setError(
        err.response?.data?.message ||
          "Failed to save official. Please try again."
      );
    } finally {
      setCrudLoading(false);
    }
  };

  // --- Delete Handlers ---
  const openDeleteConfirmation = (officialId) => {
    setConfirmModal({
      open: true,
      type: "delete",
      id: officialId,
      payload: null, // Not needed for delete, but good for consistency
    });
  };

  // Handles confirmation actions (delete or save-update)
  const handleConfirmAction = async () => {
    if (confirmModal.type === "delete" && confirmModal.id) {
      setCrudLoading(true);
      setError("");
      setSuccessMessage("");
      try {
        // Using your original API endpoint for deleting
        await axios.delete(
          `${backendUrl}/api/officials/barangay/${confirmModal.id}`,
          {
            withCredentials: true,
          }
        );
        setSuccessMessage("Barangay official deleted successfully!");
        fetchBarangays(); // Re-fetch the updated list
      } catch (err) {
        console.error("Failed to delete barangay official:", err);
        setError(
          err.response?.data?.message ||
            "Failed to delete official. Please try again."
        );
      } finally {
        setCrudLoading(false);
        setConfirmModal({ open: false, type: "", id: null, payload: null }); // Close confirmation modal
      }
    } else if (confirmModal.type === "save-update" && confirmModal.payload) {
      // For update confirmation, proceed with saving the official using the stored payload
      await saveOfficial(
        { ...confirmModal.payload, id: confirmModal.id }, // Pass ID explicitly for update
        confirmModal.payload.imageFile // Pass the imageFile from payload
      );
      setConfirmModal({ open: false, type: "", id: null, payload: null }); // Close confirmation modal
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mt-5">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-2xl font-bold">Barangay Association Presidents</h3>
        <Button
          onClick={() => {
            setFormData({
              name: "",
              president: "",
              position: "",
              existingImage: "",
            });
            setImageFile(null);
            setEditingId(null);
            setShowFormModal(true); // Open the form modal for adding
          }}
          variant="primary" // Assuming you have a 'primary' variant for Button
          icon={<PlusIcon className="h-4 w-4 mr-2" />}
        >
          Add President
        </Button>
      </div>

      {/* Loading and Error/Success Messages */}
      {isLoading || crudLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <p className="ml-3 text-gray-600">
            {isLoading ? "Loading officials..." : "Processing request..."}
          </p>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mx-auto mb-4 flex items-center"
          role="alert"
        >
          <XCircle className="h-5 w-5 mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      ) : successMessage ? (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mx-auto mb-4 flex items-center"
          role="alert"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          <span className="block sm:inline">{successMessage}</span>
        </div>
      ) : null}

      {/* Officials Display Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {barangays.length === 0 ? (
            <p className="col-span-full text-center text-gray-600 py-4">
              No barangay officials found.
            </p>
          ) : (
            barangays.map((b) => (
              <div
                key={b.id}
                className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-md text-center p-5 flex flex-col items-center"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {b.barangay_name}
                </h3>
                <div className="flex flex-col items-center mt-3">
                  <div className="bg-blue-200 p-2 rounded-full text-blue-700 mb-2">
                    {b.image ? (
                      <img
                        src={b.image} // Ensure this path is correct for serving static images
                        alt={b.president_name}
                        className="w-30 h-30 object-cover rounded-full mx-auto border-2 border-blue-400"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/80x80/cccccc/ffffff?text=No+Image";
                        }} // Fallback for broken images
                      />
                    ) : (
                      <UserIcon className="w-20 h-20 text-gray-500" /> // Default icon if no image
                    )}
                  </div>
                  <p className="text-md font-semibold text-gray-800">
                    {b.president_name}
                  </p>
                  <p className="text-sm font-medium text-blue-800">
                    {b.position}
                  </p>
                </div>
                <div className="flex mt-4 gap-2">
                  <button
                    onClick={() => {
                      setFormData({
                        name: b.barangay_name,
                        president: b.president_name,
                        position: b.position,
                        existingImage: b.image || "", // Store existing image name
                      });
                      setImageFile(null); // Clear any previously selected file
                      setEditingId(b.id);
                      setShowFormModal(true); // Open the form modal for editing
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label={`Edit ${b.president_name}`}
                  >
                    <EditIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openDeleteConfirmation(b.id)} // Open delete confirmation
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Delete ${b.president_name}`}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Form Modal (using Modal2) */}
      {showFormModal && (
        <Modal2
          isOpen={showFormModal}
          title={
            editingId ? "Edit Barangay Official" : "Add New Barangay Official"
          }
          onClose={closeFormModal} // Pass a consistent close function
        >
          <div className="p-6">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitFromForm();
              }}
            >
              {" "}
              {/* Changed function name */}
              <div>
                <label
                  htmlFor="barangayName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Barangay Name
                </label>
                <input
                  type="text"
                  id="barangayName"
                  name="name"
                  value={formData.name}
                  onChange={handleInput}
                  placeholder="Enter Barangay Name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="president"
                  className="block text-sm font-medium text-gray-700"
                >
                  President Name
                </label>
                <input
                  type="text"
                  id="president"
                  name="president"
                  value={formData.president}
                  onChange={handleInput}
                  placeholder="Enter President Name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInput}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  required
                >
                  <option value="">Select Position</option>
                  <option value="President">President</option>
                  {/* Add other positions if applicable */}
                </select>
              </div>
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
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm file:bg-white file:border file:border-gray-300 file:rounded-md file:py-1 file:px-2 file:text-sm hover:file:bg-gray-50"
                />
                {editingId && formData.existingImage && !imageFile && (
                  <p className="text-sm text-gray-500 mt-1">
                    Current image:{" "}
                    <a
                      href={`${formData.existingImage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {formData.existingImage}
                    </a>
                  </p>
                )}
              </div>
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
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeFormModal}
                  disabled={crudLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit" // Changed to submit type
                  variant="primary" // Changed to primary variant
                  icon={
                    crudLoading ? (
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      <SaveIcon className="h-4 w-4 mr-2" />
                    )
                  } // Added SaveIcon and Loader
                  disabled={crudLoading}
                >
                  {crudLoading
                    ? "Saving..."
                    : editingId
                    ? "Update Official"
                    : "Add Official"}
                </Button>
              </div>
            </form>
          </div>
        </Modal2>
      )}

      {/* Delete/Save-Update Confirmation Modal (using the smaller Modal) */}
      {confirmModal.open && (
        <Modal
          isOpen={confirmModal.open}
          onClose={() =>
            setConfirmModal({ open: false, type: "", id: null, payload: null })
          }
          title={
            confirmModal.type === "delete"
              ? "Confirm Deletion"
              : "Confirm Update"
          }
        >
          <div className="p-6 space-y-4">
            <p className="text-gray-700">
              {confirmModal.type === "delete" ? (
                <>
                  Are you sure you want to delete the record for{" "}
                  <strong className="text-red-600">
                    {barangays.find((b) => b.id === confirmModal.id)
                      ?.president_name || "this official"}
                  </strong>
                  ? This action cannot be undone.
                </>
              ) : (
                // For "save-update" type
                <>
                  Are you sure you want to update the record for{" "}
                  <strong className="text-blue-600">
                    {confirmModal.payload?.president || "this official"}
                  </strong>
                  ?
                </>
              )}
            </p>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() =>
                  setConfirmModal({
                    open: false,
                    type: "",
                    id: null,
                    payload: null,
                  })
                }
                disabled={crudLoading}
              >
                Cancel
              </Button>
              <Button
                variant={confirmModal.type === "delete" ? "danger" : "primary"}
                onClick={handleConfirmAction} // This will trigger the delete or save-update logic
                icon={
                  crudLoading ? (
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  ) : confirmModal.type === "delete" ? (
                    <TrashIcon className="h-4 w-4 mr-2" />
                  ) : (
                    <SaveIcon className="h-4 w-4 mr-2" />
                  )
                }
                disabled={crudLoading}
              >
                {crudLoading
                  ? "Processing..."
                  : confirmModal.type === "delete"
                  ? "Delete"
                  : "Confirm Update"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BarangayOfficials;
