import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useUrl } from "@/context/UrlProvider";
import axios from "axios";
import Modal from "@/components/modal";
import Loader from "@/components/loader";
import RemixIcon from "react-native-remix-icon";

interface user {
  _id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    middleName: string;
    dateOfBirth: Date;
    gender: string;
    civilStatus: string;
    nationality: string;
  };
  contactInfo: {
    address: {
      houseNumber: number;
      street: string;
      barangay: string;
      city: string;
    };
    phoneNumbers: [string];
  };
  economicInfo: {
    employmentStatus: string;
    occupation: string;
  };
  credentials: {
    level: string;
    email: string;
    password: string;
  };
}

const FieldsEdit = ({
  onClose,
  user,
  historyId,
}: {
  onClose: () => void;
  user: user | null;
  historyId: string;
}) => {
  const [bottleCount, setBottleCount] = useState("");
  const [pointsAccumulated, setPointsAccumulated] = useState("");
  const { ipAddress, port, urlString } = useUrl();
  const [message, setMessage] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const updatePointHistory = async () => {
    setLoading(true);
    try {
      let url = `${urlString}/api/history/dispose/${historyId}`;

      let response = await axios.put(url, {
        userId: user?._id,
        bottleCount: bottleCount,
        pointsAccumulated: pointsAccumulated,
      });

      if (response.status === 200) {
        setMessage(response.data.message);
        setIsError(false);
        setVisibleModal(true);
      }
    } catch (error: any) {
      setMessage(error.response.data.message);
      setVisibleModal(true);
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
            {/* Use flex-1 to take full height */}
            <View className="flex p-4 justify-center items-center bg-[#F0F0F0] rounded-3xl w-4/5">
              {/* Inner View for padding */}
              <View className="flex flex-row items-start justify-between w-full pb-6">
                <View className="w-2/3 flex items-start justify-center">
                  <Text className="text-sm font-semibold" numberOfLines={1}>
                    Input Fields
                  </Text>
                  <Text
                    className="text-xs font-normal text-black/50"
                    numberOfLines={1}
                  >
                    fill out all fields to continue
                  </Text>
                </View>
                <Pressable onPress={onClose}>
                  <RemixIcon name="close-line" size={16} color={"black"} />
                </Pressable>
              </View>
              <View className="w-full flex items-start justify-center py-2">
                <Text className="text-xs font-semibold pb-2">Bottle Count</Text>
                <TextInput
                  className="w-full bg-[#E6E6E6] rounded-xl text-xs font-normal py-2 px-4"
                  numberOfLines={1}
                  placeholder="number of bottles"
                  keyboardType="numeric"
                  value={bottleCount}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, "");
                    setBottleCount(numericValue);
                  }}
                />
              </View>
              <View className="w-full flex items-start justify-center py-2">
                <Text className="text-xs font-semibold pb-2">
                  Points Earned
                </Text>
                <TextInput
                  className="w-full bg-[#E6E6E6] rounded-xl text-xs font-normal py-2 px-4"
                  numberOfLines={1}
                  keyboardType="numeric"
                  placeholder="points accumulated"
                  value={pointsAccumulated}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, "");
                    setPointsAccumulated(numericValue);
                  }}
                />
              </View>
              <Pressable className="w-full pt-4" onPress={updatePointHistory}>
                <LinearGradient
                  colors={["#699900", "#466600"]}
                  className="flex items-center justify-center w-full px-4 py-[14px] rounded-xl"
                >
                  <Text className="text-xs font-semibold text-white">
                    Proceed
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      {loading && <Loader />}
      {visibleModal && (
        <Modal
          header="History"
          message={message}
          onClose={() => {
            setVisibleModal(false);
            if (!isError) {
              onClose();
            }
          }}
          isVisible
          icon="history"
        />
      )}
    </>
  );
};

export default FieldsEdit;
