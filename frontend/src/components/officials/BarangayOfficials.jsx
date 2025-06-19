import React, { useState } from "react";
import { UserIcon, EditIcon, TrashIcon, PlusIcon } from "lucide-react";
import axios from "axios";
import Modal from "../UI/Modal";

const BarangayOfficials = ({ barangays: initialData }) => {
  const [barangays, setBarangays] = useState(initialData || []);
  const [showModal, setShowModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  const [formData, setFormData] = useState({
    name: "",
    president: "",
    position: "",
    existingImage: "",
  });

  const [editingId, setEditingId] = useState(null);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (
      !formData.name.trim() ||
      !formData.president.trim() ||
      !formData.position.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const form = new FormData();
      form.append("barangay_name", formData.name);
      form.append("president_name", formData.president);
      form.append("position", formData.position);

      if (editingId) {
        form.append("existing_image", formData.existingImage || "");
      }

      if (imageFile) {
        form.append("image", imageFile);
      }

      if (editingId) {
        await axios.put(
          `${backendUrl}/api/officials/barangay/${editingId}`,
          form,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        const updatedList = await axios.get(
          `${backendUrl}/api/officials/barangay`
        );
        setBarangays(updatedList.data);
      } else {
        await axios.post(`${backendUrl}/api/officials/barangay`, form, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        const updatedList = await axios.get(
          `${backendUrl}/api/officials/barangay`
        );
        setBarangays(updatedList.data);
      }

      closeModal();
    } catch (err) {
      console.error("Error saving barangay:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/officials/barangay/${id}`, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBarangays(barangays.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: "", president: "", position: "" });
    setImageFile(null);
    setEditingId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-lg font-semibold">
          Barangay Association Presidents
        </h2>
        <button
          onClick={() => {
            setFormData({ name: "", president: "", position: "" });
            setImageFile(null);
            setEditingId(null);
            setShowModal(true); // ✅ open modal
          }}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
        >
          <PlusIcon className="h-4 w-4" /> Add President
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {barangays.map((b) => (
          <div
            key={b.id}
            className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl shadow-md text-center p-5 flex flex-col items-center"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {b.barangay_name}
            </h3>
            <div className="flex flex-col items-center mt-3">
              <div className="bg-green-200 p-2 rounded-full text-green-700 mb-2">
                {b.image && (
                  <img
                    src={`${backendUrl}/uploads/${b.image}`}
                    alt={b.president}
                    className="w-20 h-20 object-cover rounded-full mx-auto border mb-2"
                  />
                )}
              </div>
              <p className="text-md font-semibold text-gray-800">
                {b.president_name}
              </p>
              <p className="text-sm font-medium text-blue-800">{b.position}</p>
            </div>
            <div className="flex mt-4 gap-2">
              <button
                onClick={() => {
                  setFormData({
                    name: b.barangay_name,
                    president: b.president_name,
                    position: b.position,
                    existingImage: b.image || "",
                  });
                  setEditingId(b.id);
                  setShowModal(true); // open modal
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                <EditIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(b.id)}
                className="text-red-600 hover:text-red-800"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal
          isOpen={showModal}
          title={editingId ? "Edit Barangay" : "Add Barangay"}
          onClose={closeModal}
        >
          <div className="p-6">
            <form className="space-y-4">
              <div>
                <label
                  htmlFor="barangayName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Barangay Name
                </label>
                <input
                  type="text"
                  id="barangayName"
                  name="name"
                  value={formData.name}
                  onChange={handleInput}
                  placeholder="Enter Barangay Name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="president"
                  className="block text-sm font-medium text-gray-700"
                >
                  President Name
                </label>
                <input
                  type="text"
                  id="president"
                  name="president"
                  value={formData.president}
                  onChange={handleInput}
                  placeholder="Enter President Name"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="position"
                  className="block text-sm font-medium text-gray-700"
                >
                  Position
                </label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInput}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                  <option value="">Select Position</option>
                  <option value="President">President</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Profile Image
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm file:bg-white file:border file:border-gray-300 file:rounded file:py-1 file:px-2 file:text-sm hover:file:bg-gray-50"
                />
              </div>

              {/* Optional error display here */}
              {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BarangayOfficials;
