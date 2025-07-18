import React from "react";
import { UserIcon, EditIcon, TrashIcon } from "lucide-react";

const BarangayCard = ({ official, onEdit, onDelete }) => (
  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-md text-center p-5 flex flex-col items-center">
    <h3 className="text-lg font-semibold text-gray-900 mb-1">
      {official.barangay_name}
    </h3>
    <div className="flex flex-col items-center mt-3">
      <div className="bg-blue-200 p-2 rounded-full text-blue-700 mb-2">
        {official.image ? (
          <img
            src={official.image}
            alt={official.president_name}
            className="w-30 h-30 object-cover rounded-full mx-auto border-2 border-blue-400"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/80x80/cccccc/ffffff?text=No+Image";
            }}
          />
        ) : (
          <UserIcon className="w-20 h-20 text-gray-500" />
        )}
      </div>
      <p className="text-md font-semibold text-gray-800">
        {official.president_name}
      </p>
      <p className="text-sm font-medium text-blue-800">{official.position}</p>
    </div>
    <div className="flex mt-4 gap-2">
      <button
        onClick={onEdit}
        className="text-blue-600 hover:text-blue-800"
        aria-label={`Edit ${official.president_name}`}
      >
        <EditIcon className="h-4 w-4" />
      </button>
      <button
        onClick={onDelete}
        className="text-red-600 hover:text-red-800"
        aria-label={`Delete ${official.president_name}`}
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  </div>
);

export default BarangayCard;
