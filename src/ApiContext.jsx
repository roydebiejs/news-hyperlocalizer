/* eslint-disable react/prop-types */

import { createContext, useContext, useState, useEffect } from "react";
import { CheckApiConnection } from "./apiService";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  const [apiConnected, setApiConnected] = useState(false);

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
  return useContext(ApiContext);
};
