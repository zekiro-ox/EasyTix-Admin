import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

const AdminDashboard = ({ salesData }) => {
  // Calculate total tickets sold, total revenue, and average tickets per day
  const totalTicketsSold = salesData.reduce(
    (acc, item) => acc + item.ticketsSold,
    0
  );
  const totalRevenue = salesData.reduce((acc, item) => acc + item.revenue, 0);
  const averageTicketsPerDay =
    salesData.length > 0 ? totalTicketsSold / salesData.length : 0;

  // Example customer feedback (replace with actual feedback data)
  const feedbacks = [
    {
      id: 1,
      text: '"Awesome event, great experience!" - John Doe',
    },
    {
      id: 2,
      text: '"Smooth ticket booking process, loved it." - Jane Smith',
    },
    {
      id: 3,
      text: '"The event exceeded my expectations!" - Alice Johnson',
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-800 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col pt-16 pr-5 pl-5 pb-5 lg:ml-64">
        <div className="bg-purple-800 p-6 rounded-t-2xl">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full lg:w-96">
            <h2 className="text-3xl mb-4 text-center font-bold text-purple-400">
              Dashboard
            </h2>
            <p className="text-gray-300 text-center">
              Welcome to your dashboard!
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row mt-6 space-y-6 lg:space-x-6 lg:space-y-0">
          {/* Sales Report Container */}
          <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-full lg:w-1/2">
            <h3 className="text-2xl mb-4 text-center font-bold text-purple-400">
              Event Ticket Sales
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-400">
                  Total Tickets Sold
                </h4>
                <p className="text-gray-300">{totalTicketsSold} tickets sold</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-400">
                  Revenue
                </h4>
                <p className="text-gray-300">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-400">
                  Average Tickets per Day
                </h4>
                <p className="text-gray-300">
                  {averageTicketsPerDay.toFixed(2)} tickets
                </p>
              </div>
            </div>
          </div>

          {/* Customer Feedback Container */}
          <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl w-full lg:w-1/2">
            <h3 className="text-2xl mb-4 text-center font-bold text-purple-400">
              Customer Feedback
            </h3>
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <div key={feedback.id} className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-purple-400">
                    Feedback {feedback.id}
                  </h4>
                  <p className="text-gray-300">{feedback.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
