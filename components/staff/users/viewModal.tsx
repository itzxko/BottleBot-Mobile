import {
  View,
  Text,
  TouchableHighlight,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
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

const ViewModal = ({
  user,
  onClose,
}: {
  user: user | null;
  onClose: () => void;
}) => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [civilStatus, setCivilStatus] = useState("");
  const [nationality, setNationality] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [brgy, setBrgy] = useState("");
  const [city, setCity] = useState("");
  const [number, setNumber] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [occupation, setOccupation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState("");

  const formattedDate = (() => {
    if (!user || !user.personalInfo.dateOfBirth) {
      return "loading...";
    }

    const date = new Date(user.personalInfo.dateOfBirth);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-US"); // Format the date as needed
  })();

  useEffect(() => {
    if (user && user._id) {
      setFirstName(user.personalInfo.firstName);
      setMiddleName(user.personalInfo.middleName);
      setLastName(user.personalInfo.lastName);
      setBirthDate(formattedDate);
      setGender(user.personalInfo.gender);
      setCivilStatus(user.personalInfo.civilStatus);
      setNationality(user.personalInfo.nationality);
      setHouseNumber(user.contactInfo.address.houseNumber.toString());
      setStreet(user.contactInfo.address.street);
      setBrgy(user.contactInfo.address.barangay);
      setCity(user.contactInfo.address.city);
      setNumber(user.contactInfo.phoneNumbers[0]);
      setEmploymentStatus(user.economicInfo.employmentStatus);
      setOccupation(user.economicInfo.occupation);
      setEmail(user.credentials.email);
      setPassword(user.credentials.password);
      setLevel(user.credentials.level);
    }
  }, [user]);

  return (
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

        <Text className="text-sm font-semibold">View User</Text>
      </View>
      <ScrollView
        className="flex-1 w-full"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full flex items-center justify-center py-2">
          {/* Personal Information */}
          <View className="w-full py-4">
            {/* Title */}
            <View className="w-full flex items-start justify-center pb-4">
              <Text className="text-sm font-semibold">
                Personal Information
              </Text>
              <Text className="text-xs font-normal text-black/50">
                name, birthday, nationality etc.
              </Text>
            </View>
            {/* First Name */}
            <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
              <Text className="text-xs font-semibold">First Name</Text>
              <TextInput
                className="text-xs font-normal max-w-[50%] text-right"
                placeholder="enter first name"
                numberOfLines={1}
                value={firstName}
                onChangeText={setFirstName}
                editable={false}
              ></TextInput>
            </View>
            {/* Middle Name */}
            <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
              <Text className="text-xs font-semibold">Middle Name</Text>
              <TextInput
                className="text-xs font-normal max-w-[50%] text-right"
                placeholder="enter middle name"
                numberOfLines={1}
                value={middleName}
                onChangeText={setMiddleName}
                editable={false}
              ></TextInput>
            </View>
            {/* Last Name */}
            <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
              <Text className="text-xs font-semibold">Last Name</Text>
              <TextInput
                className="text-xs font-normal max-w-[50%] text-right"
                placeholder="enter last name"
                numberOfLines={1}
                value={lastName}
                onChangeText={setLastName}
                editable={false}
              ></TextInput>
            </View>
            {/* Birth Date */}
            <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
              <Text className="text-xs font-semibold">Birth Date</Text>
              <TextInput
                className="text-xs font-normal max-w-[50%] text-right"
                placeholder="yyyy-mm-dd"
                numberOfLines={1}
                value={birthDate}
                onChangeText={setBirthDate}
                editable={false}
              ></TextInput>
            </View>
            {/* Gender */}
            <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
              <Text className="text-xs font-semibold">Gender</Text>
              <TextInput
                className="text-xs font-normal max-w-[50%] text-right"
                placeholder="m/f"
                numberOfLines={1}
                value={gender}
                onChangeText={setGender}
                editable={false}
              ></TextInput>
            </View>
            {/* Civil Status */}
            <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
              <Text className="text-xs font-semibold">Civil Status</Text>
              <TextInput
                className="text-xs font-normal max-w-[50%] text-right"
                placeholder="single"
                numberOfLines={1}
                value={civilStatus}
                onChangeText={setCivilStatus}
                editable={false}
              ></TextInput>
            </View>
            {/* Nationality */}
            <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
              <Text className="text-xs font-semibold">Nationality</Text>
              <TextInput
                className="text-xs font-normal max-w-[50%] text-right"
                placeholder="your nationality"
                numberOfLines={1}
                value={nationality}
                onChangeText={setNationality}
                editable={false}
              ></TextInput>
            </View>
          </View>
          {/* Contact Information */}
          <View className="w-full py-4">
            {/* Title */}
            <View className="w-full flex items-start justify-center pb-4">
              <Text className="text-sm font-semibold">Contact Information</Text>
              <Text className="text-xs font-normal text-black/50">
                phone number, address etc.
              </Text>
            </View>
            {/* House Number */}
            <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
              <Text className="text-xs font-semibold">House Number</Text>
              <TextInput
                className="text-xs font-normal max-w-[50%] text-right"
                placeholder="enter house number"
                numberOfLines={1}
                value={houseNumber}
                onChangeText={setHouseNumber}
                editable={false}
              ></TextInput>
            </View>
            {/* Street */}
            <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
              <Text className="text-xs font-semibold">Street</Text>
              <TextInput
                className="text-xs font-normal max-w-[50%] text-right"
                placeholder="house street"
                numberOfLines={1}
                value={street}
                onChangeText={setStreet}
                editable={false}
              ></TextInput>
            </View>
            {/* Barangay */}
            <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
              <Text className="text-xs font-semibold">Barangay</Text>
              <TextInput
                className="text-xs font-normal max-w-[50%] text-right"
                placeholder="brgy no."
                numberOfLines={1}
                value={brgy}
                onChangeText={setBrgy}
                editable={false}
              ></TextInput>
            </View>
            {/* City */}
            <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
              <Text className="text-xs font-semibold">City</Text>
              <TextInput
                className="text-xs font-normal max-w-[50%] text-right"
                placeholder="city/municipality"
                numberOfLines={1}
                value={city}
                onChangeText={setCity}
                editable={false}
              ></TextInput>
            </View>
            {/* Phone Number */}
            <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
              <Text className="text-xs font-semibold">Phone Number</Text>
              <TextInput
                className="text-xs font-normal max-w-[50%] text-right"
                placeholder="contact number"
                numberOfLines={1}
                value={number}
                onChangeText={setNumber}
                editable={false}
              ></TextInput>
            </View>
          </View>
          {/* Economic Info */}
          <View className="w-full py-4">
            {/* Title */}
            <View className="w-full flex items-start justify-center pb-4">
              <Text className="text-sm font-semibold">
                Economic Information
              </Text>
              <Text className="text-xs font-normal text-black/50">
                employment status & occupation
              </Text>
            </View>
            {/* Employment Status */}
            <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
              <Text className="text-xs font-semibold">Employment Status</Text>
              <TextInput
                className="text-xs font-normal max-w-[50%] text-right"
                placeholder="status"
                numberOfLines={1}
                value={employmentStatus}
                onChangeText={setEmploymentStatus}
                editable={false}
              ></TextInput>
            </View>
            <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
              <Text className="text-xs font-semibold">Occupation</Text>
              <TextInput
                className="text-xs font-normal max-w-[50%] text-right"
                placeholder="work"
                numberOfLines={1}
                value={occupation}
                onChangeText={setOccupation}
                editable={false}
              ></TextInput>
            </View>
          </View>
          {/* Credentials */}
          <View className="w-full py-4">
            {/* Title */}
            <View className="w-full flex items-start justify-center pb-4">
              <Text className="text-sm font-semibold">Credentials</Text>
              <Text className="text-xs font-normal text-black/50">
                email, password & role
              </Text>
            </View>
            {/* First Name */}
            <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
              <Text className="text-xs font-semibold">Email</Text>
              <TextInput
                className="text-xs font-normal max-w-[50%] text-right"
                placeholder="@example.com"
                numberOfLines={1}
                value={email}
                onChangeText={setEmail}
                editable={false}
              ></TextInput>
            </View>
            <View className="w-full flex flex-row items-center justify-between px-6 py-3 bg-[#E6E6E6] rounded-xl mb-2">
              <Text className="text-xs font-semibold">Role</Text>
              <TextInput
                className="text-xs font-normal max-w-[50%]"
                placeholder="user"
                numberOfLines={1}
                value={level}
                editable={false}
                onChangeText={setLevel}
              ></TextInput>
            </View>
          </View>
        </View>
        <View className="w-full pb-24"></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewModal;
