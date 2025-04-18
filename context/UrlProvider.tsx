import React, { useContext, createContext } from "react";

const UrlContext = createContext<any>(null);

export const UrlProvider = ({ children }: any) => {
  // const ipAddress = "192.168.254.139";
  // const ipAddress = "192.168.22.92";
  // const ipAddress = "192.168.254.167";
  const ipAddress = "192.168.254.181";
  const port = 8080;
  const urlString = "https://bottlebot.onrender.com";

  return (
    <UrlContext.Provider value={{ ipAddress, port, urlString }}>
      {children}
    </UrlContext.Provider>
  );
};

export const useUrl = () => useContext(UrlContext);
