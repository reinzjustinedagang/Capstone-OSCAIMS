import React from "react";
import { BookOpenTextIcon, Info } from "lucide-react";

const RepublicActCard = ({ law }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 border border-gray-200 hover:shadow-lg transition">
      <h2 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
        <BookOpenTextIcon className="w-5 h-5 text-purple-500" />
        {law.title}
      </h2>
      <p className="text-sm text-gray-600 mt-1">{law.description}</p>
      <div className="text-xs text-gray-400 mt-2">
        Enacted: {law.datePassed}
      </div>
    </div>
  );
};

export default RepublicActCard;
