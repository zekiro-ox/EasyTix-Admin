import React from "react";

const UserList = ({ data }) => {
  return (
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
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.email}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
