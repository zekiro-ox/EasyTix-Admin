import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import Logo from "./assets/CompanyLogo.png";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const events = [
  { id: 1, name: "Event 1", description: "Description for Event 1" },
  { id: 2, name: "Event 2", description: "Description for Event 2" },
  { id: 3, name: "Event 3", description: "Description for Event 3" },
  { id: 4, name: "Event 4", description: "Description for Event 4" },
  { id: 5, name: "Event 5", description: "Description for Event 5" },
  { id: 6, name: "Event 6", description: "Description for Event 6" },
  { id: 7, name: "Event 7", description: "Description for Event 7" },
  { id: 8, name: "Event 8", description: "Description for Event 8" },
  { id: 9, name: "Event 9", description: "Description for Event 9" },
];

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 3 },
  desktop: { breakpoint: { max: 1024, min: 768 }, items: 2 },
  tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const OrganizerDashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    navigate(`/event/${event.id}`);
  };

  const handleLogout = () => {
    // Perform logout actions here (e.g., clear local storage, etc.)
    // For now, let's simulate a logout by clearing localStorage
    localStorage.clear();
    navigate("/organizer-login"); // Redirect to organizer login page
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="flex items-center justify-between p-4 bg-gray-800">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Company Logo" className="h-12" />
        </Link>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="relative">
          <FaUserCircle
            className="h-8 w-12 text-white cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1">
              <button
                className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="flex-shrink-0 w-5 h-5 transition duration-75" />
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="flex flex-col items-center p-8">
        {selectedEvent ? (
          <h2 className="text-4xl font-bold mb-6">
            {selectedEvent.name} Details
          </h2>
        ) : (
          <>
            <h2 className="text-4xl font-bold mb-6">Events</h2>
            <div className="w-full max-w-4xl">
              <Carousel responsive={responsive}>
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="cursor-pointer bg-gray-800 p-4 m-2 rounded-lg shadow-lg"
                    onClick={() => handleEventClick(event)}
                  >
                    <h3 className="text-2xl font-bold">{event.name}</h3>
                    <p className="text-lg">{event.description}</p>
                  </div>
                ))}
              </Carousel>
            </div>
            <div className="mt-10">
              <h2 className="text-4xl font-bold mb-6">Sales and Feedback</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold mb-2">Total Customers</h3>
                  <p className="text-lg">150</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold mb-2">
                    Average Customers Per Event
                  </h3>
                  <p className="text-lg">50</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg col-span-2">
                  <h3 className="text-2xl font-bold mb-2">Feedbacks</h3>
                  <p className="text-lg">Great event, enjoyed it!</p>
                  <p className="text-lg">Could improve on logistics.</p>
                  <p className="text-lg">
                    Amazing experience, would attend again!
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default OrganizerDashboard;
