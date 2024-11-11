import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaCalendarAlt } from "react-icons/fa";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "./config/firebaseConfig"; // Import Firestore functions
import Logo from "./assets/CompanyLogo.png";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./OrganizerDashboard.css"; // Import CSS for animations

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 3 },
  desktop: { breakpoint: { max: 1024, min: 768 }, items: 2 },
  tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]); // State for storing events
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [totalTicketsSold, setTotalTicketsSold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageTicketsPerDay, setAverageTicketsPerDay] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]); // State to hold feedback data// State for logout loading animation
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const db = getFirestore();
      const eventsCollection = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsCollection);
      const currentDate = new Date(); // Get the current date

      const eventsList = eventsSnapshot.docs
        .map((doc) => ({
          id: doc.id, // Include the document ID
          ...doc.data(),
        }))
        .filter((event) => {
          const startDate = new Date(event.startDate);
          const endDate = new Date(event.endDate); // Assuming you have an eventEndDate field
          return (
            event.eventStatus !== "archived" && // Check if the event is not archived
            startDate <= currentDate && // Check if the event has started
            endDate >= currentDate // Check if the event has not ended
          );
        });

      setEvents(eventsList); // Set the fetched events to state
    };

    fetchEvents();
  }, []);
  useEffect(() => {
    const fetchSalesData = async () => {
      const salesDataArray = [];
      const eventsRef = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsRef);

      for (const eventDoc of eventsSnapshot.docs) {
        const customersRef = collection(eventDoc.ref, "customers");
        const customersSnapshot = await getDocs(customersRef);

        let totalTickets = 0;
        let totalRevenueForEvent = 0;

        customersSnapshot.forEach((customerDoc) => {
          const data = customerDoc.data();
          const quantity = data.quantity || 0;
          const ticketPrice = data.totalAmount || 0;

          totalTickets += quantity;
          totalRevenueForEvent += ticketPrice;
        });

        salesDataArray.push({
          eventId: eventDoc.id,
          ticketsSold: totalTickets,
          revenue: totalRevenueForEvent,
        });
      }

      // Calculate total tickets sold, total revenue, and average tickets per day
      const totalTickets = salesDataArray.reduce(
        (acc, item) => acc + item.ticketsSold,
        0
      );
      const totalRev = salesDataArray.reduce(
        (acc, item) => acc + item.revenue,
        0
      );
      const averageTickets =
        salesDataArray.length > 0 ? totalTickets / salesDataArray.length : 0;

      setTotalTicketsSold(totalTickets);
      setTotalRevenue(totalRev);
      setAverageTicketsPerDay(averageTickets);
    };

    fetchSalesData();
  }, []);
  useEffect(() => {
    const fetchFeedbacks = async () => {
      const feedbackArray = [];
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);

      for (const userDoc of usersSnapshot.docs) {
        const feedbackRef = collection(userDoc.ref, "feedback");
        const feedbackSnapshot = await getDocs(feedbackRef);

        feedbackSnapshot.forEach((feedbackDoc) => {
          const feedbackData = feedbackDoc.data();
          const createdAt = feedbackData.createdAt.toDate().toLocaleString(); // Convert Firestore timestamp to readable format
          const feedbackText = feedbackData.feedback; // Assuming the feedback field is named 'feedback'

          feedbackArray.push({
            id: feedbackDoc.id,
            username: userDoc.data().username, // Fetch username from user document
            feedback: feedbackText,
            createdAt: createdAt,
          });
        });
      }

      setFeedbacks(feedbackArray);
    };

    fetchFeedbacks();
  }, []);
  // Function to format date
  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Function to format time
  const getFormattedTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}`); // Assuming timeString is in HH:MM format
    return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    navigate(`/event/${event.id}`, { state: { event } }); // Pass the event data
  };

  const handleLogout = () => {
    setIsLoggingOut(true); // Start logout animation

    // Simulate logout process with a timeout
    setTimeout(() => {
      // Perform logout actions (e.g., clear session, redirect)
      localStorage.clear(); // Example: Clear local storage
      navigate("/organizer-login"); // Redirect to login page after logout
      setIsLoggingOut(false); // Stop logout animation after a short delay
    }, 2000); // Simulate a delay for demo purposes
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white font-kanit">
      <header className="font-kanit flex items-center justify-between p-4 bg-gray-800">
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Company Logo" className="h-8" />
        </Link>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="relative">
          <FaUserCircle
            className="h-8 w-12 text-white cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          />
          {showDropdown && (
            <div
              className={`dropdown-menu ${
                showDropdown ? "fade-in" : "fade-out"
              }`}
            >
              <button
                className="block w-full bg-gray-800 text-left px-4 py-2 text-white hover:bg-purple-900 rounded-lg flex items-center"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="flex-shrink-0 w-5 h-5 transition duration-75 mr-2" />
                {isLoggingOut ? "Logging Out..." : "Logout"}
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
                    className="cursor-pointer bg-purple-900 p-4 m-2 rounded-lg shadow-lg drop-shadow-lg"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-center mb-2">
                      <FaCalendarAlt className="text-white mr-2" />
                      <h3 className="text-2xl font-bold">{event.name}</h3>
                    </div>
                    <p className="text-lg">
                      {/* Use the new functions to format date and time */}
                      {getFormattedDate(event.eventStartDate)}{" "}
                      {getFormattedTime(event.startTime)}
                    </p>
                  </div>
                ))}
              </Carousel>
            </div>
            <div className="mt-10">
              <h2 className="text-4xl font-bold mb-6">Sales and Feedback</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-purple-900 p-6 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold mb-2">
                    Total Tickets Sold
                  </h3>
                  <p className="text-lg">{totalTicketsSold} tickets sold</p>
                </div>
                <div className="bg-purple-900 p-6 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold mb-2">Total Revenue</h3>
                  <p className="text-lg">₱ {totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-purple-900 p-6 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold mb-2">
                    Average Tickets per Event
                  </h3>
                  <p className="text-lg">
                    {averageTicketsPerDay.toFixed(2)} tickets
                  </p>
                </div>
                <div className="bg-purple-900 p-6 rounded-lg shadow-lg col-span-2">
                  <h3 className="text-2xl font-bold mb-2">Feedbacks</h3>
                  {feedbacks.length > 0 ? (
                    feedbacks.map((feedback) => (
                      <div
                        key={feedback.id}
                        className="bg-gray-800 p-4 rounded-lg mb-2"
                      >
                        <h4 className="text-lg font-semibold text-purple-400">
                          {feedback.username}
                        </h4>
                        <p className="text-gray-300">{feedback.feedback}</p>
                        <p className="text-gray-500 text-sm">
                          {feedback.createdAt}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-300">No feedback available.</p>
                  )}
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
