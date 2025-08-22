<<<<<<< HEAD
import { useState } from "react";
import {
  SaveIcon,
  User,
  MessageSquare,
  Settings as SettingsIconLucide, // Renamed to avoid conflict with component name
  ShieldCheck,
  BellRing,
  Loader2,
  TestTube, // For Test SMS Connection
  HardDrive, // For Manual Backup
  CheckCircle, // For success messages
  XCircle, // For error messages
} from "lucide-react";
import Button from "../UI/Button";

const SystemTab = () => {
  const [systemName, setSystemName] = useState(
    "Senior Citizen Information Management System"
  );
  const [municipality, setMunicipality] = useState(
    "San Jose, Occidental Mindoro"
  );
  const [dataRetention, setDataRetention] = useState(365);
  const [backupFrequency, setBackupFrequency] = useState("weekly");
  const [loading, setLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSystemSave = async (e) => {
    e.preventDefault();
=======
import { useState, useRef, useEffect } from "react";
import {
  SaveIcon,
  Loader2,
  CheckCircle,
  XCircle,
  ImagePlus,
  Cpu,
  Landmark,
  Target,
  Eye,
  ScrollText,
} from "lucide-react";
import Button from "../UI/Button";
import axios from "axios";
import CropperModal from "../UI/CropperModal";
import Modal from "../UI/Modal";

const SystemTab = () => {
  const [formData, setFormData] = useState({
    systemName: "",
    municipality: "",
    mission: "",
    vision: "",
    preamble: "",
  });

  const [sealFile, setSealFile] = useState(null);
  const [sealPreview, setSealPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fileInputRef = useRef(null);
  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState(null);

  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchSystem = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${backendUrl}/api/settings/`, {
          withCredentials: true,
        });
        if (res.status === 200 && res.data) {
          setFormData({
            systemName: res.data.system_name || "",
            municipality: res.data.municipality || "",
            mission: res.data.mission || "",
            vision: res.data.vision || "",
            preamble: res.data.preamble || "",
          });
          setSealPreview(res.data.seal || null);
          setSealFile(null);
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
    const maxSizeInBytes = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setError("Only JPG, JPEG, or PNG files are allowed.");
      return;
    }
    if (file.size > maxSizeInBytes) {
      setError("File must be under 10MB.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setError(null);
    setRawImage(imageUrl);
    setShowCropper(true);
  };

  const handleCropComplete = (croppedFile) => {
    setSealFile(croppedFile);
    setSealPreview(URL.createObjectURL(croppedFile));
    setShowCropper(false);
  };

  const saveSystemSettings = async () => {
>>>>>>> master
    setLoading(true);
    setError("");
    setSuccessMessage("");

<<<<<<< HEAD
    // Basic validation
    if (!systemName || !municipality || !dataRetention || !backupFrequency) {
      setError("All system settings fields are required.");
=======
    if (!formData.systemName || !formData.municipality) {
      setError("All required fields must be filled.");
>>>>>>> master
      setLoading(false);
      return;
    }

    try {
<<<<<<< HEAD
      // Simulate API call to save system settings
      // const response = await axios.post('/api/settings/system', { systemName, municipality, dataRetention, backupFrequency });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const isSuccess = true;
      if (isSuccess) {
        setSuccessMessage("System settings updated successfully!");
=======
      const formPayload = new FormData();
      formPayload.append("systemName", formData.systemName);
      formPayload.append("municipality", formData.municipality);
      formPayload.append("mission", formData.mission);
      formPayload.append("vision", formData.vision);
      formPayload.append("preamble", formData.preamble);
      formPayload.append("existingSeal", sealPreview || "");
      if (sealFile) formPayload.append("image", sealFile);

      const res = await axios.post(`${backendUrl}/api/settings/`, formPayload, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        setSuccessMessage(
          res.data.message || "System settings updated successfully!"
        );
        setError("");
        setShowSuccessModal(true);
>>>>>>> master
      } else {
        setError("Failed to update system settings.");
      }
    } catch (err) {
<<<<<<< HEAD
      console.error("System settings update error:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred during system settings update."
=======
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to update system settings."
>>>>>>> master
      );
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const handleManualBackup = async () => {
    setBackupLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Simulate API call for manual backup
      // const response = await axios.post('/api/settings/system/backup');
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Longer delay for backup

      const isSuccess = true;
      if (isSuccess) {
        setSuccessMessage("Manual backup completed successfully!");
      } else {
        setError("Manual backup failed.");
      }
    } catch (err) {
      console.error("Manual backup error:", err);
      setError(
        err.response?.data?.message || "An error occurred during manual backup."
      );
    } finally {
      setBackupLoading(false);
    }
  };

  return (
    <form onSubmit={handleSystemSave} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="systemName"
            className="block text-sm font-medium text-gray-700"
          >
            System Name
          </label>
          <input
            type="text"
            id="systemName"
            value={systemName}
            onChange={(e) => setSystemName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="municipality"
            className="block text-sm font-medium text-gray-700"
          >
            Municipality
          </label>
          <input
            type="text"
            id="municipality"
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="dataRetention"
            className="block text-sm font-medium text-gray-700"
          >
            Data Retention Period (days)
          </label>
          <input
            type="number"
            id="dataRetention"
            value={dataRetention}
            onChange={(e) => setDataRetention(parseInt(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="backupFrequency"
            className="block text-sm font-medium text-gray-700"
          >
            Automatic Backup Frequency
          </label>
          <select
            id="backupFrequency"
            value={backupFrequency}
            onChange={(e) => setBackupFrequency(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
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
      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center"
          role="alert"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={handleManualBackup}
          icon={
            backupLoading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <HardDrive className="h-4 w-4 mr-2" />
            )
          }
          disabled={backupLoading}
        >
          {backupLoading ? "Backing up..." : "Run Manual Backup"}
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
          {loading ? "Saving..." : "Save System Settings"}
        </Button>
      </div>
=======
  const handleConfirmSuccess = () => {
    setShowSuccessModal(false);
    window.location.reload();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setShowConfirmModal(true);
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            System Name
          </label>
          <div className="mt-1 relative">
            <input
              value={formData.systemName}
              onChange={(e) =>
                setFormData({ ...formData, systemName: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pl-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <Cpu className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Municipality */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Municipality
          </label>
          <div className="mt-1 relative">
            <input
              value={formData.municipality}
              onChange={(e) =>
                setFormData({ ...formData, municipality: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pl-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <Landmark className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Municipality Seal */}
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

      {/* Mission */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Mission
        </label>
        <div className="mt-1 relative">
          <textarea
            value={formData.mission}
            onChange={(e) =>
              setFormData({ ...formData, mission: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pl-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows={3}
          />
          <Target className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Vision */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Vision
        </label>
        <div className="mt-1 relative">
          <textarea
            value={formData.vision}
            onChange={(e) =>
              setFormData({ ...formData, vision: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pl-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows={3}
          />
          <Eye className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Preamble */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Preamble
        </label>
        <div className="mt-1 relative">
          <textarea
            value={formData.preamble}
            onChange={(e) =>
              setFormData({ ...formData, preamble: e.target.value })
            }
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pl-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows={4}
          />
          <ScrollText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Errors */}
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

      {/* Save Button */}
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

      {/* Cropper Modal */}
      {showCropper && rawImage && (
        <CropperModal
          imageSrc={rawImage}
          onClose={() => setShowCropper(false)}
          onCropComplete={handleCropComplete}
        />
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirm Update"
      >
        <div className="mt-4 text-sm text-gray-700">
          Are you sure you want to update your system settings?
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => setShowConfirmModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={() => {
              setShowConfirmModal(false);
              saveSystemSettings();
            }}
            className={`px-4 py-2 rounded text-sm ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {loading ? "Saving..." : "Yes, Save"}
          </button>
        </div>
      </Modal>

      {/* Success Modal */}
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
>>>>>>> master
    </form>
  );
};

export default SystemTab;
