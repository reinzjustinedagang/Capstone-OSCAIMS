import React, { useState } from "react";
import { Tag, Stethoscope, HelpingHand } from "lucide-react";
import Discount from "./Discount";
import MedicalAssistance from "./MedicalAssistance";
import SocialProgram from "./SocialProgram";

const Benefits = () => {
  const [activeTab, setActiveTab] = useState("discount");

  return (
    <div className="bg-gray-100 min-h-screen rounded-lg">
      {/* <h1 className="text-2xl font-bold mb-6">Benefits</h1> */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap -mb-px">
            {" "}
            {/* Added flex-wrap for responsiveness */}
            <button
              onClick={() => setActiveTab("discount")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors duration-200
                ${
                  activeTab === "discount"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              <Tag className="inline-block h-4 w-4 mr-2" /> Discount
            </button>
            <button
              onClick={() => setActiveTab("medicalAssistance")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors duration-200
                ${
                  activeTab === "medicalAssistance"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              <Stethoscope className="inline-block h-4 w-4 mr-2" /> Medical
              Assistance
            </button>
            <button
              onClick={() => setActiveTab("socialProgram")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors duration-200
                ${
                  activeTab === "socialProgram"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              <HelpingHand className="inline-block h-4 w-4 mr-2" /> Social
              Program
            </button>
          </nav>
        </div>
        <div className="p-6">
          {activeTab === "discount" && <Discount />}
          {activeTab === "medicalAssistance" && <MedicalAssistance />}
          {activeTab === "socialProgram" && <SocialProgram />}
        </div>
      </div>
    </div>
  );
};

export default Benefits;
