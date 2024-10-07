import React from "react";

const ConfirmationModal = ({ message, onAccept, onCancel }) => {
  return (
    <div className="font-kanit fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="bg-gray-900 rounded-lg p-8 z-10">
        <p className="text-lg text-white font-semibold">{message}</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 font-semibold bg-gray-300 text-gray-800 rounded-md mr-4 hover:bg-gray-600 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 font-semibold bg-purple-600 text-white rounded-md hover:bg-purple-900 focus:outline-none"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
