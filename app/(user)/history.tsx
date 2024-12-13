import {
  View,
  Text,
  ScrollView,
  TouchableHighlight,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/loader";
import { LinearGradient } from "expo-linear-gradient";
import { useHistory } from "@/context/UserHistoryProvider";
import { ImageBackground } from "expo-image";
import { useUrl } from "@/context/UrlProvider";
import { usePagination } from "@/context/PaginationProvider";
import RemixIcon from "react-native-remix-icon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRewards } from "@/context/RewardsProvider";

// Define the interfaces
interface User {
  personalInfo: {
    firstName: string;
    lastName: string;
  };
}

interface Reward {
  _id: string;
  rewardName: string;
  image: string;
}

interface RewardHistory {
  _id: string;
  rewardId: string;
  pointsSpent: number;
  dateClaimed: string;
}

interface PointHistory {
  _id: string;
  pointsAccumulated: number;
  bottleCount: number;
  dateDisposed: string;
}

const History: React.FC = () => {
  const { user } = useAuth() as { user: User };
  const { rewards, getAllRewards } = useRewards();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const {
    pointsHistory,
    rewardsHistory,
    getPointsHistory,
    getRewardsHistory,
    pointsTotalPages,
    rewardTotalPages,
  } = useHistory();
  const { ipAddress, port } = useUrl();
  const [rewardCurrentPage, setRewardCurrentPage] = useState(1);
  const [pointCurrentPage, setPointCurrentPage] = useState(1);
  const { historyLimit } = usePagination();
  const [rewardStartDate, setRewardStartDate] = useState("");
  const [rewardEndDate, setRewardEndDate] = useState("");
  const [pointsStartDate, setPointsStartDate] = useState("");
  const [pointsEndDate, setPointsEndDate] = useState("");
  const [userId, setUserId] = useState("");

  //show reward
  const [showRewardStartPicker, setShowRewardStartPicker] = useState(false);
  const [showRewardEndPicker, setShowRewardEndPicker] = useState(false);

  // show points
  const [showPointsStartPicker, setShowPointsStartPicker] = useState(false);
  const [showPointsEndPicker, setShowPointsEndPicker] = useState(false);

  useEffect(() => {
    fetchRewardsData();
  }, [userId, rewardStartDate, rewardEndDate, rewardCurrentPage]);

  useEffect(() => {
    getAllRewards();
  }, []);

  useEffect(() => {
    fetchPointsData();
  }, [userId, pointsStartDate, pointsEndDate, pointCurrentPage]);

  const fetchRewardsData = async () => {
    if (userId) {
      getRewardsHistory(
        userId,
        rewardStartDate,
        rewardEndDate,
        rewardCurrentPage,
        historyLimit
      );
    }
  };

  const fetchPointsData = async () => {
    if (userId) {
      getPointsHistory(
        userId,
        pointsStartDate,
        pointsEndDate,
        pointCurrentPage,
        historyLimit
      );
    }
  };

  const fetchId = async () => {
    const user = await AsyncStorage.getItem("user");

    if (user) {
      const currentUser = JSON.parse(user);

      if (currentUser) {
        setUserId(currentUser._id);
      }
    }
  };

  useEffect(() => {
    fetchId();
  }, []);

  const handleRewardStartDateChange = (
    event: any,
    selectedDate: Date | undefined
  ) => {
    if (event.type === "dismissed") {
      setRewardStartDate("");
      setShowRewardStartPicker(false);
    } else {
      setShowRewardStartPicker(false);
      if (selectedDate) {
        setRewardStartDate(selectedDate.toISOString().split("T")[0]); // Format to YYYY-MM-DD
      }
      setShowRewardEndPicker(true);
    }
  };

  const handleRewardEndDateChange = (
    event: any,
    selectedDate: Date | undefined
  ) => {
    if (event.type === "dismissed") {
      setRewardStartDate("");
      setRewardEndDate("");
      setShowRewardEndPicker(false);
    } else {
      setShowRewardEndPicker(false);
      if (selectedDate) {
        setRewardEndDate(selectedDate.toISOString().split("T")[0]); // Format to YYYY-MM-DD
      }
    }
  };

  const handlePointStartDateChange = (
    event: any,
    selectedDate: Date | undefined
  ) => {
    if (event.type === "dismissed") {
      setPointsStartDate("");
      setShowPointsStartPicker(false);
    } else {
      setShowPointsStartPicker(false);
      if (selectedDate) {
        setPointsStartDate(selectedDate.toISOString().split("T")[0]); // Format to YYYY-MM-DD
      }
      setShowPointsEndPicker(true);
    }
  };

  const handlePointEndDateChange = (
    event: any,
    selectedDate: Date | undefined
  ) => {
    if (event.type === "dismissed") {
      setPointsStartDate("");
      setPointsEndDate("");
      setShowPointsEndPicker(false);
    } else {
      setShowPointsEndPicker(false);
      if (selectedDate) {
        setPointsEndDate(selectedDate.toISOString().split("T")[0]); // Format to YYYY-MM-DD
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F0F0F0]">
      <>
        <View className="relative w-full flex flex-row items-center justify-center p-4">
          <TouchableHighlight
            underlayColor={"#C9C9C9"}
            className="absolute left-4 rounded-full"
            onPress={() => navigation.goBack()}
          >
            <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
              <Ionicons name="chevron-back" size={18} />
            </View>
          </TouchableHighlight>
          <Text className="text-sm font-semibold">History</Text>
        </View>
        <ScrollView
          className="flex-1 w-full"
          showsVerticalScrollIndicator={false}
        >
          {/* rewardsearch */}
          <View className="w-full flex flex-row items-center justify-between px-4 pt-4">
            <View className="w-full flex flex-row items-center justify-between  pl-6 py-3 pr-3 rounded-full bg-[#FCFCFC]">
              <Text className="text-xs font-normal">
                {`${
                  rewardStartDate || rewardEndDate
                    ? `${rewardStartDate || ""} to ${rewardEndDate || ""}`
                    : "Select Dates to Filter"
                }`}
              </Text>
              <View className="flex flex-row items-center justify-center space-x-2">
                <Pressable
                  className=""
                  onPress={() => setShowRewardStartPicker(true)}
                >
                  <LinearGradient
                    className="flex p-3 rounded-full"
                    colors={["#699900", "#466600"]}
                  >
                    <RemixIcon name="calendar-line" size={12} color="white" />
                  </LinearGradient>
                </Pressable>
                {(rewardStartDate || rewardEndDate) && (
                  <Pressable
                    className=""
                    onPress={() => {
                      setRewardStartDate("");
                      setRewardEndDate("");
                    }}
                  >
                    <LinearGradient
                      className="flex p-3 rounded-full"
                      colors={["#699900", "#466600"]}
                    >
                      <RemixIcon name="ri-close-line" size={12} color="white" />
                    </LinearGradient>
                  </Pressable>
                )}
              </View>
              {showRewardStartPicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    handleRewardStartDateChange(event, selectedDate);
                  }}
                />
              )}
              {showRewardEndPicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    if (event === null) {
                      return;
                    }
                    handleRewardEndDateChange(event, selectedDate);
                  }}
                />
              )}
            </View>
          </View>
          {/* Titlebar */}
          <View className="w-full flex items-center justify-center pt-4">
            <View className="w-full flex flex-row items-start justify-between px-4 pb-4">
              <View className="w-3/4 flex items-start justify-center">
                <Text className="text-sm font-semibold" numberOfLines={1}>
                  Rewards History
                </Text>
                <Text
                  className="text-xs font-normal text-black/50"
                  numberOfLines={1}
                >
                  all records of redeemed rewards
                </Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex w-full"
            >
              {rewardsHistory.length > 0 ? (
                rewardsHistory.map(
                  (rewardHistory: RewardHistory, index: number) => {
                    const reward = rewards.find(
                      (reward: Reward) => reward._id === rewardHistory.rewardId
                    );

                    const firstItem = index === 0;
                    const lastItem = index === pointsHistory.length - 1;

                    const margin = firstItem
                      ? "mx-4"
                      : lastItem
                      ? "mr-4"
                      : "mr-4";

                    return (
                      <View
                        className={`bg-slate-500 rounded-[32px] w-[320px] h-[240px] overflow-hidden ${margin}`}
                        key={rewardHistory._id}
                      >
                        <ImageBackground
                          className="w-full h-full "
                          source={
                            reward
                              ? {
                                  uri: `http://${ipAddress}:${port}/api/images/${reward.image}`,
                                }
                              : require("../../assets/images/borgar.jpg")
                          }
                        >
                          <LinearGradient
                            className="w-full h-full p-5"
                            colors={[
                              "rgba(18, 18, 18, 0)",
                              "rgba(18, 18, 18, 0.6)",
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                          >
                            <View className="flex flex-col h-full justify-between">
                              <View className="w-full flex flex-row items-start justify-between">
                                <Text
                                  className="text-xs font-normal text-white/50 uppercase max-w-[50%]"
                                  numberOfLines={1}
                                >
                                  #{rewardHistory._id}
                                </Text>
                              </View>
                              <View className="w-full flex items-start justify-center">
                                <View className="w-full flex flex-row items-center justify-start pb-4">
                                  <Text
                                    className="text-sm font-semibold text-white capitalize max-w-[60%]"
                                    numberOfLines={1}
                                  >
                                    {reward?.rewardName}
                                  </Text>
                                  <Text className="text-xs font-normal text-white/50 uppercase max-w-[30%] pl-2">
                                    {`${rewardHistory.pointsSpent} ${
                                      rewardHistory.pointsSpent > 1
                                        ? "pts."
                                        : "pt."
                                    }`}
                                  </Text>
                                </View>
                                <View className="w-full overflow-hidden flex flex-row justify-start items-center">
                                  <LinearGradient
                                    className="flex items-center justify-center px-4 py-2 rounded-full mr-1 max-w-[60%]"
                                    colors={["#699900", "#466600"]}
                                  >
                                    <Text
                                      className="text-xs font-normal text-white"
                                      numberOfLines={1}
                                    >
                                      {user?.personalInfo
                                        ? `${user.personalInfo.firstName} ${user.personalInfo.lastName}`
                                        : "Unknown User"}
                                    </Text>
                                  </LinearGradient>
                                  <LinearGradient
                                    className="flex items-center justify-center px-4 py-2 rounded-full max-w-[30%]"
                                    colors={["#699900", "#466600"]}
                                  >
                                    <Text
                                      className="text-xs font-normal text-white"
                                      numberOfLines={1}
                                    >
                                      {(() => {
                                        const date = new Date(
                                          rewardHistory.dateClaimed
                                        );
                                        return isNaN(date.getTime())
                                          ? "Invalid Date"
                                          : date.toLocaleDateString("en-US");
                                      })()}
                                    </Text>
                                  </LinearGradient>
                                </View>
                              </View>
                            </View>
                          </LinearGradient>
                        </ImageBackground>
                      </View>
                    );
                  }
                )
              ) : (
                <View className="flex w-[100vw] h-[240px] items-center justify-center">
                  <LinearGradient
                    className="flex p-4 rounded-full mb-4"
                    colors={["#699900", "#466600"]}
                  >
                    <Feather name="cloud-off" size={20} color={"white"} />
                  </LinearGradient>

                  <Text className="text-xs font-normal text-black/50">
                    No Rewards History Available
                  </Text>
                </View>
              )}
            </ScrollView>
            {rewardTotalPages ? (
              <View className="flex flex-row space-x-2 items-center justify-center py-4">
                <Pressable
                  disabled={rewardCurrentPage === 1}
                  onPress={() => setRewardCurrentPage(rewardCurrentPage - 1)}
                >
                  <RemixIcon name="arrow-left-s-line" size={16} color="black" />
                </Pressable>

                {Array.from(
                  {
                    length: Math.min(5, rewardTotalPages),
                  },
                  (_, index) => {
                    const startPage = Math.max(1, rewardCurrentPage - 2);
                    const page = startPage + index;
                    return page <= rewardTotalPages ? page : null;
                  }
                ).map(
                  (page) =>
                    page && ( // Only render valid pages
                      <Pressable
                        key={page}
                        onPress={() => setRewardCurrentPage(page)}
                        className="p-2"
                      >
                        <Text
                          className={
                            rewardCurrentPage === page
                              ? "text-lg font-semibold text-[#466600]"
                              : "text-xs font-semibold text-black"
                          }
                        >
                          {page}
                        </Text>
                      </Pressable>
                    )
                )}

                <Pressable
                  disabled={rewardCurrentPage === rewardTotalPages}
                  onPress={() => setRewardCurrentPage(rewardCurrentPage + 1)}
                >
                  <RemixIcon
                    name="arrow-right-s-line"
                    size={16}
                    color="black"
                  />
                </Pressable>
              </View>
            ) : null}
          </View>
          <View className="w-full flex flex-row items-center justify-between px-4 pt-4">
            <View className="w-full flex flex-row items-center justify-between  pl-6 py-3 pr-3 rounded-full bg-[#FCFCFC]">
              <Text className="text-xs font-normal">
                {`${
                  pointsStartDate || pointsEndDate
                    ? `${pointsStartDate || ""} to ${pointsEndDate || ""}`
                    : "Filter Date"
                }`}
              </Text>
              <View className="flex flex-row items-center justify-center space-x-2">
                <Pressable
                  className=""
                  onPress={() => setShowPointsStartPicker(true)}
                >
                  <LinearGradient
                    className="flex p-3 rounded-full"
                    colors={["#699900", "#466600"]}
                  >
                    <RemixIcon name="calendar-line" size={12} color="white" />
                  </LinearGradient>
                </Pressable>
                {(pointsStartDate || pointsEndDate) && (
                  <Pressable
                    className=""
                    onPress={() => {
                      setPointsStartDate("");
                      setPointsEndDate("");
                    }}
                  >
                    <LinearGradient
                      className="flex p-3 rounded-full"
                      colors={["#699900", "#466600"]}
                    >
                      <RemixIcon name="ri-close-line" size={12} color="white" />
                    </LinearGradient>
                  </Pressable>
                )}
              </View>
              {showPointsStartPicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={handlePointStartDateChange}
                />
              )}
              {showPointsEndPicker && (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  onChange={handlePointEndDateChange}
                />
              )}
            </View>
          </View>
          <View className="w-full flex items-center justify-center pt-6">
            <View className="w-full flex flex-row items-start justify-between px-4 pb-4">
              <View className="w-3/4 flex items-start justify-center">
                <Text className="text-sm font-semibold" numberOfLines={1}>
                  Points History
                </Text>
                <Text
                  className="text-xs font-normal text-black/50"
                  numberOfLines={1}
                >
                  all records of collected points
                </Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex w-full"
            >
              {pointsHistory.length > 0 ? (
                pointsHistory.map(
                  (pointHistory: PointHistory, index: number) => {
                    const reward = rewards.find(
                      (reward: Reward) => reward._id === "hehe"
                    );

                    const firstItem = index === 0;
                    const lastItem = index === pointsHistory.length - 1;

                    const margin = firstItem
                      ? "mx-4"
                      : lastItem
                      ? "mr-4"
                      : "mr-4";

                    return (
                      <View
                        className={`bg-slate-500 rounded-[32px] w-[320px] h-[240px] overflow-hidden mr-4 ${margin}`}
                        key={pointHistory._id}
                      >
                        <ImageBackground
                          className="w-full h-full "
                          source={
                            reward
                              ? {
                                  uri: `http://192.168.254.139:8080/api/images/${reward.image}`,
                                }
                              : require("../../assets/images/Man.jpg")
                          }
                        >
                          <LinearGradient
                            className="w-full h-full p-5"
                            colors={[
                              "rgba(18, 18, 18, 0)",
                              "rgba(18, 18, 18, 0.6)",
                            ]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                          >
                            <View className="flex flex-col h-full justify-between">
                              <View className="w-full flex flex-row items-start justify-between">
                                <Text
                                  className="text-xs font-normal text-white/50 uppercase max-w-[50%]"
                                  numberOfLines={1}
                                >
                                  #{pointHistory._id}
                                </Text>
                              </View>
                              <View className="w-full flex items-start justify-center">
                                <View className="w-full flex items-start justify-center pb-4">
                                  <Text
                                    className="text-sm font-semibold text-white capitalize"
                                    numberOfLines={1}
                                  >
                                    {user?.personalInfo
                                      ? `${user.personalInfo.firstName} ${user.personalInfo.lastName}`
                                      : "Non-Mobile User"}
                                  </Text>
                                  <Text className="text-white text-xs font-normal">
                                    {`${pointHistory.pointsAccumulated} ${
                                      pointHistory.pointsAccumulated > 1
                                        ? "pts."
                                        : "pt."
                                    }`}
                                  </Text>
                                </View>
                                <View className="w-full overflow-hidden flex flex-row justify-start items-center">
                                  <LinearGradient
                                    className="flex items-center justify-center px-4 py-2 rounded-full mr-1 max-w-[60%]"
                                    colors={["#699900", "#466600"]}
                                  >
                                    <Text
                                      className="text-xs font-normal text-white"
                                      numberOfLines={1}
                                    >
                                      {`${pointHistory.bottleCount} ${
                                        pointHistory.bottleCount > 1
                                          ? "bottles"
                                          : "bottle"
                                      }`}
                                    </Text>
                                  </LinearGradient>
                                  <LinearGradient
                                    className="flex items-center justify-center px-4 py-2 rounded-full max-w-[40%]"
                                    colors={["#699900", "#466600"]}
                                  >
                                    <Text
                                      className="text-xs font-normal text-white"
                                      numberOfLines={1}
                                    >
                                      {(() => {
                                        const date = new Date(
                                          pointHistory.dateDisposed
                                        );
                                        return isNaN(date.getTime())
                                          ? "Invalid Date"
                                          : date.toLocaleDateString("en-US");
                                      })()}
                                    </Text>
                                  </LinearGradient>
                                </View>
                              </View>
                            </View>
                          </LinearGradient>
                        </ImageBackground>
                      </View>
                    );
                  }
                )
              ) : (
                <View className="flex w-[100vw] h-[240px] items-center justify-center">
                  <LinearGradient
                    className="flex p-4 rounded-full mb-4"
                    colors={["#699900", "#466600"]}
                  >
                    <Feather name="cloud-off" size={20} color={"white"} />
                  </LinearGradient>
                  <Text className="text-xs font-normal text-black/50">
                    No Points History Available
                  </Text>
                </View>
              )}
            </ScrollView>
            {pointsTotalPages ? (
              <View className="flex flex-row space-x-2 items-center justify-center py-4">
                <Pressable
                  disabled={pointCurrentPage === 1}
                  onPress={() => setPointCurrentPage(pointCurrentPage - 1)}
                >
                  <RemixIcon name="arrow-left-s-line" size={16} color="black" />
                </Pressable>

                {Array.from(
                  {
                    length: Math.min(5, pointsTotalPages),
                  },
                  (_, index) => {
                    const startPage = Math.max(1, pointCurrentPage - 2);
                    const page = startPage + index;
                    return page <= pointsTotalPages ? page : null;
                  }
                ).map(
                  (page) =>
                    page && ( // Only render valid pages
                      <Pressable
                        key={page}
                        onPress={() => setPointCurrentPage(page)}
                        className="p-2"
                      >
                        <Text
                          className={
                            pointCurrentPage === page
                              ? "text-lg font-semibold text-[#466600]"
                              : "text-xs font-semibold text-black"
                          }
                        >
                          {page}
                        </Text>
                      </Pressable>
                    )
                )}

                <Pressable
                  disabled={pointCurrentPage === pointsTotalPages}
                  onPress={() => setPointCurrentPage(pointCurrentPage + 1)}
                >
                  <RemixIcon
                    name="arrow-right-s-line"
                    size={16}
                    color="black"
                  />
                </Pressable>
              </View>
            ) : null}
          </View>
          <View className="pb-32"></View>
        </ScrollView>
      </>
      {loading && <Loader />}

      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

export default History;
