import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit as EditIcon,
  Trash as TrashIcon,
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import axios from "axios";
import BarangayForm from "./BarangayForm";

const BarangayManagement = () => {
  const [barangays, setBarangays] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedBarangay, setSelectedBarangay] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchBarangays = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/barangays/`);
      setBarangays(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch barangays.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarangays();
  }, []);

  const handleAddBarangay = () => {
    setShowAddModal(true);
  };

  const handleEditBarangay = (barangay) => {
    setSelectedBarangay(barangay);
    setShowEditModal(true);
  };

  const handleDeleteBarangay = (barangay) => {
    setSelectedBarangay(barangay);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${backendUrl}/api/barangays/${selectedBarangay.id}`, {
        withCredentials: true,
      });
      fetchBarangays();
      setShowDeleteModal(false);
      setSelectedBarangay(null);
    } catch (err) {
      console.error(err);
      setError("Failed to delete barangay.");
    }
  };

  const toggleSortOrder = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const filteredBarangays = barangays
    .filter((b) =>
      b.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">
          Barangay Management
        </h1>
        <Button
          onClick={handleAddBarangay}
          variant="primary"
          icon={<Plus className="h-4 w-4 mr-2" />}
        >
          Add New Barangay
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search barangays..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {error && (
          <div className="p-4 text-red-700 bg-red-100 border-l-4 border-red-500">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Loading barangays...
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
                      Name
                      {sortBy === "name" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="h-4 w-4 ml-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 ml-1" />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBarangays.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No barangays found.
                    </td>
                  </tr>
                ) : (
                  filteredBarangays.map((barangay) => (
                    <tr key={barangay.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {barangay.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(barangay.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditBarangay(barangay)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EditIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBarangay(barangay)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" />
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
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Barangay"
      >
        <BarangayForm
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchBarangays();
            setShowAddModal(false);
          }}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Barangay"
      >
        <BarangayForm
          barangay={selectedBarangay}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            fetchBarangays();
            setShowEditModal(false);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
      >
        <div className="p-6 text-center">
          <p className="mb-4 text-gray-700">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-600">
              {selectedBarangay?.name}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-4 mt-4">
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
};

export default BarangayManagement;
