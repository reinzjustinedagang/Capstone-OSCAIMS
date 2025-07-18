import React, { useState, useEffect, useCallback } from "react";
import {
  PlusIcon,
  Loader2,
  CheckCircle,
  XCircle,
  SaveIcon,
  TrashIcon,
} from "lucide-react";
import MunicipalForm from "./MunicipalForm";
import MunicipalCard from "./MunicipalCard";
import Modal from "../UI/Modal";
import Button from "../UI/Button";
import axios from "axios";

const MunicipalOfficials = ({ title }) => {
  const [officials, setOfficials] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: "",
    id: null,
    payload: null,
  });
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    type: "officer",
    existingImage: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [crudLoading, setCrudLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedOfficial, setSelectedOfficial] = useState(null);
  const backendUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const head = officials.find((m) => m.type === "head");
  const vice = officials.find((m) => m.type === "vice");
  const others = officials.filter((m) => m.type === "officer");
  const isHeadOccupied = !!head;
  const isViceOccupied = !!vice;

  const fetchOfficials = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const response = await axios.get(
        `${backendUrl}/api/officials/municipal`,
        { withCredentials: true }
      );
      setOfficials(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load municipal officials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl]);

  useEffect(() => {
    fetchOfficials();
  }, [fetchOfficials]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const maxSizeInBytes = 10 * 1024 * 1024;

    const fileType = file.type.toLowerCase();
    const fileExtension = file.name.toLowerCase().split(".").pop();

    if (!allowedMimeTypes.includes(fileType)) {
      setError("Only JPEG, JPG, and PNG files are allowed.");
      return;
    }

    if (!allowedExtensions.includes(fileExtension)) {
      setError("Only .jpeg, .jpg, and .png file extensions are allowed.");
      return;
    }

    if (file.size > maxSizeInBytes) {
      setError("File size exceeds 10MB. Please select a smaller image.");
      return;
    }

    setError(null);
    setImageFile(file);
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
    }));
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setFormData({ name: "", position: "", type: "officer", existingImage: "" });
    setImageFile(null);
    setEditingId(null);
    setError("");
  };

  const handleSubmitFromForm = async () => {
    setError("");
    if (
      !formData.name.trim() ||
      !formData.position.trim() ||
      !formData.type.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (editingId) {
      setConfirmModal({
        open: true,
        type: "save-update",
        id: editingId,
        payload: { ...formData, imageFile },
      });
    } else {
      await saveOfficial(formData, imageFile);
    }
  };

  const saveOfficial = async (dataToSave, fileToUpload) => {
    setCrudLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const form = new FormData();
      form.append("name", dataToSave.name);
      form.append("position", dataToSave.position);
      form.append("type", dataToSave.type);

      if (dataToSave.id && dataToSave.existingImage) {
        form.append("existing_image", dataToSave.existingImage || "");
      }

      if (fileToUpload) {
        form.append("image", fileToUpload);
      }

      if (dataToSave.id) {
        await axios.put(
          `${backendUrl}/api/officials/municipal/${dataToSave.id}`,
          form,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setSuccessMessage("Municipal official updated successfully!");
      } else {
        await axios.post(`${backendUrl}/api/officials/municipal`, form, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMessage("New municipal official added successfully!");
      }

      closeFormModal();
      fetchOfficials();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to save official. Please try again."
      );
    } finally {
      setCrudLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData({ name: "", position: "", type: "officer", existingImage: "" });
    setImageFile(null);
    setEditingId(null);
    setShowFormModal(true);
  };

  const openEditModal = (official) => {
    setSelectedOfficial(official);
    setFormData({
      name: official.name,
      position: official.position,
      type: official.type,
      existingImage: official.image || "",
    });
    setImageFile(null);
    setEditingId(official.id);
    setShowFormModal(true);
  };

  const openDeleteConfirmation = (official) => {
    setSelectedOfficial(official);
    setConfirmModal({
      open: true,
      type: "delete",
      id: official.id,
      payload: null,
    });
  };

  const handleConfirmAction = async () => {
    if (confirmModal.type === "delete" && confirmModal.id) {
      setCrudLoading(true);
      setError("");
      setSuccessMessage("");
      try {
        await axios.delete(
          `${backendUrl}/api/officials/municipal/${confirmModal.id}`,
          { withCredentials: true }
        );
        setSuccessMessage("Municipal official deleted successfully!");
        fetchOfficials();
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to delete official. Please try again."
        );
      } finally {
        setCrudLoading(false);
        setConfirmModal({ open: false, type: "", id: null, payload: null });
      }
    } else if (confirmModal.type === "save-update" && confirmModal.payload) {
      await saveOfficial(
        { ...confirmModal.payload, id: confirmModal.id },
        confirmModal.payload.imageFile
      );
      setConfirmModal({ open: false, type: "", id: null, payload: null });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-700">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500 mr-3" />
        <p>Loading municipal officials...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Button
          onClick={openAddModal}
          variant="primary"
          icon={<PlusIcon className="h-4 w-4 mr-2" />}
        >
          Add New Municipal Federation Officer
        </Button>
      </div>

      {crudLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <p className="ml-3 text-gray-600">Processing request...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mx-auto mb-4 flex items-center">
          <XCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      ) : successMessage ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mx-auto mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>{successMessage}</span>
        </div>
      ) : null}

      {!isLoading && !error && (
        <div className="flex flex-col items-center space-y-2">
          {/* Head */}
          {head && (
            <MunicipalCard
              official={head}
              onEdit={() => openEditModal(head)}
              onDelete={() => openDeleteConfirmation(head)}
              isHead
              backendUrl={backendUrl}
            />
          )}

          {/* Vice */}
          {vice && (
            <>
              <div className="w-1 h-6 bg-blue-400"></div>
              <MunicipalCard
                official={vice}
                onEdit={() => openEditModal(vice)}
                onDelete={() => openDeleteConfirmation(vice)}
                backendUrl={backendUrl}
              />
            </>
          )}

          {/* Others */}
          {others.length > 0 && (
            <>
              <div className="relative flex justify-center items-center w-full">
                <div className="w-1 h-6 bg-blue-400"></div>
                <div className="absolute top-6 h-1 w-2/3 bg-blue-400"></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full max-w-4xl">
                {others.map((o) => (
                  <MunicipalCard
                    key={o.id}
                    official={o}
                    onEdit={() => openEditModal(o)}
                    onDelete={() => openDeleteConfirmation(o)}
                    backendUrl={backendUrl}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {showFormModal && (
        <Modal
          isOpen={showFormModal}
          title={
            editingId
              ? "Edit Municipal Federation Officer"
              : "Add New Municipal Federation Officer"
          }
          onClose={closeFormModal}
        >
          <div className="p-6">
            <MunicipalForm
              formData={formData}
              onChange={handleChange}
              onFileChange={handleFileChange}
              onSubmit={handleSubmitFromForm}
              error={error}
              isLoading={crudLoading}
              isEditing={!!editingId}
              existingImage={formData.existingImage}
              backendUrl={backendUrl}
              onCancel={closeFormModal}
              imageFile={imageFile}
              isHeadOccupied={isHeadOccupied}
              isViceOccupied={isViceOccupied}
              officialIdBeingEdited={editingId}
            />
          </div>
        </Modal>
      )}

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
                  Are you sure you want to delete{" "}
                  <strong className="text-red-600">
                    {selectedOfficial ? selectedOfficial.name : "this official"}
                  </strong>
                  ? This action cannot be undone.
                </>
              ) : (
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
                icon={<XCircle className="h-4 w-4" />}
              >
                Cancel
              </Button>
              <Button
                variant={confirmModal.type === "delete" ? "danger" : "primary"}
                onClick={handleConfirmAction}
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
