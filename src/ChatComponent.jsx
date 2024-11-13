import React, { useState } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore"; // Import `doc` and `setDoc`
import { getAuth } from "firebase/auth";
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

const ChatComponent = ({ message, onClose, messages, setMessages }) => {
  const [reply, setReply] = useState("");

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const messagesRef = collection(
        db,
        "conversations",
        message.id,
        "messages"
      );

      // Add the reply message to the messages subcollection
      await addDoc(messagesRef, {
        message: reply,
        senderId: user.uid,
        timestamp: new Date().toISOString(),
      });

      notify("Messaged sent!", "successfullysent", "success");

      // Update the last message in the conversation
      await updateLastMessage(message.id, reply, user.uid);

      setReply("");
      onClose(); // Close chat after sending reply
    }
  };

  const updateLastMessage = async (conversationId, replyMessage, senderId) => {
    const db = getFirestore();
    const conversationRef = doc(db, "conversations", conversationId);

    await setDoc(
      conversationRef,
      {
        lastMessage: {
          message: replyMessage,
          senderId,
          timestamp: new Date().toISOString(),
        },
        lastUpdatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">
        Chat with {message.initiatedBy}
      </h2>
      <div className="overflow-y-auto h-64 mb-4">
        {/* Display messages here */}
        {/* You can fetch and display messages from the messages subcollection */}
      </div>
      <form onSubmit={handleReplySubmit} className="flex">
        <textarea
          className="flex-1 p-2 border border-gray-300 rounded-md bg-neutral-700 text-white"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Type your reply..."
          required
        />
        <button
          type="submit"
          className="ml-2 text-white px-4 py-2 rounded-md font-bold bg-violet-500 hover:bg-violet-600"
        >
          Send
        </button>
      </form>
      <button onClick={onClose} className="mt-4 text-gray-400 hover:underline">
        Close Chat
      </button>
    </div>
  );
};

export default ChatComponent;
