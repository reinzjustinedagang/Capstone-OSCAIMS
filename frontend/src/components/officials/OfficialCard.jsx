// components/OfficialCard.js
import React from "react";
import { UserIcon, EditIcon, TrashIcon } from "lucide-react";

const OfficialCard = ({ official, onEdit, onDelete, isHead = false }) => {
  const backendUrl = import.meta.env.VITE_API_BASE_URL;
  const imageUrl = official.image
    ? `${backendUrl}/uploads/${official.image}`
    : null;

  return (
    <div
      className={`relative ${
        isHead
          ? "bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-blue-600"
          : "bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400"
      } p-6 rounded-xl shadow-lg w-full max-w-sm text-center`}
    >
      <div className="mb-3 mx-auto w-20 h-20 rounded-full overflow-hidden shadow-inner">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={official.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={`${
              isHead ? "bg-blue-700" : "bg-blue-500"
            } flex justify-center items-center w-full h-full text-white`}
          >
            <UserIcon className="h-8 w-8" />
          </div>
        )}
      </div>

      <p className="text-lg font-semibold text-gray-900 mb-1">
        {official.name}
      </p>
      <p className="text-sm font-medium text-blue-800">{official.position}</p>

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={onEdit}
          aria-label={`Edit ${official.name}`}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <EditIcon className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          aria-label={`Delete ${official.name}`}
          className="text-red-600 hover:text-red-800 flex items-center gap-1"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OfficialCard;
