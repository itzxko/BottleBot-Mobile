import {
  View,
  Text,
  TouchableHighlight,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRewards } from "@/context/RewardsProvider";
import { StatusBar } from "expo-status-bar";
import Loader from "@/components/loader";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Image, ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Modal from "@/components/modal";
import { useUrl } from "@/context/UrlProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import RemixIcon from "react-native-remix-icon";
import ChooseUserAdd from "./ChooseUserAdd";
import { usePagination } from "@/context/PaginationProvider";

const RewardHistoryAdd = ({ onClose }: { onClose: () => void }) => {
  const { getActiveRewards, rewards, totalPages } = useRewards();
  const { rewardLimit } = usePagination();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [message, setMessage] = useState("");
  const { ipAddress, port } = useUrl();
  const [chooseModal, setChooseModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Item | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const categories = ["Goods", "Clothing", "Beverage", "Other"];

  useEffect(() => {
    fetchData();
  }, [userSearch, filter, currentPage]);

  const fetchData = async () => {
    setLoading(true);
    await getActiveRewards(userSearch, filter, currentPage, rewardLimit);
    setLoading(false);
  };

  interface Item {
    _id: string;
    archiveDate: Date;
    validFrom: Date;
    validUntil: Date;
    rewardDescription: string;
    name: string;
    category: string;
    image: string;
    pointsRequired: number;
    rewardName: string;
    stocks: number;
  }

  return (
    <>
      <SafeAreaView className="flex-1 w-full bg-[#F0F0F0] absolute top-0 left-0 right-0 bottom-0">
        <View className="relative w-full flex flex-row items-center justify-center p-4">
          <TouchableHighlight
            underlayColor={"#C9C9C9"}
            className="absolute left-4 rounded-full"
            onPress={onClose}
          >
            <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
              <RemixIcon name="arrow-left-s-line" size={16} color="black" />
            </View>
          </TouchableHighlight>
          <Text className="text-sm font-semibold">Redeem</Text>
        </View>
        <View className="w-full flex flex-row items-center justify-between pt-4 px-4">
          <View className="w-full flex flex-row items-center justify-between pl-6 pr-4 py-3 rounded-full bg-[#E6E6E6]">
            <View className="w-6/12 flex-row items-center justify-start">
              <RemixIcon
                name="search-2-line"
                size={16}
                color={"rgba(0, 0, 0, 0.5)"}
              />
              <TextInput
                className="w-full bg-[#E6E6E6] text-xs font-normal pl-2"
                placeholder={"search rewards"}
                numberOfLines={1}
                value={userSearch}
                onChangeText={(text) => {
                  setUserSearch(text);
                  setCurrentPage(1);
                }}
              />
            </View>
          </View>
        </View>
        <View className="w-full flex items-start justify-start pt-4 pb-2 px-4">
          <Text className="text-sm font-semibold">Redeemable Items</Text>
          <Text className="text-sm font-normal text-black/50">
            Choose a Reward of your choice
          </Text>
        </View>

        <View className="w-full flex flex-row py-1.5 mb-1">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category: string, index: number) => {
              const firstItem = index === 0;
              const lastItem = index === categories.length - 1;

              const margin = firstItem
                ? "ml-4 mr-2"
                : lastItem
                ? "mr-4"
                : "mr-2";
              return (
                <Pressable
                  className={`rounded-xl ${margin}`}
                  key={category}
                  onPress={() => {
                    if (filter === category) {
                      setFilter("");
                    } else {
                      setFilter(category);
                    }
                  }}
                >
                  <LinearGradient
                    colors={
                      filter !== category
                        ? ["#E1E1E1", "#d9d9d9"]
                        : ["#699900", "#466600"]
                    }
                    className="px-6 py-3 flex items-center justify-center rounded-full"
                  >
                    <Text
                      className={
                        filter === category
                          ? "text-xs font-semibold text-white"
                          : "text-xs font-normal text-black"
                      }
                    >
                      {category}
                    </Text>
                  </LinearGradient>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView
          className="flex-1 w-full"
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full flex flex-row flex-wrap items-center justify-between px-4">
            {rewards.length > 0 ? (
              rewards.map((item: Item) => (
                <View
                  className="w-full flex rounded-3xl overflow-hidden mb-6 bg-[#FCFCFC]"
                  key={item._id}
                >
                  <View className="w-full h-[160px] flex items-center justify-center bg-gray-400 overflow-hidden">
                    <ImageBackground
                      className="w-full flex-1"
                      source={{
                        uri: `http://${ipAddress}:${port}/api/images/${item.image}`,
                      }}
                    ></ImageBackground>
                  </View>
                  <View className="w-full p-6 flex flex-row items-center justify-between ">
                    <View className="max-w-[60%]">
                      <Text
                        className="text-sm font-semibold text-black capitalize"
                        numberOfLines={1}
                      >
                        {item.rewardName}
                      </Text>
                      <Text
                        className="text-xs font-normal text-black"
                        numberOfLines={1}
                      >
                        {item.pointsRequired} pt., {item.stocks} avail.
                      </Text>
                    </View>
                    <TouchableHighlight
                      className="flex items-center justify-center rounded-full"
                      underlayColor={"#41917F"}
                      onPress={() => {
                        setChooseModal(true);
                        setSelectedReward(item);
                      }}
                    >
                      <LinearGradient
                        colors={["#699900", "#466600"]}
                        className="p-2 rounded-full shadow shadow-black"
                      >
                        <RemixIcon
                          name="arrow-right-s-line"
                          size={16}
                          color="white"
                        />
                      </LinearGradient>
                    </TouchableHighlight>
                  </View>
                </View>
              ))
            ) : (
              <View className="w-full h-[240px] items-center justify-center">
                <View className="p-3 mb-2 rounded-full bg-[#699900]">
                  <RemixIcon name="blur-off-fill" size={16} color="white" />
                </View>
                <Text className="text-xs font-normal text-black/50">
                  No Rewards Found
                </Text>
              </View>
            )}
          </View>
          {totalPages ? (
            <View className="flex flex-row space-x-2 items-center justify-center">
              <Pressable
                disabled={currentPage === 1}
                onPress={() => setCurrentPage(currentPage - 1)}
              >
                <RemixIcon name="arrow-left-s-line" size={16} color="black" />
              </Pressable>

              {Array.from(
                {
                  length: Math.min(5, totalPages),
                },
                (_, index) => {
                  const startPage = Math.max(1, currentPage - 2);
                  const page = startPage + index;
                  return page <= totalPages ? page : null;
                }
              ).map(
                (page) =>
                  page && (
                    <Pressable
                      key={page}
                      onPress={() => setCurrentPage(page)}
                      className="p-2"
                    >
                      <Text
                        className={
                          currentPage === page
                            ? "text-lg font-semibold text-[#466600]"
                            : "text-xs font-semibold text-black"
                        }
                      >
                        {page}
                      </Text>
                    </Pressable>
                  )
              )}

              <Pressable
                disabled={currentPage === totalPages}
                onPress={() => setCurrentPage(currentPage + 1)}
              >
                <RemixIcon name="arrow-right-s-line" size={16} color="black" />
              </Pressable>
            </View>
          ) : null}

          <View className="w-full pb-24"></View>
        </ScrollView>
      </SafeAreaView>

      <StatusBar style="auto" />
      {loading && <Loader />}
      {chooseModal && (
        <ChooseUserAdd
          onClose={() => {
            setChooseModal(false);
            onClose();
          }}
          reward={selectedReward}
        />
      )}
      {visibleModal && (
        <Modal
          header="Checkout"
          message={message}
          isVisible={visibleModal}
          onClose={() => {
            setVisibleModal(false);
          }}
          icon="redeem"
        />
      )}
    </>
  );
};

export default RewardHistoryAdd;
