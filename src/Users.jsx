import React, { useState } from "react";
import { FaSearch, FaFolder } from "react-icons/fa";
import Sidebar from "./Sidebar";

const UsersComponent = () => {
  const [users] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      event: "Event 1",
      startDate: "2023-01-10",
      endDate: "2023-01-12",
      ticketType: "VIP",
      quantity: 2,
      amount: "$200",
      status: "Registered",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      event: "Event 2",
      startDate: "2023-02-15",
      endDate: "2023-02-16",
      ticketType: "General",
      quantity: 1,
      amount: "$50",
      status: "Not Registered",
    },
    {
      id: 3,
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      event: "Event 1",
      startDate: "2023-01-10",
      endDate: "2023-01-12",
      ticketType: "VIP",
      quantity: 1,
      amount: "$100",
      status: "Registered",
    },
    {
      id: 4,
      name: "Bob Brown",
      email: "bob.brown@example.com",
      event: "Event 2",
      startDate: "2023-02-15",
      endDate: "2023-02-16",
      ticketType: "General",
      quantity: 3,
      amount: "$150",
      status: "Registered",
    },
    {
      id: 5,
      name: "Charlie Davis",
      email: "charlie.davis@example.com",
      event: "Event 3",
      startDate: "2023-03-10",
      endDate: "2023-03-12",
      ticketType: "Premium",
      quantity: 2,
      amount: "$300",
      status: "Not Registered",
    },
    {
      id: 6,
      name: "Dana Lee",
      email: "dana.lee@example.com",
      event: "Event 3",
      startDate: "2023-03-10",
      endDate: "2023-03-12",
      ticketType: "Premium",
      quantity: 1,
      amount: "$150",
      status: "Registered",
    },
    {
      id: 7,
      name: "Eve Campbell",
      email: "eve.campbell@example.com",
      event: "Event 1",
      startDate: "2023-01-10",
      endDate: "2023-01-12",
      ticketType: "General",
      quantity: 1,
      amount: "$50",
      status: "Registered",
    },
    {
      id: 8,
      name: "Frank Green",
      email: "frank.green@example.com",
      event: "Event 2",
      startDate: "2023-02-15",
      endDate: "2023-02-16",
      ticketType: "VIP",
      quantity: 2,
      amount: "$200",
      status: "Not Registered",
    },
    {
      id: 9,
      name: "Grace Hall",
      email: "grace.hall@example.com",
      event: "Event 3",
      startDate: "2023-03-10",
      endDate: "2023-03-12",
      ticketType: "General",
      quantity: 3,
      amount: "$150",
      status: "Registered",
    },
    {
      id: 10,
      name: "Henry King",
      email: "henry.king@example.com",
      event: "Event 1",
      startDate: "2023-01-10",
      endDate: "2023-01-12",
      ticketType: "VIP",
      quantity: 1,
      amount: "$100",
      status: "Not Registered",
    },
    // Add more users as needed
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFolderClick = (eventName) => {
    setSelectedEvent(eventName);
  };

  const groupedUsers = users.reduce((acc, user) => {
    if (!acc[user.event]) acc[user.event] = [];
    acc[user.event].push(user);
    return acc;
  }, {});

  const filteredEvents = Object.keys(groupedUsers).filter((eventName) =>
    eventName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = selectedEvent
    ? groupedUsers[selectedEvent].filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <div className="font-kanit flex-1 flex flex-col pt-16 pr-5 pl-5 pb-5 lg:ml-64">
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-4 flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="relative flex-1 w-full lg:w-auto mb-4 lg:mb-0 lg:mr-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-700 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 bg-gray-700 text-gray-100"
                  placeholder="Search events or users..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {!selectedEvent ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredEvents.map((eventName) => (
                <div
                  key={eventName}
                  className="bg-gray-800 rounded-lg shadow-md p-4 flex items-center justify-between cursor-pointer hover:bg-gray-700"
                  onClick={() => handleFolderClick(eventName)}
                >
                  <div className="flex items-center">
                    <FaFolder className="text-purple-400 mr-2" />
                    <div>
                      <p className="font-medium text-gray-200">{eventName}</p>
                      <p className="text-sm text-gray-400">
                        {groupedUsers[eventName][0].startDate} -{" "}
                        {groupedUsers[eventName][0].endDate}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="mb-4 text-indigo-400 hover:text-indigo-600"
              >
                Back to Events
              </button>
              <h2 className="text-xl font-bold mb-4 text-gray-200">
                {selectedEvent}
              </h2>
              <div className="overflow-x-auto">
                <table className="font-kanit min-w-full bg-gray-700 rounded-lg shadow-md overflow-hidden">
                  <thead className="bg-purple-800 text-white">
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
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                        Ticket Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.ticketType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersComponent;
