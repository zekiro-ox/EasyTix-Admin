import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import {
  subDays,
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addMonths,
} from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Sidebar from "./Sidebar"; // Import Sidebar component
import Logo from "./assets/CompanyLogo.png"; // Update path as necessary

const SalesReport = ({ salesData }) => {
  const [filter, setFilter] = useState("weekly");
  const [currentMonth, setCurrentMonth] = useState(0); // 0 means the current month
  const [filteredSalesData, setFilteredSalesData] = useState([]);

  useEffect(() => {
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today);
    const endOfCurrentWeek = endOfWeek(today);

    const filteredData = salesData.filter((item) => {
      const itemDate = new Date(item.date);

      if (filter === "weekly") {
        const startDate = subDays(startOfCurrentWeek, currentMonth * 7);
        const endDate = subDays(endOfCurrentWeek, currentMonth * 7);
        return itemDate >= startDate && itemDate <= endDate;
      } else if (filter === "monthly") {
        const startOfSelectedMonth = startOfMonth(
          addMonths(today, currentMonth)
        );
        const endOfSelectedMonth = endOfMonth(addMonths(today, currentMonth));
        return (
          itemDate >= startOfSelectedMonth && itemDate <= endOfSelectedMonth
        );
      }
      return true;
    });
    setFilteredSalesData(filteredData);
  }, [filter, salesData, currentMonth]);

  useEffect(() => {
    // Initialize currentMonth to 0 when filter is set to "monthly"
    if (filter === "monthly") {
      setCurrentMonth(0);
    }
  }, [filter]);

  const totalTicketsSold = filteredSalesData.reduce(
    (acc, item) => acc + item.ticketsSold,
    0
  );
  const totalRevenue = filteredSalesData.reduce(
    (acc, item) => acc + item.revenue,
    0
  );
  const averageTicketsSoldPerDay =
    filteredSalesData.length > 0
      ? totalTicketsSold / filteredSalesData.length
      : 0; // Avoid division by zero

  const chartData = {
    labels: filteredSalesData.map((item) =>
      format(new Date(item.date), "yyyy-MM-dd")
    ),
    datasets: [
      {
        label: "Tickets Sold",
        data: filteredSalesData.map((item) => item.ticketsSold),
        borderColor: "#EF4444", // Red color for Tickets Sold
        fill: false,
      },
      {
        label: "Revenue",
        data: filteredSalesData.map((item) => item.revenue),
        borderColor: "#3B82F6", // Blue color for Revenue
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          color: "#D1D5DB", // Light gray for text color in dark mode
          font: {
            size: 16,
            weight: "bold",
            family: "'Roboto', sans-serif",
          },
        },
        ticks: {
          color: "#D1D5DB", // Light gray for ticks in dark mode
          font: {
            size: 14,
            family: "'Roboto', sans-serif",
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount",
          color: "#D1D5DB", // Light gray for text color in dark mode
          font: {
            size: 16,
            weight: "bold",
            family: "'Roboto', sans-serif",
          },
        },
        ticks: {
          color: "#D1D5DB", // Light gray for ticks in dark mode
          font: {
            size: 14,
            family: "'Roboto', sans-serif",
          },
          beginAtZero: true,
        },
      },
    },
  };

  const handlePeriodChange = (direction) => {
    if (filter === "weekly" || filter === "monthly") {
      setCurrentMonth((prevMonth) => prevMonth + direction);
    }
  };

  const downloadSalesReport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSalesData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");
    XLSX.writeFile(workbook, "sales_report.xlsx");
  };

  return (
    <div className="font-kanit flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col pt-16 pr-5 pl-5 pb-5 lg:ml-64">
        <div className="bg-purple-800 p-6 rounded-t-2xl">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full lg:w-96">
            <h2 className="text-3xl mb-4 text-center font-bold text-purple-600">
              Sales Report
            </h2>
            <p className="text-gray-300 text-center">
              Overview of tickets sold and revenue.
            </p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-purple-400">
              Tickets Sold and Revenue Over Time
            </h3>
            <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-4">
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentMonth(0); // Reset currentMonth when changing filters
                }}
                className="p-2 border border-gray-600 rounded bg-gray-700"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              {filter === "weekly" && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePeriodChange(-1)}
                    disabled={currentMonth === 0} // Disable if it's the current week
                    className="p-2 border border-gray-600 rounded bg-gray-600 hover:bg-gray-700"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => handlePeriodChange(1)}
                    className="p-2 border border-gray-600 rounded bg-gray-600 hover:bg-gray-700"
                  >
                    Previous
                  </button>
                </div>
              )}
              {filter === "monthly" && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePeriodChange(1)}
                    disabled={currentMonth === 0} // Disable if it's the current month
                    className="p-2 border border-gray-600 rounded bg-gray-600 hover:bg-gray-700"
                  >
                    Next
                  </button>
                  <button
                    onClick={() => handlePeriodChange(-1)}
                    className="p-2 border border-gray-600 rounded bg-gray-600 hover:bg-gray-700"
                  >
                    Previous
                  </button>
                </div>
              )}
              <button
                onClick={downloadSalesReport}
                className="p-2 border border-gray-600 rounded bg-purple-600 text-white hover:bg-purple-700 mt-2 lg:mt-0"
              >
                Download Excel
              </button>
            </div>
          </div>
          <div className="lg:flex lg:space-x-6">
            <div className="w-full lg:w-2/3">
              <Line data={chartData} options={chartOptions} />
            </div>
            <div className="w-full lg:w-1/3 mt-6 lg:mt-0">
              <div className="bg-gray-700 p-6 rounded-2xl shadow-2xl">
                <h3 className="text-2xl mb-4 text-center font-bold text-purple-400">
                  Sales Summary
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-600 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-400">
                      Total Tickets Sold
                    </h4>
                    <p className="text-gray-300">
                      {totalTicketsSold} tickets sold
                    </p>
                  </div>
                  <div className="bg-gray-600 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-400">
                      Revenue
                    </h4>
                    <p className="text-gray-300">${totalRevenue.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-600 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-purple-400">
                      Average Tickets Sold per Day
                    </h4>
                    <p className="text-gray-300">
                      {averageTicketsSoldPerDay.toFixed(2)} tickets
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
