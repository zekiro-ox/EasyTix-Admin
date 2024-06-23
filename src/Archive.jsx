import React, { useState } from "react";
import { FaSearch, FaFolder } from "react-icons/fa";
import Sidebar from "./Sidebar";
import SalesReport from "./ArchiveSalesReport"; // Assuming SalesReport component exists
import UserList from "./UserList"; // Assuming UserList component exists

const ArchiveComponent = () => {
  const [archivedEvents, setArchivedEvents] = useState([
    {
      id: 1,
      name: "Archived Event 1",
      description: "Description of Archived Event 1.",
      date: "2023-01-01",
      salesReport: [
        { id: 1, user: "John Doe", ticketType: "VIP", amount: "$200" },
        { id: 2, user: "Jane Smith", ticketType: "General", amount: "$50" },
        { id: 3, user: "Emily Brown", ticketType: "VIP", amount: "$180" },
        { id: 4, user: "David Wilson", ticketType: "General", amount: "$60" },
        { id: 5, user: "Sophia Lee", ticketType: "VIP", amount: "$220" },
        { id: 6, user: "Noah Clark", ticketType: "General", amount: "$40" },
        { id: 7, user: "Olivia Taylor", ticketType: "VIP", amount: "$210" },
        { id: 8, user: "James Anderson", ticketType: "General", amount: "$55" },
        { id: 9, user: "Isabella Martinez", ticketType: "VIP", amount: "$190" },
        { id: 10, user: "William Moore", ticketType: "General", amount: "$45" },
      ],
      participants: [
        { id: 1, name: "John Doe", email: "john.doe@example.com" },
        { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
        { id: 3, name: "Emily Brown", email: "emily.brown@example.com" },
        { id: 4, name: "David Wilson", email: "david.wilson@example.com" },
        { id: 5, name: "Sophia Lee", email: "sophia.lee@example.com" },
        { id: 6, name: "Noah Clark", email: "noah.clark@example.com" },
        { id: 7, name: "Olivia Taylor", email: "olivia.taylor@example.com" },
        { id: 8, name: "James Anderson", email: "james.anderson@example.com" },
        {
          id: 9,
          name: "Isabella Martinez",
          email: "isabella.martinez@example.com",
        },
        { id: 10, name: "William Moore", email: "william.moore@example.com" },
      ],
    },
    {
      id: 2,
      name: "Archived Event 2",
      description: "Description of Archived Event 2.",
      date: "2023-02-15",
      salesReport: [
        { id: 1, user: "Michael Johnson", ticketType: "VIP", amount: "$250" },
        { id: 2, user: "Sophia Wilson", ticketType: "General", amount: "$70" },
        { id: 3, user: "Ethan White", ticketType: "VIP", amount: "$230" },
        { id: 4, user: "Emma Thomas", ticketType: "General", amount: "$55" },
        { id: 5, user: "Daniel Harris", ticketType: "VIP", amount: "$260" },
        { id: 6, user: "Madison Garcia", ticketType: "General", amount: "$45" },
        {
          id: 7,
          user: "Alexander Martinez",
          ticketType: "VIP",
          amount: "$240",
        },
        { id: 8, user: "Ava Robinson", ticketType: "General", amount: "$60" },
        { id: 9, user: "Mason Perez", ticketType: "VIP", amount: "$220" },
        { id: 10, user: "Chloe Lopez", ticketType: "General", amount: "$50" },
      ],
      participants: [
        {
          id: 1,
          name: "Michael Johnson",
          email: "michael.johnson@example.com",
        },
        { id: 2, name: "Sophia Wilson", email: "sophia.wilson@example.com" },
        { id: 3, name: "Ethan White", email: "ethan.white@example.com" },
        { id: 4, name: "Emma Thomas", email: "emma.thomas@example.com" },
        { id: 5, name: "Daniel Harris", email: "daniel.harris@example.com" },
        { id: 6, name: "Madison Garcia", email: "madison.garcia@example.com" },
        {
          id: 7,
          name: "Alexander Martinez",
          email: "alexander.martinez@example.com",
        },
        { id: 8, name: "Ava Robinson", email: "ava.robinson@example.com" },
        { id: 9, name: "Mason Perez", email: "mason.perez@example.com" },
        { id: 10, name: "Chloe Lopez", email: "chloe.lopez@example.com" },
      ],
    },
    // Add more archived events as needed
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFolderClick = (eventId) => {
    const event = archivedEvents.find((event) => event.id === eventId);
    setSelectedEvent(event);
  };

  const filteredArchivedEvents = archivedEvents.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                  placeholder="Search archived events..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredArchivedEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100"
                onClick={() => handleFolderClick(event.id)}
              >
                <div className="flex items-center">
                  <FaFolder className="text-purple-600 mr-2" />
                  <div>
                    <p className="font-medium text-gray-800">{event.name}</p>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conditional Rendering based on selectedEvent */}
        {selectedEvent && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">
              Sales Report for {selectedEvent.name}
            </h2>
            <SalesReport data={selectedEvent.salesReport} />
          </div>
        )}

        {selectedEvent && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">
              Participants for {selectedEvent.name}
            </h2>
            <UserList data={selectedEvent.participants} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchiveComponent;
