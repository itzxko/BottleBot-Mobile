import React, { createContext, useContext } from "react";

const SampleContext = createContext<any>(null);

export const SampleProvider = () => {
  return <div>SampleProvider</div>;
};

export const useSample = () => useContext(SampleContext);
