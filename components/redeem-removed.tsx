// import {
//   View,
//   Text,
//   ScrollView,
//   Pressable,
//   TouchableHighlight,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { LinearGradient } from "expo-linear-gradient";
// import {
//   MaterialIcons,
//   MaterialCommunityIcons,
//   Ionicons,
// } from "@expo/vector-icons";
// import { StatusBar } from "expo-status-bar";
// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import { Image } from "expo-image";
// import Modal from "../../components/modal";
// import { useAuth } from "@/context/AuthContext";
// import Loader from "@/components/loader";
// import { useRewards } from "@/context/RewardsProvider";
// import { useHistory } from "@/context/UserHistoryProvider";
// import { useUrl } from "@/context/UrlProvider";

// const Redeem = () => {
//   const [redeemables, setRedeemables] = useState<Item[]>([]);
//   const { user } = useAuth();
//   const [filter, setFilter] = useState("All");
//   const [visibleModal, setVisibleModal] = useState(false);
//   const [message, setMessage] = useState("");
//   const [totalPoints, setTotalPoints] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const { fetchRewards, rewards, categories, filterRewards } = useRewards();
//   const [filtered, setFiltered] = useState(false);
//   const { fetchRewardsHistory } = useHistory();
//   const { ipAddress, port } = useUrl();

//   interface Item {
//     _id: string;
//     name: string;
//     category: string;
//     image: string;
//     pointsRequired: number;
//     rewardName: string;
//     stocks: number;
//   }

//   interface user {
//     _id: string;
//     personalInfo: {
//       firstName: string;
//       lastName: string;
//     };
//   }

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       await fetchRewards();
//       setLoading(false);
//     };

//     fetchData();
//   }, []);

//   const redeemItem = async ({
//     itemId,
//     pointsSpent,
//     itemCategory,
//   }: {
//     itemId: string;
//     pointsSpent: number;
//     itemCategory: string;
//   }) => {
//     if (user) {
//       try {
//         const response = await axios.post(
//           `http://${ipAddress}:${port}/api/history/claim`,
//           {
//             userId: user._id,
//             rewardId: itemId,
//             pointsSpent: pointsSpent,
//           }
//         );

//         if (response.status === 200) {
//           setMessage(response.data.message);
//           fetchRewardsHistory(user);
//           await fetchRewards();
//           if (filtered) {
//             handleFilter(itemCategory);
//           }
//         } else {
//           setMessage(response.data.message);
//         }
//       } catch (error) {
//         console.log(error);

//         setMessage("An error occurred!");
//       }
//     }
//   };

//   useEffect(() => {
//     const fetchUserPoints = async () => {
//       if (user) {
//         try {
//           const response = await axios.get(
//             `http://${ipAddress}:${port}/api/history/claim/points/${user._id}`
//           );
//           setTotalPoints(response.data.availablePoints.availablePoints);
//         } catch (error) {
//           console.log(error);
//         }
//       } else {
//         console.log("not user");
//       }
//     };
//     fetchUserPoints();
//   }, [redeemItem]);

//   const handleFilter = async (category: string) => {
//     if (category === filter) {
//       setFilter("All");
//       setFiltered(false);
//       await filterRewards("All");
//     } else {
//       setFilter(category);
//       setFiltered(true);
//       await filterRewards(category);
//     }
//   };

//   return (
//     <>
//       <SafeAreaView className="flex-1 px-4 pt-2 bg-[#F0F0F0]">
//         <LinearGradient
//           colors={["#050301", "#757575"]}
//           start={{ x: 0, y: 1 }}
//           end={{ x: 1, y: 0 }}
//           className="w-full p-6 rounded-3xl flex items-center justify-center mb-1"
//         >
//           <View className="w-full flex flex-row items-center justify-start">
//             <View className="w-[50px] h-[50px] rounded-full bg-white overflow-hidden mr-2">
//               <Image
//                 source={require("../../assets/images/Man.jpg")}
//                 className="w-full h-full"
//               />
//             </View>
//             <View className="w-full flex items-start justify-center">
//               <Text
//                 className="text-sm font-semibold text-white pb-1"
//                 numberOfLines={1}
//               >
//                 {!user
//                   ? "Loading"
//                   : `${user.personalInfo.firstName} ${user.personalInfo.lastName}`}
//               </Text>
//               <View className="flex items-center justify-center px-2 py-1 bg-[#E1E1E1]/75 rounded-full">
//                 <Text
//                   className="text-[10px] font-normal text-black uppercase"
//                   numberOfLines={1}
//                 >
//                   {!user ? "Loading" : `#${user._id}`}
//                 </Text>
//               </View>
//             </View>
//           </View>
//           <View className="w-full flex flex-row items-end justify-end pt-12">
//             <View className="pr-1">
//               <MaterialCommunityIcons
//                 name="currency-rub"
//                 size={14}
//                 color="rgba(255, 255, 255, 0.5)"
//               />
//             </View>
//             <Text className="text-xs font-normal text-white/50 pr-2">
//               Redeemable Points
//             </Text>
//             <Text className="text-sm font-semibold text-white">
//               {totalPoints}
//             </Text>
//           </View>
//         </LinearGradient>

