import React, { useState, useEffect } from "react";
import { ShieldCheck, Info, MapPin } from "lucide-react";
import BenefitsCard from "../UI/BenefitsCard";

const samplePerks = [
  {
    id: 1,
    title: "Priority Lanes in Government Offices",
    description:
      "Senior citizens are given priority lanes in banks, hospitals, and government service facilities.",
    location: "All public service offices in San Jose",
    provider: "National Law – RA 9994",
  },
  {
    id: 2,
    title: "Free Wellness and Exercise Programs",
    description:
      "Community wellness programs such as Zumba, tai chi, and low-impact exercise sessions.",
    location: "San Jose Senior Citizen Center",
    provider: "Office of the Senior Citizens Affairs (OSCA)",
  },
  {
    id: 3,
    title: "Health and Nutrition Counseling",
    description:
      "Free counseling sessions to promote proper nutrition and prevent chronic illnesses.",
    location: "Municipal Health Office",
    provider: "Local Health Unit",
  },
];

const PerksAndPrev = () => {
  const [perks, setPerks] = useState([]);

  useEffect(() => {
    setPerks(samplePerks);
  }, []);

  return (
    <>
      <h1 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-indigo-600" />
        Senior Citizen Perks & Preventive Care Programs
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {perks.map((item) => (
          <BenefitsCard
            key={item.id}
            type={item}
            textColor="text-indigo-700"
            textIcon="text-indigo-500"
          />
        ))}
      </div>
    </>
  );
};

export default PerksAndPrev;
