import React, { useEffect, useState } from "react";
import axios from "axios";

const MessageHistory = () => {
  const [logs, setLogs] = useState([]);
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/sms/history`);
        setLogs(res.data);
      } catch (err) {
        console.error("Error loading message history", err);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Date & Time", "Message", "Recipients", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {log.message}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {JSON.parse(log.recipients).length} recipients
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      log.status === "Success"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MessageHistory;
