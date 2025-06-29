import React from "react";
import { UserIcon, EditIcon, TrashIcon } from "lucide-react";

const OfficialCard = ({
  official,
  onEdit,
  onDelete,
  isHead = false,
  backendUrl,
}) => {
  // Construct the image URL. If no image, imageUrl will be null.
  const imageUrl = official.image ? `${official.image}` : null;

  return (
    <div
      className={`
        relative p-5 rounded-xl text-center
        flex flex-col items-center
        transform transition-all duration-300 ease-in-out hover:scale-[1.02]
        w-full max-w-xs /* Retained max-w-xs for overall card size */
        ${
          isHead
            ? "bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-blue-600 shadow-lg hover:shadow-xl" // Distinct style for HEAD
            : "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-md hover:shadow-lg" // Style for others
        }
      `}
    >
      {/* Profile Image / User Icon */}
      <div className="flex flex-col items-center mt-3">
        <div className="bg-blue-200 p-2 rounded-full text-blue-700 mb-2">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={official.name}
              className="w-28 h-28 object-cover rounded-full mx-auto border-2 border-blue-400"
              // Fallback for broken images
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = `https://placehold.co/112x112/cccccc/ffffff?text=No+Image`; // Placeholder matching w-28 h-28 (112px)
                e.target.className =
                  "w-28 h-28 object-contain rounded-full mx-auto border-2 border-blue-400 p-2"; // Adjust styling for placeholder
              }}
            />
          ) : (
            <div
              className={`
                flex justify-center items-center rounded-full
                ${isHead ? "bg-blue-700" : "bg-blue-500"}
                w-28 h-28 text-white
              `}
            >
              <UserIcon
                className={`
                ${isHead ? "h-16 w-16" : "h-20 w-20"}
              `}
              />
            </div>
          )}
        </div>
        {/* Person's Name and Position (below image) */}
        <p className="text-md font-semibold text-gray-800">{official.name}</p>
        <p className="text-sm font-medium text-blue-800">{official.position}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex mt-4 gap-2">
        <button
          onClick={onEdit}
          aria-label={`Edit ${official.name}`}
          className="text-blue-600 hover:text-blue-800"
          title="Edit"
        >
          <EditIcon className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          aria-label={`Delete ${official.name}`}
          className="text-red-600 hover:text-red-800"
          title="Delete"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default OfficialCard;
