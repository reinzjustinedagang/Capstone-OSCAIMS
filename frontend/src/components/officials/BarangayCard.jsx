import React from "react";
<<<<<<< HEAD
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
=======
import { Edit, Trash2 } from "lucide-react";
import user from "../../assets/user.png";

const BarangayCard = ({ official, onEdit, onDelete }) => {
  return (
    <div className="relative flex flex-col items-center bg-white p-4 rounded-2xl shadow-md w-48 transition-transform transform ">
      {/* Barangay Name */}
      <h3
        className="text-sm font-semibold text-center mb-2 max-w-full truncate"
        title={official.barangay_name}
      >
        {official.barangay_name}
      </h3>

      {/* Profile Picture */}
      <div className="relative mb-3">
        <img
          src={official.image || user}
          alt={official.president_name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/80x80/cccccc/ffffff?text=No+Image";
          }}
          className="w-24 h-24 object-cover rounded-full border-4 border-blue-500"
        />
      </div>

      {/* President Name */}
      <p
        className="text-sm font-medium text-center max-w-full truncate"
        title={official.president_name}
      >
        {official.president_name}
      </p>

      {/* Position */}
      <p className="text-sm bg-blue-100 text-blue-700 mt-1 px-3 py-0.5 rounded-md font-medium">
        {official.position}
      </p>

      {/* Action Buttons */}
      <div className="flex mt-4 gap-4">
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          aria-label={`Edit ${official.president_name}`}
        >
          <Edit className="h-5 w-5" />
        </button>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300 transition"
          aria-label={`Delete ${official.president_name}`}
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
>>>>>>> master

export default BarangayCard;
