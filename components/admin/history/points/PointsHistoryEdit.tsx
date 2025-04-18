import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUsers } from "@/context/UsersProvider";
import { useUrl } from "@/context/UrlProvider";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "@/components/loader";
import Modal from "@/components/modal";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import RemixIcon from "react-native-remix-icon";
import { usePagination } from "@/context/PaginationProvider";
import { useAdminHistory } from "@/context/AdminHistoryProvider";
import FieldsAdd from "./FieldsAdd";
import FieldsEdit from "./FieldsEdit";

interface Item {
  _id: string;
  name: string;
  category: string;
  image: string;
  pointsRequired: number;
  rewardName: string;
  stocks: number;
}

interface user {
  _id: string;
  archiveDate: Date;
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

const PointsHistoryEdit = ({
  onClose,
  historyId,
}: {
  onClose: () => void;
  historyId: string;
}) => {
  const { getCitizens, searchCitizens, citizens, totalPages } = useUsers();
  const { userLimit } = usePagination();
  const [loading, setLoading] = useState(false);
  const { ipAddress, port, urlString } = useUrl();
  const [userPoints, setUserPoints] = useState<{ [key: string]: number }>({});
  const [selectedUser, setSelectedUser] = useState<user | null>(null);
  const [isError, setIsError] = useState(false);
  const [fieldsModal, setFieldsModal] = useState(false);
  const { fetchAllPointsHistory } = useAdminHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const [userSearch, setUserSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      await getCitizens(currentPage, userLimit);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPointsForAllUsers = async () => {
    setLoading(true);
    try {
      const pointsPromises = citizens.map(async (user: user) => {
        try {
          const response = await axios.get(
            `${urlString}/api/history/claim/points/${user._id}`
          );
          return {
            userId: user._id,
            points: response.data.availablePoints.availablePoints,
          };
        } catch (error) {
          console.error(`Error fetching points for user ${user._id}`, error);
          return { userId: user._id, points: 0 };
        }
      });

      const results = await Promise.all(pointsPromises);

      const pointsData = results.reduce(
        (acc, { userId, points }) => ({ ...acc, [userId]: points }),
        {}
      );

      setUserPoints(pointsData);
    } catch (error) {
      console.error("Error fetching points for users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (citizens.length > 0) {
      fetchPointsForAllUsers();
    }
  }, [citizens]);

  const getUserPoints = (userId: string) => {
    return userPoints[userId] !== undefined ? userPoints[userId] : 0;
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setLoading(true);

      try {
        if (userSearch.trim() === "") {
          setUserSearch("");
          await getCitizens(newPage, userLimit);
        } else {
          await searchCitizens(userSearch, newPage, userLimit);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async (user: string) => {
    setLoading(true);
    setCurrentPage(1);
    setUserSearch(user);

    try {
      if (user.trim() === "") {
        setUserSearch("");
        await getCitizens(1, userLimit);
      } else {
        await searchCitizens(user, 1, userLimit);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1 px-4 absolute top-0 left-0 bottom-0 right-0 bg-[#F0F0F0]">
        {/* Title Bar */}
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
          <Text className="text-sm font-semibold">Choose User</Text>
        </View>
        <View className="w-full flex flex-row items-center justify-between pt-4">
          <View className="w-full flex flex-row items-center justify-between pl-6 pr-4 py-3 rounded-full bg-[#E6E6E6]">
            <View className="w-full flex-row items-center justify-start">
              <RemixIcon
                name="search-2-line"
                size={16}
                color={"rgba(0, 0, 0, 0.5)"}
              />
              <TextInput
                className="w-3/4 bg-[#E6E6E6] text-xs font-normal px-2"
                placeholder={"search citizens via username"}
                numberOfLines={1}
                value={userSearch}
                onChangeText={handleSearch}
              />
            </View>
          </View>
        </View>
        {/* Header */}
        <View className="w-full flex items-start justify-center py-4">
          <Text className="text-sm font-semibold" numberOfLines={1}>
            Select User
          </Text>
          <Text className="text-xs font-normal text-black/50" numberOfLines={1}>
            please select a user to continue the checkout
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 w-full"
        >
          {citizens.map((user: user) => (
            <View
              className="w-full flex flex-row justify-between p-4 bg-[#E6E6E6] rounded-3xl mb-4"
              key={user._id}
            >
              <View className="flex flex-row items-center justify-start w-3/4 ">
                {/* Image */}
                <View className="h-[50px] w-[50px] rounded-full bg-black overflow-hidden">
                  <Image
                    source={require("../../../../assets/images/Man.jpg")}
                    className="w-full h-full"
                  />
                </View>
                <View className="w-2/3 flex items-start justify-center pl-2">
                  <Text
                    numberOfLines={1}
                    className="text-sm font-semibold capitalize"
                  >{`${user.personalInfo.firstName} ${user.personalInfo.lastName}`}</Text>
                  <View className="flex-row items-center justify-start space-x-1">
                    <Text
                      className="text-xs font-normal text-black/50 uppercase pr-1 w-19/12"
                      numberOfLines={1}
                    >
                      {`${getUserPoints(user._id)} ${
                        getUserPoints(user._id) > 1 ? "pts." : "pt."
                      }`}
                    </Text>
                    {user.archiveDate !== null ? (
                      <Text className="text-xs font-normal text-[#B32624]">
                        Archived
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
              <View className="flex items-center justify-center">
                <Pressable
                  onPress={() => {
                    setSelectedUser(user);
                    setFieldsModal(true);
                  }}
                >
                  <LinearGradient
                    className="flex p-3 rounded-full bg-gray-300"
                    colors={["#699900", "#466600"]}
                  >
                    <RemixIcon
                      name="arrow-right-s-line"
                      size={16}
                      color={"white"}
                    />
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          ))}
          <View className="flex flex-row space-x-2 items-center justify-center">
            <Pressable
              disabled={currentPage === 1}
              onPress={() => handlePageChange(currentPage - 1)}
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
                page && ( // Only render valid pages
                  <Pressable
                    key={page}
                    onPress={() => handlePageChange(page)}
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
              onPress={() => handlePageChange(currentPage + 1)}
            >
              <RemixIcon name="arrow-right-s-line" size={16} color="black" />
            </Pressable>
          </View>
          <View className="w-full pb-24"></View>
        </ScrollView>
      </SafeAreaView>
      {loading && <Loader />}
      {fieldsModal && (
        <FieldsEdit
          onClose={() => {
            setFieldsModal(false);
            onClose();
          }}
          historyId={historyId}
          user={selectedUser}
        />
      )}
    </>
  );
};

export default PointsHistoryEdit;
