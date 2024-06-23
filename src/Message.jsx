import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatComponent from "./ChatComponent";

const MessageComponent = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "John Doe",
      subject: "Meeting Reminder",
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      timestamp: "2024-06-21T08:30:00Z",
      read: true,
      replies: [
        {
          id: 1,
          sender: "John Doe",
          message: "Thanks for the reminder!",
          timestamp: "2024-06-21T09:00:00Z",
        },
      ],
    },
    {
      id: 2,
      sender: "Jane Smith",
      subject: "Project Update",
      message:
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      timestamp: "2024-06-20T15:45:00Z",
      read: false,
      replies: [],
    },
    // Add more messages as needed
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);

  const openChat = (message) => {
    setSelectedMessage(message);
  };

  const closeChat = () => {
    setSelectedMessage(null);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col pt-16 pr-5 pl-5 pb-5 lg:ml-64">
        {selectedMessage ? (
          <ChatComponent
            message={selectedMessage}
            onClose={closeChat}
            messages={messages}
            setMessages={setMessages}
          />
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-semibold mb-6">Inbox</h1>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`bg-gray-700 rounded-lg p-4 mb-4 cursor-pointer ${
                  message.read ? "" : "font-semibold"
                }`}
                onClick={() => openChat(message)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold">{message.sender}</div>
                  <div className="text-gray-400 text-sm">
                    {new Date(message.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="font-medium">{message.subject}</div>
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
