import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaSync } from "react-icons/fa"; // Import FaSync for the reload icon
import { useNavigate, useLocation } from "react-router-dom";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore"; // Import Firestore functions
import { Html5QrcodeScanner } from "html5-qrcode";
import Modal from "./Modal";
import { ToastContainer, toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const notify = (message, id, type = "error") => {
  if (!toast.isActive(id)) {
    if (type === "error") {
      toast.error(message, { toastId: id });
    } else if (type === "success") {
      toast.success(message, { toastId: id });
    }
  }
}; // Import the Modal component

const EventPanel = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const event = location.state?.event; // Access the event from location state
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [scannedTickets, setScannedTickets] = useState(new Set()); // Use Set to track scanned tickets

  const fetchRegisteredUsers = async () => {
    if (!event) {
      console.log("No event found.");
      return; // Ensure the event exists
    }

    try {
      const db = getFirestore();
      const customersCollection = collection(
        db,
        `events/${event.id}/customers` // Reference to customers subcollection
      );
      const customersSnapshot = await getDocs(customersCollection);

      if (customersSnapshot.empty) {
        console.log("No registered users found.");
        return;
      }

      // Map the customers into an array
      const usersList = customersSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id, // This is the document ID
          ticketID: data.ticketID, // Add ticketID to user object
          name: `${data.firstName} ${data.lastName}`, // Combine firstName and lastName
          email: data.email,
          phoneNumber: data.phoneNumber,
          ticketType: data.ticketType,
          quantity: data.quantity,
          status: data.status || "Pending", // Default status if not set
        };
      });

      setRegisteredUsers(usersList); // Set the registered users in state
    } catch (error) {
      console.error("Error fetching registered users:", error);
    }
  };

  useEffect(() => {
    fetchRegisteredUsers(); // Fetch users on component mount
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

  const handleReload = () => {
    fetchRegisteredUsers(); // Call the fetch function to reload users
  };

  useEffect(() => {
    if (isQrScannerOpen) {
      const qrCodeScanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: 250,
      });

      qrCodeScanner.render(
        async (qrCodeMessage) => {
          try {
            // Parse the JSON string from QR code
            const ticketData = JSON.parse(qrCodeMessage); // Parse the JSON string
            const ticketID = ticketData.ticketID; // Extract the ticketID

            console.log("Scanned Ticket ID:", ticketID); // Log scanned ticket ID

            // Check if the ticket has already been scanned
            if (scannedTickets.has(ticketID)) {
              notify("This ticket has already been scanned.", "errorScan");
              qrCodeScanner.clear();
              setIsQrScannerOpen(false);
              return; // Exit if already scanned
            }
            // Find the user in the registered users list using document ID
            const userDocRef = doc(
              getFirestore(),
              `events/${event.id}/customers`,
              ticketID
            );
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userData = userDoc.data();
              const { firstName, lastName } = userData;

              // Update Firestore document for the matched user
              await updateDoc(userDocRef, {
                status: "Registered", // Update status to Registered
              });

              // Update local state to reflect the change
              setRegisteredUsers((prevUsers) =>
                prevUsers.map((u) =>
                  u.id === ticketID ? { ...u, status: "Registered" } : u
                )
              );

              // Add the ticketID to the scanned tickets set
              setScannedTickets((prev) => new Set(prev).add(ticketID));

              notify(
                `User ${firstName} ${lastName} is now registered.`,
                "successSent",
                "success"
              );
              console.log(`User  ${firstName} ${lastName} is now registered.`);
            } else {
              notify(
                "No matching user found for the scanned ticket.",
                "errorValid"
              );
              console.log("No matching user found for the scanned ticket.");
            }
          } catch (error) {
            console.error("Error parsing QR code data:", error);
          }

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
  }, [isQrScannerOpen, registeredUsers, event]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="font-kanit flex items-center justify-between p-4 bg-gray-800">
        <ToastContainer />
        <button
          className="flex items-center text-white text-lg font-semibold mr-4 md:mr-8 hover:font-bold"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        {event && (
          <h1 className="text-xl md :text-2xl font-bold">
            {event.name} Registration
          </h1>
        )}
        <div className="w-10"></div>
        <button
          className="flex items-center text-white text-lg font-semibold mr-4 md:mr-8 hover:font-bold"
          onClick={handleReload}
        >
          <FaSync className="mr-2" />
          Reload
        </button>
      </header>
      <main className="flex flex-col items-center p-4 md:p-8">
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
              {filteredUsers.map((user, index) => (
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