//         <View className="w-full flex flex-row py-1.5 mb-1">
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {categories.map((category: string) => (
//               <Pressable
//                 className="mr-2 rounded-xl"
//                 key={category}
//                 onPress={() => handleFilter(category)}
//               >
//                 <LinearGradient
//                   colors={
//                     filter !== category
//                       ? ["#E1E1E1", "#d9d9d9"]
//                       : ["#00674F", "#06402B"]
//                   }
//                   className="px-6 py-3 flex items-center justify-center rounded-full"
//                 >
//                   <Text
//                     className={
//                       filter === category
//                         ? "text-xs font-semibold text-white"
//                         : "text-xs font-normal text-black"
//                     }
//                   >
//                     {category}
//                   </Text>
//                 </LinearGradient>
//               </Pressable>
//             ))}
//           </ScrollView>
//         </View>

//         <ScrollView
//           className="flex-1 w-full"
//           showsVerticalScrollIndicator={false}
//         >
//           <View className="w-full flex items-start justify-start pb-2">
//             <Text className="text-xl font-semibold">Redeemable Items</Text>
//             <Text className="text-sm font-normal text-black/50">
//               Choose a Reward of your choice
//             </Text>
//           </View>
//           <View className="w-full flex flex-row flex-wrap items-center justify-between">
//             {rewards.map((item: Item) => (
//               <View
//                 className="w-[48%] h-[200px] overflow-hidden mb-4"
//                 key={item._id}
//               >
//                 <View className="w-full h-[70%] flex items-center justify-center bg-gray-400 rounded-3xl overflow-hidden">
//                   <Image
//                     className="w-full flex-1"
//                     source={{
//                       uri: `http://192.168.254.139:8080/api/images/${item.image}`,
//                     }}
//                   />
//                 </View>
//                 <View className="w-full px-1 py-3 flex flex-row items-center justify-between ">
//                   <View className="max-w-[60%]">
//                     <Text
//                       className="text-sm font-semibold text-black capitalize"
//                       numberOfLines={1}
//                     >
//                       {item.rewardName}
//                     </Text>
//                     <Text
//                       className="text-xs font-normal text-black"
//                       numberOfLines={1}
//                     >
//                       {item.pointsRequired} pt., {item.stocks} avail.
//                     </Text>
//                   </View>
//                   <TouchableHighlight
//                     className="flex items-center justify-center rounded-full"
//                     underlayColor={"#41917F"}
//                     onPress={() => {
//                       setVisibleModal(true);
//                       redeemItem({
//                         itemCategory: item.category,
//                         itemId: item._id,
//                         pointsSpent: item.pointsRequired,
//                       });
//                     }}
//                   >
//                     <LinearGradient
//                       colors={["#00674F", "#06402B"]}
//                       className="p-2 rounded-full shadow shadow-black"
//                     >
//                       <Ionicons
//                         name="return-down-forward"
//                         size={16}
//                         color="white"
//                       />
//                     </LinearGradient>
//                   </TouchableHighlight>
//                 </View>
//               </View>
//             ))}
//           </View>
//           <View className="w-full pb-24"></View>
//         </ScrollView>
//       </SafeAreaView>

//       <StatusBar style="auto" />
//       {loading && <Loader />}
//       {visibleModal && (
//         <Modal
//           header="Checkout"
//           message={message}
//           isVisible={visibleModal}
//           onClose={() => setVisibleModal(false)}
//           icon="redeem"
//         />
//       )}
//     </>
//   );
// };

// export default Redeem;
