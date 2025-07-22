import React, { useState, useEffect } from "react";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import { Loader2, SaveIcon, XCircle, UploadCloud } from "lucide-react";
import user from "../../assets/user.png";
import axios from "axios";

const BarangayForm = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  error,
  loading,
  editingId,
  backendUrl,
}) => {
  const [barangayOptions, setBarangayOptions] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const fetchBarangays = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/barangays/All`);
      const options = res.data.map((b) => b.barangay_name); // or b.name depending on your DB
      setBarangayOptions(options);
    } catch (err) {
      console.error("Failed to fetch barangays:", err);
    }
  };

  useEffect(() => {
    fetchBarangays();
  }, []);

  useEffect(() => {
    if (formData.imageFile instanceof File) {
      const objectUrl = URL.createObjectURL(formData.imageFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (formData.existingImage) {
      setPreviewUrl(`${backendUrl}/uploads/${formData.existingImage}`);
    } else {
      setPreviewUrl(user);
    }
  }, [formData.imageFile, formData.existingImage, backendUrl]);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (
      !allowedTypes.includes(file.type.toLowerCase()) ||
      file.size > 10 * 1024 * 1024
    ) {
      setValidationError("Only JPEG, JPG, PNG under 10MB are allowed.");
      return;
    }
    setValidationError(null);
    // setImageFile(file); // REMOVE THIS
    setFormData({ ...formData, imageFile: file });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        editingId
          ? "Edit Barangay Association Official"
          : "Add Barangay Association Official"
      }
    >
      <div className="p-6">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="flex justify-center">
            <div className="relative group w-32 h-32">
              <img
                src={previewUrl}
                alt="Profile Preview"
                className="w-full h-full object-cover rounded-full border-4 border-blue-200 group-hover:border-blue-400 transition-all duration-300 shadow"
              />
              <label
                htmlFor="image"
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1.5 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 shadow-lg hover:bg-blue-700"
                title="Change Image"
              >
                <UploadCloud className="text-white w-4 h-4" />
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="barangay"
              className="block text-sm font-medium text-gray-700"
            >
              Barangay <span className="text-red-500">*</span>
            </label>
            <select
              id="barangay"
              name="barangay"
              value={formData.barangay}
              onChange={handleInput}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              required
            >
              <option value="">Select barangay</option>
              {barangayOptions.map((barangay, index) => (
                <option key={index} value={barangay}>
                  {barangay}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="president"
              className="block text-sm font-medium text-gray-700"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="president"
              name="president"
              value={formData.president}
              onChange={handleInput}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="position"
              className="block text-sm font-medium text-gray-700"
            >
              Position <span className="text-red-500">*</span>
            </label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInput}
              className="mt-1 block w-full border rounded-md px-3 py-2"
              required
            >
              <option value="">Select Position</option>
              <option value="President">President</option>
            </select>
          </div>

          {(validationError || error) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <XCircle className="h-5 w-5 mr-2" />
              <span>{validationError || error}</span>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={
                loading ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <SaveIcon className="h-4 w-4 mr-2" />
                )
              }
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Barangay Association Presidents"
                : "Add Barangay Association Presidents"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default BarangayForm;
