import React, { createContext, useState, useContext } from "react";

// Create a Context
const MessageContext = createContext();

// Create a Provider Component
export const MessageProvider = ({ children }) => {
  const [newMessageCount, setNewMessageCount] = useState(0);

  return (
    <MessageContext.Provider value={{ newMessageCount, setNewMessageCount }}>
      {children}
    </MessageContext.Provider>
  );
};

// Create a custom hook to use the MessageContext
export const useMessage = () => {
  return useContext(MessageContext);
};
