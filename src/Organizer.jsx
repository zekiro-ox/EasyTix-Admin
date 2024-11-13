import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaKey } from "react-icons/fa";
import Sidebar from "./Sidebar";
import AddOrganizerForm from "./AddOrganizerForm";
import EditOrganizerForm from "./EditOrganizerForm";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "./config/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
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
};

const OrganizerComponent = () => {
  const [organizers, setOrganizers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editOrganizer, setEditOrganizer] = useState(null);

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const fetchOrganizers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "organizer"));
      const organizerList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrganizers(organizerList);
    } catch (error) {
      console.error("Error fetching organizers:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddOrganizer = async ({
    firstName,
    lastName,
    email,
    password,
  }) => {
    try {
      // Create a user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid } = userCredential.user;

      // Save additional user details in Firestore
      await setDoc(doc(db, "organizer", uid), {
        firstName,
        lastName,
        email,
        uid,
      });

      // Update the local state
      setOrganizers([
        ...organizers,
        { id: uid, firstName, lastName, email, uid },
      ]);
      setShowAddForm(false);
      notify("Account created!", "successfulCreation", "success");
    } catch (error) {
      console.error("Error adding organizer:", error);
      notify("Failed to create", "errorCreation");
    }
  };

  const handleUpdateOrganizer = async ({ id, firstName, lastName }) => {
    try {
      // Update Firestore document
      const organizerRef = doc(db, "organizer", id);
      await setDoc(organizerRef, { firstName, lastName }, { merge: true });

      // Update local state
      setOrganizers((prev) =>
        prev.map((org) =>
          org.id === id ? { ...org, firstName, lastName } : org
        )
      );
      setEditOrganizer(null);
      notify("Updated!", "successfulCreation", "success");
    } catch (error) {
      console.error("Error updating organizer:", error);
      notify("Failed to edit", "errorCreation");
    }
  };

  const handleSendResetPassword = async (email) => {
    // Check if the email is a valid Gmail address
    if (!email.endsWith("@gmail.com")) {
      notify("The email address is not a valid Gmail address.", "errorValid");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      notify(
        "Reset password link has been sent successfully.",
        "successSent",
        "success"
      );
    } catch (error) {
      console.error("Error sending reset password email:", error);
      notify(
        "Failed to send reset password link. Please try again.",
        "errorSent"
      );
    }
  };

  const filteredOrganizers = organizers.filter((organizer) =>
    `${organizer.firstName} ${organizer.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <div className="font-kanit flex-1 flex flex-col pt-16 pr-5 pl-5 pb-5 lg:ml-64">
        <ToastContainer />
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-4 flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="relative flex-1 w-full lg:w-auto mb-4 lg:mb-0 lg:mr-4">
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-700 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 bg-gray-700 text-gray-100"
                placeholder="Search organizers..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 rounded-lg bg-purple-800 text-white hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-200"
            >
              <FaPlus className="mr-2" />
              Add Organizer
            </button>
          </div>

          {showAddForm && (
            <AddOrganizerForm
              onAddOrganizer={handleAddOrganizer}
              onCancel={() => setShowAddForm(false)}
            />
          )}
          {editOrganizer && (
            <EditOrganizerForm
              organizer={editOrganizer}
              onUpdateOrganizer={handleUpdateOrganizer}
              onCancel={() => setEditOrganizer(null)}
            />
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-700 rounded-lg shadow-md overflow-hidden">
              <thead className="bg-purple-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredOrganizers.length > 0 ? (
                  filteredOrganizers.map((organizer) => (
                    <tr key={organizer.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {organizer.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {organizer.firstName} {organizer.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {organizer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <button
                          className="mr-2 hover:text-purple-400"
                          onClick={() => setEditOrganizer(organizer)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="hover:text-purple-400"
                          onClick={() =>
                            handleSendResetPassword(organizer.email)
                          }
                          title="Reset Password"
                        >
                          <FaKey />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-center text-gray-400"
                    >
                      No organizers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerComponent;
