import React, { useState } from "react";
import {
  SearchIcon,
  FilterIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
} from "lucide-react";
import Button from "../UI/Button";
import Card from "../UI/Card";

const PensionList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBarangay, setSelectedBarangay] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  // Mock data for pension recipients
  const recipients = [
    {
      id: 1,
      name: "Maria Santos",
      age: 67,
      barangay: "Poblacion",
      status: "active",
      amount: 1000,
      lastClaimed: "2023-06-15",
    },
    {
      id: 2,
      name: "Pedro Reyes",
      age: 72,
      barangay: "Labangan",
      status: "active",
      amount: 1000,
      lastClaimed: "2023-06-14",
    },
    {
      id: 3,
      name: "Juan Dela Cruz",
      age: 65,
      barangay: "San Roque",
      status: "deceased",
      amount: 1000,
      lastClaimed: "2023-05-15",
    },
    {
      id: 4,
      name: "Elena Magtanggol",
      age: 70,
      barangay: "Pag-asa",
      status: "pending",
      amount: 1000,
      lastClaimed: "N/A",
    },
  ];
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "deceased":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pension Distribution List</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card
          title="Total Recipients"
          value="1,245"
          icon={<CheckCircleIcon />}
          color="blue"
        />
        <Card
          title="Active Recipients"
          value="1,180"
          icon={<CheckCircleIcon />}
          color="green"
        />
        <Card
          title="Total Monthly Distribution"
          value="₱1,180,000"
          icon={<CheckCircleIcon />}
          color="indigo"
        />
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search recipients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <div className="flex space-x-2">
              <select
                value={selectedBarangay}
                onChange={(e) => setSelectedBarangay(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Barangays</option>
                <option value="Poblacion">Brgy. Poblacion</option>
                <option value="Labangan">Brgy. Labangan</option>
                <option value="San Roque">Brgy. San Roque</option>
                <option value="Pag-asa">Brgy. Pag-asa</option>
                <option value="Rizal">Brgy. Rizal</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="deceased">Deceased</option>
                <option value="pending">Pending</option>
              </select>
              <Button
                variant="secondary"
                icon={<FilterIcon className="h-4 w-4" />}
              >
                More Filters
              </Button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Barangay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Claimed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recipients.map((recipient) => (
                <tr key={recipient.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {recipient.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{recipient.age}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {recipient.barangay}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(
                        recipient.status
                      )}`}
                    >
                      {recipient.status.charAt(0).toUpperCase() +
                        recipient.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ₱{recipient.amount.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {recipient.lastClaimed}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button
                      variant="secondary"
                      disabled={recipient.status === "deceased"}
                    >
                      Mark as Claimed
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button variant="secondary">Previous</Button>
            <Button variant="secondary">Next</Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">4</span> of{" "}
                <span className="font-medium">1,245</span> recipients
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <Button variant="secondary">Previous</Button>
                <Button variant="secondary">Next</Button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PensionList;
