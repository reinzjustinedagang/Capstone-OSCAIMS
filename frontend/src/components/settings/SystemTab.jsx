import { useState, useRef, useEffect } from "react";
import {
  SaveIcon,
  Loader2,
  CheckCircle,
  XCircle,
  HardDrive,
  ImagePlus,
  Cpu,
  Landmark,
} from "lucide-react";
import Button from "../UI/Button";
import axios from "axios";
import CropperModal from "../UI/CropperModal"; // adjust path
import Modal from "../UI/Modal";

const SystemTab = () => {
  const [systemName, setSystemName] = useState("");
  const [municipality, setMunicipality] = useState("");

  const [sealFile, setSealFile] = useState(null);
  const [sealPreview, setSealPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fileInputRef = useRef(null);

  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState(null); // before crop

  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchSystem = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/settings/`, {
          withCredentials: true,
        });
        if (res.status === 200 && res.data) {
          setSystemName(res.data.system_name || "");
          setMunicipality(res.data.municipality || "");
          setSealPreview(res.data.seal || null); // show existing seal
          setSealFile(null); // only set when user uploads a new file
        }
      } catch (err) {
        setError("Failed to fetch system settings.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSystem();
  }, [backendUrl]);

  const handleSealChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const maxSizeInBytes = 10 * 1024 * 1024;

    const fileType = file.type.toLowerCase();
    const fileExtension = file.name.toLowerCase().split(".").pop();

    if (!allowedTypes.includes(fileType)) {
      setError("Only JPG, JPEG, or PNG files are allowed.");
      return;
    }

    if (!allowedExtensions.includes(fileExtension)) {
      setError("Only .jpeg, .jpg, and .png file are allowed.");
      return;
    }

    if (file.size > maxSizeInBytes) {
      setError("File must be under 10MB.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setError(null);
    setRawImage(imageUrl); // for Cropper
    setShowCropper(true); // show crop modal
  };

  const handleCropComplete = (croppedFile) => {
    setSealFile(croppedFile);
    setSealPreview(URL.createObjectURL(croppedFile));
    setShowCropper(false);
  };

  const handleSystemSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (!systemName || !municipality) {
      setError("All system settings fields are required.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("systemName", systemName);
      formData.append("municipality", municipality);
      formData.append("existingSeal", sealPreview || "");
      if (sealFile) formData.append("image", sealFile);

      const res = await axios.post(`${backendUrl}/api/settings/`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        setSuccessMessage(
          res.data.message || "System settings updated successfully!"
        );
        setError("");
        setShowSuccessModal(true); // ✅ show modal instead of reloading immediately
      } else {
        setError("Failed to update system settings.");
      }
    } catch (err) {
      console.error(err);
      // If backend provided error message, use it
      setError(
        err.response?.data?.message || "Failed to update system settings."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSuccess = () => {
    setShowSuccessModal(false);
    window.location.reload(); // ✅ reload AFTER pressing OK
  };

  return (
    <form onSubmit={handleSystemSave} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            System Name
          </label>
          <div className="mt-1 relative">
            <input
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pl-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <Cpu className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Municipality
          </label>
          <div className="mt-1 relative">
            <input
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pl-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <Landmark className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Municipality Seal</label>
          <div className="flex items-center gap-4 mt-2">
            {sealPreview ? (
              <img
                src={sealPreview}
                alt="Seal Preview"
                className="w-20 h-20 object-cover border"
              />
            ) : (
              <div className="w-20 h-20 border flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="px-3 py-1 border rounded flex items-center gap-1 text-sm"
            >
              <ImagePlus size={16} /> Change
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={handleSealChange}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-600 flex items-center gap-2">
          <XCircle size={18} /> {error}
        </div>
      )}
      {successMessage && (
        <div className="text-green-600 flex items-center gap-2">
          <CheckCircle size={18} /> {successMessage}
        </div>
      )}

      <div className="flex justify-end items-center mt-6">
        <Button
          type="submit"
          disabled={loading}
          icon={
            loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <SaveIcon />
            )
          }
        >
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>
      {showCropper && rawImage && (
        <CropperModal
          imageSrc={rawImage}
          onClose={() => setShowCropper(false)}
          onCropComplete={handleCropComplete}
        />
      )}
      {/* ✅ Success Modal */}
      <Modal isOpen={showSuccessModal} onClose={handleConfirmSuccess} title="">
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Settings Updated Successfully
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Your system settings have been saved.
          </p>
          <Button variant="primary" onClick={handleConfirmSuccess}>
            OK
          </Button>
        </div>
      </Modal>
    </form>
  );
};

export default SystemTab;
