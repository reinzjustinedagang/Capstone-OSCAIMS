import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DemographicReports = () => {
  const ageDistributionData = {
    labels: ["60-65", "66-70", "71-75", "76-80", "81-85", "86+"],
    datasets: [
      {
        label: "Number of Senior Citizens",
        data: [350, 425, 280, 190, 145, 80],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
    ],
  };

  const genderDistributionData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [580, 665],
        backgroundColor: ["rgba(14, 165, 233, 0.6)", "rgba(236, 72, 153, 0.6)"],
      },
    ],
  };

  const healthStatusData = {
    labels: ["Good", "With Maintenance", "Needs Attention", "Critical"],
    datasets: [
      {
        data: [450, 520, 180, 95],
        backgroundColor: [
          "rgba(34, 197, 94, 0.6)",
          "rgba(59, 130, 246, 0.6)",
          "rgba(234, 179, 8, 0.6)",
          "rgba(239, 68, 68, 0.6)",
        ],
      },
    ],
  };

  const barangayDistributionData = {
    labels: [
      "Poblacion",
      "Labangan",
      "San Roque",
      "Pag-asa",
      "Rizal",
      "Others",
    ],
    datasets: [
      {
        label: "Senior Citizens per Barangay",
        data: [280, 245, 210, 185, 195, 130],
        backgroundColor: "rgba(99, 102, 241, 0.5)",
      },
    ],
  };

  const activityStatusData = {
    labels: ["Active", "Inactive", "Deceased"],
    datasets: [
      {
        data: [980, 185, 80],
        backgroundColor: [
          "rgba(34, 197, 94, 0.6)",
          "rgba(234, 179, 8, 0.6)",
          "rgba(239, 68, 68, 0.6)",
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Age Distribution</h3>
          <Bar
            data={ageDistributionData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "bottom" },
              },
            }}
          />
        </div>

        {/* Gender Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Gender Distribution</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Pie
              data={genderDistributionData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "bottom" },
                },
              }}
            />
          </div>
        </div>

        {/* Health Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Health Status</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut
              data={healthStatusData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "bottom" },
                },
              }}
            />
          </div>
        </div>

        {/* Barangay Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">
            Barangay-wise Distribution
          </h3>
          <Bar
            data={barangayDistributionData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "bottom" },
              },
            }}
          />
        </div>

        {/* Activity Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Activity Status</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut
              data={activityStatusData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "bottom" },
                },
              }}
            />
          </div>
        </div>

        {/* Statistical Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Statistical Summary</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Senior Citizens</p>
                <p className="text-2xl font-semibold">1,245</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Age</p>
                <p className="text-2xl font-semibold">72.5</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Members</p>
                <p className="text-2xl font-semibold">980</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">With Health Issues</p>
                <p className="text-2xl font-semibold">275</p>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Key Observations
              </h4>
              <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
                <li>Majority of senior citizens are between 66-70 years old</li>
                <li>Female seniors slightly outnumber male seniors</li>
                <li>78.7% of seniors are actively participating in programs</li>
                <li>
                  Poblacion has the highest concentration of senior citizens
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemographicReports;
