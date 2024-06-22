import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaArchive,
  FaInfoCircle,
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import Switch from "react-switch";
import AddEventForm from "./AddEventForm";
import EventDetailsModal from "./EventDetailsModal";

const EventComponent = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Event 1",
      description:
        "Description of Event 1. This is a longer description to demonstrate the truncation.",
      status: "Active",
      venue: "Venue A",
    },
    {
      id: 2,
      name: "Event 2",
      description:
        "Description of Event 2. Another description for testing purposes.",
      status: "Inactive",
      venue: "Venue B",
    },
    // Add more events as needed
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEventData, setNewEventData] = useState(null); // State to hold newly added event data

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddEvent = (newEvent) => {
    const maxId =
      events.length > 0 ? Math.max(...events.map((event) => event.id)) : 0;
    newEvent.id = maxId + 1; // Automatically generate ID
    newEvent.status = "Active"; // Set status to Active
    setEvents([...events, newEvent]);
    setNewEventData(newEvent); // Store the newly added event data
    setShowAddForm(false); // Hide the form after adding event
  };

  const handleCancel = () => {
    setShowAddForm(false); // Hide the form when cancel is clicked
  };

  const toggleStatus = (eventId) => {
    const updatedEvents = events.map((event) =>
      event.id === eventId
        ? {
            ...event,
            status: event.status === "Active" ? "Inactive" : "Active",
          }
        : event
    );
    setEvents(updatedEvents);
  };

  const getFirstSentence = (text) => {
    // Split by periods and take the first sentence
    const sentences = text.split(".");
    return sentences[0] + ".";
  };

  const openDetails = (eventId) => {
    const event = events.find((event) => event.id === eventId);
    setSelectedEvent(event);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedEvent(null);
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-purple-50">
      <Sidebar />
      <div className="flex-1 flex flex-col pt-16 pr-5 pl-5 pb-5 lg:ml-64">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4 flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="relative flex-1 w-full lg:w-auto mb-4 lg:mb-0 lg:mr-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-200"
            >
              <FaPlus className="mr-2" />
              Add Event
            </button>
          </div>

          {showAddForm && (
            <AddEventForm onAddEvent={handleAddEvent} onCancel={handleCancel} />
          )}

          {showDetails && selectedEvent && (
            <EventDetailsModal
              event={selectedEvent}
              newEventData={newEventData} // Pass new event data to modal
              onClose={closeDetails}
            />
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                    Venue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.name}
                    </td>
                    <td className="px-6 py-4 whitespace-wrap text-sm text-gray-500">
                      {getFirstSentence(event.description)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.venue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Switch
                        onChange={() => toggleStatus(event.id)}
                        checked={event.status === "Active"}
                        className="react-switch"
                        id={`status-switch-${event.id}`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="flex items-center text-indigo-600 hover:text-indigo-900 mr-2"
                        onClick={() => handleArchive(event.id)}
                      >
                        <FaArchive className="mr-1" />
                        Archive
                      </button>
                      <Link
                        to={`/edit-event/${event.id}`}
                        className="flex items-center text-indigo-600 hover:text-indigo-900 mr-2"
                      >
                        <FaEdit className="mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => openDetails(event.id)} // Open details modal
                        className="flex items-center text-indigo-600 hover:text-indigo-900"
                      >
                        <FaInfoCircle className="mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventComponent;
