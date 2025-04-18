import {
  View,
  Text,
  Pressable,
  ScrollView,
  TouchableHighlight,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import RemixIcon from "react-native-remix-icon";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useReports } from "@/context/ReportsProvider";
import Loader from "@/components/loader";
import { useUsers } from "@/context/UsersProvider";
import { useRewards } from "@/context/RewardsProvider";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";

const reports = () => {
  const [reportStartDate, setReportStartDate] = useState("");
  const [reportEndDate, setReportEndDate] = useState("");
  const [showReportStartPicker, setShowReportStartPicker] = useState(false);
  const [showReportEndPicker, setShowReportEndPicker] = useState(false);
  const {
    getTotalCollected,
    totalCollected,
    getTotalPoints,
    totalPoints,
    getTotalClaims,
    totalClaims,
    demographics,
    getDemographics,
    accountsSummary,
    getAccountsSummary,
    topContributors,
    getTopContributors,
    topRewards,
    getTopRewards,
  } = useReports();
  const { allUsers, getAllUsers } = useUsers();
  const { allRewards, getAllRewards } = useRewards();
  const [loading, setLoading] = useState(false);

  const handleReportStartDateChange = (
    event: any,
    selectedDate: Date | undefined
  ) => {
    if (event.type === "dismissed") {
      setReportStartDate("");
      setShowReportStartPicker(false);
    } else {
      setShowReportStartPicker(false);
      if (selectedDate) {
        setReportStartDate(selectedDate.toISOString().split("T")[0]); // Format to YYYY-MM-DD
      }
      setShowReportEndPicker(true);
    }
  };

  const handleReportEndDateChange = (
    event: any,
    selectedDate: Date | undefined
  ) => {
    if (event.type === "dismissed") {
      setReportStartDate("");
      setReportEndDate("");
      setShowReportEndPicker(false);
    } else {
      setShowReportEndPicker(false);
      if (selectedDate) {
        setReportEndDate(selectedDate.toISOString().split("T")[0]); // Format to YYYY-MM-DD
      }
    }
  };

  const contributorsHtml = topContributors
    .map((contributor: any) => {
      const user = allUsers.find((user: any) => user._id === contributor._id);
      return `
      <div style="width: 100%; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 16px;">
        <p style="font-size: 12px; font-weight: 400;">
          ${user?.personalInfo?.firstName || ""} ${
        user?.personalInfo?.middleName || ""
      } ${user?.personalInfo?.lastName || ""}
        </p>
        <p style="font-size: 12px; font-weight: 400; color: rgba(0,0,0,0.5);">
          ${contributor.totalBottles} Bottles
        </p>
      </div>
    `;
    })
    .join("");

  const rewardsHtml = topRewards
    .map((redeemable: any) => {
      const reward = allRewards.find(
        (reward: any) => reward._id === redeemable._id
      );

      return `
            <div
              style="width: 100%; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 16px;"
              key={redeemable._id}
            >
              <p style="font-size: 12px; font-weight: 400;">${reward.rewardName}</p>
              <p style="font-size: 12px; font-weight: 400; color: rgba(0,0,0,0.5);">
                ${redeemable.count} pcs
              </p>
            </div>
          `;
    })
    .join("");

  const html = `
      <html>
        <body>
          <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px; gap: 80px;">
            <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">
              <p style="font-size: 16px; font-weight: 600; text-transform: uppercase;">
                BottleBot Report
              </p>
              <p style="font-size: 12px; font-weight: 400; color: rgba(0,0,0,0.5);">
                Date: ${reportStartDate} - ${reportEndDate}
              </p>
            </div>

            <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 48px;">
              <div style="width: 100%; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 16px;">
                <p style="font-size: 12px; font-weight: 600;">
                  Total Bottles Collected:
                </p>
                <p style="font-size: 12px; font-weight: 400; color: rgba(0,0,0,0.5);">
                  ${totalCollected}
                </p>
              </div>

              <div style="width: 100%; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 16px;">
                <p style="font-size: 12px; font-weight: 600;">
                  Total Points Earned:
                </p>
                <p style="font-size: 12px; font-weight: 400; color: rgba(0,0,0,0.5);">
                  ${totalPoints}
                </p>
              </div>

              <div style="width: 100%; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 16px;">
                <p style="font-size: 12px; font-weight: 600;">Reward Claims:</p>
                <p style="font-size: 12px; font-weight: 400; color: rgba(0,0,0,0.5);">
                  ${totalClaims}
                </p>
              </div>

              <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;">
                <p style="font-size: 12px; font-weight: 600;">Demographics:</p>
                <div style="width: 100%; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 96px;">
                  <p style="font-size: 12px; font-weight: 400; color: rgba(0,0,0,0.5);">
                    Male: ${demographics.male}
                  </p>
                  <p style="font-size: 12px; font-weight: 400; color: rgba(0,0,0,0.5);">
                    Female: ${demographics.female}
                  </p>
                  <p style="font-size: 12px; font-weight: 400; color: rgba(0,0,0,0.5);">
                    Others: ${demographics.other}
                  </p>
                </div>
              </div>

              <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;">
                <p style="font-size: 12px; font-weight: 600;">
                  Accounts Summary:
                </p>
                <div style="width: 100%; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 96px;">
                  <p style="font-size: 12px; font-weight: 400; color: rgba(0,0,0,0.5);">
                    Admin: ${accountsSummary.admin}
                  </p>
                  <p style="font-size: 12px; font-weight: 400; color: rgba(0,0,0,0.5);">
                    Staff: ${accountsSummary.staff}
                  </p>
                  <p style="font-size: 12px; font-weight: 400; color: rgba(0,0,0,0.5);">
                    Citizen: ${accountsSummary.citizen}
                  </p>
                </div>
              </div>

              <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;">
                <p style="font-size: 12px; font-weight: 600;">
                  Top Contributors:
                </p>
                <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
                  ${contributorsHtml}
                </div>
              </div>

              <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;">
                <p style="font-size: 12px; font-weight: 600;">Top Rewards:</p>
                <div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;">
                  ${rewardsHtml}
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
  `;

  const generatePdf = async () => {
    const file = await printToFileAsync({
      html: html,
      base64: false,
    });

    await shareAsync(file.uri);
  };

  useEffect(() => {
    const getReports = async () => {
      setLoading(true);
      try {
        await getAllRewards();
        await getAllUsers();
        await getTotalCollected(reportStartDate, reportEndDate);
        await getTotalPoints(reportStartDate, reportEndDate);
        await getTotalClaims(reportStartDate, reportEndDate);
        await getDemographics();
        await getAccountsSummary();
        await getTopContributors(reportStartDate, reportEndDate);
        await getTopRewards(reportStartDate, reportEndDate);
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getReports();
  }, [reportStartDate, reportEndDate]);

  return (
    <>
      <SafeAreaView className="flex-1 px-4 bg-[#F0F0F0]">
        <View className="relative w-full flex flex-row items-center justify-center py-4">
          <TouchableHighlight
            underlayColor={"#C9C9C9"}
            className="absolute left-0 rounded-full"
          >
            <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
              <RemixIcon name="arrow-left-s-line" size={16} color="black" />
            </View>
          </TouchableHighlight>

          <Text className="text-sm font-semibold">Reports</Text>
        </View>
        {/* Filter */}
        <View className="w-full flex flex-row items-center justify-between py-4">
          <View className="w-full flex flex-row items-center justify-between  pl-6 py-2 pr-2 rounded-full bg-[#E6E6E6]">
            <Text className="text-xs font-normal text-black/50">
              {`${
                reportStartDate || reportEndDate
                  ? `${reportStartDate || ""} to ${reportEndDate || ""}`
                  : "Filter Date"
              }`}
            </Text>
            <View className="flex flex-row items-center justify-center space-x-2">
              <Pressable
                className=""
                onPress={() => setShowReportStartPicker(true)}
              >
                <LinearGradient
                  className="flex p-3 rounded-full"
                  colors={["#474747", "#050301"]}
                >
                  <RemixIcon name="calendar-line" size={12} color="white" />
                </LinearGradient>
              </Pressable>
              {(reportStartDate || reportEndDate) && (
                <Pressable
                  className=""
                  onPress={() => {
                    setReportStartDate("");
                    setReportEndDate("");
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
            {showReportStartPicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  handleReportStartDateChange(event, selectedDate);
                }}
              />
            )}
            {showReportEndPicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  if (event === null) {
                    return;
                  }
                  handleReportEndDateChange(event, selectedDate);
                }}
              />
            )}
          </View>
        </View>
        <ScrollView
          className="flex-1 w-full py-2 space-y-4"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full flex flex-row items-center justify-between">
            <View className="w-2/3 flex flex-col items-start justify-center">
              <Text className="text-sm font-semibold">Reports Overview</Text>
              <Text
                className="text-xs font-normal text-black/50"
                numberOfLines={1}
              >
                Overview of data collected and stored
              </Text>
            </View>
            {/* button */}
            <Pressable onPress={generatePdf}>
              <LinearGradient
                className="flex p-2 rounded-full"
                colors={["#699900", "#466600"]}
              >
                <RemixIcon
                  name="ri-download-cloud-2-line"
                  size={16}
                  color="white"
                />
              </LinearGradient>
            </Pressable>
          </View>
          <View className="w-full flex flex-col items-center justify-center">
            <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-4 mt-2">
              <View className="w-1/2 flex flex-row items-center justify-start">
                <Text
                  className="text-xs font-semibold text-black"
                  numberOfLines={1}
                >
                  Total Bottles Collected
                </Text>
              </View>
              <View className="w-1/2 flex items-end justify-center">
                <Text>{totalCollected}</Text>
              </View>
            </View>
            <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-4 mt-2">
              <View className="w-1/2 flex flex-row items-center justify-start">
                <Text
                  className="text-xs font-semibold text-black"
                  numberOfLines={1}
                >
                  Total Points Earned
                </Text>
              </View>
              <View className="w-1/2 flex items-end justify-center">
                <Text>{totalPoints}</Text>
              </View>
            </View>
            <View className="w-full flex flex-row items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-4 mt-2">
              <View className="w-1/2 flex flex-row items-center justify-start">
                <Text
                  className="text-xs font-semibold text-black"
                  numberOfLines={1}
                >
                  Reward Claims
                </Text>
              </View>
              <View className="w-1/2 flex items-end justify-center">
                <Text>{totalClaims}</Text>
              </View>
            </View>
            <View className="w-full flex flex-col items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-4 mt-2 space-y-6">
              <View className="w-full flex flex-row items-center justify-start">
                <Text
                  className="text-xs font-semibold text-black"
                  numberOfLines={1}
                >
                  Demographics
                </Text>
              </View>
              <View className="w-full flex flex-row items-center justify-between">
                <View className="flex flex-row space-x-1 items-center justify-center">
                  <View className="h-[8px] w-[8px] rounded-full bg-[#699900]"></View>
                  <Text className="text-xs font-normal">{`Male: ${demographics.male}`}</Text>
                </View>
                <View className="flex flex-row space-x-1 items-center justify-center">
                  <View className="h-[8px] w-[8px] rounded-full bg-[#699900]"></View>
                  <Text className="text-xs font-normal">{`Female: ${demographics.female}`}</Text>
                </View>
                <View className="flex flex-row space-x-1 items-center justify-center">
                  <View className="h-[8px] w-[8px] rounded-full bg-[#699900]"></View>
                  <Text className="text-xs font-normal">{`Other: ${demographics.other}`}</Text>
                </View>
              </View>
            </View>
            <View className="w-full flex flex-col items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-4 mt-2 space-y-6">
              <View className="w-full flex flex-row items-center justify-start">
                <Text
                  className="text-xs font-semibold text-black"
                  numberOfLines={1}
                >
                  Accounts Summary
                </Text>
              </View>
              <View className="w-full flex flex-row items-center justify-between">
                <View className="flex flex-row space-x-1 items-center justify-center">
                  <View className="h-[8px] w-[8px] rounded-full bg-[#699900]"></View>
                  <Text className="text-xs font-normal">{`Admin: ${accountsSummary.admin}`}</Text>
                </View>
                <View className="flex flex-row space-x-1 items-center justify-center">
                  <View className="h-[8px] w-[8px] rounded-full bg-[#699900]"></View>
                  <Text className="text-xs font-normal">{`Staff: ${accountsSummary.staff}`}</Text>
                </View>
                <View className="flex flex-row space-x-1 items-center justify-center">
                  <View className="h-[8px] w-[8px] rounded-full bg-[#699900]"></View>
                  <Text className="text-xs font-normal">{`Citizen: ${accountsSummary.citizen}`}</Text>
                </View>
              </View>
            </View>
            <View className="w-full flex flex-col items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-4 mt-2 space-y-6">
              <View className="w-full flex flex-row items-center justify-start">
                <Text
                  className="text-xs font-semibold text-black"
                  numberOfLines={1}
                >
                  Top Contributors
                </Text>
              </View>
              <View className="w-full flex flex-col items-center justify-center space-y-2">
                {topContributors.length > 0 ? (
                  topContributors.map((contributor: any) => {
                    const user = allUsers.find(
                      (user: any) => user._id === contributor._id
                    );

                    return (
                      <View
                        className="w-full flex flex-row items-center justify-between"
                        key={contributor._id}
                      >
                        <View className="flex flex-row space-x-1 items-center justify-center">
                          <View className="h-[8px] w-[8px] rounded-full bg-[#699900]"></View>
                          <Text className="text-xs font-normal">
                            {user
                              ? `${user.personalInfo.firstName} ${user.personalInfo.middleName} ${user.personalInfo.lastName}`
                              : "User Not Found"}
                          </Text>
                        </View>
                        <Text className="text-xs font-normal">{`${contributor.totalBottles} Bottles`}</Text>
                      </View>
                    );
                  })
                ) : (
                  <View className="flex flex-row space-x-1 items-center justify-center">
                    <View className="h-[8px] w-[8px] rounded-full bg-[#699900]"></View>
                    <Text className="text-xs font-normal">No Data</Text>
                  </View>
                )}
              </View>
            </View>
            <View className="w-full flex flex-col items-center justify-between bg-[#E6E6E6] rounded-xl px-6 py-4 mt-2 space-y-6">
              <View className="w-full flex flex-row items-center justify-start">
                <Text
                  className="text-xs font-semibold text-black"
                  numberOfLines={1}
                >
                  Top Rewards
                </Text>
              </View>
              <View className="w-full flex flex-col items-center justify-center space-y-2">
                {topRewards.length > 0 ? (
                  topRewards.map((redeemable: any) => {
                    const reward = allRewards.find(
                      (reward: any) => reward._id === redeemable._id
                    );

                    return (
                      <View
                        className="w-full flex flex-row items-center justify-between"
                        key={redeemable._id}
                      >
                        <View className="flex flex-row space-x-1 items-center justify-center">
                          <View className="h-[8px] w-[8px] rounded-full bg-[#699900]"></View>
                          <Text className="text-xs font-normal">
                            {reward
                              ? `${reward.rewardName}`
                              : "Reward not Found"}
                          </Text>
                        </View>
                        <Text className="text-xs font-normal">{`${redeemable.count} pcs`}</Text>
                      </View>
                    );
                  })
                ) : (
                  <View className="flex flex-row space-x-1 items-center justify-center">
                    <View className="h-[8px] w-[8px] rounded-full bg-[#699900]"></View>
                    <Text className="text-xs font-normal">No Data</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          <View className="w-full pb-32"></View>
        </ScrollView>
      </SafeAreaView>
      <ExpoStatusBar style="auto" />
      {loading && <Loader />}
    </>
  );
};

export default reports;
