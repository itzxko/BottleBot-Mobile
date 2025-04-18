import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import Loader from "@/components/loader";
import Modal from "@/components/modal";
import Usermodal from "@/components/admin/users/userModal";
import { useUsers } from "@/context/UsersProvider";
import { StatusBar } from "expo-status-bar";
import EditModal from "@/components/admin/users/editModal";
import { useUrl } from "@/context/UrlProvider";
import { ImageBackground } from "expo-image";
import RemixIcon from "react-native-remix-icon";
import { usePagination } from "@/context/PaginationProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Users = () => {
  const { userLimit } = usePagination();
  const [loading, setLoading] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [message, setMessage] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const { users, getUsers, totalPages } = useUsers();
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<user | null>(null);
  const { ipAddress, port, urlString } = useUrl();
  const [filterStatus, setFilterStatus] = useState("active");
  const [userSearch, setUserSearch] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

  const getCurrentUser = async () => {
    const user = await AsyncStorage.getItem("user");
    if (user) {
      const currentUser = JSON.parse(user);
      setUser(currentUser);
    }
  };

  const fetchData = async () => {
    getCurrentUser();
    setLoading(true);
    await getUsers(userSearch, currentPage, userLimit, filterStatus);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, userSearch, filterStatus]);

  const handleFilterStatus = async () => {
    if (filterStatus === "active") {
      setFilterStatus("archived");
    } else if (filterStatus === "archived") {
      setFilterStatus("active");
    }
  };

  const archiveUser = async (userId: string) => {
    setLoading(true);
    try {
      let url = `${urlString}/api/users/${userId}`;
      let response = await axios.delete(url);

      if (response.data.success === true) {
        setMessage(response.data.message);
        setVisibleModal(true);
        setIsError(false);
        setCurrentPage(1);
      }
    } catch (error: any) {
      setMessage(error.response.data.message);
      setVisibleModal(true);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const unarchiveUser = async (user: user) => {
    setLoading(true);
    try {
      let url = `${urlString}/api/users/${user._id}`;

      let response = await axios.put(url, {
        archiveDate: null,
        personalInfo: user.personalInfo,
        contactInfo: user.contactInfo,
        economicInfo: user.economicInfo,
        credentials: user.credentials,
      });

      if (response.data.success === true) {
        setMessage(response.data.message);
        setVisibleModal(true);
        setIsError(false);
        setCurrentPage(1);
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "An error occurred");
      setIsError(true);
      setVisibleModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SafeAreaView className="flex-1 px-4 bg-[#F0F0F0]">
        {/* TitleBar */}
        <View className="relative w-full flex flex-row items-center justify-center py-4">
          <TouchableHighlight
            underlayColor={"#C9C9C9"}
            className="absolute left-0 rounded-full"
          >
            <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
              <RemixIcon name="arrow-left-s-line" size={16} color="black" />
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"#C9C9C9"}
            className="absolute right-0 rounded-full"
            onPress={() => setUserModal(true)}
          >
            <View className="p-2 bg-[#E1E1E1] rounded-full flex items-center justify-center">
              <RemixIcon name="add-line" size={16} color="black" />
            </View>
          </TouchableHighlight>
          <Text className="text-sm font-semibold">Users</Text>
        </View>
        {/* Search and Filter */}
        <View className="w-full flex flex-row items-center justify-between pt-4">
          <View className="w-full flex flex-row items-center justify-between pl-6 pr-4 py-3 rounded-full bg-[#E6E6E6]">
            <View className="w-6/12 flex-row items-center justify-start">
              <RemixIcon
                name="search-2-line"
                size={16}
                color={"rgba(0, 0, 0, 0.5)"}
              />
              <TextInput
                className="w-full bg-[#E6E6E6] text-xs font-normal pl-2"
                placeholder={"search users via username"}
                value={userSearch}
                onChangeText={(text) => {
                  setUserSearch(text);
                  setCurrentPage(1);
                }}
                numberOfLines={1}
              />
            </View>
            <Pressable
              className="w-4/12 flex flex-row items-center justify-between px-4 py-2 bg-[#050301] rounded-full"
              onPress={handleFilterStatus}
            >
              <Text
                className="w-2/3 text-xs font-normal text-white capitalize"
                numberOfLines={1}
              >
                {filterStatus}
              </Text>
              <RemixIcon name="refresh-line" size={16} color="white" />
            </Pressable>
          </View>
        </View>
        {/* Header */}
        <View className="w-full flex items-center justify-center py-4">
          <View className="w-full flex items-start justify-center">
            <Text
              className="text-sm font-semibold text-black"
              numberOfLines={1}
            >
              Manage Users
            </Text>
            <Text className="text-xs font-normal text-black/50">
              Create, Update or Delete Users
            </Text>
          </View>
        </View>
        {/* Content */}
        <ScrollView
          className="flex-1 w-full py-2"
          showsVerticalScrollIndicator={false}
        >
          {users.length > 0 ? (
            users.map((mappedUser: user) => (
              <View
                className="w-full h-[240px] flex items-center rounded-[32px] overflow-hidden justify-center mb-4"
                key={mappedUser._id}
              >
                <ImageBackground
                  className="w-full h-full"
                  source={require("../../assets/images/Man.jpg")}
                >
                  <LinearGradient
                    className="w-full h-full p-6"
                    colors={[
                      "rgba(18, 18, 18, 0)",
                      "rgba(18, 18, 18, 0.4)",
                      "rgba(18, 18, 18, 1)",
                    ]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  >
                    <View className="w-full h-full flex flex-col justify-between items-center">
                      <View className="w-full flex flex-row items-start justify-between">
                        <Text className="text-xs font-normal text-white/50 uppercase">
                          {mappedUser.credentials.level}
                        </Text>
                        {user &&
                          mappedUser.credentials.level !== "admin" &&
                          user._id !== mappedUser._id &&
                          mappedUser.archiveDate === null && (
                            <Pressable
                              className="p-3 rounded-full bg-[#050301]/50"
                              onPress={() => archiveUser(mappedUser._id)}
                            >
                              <RemixIcon
                                name="archive-line"
                                size={16}
                                color="white"
                              />
                            </Pressable>
                          )}
                        {mappedUser.archiveDate !== null ? (
                          <Pressable
                            className="p-3 rounded-full bg-[#050301]/50"
                            onPress={() => unarchiveUser(mappedUser)}
                          >
                            <RemixIcon
                              name="user-follow-line"
                              size={16}
                              color="white"
                            />
                          </Pressable>
                        ) : null}
                      </View>
                      <View className="w-full flex items-start justify-center">
                        <View className="w-full pb-4">
                          <Text
                            className="text-sm font-semibold text-white"
                            numberOfLines={1}
                          >
                            {`${mappedUser.personalInfo.firstName} ${mappedUser.personalInfo.lastName}`}
                          </Text>

                          <Text
                            className="text-xs font-normal text-white/50 uppercase max-w-[60%]"
                            numberOfLines={1}
                          >
                            #{mappedUser._id}
                          </Text>
                        </View>
                        <View className="w-full flex items-start justify-center">
                          {mappedUser.archiveDate === null && (
                            <Pressable
                              className=""
                              onPress={() => {
                                setEditModal(true);
                                setSelectedUser(mappedUser);
                              }}
                            >
                              <LinearGradient
                                colors={["#699900", "#466600"]}
                                className="flex flex-row justify-center items-center px-4 py-2 rounded-full"
                              >
                                <Text className="text-xs font-semibold text-white pr-1">
                                  Edit
                                </Text>
                                <RemixIcon
                                  name="edit-2-line"
                                  size={16}
                                  color="white"
                                />
                              </LinearGradient>
                            </Pressable>
                          )}
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </View>
            ))
          ) : (
            <View className="w-full h-[240px] items-center justify-center">
              <View className="p-3 mb-2 rounded-full bg-[#699900]">
                <RemixIcon name="blur-off-fill" size={16} color="white" />
              </View>
              <Text className="text-xs font-normal text-black/50">
                No Users Found
              </Text>
            </View>
          )}

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
                  page && ( // Only render valid pages
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
      {visibleModal && (
        <Modal
          header="Users"
          message={message}
          isVisible={visibleModal}
          onClose={() => {
            setVisibleModal(false);
            if (!isError) {
              getUsers(userSearch, currentPage, userLimit, filterStatus);
            }
          }}
          icon="profile"
        />
      )}
      {userModal && (
        <Usermodal
          accountLevel={user ? user.credentials.level : ""}
          onClose={() => {
            setUserModal(false);
            getUsers(userSearch, currentPage, userLimit, filterStatus);
          }}
        />
      )}
      {editModal && (
        <EditModal
          user={selectedUser}
          accountLevel={user ? user.credentials.level : ""}
          onClose={() => {
            setEditModal(false);
            getUsers(userSearch, currentPage, userLimit, filterStatus);
          }}
        />
      )}
    </>
  );
};

export default Users;
