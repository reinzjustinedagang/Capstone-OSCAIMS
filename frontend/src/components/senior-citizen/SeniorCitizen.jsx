import React, { useState, useMemo, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Button from "../UI/Button";
import Delete from "../UI/Button/Delete";
import SeniorCitizenForm from "./SeniorCitizenForm";
import Modal from "../UI/Modal"; // This will be your smaller modal (for notifications and delete confirmation)
import Modal2 from "../UI/Modal2"; // This is your larger modal for the form
import {
  Search,
  Plus,
  EditIcon,
  Trash,
  ArrowDown,
  ArrowUp,
  ArchiveRestore,
  Filter,
  X,
} from "lucide-react";
import axios from "axios";

const SeniorCitizen = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterBarangay, setFilterBarangay] = useState("All Barangays");
  const [filterHealthStatus, setFilterHealthStatus] =
    useState("All Health Status");
  const [filterAge, setFilterAge] = useState("All");
  const [filterGender, setFilterGender] = useState("All");
  const [barangayOptions, setBarangayOptions] = useState([]);
  const [sortBy, setSortBy] = useState("lastName"); // Match the default to one of your backend's allowedSort
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const backendUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const [seniorCitizens, setSeniorCitizens] = useState([]);
  const [deletedCitizens, setDeletedCitizens] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // --- NEW STATE FOR NOTIFICATION MODAL ---
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success"); // 'success' or 'error'
  // ----------------------------------------

  const fetchCitizens = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page,
        limit,
        search: searchTerm || "",
        barangay: filterBarangay || "All",
        gender: filterGender || "All",
        ageRange: filterAge || "All",
        healthStatus: filterHealthStatus || "All",
        sortBy: sortBy || "lastName",
        sortOrder: sortOrder || "asc",
      };

      const response = await axios.get(
        `${backendUrl}/api/senior-citizens/page`,
        {
          params,
          withCredentials: true,
        }
      );

      // ✅ Log the data that just came from the API
      console.log("API Response Data (citizens):", response.data.citizens);

      setSeniorCitizens(response.data.citizens);
      setTotalCount(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch senior citizen:", err);
      setError("Failed to load senior citizens. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (citizen) => {
    setSelectedCitizen(citizen);
    setShowEditModal(true);
  };

  const handleDelete = (citizen) => {
    setSelectedCitizen(citizen);
    setShowDeleteModal(true);
  };

  const handleFormSuccess = async (message) => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedCitizen(null);
    await fetchCitizens(); // Refetch data after successful submission

    // --- Show success notification ---
    setNotificationMessage(message || "Operation completed successfully!");
    setNotificationType("success");
    setShowNotificationModal(true);
    // ---------------------------------
  };

  const handleFormError = (message) => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedCitizen(null); // Close the form modal even on error

    // --- Show error notification ---
    setNotificationMessage(
      message || "An error occurred during the operation."
    );
    setNotificationType("error");
    setShowNotificationModal(true);
    // -------------------------------
  };

  const handleDeleteConfirm = async () => {
    console.log("Deleting ID:", selectedCitizen?.id);

    try {
      await axios.patch(
        `${backendUrl}/api/senior-citizens/soft-delete/${selectedCitizen.id}`,
        {},
        { withCredentials: true }
      );

      await fetchCitizens();
      setShowDeleteModal(false);
      setSelectedCitizen(null);

      // --- Show success notification for delete ---
      setNotificationMessage("Senior citizen record deleted successfully!");
      setNotificationType("success");
      setShowNotificationModal(true);
      // ------------------------------------------
    } catch (err) {
      console.error("Failed to delete:", err);
      setError("Delete failed"); // Keep internal error state for now

      // --- Show error notification for delete ---
      setNotificationMessage("Failed to delete senior citizen record.");
      setNotificationType("error");
      setShowNotificationModal(true);
      // ----------------------------------------
    }
  };

  const fetchBarangays = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/barangays/All`);
      const options = [
        "All Barangays",
        ...response.data.map((b) => b.barangay_name), // ✅ Use correct field name
      ];
      setBarangayOptions(options);
    } catch (error) {
      console.error("Failed to fetch barangays:", error);
    }
  };

  const toggleSortOrder = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterBarangay("All Barangays");
    setFilterHealthStatus("All Health Status");
    setFilterAge("All");
    setFilterGender("All");
    setShowFilters(false);
  };

  const healthStatusOptions = [
    "All Health Status",
    "Good",
    "With Maintenance Meds",
    "Needs Medical Attention",
    "Bedridden",
  ];

  const genderOptions = ["All", "Male", "Female"];

  const AgeOptions = [
    "All",
    "60 - 69",
    "70 - 79",
    "80 - 89",
    "90 - 99",
    "100 - 100+",
  ];

  // ✅ HOOK 1: Fetches the data for the current view
  useEffect(() => {
    fetchCitizens();
  }, [
    page,
    searchTerm,
    filterBarangay,
    filterHealthStatus,
    filterAge,
    filterGender,
    sortBy,
    sortOrder,
    backendUrl,
  ]);

  // ✅ HOOK 2: Resets to page 1 ONLY when filters change
  useEffect(() => {
    setPage(1);
  }, [
    searchTerm,
    filterBarangay,
    filterHealthStatus,
    filterAge,
    filterGender,
    // Note: Do NOT include 'page' in this dependency array
  ]);

  // ✅ HOOK 3 (Recommended): Fetches barangays only once on component mount
  useEffect(() => {
    fetchBarangays();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-end sm:items-center space-y-4 sm:space-y-0">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <NavLink to="/admin/recycle-bin">
            <Button
              variant="secondary"
              icon={<ArchiveRestore className="h-4 w-4 mr-2" />}
              className="relative hover:bg-gray-200"
            >
              Recycle Bin
              {deletedCitizens.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {deletedCitizens.length}
                </span>
              )}
            </Button>
          </NavLink>
          <Button
            onClick={() => {
              setShowAddModal(true);
              setSelectedCitizen(null); // Ensure no pre-filled data for new add
            }}
            variant="primary"
            icon={<Plus className="h-4 w-4 mr-2" />}
          >
            Add New Senior Citizen
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 space-y-4">
          {/* Top Bar: Search + Filter Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search senior citizens..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors ${
                  showFilters ? "text-gray-900 font-semibold" : ""
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
                <ArrowDown
                  className={`h-4 w-4 ml-2 transform transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              {(filterBarangay !== "All Barangays" ||
                filterHealthStatus !== "All Health Status" ||
                filterAge !== "All" ||
                filterGender !== "All") && (
                <button
                  onClick={clearFilters}
                  className="flex items-center text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters Section */}
          {showFilters && (
            <div className="grid grid-cols-4 md:grid-cols-5 gap-4 pt-2 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filterAge}
                  onChange={(e) => setFilterAge(e.target.value)}
                >
                  {AgeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                >
                  {genderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barangay
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filterBarangay}
                  onChange={(e) => setFilterBarangay(e.target.value)}
                >
                  {barangayOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Health Status
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filterHealthStatus}
                  onChange={(e) => setFilterHealthStatus(e.target.value)}
                >
                  {healthStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  // Option 1 (Recommended): Sort by last name for "Name"
                  { label: "Name", key: "lastName" },
                  // Option 2: If you want to sort by first name
                  // { label: "Name", key: "firstName" },

                  { label: "Age", key: "age" }, // Backend provides 'age', so this is fine
                  { label: "Gender", key: "gender" },
                  { label: "Address", key: "barangay" }, // Backend allows sorting by 'barangay', so this is fine.
                ].map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => toggleSortOrder(col.key)}
                  >
                    <div className="flex items-center">
                      {col.label}
                      {sortBy === col.key &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 ml-1" />
                        ))}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Health Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {seniorCitizens && seniorCitizens.length > 0 ? (
                seniorCitizens.map((citizen) => (
                  <tr key={citizen.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {`${citizen.lastName}, ${citizen.firstName} ${
                        citizen.middleName || ""
                      }  ${citizen.suffix || ""}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {citizen.age}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {citizen.gender}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {`${citizen.houseNumberStreet}, Brgy. ${citizen.barangay}, ${citizen.municipality}, ${citizen.province}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {citizen.mobileNumber}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-sm leading-5 font-semibold rounded-md ${
                          citizen.healthStatus === "Good"
                            ? "bg-green-100 text-green-800"
                            : citizen.healthStatus === "With Maintenance Meds"
                            ? "bg-blue-100 text-blue-800"
                            : citizen.healthStatus === "Needs Medical Attention"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {citizen.healthStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-xs">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(citizen)}
                          className="text-blue-600 hover:text-blue-900"
                          aria-label={`Edit ${citizen.firstName} ${citizen.lastName}`}
                        >
                          <EditIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(citizen)}
                          className="text-red-600 hover:text-red-900"
                          aria-label={`Delete ${citizen.firstName} ${citizen.lastName}`}
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {loading
                      ? "Loading senior citizens..."
                      : "No senior citizens found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">{(page - 1) * limit + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(page * limit, totalCount)}
            </span>{" "}
            of <span className="font-medium">{totalCount}</span> results
          </p>
          <nav
            className="inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === i + 1
                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      </div>

      {/* Add/Edit Modal (combined) */}
      <Modal2
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setSelectedCitizen(null);
        }}
        title={
          showAddModal
            ? "Register New Senior Citizen"
            : "Edit Senior Citizen Record"
        }
      >
        <SeniorCitizenForm
          citizen={selectedCitizen}
          onSubmitSuccess={handleFormSuccess} // Pass success handler
          onSubmitError={handleFormError} // Pass error handler
          onCancel={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            setSelectedCitizen(null);
          }}
        />
      </Modal2>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
      >
        <Delete
          selectedCitizen={selectedCitizen}
          setShowDeleteModal={setShowDeleteModal}
          handleDeleteConfirm={handleDeleteConfirm}
        />
      </Modal>

      {/* --- NEW: Notification Modal --- */}
      <Modal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        title={"Confirm Update"}
      >
        <div className="p-6 text-center">
          <div
            className={`text-lg font-semibold mb-4 ${
              notificationType === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {notificationMessage}
          </div>
          <Button
            variant={notificationType === "success" ? "primary" : "danger"}
            onClick={() => setShowNotificationModal(false)}
          >
            OK
          </Button>
        </div>
      </Modal>
      {/* ------------------------------- */}
    </div>
  );
};

export default SeniorCitizen;
