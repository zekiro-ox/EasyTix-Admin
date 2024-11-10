import React, { useState } from "react";

const UserList = ({ data = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = data.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-2">
      <div className="mb-4 flex items-center">
        <input
          type="text"
          className="w-full px-4 py-2 rounded-lg border border-gray-600 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 bg-gray-700 text-white"
          placeholder="Search users by name..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="font-kanit min-w-full bg-gray-800 rounded-lg shadow-md overflow-hidden">
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
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredUsers.map((user, index) => (
              <tr key={`${user.uid}-${index}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.uid}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{`${user.firstName} ${user.lastName}`}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
