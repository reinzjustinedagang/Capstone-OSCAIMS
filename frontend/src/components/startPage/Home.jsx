import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { useLocation } from "react-router-dom";
import Header from "./Header"; // Assuming Header is in the same directory
import {
  ShieldCheckIcon,
  MessageSquareTextIcon,
  FileBarChartIcon,
  HandshakeIcon,
  LightbulbIcon,
  MailIcon,
  PhoneCallIcon,
  MapPinIcon,
  BookOpenTextIcon,
  CalendarDaysIcon,
  UsersIcon,
  ArrowRightIcon,
} from "lucide-react"; // Import more icons for visual appeal

// FeatureCard Component (reusable for the Features section)
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl border border-gray-100">
    <div className="bg-blue-100 p-4 rounded-full mb-4 text-blue-600">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

// RACard Component (reusable for Republic Acts section)
const RACard = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl shadow-md p-5 flex items-start space-x-4 transform transition-transform duration-300 hover:scale-103 hover:shadow-lg border border-gray-100">
    <div className="bg-green-100 p-3 rounded-full text-green-600 flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

export const Home = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar

  useEffect(() => {
    // Scroll to section if scrollToId is present in location state
    if (location.state?.scrollToId) {
      const section = document.getElementById(location.state.scrollToId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  // Function to toggle sidebar visibility (passed to Header)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-inter">
      {" "}
      {/* Applied font-inter */}
      {/* Header component, passing the toggle function for mobile menu */}
      <Header onMenuClick={toggleSidebar} />
      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100"
      >
        {/* Background animation elements */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob top-0 left-0"></div>
          <div className="absolute w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 top-0 right-0"></div>
          <div className="absolute w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 bottom-0 left-1/4"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight animate-fade-in-up">
            Empowering Seniors with a{" "}
            <span className="text-blue-600">Smarter Tomorrow</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl font-medium text-gray-600 leading-relaxed animate-fade-in-up animation-delay-500">
            A centralized system to manage benefits, pensions, and real-time
            updates for senior citizens in San Jose, Occidental Mindoro,
            ensuring efficiency and transparency.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-1000">
            {/* <button
              onClick={() => navigate("/login")} // Example: Link to login or registration
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Get Started
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button> */}
            <a
              href="#features"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-blue-700 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>
      {/* Features Section (New) */}
      <section
        id="features"
        className="py-20 px-6 bg-white border-t border-gray-100"
      >
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Key Features of Our System
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Streamlining operations and enhancing communication for the benefit
            of our senior community.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<UsersIcon className="h-8 w-8" />}
            title="Comprehensive Senior Citizen Database"
            description="Securely manage detailed profiles, health status, and contact information for all registered senior citizens."
          />
          <FeatureCard
            icon={<MessageSquareTextIcon className="h-8 w-8" />}
            title="Automated SMS Notifications"
            description="Send timely updates, announcements, and reminders directly to senior citizens' mobile phones."
          />
          <FeatureCard
            icon={<FileBarChartIcon className="h-8 w-8" />}
            title="Robust Reporting & Analytics"
            description="Generate insightful reports on demographics, benefits distribution, and system activity for better decision-making."
          />
          <FeatureCard
            icon={<HandshakeIcon className="h-8 w-8" />}
            title="Efficient Benefits & Pension Management"
            description="Track and manage the distribution of financial assistance and other benefits with ease and transparency."
          />
          <FeatureCard
            icon={<ShieldCheckIcon className="h-8 w-8" />}
            title="Secure & Accessible Platform"
            description="Ensuring data privacy and ease of access for authorized OSCA officials and staff."
          />
          <FeatureCard
            icon={<CalendarDaysIcon className="h-8 w-8" />}
            title="Activity & Event Tracking"
            description="Organize and monitor community events, health programs, and social gatherings for seniors."
          />
        </div>
      </section>
      {/* About Section */}
      <section
        id="about"
        className="py-20 px-6 bg-gray-50 border-t border-gray-100"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-bold text-blue-800 mb-6 leading-tight">
              About the Senior Citizen Information Management System
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Designed specifically for the Office of the Senior Citizen Affairs
              (OSCA) in San Jose, Occidental Mindoro, this platform is a leap
              forward in public service.
            </p>
            <p className="text-lg text-gray-600">
              It simplifies complex information management, enhances
              communication through automation, and ensures transparency in all
              operations. Our goal is to empower OSCA officials and staff,
              enabling them to provide better, more efficient services, and
              ensuring that no senior is left behind in the digital age.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            {/* Placeholder for an image or illustration */}
            <div className="w-full max-w-md h-64 bg-blue-200 rounded-xl flex items-center justify-center text-blue-700 text-xl font-semibold shadow-xl animate-fade-in-right">
              <LightbulbIcon className="h-12 w-12 mr-3" />
              Innovative Solution
            </div>
          </div>
        </div>
      </section>
      {/* Republic Acts Section */}
      <section id="ra" className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-green-700 mb-4">
            Republic Acts Supporting Our Seniors
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our system is built upon the foundational laws that protect and
            uplift the rights and welfare of senior citizens in the Philippines.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <RACard
            icon={<BookOpenTextIcon className="h-8 w-8" />}
            title="RA 9994 – Expanded Senior Citizens Act of 2010"
            description="This act provides additional benefits and privileges to senior citizens, including discounts on various goods and services, and expanded healthcare benefits."
          />
          <RACard
            icon={<BookOpenTextIcon className="h-8 w-8" />}
            title="RA 10645 – Mandatory PhilHealth Coverage"
            description="Ensures that all senior citizens are automatically covered by the National Health Insurance Program (PhilHealth), providing them with essential healthcare access."
          />
          <RACard
            icon={<BookOpenTextIcon className="h-8 w-8" />}
            title="RA 7432 – Original Senior Citizens Act"
            description="The foundational law that first granted benefits and privileges to the elderly, recognizing their vital contributions to nation-building."
          />
        </div>
      </section>
      {/* Contact Section */}
      <section
        id="contact"
        className="py-20 px-6 bg-gray-50 border-t border-gray-100"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-purple-700 mb-4">
            Get in Touch with OSCA
          </h2>
          <p className="text-lg text-gray-600">
            We're here to assist you. Feel free to reach out to the Office of
            Senior Citizen Affairs (OSCA) in San Jose, Occidental Mindoro,
            through the following contact channels.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-8">
            <div className="flex items-center text-lg text-gray-700">
              <MailIcon className="h-6 w-6 mr-3 text-blue-600" />
              <a
                href="mailto:support@seniorims.ph"
                className="hover:underline text-blue-700 font-medium"
              >
                support@seniorims.ph
              </a>
            </div>
            <div className="flex items-center text-lg text-gray-700">
              <PhoneCallIcon className="h-6 w-6 mr-3 text-green-600" />
              <span className="font-medium">0912-345-6789</span>
            </div>
            <div className="flex items-center text-lg text-gray-700 text-left">
              <MapPinIcon className="h-6 w-6 mr-3 text-red-600" />
              <span className="font-medium">
                San Jose Municipal Hall, Occidental Mindoro
              </span>
            </div>
          </div>
          {/* You could add a simple contact form here if desired */}
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <p className="text-lg font-bold mb-2">Senior Citizen IMS</p>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="text-gray-300 hover:text-white text-sm">
              Privacy Policy
            </a>
            <span className="text-gray-500">|</span>
            <a href="#" className="text-gray-300 hover:text-white text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
=======
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
>>>>>>> master
