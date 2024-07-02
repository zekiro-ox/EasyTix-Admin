import React, { useState } from "react";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { QrReader } from "react-qr-reader";

const EventPanel = ({ event, onBack }) => {
  const [registeredUsers, setRegisteredUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      ticketType: "VIP",
      quantity: 2,
      status: "Confirmed",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      ticketType: "Regular",
      quantity: 1,
      status: "Pending",
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "michael.johnson@example.com",
      ticketType: "VIP",
      quantity: 3,
      status: "Confirmed",
    },
    // Add more users as needed
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [qrScanResult, setQrScanResult] = useState(null);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false); // State for controlling QR scanner visibility

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleScan = (data) => {
    if (data) {
      setQrScanResult(data);
      console.log("Scanned QR code:", data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const toggleQrScanner = () => {
    setIsQrScannerOpen(!isQrScannerOpen);
    setQrScanResult(null); // Clear previous scan result when closing
  };

  const filteredUsers = registeredUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="flex items-center justify-between p-4 bg-gray-800">
        <button
          className="flex items-center text-white text-sm font-semibold mr-4 md:mr-8"
          onClick={onBack}
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h1 className="text-xl md:text-2xl font-bold">{event.name} Details</h1>
        <div className="w-10"></div>
      </header>
      <main className="flex flex-col items-center p-4 md:p-8">
        <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
          {event.name}
        </h2>
        <p className="text-base md:text-lg mb-4 md:mb-6">{event.description}</p>

        <div className="w-full max-w-lg mb-4 md:mb-6">
          <div className="relative flex items-center">
            <input
              type="text"
              className="w-full px-3 md:px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              onClick={toggleQrScanner}
              className="ml-2 px-3 md:px-4 py-2 rounded-lg bg-blue-500 text-white focus:outline-none hover:bg-blue-600"
            >
              Scan
            </button>
          </div>
        </div>

        {/* Conditional rendering based on isQrScannerOpen state */}
        {isQrScannerOpen && (
          <div className="w-full max-w-lg mb-4 md:mb-6">
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%" }}
            />
            <p className="text-xs md:text-sm mt-2">
              {qrScanResult
                ? `Scanned QR Code: ${qrScanResult}`
                : "Scanning QR code..."}
            </p>
          </div>
        )}

        <div className="w-full max-w-screen-lg overflow-x-auto">
          <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="text-white">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left">ID</th>
                <th className="px-4 md:px-6 py-3 text-left">Name</th>
                <th className="px-4 md:px-6 py-3 text-left">Email</th>
                <th className="px-4 md:px-6 py-3 text-left">Ticket Type</th>
                <th className="px-4 md:px-6 py-3 text-left">Quantity</th>
                <th className="px-4 md:px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="text-gray-300">
                  <td className="px-4 md:px-6 py-3">{user.id}</td>
                  <td className="px-4 md:px-6 py-3">{user.name}</td>
                  <td className="px-4 md:px-6 py-3">{user.email}</td>
                  <td className="px-4 md:px-6 py-3">{user.ticketType}</td>
                  <td className="px-4 md:px-6 py-3">{user.quantity}</td>
                  <td className="px-4 md:px-6 py-3">{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default EventPanel;
