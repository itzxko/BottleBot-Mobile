import { View, Text } from "react-native";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useUrl } from "./UrlProvider";

const AdminHistoryContext = createContext<any>(null);

export const AdminHistoryProvider = ({ children }: any) => {
  const [rewardsHistory, setRewardsHistory] = useState([]);
  const [pointsHistory, setPointsHistory] = useState([]);
  const { ipAddress, port } = useUrl();
  const [rewardTotalPages, setRewardTotalPages] = useState(0);
  const [pointTotalPages, setPointTotalPages] = useState(0);

  const getRewardsHistory = async (
    userName: string,
    pageNumber: number,
    limit: number,
    status: string
  ) => {
    if (pageNumber && limit && status) {
      try {
        let url = `http://${ipAddress}:${port}/api/history/claim?userName=${userName}&page=${pageNumber}&limit=${limit}&status=${status}`;

        let response = await axios.get(url);

        if (response.data.success === true) {
          setRewardsHistory(response.data.allusersrewardclaimhistory);
          setRewardTotalPages(response.data.totalPages);
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getPointsHistory = async (
    userName: string,
    pageNumber: number,
    limit: number,
    status: string
  ) => {
    if (pageNumber && limit && status) {
      try {
        let url = `http://${ipAddress}:${port}/api/history/dispose?userName=${userName}&page=${pageNumber}&limit=${limit}&status=${status}`;

        let response = await axios.get(url);

        if (response.data.success === true) {
          setPointsHistory(response.data.allusersdisposalhistory);
          setPointTotalPages(response.data.totalPages);
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <AdminHistoryContext.Provider
      value={{
        getRewardsHistory,
        rewardsHistory,
        rewardTotalPages,
        getPointsHistory,
        pointsHistory,
        pointTotalPages,
      }}
    >
      {children}
    </AdminHistoryContext.Provider>
  );
};

export const useAdminHistory = () => useContext(AdminHistoryContext);
