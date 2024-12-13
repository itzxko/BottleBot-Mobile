import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView } from "react-native";

const Loader = () => {
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    const animationDuration = 2000; // 3 seconds
    const updateInterval = 20; // Update every 30 ms

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 * updateInterval) / animationDuration;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView className="absolute top-0 left-0 bottom-0 right-0 z-20 bg-[#050301]/50 flex items-center justify-center">
      {/* Moving Rectangle */}
      <View
        className="absolute top-0 left-0 h-full bg-[#050301]/50"
        style={{ width: `${progress}%` }} // Width synced directly with progress
      >
        {/* Percentage Text Positioned at Rightmost Edge with Padding */}
        <View
          className="absolute right-0 h-full flex items-center justify-center"
          style={{ paddingRight: 20 }} // 20px padding from the right edge
        >
          <Text
            className="text-white text-xl font-normal"
            numberOfLines={1} // Prevent text wrapping
            ellipsizeMode="tail" // Truncate text at the end
          >
            {Math.round(progress)}%
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Loader;
