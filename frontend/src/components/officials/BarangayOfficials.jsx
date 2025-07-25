// BarangayOfficials.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Button from "../UI/Button";
import BarangayCard from "./BarangayCard";
import BarangayForm from "./BarangayForm";
import ConfirmationModal from "./ConfirmationModal";
import StatusMessage from "./StatusMessage";
import { PlusIcon, Loader2 } from "lucide-react";

const BarangayOfficials = () => {
  const [barangays, setBarangays] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: "",
    id: null,
    payload: null,
  });
  const [formData, setFormData] = useState({
    barangay: "",
    president: "",
    position: "",
    existingImage: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [crudLoading, setCrudLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const backendUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const fetchBarangays = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");
    try {
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
  }, [fetchBarangays]);

  const closeFormModal = () => {
    setShowFormModal(false);
    setFormData({
      barangay: "",
      president: "",
      position: "",
      existingImage: "",
    });
    setImageFile(null);
    setEditingId(null);
    setError("");
  };

  const handleSubmitFromForm = async () => {
    setError("");
    if (
      !formData.barangay.trim() ||
      !formData.president.trim() ||
      !formData.position.trim()
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
      form.append("barangay_name", dataToSave.barangay);
      form.append("president_name", dataToSave.president);
      form.append("position", dataToSave.position);
      if (dataToSave.id && dataToSave.existingImage) {
        form.append("existing_image", dataToSave.existingImage);
      }
      if (fileToUpload) {
        form.append("image", fileToUpload);
      }
      if (dataToSave.id) {
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
        await axios.post(`${backendUrl}/api/officials/barangay`, form, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccessMessage("New barangay official added successfully!");
      }
      closeFormModal();
      fetchBarangays();
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

  const openDeleteConfirmation = (officialId) => {
    setConfirmModal({
      open: true,
      type: "delete",
      id: officialId,
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
          `${backendUrl}/api/officials/barangay/${confirmModal.id}`,
          { withCredentials: true }
        );
        setSuccessMessage("Barangay official deleted successfully!");
        fetchBarangays();
      } catch (err) {
        console.error("Failed to delete barangay official:", err);
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mt-5">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-2xl font-bold">Barangay Association Presidents</h3>
        <Button
          onClick={() => {
            setFormData({
              barangay: "",
              president: "",
              position: "",
              existingImage: "",
            });
            setImageFile(null);
            setEditingId(null);
            setShowFormModal(true);
          }}
          variant="primary"
          icon={<PlusIcon className="h-4 w-4 mr-2" />}
        >
          Add New Barangay Association President
        </Button>
      </div>

      {isLoading || crudLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
          <p className="ml-3 text-gray-600">
            {isLoading ? "Loading officials..." : "Processing request..."}
          </p>
        </div>
      ) : (
        <>
          <StatusMessage type="error" message={error} />
          <StatusMessage type="success" message={successMessage} />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {barangays.length === 0 ? (
              <p className="col-span-full text-center text-gray-600 py-4">
                No barangay officials found.
              </p>
            ) : (
              barangays.map((b) => (
                <BarangayCard
                  key={b.id}
                  official={b}
                  onEdit={() => {
                    setFormData({
                      barangay: b.barangay_name,
                      president: b.president_name,
                      position: b.position,
                      existingImage: b.image || "",
                    });
                    setImageFile(null);
                    setEditingId(b.id);
                    setShowFormModal(true);
                  }}
                  onDelete={() => openDeleteConfirmation(b.id)}
                />
              ))
            )}
          </div>
        </>
      )}

      {showFormModal && (
        <BarangayForm
          isOpen={showFormModal}
          onClose={closeFormModal}
          onSubmit={handleSubmitFromForm}
          formData={formData}
          setFormData={setFormData}
          handleFileChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
            if (
              !allowedTypes.includes(file.type.toLowerCase()) ||
              file.size > 10 * 1024 * 1024
            ) {
              setError("Only JPEG, JPG, PNG under 10MB are allowed.");
              return;
            }
            setImageFile(file);
            setError("");
          }}
          imageFile={imageFile}
          error={error}
          loading={crudLoading}
          editingId={editingId}
        />
      )}

      {confirmModal.open && (
        <ConfirmationModal
          isOpen={confirmModal.open}
          type={confirmModal.type}
          name={
            confirmModal.type === "delete"
              ? barangays.find((b) => b.id === confirmModal.id)?.president_name
              : confirmModal.payload?.president
          }
          onClose={() =>
            setConfirmModal({ open: false, type: "", id: null, payload: null })
          }
          onConfirm={handleConfirmAction}
          loading={crudLoading}
        />
      )}
    </div>
  );
};

export default BarangayOfficials;
