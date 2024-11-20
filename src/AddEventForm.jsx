import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "./config/firebaseConfig";
import { ToastContainer, toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const notify = (message, id, type = "error") => {
  if (!toast.isActive(id)) {
    if (type === "error") {
      toast.error(message, { toastId: id });
    } else if (type === "success") {
      toast.success(message, { toastId: id });
    }
  }
}; // Adjust the path based on your Firebase setup

const AddEventForm = ({ event, onAddEvent, onCancel }) => {
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    venue: "",
    status: "Starting Soon",
    eventStartDate: "", // Added the status field with a default value
    eventPosterURL: "",
    seatMapURL: "",
    tickets: [
      {
        type: "General Admission",
        price: "",
        quantity: "",
        column: "",
        remainingQuantity: "",
      },
      {
        type: "VIP",
        price: "",
        quantity: "",
        column: "",
        remainingQuantity: "",
      },
    ],
  });

  const [formVisible, setFormVisible] = useState(true); // State to manage form visibility

  useEffect(() => {
    if (event && event.id) {
      // Set newEvent state with event data
      const updatedTickets = event.tickets.map((ticket) => ({
        ...ticket,
        quantity: ticket.remainingQuantity || ticket.quantity, // Use remainingQuantity if available
      }));
      setNewEvent({ ...event, tickets: updatedTickets });
    } else {
      resetForm();
    }
  }, [event]);

  useEffect(() => {
    if (newEvent.eventStartDate) {
      const maxRegEndDate = new Date(newEvent.eventStartDate);
      maxRegEndDate.setDate(maxRegEndDate.getDate() - 1);
      document.getElementById("endDate").max = maxRegEndDate
        .toISOString()
        .split("T")[0];
    }
  }, [newEvent.eventStartDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewEvent((prevEvent) => {
      const updatedEvent = { ...prevEvent, [name]: value };

      // If Event Start Date is updated, adjust Registration End Date's max
      if (name === "eventStartDate" && new Date(value)) {
        const maxRegEndDate = new Date(value);
        maxRegEndDate.setDate(maxRegEndDate.getDate() - 1); // Set max to one day before Event Start Date
        document.getElementById("endDate").max = maxRegEndDate
          .toISOString()
          .split("T")[0];
      }

      return updatedEvent;
    });
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const file = files[0];
    const storage = getStorage();
    const fileRef = ref(storage, `EasyTix_Assets/${file.name}`);

    try {
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      setNewEvent({ ...newEvent, [`${name}URL`]: downloadURL });
    } catch (error) {
      console.error("Error uploading file: ", error);
    }
  };

  const handleSeatMapChange = async (e) => {
    const file = e.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, `EasyTix_Assets/${file.name}`);

    try {
      await uploadBytes(storageRef, file);
      const seatMapURL = await getDownloadURL(storageRef);
      setNewEvent({ ...newEvent, seatMapURL });
    } catch (error) {
      console.error("Error uploading seat map file: ", error);
    }
  };

  const handleTicketChange = (index, e) => {
    const { name, value } = e.target;
    const tickets = [...newEvent.tickets];
    tickets[index] = { ...tickets[index], [name]: value };

    // If the user is changing the quantity, we do not want to keep remainingQuantity
    if (name === "quantity") {
      delete tickets[index].remainingQuantity; // Remove remainingQuantity on quantity change
    }

    setNewEvent({ ...newEvent, tickets });
  };

  const handleAddTicket = () => {
    setNewEvent({
      ...newEvent,
      tickets: [
        ...newEvent.tickets,
        { type: "", price: "", quantity: "", column: "" },
      ],
    });
  };

  const handleRemoveTicket = (index) => {
    const tickets = [...newEvent.tickets];
    tickets.splice(index, 1);
    setNewEvent({ ...newEvent, tickets });
  };

  const validateForm = () => {
    // Check if any required fields are empty
    const requiredFields = [
      "name",
      "description",
      "startDate",
      "endDate",
      "startTime",
      "endTime",
      "venue",
      "eventStartDate",
    ];

    // Check each required field
    for (const field of requiredFields) {
      if (!newEvent[field]) {
        return false; // Return false if any required field is empty
      }
    }

    // Check if Registration End Date is before Event Start Date
    if (new Date(newEvent.endDate) >= new Date(newEvent.eventStartDate)) {
      notify(
        "Registration End Date must be before Event Start Date",
        "dateError"
      );
      return false;
    }

    // Check each ticket for required fields
    for (const ticket of newEvent.tickets) {
      if (!ticket.type || !ticket.price || !ticket.quantity || !ticket.column) {
        return false; // Return false if any ticket field is empty
      }
    }

    return true; // All required fields are filled
  };
  const handleAddEvent = async () => {
    if (!validateForm()) {
      notify("Please fill in the form", "addError"); // Alert the user
      return; // Prevent adding/updating the event
    }
    try {
      if (event && event.id) {
        // Check if event and event.id are defined
        const eventRef = doc(db, "events", event.id);
        await updateDoc(eventRef, newEvent);
        console.log("Document updated with ID: ", event.id);
      } else {
        const eventsRef = collection(db, "events");
        const docRef = await addDoc(eventsRef, {
          ...newEvent,
          eventPosterURL: newEvent.eventPosterURL, // Ensure these fields are properly set
          seatMapURL: newEvent.seatMapURL,
        });
        console.log("Document written with ID: ", docRef.id);
        onAddEvent({ id: docRef.id, ...newEvent }); // Pass the added event object
      }
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
      status: "Starting Soon",
      eventStartDate: "", // Reset status to default value
      eventPosterURL: "",
      seatMapURL: "",
      tickets: [
        { type: "General Admission", price: "", quantity: "", column: "" },
        { type: "VIP", price: "", quantity: "", column: "" },
      ],
    });
  };

  if (!formVisible) {
    return null; // Render nothing if formVisible is false
  }

  return (
    <div className="font-kanit bg-gray-800 rounded-lg shadow-md p-4 text-white">
      <ToastContainer />
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
            required
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-300"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            value={newEvent.status}
            onChange={handleInputChange}
          >
            <option value="Starting Soon">Starting Soon</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="eventStartDate"
            className="block text-sm font-medium text-gray-300"
          >
            Event Start Date
          </label>
          <input
            type="date"
            id="eventStartDate"
            name="eventStartDate"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            value={newEvent.eventStartDate}
            onChange={handleInputChange}
            required
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
            required
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="startTime"
            className="block text-sm font-medium text-gray-300"
          >
            Event Start Time
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            value={newEvent.startTime}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="endTime"
            className="block text-sm font-medium text-gray-300"
          >
            Event End Time
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            value={newEvent.endTime}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-300"
          >
            Registration Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            value={newEvent.startDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-300"
          >
            Registration End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
            value={newEvent.endDate}
            onChange={handleInputChange}
            max={
              newEvent.eventStartDate
                ? new Date(newEvent.eventStartDate).toISOString().split("T")[0]
                : ""
            }
            required
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
            required
          />
        </div>
        <div className="col-span-2">
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
            onChange={handleFileChange}
          />
          {newEvent.eventPosterURL && (
            <a
              href={newEvent.eventPosterURL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-sm text-indigo-500 hover:underline"
            >
              View Current Event Poster
            </a>
          )}
        </div>
        <div className="col-span-2">
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
            onChange={handleSeatMapChange}
          />
          {newEvent.seatMapURL && (
            <a
              href={newEvent.seatMapURL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-sm text-indigo-500 hover:underline"
            >
              View Current Seat Map
            </a>
          )}
        </div>
        <div className="col-span-2">
          <h3 className="text-md font-medium text-gray-300 mb-2">Tickets</h3>
          {newEvent.tickets.map((ticket, index) => (
            <div
              key={`${ticket.type}-${index}`}
              className="grid grid-cols-5 gap-2 mb-2"
            >
              <input
                type="text"
                name="type"
                placeholder="Ticket Type"
                value={ticket.type}
                onChange={(e) => handleTicketChange(index, e)}
                className="px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={ticket.price}
                onChange={(e) => handleTicketChange(index, e)}
                className="px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                required
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={ticket.quantity}
                onChange={(e) => handleTicketChange(index, e)}
                className="px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                required
              />
              <input
                type="text"
                name="column"
                placeholder="Column"
                value={ticket.column}
                onChange={(e) => handleTicketChange(index, e)}
                className="px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-700 text-white"
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveTicket(index)}
                className="px-3 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-red-500 focus:border-red-500 sm:text-sm bg-red-700 text-white"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTicket}
            className="mt-2 px-4 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-indigo-700 text-white"
          >
            Add Ticket
          </button>
        </div>
        <div className="col-span-2 flex justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-gray-500 focus:border-gray-500 sm:text-sm bg-gray-700 text-white mr-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddEvent}
            className="px-4 py-2 rounded-md border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-indigo-700 text-white"
          >
            {event ? "Update Event" : "Add Event"}
          </button>
        </div>
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
