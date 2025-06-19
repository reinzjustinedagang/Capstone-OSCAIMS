import React, { useState, useEffect } from "react";
import { UserIcon, PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import OfficialForm from "./OfficialForm";
import OfficialCard from "./OfficialCard";
import Modal from "../UI/Modal";
import axios from "axios";

const MunicipalOfficials = ({ title, members }) => {
  const [officials, setOfficials] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    type: "officer", // default type for new official
  });

  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/officials/municipal`);

        setOfficials(res.data);
      } catch (error) {
        console.error("Failed to fetch municipal officials", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfficials();
  }, [backendUrl]);

  // Find head and vice from current officials
  const head = officials.find((m) => m.type === "head");
  const vice = officials.find((m) => m.type === "vice");
  const others = officials.filter((m) => m.type === "officer");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new official
  const handleAdd = async () => {
    if (!formData.name || !formData.position || !formData.type) {
      return alert("Fill all fields");
    }

    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("position", formData.position);
      form.append("type", formData.type);
      if (imageFile) form.append("image", imageFile);

      const res = await axios.post(
        `${backendUrl}/api/officials/municipal`,
        form,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Refetch from backend to get full data including image
      const result = await axios.get(`${backendUrl}/api/officials/municipal`);

      setOfficials(result.data);
      setShowAdd(false);
      setFormData({ name: "", position: "", type: "officer" });
      setImageFile(null);
    } catch (error) {
      console.error("Failed to add official:", error);
    }
  };

  // Open edit modal
  const openEdit = (official) => {
    setSelectedOfficial(official);
    setFormData({
      name: official.name,
      position: official.position,
      type: official.type,
    });
    setImageFile(null);
    setShowEdit(true);
  };

  const openAdd = () => {
    setFormData({ name: "", position: "", type: "officer" });
    setImageFile(null);
    setShowAdd(true);
  };

  // Update official
  const handleUpdate = async () => {
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("position", formData.position);
      form.append("type", formData.type);
      if (imageFile) form.append("image", imageFile);

      await axios.put(
        `${backendUrl}/api/officials/municipal/${selectedOfficial.id}`,
        form,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Refetch the entire list after update:
      const res = await axios.get(`${backendUrl}/api/officials/municipal`);
      setOfficials(res.data);

      setShowEdit(false);
      setSelectedOfficial(null);
      setImageFile(null);
    } catch (error) {
      console.error("Failed to update official:", error);
    }
  };

  // Open delete modal
  const openDelete = (official) => {
    setSelectedOfficial(official);
    setShowDelete(true);
  };

  // Delete official
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${backendUrl}/api/officials/municipal/${selectedOfficial.id}`,
        {
          withCredentials: true,
        }
      );

      setOfficials((prev) => prev.filter((o) => o.id !== selectedOfficial.id));
      setShowDelete(false);
      setSelectedOfficial(null);
    } catch (error) {
      console.error("Failed to delete official:", error);
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  if (loading) return <div>Loading...</div>;
  return (
    <div className="bg-white rounded-lg shadow mb-6 p-6">
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          onClick={openAdd}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5" /> Add Officer
        </button>
      </div>

      {/* Officials display */}
      <div className="flex flex-col items-center space-y-8">
        {/* Head */}
        {head && (
          <OfficialCard
            official={head}
            onEdit={() => openEdit(head)}
            onDelete={() => openDelete(head)}
            isHead
          />
        )}

        {/* Connection line */}
        {head && vice && <div className="w-0.5 h-8 bg-blue-400"></div>}

        {/* Vice */}
        {vice && (
          <OfficialCard
            official={vice}
            onEdit={() => openEdit(vice)}
            onDelete={() => openDelete(vice)}
          />
        )}

        {/* Line to officers */}
        {vice && others.length > 0 && (
          <div className="relative w-full flex justify-center">
            <div className="w-0.5 h-8 bg-blue-400"></div>
            <div className="absolute top-8 w-1/2 h-0.5 bg-blue-400"></div>
          </div>
        )}

        {/* Officers */}
        {others.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 w-full max-w-2xl m-6">
            {others.map((o) => (
              <OfficialCard
                key={o.id}
                official={o}
                onEdit={() => openEdit(o)}
                onDelete={() => openDelete(o)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <Modal
          isOpen={showAdd}
          title="Add Official"
          onClose={() => setShowAdd(false)}
        >
          <OfficialForm
            formData={formData}
            onChange={handleChange}
            onFileChange={handleFileChange}
            onSubmit={handleAdd}
          />
        </Modal>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <Modal
          isOpen={showEdit}
          title="Edit Official"
          onClose={() => setShowEdit(false)}
        >
          <OfficialForm
            formData={formData}
            onChange={handleChange}
            onFileChange={handleFileChange}
            onSubmit={handleUpdate} // fix here
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDelete && (
        <Modal
          isOpen={showDelete}
          title="Confirm Delete"
          onClose={() => setShowDelete(false)}
        >
          <p>
            Are you sure you want to delete{" "}
            <strong>{selectedOfficial.name}</strong>?
          </p>
          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={() => setShowDelete(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MunicipalOfficials;
