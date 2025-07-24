import React, { useState, useEffect } from "react";
import { HandCoins, Info, MapPin } from "lucide-react";
import BenefitsCard from "../UI/BenefitsCard";

const sampleAssistancePrograms = [
  {
    id: 1,
    title: "Social Pension Program",
    description:
      "A monthly stipend of ₱500 given to indigent senior citizens without regular income, support, or pension.",
    location: "DSWD San Jose Office",
    provider: "Department of Social Welfare and Development (DSWD)",
  },
  {
    id: 2,
    title: "Medical Assistance for Seniors",
    description:
      "Financial support for hospitalization, medication, and medical procedures for qualified senior citizens.",
    location: "San Jose Municipal Health Office",
    provider: "Local Government Unit (LGU)",
  },
  {
    id: 3,
    title: "Burial Assistance",
    description:
      "One-time assistance for funeral and burial expenses for the families of deceased senior citizens.",
    location: "Municipal Social Welfare & Development Office",
    provider: "LGU San Jose",
  },
  {
    id: 4,
    title: "Emergency Financial Aid",
    description:
      "Aid provided during calamities, health crises, or family emergencies, upon qualification.",
    location: "Barangay Hall or MSWD Office",
    provider: "LGU / Barangay Council",
  },
];

const FinancialAssistance = () => {
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    // Replace this with actual API call later
    setPrograms(sampleAssistancePrograms);
  }, []);

  return (
    <>
      <h1 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <HandCoins className="w-6 h-6 text-green-600" />
        Financial Assistance Programs for Senior Citizens
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {programs.map((item) => (
          <BenefitsCard
            key={item.id}
            type={item}
            textColor="text-green-700"
            textIcon="text-green-500"
          />
        ))}
      </div>
    </>
  );
};

export default FinancialAssistance;
