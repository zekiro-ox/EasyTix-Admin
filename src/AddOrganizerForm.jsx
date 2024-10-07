import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AddOrganizerForm = ({ onAddOrganizer, onCancel }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    const newOrganizer = {
      name: `${firstName} ${lastName}`,
      email,
      password,
    };
    onAddOrganizer(newOrganizer);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="font-kanit fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md text-gray-100">
        <h2 className="text-xl font-semibold mb-4">Add Organizer</h2>
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
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrganizerForm;
