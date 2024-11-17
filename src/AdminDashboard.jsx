import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import Sidebar from "./Sidebar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./config/firebaseConfig";
import Papa from "papaparse";

const AdminDashboard = () => {
  const [salesData, setSalesData] = useState({});
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Tickets Sold by Type",
        data: [],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  });
  const [totalTicketsSold, setTotalTicketsSold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageTicketsPerDay, setAverageTicketsPerDay] = useState(0);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [noCustomers, setNoCustomers] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [globalSalesData, setGlobalSalesData] = useState({});
  const [totalGlobalTicketsSold, setTotalGlobalTicketsSold] = useState(0);
  const [totalGlobalRevenue, setTotalGlobalRevenue] = useState(0); // State to hold feedback data

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsRef = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsRef);
      const eventsList = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsList);
      if (eventsList.length > 0) {
        setSelectedEvent(eventsList[0].id);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchSalesData = async () => {
      if (!selectedEvent) return;
      const salesData = {};
      let totalTicketsSold = 0;
      let totalRevenue = 0;
      try {
        const customersRef = collection(
          db,
          `events/${selectedEvent}/customers`
        );
        const customersSnapshot = await getDocs(customersRef);

        if (customersSnapshot.empty) {
          setNoCustomers(true);
          return; // Exit if no customers
        } else {
          setNoCustomers(false); // Reset if there are customers
        }

        customersSnapshot.forEach((customerDoc) => {
          const data = customerDoc.data();
          const ticketType = data.ticketType;
          const quantity = data.quantity;
          const ticketPrice = data.totalAmount || 0;

          if (!salesData[ticketType]) {
            salesData[ticketType] = 0;
          }
          salesData[ticketType] += quantity;
          totalTicketsSold += quantity;
          totalRevenue += ticketPrice;
        });

        setSalesData(salesData);
        setTotalTicketsSold(totalTicketsSold);
        setTotalRevenue(totalRevenue);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, [selectedEvent]);

  useEffect(() => {
    const labels = Object.keys(salesData);
    const data = Object.values(salesData);

    if (labels.length > 0) {
      setChartData({
        labels,
        datasets: [
          {
            label: "Tickets Sold by Type",
            data,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
            ],
          },
        ],
      });

      const daysCount = labels.length; // Number of ticket types
      setAverageTicketsPerDay(totalTicketsSold / daysCount);
    }
  }, [salesData, totalTicketsSold]);

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

  useEffect(() => {
    const fetchGlobalSalesData = async () => {
      const globalSalesData = {};
      let totalGlobalTicketsSold = 0;
      let totalGlobalRevenue = 0;

      const eventsRef = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsRef);

      for (const eventDoc of eventsSnapshot.docs) {
        const customersRef = collection(eventDoc.ref, "customers");
        const customersSnapshot = await getDocs(customersRef);

        customersSnapshot.forEach((customerDoc) => {
          const data = customerDoc.data();
          const ticketType = data.ticketType;
          const quantity = data.quantity;
          const ticketPrice = data.totalAmount || 0;

          if (!globalSalesData[ticketType]) {
            globalSalesData[ticketType] = 0;
          }
          globalSalesData[ticketType] += quantity;
          totalGlobalTicketsSold += quantity;
          totalGlobalRevenue += ticketPrice;
        });
      }

      setGlobalSalesData(globalSalesData);
      setTotalGlobalTicketsSold(totalGlobalTicketsSold);
      setTotalGlobalRevenue(totalGlobalRevenue);
    };

    fetchGlobalSalesData();
  }, []);

  const downloadCSV = () => {
    const csvData = globalSalesData; // Use the global sales data

    // Convert the object into an array of objects suitable for CSV
    const csvArray = Object.keys(csvData).map((ticketType) => ({
      TicketType: ticketType,
      QuantitySold: csvData[ticketType],
    }));

    // Use PapaParse to convert the data to CSV
    const csv = Papa.unparse(csvArray, {
      header: true, // Include headers in the CSV
    });

    // Create a blob and download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "global_sales_report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

          {/* Pie Chart Container */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-gray-800 p-6 rounded-2xl shadow-2xl">
            <div className="mb-4 w-full text-center">
              <label
                className="text-purple-400 block mb-2"
                htmlFor="eventSelect"
              >
                Select Event:
              </label>
              <select
                id="eventSelect"
                className="bg-gray-600 text-gray-300 p-2 rounded-lg w-full max-w-xs"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
              >
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full max-w-md mt-6">
              <h3 className="text-2xl font-bold text-purple-400 text-center mb-4">
                Tickets Sold by Type
              </h3>
              {noCustomers ? (
                <p className="text-gray-300 text-center">
                  Unfortunately, no tickets have been sold for this event yet.
                </p>
              ) : chartData.labels.length > 0 ? (
                <Pie data={chartData} className="mx-auto" />
              ) : (
                <p className="text-gray-300 text-center">
                  No data available to display.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row mt-6 space-y-6 lg:space-x-6 lg:space-y-0">
          {/* Global Sales Summary Container */}
          <div className="font-kanit bg-gray-900 p-6 rounded-2xl shadow-2xl w-full lg:w-1/2">
            <h3 className="text-2xl mb-4 text-center font-bold text-purple-400">
              Global Ticket Sales Summary
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-400">
                  Total Tickets Sold (All Events)
                </h4>
                <p className="text-gray-300">
                  {totalGlobalTicketsSold} tickets sold
                </p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-400">
                  Total Revenue (All Events)
                </h4>
                <p className="text-gray-300">
                  ₱ {totalGlobalRevenue.toFixed(2)}
                </p>
              </div>
              <button
                onClick={downloadCSV}
                className="mt-4 px-4 py-2 rounded-lg bg-purple-800 text-white hover:bg-purple-700"
              >
                Download Global Sales Report (CSV)
              </button>
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
