import React from "react";
import { UserIcon, EditIcon, TrashIcon } from "lucide-react";

const OfficialCard = ({ official, onEdit, onDelete, isHead = false }) => {
  const imageUrl = official.image ? `${official.image}` : null;

  return (
    <div
      className={`
        relative text-center flex flex-col items-center
        w-full max-w-xs mx-auto px-4 py-6
        rounded-xl shadow-lg transition-transform transform hover:shadow-xl
        bg-white border border-gray-100
      `}
    >
      {/* Profile Picture */}
      <div className="relative mb-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${official.name}'s profile picture`}
            className="w-28 h-28 object-cover rounded-full mx-auto border-4 border-blue-400 shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/128x128/cccccc/ffffff?text=No+Image`;
              e.target.className =
                "w-28 h-28 object-contain rounded-full mx-auto border-4 border-blue-400 shadow-md";
            }}
          />
        ) : (
          <div
            className={`flex justify-center items-center rounded-full ${
              isHead ? "bg-blue-700" : "bg-blue-500"
            } w-28 h-28 text-white mx-auto border-4 border-blue-400 shadow-md`}
          >
            <UserIcon className="h-16 w-16" />
          </div>
        )}
      </div>

      {/* Name & Position */}
      <div
        className={`w-full max-w-[80%] rounded-xl border border-blue-400 p-3 ${
          isHead
            ? "bg-gradient-to-br from-blue-100 to-blue-200 shadow-lg"
            : "bg-gradient-to-br from-blue-50 to-blue-100 shadow"
        }`}
      >
        <p className="text-lg font-semibold text-gray-800 truncate">
          {official.name}
        </p>
        <p className="text-sm font-medium text-blue-800 truncate">
          {official.position}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex mt-5 gap-4">
        <button
          onClick={onEdit}
          aria-label={`Edit ${official.name}`}
          title="Edit Official"
          className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <EditIcon className="h-5 w-5" />
        </button>
        <button
          onClick={onDelete}
          aria-label={`Delete ${official.name}`}
          title="Delete Official"
          className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 transition"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default OfficialCard;
