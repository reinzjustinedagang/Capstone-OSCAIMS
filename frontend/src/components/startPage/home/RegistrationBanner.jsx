import React, { useEffect, useState } from "react";
import axios from "axios";

const RegistrationBanner = () => {
  const [animatedCount, setAnimatedCount] = useState(0);
  const [citizenCount, setCitizenCount] = useState(0);
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  // Fetch senior citizen count
  const fetchCitizenCount = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/senior-citizens/count/all`
      );
      setCitizenCount(res.data.count);
    } catch (err) {
      console.error("Failed to fetch senior citizen count", err);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchCitizenCount();
  }, []);

  // Animate the count whenever citizenCount changes
  useEffect(() => {
    if (citizenCount === 0) return;

    let start = 0;
    const end = citizenCount;
    const incrementTime = 2000 / end;

    const timer = setInterval(() => {
      start += Math.ceil(end / 200); // speed up animation
      if (start > end) start = end;
      setAnimatedCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [citizenCount]);

  return (
    <section className="bg-gray-100 py-16 px-6 text-center shadow-md my-6">
      <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-2">
        {animatedCount.toLocaleString()}
      </h2>
      <p className="text-lg md:text-xl font-semibold text-yellow-700 mb-4">
        REGISTRANTS AS OF TODAY
      </p>
      <p className="text-gray-600 max-w-2xl mx-auto mb-6">
        Let us build a reliable database of all Filipino Senior Citizens of the
        country. Join the community, register, and be counted today!
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
        <button className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 transition">
          Register Now!
        </button>
        <button className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-800 transition">
          Verify Here!
        </button>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-8 mt-4 text-gray-700">
        <div>
          <p className="font-semibold">How to register?</p>
          <ul className="text-sm">
            <li>
              <a href="#" className="underline hover:text-blue-700">
                Online Registration User Guide
              </a>
            </li>
            <li>
              <a href="#" className="underline hover:text-blue-700">
                Video tutorial on how to register online
              </a>
            </li>
            <li>
              <a href="#" className="underline hover:text-blue-700">
                Watch tutorial in Tagalog
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">View Registration Count</p>
          <a href="#" className="underline hover:text-blue-700 text-sm">
            Registration Distribution by Region
          </a>
        </div>
      </div>
    </section>
  );
};

export default RegistrationBanner;
