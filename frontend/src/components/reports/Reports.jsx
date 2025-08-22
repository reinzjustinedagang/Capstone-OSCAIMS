<<<<<<< HEAD
import React, { useState } from "react";
import { FileTextIcon, DownloadIcon, FilterIcon } from "lucide-react";
import Button from "../UI/Button";
import Card from "../UI/Card";
import DemographicReports from "./DemographicReports";
import ReportPreviewModal from "./ReportPreviewModal";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [dateRange, setDateRange] = useState("this_month");
  const [reportType, setReportType] = useState("summary");
  const [showPreview, setShowPreview] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handlePreview = (report) => {
    setSelectedReport(report);
    setShowPreview(true);
  };

  const handleDownload = () => {
    alert(`Downloading report: ${selectedReport.name}`);
    // Implement actual download logic
  };

  const generateReport = () => {
    alert("Generating report...");
    // Replace with actual report generation logic
  };

  return (
    <div>
      {/* <h1 className="text-2xl font-bold mb-6">Reports</h1> */}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card
          title="Total Reports Generated"
          value="156"
          icon={<FileTextIcon />}
          color="blue"
        />
=======
import React, { useState, useEffect } from "react";
import { FileTextIcon, ImageIcon, PlusIcon } from "lucide-react";
import Button from "../UI/Button";
import Card from "../UI/Card";
import DemographicReports from "./DemographicReports";
import axios from "axios";
import OscaReports from "./OscaReports";

// This component displays various reports and summaries, including a count of all events.
const Reports = () => {
  // State to manage the active tab for the reports section
  const [activeTab, setActiveTab] = useState("reports");
  // State to store the total count of events
  const [eventsCount, setEventsCount] = useState(0);

  // Backend URL from environment variables
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  // Function to fetch the total events count from the backend
  const fetchEventsCount = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/events/count/all`);
      setEventsCount(res.data.count);
    } catch (err) {
      console.error("Failed to fetch events count", err);
    }
  };

  // useEffect hook to fetch the initial count when the component mounts
  // This will only run once.
  useEffect(() => {
    fetchEventsCount();
  }, []);

  return (
    <>
      {/* Summary Cards section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Card to display the total number of events */}
        <Card title="Reports" value="2" icon={<ImageIcon />} color="purple" />
        {/* Card for registered senior citizens (hardcoded value) */}
>>>>>>> master
        <Card
          title="Registered Senior Citizens"
          value="3,215"
          icon={<FileTextIcon />}
          color="green"
        />
<<<<<<< HEAD
        <Card
          title="Total Benefits Released (This Month)"
          value="₱125,000"
          icon={<FileTextIcon />}
          color="indigo"
        />
      </div>

      {/* Tabs */}
=======
      </div>

      {/* Tabbed navigation for different reports */}
>>>>>>> master
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-300">
          <nav className="flex -mb-px">
            <button
<<<<<<< HEAD
              onClick={() => setActiveTab("general")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "general"
=======
              onClick={() => setActiveTab("reports")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "reports"
>>>>>>> master
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
<<<<<<< HEAD
              General Reports
=======
              Reports
>>>>>>> master
            </button>
            <button
              onClick={() => setActiveTab("demographics")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "demographics"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Demographics
            </button>
          </nav>
        </div>
<<<<<<< HEAD

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "general" ? (
            <div>
              {/* Report Generator Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-lg font-medium mb-4 md:mb-0">
                  Generate Reports
                </h2>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Date Range */}
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="this_month">This Month</option>
                    <option value="last_month">Last Month</option>
                    <option value="this_quarter">This Quarter</option>
                    <option value="this_year">This Year</option>
                    <option value="custom">Custom Range</option>
                  </select>

                  {/* Report Type */}
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="summary">Summary Report</option>
                    <option value="pension">Pension Payout Report</option>
                    <option value="assistance">Assistance Report</option>
                    <option value="medical">Medical Benefits Report</option>
                    <option value="sms">SMS Notifications Report</option>
                    <option value="audit">Audit Logs Report</option>
                  </select>

                  <Button
                    variant="primary"
                    onClick={generateReport}
                    icon={<DownloadIcon className="h-4 w-4 mr-2" />}
                  >
                    Generate Report
                  </Button>
                </div>
              </div>

              {/* Recent Reports Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                  <h3 className="font-medium">Recent Reports</h3>
                  <Button
                    variant="secondary"
                    icon={<FilterIcon className="h-4 w-4 mr-2" />}
                  >
                    Filter
                  </Button>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Report Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Generated By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Generated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      {
                        name: "Pension Distribution - June 2025",
                        user: "Admin",
                        date: "2025-07-01",
                        type: "Pension",
                      },
                      {
                        name: "Medical Aid Report - Q2 2025",
                        user: "Social Worker",
                        date: "2025-06-29",
                        type: "Medical",
                      },
                      {
                        name: "SMS Notification Logs",
                        user: "Admin",
                        date: "2025-06-28",
                        type: "SMS",
                      },
                      {
                        name: "Audit Trail - Account Changes",
                        user: "Admin",
                        date: "2025-06-27",
                        type: "Audit",
                      },
                    ].map((report, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {report.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {report.user}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {report.date}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {report.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => handlePreview(report)}
                            >
                              Preview
                            </Button>
                            <Button
                              variant="secondary"
                              icon={<DownloadIcon className="h-4 w-4" />}
                              onClick={() =>
                                alert(`Downloading: ${report.name}`)
                              } // Replace this with actual logic
                            >
                              Download
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <DemographicReports />
          )}
        </div>
      </div>
      <ReportPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        report={selectedReport}
        onDownload={handleDownload}
      />
    </div>
=======
        <div className="p-4">
          {/* Conditionally render the correct component based on the active tab */}
          {activeTab === "reports" && <OscaReports />}
          {activeTab === "demographics" && <DemographicReports />}
        </div>
      </div>
    </>
>>>>>>> master
  );
};

export default Reports;
