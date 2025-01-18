import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Feather, MaterialIcons, Octicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Loader from "@/components/loader";
import { useQueue } from "@/context/QueueProvider";
import { Image } from "expo-image";
import ConfigForm from "@/components/dashboard/configForm";
import { useLocation } from "@/context/LocationProvider";
import { useUrl } from "@/context/UrlProvider";
import axios from "axios";
import RemixIcon from "react-native-remix-icon";
import { useAuth } from "@/context/AuthContext";
import Modal from "@/components/modal";

const Dashboard = () => {
  const { queueWebSocket } = useQueue();
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("");
  const { botLocationWebSocket } = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [configForm, setConfigForm] = useState(false);
  const { yourLocation, defaultLocation, getUserLocation } = useLocation();
  const [config, setConfig] = useState<config | undefined>();
  const { ipAddress, port } = useUrl();
  const [mapRegion, setMapRegion] = useState({
    latitude: 14.680105493791455,
    longitude: 121.00993905398246,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const mapViewRef = useRef<MapView | null>(null);

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
      await checkConfig();
      setLoading(false);
    };

    queueWebSocket();
    botLocationWebSocket();
    getLocation();
  }, []);

  const checkConfig = async () => {
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

  const haversineDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
    const toRadians = (degree: any) => (degree * Math.PI) / 180;

    const earthRadiusKm = 6371; // Radius of the Earth in kilometers

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadiusKm * c;
  };

  const addtoQueue = async ({
    userId,
    lon,
    lat,
    locationName,
    status,
  }: {
    userId: string;
    lon: number;
    lat: number;
    locationName: string;
    status: string;
  }) => {
    const distance = haversineDistance(
      yourLocation.latitude,
      yourLocation.longitude,
      config?.defaultLocation.lat,
      config?.defaultLocation.lon
    );

    if (distance <= 1) {
      try {
        let url = `http://${ipAddress}:${port}/api/queue`;

        let response = await axios.post(url, {
          userId: userId,
          location: {
            lon: lon,
            lat: lat,
            locationName: locationName,
          },
          status: status,
        });

        if (response.data.success === true) {
          setModal(true);
          setMessage(response.data.message);
        }
      } catch (error: any) {
        console.log(error.response.data);
      }
    } else {
      setModal(true);
      setMessage("Location out of Operating Range");
    }
  };

  return (
    <>
      <View className="flex-1 w-full flex items-center justify-center">
        <View className="flex-1 w-full">
          <View className="w-full flex-1 relative">
            {/* Map Background */}
            <MapView style={{ width: "100%", height: "60%" }} ref={mapViewRef}>
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

            <View className="w-full h-full absolute top-0 left-0">
              <LinearGradient
                colors={["rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 1)"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 0, y: 1 }}
                className="flex-1"
              />

              <View className="absolute top-[6%] left-[4%] flex flex-col space-y-2">
                <Pressable
                  className="p-2 rounded-full bg-white shadow-xl shadow-black"
                  onPress={handleZoomToLocations}
                >
                  <RemixIcon name="compass-3-line" size={16} color="black" />
                </Pressable>
              </View>
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
                    value={`${yourLocation.latitude.toFixed(
                      4
                    )}, ${yourLocation.longitude.toFixed(4)}`}
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
                    value={`${yourLocation.latitude.toFixed(
                      4
                    )}, ${yourLocation.longitude.toFixed(4)}`}
                  />
                </View>
                <View className="w-full flex items-center justify-center py-4">
                  <TouchableHighlight
                    className="w-full flex items-center justify-center rounded-xl"
                    underlayColor={"#41917F"}
                    onPress={() => {
                      addtoQueue({
                        userId: user ? user._id : "",
                        lon: yourLocation.longitude,
                        lat: yourLocation.latitude,
                        locationName: "shitty place",
                        status: "pending",
                      });
                    }}
                  >
                    <LinearGradient
                      colors={["#699900", "#466600"]}
                      className="w-full  rounded-xl shadow shadow-[#050301]"
                    >
                      <Text className="flex py-3.5 bg-transparent text-center text-sm text-white font-semibold">
                        Start Navigation
                      </Text>
                    </LinearGradient>
                  </TouchableHighlight>
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
            checkConfig();
          }}
          config={config}
        />
      )}
      {modal && (
        <Modal
          message={message}
          isVisible={modal}
          onClose={() => setModal(false)}
          header="Queue"
          icon="profile"
        />
      )}
    </>
  );
};

export default Dashboard;
