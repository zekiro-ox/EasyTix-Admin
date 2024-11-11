import React, { useState, useEffect } from "react";
import { FaSearch, FaFolder } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./config/firebaseConfig"; // Import your Firestore instance

const UsersComponent = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]); // To hold the events

  useEffect(() => {
    const fetchEvents = async () => {
      // Fetch events from Firestore
      const eventsCollection = collection(db, "events");
      const eventDocs = await getDocs(eventsCollection);
      const eventList = eventDocs.docs
        .map((doc) => ({
          id: doc.id,
          name: doc.data().name, // Assuming the event name is stored in the 'name' field
          eventStartDate: doc.data().eventStartDate, // Fetch the event start date
          eventStatus: doc.data().eventStatus, // Fetch the event status
        }))
        .filter((event) => event.eventStatus !== "archived"); // Filter out archived events

      setEvents(eventList);
    };

    fetchEvents();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFolderClick = async (eventId) => {
    // Find the selected event
    const selectedEvent = events.find((event) => event.id === eventId);

    // Check if the event is archived
    if (selectedEvent && selectedEvent.eventStatus === "archived") {
      toast.error("This event is archived and cannot be accessed.");
      return; // Exit the function if the event is archived
    }

    setSelectedEvent(eventId);
    const customersCollection = collection(db, `events/${eventId}/customers`);
    const customerDocs = await getDocs(customersCollection);
    const customerData = customerDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(customerData);
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = selectedEvent
    ? users.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      })
    : [];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <div className="font-kanit flex-1 flex flex-col pt-16 pr-5 pl-5 pb-5 lg:ml-64">
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-4 flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="relative flex-1 w-full lg:w-auto mb-4 lg:mb-0 lg:mr-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-700 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 bg-gray-700 text-gray-100"
                  placeholder="Search events or users..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {!selectedEvent ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between cursor-pointer hover:bg-gray-700"
                  onClick={() => handleFolderClick(event.id)}
                >
                  <div className="flex items-center">
                    <FaFolder className="text-purple-400 mr-4" />
                    <div>
                      <p className="font-medium text-gray-200">{event.name}</p>
                      <p className="text-sm text-gray-400">
                        {event.eventStartDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="mb-4 text-indigo-400 hover:text-indigo-600"
              >
                Back to Events
              </button>
              {events.length > 0 && (
                <h2 className="text-xl font-bold mb-4 text-gray-200">
                  {events.find((event) => event.id === selectedEvent)?.name}
                </h2>
              )}
              <div className="overflow-x-auto">
                <table className="font-kanit min-w-full bg-gray-700 rounded-lg shadow-md overflow-hidden">
                  <thead className="bg-purple-800 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium tracking-wider">
                        Ticket Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.id}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{`${user.firstName} ${user.lastName}`}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.ticketType}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.quantity}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.totalAmount}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersComponent;
