import React from "react";

const SalesReport = ({ data }) => {
  // Calculate Total Ticket Sold
  const totalTicketsSold = data.length;

  // Calculate Ticket Sold for Each Type of Ticket
  const ticketTypeCounts = data.reduce((acc, item) => {
    if (acc[item.ticketType]) {
      acc[item.ticketType]++;
    } else {
      acc[item.ticketType] = 1;
    }
    return acc;
  }, {});

  // Calculate Revenue
  const totalRevenue = data
    .reduce((acc, item) => acc + parseFloat(item.amount.replace("$", "")), 0)
    .toFixed(2);

  // Calculate Average Ticket Sold Per Day (assuming data is sorted by date)
  const averageTicketsPerDay = (totalTicketsSold / data.length).toFixed(2);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Sales Report</h2>
      <div className="mb-4">
        <p className="font-medium text-gray-800">Total Ticket Sold:</p>
        <p className="text-sm text-gray-500">{totalTicketsSold}</p>
      </div>
      <div className="mb-4">
        <p className="font-medium text-gray-800">Ticket Sold for Each Type:</p>
        <ul className="list-disc list-inside text-sm text-gray-500">
          {Object.keys(ticketTypeCounts).map((ticketType) => (
            <li key={ticketType}>
              {ticketType}: {ticketTypeCounts[ticketType]}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <p className="font-medium text-gray-800">Revenue:</p>
        <p className="text-sm text-gray-500">${totalRevenue}</p>
      </div>
      <div>
        <p className="font-medium text-gray-800">
          Average Ticket Sold Per Day:
        </p>
        <p className="text-sm text-gray-500">{averageTicketsPerDay}</p>
      </div>
    </div>
  );
};

export default SalesReport;
