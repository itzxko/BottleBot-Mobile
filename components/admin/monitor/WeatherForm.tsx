import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import RemixIcon from "react-native-remix-icon";
import { LinearGradient } from "expo-linear-gradient";

const WeatherForm = ({
  onClose,
  data,
  date,
}: {
  onClose: () => void;
  data: any;
  date: string;
}) => {
  const [loading, setLoading] = useState(true);

  const convertToTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleTimeString([], options);
  };

  return (
    <View className="flex-1 absolute top-0 left-0 bottom-0 right-0 bg-[#050301]/50 flex items-center justify-center">
      <View className="w-3/4 flex flex-col items-center justify-center p-6 rounded-xl bg-[#FAFAFA] space-y-10">
        <View className="w-full flex flex-row items-start justify-between ">
          <View className="flex flex-col items-start justify-center">
            <View className="w-full flex flex-row items-center justify-start space-x-2">
              <LinearGradient
                className="flex p-3 rounded-full bg-black"
                colors={["#699900", "#466600"]}
              >
                <RemixIcon name="cloud-windy-line" size={18} color="white" />
              </LinearGradient>
              <View className="flex flex-col items-start justify-center">
                <Text className="text-xs font-semibold">Weather Forecast</Text>
                <Text className="text-xs font-normal text-[#6E6E6E]">
                  Today, {date}
                </Text>
              </View>
            </View>
          </View>
          <Pressable onPress={onClose}>
            <RemixIcon name="close-line" size={16} color="black" />
          </Pressable>
        </View>
        <View className="w-full flex flex-col items-center justify-center space-y-2">
          {data.length > 0 ? (
            data.map((hour: any, index: any) => (
              <View
                className="w-full flex flex-row items-center justify-between"
                key={index}
              >
                <Text className="text-xs font-normal">
                  {convertToTime(hour.datetime)}
                </Text>
                <Text className="text-xs font-normal">
                  {hour.precipprob
                    ? `${hour.precipprob}% Probability`
                    : "No Data"}
                </Text>
              </View>
            ))
          ) : (
            <>
              <View className="w-full flex flex-col items-center justify-center">
                <View className="p-3 mb-2 rounded-full bg-[#699900]">
                  <RemixIcon name="blur-off-fill" size={16} color="white" />
                </View>
                <Text className="text-xs font-normal text-[#6E6E6E]">
                  No Rainy Forecasts Today
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default WeatherForm;
