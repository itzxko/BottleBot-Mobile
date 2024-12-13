import React, { useContext, createContext } from "react";

const UrlContext = createContext<any>(null);

export const UrlProvider = ({ children }: any) => {
  // const ipAddress = "192.168.254.139";
  // const ipAddress = "192.168.22.92";
  const ipAddress = "192.168.254.139";
  const port = 8080;

  return (
    <UrlContext.Provider value={{ ipAddress, port }}>
      {children}
    </UrlContext.Provider>
  );
};

export const useUrl = () => useContext(UrlContext);
