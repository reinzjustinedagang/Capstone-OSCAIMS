import React, { useEffect, useState } from "react";
import axios from "axios";
import MunicipalOfficials from "./MunicipalOfficials";
import BarangayOfficials from "./BarangayOfficials";

const Officials = () => {
  return (
    <>
      <MunicipalOfficials title="Municipal Federation Officer" />
      <BarangayOfficials title="Barangay Association Presidents" />
    </>
  );
};

export default Officials;
