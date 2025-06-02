import React, { useState } from "react";
import { FileTextIcon, DownloadIcon, FilterIcon } from "lucide-react";
import Button from "../UI/Button";
import Card from "../UI/Card";
import DemographicReports from "./DemographicReports";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [dateRange, setDateRange] = useState("month");
  const [reportType, setReportType] = useState("summary");

  const generateReport = () => {
    // Implement report generation logic
    alert("Generating report...");
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card
          title="Total Reports Generated"
          value="156"
          icon={<FileTextIcon />}
          color="blue"
        />
        <Card
          title="Monthly Active Senior Citizens"
          value="1,180"
          icon={<FileTextIcon />}
          color="green"
        />
        <Card
          title="Benefits Distributed"
          value="₱525,000"
          icon={<FileTextIcon />}
          color="indigo"
        />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("general")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === "general"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              General Reports
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
        <div className="p-6">
          {activeTab === "general" ? (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-lg font-medium mb-4 md:mb-0">
                  Generate Reports
                </h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="quarter">Last Quarter</option>
                    <option value="year">Last Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="summary">Summary Report</option>
                    <option value="detailed">Detailed Report</option>
                    <option value="benefits">Benefits Report</option>
                    <option value="activities">Activities Report</option>
                    <option value="sms">SMS Report</option>
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
                        name: "Monthly Summary Report",
                        user: "Admin User",
                        date: "2023-06-30",
                        type: "Summary",
                      },
                      {
                        name: "Q2 Benefits Distribution",
                        user: "Staff User",
                        date: "2023-06-28",
                        type: "Benefits",
                      },
                      {
                        name: "SMS Campaign Analysis",
                        user: "Admin User",
                        date: "2023-06-25",
                        type: "SMS",
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
                          <Button
                            variant="secondary"
                            icon={<DownloadIcon className="h-4 w-4" />}
                          >
                            Download
                          </Button>
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
    </div>
  );
};
export default Reports;
