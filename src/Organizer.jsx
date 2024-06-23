import React, { useState } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "./Sidebar";
import AddOrganizerForm from "./AddOrganizerForm";
import EditOrganizerForm from "./EditOrganizerForm";

const OrganizerComponent = () => {
  const [organizers, setOrganizers] = useState([
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password1",
    },
    {
      id: 2,
      firstName: "Jane",
      lastName: "Smith",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      password: "password2",
    },
    // Add more organizers as needed
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentOrganizer, setCurrentOrganizer] = useState(null);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddOrganizer = (newOrganizer) => {
    const maxId =
      organizers.length > 0 ? Math.max(...organizers.map((org) => org.id)) : 0;
    newOrganizer.id = maxId + 1; // Automatically generate ID
    newOrganizer.name = `${newOrganizer.firstName} ${newOrganizer.lastName}`;
    setOrganizers([...organizers, newOrganizer]);
    setShowAddForm(false); // Hide the form after adding organizer
  };

  const handleSaveOrganizer = (updatedOrganizer) => {
    const updatedOrganizers = organizers.map((organizer) =>
      organizer.id === updatedOrganizer.id ? updatedOrganizer : organizer
    );
    setOrganizers(updatedOrganizers);
    setShowEditForm(false); // Hide the form after saving changes
  };

  const handleDeleteOrganizer = (organizerId) => {
    const updatedOrganizers = organizers.filter(
      (organizer) => organizer.id !== organizerId
    );
    setOrganizers(updatedOrganizers);
  };

  const openEditForm = (organizerId) => {
    const organizer = organizers.find((org) => org.id === organizerId);
    setCurrentOrganizer(organizer);
    setShowEditForm(true);
  };

  const filteredOrganizers = organizers.filter((organizer) =>
    organizer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-purple-50">
      <Sidebar />
      <div className="flex-1 flex flex-col pt-16 pr-5 pl-5 pb-5 lg:ml-64">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4 flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="relative flex-1 w-full lg:w-auto mb-4 lg:mb-0 lg:mr-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
                  placeholder="Search organizers..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-200"
            >
              <FaPlus className="mr-2" />
              Add Organizer
            </button>
          </div>

          {showAddForm && (
            <AddOrganizerForm
              onAddOrganizer={handleAddOrganizer}
              onCancel={() => setShowAddForm(false)}
            />
          )}

          {showEditForm && (
            <EditOrganizerForm
              organizer={currentOrganizer}
              onSaveOrganizer={handleSaveOrganizer}
              onCancel={() => setShowEditForm(false)}
            />
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs                     font-medium tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrganizers.map((organizer) => (
                  <tr key={organizer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {organizer.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {organizer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {organizer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="flex items-center text-indigo-600 hover:text-indigo-900 mr-2"
                        onClick={() => openEditForm(organizer.id)}
                      >
                        <FaEdit className="mr-1" />
                        Edit
                      </button>
                      <button
                        className="flex items-center text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteOrganizer(organizer.id)}
                      >
                        <FaTrash className="mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerComponent;
