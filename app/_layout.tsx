import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { UrlProvider } from "@/context/UrlProvider";
import { QueueProvider } from "@/context/QueueProvider";
import { LocationProvider } from "@/context/LocationProvider";
import { PaginationProvider } from "@/context/PaginationProvider";
import * as Notifications from "expo-notifications";
import { NotificationsProvider } from "@/context/NotificationsProvider";
import Constants from "expo-constants";
import { ReportsProvider } from "@/context/ReportsProvider";

const _layout = () => {
  return (
    <UrlProvider>
      <NotificationsProvider>
        <AuthProvider>
          <QueueProvider>
            <LocationProvider>
              <PaginationProvider>
                <ReportsProvider>
                  <Stack>
                    <Stack.Screen
                      name="index"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="login"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(user)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(staff)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(admin)"
                      options={{ headerShown: false }}
                    />
                  </Stack>
                </ReportsProvider>
              </PaginationProvider>
            </LocationProvider>
          </QueueProvider>
        </AuthProvider>
      </NotificationsProvider>
    </UrlProvider>
  );
};

export default _layout;
