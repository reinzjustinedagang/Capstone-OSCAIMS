import React, { useState, useEffect } from "react";
import RepublicActCard from "./RepublicActCard"; // Adjust path based on folder structure
import { BookOpenTextIcon } from "lucide-react";

const republicActs = [
  {
    id: 1,
    title: "R.A. 9994 - Expanded Senior Citizens Act of 2010",
    description:
      "An act granting additional benefits and privileges to senior citizens, further amending Republic Act No. 7432, as amended.",
    datePassed: "February 15, 2010",
  },
  {
    id: 2,
    title: "R.A. 9257 - Senior Citizens Act of 2003",
    description:
      "An act granting additional privileges to senior citizens amending R.A. 7432 and for other purposes.",
    datePassed: "February 26, 2004",
  },
  {
    id: 3,
    title: "R.A. 7432 - Original Senior Citizens Law",
    description:
      "An act to maximize the contribution of senior citizens to nation building, grant benefits, and special privileges.",
    datePassed: "April 23, 1992",
  },
];

const RepublicActs = () => {
  const [acts, setActs] = useState([]);

  useEffect(() => {
    setActs(republicActs);
  }, []);

  return (
    <>
      <h1 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <BookOpenTextIcon className="w-6 h-6 text-purple-600" />
        Republic Acts for Senior Citizens
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {acts.map((law) => (
          <RepublicActCard key={law.id} law={law} />
        ))}
      </div>
    </>
  );
};

export default RepublicActs;
