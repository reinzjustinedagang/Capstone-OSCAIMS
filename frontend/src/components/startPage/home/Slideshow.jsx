import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Example announcements/events (later you can fetch from backend)
const eventsData = [];

const Slideshow = () => {
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 5s
  useEffect(() => {
    if (eventsData.length === 0) return; // prevent errors if no events
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % eventsData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Scroll logic
  useEffect(() => {
    if (location.state?.scrollToId) {
      const section = document.getElementById(location.state.scrollToId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  // If no events available
  if (eventsData.length === 0) {
    return (
      <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-200">
        <div className="text-center px-6">
          <h1 className="text-3xl font-bold text-gray-700 mb-2">
            No Events Available
          </h1>
          <p className="text-gray-500">
            Please check back later for announcements and updates.
          </p>
        </div>
      </section>
    );
  }

  // Normal slideshow
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? eventsData.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % eventsData.length);
  };

  return (
    <section className="relative h-[70vh] md:h-[60vh] flex items-center justify-center overflow-hidden rounded-xl shadow-lg my-6 mx-4">
      {/* Slide */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url(${eventsData[currentIndex].image})`,
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 rounded-xl" />
      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-2xl px-6">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
          {eventsData[currentIndex].title}
        </h1>
        <p className="text-base md:text-lg mb-5">
          {eventsData[currentIndex].description}
        </p>
        <a
          href="#how-to-register"
          className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold shadow-lg transition"
        >
          Learn More
          <ArrowRight className="ml-2 h-5 w-5" />
        </a>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 flex justify-center gap-2 w-full">
        {eventsData.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2.5 w-2.5 rounded-full cursor-pointer transition ${
              idx === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Slideshow;
