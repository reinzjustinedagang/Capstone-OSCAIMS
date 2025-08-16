import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header"; // Assuming Header is in the same directory
import {
  UsersIcon,
  Newspaper,
  Star,
  BookOpenText,
  MessageCircle,
  MapPin,
  Calendar,
  Phone,
  ArrowRight,
  UserPlus,
  Info,
  CalendarDays,
  CircleCheck,
} from "lucide-react";

// Reusable component for a feature or program card
const InfoCard = ({ icon, title, description, color }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl border border-gray-100">
    <div
      className={`p-4 rounded-full mb-4 text-white`}
      style={{ backgroundColor: color }}
    >
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

// RACard Component (reused from the original page)
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

const Home = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(1250); // Initial mock count
  const [animatedCount, setAnimatedCount] = useState(0); // For animation

  // Animate the registered count on component mount
  useEffect(() => {
    let start = 0;
    const end = registeredCount;
    if (start === end) return;

    const incrementTime = 2000 / end;
    const timer = setInterval(() => {
      start += 1;
      setAnimatedCount(start);
      if (start === end) {
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [registeredCount]);

  useEffect(() => {
    // Scroll to section if scrollToId is present in location state
    if (location.state?.scrollToId) {
      const section = document.getElementById(location.state.scrollToId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Mock data for the new sections
  const programs = [
    {
      icon: <UsersIcon className="h-8 w-8" />,
      title: "Social Pension Program",
      description:
        "Providing monthly financial assistance to indigent senior citizens to augment their daily subsistence.",
      color: "#3B82F6", // blue-500
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Health & Wellness Programs",
      description:
        "Regular health check-ups, wellness seminars, and fitness activities to promote an active lifestyle.",
      color: "#EC4899", // pink-500
    },
    {
      icon: <CalendarDays className="h-8 w-8" />,
      title: "Community Events",
      description:
        "Organizing social gatherings, celebrations, and recreational trips to foster a strong sense of community.",
      color: "#10B981", // green-500
    },
  ];

  const newsItems = [
    {
      id: 1,
      title: "OSCA announces new schedule for pension payout",
      date: "October 26, 2023",
      snippet:
        "The Office of Senior Citizen Affairs has released the new payout schedule for social pension. Beneficiaries are advised to check the official notice board.",
    },
    {
      id: 2,
      title: "Free flu shots offered for senior citizens this November",
      date: "October 19, 2023",
      snippet:
        "In partnership with the local health office, OSCA is providing free flu vaccinations. Please register at the OSCA office to secure a slot.",
    },
    {
      id: 3,
      title: "Senior Citizen Fun Run for a Cause set for December",
      date: "October 10, 2023",
      snippet:
        "Join us for a day of fun and fitness! All proceeds from the fun run will be used to fund health programs for indigent seniors.",
    },
  ];

  const howToRegisterSteps = [
    {
      icon: <UserPlus className="h-8 w-8" />,
      title: "Step 1: Get an application form",
      description:
        "Visit the Office of Senior Citizen Affairs (OSCA) at the Municipal Hall to get your application form.",
      color: "#F59E0B", // amber-500
    },
    {
      icon: <Info className="h-8 w-8" />,
      title: "Step 2: Submit requirements",
      description:
        "Provide a photocopy of your birth certificate and a valid ID to verify your age and residency.",
      color: "#EF4444", // red-500
    },
    {
      icon: <CircleCheck className="h-8 w-8" />,
      title: "Step 3: Receive your ID",
      description:
        "Upon successful verification, you will receive your official Senior Citizen ID, granting you access to all benefits.",
      color: "#3B82F6", // blue-500
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-inter">
      <Header onMenuClick={toggleSidebar} />

      {/* Banner Section */}
      <section
        id="banner"
        className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100"
      >
        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight animate-fade-in-up">
            Your Hub for Senior Citizen Services
          </h1>
          <p className="mt-8 text-lg md:text-xl font-medium text-gray-600 leading-relaxed animate-fade-in-up animation-delay-500">
            A centralized platform for managing programs, benefits, and
            information for seniors in San Jose, Occidental Mindoro.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-1000">
            <a
              href="#how-to-register"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-blue-700 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              How to Register
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Total Registered Section */}
      <section
        id="total-registered"
        className="py-20 px-6 bg-white border-t border-gray-100"
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-600 uppercase tracking-wider mb-2">
            San Jose, Occidental Mindoro
          </p>
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-blue-600 mb-2 animate-pulse-count">
            {animatedCount.toLocaleString()}
          </h2>
          <p className="text-2xl font-semibold text-gray-900">
            Registered Senior Citizens
          </p>
        </div>
      </section>

      {/* Programs Section */}
      <section
        id="programs"
        className="py-20 px-6 bg-gray-50 border-t border-gray-100"
      >
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Programs & Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We are committed to providing comprehensive support through various
            programs designed to meet the needs of our senior community.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {programs.map((program, index) => (
            <InfoCard key={index} {...program} />
          ))}
        </div>
      </section>

      {/* How to Register Section */}
      <section
        id="how-to-register"
        className="py-20 px-6 bg-white border-t border-gray-100"
      >
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-purple-700 mb-4">
            How to Register as a Senior Citizen
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Follow these simple steps to get your Senior Citizen ID and enjoy
            the benefits.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {howToRegisterSteps.map((step, index) => (
            <InfoCard key={index} {...step} />
          ))}
        </div>
      </section>

      {/* Latest News Section */}
      <section
        id="news"
        className="py-20 px-6 bg-gray-50 border-t border-gray-100"
      >
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Latest News & Updates
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay informed with the latest announcements, events, and important
            notices from OSCA.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {newsItems.map((news) => (
            <div
              key={news.id}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all duration-200 hover:shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {news.title}
              </h3>
              <p className="text-sm text-gray-500 mb-3">{news.date}</p>
              <p className="text-gray-700">{news.snippet}</p>
            </div>
          ))}
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
            icon={<BookOpenText className="h-8 w-8" />}
            title="RA 9994 – Expanded Senior Citizens Act of 2010"
            description="This act provides additional benefits and privileges to senior citizens, including discounts on various goods and services, and expanded healthcare benefits."
          />
          <RACard
            icon={<BookOpenText className="h-8 w-8" />}
            title="RA 10645 – Mandatory PhilHealth Coverage"
            description="Ensures that all senior citizens are automatically covered by the National Health Insurance Program (PhilHealth), providing them with essential healthcare access."
          />
          <RACard
            icon={<BookOpenText className="h-8 w-8" />}
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
          <h2 className="text-4xl font-bold text-blue-700 mb-4">
            Get in Touch with OSCA
          </h2>
          <p className="text-lg text-gray-600">
            We're here to assist you. Feel free to reach out to the Office of
            Senior Citizen Affairs (OSCA) in San Jose, Occidental Mindoro,
            through the following contact channels.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-8">
            <div className="flex items-center text-lg text-gray-700">
              <MessageCircle className="h-6 w-6 mr-3 text-blue-600" />
              <span className="font-medium">OSCA Facebook Page</span>
            </div>
            <div className="flex items-center text-lg text-gray-700">
              <Phone className="h-6 w-6 mr-3 text-green-600" />
              <span className="font-medium">0912-345-6789</span>
            </div>
            <div className="flex items-center text-lg text-gray-700 text-left">
              <MapPin className="h-6 w-6 mr-3 text-red-600" />
              <span className="font-medium">
                San Jose Municipal Hall, Occidental Mindoro
              </span>
            </div>
          </div>
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

export default Home;
