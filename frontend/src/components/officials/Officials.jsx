import React, { useState } from "react";
import { UserIcon } from "lucide-react"; // Added UsersIcon for group

const Officials = () => {
  // Use useState to manage the officials data, making it mutable and "future-proof" for updates.
  // In a real application, this data would likely come from an API.
  const [officialsData, setOfficialsData] = useState({
    municipal: {
      title: "Municipal Federation Officer",
      members: [
        {
          id: 1,
          position: "Head - Office of Senior Citizens Affairs",
          name: "Juan Dela Cruz",
          type: "head", // Added type for hierarchical rendering
        },
        {
          id: 4,
          position: "Vice Head - Office of Senior Citizens Affairs",
          name: "Anna Lim",
          type: "vice", // New Vice position
        },
        {
          id: 2,
          position: "Secretary",
          name: "Maria Santos",
          type: "officer", // General officer
        },
        {
          id: 3,
          position: "Treasurer",
          name: "Pedro Reyes",
          type: "officer",
        },
        {
          id: 5,
          position: "Auditor",
          name: "Sofia Garcia",
          type: "officer",
        },
        {
          id: 6,
          position: "Public Relations Officer (PRO)",
          name: "Daniel Tan",
          type: "officer",
        },
        // Add more municipal officials here as needed, with appropriate 'type'
      ],
    },
    barangay: [
      {
        id: 101,
        name: "Brgy. Poblacion",
        president: "Ricardo Dalisay",
        position: "President", // Added position for display
      },
      {
        id: 102,
        name: "Brgy. Labangan",
        president: "Gloria Magtanggol",
        position: "President",
      },
      {
        id: 103,
        name: "Brgy. San Roque",
        president: "Eduardo Santos",
        position: "President",
      },
      {
        id: 104,
        name: "Brgy. Pag-asa",
        president: "Rosario Luna",
        position: "President",
      },
      {
        id: 105,
        name: "Brgy. Rizal",
        president: "Fernando Torres",
        position: "President",
      },
      // Add more barangay officials here as needed
    ],
  });

  // Example function to update an official (demonstrates future-proofing)
  // In a real app, you'd likely have a form or modal for this.
  const Officials = (id, newOfficialData) => {
    setOfficialsData((prevData) => {
      // Check if it's a municipal official
      const updatedMunicipalMembers = prevData.municipal.members.map((member) =>
        member.id === id ? { ...member, ...newOfficialData } : member
      );

      if (updatedMunicipalMembers.some((member) => member.id === id)) {
        // Check if an ID was found in municipal
        return {
          ...prevData,
          municipal: {
            ...prevData.municipal,
            members: updatedMunicipalMembers,
          },
        };
      }

      // Check if it's a barangay official
      const updatedBarangayMembers = prevData.barangay.map((barangay) =>
        barangay.id === id ? { ...barangay, ...newOfficialData } : barangay
      );

      if (updatedBarangayMembers.some((barangay) => barangay.id === id)) {
        // Check if an ID was found in barangay
        return {
          ...prevData,
          barangay: updatedBarangayMembers,
        };
      }

      return prevData; // No match, return original state
    });
  };

  const headOfficial = officialsData.municipal.members.find(
    (o) => o.type === "head"
  );
  const viceOfficial = officialsData.municipal.members.find(
    (o) => o.type === "vice"
  );
  const otherOfficials = officialsData.municipal.members.filter(
    (o) => o.type === "officer"
  );

  return (
    <div className="bg-gray-100 min-h-screen rounded-lg">
      <h1 className="text-2xl font-bold mb-6">OSCA Officials Directory</h1>

      {/* Municipal Officials - Organizational Chart */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200 mb-6">
          <h2 className="text-lg font-semibold">
            {officialsData.municipal.title}
          </h2>
        </div>

        <div className="flex flex-col items-center space-y-8">
          {/* Head Official */}
          {headOfficial && (
            <div
              key={headOfficial.id}
              className="relative bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl shadow-lg w-full max-w-sm border-4 border-blue-600 text-center"
            >
              <div className="bg-blue-700 p-3 rounded-full text-white mb-3 shadow-inner">
                <UserIcon className="h-8 w-8" />
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-1">
                {headOfficial.name}
              </p>
              <p className="text-sm font-medium text-blue-800 ">
                {headOfficial.position}
              </p>
            </div>
          )}

          {/* Line connecting Head to Vice */}
          {headOfficial && viceOfficial && (
            <div className="w-0.5 h-8 bg-blue-400"></div>
          )}

          {/* Vice Official */}
          {viceOfficial && (
            <div
              key={viceOfficial.id}
              className="relative bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-md w-full max-w-sm border-2 border-blue-400 text-center"
            >
              <div className="bg-blue-500 p-3 rounded-full text-white mb-3 shadow-inner">
                <UserIcon className="h-7 w-7" />
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-1">
                {viceOfficial.name}
              </p>
              <p className="text-sm font-medium text-blue-800">
                {viceOfficial.position}
              </p>
            </div>
          )}

          {/* Line connecting Vice to other officers */}
          {viceOfficial && otherOfficials.length > 0 && (
            <div className="relative w-full flex justify-center">
              <div className="w-0.5 h-8 bg-blue-400"></div>
              <div className="absolute top-8 w-1/2 h-0.5 bg-blue-400"></div>
            </div>
          )}

          {/* Other Officials (split into columns) */}
          {otherOfficials.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 w-full max-w-2xl m-6">
              {otherOfficials.map((official) => (
                <div
                  key={official.id}
                  className="relative bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl shadow-sm border border-blue-200 flex flex-col items-center text-center"
                >
                  <div className="bg-blue-400 p-2 rounded-full text-white mb-2 shadow-inner">
                    <UserIcon className="h-6 w-6" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mb-1">
                    {official.name}
                  </p>
                  <p className="text-sm font-medium text-blue-800">
                    {official.position}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Barangay Officials - Simplified Queue/List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h2 className="text-lg font-semibold">
            Barangay Association Presidents
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {officialsData.barangay.map((barangay) => (
            <div
              key={barangay.id}
              className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl overflow-hidden shadow-md transition-transform transform hover:scale-103 text-center p-5 flex flex-col items-center"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {barangay.name}
              </h3>
              <div className="flex flex-col items-center mt-3">
                <div className="bg-green-200 p-2 rounded-full text-green-700 mb-2">
                  <UserIcon className="h-6 w-6" />
                </div>
                <p className="text-md font-semibold text-gray-800">
                  {barangay.president}
                </p>
                <p className="text-sm font-medium text-blue-800">
                  {barangay.position}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Officials;
