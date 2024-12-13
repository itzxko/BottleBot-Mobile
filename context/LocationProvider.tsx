import { View, Text } from "react-native";
import React, { createContext, useContext, useState } from "react";
import * as Location from "expo-location";
import { useUrl } from "./UrlProvider";
import axios from "axios";

const LocationContext = createContext<any>(null);

export const LocationProvider = ({ children }: any) => {
  const [config, setConfig] = useState();
  const [botLocation, setBotLocation] = useState(null);
  const { ipAddress, port } = useUrl();
  const [yourLocation, setYourLocation] = useState({
    latitude: 14.680105493791455,
    longitude: 121.00993905398246,
    latitudeDelta: 0.0005,
    longitudeDelta: 0.0005,
  });

  const botLocationWebSocket = () => {
    const socket = new WebSocket(`ws://${ipAddress}:${port}/api/monitor`);

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);

      if (response.success && response.realTimeType === "botstate") {
        console.log(response.data);
        setBotLocation(response.data);
      }
    };
  };

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setYourLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0005,
        longitudeDelta: 0.0005,
      });
    } catch (error) {
      console.error("Error getting location:", error);
      alert("Unable to retrieve location. Please try again.");
    }
  };

  const getConfig = async () => {
    try {
      let url = `http://${ipAddress}:${port}/api/configurations`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setConfig(response.data.config);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        yourLocation,
        config,
        getConfig,
        getUserLocation,
        botLocationWebSocket,
        botLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
