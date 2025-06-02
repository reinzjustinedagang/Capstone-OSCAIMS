import React, { useState } from "react";
import { SendIcon, SaveIcon } from "lucide-react";
import Button from "../UI/Button";
import MessageTemplates from "./MessageTemplates";

const Sms = () => {
  const [activeTab, setActiveTab] = useState("send");
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [barangayFilter, setBarangayFilter] = useState("");

  const seniorCitizens = [
    {
      id: 1,
      name: "Maria Santos",
      contact: "09123456789",
      barangay: "San Jose",
    },
    {
      id: 2,
      name: "Pedro Reyes",
      contact: "09234567890",
      barangay: "San Roque",
    },
    {
      id: 3,
      name: "Juan Dela Cruz",
      contact: "09345678901",
      barangay: "San Jose",
    },
    {
      id: 4,
      name: "Elena Magtanggol",
      contact: "09456789012",
      barangay: "San Pedro",
    },
    {
      id: 5,
      name: "Ricardo Dalisay",
      contact: "09567890123",
      barangay: "San Roque",
    },
  ];

  const templates = {
    pension:
      "Monthly pension is now available for claiming at the municipal hall.",
    checkup:
      "Reminder: Free health checkup tomorrow at the barangay health center.",
    meeting: "You're invited to attend the monthly community meeting.",
    medicine:
      "Free medicine distribution will be conducted on [date] at your barangay.",
  };

  const handleSelectAll = (e) => {
    const filtered = filteredCitizens.map((c) => c.id);
    if (e.target.checked) {
      setSelectedRecipients(filtered);
    } else {
      setSelectedRecipients([]);
    }
  };

  const handleSelectRecipient = (id) => {
    if (selectedRecipients.includes(id)) {
      setSelectedRecipients(
        selectedRecipients.filter((recipientId) => recipientId !== id)
      );
    } else {
      setSelectedRecipients([...selectedRecipients, id]);
    }
  };

  const handleTemplateChange = (e) => {
    const selected = e.target.value;
    setMessageText(templates[selected] || "");
  };

  const handleSendMessage = () => {
    alert(`Message sent to ${selectedRecipients.length} recipients`);
    setMessageText("");
    setSelectedRecipients([]);
  };

  const uniqueBarangays = Array.from(
    new Set(seniorCitizens.map((c) => c.barangay))
  );

  const filteredCitizens = barangayFilter
    ? seniorCitizens.filter((c) => c.barangay === barangayFilter)
    : seniorCitizens;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">SMS Management</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {["send", "templates", "history"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab === "send"
                  ? "Send SMS"
                  : tab === "templates"
                  ? "Message Templates"
                  : "Message History"}
              </button>
            ))}
          </nav>
        </div>

        {/* Send SMS Tab */}
        {activeTab === "send" && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recipients */}
              <div>
                <h2 className="text-lg font-medium mb-4">Select Recipients</h2>
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="selectAll"
                        onChange={handleSelectAll}
                        checked={
                          selectedRecipients.length > 0 &&
                          filteredCitizens.every((c) =>
                            selectedRecipients.includes(c.id)
                          )
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="selectAll"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Select All
                      </label>
                      <span className="ml-auto text-sm text-gray-500">
                        {selectedRecipients.length} selected
                      </span>
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="barangayFilter"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Filter by Barangay
                      </label>
                      <select
                        id="barangayFilter"
                        value={barangayFilter}
                        onChange={(e) => setBarangayFilter(e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">All Barangays</option>
                        {uniqueBarangays.map((brgy, index) => (
                          <option key={index} value={brgy}>
                            {brgy}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {filteredCitizens.map((citizen) => (
                      <div
                        key={citizen.id}
                        className="px-4 py-2 border-b border-gray-200 last:border-b-0 flex items-center"
                      >
                        <input
                          type="checkbox"
                          id={`citizen-${citizen.id}`}
                          checked={selectedRecipients.includes(citizen.id)}
                          onChange={() => handleSelectRecipient(citizen.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`citizen-${citizen.id}`}
                          className="ml-2 flex-1"
                        >
                          <div className="text-sm font-medium text-gray-700">
                            {citizen.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {citizen.contact}
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Compose Message */}
              <div>
                <h2 className="text-lg font-medium mb-4">Compose Message</h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="template"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Select Template (Optional)
                    </label>
                    <select
                      id="template"
                      onChange={handleTemplateChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">-- Select a template --</option>
                      <option value="pension">Pension Notification</option>
                      <option value="checkup">Health Checkup Reminder</option>
                      <option value="meeting">
                        Community Meeting Invitation
                      </option>
                      <option value="medicine">
                        Medicine Distribution Notice
                      </option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your message here..."
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    ></textarea>
                    <p className="mt-2 text-sm text-gray-500 flex justify-between">
                      <span>
                        Use <span className="font-medium">{"{name}"}</span> to
                        personalize messages
                      </span>
                      <span>{messageText.length} / 160 characters</span>
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <Button
                      variant="secondary"
                      icon={<SaveIcon className="h-4 w-4 mr-2" />}
                    >
                      Save as Template
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSendMessage}
                      disabled={selectedRecipients.length === 0 || !messageText}
                      icon={<SendIcon className="h-4 w-4 mr-2" />}
                    >
                      Send Message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === "templates" && <MessageTemplates />}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Date & Time",
                      "Message",
                      "Recipients",
                      "Status",
                      "Sent By",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Dummy data */}
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      2023-06-16 09:15 AM
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Monthly pension is now available for claiming at the
                      municipal hall...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      45 recipients
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Delivered
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Admin User
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sms;
