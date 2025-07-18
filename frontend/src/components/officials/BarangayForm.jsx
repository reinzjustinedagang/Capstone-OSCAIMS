import React, { useState, useEffect } from "react";
import { SaveIcon, Loader2, XCircle, Upload } from "lucide-react";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import axios from "axios";

const BarangayForm = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  handleFileChange,
  imageFile,
  error,
  loading,
  editingId,
}) => {
  const [barangayOptions, setBarangayOptions] = useState([]);

  const backendUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    let previewUrl;

    if (formData.imageFile instanceof File) {
      previewUrl = URL.createObjectURL(formData.imageFile);
    }

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [formData.imageFile]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        editingId
          ? "Edit Barangay Association President"
          : "Add New Barangay Association President"
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
            <div className="relative w-32 h-32">
              <img
                src={
                  formData.imageFile instanceof File
                    ? URL.createObjectURL(formData.existingImage)
                    : formData.existingImage
                }
                alt="Profile Preview"
                className="w-full h-full object-cover rounded-full border"
              />

              <label
                htmlFor="image"
                className="absolute bottom-0 right-2 bg-black bg-opacity-60 p-1 rounded-full cursor-pointer hover:bg-opacity-80"
                title="Change Image"
              >
                <Upload className="text-white w-4 h-4" />
              </label>
            </div>

            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
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
            />
            {editingId && formData.existingImage && !imageFile && (
              <p className="text-sm text-gray-500 mt-1">
                Current image:{" "}
                <a
                  href={formData.existingImage}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </a>
              </p>
            )}
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
          <div></div>
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
              className="mt-1 block w-full border rounded-md px-3 py-2"
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
              className="mt-1 block w-full border rounded-md px-3 py-2"
              required
            >
              <option value="">Select Position</option>
              <option value="President">President</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <XCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
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
                ? "Update Official"
                : "Add Official"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default BarangayForm;
