import React from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="text-white fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative bg-gray-200 p-6 rounded-lg shadow-lg w-full max-w-lg text-black font-semibold">
        <button
          className="absolute top-1 right-1 text-black hover:text-gray-600"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
