import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import OrganizerLogin from "./OrganizerLogin";
import AdminDashboard from "./AdminDashboard";
import SalesReport from "./SalesReport"; // Import SalesReport component
import "./App.css";

const salesData = Array.from({ length: 150 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  return {
    date: date.toISOString().split("T")[0],
    ticketsSold: Math.floor(Math.random() * 20) + 1, // Adjusted for ticket sales
    revenue: (Math.floor(Math.random() * 100) + 10) * 5, // Adjusted for revenue per ticket
  };
}).reverse();

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/organizer-login" element={<OrganizerLogin />} />
        <Route
          path="/dashboard"
          element={<AdminDashboard salesData={salesData} />}
        />
        <Route
          path="/sales-report"
          element={<SalesReport salesData={salesData} />}
        />{" "}
        {/* Add SalesReport route */}
        <Route path="/" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
