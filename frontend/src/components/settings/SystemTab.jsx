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
    setLoading(true);
    setError("");
    setSuccessMessage("");

    // Basic validation
    if (!systemName || !municipality || !dataRetention || !backupFrequency) {
      setError("All system settings fields are required.");
      setLoading(false);
      return;
    }

    try {
      // Simulate API call to save system settings
      // const response = await axios.post('/api/settings/system', { systemName, municipality, dataRetention, backupFrequency });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const isSuccess = true;
      if (isSuccess) {
        setSuccessMessage("System settings updated successfully!");
      } else {
        setError("Failed to update system settings.");
      }
    } catch (err) {
      console.error("System settings update error:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred during system settings update."
      );
    } finally {
      setLoading(false);
    }
  };

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
    </form>
  );
};

export default SystemTab;
