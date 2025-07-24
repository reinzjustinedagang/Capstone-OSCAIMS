import React, { useState, useEffect } from "react";
import { Tag, Info, MapPin } from "lucide-react";
import BenefitsCard from "../UI/BenefitsCard";

const sampleDiscounts = [
  {
    id: 1,
    title: "20% Discount on Medicines",
    description:
      "Senior citizens are entitled to a 20% discount and VAT exemption on the purchase of medicines and essential drugs.",
    location: "All pharmacies in San Jose",
    provider: "Republic Act 9994",
  },
  {
    id: 2,
    title: "Movie Ticket Discount",
    description:
      "Seniors can enjoy a 20% discount on movie tickets at local cinemas.",
    location: "San Jose Public Market Cinema",
    provider: "Local Government Ordinance",
  },
  {
    id: 3,
    title: "Public Transportation Discount",
    description:
      "20% fare discount for land, air, and sea travel for senior citizens.",
    location: "Tricycles, Vans, Bus Terminals",
    provider: "LTFRB Regulation",
  },
  {
    id: 4,
    title: "Utility Bill Discount",
    description:
      "A 5% discount on monthly water and electricity bills for low-income senior citizens consuming below threshold.",
    location: "San Jose Electric & Water Services",
    provider: "RA 9994 Section 4",
  },
];

const Discount = () => {
  const [discounts, setDiscounts] = useState([]);

  useEffect(() => {
    // Replace this with API fetch later
    setDiscounts(sampleDiscounts);
  }, []);

  return (
    <>
      <h1 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <Tag className="w-6 h-6 text-blue-600" />
        Senior Citizen Discounts in San Jose, Occidental Mindoro
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {discounts.map((item) => (
          <BenefitsCard
            key={item.id}
            type={item}
            textColor="text-blue-700"
            textIcon="text-blue-500"
          />
        ))}
      </div>
    </>
  );
};

export default Discount;
