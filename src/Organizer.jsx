import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "./Sidebar";
import AddOrganizerForm from "./AddOrganizerForm";
import EditOrganizerForm from "./EditOrganizerForm";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./config/firebaseConfig";

const OrganizerComponent = () => {
  const [organizers, setOrganizers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentOrganizer, setCurrentOrganizer] = useState(null);

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const fetchOrganizers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Accounts"));
      const organizerList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched organizers:", organizerList);
      setOrganizers(organizerList);
    } catch (error) {
      console.error("Error fetching organizers: ", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddOrganizer = async (newOrganizer) => {
    try {
      const docRef = await addDoc(collection(db, "Accounts"), newOrganizer);
      newOrganizer.id = docRef.id;
      setOrganizers([...organizers, newOrganizer]);
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding organizer: ", error);
    }
  };

  const handleSaveOrganizer = async (updatedOrganizer) => {
    try {
      const docRef = doc(db, "Accounts", updatedOrganizer.id);
      await updateDoc(docRef, updatedOrganizer);
      const updatedOrganizers = organizers.map((organizer) =>
        organizer.id === updatedOrganizer.id ? updatedOrganizer : organizer
      );
      setOrganizers(updatedOrganizers);
      setShowEditForm(false);
    } catch (error) {
      console.error("Error updating organizer: ", error);
    }
  };

  const handleDeleteOrganizer = async (organizerId) => {
    try {
      await deleteDoc(doc(db, "Accounts", organizerId));
      const updatedOrganizers = organizers.filter(
        (organizer) => organizer.id !== organizerId
      );
      setOrganizers(updatedOrganizers);
    } catch (error) {
      console.error("Error deleting organizer: ", error);
    }
  };

  const openEditForm = (organizerId) => {
    const organizer = organizers.find((org) => org.id === organizerId);
    setCurrentOrganizer(organizer);
    setShowEditForm(true);
  };

  const filteredOrganizers = organizers.filter(
    (organizer) =>
      organizer.name &&
      organizer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col pt-16 pr-5 pl-5 pb-5 lg:ml-64">
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <div className="mb-4 flex flex-col lg:flex-row items-start lg:items-center justify-between">
            <div className="relative flex-1 w-full lg:w-auto mb-4 lg:mb-0 lg:mr-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-700 shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 bg-gray-700 text-gray-100"
                  placeholder="Search organizers..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
              </div>
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

          {showEditForm && (
            <EditOrganizerForm
              organizer={currentOrganizer}
              onSaveOrganizer={handleSaveOrganizer}
              onCancel={() => setShowEditForm(false)}
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
                        {organizer.name || "N/A"} {/* Handle missing name */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {organizer.email || "N/A"} {/* Handle missing email */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex">
                          <button
                            className="mr-2 hover:text-purple-400"
                            onClick={() => openEditForm(organizer.id)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="mr-2 hover:text-purple-400"
                            onClick={() => handleDeleteOrganizer(organizer.id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
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
