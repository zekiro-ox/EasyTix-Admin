import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore"; // Import Firestore functions
import { Html5QrcodeScanner } from "html5-qrcode";
import Modal from "./Modal"; // Import the Modal component

const EventPanel = ({ event }) => {
  const navigate = useNavigate();
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [scannedTickets, setScannedTickets] = useState([]);

  useEffect(() => {
    const fetchRegisteredUsers = async () => {
      if (!event) {
        console.log("No event found.");
        return; // Ensure the event exists
      }

      try {
        const db = getFirestore();
        const customersCollection = collection(
          db,
          `events/${event.id}/customers`
        ); // Reference to customers subcollection
        console.log("Fetching from:", `events/${event.id}/customers`); // Log the path

        const customersSnapshot = await getDocs(customersCollection);

        if (customersSnapshot.empty) {
          console.log("No registered users found.");
          return;
        }

        // Map the customers into an array
        const usersList = customersSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: `${data.firstName} ${data.lastName}`, // Combine firstName and lastName
            email: data.email,
            phoneNumber: data.phoneNumber,
            ticketType: data.ticketType,
            quantity: data.quantity,
            status: "Confirmed", // Assuming status is always confirmed for registered users
          };
        });

        console.log("Registered users:", usersList); // Log the users fetched
        setRegisteredUsers(usersList); // Set the registered users in state
      } catch (error) {
        console.error("Error fetching registered users:", error);
      }
    };

    fetchRegisteredUsers();
  }, [event]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = registeredUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startQrScanner = () => {
    setIsQrScannerOpen(true);
  };

  useEffect(() => {
    if (isQrScannerOpen) {
      const qrCodeScanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: 250,
      });

      qrCodeScanner.render(
        (qrCodeMessage) => {
          const [name, email, phoneNumber, ticketType, quantity] =
            qrCodeMessage.split(",");
          const newTicket = {
            id: scannedTickets.length + 1,
            name,
            email,
            phoneNumber,
            ticketType,
            quantity,
            status: "Confirmed",
          };
          setScannedTickets((prevTickets) => [...prevTickets, newTicket]);
          qrCodeScanner.clear();
          setIsQrScannerOpen(false);
        },
        (errorMessage) => {
          console.log(
            `QR Code no longer in front of camera. Error: ${errorMessage}`
          );
        }
      );

      return () => {
        qrCodeScanner.clear();
      };
    }
  }, [isQrScannerOpen, scannedTickets]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="font-kanit flex items-center justify-between p-4 bg-gray-800">
        <button
          className="flex items-center text-white text-lg font-semibold mr-4 md:mr-8 hover:font-bold"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        {event && (
          <h1 className="text-xl md:text-2xl font-bold">
            {event.name} Details
          </h1>
        )}
        <div className="w-10"></div>
      </header>
      <main className="flex flex-col items-center p-4 md:p-8">
        {event && (
          <>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
              {event.name}
            </h2>
            <p className="text-base md:text-lg mb-4 md:mb-6">
              {event.description}
            </p>
          </>
        )}

        <div className="w-full max-w-lg mb-4 md:mb-6 flex items-center">
          <div className="relative flex items-center w-full">
            <input
              type="text"
              className="w-full px-3 md:px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Search by name"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button
            className="ml-2 px-4 py-2 font-semibold bg-purple-900 hover:bg-blue-700 rounded-lg text-white focus:outline-none"
            onClick={startQrScanner}
          >
            Scan
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="text-white bg-purple-900">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left">ID</th>
                <th className="px-4 md:px-6 py-3 text-left">Name</th>
                <th className="px-4 md:px-6 py-3 text-left">Email</th>
                <th className="px-4 md:px-6 py-3 text-left">Phone Number</th>
                <th className="px-4 md:px-6 py-3 text-left">Ticket Type</th>
                <th className="px-4 md:px-6 py-3 text-left">Quantity</th>
                <th className="px-4 md:px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {[...filteredUsers, ...scannedTickets].map((user, index) => (
                <tr key={index} className="text-gray-300">
                  <td className="px-4 md:px-6 py-3">{user.id}</td>
                  <td className="px-4 md:px-6 py-3">{user.name}</td>
                  <td className="px-4 md:px-6 py-3">{user.email}</td>
                  <td className="px-4 md:px-6 py-3">{user.phoneNumber}</td>
                  <td className="px-4 md:px-6 py-3">{user.ticketType}</td>
                  <td className="px-4 md:px-6 py-3">{user.quantity}</td>
                  <td className="px-4 md:px-6 py-3">{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Modal isOpen={isQrScannerOpen} onClose={() => setIsQrScannerOpen(false)}>
        <div id="qr-reader" style={{ width: "100%" }}></div>
      </Modal>
    </div>
  );
};

export default EventPanel;
