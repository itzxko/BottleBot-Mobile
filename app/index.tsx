import { View, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";

const Index = () => {
  const route = useRouter();

  const gotoLogin = () => {
    route.push("/login");
  };

  setTimeout(() => {
    gotoLogin();
  }, 1500);

  return (
    <View className="flex-1 items-center justify-center">
      <LottieView
        source={require("../assets/json/SplashScreen.json")}
        autoPlay
        loop
        style={{ width: 100, height: 100 }}
      />
    </View>
  );
};

export default Index;
