import React, { useEffect, useState } from "react";
import RegistrationBanner from "./home/RegistrationBanner";
import News from "./home/News";

import Header from "./Header";
import Slideshow from "./home/Slideshow";
import Footer from "./Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <Slideshow />
      <RegistrationBanner />
      <News />
      <Footer />
    </div>
  );
};

export default Home;
