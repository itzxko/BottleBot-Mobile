import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { TabBar } from "@/components/admin/Tab/tabBar";
import { UsersProvider } from "@/context/UsersProvider";
import { AdminHistoryProvider } from "@/context/AdminHistoryProvider";
import { RewardsProvider } from "@/context/RewardsProvider";

const _layout = () => {
  return (
    <UsersProvider>
      <RewardsProvider>
        <AdminHistoryProvider>
          <Tabs tabBar={(props) => <TabBar {...props} />}>
            <Tabs.Screen
              name="dashboard"
              options={{
                headerShown: false,
                title: "Home",
              }}
            />
            <Tabs.Screen
              name="monitor"
              options={{
                headerShown: false,
                title: "Monitor",
              }}
            />
            <Tabs.Screen
              name="redeem"
              options={{
                headerShown: false,
                title: "Redeem",
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
              name="users"
              options={{
                headerShown: false,
                title: "Users",
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
        </AdminHistoryProvider>
      </RewardsProvider>
    </UsersProvider>
  );
};

export default _layout;
