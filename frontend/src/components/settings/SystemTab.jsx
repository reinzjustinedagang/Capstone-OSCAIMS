import { useState, useRef } from "react";
import {
  SaveIcon,
  Loader2,
  CheckCircle,
  XCircle,
  HardDrive,
  ImagePlus,
} from "lucide-react";
import Button from "../UI/Button";
import axios from "axios";
import CropperModal from "../UI/CropperModal"; // adjust path

const SystemTab = () => {
  const [systemName, setSystemName] = useState(
    "Senior Citizen Information Management System"
  );
  const [municipality, setMunicipality] = useState(
    "San Jose, Occidental Mindoro"
  );
  const [dataRetention, setDataRetention] = useState(365);
  const [backupFrequency, setBackupFrequency] = useState("weekly");
  const [sealFile, setSealFile] = useState(null);
  const [sealPreview, setSealPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const fileInputRef = useRef(null);

  const [showCropper, setShowCropper] = useState(false);
  const [rawImage, setRawImage] = useState(null); // before crop

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

    if (!systemName || !municipality || !dataRetention || !backupFrequency) {
      setError("All system settings fields are required.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("systemName", systemName);
      formData.append("municipality", municipality);
      formData.append("dataRetention", dataRetention);
      formData.append("backupFrequency", backupFrequency);
      if (sealFile) formData.append("seal", sealFile);

      await axios.post("/api/settings/system", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("System settings updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update system settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualBackup = async () => {
    setBackupLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await axios.post("/api/settings/system/backup");
      setSuccessMessage("Manual backup completed successfully!");
    } catch (err) {
      setError("Manual backup failed.");
    } finally {
      setBackupLoading(false);
    }
  };

  return (
    <form onSubmit={handleSystemSave} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium">System Name</label>
          <input
            value={systemName}
            onChange={(e) => setSystemName(e.target.value)}
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Municipality</label>
          <input
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Data Retention (days)
          </label>
          <input
            type="number"
            value={dataRetention}
            onChange={(e) => setDataRetention(parseInt(e.target.value))}
            className="mt-1 w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Backup Frequency</label>
          <select
            value={backupFrequency}
            onChange={(e) => setBackupFrequency(e.target.value)}
            className="mt-1 w-full border rounded p-2"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
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

      <div className="flex justify-between items-center mt-6">
        <Button
          type="button"
          onClick={handleManualBackup}
          disabled={backupLoading}
          icon={
            backupLoading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <HardDrive />
            )
          }
          variant="secondary"
        >
          {backupLoading ? "Backing up..." : "Run Manual Backup"}
        </Button>
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
    </form>
  );
};

export default SystemTab;
