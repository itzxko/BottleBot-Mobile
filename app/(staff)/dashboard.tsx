import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import Loader from "@/components/loader";
import { useQueue } from "@/context/QueueProvider";
import { Image } from "expo-image";
import ConfigForm from "@/components/dashboard/configForm";
import { useLocation } from "@/context/LocationProvider";
import RemixIcon from "react-native-remix-icon";

const Dashboard = () => {
  const { queue, queueWebSocket } = useQueue();
  const [loading, setLoading] = useState(false);
  const [configForm, setConfigForm] = useState(false);
  const {
    yourLocation,
    getUserLocation,
    botLocation,
    botLocationWebSocket,
    config,
    getConfig,
  } = useLocation();
  const mapViewRef = useRef<MapView | null>(null);

  interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  interface config {
    defaultLocation: {
      lat: number;
      lon: number;
      locationName: string;
    };
    bottleExchange: {
      baseWeight: number;
      baseUnit: string;
      equivalentInPoints: number;
    };
    _id: string;
  }

  useEffect(() => {
    const getLocation = async () => {
      setLoading(true);
      await getUserLocation();
      setLoading(false);
    };

    queueWebSocket();
    botLocationWebSocket();
    getLocation();
    getConfig();
  }, []);

  useEffect(() => {
    if (yourLocation && config?.defaultLocation) {
      handleZoomToLocations();
    }
  }, [yourLocation, config]);

  const handleZoomToLocations = () => {
    if (mapViewRef.current && yourLocation && config?.defaultLocation) {
      const locations = [
        { latitude: yourLocation.latitude, longitude: yourLocation.longitude },
        {
          latitude: config.defaultLocation.lat,
          longitude: config.defaultLocation.lon,
        },
      ];

      mapViewRef.current.fitToCoordinates(locations, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  };

  return (
    <>
      <View className="flex-1 w-full flex items-center justify-center">
        <View className="flex-1 w-full">
          <View className="w-full flex-1 relative">
            {/* Map Background */}
            <MapView style={{ width: "100%", height: "60%" }} ref={mapViewRef}>
              {queue &&
                queue.map((queue: any) => (
                  <Marker
                    key={queue._id}
                    coordinate={{
                      latitude: parseFloat(queue.location.lat),
                      longitude: parseFloat(queue.location.lon),
                    }}
                    title={`${queue.userId.personalInfo.firstName} ${queue.userId.personalInfo.lastName}`}
                    description={queue.location.locationName}
                  >
                    <Image
                      source={require("../../assets/images/Queue-Pin.png")}
                      className="w-[56px] h-[56px]"
                    />
                  </Marker>
                ))}
              {botLocation ? (
                <Marker
                  coordinate={{
                    latitude: botLocation.lat,
                    longitude: botLocation.lon,
                  }}
                  title="Bot Location"
                >
                  <Image
                    source={require("../../assets/images/Bot-Pin.png")}
                    className="w-[56px] h-[56px]"
                  />
                </Marker>
              ) : null}
              <Marker coordinate={yourLocation} title="Your Location">
                <Image
                  source={require("../../assets/images/Admin-Pin.png")}
                  className="w-[56px] h-[56px]"
                />
              </Marker>
              {config && (
                <Marker
                  coordinate={{
                    latitude: config.defaultLocation.lat,
                    longitude: config.defaultLocation.lon,
                  }}
                  title="Default Location"
                >
                  <Image
                    source={require("../../assets/images/Default-Pin.png")}
                    className="w-[56px] h-[56px]"
                  />
                </Marker>
              )}
            </MapView>

            <View className="w-full h-[80vh] absolute top-0 left-0">
              <LinearGradient
                colors={["rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 1)"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 0, y: 1 }}
                className="flex-1"
              />
            </View>

            <View className="absolute top-[6%] left-[4%] flex flex-col space-y-2">
              <Pressable
                className="p-2 rounded-full bg-white shadow-xl shadow-black"
                onPress={handleZoomToLocations}
              >
                <RemixIcon name="compass-3-line" size={16} color="black" />
              </Pressable>
            </View>

            <View className="absolute flex items-center rounded-t-3xl justify-center w-full left-0 bottom-0 bg-[#FAFAFA] ">
              <View className="w-full flex items-center justify-center px-4 py-8">
                {/* Header */}
                <View className="w-full flex items-center justify-center pb-6">
                  <Text className="font-bold text-sm">Dashboard</Text>
                  <Text className="font-normal text-xs text-black/50">
                    Allow location access to provide accurate data
                  </Text>
                </View>
                {/* BottleBot */}
                <View className="w-full flex flex-row items-center justify-between pl-2 pr-6 py-2 bg-[#E6E6E6] rounded-2xl mb-2">
                  <View className="max-w-[50%] flex flex-row items-center justify-start px-4 py-2.5 rounded-xl bg-[#050301]">
                    <Pressable>
                      <RemixIcon
                        name="direction-line"
                        size={16}
                        color="white"
                      />
                    </Pressable>
                    <Text
                      className="text-xs font-normal text-white pl-2"
                      numberOfLines={1}
                    >
                      BottleBot Location
                    </Text>
                  </View>
                  <TextInput
                    className="text-xs font-normal max-w-[50%] text-right"
                    placeholder="single"
                    numberOfLines={1}
                    readOnly={true}
                    value={
                      botLocation
                        ? `${botLocation.lat.toString()}, ${botLocation.lon.toString()}`
                        : "No Location"
                    }
                  ></TextInput>
                </View>
                {/* User */}
                <View className="w-full flex flex-row items-center justify-between pl-2 pr-6 py-2 bg-[#E6E6E6] rounded-2xl mb-2">
                  <View className="max-w-[50%] flex flex-row items-center justify-start px-4 py-2.5 rounded-xl bg-[#050301]">
                    <Pressable>
                      <RemixIcon
                        name="direction-line"
                        size={16}
                        color="white"
                      />
                    </Pressable>
                    <Text
                      className="text-xs font-normal text-white pl-2"
                      numberOfLines={1}
                    >
                      Your Location
                    </Text>
                  </View>
                  <TextInput
                    className="text-xs font-normal max-w-[50%] text-right"
                    placeholder="single"
                    numberOfLines={1}
                    readOnly={true}
                    value={`${yourLocation.latitude.toString()}, ${yourLocation.longitude.toString()}`}
                  ></TextInput>
                </View>
                {/* Default */}
                <View className="w-full flex flex-row items-center justify-between pl-2 pr-6 py-2 bg-[#E6E6E6] rounded-2xl mb-2">
                  <View className="max-w-[50%] flex flex-row items-center justify-start px-4 py-2.5 rounded-xl bg-[#050301]">
                    <Pressable>
                      <RemixIcon
                        name="direction-line"
                        size={16}
                        color="white"
                      />
                    </Pressable>
                    <Text
                      className="text-xs font-normal text-white pl-2"
                      numberOfLines={1}
                    >
                      Default Location
                    </Text>
                  </View>

                  <TextInput
                    className="text-xs font-normal max-w-[50%] text-right"
                    placeholder="single"
                    numberOfLines={1}
                    readOnly={true}
                    value={`${config?.defaultLocation.lat}, ${config?.defaultLocation.lon}`}
                  ></TextInput>
                </View>
              </View>
              <View className="pb-16"></View>
            </View>
          </View>
        </View>
      </View>
      {loading && <Loader />}
      {configForm && (
        <ConfigForm
          onClose={() => {
            setConfigForm(false);
            getConfig();
          }}
          config={config}
        />
      )}
    </>
  );
};

export default Dashboard;
