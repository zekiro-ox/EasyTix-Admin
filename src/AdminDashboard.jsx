import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./config/firebaseConfig";

const AdminDashboard = () => {
  const [salesData, setSalesData] = useState([]);
  const [totalTicketsSold, setTotalTicketsSold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageTicketsPerDay, setAverageTicketsPerDay] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]); // State to hold feedback data

  useEffect(() => {
    const fetchSalesData = async () => {
      const salesDataArray = [];
      const eventsRef = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsRef);

      for (const eventDoc of eventsSnapshot.docs) {
        const customersRef = collection(eventDoc.ref, "customers");
        const customersSnapshot = await getDocs(customersRef);

        let totalTickets = 0;
        let totalRevenueForEvent = 0;

        customersSnapshot.forEach((customerDoc) => {
          const data = customerDoc.data();
          const quantity = data.quantity || 0;
          const ticketPrice = data.totalAmount || 0;

          totalTickets += quantity;
          totalRevenueForEvent += ticketPrice;
        });

        salesDataArray.push({
          eventId: eventDoc.id,
          ticketsSold: totalTickets,
          revenue: totalRevenueForEvent,
        });
      }

      setSalesData(salesDataArray);
    };

    fetchSalesData();
  }, []);

  useEffect(() => {
    // Calculate total tickets sold, total revenue, and average tickets per day
    const totalTickets = salesData.reduce(
      (acc, item) => acc + item.ticketsSold,
      0
    );
    const totalRev = salesData.reduce((acc, item) => acc + item.revenue, 0);
    const averageTickets =
      salesData.length > 0 ? totalTickets / salesData.length : 0;

    setTotalTicketsSold(totalTickets);
    setTotalRevenue(totalRev);
    setAverageTicketsPerDay(averageTickets);
  }, [salesData]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const feedbackArray = [];
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);

      for (const userDoc of usersSnapshot.docs) {
        const feedbackRef = collection(userDoc.ref, "feedback");
        const feedbackSnapshot = await getDocs(feedbackRef);

        feedbackSnapshot.forEach((feedbackDoc) => {
          const feedbackData = feedbackDoc.data();
          const createdAt = feedbackData.createdAt.toDate().toLocaleString(); // Convert Firestore timestamp to readable format
          const feedbackText = feedbackData.feedback; // Assuming the feedback field is named 'feedback'

          feedbackArray.push({
            id: feedbackDoc.id,
            username: userDoc.data().username, // Fetch username from user document
            feedback: feedbackText,
            createdAt: createdAt,
          });
        });
      }

      setFeedbacks(feedbackArray);
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-800 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col pt-16 pr-5 pl-5 pb-5 lg:ml-64">
        <div className="bg-purple-800 p-6 rounded-t-2xl">
          <div className="font-kanit bg-gray-900 p-8 rounded-2xl shadow-2xl w-full lg:w-96">
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
          <div className="font-kanit bg-gray-900 p-6 rounded-2xl shadow-2xl w-full lg:w-1/2">
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
                <p className="text-gray-300">₱ {totalRevenue.toFixed(2)}</p>
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
          <div className="font-kanit bg-gray-900 p-6 rounded-2xl shadow-2xl w-full lg:w-1/2">
            <h3 className="text-2xl mb-4 text-center font-bold text-purple-400">
              Customer Feedback
            </h3>
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <div key={feedback.id} className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-purple-400">
                    {feedback.username}
                  </h4>
                  <p className="text-gray-300">{feedback.feedback}</p>
                  <p className="text-gray-500 text-sm">{feedback.createdAt}</p>
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
