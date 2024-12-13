import {
  View,
  Text,
  TouchableHighlight,
  TextInput,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useUrl } from "@/context/UrlProvider";
import axios from "axios";
import { ImageBackground } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import Modal from "@/components/modal";
import { useAdminHistory } from "@/context/AdminHistoryProvider";
import { useRewards } from "@/context/RewardsProvider";
import RemixIcon from "react-native-remix-icon";
import DateTimePicker from "@react-native-community/datetimepicker";

const RewardsForm = ({
  onClose,
  rewardId,
  type,
}: {
  onClose: () => void;
  rewardId: string;
  type: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const { ipAddress, port } = useUrl();
  const categories = ["Goods", "Clothing", "Beverage", "Other"];
  const [openCategories, setOpenCategories] = useState(false);
  const { fetchAllRewardsHistory } = useAdminHistory();
  const { getRewards } = useRewards();

  //Data
  const [rewardName, setRewardName] = useState("");
  const [pointsRequired, setPointsRequired] = useState(0);
  const [rewardDescription, setRewardDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stocks, setStocks] = useState(0);
  const [validFrom, setValidFrom] = useState(new Date());
  const [validUntil, setValidUntil] = useState(new Date());
  const [archiveDate, setArchiveDate] = useState<Date | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [rewardImageString, setRewardImageString] = useState<string>("");

  //date
  const [showValidFromDatePicker, setShowValidFromDatePicker] = useState(false);
  const [showValidUntilDatePicker, setShowValidUntilDatePicker] =
    useState(false);
  const [showArchiveDatePicker, setShowArchiveDatePicker] = useState(false);

  const fetchReward = async () => {
    setLoading(true);
    try {
      let url = `http://${ipAddress}:${port}/api/rewards/${rewardId}`;

      let response = await axios.get(url);

      if (response.status === 200) {
        setRewardImageString(response.data.reward.image); // Save the image string
        setCategory(response.data.reward.category);
        setPointsRequired(response.data.reward.pointsRequired);
        setRewardDescription(response.data.reward.rewardDescription);
        setRewardName(response.data.reward.rewardName);
        setStocks(response.data.reward.stocks);

        //date
        const validFromDate = new Date(response.data.reward.validFrom);
        setValidFrom(validFromDate);
        const validUntilDate = new Date(response.data.reward.validUntil);
        setValidUntil(validUntilDate);
        const archiveDateDate = response.data.reward.archiveDate
          ? new Date(response.data.reward.archiveDate)
          : null;
        setArchiveDate(archiveDateDate);
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onValidFromChange = (event: any, selectedDate?: Date) => {
    setShowValidFromDatePicker(false);
    if (selectedDate) setValidFrom(selectedDate);
  };

  const onValidUntilChange = (event: any, selectedDate?: Date) => {
    setShowValidUntilDatePicker(false);
    if (selectedDate && selectedDate > validFrom) {
      setValidUntil(selectedDate);
    } else {
      setVisibleModal(true);
      setMessage("Must be later than the Valid From date");
      setIsError(true);
    }
  };

  const onArchiveDateChange = (event: any, selectedDate?: Date) => {
    setShowArchiveDatePicker(false);
    if (selectedDate) setArchiveDate(selectedDate);
  };

  const formatDate = (date: Date) => date.toLocaleDateString();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    if (type === "edit") {
      fetchReward();
    }
  }, []);

  const addReward = async () => {
    setLoading(true);
    const formatDate = (value: Date | null): string => {
      return value ? value.toISOString() : "";
    };

    const formData = new FormData();
    formData.append("rewardName", rewardName);
    formData.append("rewardDescription", rewardDescription);
    formData.append("pointsRequired", pointsRequired.toString());
    formData.append("stocks", stocks.toString());
    formData.append("category", category);
    if (image) {
      formData.append("image", {
        uri: image,
        name: "rewardImage.jpg",
        type: "image/jpeg",
      } as any);
    }
    formData.append("archiveDate", formatDate(archiveDate));
    formData.append("validFrom", formatDate(validFrom));
    formData.append("validUntil", formatDate(validUntil));

    try {
      let url = `http://${ipAddress}:${port}/api/rewards/`;

      let response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setIsError(false);
        setVisibleModal(true);
        setMessage(response.data.message);
      }
    } catch (error: any) {
      setVisibleModal(true);
      setIsError(true);
      setMessage(error.response.data.message);
      console.log(error.response.data);
    } finally {
      setLoading(false);
    }
  };

  const updateReward = async () => {
    setLoading(true);
    const formatDate = (value: Date | null): string => {
      return value ? value.toISOString() : "";
    };

    const formData = new FormData();
    formData.append("rewardName", rewardName);
    formData.append("rewardDescription", rewardDescription);
    formData.append("pointsRequired", pointsRequired.toString());
    formData.append("stocks", stocks.toString());
    formData.append("category", category);
    if (image) {
      formData.append("image", {
        uri: image,
        name: "rewardImage.jpg",
        type: "image/jpeg",
      } as any);
    }
    formData.append("archiveDate", formatDate(archiveDate));
    formData.append("validFrom", formatDate(validFrom));
    formData.append("validUntil", formatDate(validUntil));

    if (image !== null) {
      formData.append("imageChanged", "true");
      formData.append("prevImageString", rewardImageString);
    } else {
      formData.append("imageChanged", "false");
    }

    try {
      let url = `http://${ipAddress}:${port}/api/rewards/${rewardId}`;

      let response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setIsError(false);
        setVisibleModal(true);
        setMessage(response.data.message);
      }
    } catch (error: any) {
      setVisibleModal(true);
      setIsError(true);
      setMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1 px-6 absolute top-0 left-0 bottom-0 right-0 bg-[#F0F0F0]">
        {/* TitleBar */}
        <View className="relative w-full flex flex-row items-center justify-center py-4">
          <TouchableHighlight
            underlayColor={"#C9C9C9"}
            className="absolute left-0 rounded-full"
            onPress={onClose}
          >
            <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
              <RemixIcon name="arrow-left-s-line" size={16} color="black" />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"#C9C9C9"}
            className="absolute right-0 rounded-full"
            onPress={() => {
              type === "add" ? addReward() : updateReward();
            }}
          >
            <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
              <RemixIcon name="check-line" size={16} />
            </View>
          </TouchableHighlight>
          <Text className="text-sn font-semibold">Reward Form</Text>
        </View>
        <ScrollView
          className="flex-1 w-full"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full flex items-center justify-center py-2">
            <View className="w-full py-4">
              <View className="w-full flex flex-col items-center justify-center py-6">
                <View className="h-[120px] w-[120px] rounded-full bg-black relative">
                  <ImageBackground
                    className="w-full h-full flex-1 rounded-full overflow-hidden"
                    source={
                      image
                        ? {
                            uri: image.includes("file://")
                              ? image
                              : `http://${ipAddress}:${port}/api/images/${image}`,
                          }
                        : {
                            uri: `http://${ipAddress}:${port}/api/images/${rewardImageString}`,
                          }
                    }
                  ></ImageBackground>
                  <Pressable
                    className="absolute right-0 bottom-0 bg-white p-2 rounded-xl"
                    onPress={() => {
                      image ? setImage(null) : pickImage();
                      setImageChanged(true);
                    }}
                  >
                    <RemixIcon
                      name={image ? "close-line" : "add-line"}
                      size={16}
                    />
                  </Pressable>
                </View>
              </View>
              <View className="w-full flex items-start justify-center pb-4">
                <Text className="text-sm font-semibold">
                  Reward Information
                </Text>
                <Text className="text-xs font-normal text-black/50">
                  name, points needed, stocks, etc.
                </Text>
              </View>
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Reward Name</Text>
                <TextInput
                  className="text-xs font-normal max-w-[50%] text-right"
                  placeholder="enter reward name"
                  numberOfLines={1}
                  value={rewardName}
                  onChangeText={setRewardName}
                ></TextInput>
              </View>
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Points Required</Text>
                <TextInput
                  className="text-xs font-normal max-w-[50%] text-right"
                  placeholder="points needed"
                  numberOfLines={1}
                  keyboardType="numeric"
                  value={pointsRequired.toString()}
                  onChangeText={(text) => setPointsRequired(Number(text))}
                ></TextInput>
              </View>
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">
                  Reward Description
                </Text>
                <TextInput
                  className="text-xs font-normal max-w-[50%] text-right"
                  placeholder="description"
                  numberOfLines={1}
                  value={rewardDescription}
                  onChangeText={setRewardDescription}
                ></TextInput>
              </View>
              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Stocks</Text>
                <TextInput
                  className="text-xs font-normal max-w-[50%] text-right"
                  placeholder="quantity"
                  numberOfLines={1}
                  keyboardType="numeric"
                  value={stocks.toString()}
                  onChangeText={(text) => setStocks(Number(text))}
                />
              </View>

              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Valid From</Text>
                <View className="w-1/2 flex flex-row items-center justify-end ">
                  <Text className="text-xs font-normal pr-1" numberOfLines={1}>
                    {formatDate(validFrom) || "Select a date"}
                  </Text>
                  <Pressable
                    onPress={() => setShowValidFromDatePicker(true)}
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
              {showValidFromDatePicker && (
                <DateTimePicker
                  value={validFrom}
                  mode="date"
                  display="default"
                  onChange={onValidFromChange}
                />
              )}

              <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Valid Until</Text>
                <View className="w-1/2 flex flex-row items-center justify-end ">
                  <Text className="text-xs font-normal pr-1" numberOfLines={1}>
                    {formatDate(validUntil) || "Select a date"}
                  </Text>
                  <Pressable
                    onPress={() => setShowValidUntilDatePicker(true)}
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
              {showValidUntilDatePicker && (
                <DateTimePicker
                  value={validUntil}
                  mode="date"
                  display="default"
                  onChange={onValidUntilChange}
                />
              )}

              {type === "edit" && archiveDate ? (
                <>
                  <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
                    <Text className="text-xs font-semibold">Aechive Date</Text>
                    <View className="w-1/2 flex flex-row items-center justify-end ">
                      <Text
                        className="text-xs font-normal pr-1"
                        numberOfLines={1}
                      >
                        {formatDate(archiveDate) || "Select a date"}
                      </Text>
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
                      value={archiveDate}
                      mode="date"
                      display="default"
                      onChange={onArchiveDateChange}
                    />
                  )}
                </>
              ) : null}

              <View className="w-full flex flex-row items-center justify-between px-6 py-[17px] bg-[#E6E6E6] rounded-xl mb-2">
                <Text className="text-xs font-semibold">Category</Text>
                <Pressable
                  className="flex items-end justify-center w-[50%] relative"
                  onPress={() => setOpenCategories(!openCategories)}
                >
                  <View className="flex flex-row items-center justify-start">
                    <Text className="text-xs font-normal" numberOfLines={1}>
                      {category}
                    </Text>
                    {openCategories ? (
                      <RemixIcon name="arrow-up-s-line" size={16} />
                    ) : (
                      <RemixIcon name="arrow-down-s-line" size={16} />
                    )}
                  </View>
                  {openCategories ? (
                    <View className="absolute top-[240%] flex flex-col rounded-xl overflow-hidden bg-[#E6E6E6]">
                      {categories.map((category) => (
                        <Pressable
                          className="w-full px-4 py-2"
                          key={category}
                          onPress={() => {
                            setCategory(category);
                            setOpenCategories(false);
                          }}
                        >
                          <Text
                            className="text-xs font-normal"
                            numberOfLines={1}
                          >
                            {category}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  ) : null}
                </Pressable>
              </View>
            </View>
            <View
              className={`${openCategories ? "w-full pb-60" : "w-full pb-24"}`}
            ></View>
          </View>
        </ScrollView>
      </SafeAreaView>
      {visibleModal && (
        <Modal
          header="Rewards"
          icon="redeem"
          isVisible={visibleModal}
          message={message}
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

export default RewardsForm;
