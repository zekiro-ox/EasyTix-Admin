import React, { useState, useEffect } from "react";

const ChatComponent = ({ message, onClose, messages, setMessages }) => {
  const [replyMessage, setReplyMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);

  useEffect(() => {
    // Initialize message history with replies from the selected message
    setMessageHistory(message.replies);
  }, [message]);

  const handleReply = () => {
    // Here you would handle sending the reply message
    console.log("Replying to message:", message, "Message:", replyMessage);

    // Simulate real-time update by updating local state after a delay
    setTimeout(() => {
      const newReply = {
        id: messageHistory.length + 1, // Replace with actual ID generation logic
        sender: "You",
        message: replyMessage,
        timestamp: new Date().toISOString(),
      };

      // Update local message history
      setMessageHistory((prevHistory) => [...prevHistory, newReply]);

      // Update the message with the new reply
      const updatedMessages = messages.map((msg) =>
        msg.id === message.id
          ? {
              ...msg,
              read: true,
              replies: [...msg.replies, newReply],
            }
          : msg
      );
      setMessages(updatedMessages);
      setReplyMessage(""); // Clear reply message
    }, 1000); // Simulate a delay for realistic effect
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full lg:w-3/4 mx-auto mt-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{message.subject}</h2>
      </div>
      <div className="mb-4">
        <div className="font-semibold">{message.sender}</div>
        <div className="text-gray-500 text-sm">
          {new Date(message.timestamp).toLocaleString()}
        </div>
      </div>
      <div className="text-gray-600 mb-6">{message.message}</div>

      {/* Message history */}
      <h3 className="text-lg font-semibold mb-2">Message History</h3>
      <div className="space-y-4">
        {messageHistory.map((reply) => (
          <div key={reply.id} className="flex flex-col">
            <div className="flex items-center">
              <div className="font-semibold">{reply.sender}</div>
              <div className="text-gray-500 text-sm ml-auto">
                {new Date(reply.timestamp).toLocaleString()}
              </div>
            </div>
            <div className="text-gray-600">{reply.message}</div>
          </div>
        ))}
      </div>

      {/* Reply textarea */}
      <textarea
        className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-300 focus:border-indigo-300"
        rows="4"
        placeholder="Reply to this message..."
        value={replyMessage}
        onChange={(e) => setReplyMessage(e.target.value)}
      />
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleReply}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-200 mr-2"
        >
          Send Reply
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
