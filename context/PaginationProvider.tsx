import React, { createContext, useContext } from "react";

const PaginationContext = createContext<any>(null);

export const PaginationProvider = ({ children }: any) => {
  const rewardLimit = 6;
  const userLimit = 4;
  const historyLimit = 4;

  return (
    <PaginationContext.Provider
      value={{ rewardLimit, userLimit, historyLimit }}
    >
      {children}
    </PaginationContext.Provider>
  );
};

export const usePagination = () => useContext(PaginationContext);
