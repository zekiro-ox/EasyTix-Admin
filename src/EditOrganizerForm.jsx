import React, { useState, useEffect } from "react";

const EditOrganizerForm = ({ organizer, onSaveOrganizer, onCancel }) => {
  const [firstName, setFirstName] = useState(organizer.firstName || "");
  const [lastName, setLastName] = useState(organizer.lastName || "");
  const [email, setEmail] = useState(organizer.email || "");
  const [password, setPassword] = useState(organizer.password || "");

  useEffect(() => {
    if (organizer) {
      setFirstName(organizer.firstName || "");
      setLastName(organizer.lastName || "");
      setEmail(organizer.email || "");
      setPassword(organizer.password || "");
    }
  }, [organizer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedOrganizer = {
      ...organizer,
      name: `${firstName} ${lastName}`, // Combine first and last names
      email,
      password,
    };
    onSaveOrganizer(updatedOrganizer);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md text-gray-100">
        <h2 className="text-xl font-semibold mb-4">Edit Organizer</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-700 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 bg-gray-700 text-gray-100"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-700 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 bg-gray-700 text-gray-100"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-700 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 bg-gray-700 text-gray-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-gray-700 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 bg-gray-700 text-gray-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-200"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-purple-800 text-white hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-200"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrganizerForm;
