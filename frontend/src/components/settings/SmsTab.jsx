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

const SmsTab = () => {
  const [smsProvider, setSmsProvider] = useState("Twilio");
  const [apiKey, setApiKey] = useState("your_api_key_here");
  const [apiSecret, setApiSecret] = useState("your_api_secret_here");
  const [senderID, setSenderID] = useState("SanJose-SC");
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSmsSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    // Basic validation
    if (!smsProvider || !apiKey || !apiSecret || !senderID) {
      setError("All SMS settings fields are required.");
      setLoading(false);
      return;
    }

    try {
      // Simulate API call to save SMS settings
      // const response = await axios.post('/api/settings/sms', { smsProvider, apiKey, apiSecret, senderID });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const isSuccess = true;
      if (isSuccess) {
        setSuccessMessage("SMS settings updated successfully!");
      } else {
        setError("Failed to update SMS settings.");
      }
    } catch (err) {
      console.error("SMS settings update error:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred during SMS settings update."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setTestLoading(true);
    setError("");
    setSuccessMessage("");

    // Basic validation for test
    if (!smsProvider || !apiKey || !apiSecret || !senderID) {
      setError("Please fill in all SMS settings before testing connection.");
      setTestLoading(false);
      return;
    }

    try {
      // Simulate API call to test SMS connection
      // const response = await axios.post('/api/settings/sms/test', { smsProvider, apiKey, apiSecret, senderID });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const isSuccess = true; // Change to false to test error state
      if (isSuccess) {
        setSuccessMessage("SMS connection test successful!");
      } else {
        setError("SMS connection test failed. Check credentials.");
      }
    } catch (err) {
      console.error("SMS test error:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred during SMS connection test."
      );
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <form onSubmit={handleSmsSave} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="smsProvider"
            className="block text-sm font-medium text-gray-700"
          >
            SMS Provider
          </label>
          <select
            id="smsProvider"
            value={smsProvider}
            onChange={(e) => setSmsProvider(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option>ItextMo</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="apiKey"
            className="block text-sm font-medium text-gray-700"
          >
            API Key
          </label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="apiSecret"
            className="block text-sm font-medium text-gray-700"
          >
            API Secret
          </label>
          <input
            type="password"
            id="apiSecret"
            value={apiSecret}
            onChange={(e) => setApiSecret(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="senderID"
            className="block text-sm font-medium text-gray-700"
          >
            Sender ID
          </label>
          <input
            type="text"
            id="senderID"
            value={senderID}
            onChange={(e) => setSenderID(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
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
          onClick={handleTestConnection}
          icon={
            testLoading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <TestTube className="h-4 w-4 mr-2" />
            )
          }
          disabled={testLoading}
        >
          {testLoading ? "Testing..." : "Test SMS Connection"}
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
          {loading ? "Saving..." : "Save SMS Settings"}
        </Button>
      </div>
    </form>
  );
};

export default SmsTab;
