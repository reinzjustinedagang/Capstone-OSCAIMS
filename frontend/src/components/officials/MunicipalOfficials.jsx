import React, { useState, useEffect, useCallback } from "react";
import {
  UserIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  Loader2,
  CheckCircle,
  XCircle,
  SaveIcon,
} from "lucide-react";
import OfficialForm from "./OfficialForm"; // Assuming OfficialForm exists
import OfficialCard from "./OfficialCard"; // Assuming OfficialCard exists
import Modal from "../UI/Modal"; // Smaller modal for confirmations
import Modal2 from "../UI/Modal2"; // Larger modal for forms (assuming OfficialForm needs more space)
import Button from "../UI/Button"; // Explicitly imported the Button component
import axios from "axios";

const MunicipalOfficials = ({ title }) => {
  // State for the list of officials fetched from the backend
  const [officials, setOfficials] = useState([]);
  // State to control the visibility of the Add/Edit form modal
  const [showFormModal, setShowFormModal] = useState(false);
  // State to hold the selected image file for upload
  const [imageFile, setImageFile] = useState(null);

  // Base URL for the backend API, falling back to localhost if not defined
  const backendUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // State for the confirmation modal (for delete or update)
  const [confirmModal, setConfirmModal] = useState({
    open: false, // Whether the modal is open
    type: "", // Type of action being confirmed: "delete" or "save-update"
    id: null, // ID of the official relevant to the action
    payload: null, // Data to be passed for "save-update" confirmation
  });

  // State to hold form data for adding or editing an official
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    type: "officer", // Default type for new officials
    existingImage: "", // Holds the filename of the existing image if editing
  });

  // State to track the ID of the official currently being edited
  const [editingId, setEditingId] = useState(null);

  // State for overall loading status (e.g., initial data fetch)
  const [isLoading, setIsLoading] = useState(true);
  // State for loading status during CRUD operations (create, update, delete)
  const [crudLoading, setCrudLoading] = useState(false);
  // State to display error messages to the user
  const [error, setError] = useState("");
  // State to display success messages to the user
  const [successMessage, setSuccessMessage] = useState("");

  // State to hold the currently selected official (for edit/delete context)
  const [selectedOfficial, setSelectedOfficial] = useState(null);

  // Derive head and vice officials from the 'officials' state
  const head = officials.find((m) => m.type === "head");
  const vice = officials.find((m) => m.type === "vice");
  const others = officials.filter((m) => m.type === "officer");

  // Determine if 'head' or 'vice' roles are currently occupied by someone else
  const isHeadOccupied = !!head; // True if a head exists
  const isViceOccupied = !!vice; // True if a vice exists

  // useCallback for stable fetch function across re-renders
  const fetchOfficials = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setSuccessMessage(""); // Clear messages on new fetch
    try {
      // Using your specified API endpoint for fetching officials
      const response = await axios.get(
        `${backendUrl}/api/officials/municipal`,
        {
          withCredentials: true, // Important for sending session cookies
        }
      );
      setOfficials(response.data);
    } catch (err) {
      console.error("Error fetching municipal officials:", err);
      // Display a user-friendly error message
      setError(
        err.response?.data?.message ||
          "Failed to load municipal officials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl]); // Dependency on backendUrl ensures re-fetch if it changes

  // useEffect to call fetchOfficials when the component mounts or fetchOfficials changes
  useEffect(() => {
    fetchOfficials();
  }, [fetchOfficials]);

  // --- Form Input Handlers ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Function to close the form modal and reset all form-related states
  const closeFormModal = () => {
    setShowFormModal(false);
    setFormData({ name: "", position: "", type: "officer", existingImage: "" });
    setImageFile(null);
    setEditingId(null);
    setError(""); // Clear any form-specific errors
  };

  // Handles submission from the OfficialForm component
  const handleSubmitFromForm = async () => {
    setError(""); // Clear previous form-related errors
    // Client-side validation
    if (
      !formData.name.trim() ||
      !formData.position.trim() ||
      !formData.type.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (editingId) {
      // If currently editing, show a confirmation modal before proceeding with the update
      setConfirmModal({
        open: true,
        type: "save-update",
        id: editingId,
        payload: { ...formData, imageFile: imageFile }, // Store current form data and image file for later use
      });
    } else {
      // If adding a new official, directly call saveOfficial without confirmation
      await saveOfficial(formData, imageFile);
    }
  };

  // Function to perform the actual API call for saving (POST) or updating (PUT) an official
  const saveOfficial = async (dataToSave, fileToUpload) => {
    setCrudLoading(true); // Indicate that a CRUD operation is in progress
    setError(""); // Clear any previous errors
    setSuccessMessage(""); // Clear any previous success messages
    try {
      const form = new FormData();
      form.append("name", dataToSave.name);
      form.append("position", dataToSave.position);
      form.append("type", dataToSave.type);

      // If updating an existing official and there's an existing image filename
      if (dataToSave.id && dataToSave.existingImage) {
        form.append("existing_image", dataToSave.existingImage);
      }
      // If a new image file has been selected
      if (fileToUpload) {
        form.append("image", fileToUpload);
      }

      if (dataToSave.id) {
        // PUT request for updating an existing official, using your specified API endpoint
        await axios.put(
          `${backendUrl}/api/officials/municipal/${dataToSave.id}`,
          form,
          {
            withCredentials: true, // Ensures session cookies are sent
            headers: { "Content-Type": "multipart/form-data" }, // Required for FormData
          }
        );
        setSuccessMessage("Municipal official updated successfully!");
      } else {
        // POST request for creating a new official, using your specified API endpoint
        await axios.post(`${backendUrl}/api/officials/municipal`, form, {
          withCredentials: true, // Ensures session cookies are sent
          headers: { "Content-Type": "multipart/form-data" }, // Required for FormData
        });
        setSuccessMessage("New municipal official added successfully!");
      }

      closeFormModal(); // Close the form modal after successful operation
      fetchOfficials(); // Re-fetch the entire list to reflect the changes
    } catch (err) {
      console.error("Error saving municipal official:", err);
      setError(
        err.response?.data?.message ||
          "Failed to save official. Please try again."
      );
    } finally {
      setCrudLoading(false); // End CRUD loading state
    }
  };

  // --- Modal Openers ---
  const openAddModal = () => {
    // Reset form data for new entry
    setFormData({ name: "", position: "", type: "officer", existingImage: "" });
    setImageFile(null); // Clear any previous image file
    setEditingId(null); // Ensure no ID is set for 'add' mode
    setShowFormModal(true); // Open the form modal
  };

  const openEditModal = (official) => {
    // Set the selected official to display its details in the confirmation modal later
    setSelectedOfficial(official);
    // Populate form data with the official's current details for editing
    setFormData({
      name: official.name,
      position: official.position,
      type: official.type,
      existingImage: official.image || "", // Store existing image filename
    });
    setImageFile(null); // Clear any pre-selected new image file
    setEditingId(official.id); // Set the ID to indicate 'edit' mode
    setShowFormModal(true); // Open the form modal
  };

  const openDeleteConfirmation = (official) => {
    // Set the selected official to display its name in the confirmation message
    setSelectedOfficial(official);
    // Open the confirmation modal for deletion
    setConfirmModal({
      open: true,
      type: "delete",
      id: official.id, // Pass the ID for deletion
      payload: null, // No payload needed for delete
    });
  };

  // --- Confirmation Action Handler ---
  // This function is called when the user confirms an action in the confirmation modal
  const handleConfirmAction = async () => {
    if (confirmModal.type === "delete" && confirmModal.id) {
      setCrudLoading(true);
      setError("");
      setSuccessMessage("");
      try {
        // Perform DELETE request using your specified API endpoint
        await axios.delete(
          `${backendUrl}/api/officials/municipal/${confirmModal.id}`,
          {
            withCredentials: true,
          }
        );
        setSuccessMessage("Municipal official deleted successfully!");
        fetchOfficials(); // Re-fetch the updated list after deletion
      } catch (err) {
        console.error("Failed to delete municipal official:", err);
        setError(
          err.response?.data?.message ||
            "Failed to delete official. Please try again."
        );
      } finally {
        setCrudLoading(false);
        setConfirmModal({ open: false, type: "", id: null, payload: null }); // Close confirmation modal
      }
    } else if (confirmModal.type === "save-update" && confirmModal.payload) {
      // If confirming an update, proceed with the save operation using the stored payload
      await saveOfficial(
        { ...confirmModal.payload, id: confirmModal.id }, // Pass saved form data and the official's ID
        confirmModal.payload.imageFile // Pass the saved image file
      );
      setConfirmModal({ open: false, type: "", id: null, payload: null }); // Close confirmation modal
    }
  };

  // Display loading indicator if data is still being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500 mr-3" />
        <p>Loading municipal officials...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <Button
          onClick={openAddModal} // Calls the function to open the add form modal
          variant="primary"
          icon={<PlusIcon className="h-4 w-4 mr-2" />}
        >
          Add Official
        </Button>
      </div>

      {/* Loading and Error/Success Messages Display */}
      {crudLoading ? ( // Show processing message only when CRUD is active
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <p className="ml-3 text-gray-600">Processing request...</p>
        </div>
      ) : error ? ( // Show error message if an error exists
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mx-auto mb-4 flex items-center"
          role="alert"
        >
          <XCircle className="h-5 w-5 mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      ) : successMessage ? ( // Show success message if a success message exists
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mx-auto mb-4 flex items-center"
          role="alert"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          <span className="block sm:inline">{successMessage}</span>
        </div>
      ) : null}

      {/* Officials Display Grid */}
      {/* Only render the grid if not loading and no general error */}
      {!isLoading && !error && (
        <div className="flex flex-col items-center space-y-8">
          {officials.length === 0 ? (
            <p className="text-center text-gray-600 py-4">
              No municipal officials found.
            </p>
          ) : (
            <>
              {/* Head Official Card */}
              {head && (
                <OfficialCard
                  official={head}
                  onEdit={() => openEditModal(head)} // Pass function to open edit modal
                  onDelete={() => openDeleteConfirmation(head)} // Pass function to open delete confirmation
                  isHead
                  backendUrl={backendUrl} // Pass backendUrl for image display in OfficialCard
                />
              )}

              {/* Connection line between Head and Vice */}
              {head && vice && <div className="w-0.5 h-8 bg-blue-400"></div>}

              {/* Vice Official Card */}
              {vice && (
                <OfficialCard
                  official={vice}
                  onEdit={() => openEditModal(vice)}
                  onDelete={() => openDeleteConfirmation(vice)}
                  backendUrl={backendUrl}
                />
              )}

              {/* Line connecting Vice to other officers */}
              {vice && others.length > 0 && (
                <div className="relative w-full flex justify-center">
                  <div className="w-0.5 h-8 bg-blue-400"></div>
                  <div className="absolute top-8 w-1/2 h-0.5 bg-blue-400"></div>
                </div>
              )}

              {/* Grid for other Officers */}
              {others.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 w-full max-w-2xl m-6">
                  {others.map((o) => (
                    <OfficialCard
                      key={o.id}
                      official={o}
                      onEdit={() => openEditModal(o)}
                      onDelete={() => openDeleteConfirmation(o)}
                      backendUrl={backendUrl}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Add/Edit Form Modal (uses Modal2 for larger content) */}
      {showFormModal && (
        <Modal2
          isOpen={showFormModal}
          title={
            editingId ? "Edit Municipal Official" : "Add New Municipal Official"
          }
          onClose={closeFormModal} // Function to close modal
        >
          <div className="p-6">
            {/* The OfficialForm component will now contain its own buttons */}
            <OfficialForm
              formData={formData}
              onChange={handleChange}
              onFileChange={handleFileChange}
              onSubmit={handleSubmitFromForm} // This submits the form to the confirmation flow
              error={error} // Pass general form error message
              isLoading={crudLoading} // Pass loading state for submit button disable/spinner
              isEditing={!!editingId} // Prop to indicate if the form is in edit mode
              existingImage={formData.existingImage} // Pass existing image name for preview within form
              backendUrl={backendUrl} // Pass backend URL for image preview within form
              onCancel={closeFormModal} // Pass a cancel handler to the form
              imageFile={imageFile} // Pass imageFile state to OfficialForm
              // --- New Props for Client-Side Validation ---
              isHeadOccupied={isHeadOccupied}
              isViceOccupied={isViceOccupied}
              officialIdBeingEdited={editingId} // Pass the ID of the official being edited
            />
          </div>
        </Modal2>
      )}

      {/* Delete/Save-Update Confirmation Modal (uses smaller Modal) */}
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
                // Message for delete confirmation
                <>
                  Are you sure you want to delete{" "}
                  <strong className="text-red-600">
                    {selectedOfficial ? selectedOfficial.name : "this official"}
                  </strong>
                  ? This action cannot be undone.
                </>
              ) : (
                // Message for update confirmation ("save-update" type)
                <>
                  Are you sure you want to update{" "}
                  <strong className="text-blue-600">
                    {confirmModal.payload?.name || "this official"}
                  </strong>
                  's information?
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
                icon={<XCircle className="h-4 w-4" />} // Cancel icon
              >
                Cancel
              </Button>
              <Button
                // Dynamically change variant and icon based on confirmation type
                variant={confirmModal.type === "delete" ? "danger" : "primary"}
                onClick={handleConfirmAction} // Calls the main confirmation handler
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

export default MunicipalOfficials;
