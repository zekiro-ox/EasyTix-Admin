import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { collection, getDocs } from "firebase/firestore";
import Sidebar from "./Sidebar";
import { db } from "./config/firebaseConfig";

const SalesReport = () => {
  const [filteredSalesData, setFilteredSalesData] = useState({});
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

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [totalTicketsSold, setTotalTicketsSold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageTicketsSoldPerDay, setAverageTicketsSoldPerDay] = useState(0);
  const [noCustomers, setNoCustomers] = useState(false); // New state variable

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
      const salesData = {};
      let totalTicketsSold = 0;
      let totalRevenue = 0;
      const eventsRef = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsRef);

      for (const eventDoc of eventsSnapshot.docs) {
        if (selectedEvent && eventDoc.id !== selectedEvent) {
          continue;
        }

        const customersRef = collection(eventDoc.ref, "customers");
        const customersSnapshot = await getDocs(customersRef);

        // Check if there are no customers
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
      }

      setFilteredSalesData(salesData);
      setTotalTicketsSold(totalTicketsSold);
      setTotalRevenue(totalRevenue);
    };
    fetchSalesData();
  }, [selectedEvent]);

  useEffect(() => {
    const labels = Object.keys(filteredSalesData);
    const data = Object.values(filteredSalesData);

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

      const daysCount = new Set(labels).size;
      setAverageTicketsSoldPerDay(totalTicketsSold / daysCount);
    }
  }, [filteredSalesData, totalTicketsSold]);

  return (
    <div className="font-kanit flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col p-5 lg:ml-64">
        <div className="bg-purple-800 p-6 rounded-t-2xl mb-6">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl mx-auto w-full lg:w-3/5 text-center">
            <h2 className="text-3xl mb-4 font-bold text-purple-600">
              Sales Report
            </h2>
            <p className="text-gray-300">Overview of tickets sold by type.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-6 mt-6">
          <div className="w-full lg:w-1/3 bg-gray-700 p-6 rounded-2xl shadow-2xl">
            <h3 className="text-2xl mb-4 text-center font-bold text-purple-400">
              Sales Summary
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-600 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-400">
                  Total Tickets Sold
                </h4>
                <p className="text-gray-300">{totalTicketsSold} tickets sold</p>
              </div>
              <div className="bg-gray-600 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-400">
                  Revenue
                </h4>
                <p className="text-gray-300">₱ {totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-gray-600 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-400">
                  Avg. Tickets Sold per Day
                </h4>
                <p className="text-gray-300">
                  {averageTicketsSoldPerDay.toFixed(2)} tickets
                </p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/3 flex flex-col justify-center items-center bg-gray-800 p-6 rounded-2xl shadow-2xl">
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
      </div>
    </div>
  );
};

export default SalesReport;
