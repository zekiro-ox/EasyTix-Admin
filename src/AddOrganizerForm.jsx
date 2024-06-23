import React, { useState } from "react";

const AddOrganizerForm = ({ onAddOrganizer, onCancel }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrganizer = {
      firstName,
      lastName,
      email,
      password,
    };
    onAddOrganizer(newOrganizer);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md text-gray-100">
        <h2 className="text-xl font-semibold mb-4">Add Organizer</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 text-gray-100"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 text-gray-100"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 text-gray-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 text-gray-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="mr-2 px-4 py-2 rounded-lg bg-gray-400 text-gray-800 hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-200"
            >
              Add Organizer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrganizerForm;
