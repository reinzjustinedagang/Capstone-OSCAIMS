import React, { useState, useMemo, useEffect } from "react";
import Button from "../UI/Button";
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
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  const [seniorCitizens, setSeniorCitizens] = useState([]);
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
      const response = await axios.get(
        `${backendUrl}/api/senior-citizens/page?page=${page}&limit=${limit}`
      );
      setSeniorCitizens(response.data.citizens);
      setTotalCount(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch senior citizen:", err);
      setError("Failed to load senior citizen. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizens();
  }, [page, backendUrl]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterBarangay, filterHealthStatus]);

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
    try {
      await axios.delete(
        `${backendUrl}/api/senior-citizens/delete/${selectedCitizen.id}`
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

  // Memoized filtered and sorted citizens (rest of this logic remains unchanged)
  const filteredAndSortedCitizens = useMemo(() => {
    let filteredCitizens = [...seniorCitizens];

    if (searchTerm) {
      filteredCitizens = filteredCitizens.filter((citizen) =>
        Object.values(citizen).some(
          (value) =>
            value != null &&
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filterBarangay !== "All Barangays") {
      filteredCitizens = filteredCitizens.filter(
        (citizen) => citizen.barangay === filterBarangay
      );
    }

    if (filterHealthStatus !== "All Health Status") {
      filteredCitizens = filteredCitizens.filter(
        (citizen) => citizen.healthStatus === filterHealthStatus
      );
    }

    filteredCitizens.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        if (nameA > nameB) {
          comparison = 1;
        } else if (nameA < nameB) {
          comparison = -1;
        }
      } else if (sortBy === "age") {
        comparison = a.age - b.age;
      } else if (sortBy === "gender") {
        if (a.gender > b.gender) {
          comparison = 1;
        } else if (a.gender < b.gender) {
          comparison = -1;
        }
      } else if (sortBy === "barangay") {
        if (a.barangay > b.barangay) {
          comparison = 1;
        } else if (a.barangay < b.barangay) {
          comparison = -1;
        }
      }

      return sortOrder === "asc" ? comparison : comparison * -1;
    });

    return filteredCitizens;
  }, [
    seniorCitizens,
    searchTerm,
    filterBarangay,
    filterHealthStatus,
    sortBy,
    sortOrder,
  ]);

  const toggleSortOrder = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const barangayOptions = [
    "All Barangays",
    "Adela",
    "Bagong Sikat",
    "Bangkal",
    "Central",
    "F. Balagtas",
    "Ilik",
    "Labangan",
    "Magsaysay",
    "Maibara",
    "Malasin",
    "Mangarin",
    "Mapaya",
    "Murtha",
    "Pag-asa",
    "Pandurucan",
    "Pinagturilan",
    "Poblacion 1",
    "Poblacion 2",
    "Poblacion 3",
    "Poblacion 4",
    "Rizal",
    "San Isidro",
    "San Roque",
    "Santo Niño",
    "Tadyawan",
    "Tamao",
    "Tuban",
  ];

  const healthStatusOptions = [
    "All Health Status",
    "Good",
    "With Maintenance Meds",
    "Needs Medical Attention",
    "Bedridden",
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Senior Citizen List</h1>
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
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
          <div className="flex space-x-2">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterBarangay}
              onChange={(e) => setFilterBarangay(e.target.value)}
            >
              {barangayOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { label: "Name", key: "name" },
                  { label: "Age", key: "age" },
                  { label: "Gender", key: "gender" },
                  { label: "Address", key: "barangay" },
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
              {filteredAndSortedCitizens.map((citizen) => (
                <tr key={citizen.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {`${citizen.firstName} ${citizen.middleName || ""} ${
                      citizen.lastName
                    } ${citizen.suffix || ""}`}
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
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                  <td className="px-6 py-4 text-sm font-medium">
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
              ))}
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
        <div className="p-6">
          <p className="mb-4 text-gray-700">
            Are you sure you want to delete the record for{" "}
            <span className="font-semibold text-red-600">
              {selectedCitizen
                ? `${selectedCitizen.firstName} ${selectedCitizen.lastName}`
                : "this citizen"}
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

      {/* --- NEW: Notification Modal --- */}
      <Modal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        title={notificationType === "success" ? "Success!" : "Error!"}
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
