import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import RemixIcon from "react-native-remix-icon";
import { LinearGradient } from "expo-linear-gradient";
import { useUrl } from "@/context/UrlProvider";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import Loader from "@/components/loader";
import Modal from "@/components/modal";

interface PointsHistory {
  _id: string;
  userId: string;
  dateDisposed: Date;
  pointsAccumulated: number;
  bottleCount: number;
  archiveDate: Date;
  userInfo: {
    personalInfo: {
      firstName: string;
      lastName: string;
      middleName: string;
    };
  };
}

const ArchiveDateEdit = ({
  onClose,
  data,
}: {
  onClose: () => void;
  data: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const { ipAddress, port } = useUrl();
  const [showArchiveDatePicker, setShowArchiveDatePicker] = useState(false);
  const [archiveDate, setArchiveDate] = useState<Date | null>(null);
  const [historyData, setHistoryData] = useState<PointsHistory>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = `http://${ipAddress}:${port}/api/history/dispose/${data}`;
        let response = await axios.get(url);

        if (response.data.success === true) {
          const archiveDateValue = response.data.oneDisposalhistory.archiveDate;
          // Assuming archiveDateValue is in ISO string format
          setArchiveDate(new Date(archiveDateValue));
          setHistoryData(response.data.oneDisposalhistory);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    console.log(data);
    fetchData();
  }, []);

  const formatDate = (date: Date | null) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toLocaleDateString();
    }
    return ""; // Return empty string if date is null or invalid
  };

  const onArchiveDateChange = (event: any, selectedDate?: Date) => {
    setShowArchiveDatePicker(false);
    if (selectedDate) setArchiveDate(selectedDate);
  };

  const updateArchiveDate = async () => {
    setLoading(true);

    try {
      let url = `http://${ipAddress}:${port}/api/history/dispose/${data}`;

      let response = await axios.put(url, {
        _id: historyData?._id,
        userId: historyData?.userId,
        bottleCount: historyData?.bottleCount,
        pointsAccumulated: historyData?.pointsAccumulated,
        archiveDate: archiveDate,
        dateDisposed: historyData?.dateDisposed,
      });

      if (response.data.success) {
        setVisibleModal(true);
        setMessage(response.data.message);
        setIsError(false);
      }
    } catch (error: any) {
      setVisibleModal(true);
      setMessage(error.response?.data?.message || "An error occurred");
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
            <View className="flex p-4 justify-center items-center bg-[#F0F0F0] rounded-3xl w-4/5">
              <View className="flex flex-row items-start justify-between w-full pb-6">
                <View className="w-2/3 flex items-start justify-center">
                  <Text className="text-sm font-semibold" numberOfLines={1}>
                    Archive Date
                  </Text>
                  <Text
                    className="text-xs font-normal text-black/50"
                    numberOfLines={1}
                  >
                    edit archive date
                  </Text>
                </View>
                <Pressable onPress={onClose}>
                  <RemixIcon name="close-line" size={16} color={"black"} />
                </Pressable>
              </View>
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">
                  {formatDate(archiveDate)}
                </Text>
                <View className="w-1/2 flex flex-row items-center justify-end ">
                  <Pressable
                    onPress={() => setShowArchiveDatePicker(true)}
                    className="p-2 bg-black rounded-full"
                  >
                    <RemixIcon
                      name="calendar-event-line"
                      size={14}
                      color="white"
                    />
                  </Pressable>
                </View>
              </View>
              {showArchiveDatePicker && (
                <DateTimePicker
                  value={archiveDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={onArchiveDateChange}
                />
              )}
              <Pressable className="w-full pt-4" onPress={updateArchiveDate}>
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
          icon="history"
          header="history"
          message={message}
          isVisible={visibleModal}
          onClose={() => {
            setVisibleModal(false);
            if (!isError) {
              onClose();
            }
          }}
        />
      )}
    </>
  );
};

export default ArchiveDateEdit;
