import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { storage, db } from "./config/firebaseConfig";

const AddEventForm = ({ event, onAddEvent, onCancel }) => {
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    venue: "",
    eventPosterURL: "",
    seatMapURL: "",
    tickets: [{ type: "", price: "", quantity: "" }],
  });

  const [formVisible, setFormVisible] = useState(true); // State to manage form visibility

  useEffect(() => {
    if (event) {
      setNewEvent(event);
    } else {
      resetForm();
    }
  }, [event]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const file = files[0];
    const fileRef = storage.ref(`eventPosters/${file.name}`);

    try {
      const snapshot = await fileRef.put(file);
      const downloadURL = await snapshot.ref.getDownloadURL();
      setNewEvent({ ...newEvent, [`${name}URL`]: downloadURL });
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };

  const handleSeatMapChange = async (e) => {
    const file = e.target.files[0];
    const storageRef = storage.ref(`seatMaps/${file.name}`);

    try {
      const snapshot = await storageRef.put(file);
      const seatMapURL = await snapshot.ref.getDownloadURL();
      setNewEvent({ ...newEvent, seatMapURL });
    } catch (error) {
      console.error("Error uploading seat map file: ", error);
    }
  };

  const handleTicketChange = (index, e) => {
    const { name, value } = e.target;
    const tickets = [...newEvent.tickets];
    tickets[index] = { ...tickets[index], [name]: value };
    setNewEvent({ ...newEvent, tickets });
  };

  const handleAddTicket = () => {
    setNewEvent({
      ...newEvent,
      tickets: [...newEvent.tickets, { type: "", price: "", quantity: "" }],
    });
  };

  const handleRemoveTicket = (index) => {
    const tickets = [...newEvent.tickets];
    tickets.splice(index, 1);
    setNewEvent({ ...newEvent, tickets });
  };

  const handleAddEvent = async () => {
    try {
      if (event) {
        const eventRef = doc(db, "events", event.id);
        await updateDoc(eventRef, newEvent);
        console.log("Document updated with ID: ", event.id);
      } else {
        const eventsRef = collection(db, "events");
        const docRef = await addDoc(eventsRef, newEvent);
        console.log("Document written with ID: ", docRef.id);
      }
      onAddEvent();
      resetForm();
      setFormVisible(false); // Close the form after successful addition or update
    } catch (error) {
      console.error("Error adding or updating document: ", error);
    }
  };

  const handleCancel = () => {
    onCancel();
    resetForm();
    setFormVisible(false); // Close the form on cancel action
  };

  const resetForm = () => {
    setNewEvent({
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      venue: "",
      eventPosterURL: "",
      seatMapURL: "",
      tickets: [{ type: "", price: "", quantity: "" }],
    });
  };

  if (!formVisible) {
    return null; // Render nothing if formVisible is false
  }

  return (
    <div className="mb-4 bg-gray-800 rounded-lg shadow-md p-4 text-white">
      <h2 className="text-lg font-medium mb-4">
        {event ? "Edit Event" : "Add New Event"}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            placeholder="Event Name"
            value={newEvent.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            placeholder="Event Description"
            value={newEvent.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-300"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            value={newEvent.startDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-300"
          >
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            value={newEvent.endDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-300"
          >
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            value={newEvent.startTime}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="endTime"
            className="block text-sm font-medium text-gray-300"
          >
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            value={newEvent.endTime}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="venue"
            className="block text-sm font-medium text-gray-300"
          >
            Venue
          </label>
          <input
            type="text"
            id="venue"
            name="venue"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            placeholder="Event Venue"
            value={newEvent.venue}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="eventPoster"
            className="block text-sm font-medium text-gray-300"
          >
            Event Poster
          </label>
          <input
            type="file"
            id="eventPoster"
            name="eventPoster"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="seatMap"
            className="block text-sm font-medium text-gray-300"
          >
            Seat Map
          </label>
          <input
            type="file"
            id="seatMap"
            name="seatMap"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            accept=".pdf,.jpg,.png"
            onChange={handleSeatMapChange}
          />
        </div>
        <div className="col-span-2">
          <h3 className="text-lg font-medium text-gray-300 mb-2">Tickets</h3>
          {newEvent.tickets.map((ticket, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 mb-2">
              <div>
                <label
                  htmlFor={`ticket-type-${index}`}
                  className="block text-sm font-medium text-gray-300"
                >
                  Type
                </label>
                <input
                  type="text"
                  id={`ticket-type-${index}`}
                  name="type"
                  className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                  placeholder="Ticket Type"
                  value={ticket.type}
                  onChange={(e) => handleTicketChange(index, e)}
                />
              </div>
              <div>
                <label
                  htmlFor={`ticket-price-${index}`}
                  className="block text-sm font-medium text-gray-300"
                >
                  Price
                </label>
                <input
                  type="number"
                  id={`ticket-price-${index}`}
                  name="price"
                  className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                  placeholder="Ticket Price"
                  value={ticket.price}
                  onChange={(e) => handleTicketChange(index, e)}
                />
              </div>
              <div>
                <label
                  htmlFor={`ticket-quantity-${index}`}
                  className="block text-sm font-medium text-gray-300"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id={`ticket-quantity-${index}`}
                  name="quantity"
                  className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                  placeholder="Ticket Quantity"
                  value={ticket.quantity}
                  onChange={(e) => handleTicketChange(index, e)}
                />
              </div>
              <div className="flex items-end">
                {index === newEvent.tickets.length - 1 && (
                  <button
                    type="button"
                    className="ml-2 px-3 py-2 rounded-md bg-purple-900 text-white hover:bg-purple-800 focus:outline-none focus:ring focus:ring-purple-500 focus:border-purple-500"
                    onClick={handleAddTicket}
                  >
                    Add Ticket
                  </button>
                )}
                {index < newEvent.tickets.length - 1 && (
                  <button
                    type="button"
                    className="ml-2 px-3 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-500 focus:outline-none focus:ring focus:ring-red-500 focus:border-red-500"
                    onClick={() => handleRemoveTicket(index)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          className="px-4 py-2 rounded-md bg-purple-900 text-white hover:bg-purple-800 focus:outline-none focus:ring focus:ring-green-500 focus:border-green-500 mr-2"
          onClick={handleAddEvent}
        >
          {event ? "Update Event" : "Add Event"}
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-500 focus:border-gray-500"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

AddEventForm.propTypes = {
  event: PropTypes.object,
  onAddEvent: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddEventForm;
