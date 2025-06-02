import React, { useState } from "react";
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react";
import Button from "../UI/Button";
import Modal2 from "../UI/Modal2";

const MessageTemplates = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  // Mock data for templates
  const templates = [
    {
      id: 1,
      name: "Pension Notification",
      content:
        "Dear {name}, your monthly pension is now available for claiming at the municipal hall. Please bring your senior citizen ID and one valid ID. Thank you!",
      category: "Financial",
    },
    {
      id: 2,
      name: "Health Checkup Reminder",
      content:
        "Dear {name}, this is a reminder about your free health checkup tomorrow at the barangay health center from 8AM to 12NN. Please bring your senior citizen ID.",
      category: "Health",
    },
    {
      id: 3,
      name: "Community Meeting Invitation",
      content:
        "Dear {name}, you are invited to attend the monthly community meeting on {date} at {time} at the municipal hall. Important matters will be discussed.",
      category: "Community",
    },
    {
      id: 4,
      name: "Medicine Distribution Notice",
      content:
        "Dear {name}, free medicine distribution will be conducted on {date} at the health center. Please bring your prescription and senior citizen ID.",
      category: "Health",
    },
  ];
  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setShowEditModal(true);
  };
  const handleDelete = (template) => {
    setSelectedTemplate(template);
    setShowDeleteModal(true);
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Message Templates</h2>
        <Button
          onClick={() => setShowAddModal(true)}
          variant="primary"
          icon={<PlusIcon className="h-4 w-4 mr-2" />}
        >
          Add Template
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className="border border-gray-200 rounded-md overflow-hidden"
          >
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="font-medium">{template.name}</h3>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                  {template.category}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(template)}
                  className="text-blue-600 hover:text-blue-900"
                >
                  <EditIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(template)}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-4 bg-white">
              <p className="text-sm text-gray-600">{template.content}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Add Template Modal */}
      <Modal2
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Message Template"
      >
        <div className="p-6">
          <form className="space-y-4">
            <div>
              <label
                htmlFor="templateName"
                className="block text-sm font-medium text-gray-700"
              >
                Template Name
              </label>
              <input
                type="text"
                id="templateName"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Birthday Greeting"
              />
            </div>
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="category"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select category</option>
                <option value="Financial">Financial</option>
                <option value="Health">Health</option>
                <option value="Community">Community</option>
                <option value="General">General</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Message Content
              </label>
              <textarea
                id="content"
                rows={5}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Type your message template here. Use {name} for recipient's name."
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                Available variables: {"{name}"}, {"{date}"}, {"{time}"}
              </p>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setShowAddModal(false)}>
                Save Template
              </Button>
            </div>
          </form>
        </div>
      </Modal2>
      {/* Edit Template Modal */}
      <Modal2
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Message Template"
      >
        <div className="p-6">
          <form className="space-y-4">
            <div>
              <label
                htmlFor="editTemplateName"
                className="block text-sm font-medium text-gray-700"
              >
                Template Name
              </label>
              <input
                type="text"
                id="editTemplateName"
                defaultValue={selectedTemplate?.name}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="editCategory"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <select
                id="editCategory"
                defaultValue={selectedTemplate?.category}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="Financial">Financial</option>
                <option value="Health">Health</option>
                <option value="Community">Community</option>
                <option value="General">General</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="editContent"
                className="block text-sm font-medium text-gray-700"
              >
                Message Content
              </label>
              <textarea
                id="editContent"
                rows={5}
                defaultValue={selectedTemplate?.content}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                Available variables: {"{name}"}, {"{date}"}, {"{time}"}
              </p>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setShowEditModal(false)}>
                Update Template
              </Button>
            </div>
          </form>
        </div>
      </Modal2>
      {/* Delete Confirmation Modal */}
      <Modal2
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
      >
        <div className="p-6">
          <p className="mb-4">
            Are you sure you want to delete the "{selectedTemplate?.name}"
            template? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setShowDeleteModal(false)}>
              Delete
            </Button>
          </div>
        </div>
      </Modal2>
    </div>
  );
};
export default MessageTemplates;
