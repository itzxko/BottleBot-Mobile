import { View, Text } from "react-native";
import React, { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import { useUrl } from "./UrlProvider";

const RewardsContext = createContext<any>(null);

export const RewardsProvider = ({ children }: any) => {
  const [rewards, setRewards] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [allRewards, setAllRewards] = useState([]);

  const { ipAddress, port, urlString } = useUrl();

  const getRewards = async (
    rewardName: string,
    category: string,
    pageNumber: number,
    limit: number,
    status: string
  ) => {
    if (pageNumber && limit && status) {
      try {
        let url = `${urlString}/api/rewards?rewardName=${rewardName}&category=${category}&page=${pageNumber}&limit=${limit}&status=${status}`;

        const response = await axios.get(url);

        if (response.data.success === true) {
          setRewards(response.data.rewards);
          setTotalPages(response.data.totalPages);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getActiveRewards = async (
    rewardName: string,
    category: string,
    page: number,
    limit: number
  ) => {
    if (page && limit) {
      try {
        let url = `${urlString}/api/rewards?rewardName=${rewardName}&category=${category}&page=${page}&limit=${limit}&status=active`;

        let response = await axios.get(url);

        if (response.data.success === true) {
          setRewards(response.data.rewards);
          setTotalPages(response.data.totalPages);
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  const getAllRewards = async () => {
    try {
      let url = `${urlString}/api/rewards?page=1&limit=0`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setAllRewards(response.data.rewards);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <RewardsContext.Provider
      value={{
        rewards,
        getRewards,
        totalPages,
        getActiveRewards,
        getAllRewards,
        allRewards,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = () => useContext(RewardsContext);
