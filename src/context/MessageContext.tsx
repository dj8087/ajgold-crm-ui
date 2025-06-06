import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface MessageContextValue {
  workingCallPurpose: string; // Renamed field
  updateWorkingCallPurpose: (newPurpose: string) => void; // Updated function name
}

// Create the context with a default value (will be overridden by the provider)
const MessageContext = createContext<MessageContextValue | undefined>(undefined);

// Define the provider component's props
interface MessageProviderProps {
  children: ReactNode; // ReactNode allows any valid React child elements
}

// Create the provider component
export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [workingCallPurpose, setWorkingCallPurpose] = useState<string>(""); // Updated state name

  const updateWorkingCallPurpose = (newPurpose: string) => {
    setWorkingCallPurpose(newPurpose);
  };

  return (
    <MessageContext.Provider value={{ workingCallPurpose, updateWorkingCallPurpose }}>
      {children}
    </MessageContext.Provider>
  );
};

// Custom hook for consuming the message context
export const useMessageContext = (): MessageContextValue => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
};