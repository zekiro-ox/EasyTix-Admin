// EventDetailsModal.js

import React from "react";
import PropTypes from "prop-types";

const EventDetailsModal = ({ event, newEventData, onClose }) => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Event Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Name:
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{event.name}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Description:
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {event.description}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date:
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {event.startDate}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      End Date:
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {event.endDate}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Start Time:
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {event.startTime}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      End Time:
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {event.endTime}
                    </p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Venue:
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{event.venue}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
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
  event: PropTypes.object.isRequired,
  newEventData: PropTypes.object, // Optional
  onClose: PropTypes.func.isRequired,
};

export default EventDetailsModal;
