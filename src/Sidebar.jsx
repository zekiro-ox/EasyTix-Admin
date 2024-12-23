import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaEnvelope,
  FaUsers,
  FaUserShield,
  FaSignOutAlt,
  FaUserFriends,
  FaChartBar,
  FaArchive,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Logo from "./assets/CompanyLogo.png";
import { useMessage } from "./MessageContext";
import { signOut } from "firebase/auth";
import { auth } from "./config/firebaseConfig";

const Sidebar = () => {
  const { newMessageCount } = useMessage();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [isOpen, setIsOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // State for logout loading animation

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  const handleLogout = () => {
    setIsLoggingOut(true); // Start logout animation

    // Simulate logout process with a timeout
    setTimeout(() => {
      // Perform logout actions (e.g., clear session, redirect)
      navigate("/admin-login", { replace: true }); // Redirect to login page after logout
      setIsLoggingOut(false); // Stop logout animation after a short delay
    }, 3000); // Simulate a delay for demo purposes
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Menu Button */}
      <button
        type="button"
        className="fixed top-4 right-4 z-50 p-3 text-sm text-black rounded-full sm:hidden hover:bg-gray-100 shadow-xl drop-shadow-xl"
        onClick={toggleSidebar}
      >
        <span className="sr-only">Toggle sidebar</span>
        {isOpen ? (
          <FaTimes className="w-6 h-6" />
        ) : (
          <FaBars className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
        style={{
          backgroundImage: "linear-gradient(to bottom, #4B0082, #4B0082)",
          // Updated gradient background color to darker purple theme
        }}
      >
        <div className="h-full px-3 py-4 overflow-y-auto m-2">
          <div className="flex items-center justify-center mb-4">
            <img src={Logo} alt="Logo" className="h-20 w-auto" />
          </div>
          <ul className="font-kanit space-y-2 font-medium text-white">
            <li className="flex items-center p-4 rounded text-white font-bold text-2xl">
              <FaUserShield className="flex-shrink-0 w-5 h-5 mr-2" />
              <span className="flex-1 ms-3 whitespace-nowrap">Admin</span>
            </li>
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center p-4 rounded ${
                  activeLink === "/dashboard"
                    ? "bg-gray-200 text-black"
                    : "text-white hover:bg-gray-200 hover:text-black"
                }`}
                onClick={() => handleLinkClick("/dashboard")}
              >
                <MdDashboard className="flex-shrink-0 w-5 h-5 transition duration-75" />
                <span className="flex-1 ms-3 whitespace-nowrap">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/events"
                className={`flex items-center p-4 rounded ${
                  activeLink === "/events"
                    ? "bg-gray-200 text-black"
                    : "text-white hover:bg-gray-200 hover:text-black"
                }`}
                onClick={() => handleLinkClick("/events")}
              >
                <FaCalendarAlt className="flex-shrink-0 w-5 h-5 transition duration-75" />
                <span className="flex-1 ms-3 whitespace-nowrap">Events</span>
              </Link>
            </li>
            <li>
              <Link
                to="/messages"
                className={`flex items-center p-4 rounded ${
                  activeLink === "/messages"
                    ? "bg-gray-200 text-black"
                    : "text-white hover:bg-gray-200 hover:text-black"
                }`}
                onClick={() => handleLinkClick("/messages")}
              >
                <FaEnvelope className="flex-shrink-0 w-5 h-5 transition duration-75" />
                <span className="flex-1 ms-3 whitespace-nowrap">Messages</span>
                {newMessageCount > 0 && (
                  <span className="bg-purple-400 text-white rounded-full px-2 text-xs">
                    {newMessageCount}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link
                to="/users"
                className={`flex items-center p-4 rounded ${
                  activeLink === "/users"
                    ? "bg-gray-200 text-black"
                    : "text-white hover:bg-gray-200 hover:text-black"
                }`}
                onClick={() => handleLinkClick("/users")}
              >
                <FaUsers className="flex-shrink-0 w-5 h-5 transition duration-75" />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Participants
                </span>
              </Link>
            </li>
            {/* Organizer Menu */}
            <li>
              <Link
                to="/organizer"
                className={`flex items-center p-4 rounded ${
                  activeLink === "/organizer"
                    ? "bg-gray-200 text-black"
                    : "text-white hover:bg-gray-200 hover:text-black"
                }`}
                onClick={() => handleLinkClick("/organizer")}
              >
                <FaUserFriends className="flex-shrink-0 w-5 h-5 transition duration-75" />
                <span className="flex-1 ms-3 whitespace-nowrap">Organizer</span>
              </Link>
            </li>
            {/* End of Organizer Menu */}
            {/* Archive Menu */}
            <li>
              <Link
                to="/archive"
                className={`flex items-center p-4 rounded ${
                  activeLink === "/archive"
                    ? "bg-gray-200 text-black"
                    : "text-white hover:bg-gray-200 hover:text-black"
                }`}
                onClick={() => handleLinkClick("/archive")}
              >
                <FaArchive className="flex-shrink-0 w-5 h-5 transition duration-75" />
                <span className="flex-1 ms-3 whitespace-nowrap">Archive</span>
              </Link>
            </li>
            {/* End of Archive Menu */}
            <li>
              <button
                className="flex items-center p-4 rounded text-white w-full hover:bg-gray-200 hover:text-black"
                onClick={handleLogout}
                disabled={isLoggingOut} // Disable button while logging out
              >
                {isLoggingOut ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V2.5a.5.5 0 00-1 0V4a8 8 0 018 8h1.5a.5.5 0 000-1H20a8 8 0 01-8 8v1.5a.5.5 0 001 0V20a8 8 0 01-8-8H2.5a.5.5 0 000 1H4z"
                      ></path>
                    </svg>
                    <span>Logging Out...</span>
                  </div>
                ) : (
                  <>
                    <FaSignOutAlt className="flex-shrink-0 w-5 h-5 transition duration-75" />
                    <span className="ms-3 whitespace-nowrap">Log Out</span>
                  </>
                )}
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
