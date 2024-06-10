/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";
import { CheckApiConnection } from "./apiService";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [apiConnected, setApiConnected] = useState(true);

  useEffect(() => {
    const initializeApiConnection = async () => {
      const isConnected = await CheckApiConnection();
      setApiConnected(isConnected);
    };
    initializeApiConnection();
  }, []);

  return (
    <ApiContext.Provider value={{ apiConnected }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
