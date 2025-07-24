import React, { useState, useEffect } from "react";
import { Stethoscope, Info, MapPin } from "lucide-react";
import BenefitsCard from "../UI/BenefitsCard";

const sampleMedicalBenefits = [
  {
    id: 1,
    title: "Free Medical Checkups",
    description:
      "Senior citizens are entitled to regular free checkups in government health facilities.",
    location: "San Jose Municipal Health Center",
    provider: "Local Health Unit",
  },
  {
    id: 2,
    title: "Free Laboratory Services",
    description:
      "Basic laboratory tests such as blood sugar, cholesterol, and urinalysis are offered for free.",
    location: "San Jose Diagnostic Clinic",
    provider: "LGU & DOH Partnership",
  },
  {
    id: 3,
    title: "Vaccination Program",
    description:
      "Free flu and pneumonia vaccines for senior citizens every year.",
    location: "Rural Health Units (RHUs)",
    provider: "DOH Immunization Program",
  },
];

const MedicalBenefits = () => {
  const [benefits, setBenefits] = useState([]);

  useEffect(() => {
    setBenefits(sampleMedicalBenefits);
  }, []);

  return (
    <>
      <h1 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <Stethoscope className="w-6 h-6 text-red-600" />
        Medical Benefits for Senior Citizens
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {benefits.map((item) => (
          <BenefitsCard
            key={item.id}
            type={item}
            textColor="text-red-700"
            textIcon="text-red-500"
          />
        ))}
      </div>
    </>
  );
};

export default MedicalBenefits;
