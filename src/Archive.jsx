import React, { useState, useEffect } from "react";
import { FaSearch, FaFolder } from "react-icons/fa";
import Sidebar from "./Sidebar";
import SalesReport from "./ArchiveSalesReport"; // Assuming SalesReport component exists
import UserList from "./UserList"; // Assuming UserList component exists
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./config/firebaseConfig"; // Adjust the path based on your Firebase setup

const ArchiveComponent = () => {
  const [archivedEvents, setArchivedEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArchivedEvents = async () => {
      try {
        const eventsCollection = collection(db, "events");
        const archivedEventsQuery = query(
          eventsCollection,
          where("eventStatus", "==", "archived")
        );
        const snapshot = await getDocs(archivedEventsQuery);
        const eventsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArchivedEvents(eventsData);
      } catch (error) {
        console.error("Error fetching archived events: ", error);
        setError("Failed to fetch archived events.");
      }
    };

    fetchArchivedEvents();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFolderClick = async (eventId) => {
    const event = archivedEvents.find((event) => event.id === eventId);
    setSelectedEvent(event);

    if (event) {
      setLoading(true);
      try {
        const customersCollection = collection(
          db,
          `events/${eventId}/customers`
        );
        const customersSnapshot = await getDocs(customersCollection);
        const customersData = customersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched customers data:", customersData);
        setCustomers(customersData);
      } catch (error) {
        console.error("Error fetching customers: ", error);
        setError("Failed to fetch customers.");
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredArchivedEvents = archivedEvents.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="font-kanit flex-1 flex flex-col pt-16 pr-5 pl-5 pb-5 lg:ml-64">
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-4 flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="relative flex-1 w-full lg:w-auto mb-4 lg:mb-0 lg:mr-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 bg-gray-700 text-white"
                  placeholder="Search archived events..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredArchivedEvents.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between cursor-pointer hover:bg-gray-700"
                onClick={() => handleFolderClick(event.id)}
              >
                <div className="flex items-center">
                  <FaFolder className="text-purple-400 mr-4" />
                  <div>
                    <p className="font-medium text-gray-200">{event.name}</p>
                    <p className="text-sm text-gray-300">
                      {event.eventStartDate}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {loading && <p className="mt-4 text-gray-400">Loading customers...</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        {selectedEvent && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">
              Sales Report for {selectedEvent.name}
            </h2>
            <SalesReport data={customers} />
          </div>
        )}

        {selectedEvent && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-purple-400">
              Participants for {selectedEvent.name}
            </h2>
            <UserList data={customers} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchiveComponent;
