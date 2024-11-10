import React from "react";

const SalesReport = ({ data = [] }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="font-kanit bg-gray-800 rounded-lg shadow-md p-6 text-white">
        <h2 className="text-2xl font-semibold mb-4">Sales Report</h2>
        <p className="text-sm text-gray-400">
          No data available for this report.
        </p>
      </div>
    );
  }

  const totalTicketsSold = data.reduce(
    (acc, item) => acc + (item.quantity || 0),
    0
  );

  const ticketTypeCounts = data.reduce((acc, item) => {
    if (item.ticketType) {
      acc[item.ticketType] = (acc[item.ticketType] || 0) + (item.quantity || 0);
    }
    return acc;
  }, {});

  const totalRevenue = data
    .reduce((acc, item) => acc + (item.totalAmount || 0), 0)
    .toFixed(2);

  const averageTicketsPerDay =
    data.length > 0 ? (totalTicketsSold / data.length).toFixed(2) : 0;

  return (
    <div className="font-kanit bg-gray-800 rounded-lg shadow-md p-6 text-white">
      <h2 className="text-2xl font-semibold mb-4">Sales Report</h2>
      <div className="mb-4">
        <p className="font-medium text-gray-300">Total Tickets Sold:</p>
        <p className="text-sm text-gray-400">{totalTicketsSold}</p>
      </div>
      <div className="mb-4">
        <p className="font-medium text-gray-300">Tickets Sold for Each Type:</p>
        <ul className="list-disc list-inside text-sm text-gray-400">
          {Object.keys(ticketTypeCounts).map((ticketType) => (
            <li key={ticketType}>
              {ticketType}: {ticketTypeCounts[ticketType]}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <p className="font-medium text-gray-300">Revenue:</p>
        <p className="text-sm text-gray-400">₱ {totalRevenue}</p>
      </div>
      <div>
        <p className="font-medium text-gray-300">
          Average Tickets Sold Per Day:
        </p>
        <p className="text-sm text-gray-400">{averageTicketsPerDay}</p>
      </div>
    </div>
  );
};
export default SalesReport;
