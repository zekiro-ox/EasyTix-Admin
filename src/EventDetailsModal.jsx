import React from "react";
import PropTypes from "prop-types";

const EventDetailsModal = ({ event, onClose }) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-gray-800 text-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-300 mb-4">
                  Event Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-400">
                      Name:
                    </label>
                    <p className="mt-1 text-sm text-gray-100">{event.name}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-400">
                      Description:
                    </label>
                    <p className="mt-1 text-sm text-gray-100">
                      {event.description}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-400">
                      Start Date:
                    </label>
                    <p className="mt-1 text-sm text-gray-100">
                      {event.startDate}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-400">
                      End Date:
                    </label>
                    <p className="mt-1 text-sm text-gray-100">
                      {event.endDate}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-400">
                      Start Time:
                    </label>
                    <p className="mt-1 text-sm text-gray-100">
                      {event.startTime}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-400">
                      End Time:
                    </label>
                    <p className="mt-1 text-sm text-gray-100">
                      {event.endTime}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-400">
                      Venue:
                    </label>
                    <p className="mt-1 text-sm text-gray-100">{event.venue}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-400">
                      Status:
                    </label>
                    <p className="mt-1 text-sm text-gray-100">{event.status}</p>
                  </div>
                  {event.tickets && event.tickets.length > 0 && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-400">
                        Tickets:
                      </label>
                      <div className="mt-1">
                        {event.tickets.map((ticket, index) => (
                          <div
                            key={index}
                            className="border border-gray-600 rounded-md p-2 mb-2"
                          >
                            <p className="text-sm text-gray-100">
                              <strong>Type:</strong> {ticket.type}
                            </p>
                            <p className="text-sm text-gray-100">
                              <strong>Price:</strong> ${Number(ticket.price)}
                            </p>
                            <p className="text-sm text-gray-100">
                              <strong>Quantity:</strong> {ticket.quantity}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Poster and Seat Map in the same row */}
                  {(event.eventPosterURL || event.seatMapURL) && (
                    <div className="col-span-2 grid grid-cols-2 gap-4">
                      {event.eventPosterURL && (
                        <div className="col-span-1">
                          <label className="block text-sm font-medium text-gray-400">
                            Event Poster:
                          </label>
                          <div className="mt-1">
                            <a
                              href={event.eventPosterURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-sm text-indigo-500 hover:underline"
                            >
                              View Event Poster
                            </a>
                            <img
                              src={event.eventPosterURL}
                              alt="Event Poster"
                              className="mt-2 rounded-md border border-gray-600"
                              style={{ width: "200px", height: "300px" }} // Set fixed size for the poster
                            />
                          </div>
                        </div>
                      )}
                      {event.seatMapURL && (
                        <div className="col-span-1">
                          <label className="block text-sm font-medium text-gray-400">
                            Seat Map:
                          </label>
                          <div className="mt-1">
                            <a
                              href={event.seatMapURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-sm text-indigo-500 hover:underline"
                            >
                              View Seat Map
                            </a>
                            <img
                              src={event.seatMapURL}
                              alt="Seat Map"
                              className="mt-2 rounded-md border border-gray-600"
                              style={{ width: "300px", height: "200px" }} // Set fixed size for the seat map
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

EventDetailsModal.propTypes = {
  event: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    venue: PropTypes.string,
    status: PropTypes.string,
    eventPosterURL: PropTypes.string,
    seatMapURL: PropTypes.string,
    tickets: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        price: PropTypes.number,
        quantity: PropTypes.number,
      })
    ),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default EventDetailsModal;
