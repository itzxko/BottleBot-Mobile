// Import additional hooks and modules if needed
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Loader from "../loader";
import Modal from "../modal";
import { useUrl } from "@/context/UrlProvider";
import axios from "axios";
import RemixIcon from "react-native-remix-icon";

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

const ConfigForm = ({
  onClose,
  config,
}: {
  onClose: () => void;
  config?: config;
}) => {
  const [locationName, setLocationName] = useState("");
  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");
  const [baseWeight, setBaseWeight] = useState<number | null>(null);
  const [baseUnit, setBaseUnit] = useState("kg");
  const [equivalentPoints, setEquivalentPoints] = useState<number | null>(null);
  const [addressChanged, setAddressChanged] = useState(false);

  // Loaders and states
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [modal, setModal] = useState(false);
  const { ipAddress, port } = useUrl();

  const geocodeAddress = async (address: string) => {
    const apiKey = "72d5a1df72ec497ea48fbb7f2842a176";
    setLoading(true);

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          address
        )}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setLat(lat.toString());
        setLon(lng.toString());
      } else {
        setLat("Coordinates not Found");
        setLon("Coordinates not Found");
        console.log("Coordinates not found for this address");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      setLat("");
      setLon("");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (text: string) => {
    setLocationName(text);
    if (text) {
      geocodeAddress(text);
      setAddressChanged(false);
    }
  };

  useEffect(() => {
    if (config) {
      setLocationName(config.defaultLocation.locationName);
      setLat(config.defaultLocation.lat.toString());
      setLon(config.defaultLocation.lon.toString());
      setBaseUnit(config.bottleExchange.baseUnit);
      setBaseWeight(config.bottleExchange.baseWeight);
      setEquivalentPoints(config.bottleExchange.equivalentInPoints);
    }

    console.log(config?._id);
  }, [config]);

  const handleUnitToggle = () => {
    if (baseUnit === "kg") {
      setBaseUnit("lb");
    } else if (baseUnit === "lb") {
      setBaseUnit("g");
    } else if (baseUnit === "g") {
      setBaseUnit("kg");
    }
  };

  const addBotConfig = async () => {};

  const updateBotConfig = async () => {
    setLoading(true);

    try {
      if (locationName) {
        if (addressChanged === true) {
          setIsError(true);
          setModal(true);
          setMessage("Get the Coordinates First");
          return;
        } else if (
          lat === "" ||
          lon === "" ||
          lat === "Coordinates not Found" ||
          lon === "Coordinates not Found"
        ) {
          setIsError(true);
          setModal(true);
          setMessage("Invalid Coordinates");
          return;
        }
      }

      let url = `http://${ipAddress}:${port}/api/configurations/${config?._id}`;

      let response = await axios.put(url, {
        defaultLocation: {
          locationName: locationName,
          lat: lat,
          lon: lon,
        },
        bottleExchange: {
          baseWeight: baseWeight,
          baseUnit: baseUnit,
          equivalentInPoints: equivalentPoints,
        },
      });

      if (response.data.success === true) {
        setModal(true);
        setMessage(response.data.message);
        setIsError(false);
      }
    } catch (error: any) {
      setModal(true);
      setMessage(error.response.data.message);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1 px-4 absolute top-0 left-0 bottom-0 right-0 bg-black/50"
      >
        <SafeAreaView className="flex-1">
          <View className="flex-1 justify-center items-center">
            {/* Input form */}
            <View className="flex p-4 justify-center items-center bg-[#F0F0F0] rounded-3xl w-4/5">
              <View className="w-full flex flex-row items-center justify-end">
                <Pressable onPress={onClose}>
                  <RemixIcon name="close-line" size={16} />
                </Pressable>
              </View>
              <View className="w-full flex flex-col  items-center justify-center space-y-6">
                <View className="w-full flex flex-col items-center justify-center space-y-4">
                  <View className="w-full flex flex-col items-start justify-center px-1">
                    <Text className="text-xs font-semibold">
                      Points Configuration
                    </Text>
                    <Text className="text-xs font-normal text-[#6E6E6E]">
                      configure bottle exchange
                    </Text>
                  </View>

                  <View className="w-full flex flex-col items-center justify-center space-y-2">
                    <View className="w-full flex flex-row items-center justify-between py-2.5 px-4 rounded-xl bg-[#E6E6E6]">
                      <Text
                        className="w-3/4 text-xs font-normal"
                        numberOfLines={1}
                      >
                        {baseUnit}
                      </Text>
                      <Pressable
                        className="p-2 rounded-full bg-[#050301]"
                        onPress={handleUnitToggle}
                      >
                        <RemixIcon
                          name="refresh-line"
                          size={12}
                          color="white"
                        />
                      </Pressable>
                    </View>
                    <TextInput
                      className="w-full text-xs font-normal py-2 px-4 rounded-xl bg-[#E6E6E6]"
                      placeholder="equivalent points"
                      value={equivalentPoints?.toString()}
                      onChangeText={(text) => setEquivalentPoints(Number(text))}
                    />
                    <TextInput
                      className="w-full text-xs font-normal py-2 px-4 rounded-xl bg-[#E6E6E6]"
                      placeholder="base weight"
                      value={baseWeight?.toString()}
                      onChangeText={(text) => setBaseWeight(Number(text))}
                    />
                  </View>
                </View>
                <View className="w-full flex flex-col items-center justify-center space-y-4">
                  <View className="w-full flex flex-col items-start justify-center px-1">
                    <Text className="text-xs font-semibold">
                      Default Location
                    </Text>
                    <Text className="text-xs font-normal text-[#6E6E6E]">
                      configure default location
                    </Text>
                  </View>
                  <View className="w-full flex flex-col items-center justify-center space-y-2">
                    <View className="w-full flex flex-row justify-between items-center bg-[#E6E6E6] py-2.5 rounded-xl px-4">
                      <TextInput
                        className="w-4/5 flex items-center justify-center text-xs font-normal "
                        placeholder="enter address"
                        value={locationName}
                        onChangeText={(text) => {
                          setLocationName(text);
                          setAddressChanged(true);
                        }}
                      />
                      <Pressable
                        className="p-2 rounded-full bg-[#050301]"
                        onPress={() => handleAddressChange(locationName)}
                      >
                        <RemixIcon
                          name="search-2-line"
                          color="white"
                          size={12}
                        />
                      </Pressable>
                    </View>
                    <TextInput
                      className="w-full bg-[#E6E6E6] rounded-xl text-xs font-normal py-2 px-4"
                      placeholder="Latitude"
                      value={lat}
                      editable={false}
                    />
                    <TextInput
                      className="w-full bg-[#E6E6E6] rounded-xl text-xs font-normal py-2 px-4"
                      placeholder="Longitude"
                      value={lon}
                      editable={false}
                    />
                  </View>
                </View>
                {config ? (
                  <Pressable className="w-full" onPress={updateBotConfig}>
                    <LinearGradient
                      colors={["#699900", "#466600"]}
                      className="w-full flex items-center justify-center py-3 rounded-xl"
                    >
                      <Text className="text-xs font-semibold text-white">
                        Update
                      </Text>
                    </LinearGradient>
                  </Pressable>
                ) : (
                  <Pressable className="w-full" onPress={addBotConfig}>
                    <LinearGradient
                      colors={["#699900", "#466600"]}
                      className="w-full flex items-center justify-center py-3 rounded-xl"
                    >
                      <Text className="text-xs font-semibold text-white">
                        Configure
                      </Text>
                    </LinearGradient>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      {loading && <Loader />}
      {modal && (
        <Modal
          message={message}
          header="Configurations"
          icon="location"
          isVisible={modal}
          onClose={() => {
            if (!isError) {
              onClose();
            }
            setModal(false);
          }}
        />
      )}
    </>
  );
};

export default ConfigForm;
