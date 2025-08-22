import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogIn } from "lucide-react"; // Added LogIn icon for the login button
import logo from "../../assets/osca-logo.png"; // Assuming this path is correct for your logo

// Define navigation items with their names and corresponding section IDs
const navigation = [
  { name: "Home", id: "home" },
  { name: "Features", id: "features" }, // Added Features to navigation
  { name: "About", id: "about" },
  { name: "Republic Acts", id: "ra" },
  { name: "Contact", id: "contact" },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false); // State to control mobile menu visibility
  const [activeId, setActiveId] = useState("home"); // State to highlight active navigation item
  const [isScrolled, setIsScrolled] = useState(false); // State to track scroll for header styling

  // Helper function to scroll to a specific section by its ID
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      // Use smooth scroll behavior for a better user experience
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMenuOpen(false); // Close mobile menu after clicking a link
  };

  // Handles navigation clicks for both internal page sections and external routes
  const handleNavClick = (id) => {
    setActiveId(id); // Set the active ID for highlighting
    if (location.pathname === "/") {
      // If already on the homepage, just scroll
      scrollToSection(id);
    } else {
      // If on a different page, navigate to homepage first, then scroll
      navigate("/");
      // Use a timeout to ensure navigation completes before attempting to scroll
      setTimeout(() => {
        scrollToSection(id);
      }, 300); // Small delay to allow page render
    }
  };

  // Effect to highlight active section based on scroll position (only on homepage)
  useEffect(() => {
    if (location.pathname !== "/") return; // Only apply on the homepage

    const handleScroll = () => {
      // Adjust scroll position to be a third of the way down the viewport for better active state detection
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      // Check if the page has scrolled to apply header styling
      setIsScrolled(window.scrollY > 50); // Becomes true after scrolling down 50px

      // Iterate through navigation items to find the currently active section
      for (const navItem of navigation) {
        const section = document.getElementById(navItem.id);
        if (section) {
          const offsetTop = section.offsetTop;
          const offsetHeight = section.offsetHeight;

          // Determine if the current scroll position is within the bounds of a section
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveId(navItem.id); // Set the active ID
            break; // Exit loop once the active section is found
          }
        }
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Initial call to set active section and scroll state on component mount
    handleScroll();

    // Cleanup: Remove event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]); // Re-run effect if pathname changes

  return (
    <header
      className={`
        sticky inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out
        ${isScrolled ? "bg-white shadow-md" : "bg-blue-100"}
      `}
    >
      <nav
        className="flex items-center justify-between p-4 lg:px-8 max-w-7xl mx-auto" // Added max-w and mx-auto for content centering
        aria-label="Global"
      >
        {/* Logo and Site Title */}
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5 flex items-center">
            <img
              src={logo}
              alt="OSCA Logo"
              className="h-14 w-auto object-contain"
            />
            <div className="ml-3 flex flex-col">
              <span className="font-bold text-blue-800 text-lg sm:text-xl leading-tight">
                Office of the Senior Citizen Affairs
              </span>
              <span className="font-medium text-blue-700 text-sm sm:text-base">
                San Jose, Occidental Mindoro
              </span>
            </div>
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Open main menu"
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-7 w-7" />
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex lg:gap-x-10">
          {" "}
          {/* Adjusted gap */}
          {navigation.map((item) => (
            <button
              key={item.id} // Use item.id as key
              onClick={() => handleNavClick(item.id)}
              className={`
                text-base font-semibold leading-6 relative pb-1
                hover:text-blue-600 transition-colors duration-200
                ${
                  activeId === item.id
                    ? "text-blue-700 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-700 after:rounded-full" // Underline effect
                    : "text-gray-900"
                }
              `}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Desktop Login Button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button
            onClick={() => {
              navigate("/login");
              setMenuOpen(false);
              setActiveId(null); // Clear highlight when navigating to login
            }}
            className={`
              inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-full shadow-sm
              text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            `}
          >
            Log in
            <LogIn className="ml-2 h-5 w-5" /> {/* Added LogIn icon */}
=======
import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  HomeIcon,
  UserPlus,
  InfoIcon,
  LogIn,
  Building,
} from "lucide-react";
import logo from "../../assets/osca-logo.png";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [systemSettings, setSystemSettings] = useState({
    system_name: "",
    municipality: "",
    seal: null,
  });
  const backendUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/settings/`);
        setSystemSettings(res.data);
      } catch (err) {
        console.error("Failed to fetch system settings:", err);
      }
    };
    fetchSystemSettings();
  }, []);

  const navItems = [
    { to: "/", label: "Home", icon: HomeIcon },
    { to: "/organization", label: "Organization", icon: Building },

    { to: "/about", label: "About", icon: InfoIcon },
    { to: "/register-senior", label: "Register", icon: UserPlus },
    { to: "/login", label: "Login", icon: LogIn },
  ];

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-white shadow-md">
      <nav className="flex items-center justify-between p-5 lg:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src={systemSettings.seal || logo}
            alt="OSCA Logo"
            className="h-20 w-auto object-contain"
          />
          <div className="hidden sm:block">
            <h1 className="font-bold text-blue-800 text-2xl">
              {systemSettings.system_name ||
                "Office of the Senior Citizen Affairs"}
            </h1>
            <p className="text-base font-medium">
              {systemSettings.municipality || "San Jose, Occidental Mindoro"}
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex lg:gap-x-6">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${
                  isActive
                    ? "text-blue-700 bg-blue-100"
                    : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
>>>>>>> master
          </button>
        </div>
      </nav>

<<<<<<< HEAD
      {/* Mobile Menu Panel */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm animate-fade-in-overlay">
          {" "}
          {/* Added backdrop blur and fade-in */}
          <div className="px-6 py-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              {" "}
              {/* Adjusted margin */}
              <a href="#" className="-m-1.5 p-1.5 flex items-center">
                <img
                  src={logo}
                  alt="OSCA Logo"
                  className="h-14 w-auto object-contain"
                />
                <div className="ml-3 flex flex-col">
                  <span className="font-bold text-blue-800 text-lg sm:text-xl leading-tight">
                    Office of the Senior Citizen Affairs
                  </span>
                  <span className="font-medium text-blue-700 text-sm sm:text-base">
                    San Jose, Occidental Mindoro
                  </span>
                </div>
              </a>
              <button
                onClick={() => setMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close main menu"
              >
                <span className="sr-only">Close menu</span>
                <X className="h-7 w-7" /> {/* Larger icon */}
              </button>
            </div>
            <div className="flow-root">
              {" "}
              {/* Use flow-root for better spacing */}
              <div className="space-y-4 -my-2">
                {" "}
                {/* Adjusted spacing */}
                {navigation.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`
                      block w-full text-left rounded-lg px-4 py-3 text-lg font-semibold transition-colors duration-200
                      hover:bg-gray-100 hover:text-blue-600
                      ${
                        activeId === item.id
                          ? "text-blue-700 bg-blue-50" // Highlight active item in mobile
                          : "text-gray-900"
                      }
                    `}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
              <div className="py-6 mt-6 border-t border-gray-200">
                {" "}
                {/* Added border-top for separation */}
                <button
                  onClick={() => {
                    navigate("/login");
                    setMenuOpen(false);
                    setActiveId(null);
                  }}
                  className={`
                    inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm
                    text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  `}
                >
                  Log in
                  <LogIn className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
=======
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm">
          <div className="p-6 space-y-6">
            {/* Header + Close */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={systemSettings.seal || logo}
                  alt="OSCA Logo"
                  className="h-12 w-auto"
                />
                <span className="font-bold text-blue-800 text-lg">
                  {systemSettings.system_name ||
                    "Office of the Senior Citizen Affairs"}
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-4">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-lg transition-colors ${
                      isActive
                        ? "text-blue-700 bg-blue-50"
                        : "text-gray-900 hover:bg-gray-100 hover:text-blue-600"
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </NavLink>
              ))}
            </nav>
>>>>>>> master
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
