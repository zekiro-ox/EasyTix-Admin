import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const EditOrganizerForm = ({ organizer, onSaveOrganizer, onCancel }) => {
  const [firstName, setFirstName] = useState(organizer.firstName || "");
  const [lastName, setLastName] = useState(organizer.lastName || "");
  const [email, setEmail] = useState(organizer.email || "");
  const [password, setPassword] = useState(organizer.password || "");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    const updatedOrganizer = {
      ...organizer,
      name: `${firstName} ${lastName}`,
      email,
      password,
    };
    onSaveOrganizer(updatedOrganizer);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="font-kanit bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md text-gray-100">
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
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 rounded-lg border border-gray-700 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 bg-gray-700 text-gray-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              className="absolute inset-y-0 right-0 top-5 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-400" />
              ) : (
                <FaEye className="text-gray-400" />
              )}
            </div>
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 rounded-lg border border-gray-700 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 bg-gray-700 text-gray-100"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div
              className="absolute inset-y-0 right-0 top-5 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-400" />
              ) : (
                <FaEye className="text-gray-400" />
              )}
            </div>
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
