import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { TabBar } from "@/components/user/tabBar";
import { RewardsProvider } from "@/context/RewardsProvider";
import { UserHistoryProvider } from "@/context/UserHistoryProvider";

const _layout = () => {
  return (
    <UserHistoryProvider>
      <RewardsProvider>
        <Tabs tabBar={(props) => <TabBar {...props} />}>
          <Tabs.Screen
            name="dashboard"
            options={{
              headerShown: false,
              title: "Home",
            }}
          />
          <Tabs.Screen
            name="history"
            options={{
              headerShown: false,
              title: "History",
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              headerShown: false,
              title: "Profile",
            }}
          />
        </Tabs>
      </RewardsProvider>
    </UserHistoryProvider>
  );
};

export default _layout;
