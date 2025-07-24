import React from "react";
import { Info, MapPin } from "lucide-react";

const BenefitsCard = ({ type, textColor, textIcon }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-4 border border-gray-200 hover:shadow-lg transition">
      <h2
        className={`text-lg font-semibold ${textColor} flex items-center gap-2`}
      >
        <Info className={`w-4 h-4 ${textIcon}`} />
        {type.title}
      </h2>
      <p className="text-sm text-gray-600 mt-1">{type.description}</p>

      <div className="mt-3 text-sm text-gray-500 flex items-center gap-2">
        <MapPin className={`w-4 h-4 ${textIcon}`} />
        {type.location}
      </div>
      <div className="text-xs text-gray-400 mt-1">
        Provided by: {type.provider}
      </div>
    </div>
  );
};

export default BenefitsCard;
