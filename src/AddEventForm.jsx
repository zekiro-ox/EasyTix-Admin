import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const AddEventForm = ({ event, onAddEvent, onCancel }) => {
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    venue: "",
    eventPoster: null,
    seatMap: null,
  });

  useEffect(() => {
    if (event) {
      setNewEvent({
        ...event,
      });
    }
  }, [event]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewEvent({ ...newEvent, [name]: files[0] });
  };

  const handleAddEvent = () => {
    onAddEvent(newEvent);
    resetForm();
  };

  const handleCancel = () => {
    onCancel();
    resetForm();
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
      eventPoster: null,
      seatMap: null,
    });
  };

  return (
    <div className="mb-4 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-medium mb-4">
        {event ? "Edit Event" : "Add New Event"}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Event Name"
            value={newEvent.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4" // Adjust rows as needed
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Event Description"
            value={newEvent.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={newEvent.startDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={newEvent.endDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-700"
          >
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={newEvent.startTime}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="endTime"
            className="block text-sm font-medium text-gray-700"
          >
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={newEvent.endTime}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="venue"
            className="block text-sm font-medium text-gray-700"
          >
            Venue
          </label>
          <input
            type="text"
            id="venue"
            name="venue"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Event Venue"
            value={newEvent.venue}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="eventPoster"
            className="block text-sm font-medium text-gray-700"
          >
            Event Poster
          </label>
          <input
            type="file"
            id="eventPoster"
            name="eventPoster"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="seatMap"
            className="block text-sm font-medium text-gray-700"
          >
            Seat Map
          </label>
          <input
            type="file"
            id="seatMap"
            name="seatMap"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            accept=".pdf,.jpg,.png"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300 mr-2"
        >
          Cancel
        </button>
        <button
          onClick={handleAddEvent}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-200"
        >
          {event ? "Save Changes" : "Add Event"}
        </button>
      </div>
    </div>
  );
};

AddEventForm.propTypes = {
  event: PropTypes.object, // Event to edit, if provided
  onAddEvent: PropTypes.func.isRequired, // Function to handle adding/editing event
  onCancel: PropTypes.func.isRequired, // Function to handle canceling form action
};

export default AddEventForm;
