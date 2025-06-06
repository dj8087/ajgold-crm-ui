import React, { createContext, useContext, useRef, ReactNode } from "react";

// Define the shape of the context
interface EventContextValue {
  registerEvent: (eventName: string, handler: (data: any | null) => void) => void;
  triggerEvent: (eventName: string, data: any | null) => void;
}

// Create the context
const EventContext = createContext<EventContextValue | undefined>(undefined);

// Define the provider's props
interface EventProviderProps {
  children: ReactNode;
}

// Create the provider component
export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const eventHandlers = useRef<Map<string, (data: any | null) => void>>(new Map());

  const registerEvent = (eventName: string, handler: (data: any | null) => void) => {
    eventHandlers.current.set(eventName, handler);
  };

  const triggerEvent = (eventName: string, data: any | null) => {
    const handler = eventHandlers.current.get(eventName);
    if (handler) {
      handler(data);
    } else {
      console.warn(`No handler registered for event: ${eventName}`);
    }
  };

  return (
    <EventContext.Provider value={{ registerEvent, triggerEvent }}>
      {children}
    </EventContext.Provider>
  );
};

// Custom hook for consuming the EventContext
export const useEventContext = (): EventContextValue => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEventContext must be used within an EventProvider");
  }
  return context;
};