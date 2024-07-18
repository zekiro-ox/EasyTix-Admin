import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaArchive,
  FaInfoCircle,
  FaSyncAlt,
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import AddEventForm from "./AddEventForm";
import EventDetailsModal from "./EventDetailsModal";
import ConfirmationModal from "./ConfirmationModal";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { db } from "./config/firebaseConfig"; // Adjust the path based on your Firebase setup

const EventComponent = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEventData, setNewEventData] = useState(null); // State to hold newly added event data
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [eventToArchive, setEventToArchive] = useState(null);

  useEffect(() => {
    // Fetch events from Firestore on component mount
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, "events");
        const snapshot = await getDocs(eventsCollection);
        const eventsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };
    fetchEvents();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddEvent = async (newEvent) => {
    try {
      const eventsRef = collection(db, "events");
      const docRef = await addDoc(eventsRef, newEvent);
      const addedEvent = { id: docRef.id, ...newEvent };
      setEvents([...events, addedEvent]);
      setNewEventData(addedEvent); // Store the newly added event data
      setShowAddForm(false); // Hide the form after adding event
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  const handleEditEvent = async (editedEvent) => {
    try {
      const eventDocRef = doc(db, "events", editedEvent.id);
      await updateDoc(eventDocRef, editedEvent);
      const updatedEvents = events.map((event) =>
        event.id === editedEvent.id ? { ...editedEvent } : event
      );
      setEvents(updatedEvents);
      setSelectedEvent(null); // Clear selected event
      setShowEditForm(false); // Hide edit form after editing
    } catch (error) {
      console.error("Error updating event: ", error);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false); // Hide the add form
    setShowEditForm(false); // Hide the edit form
    setSelectedEvent(null); // Clear selected event
  };

  const handleReloadPage = () => {
    window.location.reload(); // Reload the page
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

  const openEditForm = (eventId) => {
    const eventToEdit = events.find((event) => event.id === eventId);
    setSelectedEvent(eventToEdit);
    setShowEditForm(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedEvent(null);
  };

  const closeEditForm = () => {
    setShowEditForm(false);
    setSelectedEvent(null);
  };

  const handleArchive = (eventId) => {
    const event = events.find((event) => event.id === eventId);
    setEventToArchive(event);
    setShowConfirmation(true);
  };

  const confirmArchive = async () => {
    try {
      const eventDocRef = doc(db, "events", eventToArchive.id);
      await deleteDoc(eventDocRef);
      const updatedEvents = events.filter(
        (event) => event.id !== eventToArchive.id
      );
      setEvents(updatedEvents);
      setShowConfirmation(false);
      setEventToArchive(null);
    } catch (error) {
      console.error("Error archiving event: ", error);
    }
  };

  const cancelArchive = () => {
    setShowConfirmation(false);
    setEventToArchive(null);
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col pt-16 pr-5 pl-5 pb-5 lg:ml-64">
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-4 flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="relative flex-1 w-full lg:w-auto mb-4 lg:mb-0 lg:mr-4">
              <div className="relative">
                <button
                  onClick={handleReloadPage}
                  className="absolute left-0 inset-y-0 px-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  <FaSyncAlt />
                </button>
                <input
                  type="text"
                  className="w-full pl-10 px-4 py-2 rounded-lg border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 bg-gray-600 text-white"
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
              className="flex items-center px-4 py-2 rounded-lg bg-purple-800 text-white hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-200"
            >
              <FaPlus className="mr-2" />
              Add Event
            </button>
          </div>

          {showAddForm && (
            <AddEventForm onAddEvent={handleAddEvent} onCancel={handleCancel} />
          )}

          {showEditForm && selectedEvent && (
            <AddEventForm
              event={selectedEvent}
              onAddEvent={handleEditEvent}
              onCancel={closeEditForm}
            />
          )}

          {showDetails && selectedEvent && (
            <EventDetailsModal
              event={selectedEvent}
              newEventData={newEventData} // Pass new event data to modal
              onClose={closeDetails}
            />
          )}

          {showConfirmation && (
            <ConfirmationModal
              message="Do you want to archive this event?"
              onAccept={confirmArchive}
              onCancel={cancelArchive}
            />
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-700 rounded-lg shadow-md overflow-hidden">
              <thead className="bg-purple-800 text-white">
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
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {event.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {event.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {getFirstSentence(event.description)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {event.venue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <div className="flex">
                        <button
                          onClick={() => openDetails(event.id)}
                          className="mr-2 hover:text-purple-400"
                          title="Details"
                        >
                          <FaInfoCircle />
                        </button>
                        <button
                          onClick={() => openEditForm(event.id)}
                          className="mr-2 hover:text-purple-400"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleArchive(event.id)}
                          className="hover:text-purple-400"
                          title="Archive"
                        >
                          <FaArchive />
                        </button>
                      </div>
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
