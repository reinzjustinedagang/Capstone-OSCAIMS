import React, { useState } from "react";
<<<<<<< HEAD
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
=======
import {
  PercentIcon,
  Stethoscope,
  ShieldCheck,
  HandCoins,
  Plus,
  BookOpenTextIcon,
  CheckCircle,
} from "lucide-react";
import Modal from "../UI/Modal";
import Discount from "./Discount";
import FinancialAssistance from "./FinancialAssistance";
import MedicalBenefits from "./MedicalBenefits";
import PerksAndPrev from "./PerksAndPrev";
import RepublicActs from "./RepublicActs";
import AddBenefit from "./AddBenefit";
import Button from "../UI/Button";
import UpdateBenefit from "./updateBenefit";

const Benefits = () => {
  const [activeTab, setActiveTab] = useState("discount");
  const [selectedBenefitId, setSelectedBenefitId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // This function handles the edit action from any BenefitsCard
  const handleEdit = (id) => {
    setSelectedBenefitId(id); // Set the ID of the benefit to be updated
    setActiveTab("updatebenefits"); // Switch to the update tab
  };

  const handleUpdateSuccess = () => {
    setActiveTab("discount");
    setSelectedBenefitId(null);
    setShowSuccessModal(true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-end sm:items-center mb-4">
        <Button
          variant="primary"
          icon={<Plus className="h-4 w-4 mr-2" />}
          onClick={() => setActiveTab("addbenefits")}
        >
          Add New Benefits
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap -mb-px">
>>>>>>> master
            <button
              onClick={() => setActiveTab("discount")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors duration-200
                ${
                  activeTab === "discount"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
<<<<<<< HEAD
              <Tag className="inline-block h-4 w-4 mr-2" /> Discount
            </button>
            <button
              onClick={() => setActiveTab("medicalAssistance")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors duration-200
                ${
                  activeTab === "medicalAssistance"
=======
              <PercentIcon className="inline-block h-4 w-4 mr-2" /> Discount
            </button>
            <button
              onClick={() => setActiveTab("financialAssistance")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors duration-200
                ${
                  activeTab === "financialAssistance"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              <HandCoins className="inline-block h-4 w-4 mr-2" /> Financial
              Assistance
            </button>
            <button
              onClick={() => setActiveTab("medicalBenefits")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors duration-200
                ${
                  activeTab === "medicalBenefits"
>>>>>>> master
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              <Stethoscope className="inline-block h-4 w-4 mr-2" /> Medical
<<<<<<< HEAD
              Assistance
            </button>
            <button
              onClick={() => setActiveTab("socialProgram")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors duration-200
                ${
                  activeTab === "socialProgram"
=======
              Benefits
            </button>
            <button
              onClick={() => setActiveTab("perksAndPrev")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors duration-200
                ${
                  activeTab === "perksAndPrev"
>>>>>>> master
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
<<<<<<< HEAD
              <HelpingHand className="inline-block h-4 w-4 mr-2" /> Social
              Program
=======
              <ShieldCheck className="inline-block h-4 w-4 mr-2" />
              Privileges and Perks
            </button>
            <button
              onClick={() => setActiveTab("ra")}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm transition-colors duration-200
                ${
                  activeTab === "ra"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              <BookOpenTextIcon className="inline-block h-4 w-4 mr-2" />
              Republic Acts
>>>>>>> master
            </button>
          </nav>
        </div>
        <div className="p-6">
<<<<<<< HEAD
          {activeTab === "discount" && <Discount />}
          {activeTab === "medicalAssistance" && <MedicalAssistance />}
          {activeTab === "socialProgram" && <SocialProgram />}
        </div>
      </div>
    </div>
=======
          {/* Pass the handleEdit function as a prop to the components that render BenefitsCards */}
          {activeTab === "discount" && <Discount onEdit={handleEdit} />}
          {activeTab === "financialAssistance" && (
            <FinancialAssistance onEdit={handleEdit} />
          )}
          {activeTab === "medicalBenefits" && (
            <MedicalBenefits onEdit={handleEdit} />
          )}
          {activeTab === "perksAndPrev" && <PerksAndPrev onEdit={handleEdit} />}
          {activeTab === "ra" && <RepublicActs onEdit={handleEdit} />}

          {activeTab === "addbenefits" && <AddBenefit />}
          {activeTab === "updatebenefits" && (
            <UpdateBenefit
              benefitId={selectedBenefitId}
              onSuccess={handleUpdateSuccess}
            />
          )}
        </div>
      </div>
      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Success"
      >
        <div className="p-6 text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Success</h3>
          <p className="text-sm text-gray-600 mb-4">
            Benefit updated successfully!
          </p>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            OK
          </Button>
        </div>
      </Modal>
    </>
>>>>>>> master
  );
};

export default Benefits;
