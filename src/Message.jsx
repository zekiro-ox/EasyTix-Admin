import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "./config/firebaseConfig";
import { useMessage } from "./MessageContext";
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

const MessageComponent = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);
  const [adminId, setAdminId] = useState(null);
  const { setNewMessageCount } = useMessage();

  const fetchAdminId = async () => {
    const adminRef = collection(db, "admins");
    const snapshot = await getDocs(adminRef);
    if (!snapshot.empty) {
      const adminDoc = snapshot.docs[0];
      setAdminId(adminDoc.id);
    } else {
      console.error("No admin found in the admins collection.");
    }
  };

  useEffect(() => {
    const messagesRef = collection(db, "conversations");

    const unsubscribe = onSnapshot(messagesRef, async (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch user names based on sender UIDs
      const userNamePromises = fetchedMessages.map(async (message) => {
        const userDocRef = doc(db, "users", message.sender); // Assuming 'sender' is the UID
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          return `${userData.firstName} ${userData.lastName}`;
        }
        return "Unknown User"; // Fallback if user not found
      });

      const userNamesArray = await Promise.all(userNamePromises);
      const messagesWithNames = fetchedMessages.map((message, index) => ({
        ...message,
        senderName: userNamesArray[index],
      }));
      const newMessagesCount = await Promise.all(
        messagesWithNames.map(async (message) => {
          const repliesRef = collection(
            db,
            "conversations",
            message.id,
            "replies"
          );
          const repliesSnapshot = await getDocs(repliesRef);
          return repliesSnapshot.empty ? 1 : 0;
        })
      );

      setNewMessageCount(newMessagesCount.reduce((a, b) => a + b, 0)); // Sum up the counts
      setMessages(messagesWithNames);
    });

    return () => unsubscribe();
  }, [setNewMessageCount]);

  const openMessage = async (message) => {
    setSelectedMessage(message);
    const repliesRef = collection(db, "conversations", message.id, "replies");

    const unsubscribe = onSnapshot(repliesRef, async (snapshot) => {
      const fetchedReplies = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          // Renamed 'doc' to 'docSnapshot'
          const replyData = docSnapshot.data();
          const userDocRef = doc(db, "users", replyData.sender); // Firestore `doc` function
          const userDocSnap = await getDoc(userDocRef);

          const senderName = userDocSnap.exists()
            ? `${userDocSnap.data().firstName} ${userDocSnap.data().lastName}`
            : "Unknown User"; // Fallback if user not found

          return {
            id: docSnapshot.id,
            ...replyData,
            sender: senderName,
          };
        })
      );
      setMessageHistory(fetchedReplies);
    });

    return () => unsubscribe();
  };

  const closeMessage = () => {
    setSelectedMessage(null);
    setMessageHistory([]);
  };

  const handleReply = async () => {
    if (selectedMessage && adminId) {
      const repliesRef = collection(
        db,
        "conversations",
        selectedMessage.id,
        "replies"
      );
      await addDoc(repliesRef, {
        reply: replyMessage,
        sender: adminId,
        timestamp: new Date().toISOString(),
      });

      setReplyMessage("");
      notify("Messaged sent!", "successfullysent", "success"); // Optionally close the message after replying
    }
  };

  useEffect(() => {
    fetchAdminId();
  }, []);
  return (
    <div className="font-kanit flex flex-col lg:flex-row min-h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col pt-16 pr-5 pl-5 pb-5 lg:ml-64">
        <ToastContainer />
        {selectedMessage ? (
          <div className="font-kanit bg-gray-900 text-gray-100 rounded-lg shadow-md p-6 w-full lg:w-3/4 mx-auto mt-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                {selectedMessage.subject}
              </h2>
            </div>
            <div className="mb-4">
              <div className="font-semibold">{selectedMessage.senderName}</div>
              <div className="text-gray-400 text-sm">
                {new Date(selectedMessage.timestamp).toLocaleString()}
              </div>
            </div>
            <div className="text-gray-300 mb-6">{selectedMessage.message}</div>

            {/* Message history */}
            <h3 className="text-lg font-semibold mb-2">Message History</h3>
            <div className="space-y-4">
              {messageHistory.map((reply) => (
                <div key={reply.id} className="flex flex-col">
                  <div className="flex items-center">
                    <div className="font-semibold">You</div>
                    <div className="text-gray-400 text-sm ml-auto">
                      {new Date(reply.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-gray-300">{reply.reply}</div>
                </div>
              ))}
            </div>

            {/* Reply textarea */}
            <textarea
              className="w-full mt-4 px-3 py-2 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 focus:border-indigo-300 bg-gray-800 text-gray-100"
              rows="4"
              placeholder="Reply to this message..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleReply}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200 mr-2"
              >
                Send Reply
              </button>
              <button
                onClick={closeMessage}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-semibold mb-6">Inbox</h1>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`bg-gray-700 rounded-lg p-4 mb-4 cursor-pointer`}
                onClick={() => openMessage(message)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold">{message.senderName}</div>
                  <div className="text-gray-400 text-sm">
                    {new Date(message.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="font-medium">Subject: {message.subject}</div>
                <div className="text-gray-300">{message.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageComponent;
