import React, { useState, useMemo } from "react";
import {
  Gift, // Main icon for benefits
  Search,
  Plus,
  Pencil,
  Trash,
  ArrowDown,
  ArrowUp,
  Loader2,
  CheckCircle,
  XCircle,
  Filter, // For filter button
} from "lucide-react";
import Button from "../UI/Button.jsx"; // Assuming you have a Button component
import Modal from "../UI/Modal.jsx"; // Assuming you have a smaller Modal component for confirmation
import Modal2 from "../UI/Modal2.jsx"; // Assuming you have a larger Modal component for forms
import AddBenefitForm from "./AddBenefitForm.jsx.jsx"; // Import the standalone AddBenefitForm component
import axios from "axios"; // For API calls (mocked for now)

// --- BenefitsPage Component ---
export default function Benefits() {
  // Mock data for benefits
  const [benefits, setBenefits] = useState([
    {
      id: 1,
      name: "Monthly Pension",
      description: "Financial aid for eligible senior citizens.",
      type: "Financial Aid",
      eligibility: "60+ years old, indigent, no other pension.",
      status: "Active",
      dateCreated: "2023-01-15",
    },
    {
      id: 2,
      name: "Medical Assistance Program",
      description: "Assistance for medical expenses and medicines.",
      type: "Medical Assistance",
      eligibility: "Registered senior citizen, with valid prescription.",
      status: "Active",
      dateCreated: "2023-02-01",
    },
    {
      id: 3,
      name: "Discount Card",
      description: "Provides discounts on goods and services.",
      type: "Discount",
      eligibility: "Registered senior citizen.",
      status: "Active",
      dateCreated: "2022-11-20",
    },
    {
      id: 4,
      name: "Social Gathering Fund",
      description: "Funds for community events and social activities.",
      type: "Social Program",
      eligibility: "Active barangay association member.",
      status: "Inactive",
      dateCreated: "2023-03-10",
    },
    {
      id: 5,
      name: "Burial Assistance",
      description: "Financial aid for burial expenses.",
      type: "Financial Aid",
      eligibility: "Family of deceased registered senior citizen.",
      status: "Active",
      dateCreated: "2023-04-05",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleAddBenefit = () => {
    setSelectedBenefit(null); // Ensure no benefit is selected for 'add'
    setShowAddModal(true);
  };

  const handleEditBenefit = (benefit) => {
    setSelectedBenefit(benefit);
    setShowEditModal(true);
  };

  const handleDeleteBenefit = (benefit) => {
    setSelectedBenefit(benefit);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = (formData) => {
    if (formData.id) {
      // Editing existing benefit
      setBenefits((prevBenefits) =>
        prevBenefits.map((b) =>
          b.id === formData.id ? { ...b, ...formData } : b
        )
      );
    } else {
      // Adding new benefit
      const newId = Math.max(...benefits.map((b) => b.id), 0) + 1;
      setBenefits((prevBenefits) => [
        ...prevBenefits,
        {
          id: newId,
          ...formData,
          dateCreated: new Date().toISOString().split("T")[0],
        },
      ]);
    }
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedBenefit(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBenefit) return;
    // Simulate API call for deletion
    // try {
    //   await axios.delete(`/api/benefits/${selectedBenefit.id}`);
    //   setBenefits((prevBenefits) => prevBenefits.filter((b) => b.id !== selectedBenefit.id));
    //   setShowDeleteModal(false);
    //   setSelectedBenefit(null);
    // } catch (err) {
    //   console.error("Delete benefit error:", err);
    //   // Handle error, maybe show a toast notification
    // }

    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay
    setBenefits((prevBenefits) =>
      prevBenefits.filter((b) => b.id !== selectedBenefit.id)
    );
    setShowDeleteModal(false);
    setSelectedBenefit(null);
  };

  const toggleSortOrder = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Memoized filtered and sorted benefits
  const filteredAndSortedBenefits = useMemo(() => {
    let currentBenefits = [...benefits];

    // Apply search term
    if (searchTerm) {
      currentBenefits = currentBenefits.filter((benefit) =>
        Object.values(benefit).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply type filter
    if (filterType !== "All") {
      currentBenefits = currentBenefits.filter(
        (benefit) => benefit.type === filterType
      );
    }

    // Apply status filter
    if (filterStatus !== "All") {
      currentBenefits = currentBenefits.filter(
        (benefit) => benefit.status === filterStatus
      );
    }

    // Apply sorting
    currentBenefits.sort((a, b) => {
      let comparison = 0;
      if (typeof a[sortBy] === "string" && typeof b[sortBy] === "string") {
        comparison = a[sortBy].localeCompare(b[sortBy]);
      } else {
        if (a[sortBy] > b[sortBy]) comparison = 1;
        if (a[sortBy] < b[sortBy]) comparison = -1;
      }
      return sortOrder === "asc" ? comparison : comparison * -1;
    });

    return currentBenefits;
  }, [benefits, searchTerm, filterType, filterStatus, sortBy, sortOrder]);

  const uniqueBenefitTypes = useMemo(() => {
    const types = new Set(benefits.map((b) => b.type));
    return ["All", ...Array.from(types).sort()];
  }, [benefits]);

  return (
    <div className=" bg-gray-100 min-h-screen rounded-lg  font-inter">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Benefits Management
        </h1>
        <Button
          onClick={handleAddBenefit}
          variant="primary"
          icon={<Plus className="h-4 w-4 mr-2" />}
        >
          Add New Benefit
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search benefits..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {uniqueBenefitTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "All" ? "All Types" : type}
                </option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Benefits Table */}
        {/* Loading and Error States */}
        {/* You would typically fetch data here using useEffect and handle loading/error */}
        {/* For now, we'll just display the table */}
        {false /* loading */ ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            <p className="ml-3 text-gray-600">Loading benefits...</p>
          </div>
        ) : false /* error */ ? (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mx-4 my-6 flex items-center"
            role="alert"
          >
            <XCircle className="h-5 w-5 mr-2" />
            <span className="block sm:inline">Failed to load benefits.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSortOrder("name")}
                  >
                    <div className="flex items-center">
                      Benefit Name
                      {sortBy === "name" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 ml-1" />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSortOrder("type")}
                  >
                    <div className="flex items-center">
                      Type
                      {sortBy === "type" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSortOrder("status")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortBy === "status" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 ml-1" />
                        ))}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSortOrder("dateCreated")}
                  >
                    <div className="flex items-center">
                      Date Created
                      {sortBy === "dateCreated" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 ml-1" />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedBenefits.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No benefits found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedBenefits.map((benefit) => (
                    <tr key={benefit.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {benefit.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {benefit.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {benefit.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            benefit.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {benefit.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {benefit.dateCreated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditBenefit(benefit)}
                            className="text-blue-600 hover:text-blue-900"
                            aria-label={`Edit ${benefit.name}`}
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBenefit(benefit)}
                            className="text-red-600 hover:text-red-900"
                            aria-label={`Delete ${benefit.name}`}
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Basic Pagination (Placeholder) */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">
                  {filteredAndSortedBenefits.length}
                </span>{" "}
                of <span className="font-medium">{benefits.length}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Add Benefit Modal */}
      <Modal2
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Benefit"
      >
        <AddBenefitForm // Using the imported AddBenefitForm
          onSubmit={handleFormSubmit}
          onClose={() => setShowAddModal(false)}
        />
      </Modal2>

      {/* Edit Benefit Modal */}
      <Modal2
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Benefit"
      >
        <AddBenefitForm // Using the imported AddBenefitForm
          benefit={selectedBenefit}
          onSubmit={handleFormSubmit}
          onClose={() => setShowEditModal(false)}
        />
      </Modal2>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
      >
        <div className="p-6">
          <p className="mb-4 text-gray-700">
            Are you sure you want to delete the benefit{" "}
            <span className="font-semibold text-red-600">
              {selectedBenefit ? selectedBenefit.name : "this benefit"}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
