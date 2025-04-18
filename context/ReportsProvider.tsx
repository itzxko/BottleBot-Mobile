import { View, Text } from "react-native";
import React, { createContext, useContext, useState } from "react";
import { useUrl } from "./UrlProvider";
import axios from "axios";

const ReportsContext = createContext<any>(null);

export const ReportsProvider = ({ children }: any) => {
  const [totalCollected, setTotalCollected] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalClaims, setTotalClaims] = useState(0);
  const [demographics, setDemographics] = useState({
    male: 0,
    female: 0,
    other: 0,
  });
  const [accountsSummary, setAccountsSummary] = useState({
    admin: 0,
    staff: 0,
    citizen: 0,
  });
  const [topContributors, setTopContributors] = useState([]);
  const [topRewards, setTopRewards] = useState([]);
  const { urlString } = useUrl();

  const getTotalCollected = async (startDate: string, endDate: string) => {
    try {
      let url = `${urlString}/api/reports/total-collected?startDate=${startDate}&endDate=${endDate}`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setTotalCollected(response.data.data.totalBottles);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const getTotalPoints = async (startDate: string, endDate: string) => {
    try {
      let url = `${urlString}/api/reports/points-accumulated?startDate=${startDate}&endDate=${endDate}`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setTotalPoints(response.data.data.totalPoints);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const getTotalClaims = async (startDate: string, endDate: string) => {
    try {
      let url = `${urlString}/api/reports/total-claimed?startDate=${startDate}&endDate=${endDate}`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setTotalClaims(response.data.data.totalClaims);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const getDemographics = async () => {
    try {
      let url = `${urlString}/api/reports/demographics`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        const newDemographics = response.data.data.reduce(
          (acc: any, curr: any) => {
            acc[curr._id.toLowerCase()] = curr.count; // Convert keys to lowercase
            return acc;
          },
          { male: 0, female: 0, other: 0 }
        );

        setDemographics(newDemographics);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const getAccountsSummary = async () => {
    try {
      let url = `${urlString}/api/reports/account-summary`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        const newAccountsSummary = response.data.data.reduce(
          (acc: any, curr: any) => {
            acc[curr._id.toLowerCase()] = curr.count; // Convert keys to lowercase
            return acc;
          },
          { admin: 0, staff: 0, citizen: 0 }
        );

        setAccountsSummary(newAccountsSummary);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const getTopContributors = async (startDate: string, endDate: string) => {
    try {
      let url = `${urlString}/api/reports/top-contributors?startDate=${startDate}&endDate=${endDate}`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setTopContributors(response.data.data);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const getTopRewards = async (startDate: string, endDate: string) => {
    try {
      let url = `${urlString}/api/reports/most-redeemed?startDate=${startDate}&endDate=${endDate}`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setTopRewards(response.data.data);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <ReportsContext.Provider
      value={{
        totalCollected,
        getTotalCollected,
        totalPoints,
        getTotalPoints,
        totalClaims,
        getTotalClaims,
        demographics,
        getDemographics,
        accountsSummary,
        getAccountsSummary,
        topContributors,
        getTopContributors,
        topRewards,
        getTopRewards,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => useContext(ReportsContext);
