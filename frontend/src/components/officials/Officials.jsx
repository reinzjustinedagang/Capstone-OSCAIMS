import React, { useEffect, useState } from "react";
import axios from "axios";
import MunicipalOfficials from "./MunicipalOfficials";
import BarangayOfficials from "./BarangayOfficials";

const Officials = () => {
  const [municipalOfficials, setMunicipalOfficials] = useState([]);
  const [barangayOfficials, setBarangayOfficials] = useState([]);
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        const [municipalRes, barangayRes] = await Promise.all([
          axios.get(`${backendUrl}/api/officials/municipal`),
          axios.get(`${backendUrl}/api/officials/barangay`),
        ]);

        console.log("Barangay Response:", barangayRes.data); // 👈 DEBUG HERE

        setMunicipalOfficials(municipalRes.data);
        setBarangayOfficials(barangayRes.data);
      } catch (error) {
        console.error("Error fetching officials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfficials();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading officials...</div>;
  }

  return (
    <div>
      {/* <h1 className="text-2xl font-bold mb-6">OSCA Officials Directory</h1> */}
      <MunicipalOfficials
        title="Municipal Federation Officer"
        members={municipalOfficials}
      />
      <BarangayOfficials barangays={barangayOfficials} />
    </div>
  );
};

export default Officials;
