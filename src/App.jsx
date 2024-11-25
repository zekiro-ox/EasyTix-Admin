import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import OrganizerLogin from "./OrganizerLogin";
import AdminDashboard from "./AdminDashboard";
import SalesReport from "./SalesReport";
import EventComponent from "./Event";
import MessageComponent from "./Message";
import UsersComponent from "./Users";
import OrganizerComponent from "./Organizer";
import ArchiveComponent from "./Archive";
import OrganizerDashboard from "./OrganizerDashboard";
import EventPanel from "./EventPanel";
import ProtectedRoute from "./ProtectedRoute";
import { MessageProvider } from "./MessageContext";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <MessageProvider>
      <Router>
        <Routes>
          <Route
            path="/admin-login"
            element={<AdminLogin setAuth={setIsAuthenticated} />}
          />
          <Route path="/organizer-login" element={<OrganizerLogin />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={AdminDashboard}
              />
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={EventComponent}
              />
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={MessageComponent}
              />
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={UsersComponent}
              />
            }
          />
          <Route
            path="/organizer"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={OrganizerComponent}
              />
            }
          />
          <Route
            path="/archive"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={ArchiveComponent}
              />
            }
          />
          <Route
            path="/sales-report"
            element={<SalesReport salesData={salesData} />}
          />{" "}
          {/* Add SalesReport route */}
          <Route
            path="/"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={AdminLogin}
              />
            }
          />
          <Route
            path="/organizer-dashboard"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={OrganizerDashboard}
              />
            }
          />
          <Route
            path="/event/:id"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                element={EventPanel}
              />
            }
          />
        </Routes>
      </Router>
    </MessageProvider>
  );
}

export default App;
