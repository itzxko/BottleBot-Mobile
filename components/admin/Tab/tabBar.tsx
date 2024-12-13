import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { blue } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import RemixIcon from "react-native-remix-icon";

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View className="absolute bottom-5 flex-row items-center justify-evenly mx-[50px] bg-white p-4 rounded-2xl shadow-xl shadow-black">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            className="flex-1 justify-center items-center gap-y-1"
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            key={route.name}
          >
            {isFocused ? (
              route.name === "dashboard" ? (
                <RemixIcon name="home-3-fill" size={20} color="#699900" />
              ) : route.name === "monitor" ? (
                <RemixIcon name="macbook-fill" size={20} color="#699900" />
              ) : route.name === "redeem" ? (
                <RemixIcon name="shopping-bag-fill" size={20} color="#699900" />
              ) : route.name === "history" ? (
                <RemixIcon
                  name="calendar-event-fill"
                  size={20}
                  color="#699900"
                />
              ) : route.name === "users" ? (
                <RemixIcon name="user-smile-fill" size={20} color="#699900" />
              ) : route.name === "profile" ? (
                <RemixIcon name="user-4-fill" size={20} color="#699900" />
              ) : null
            ) : route.name === "dashboard" ? (
              <RemixIcon name="home-3-line" size={20} color="#699900" />
            ) : route.name === "monitor" ? (
              <RemixIcon name="macbook-line" size={20} color="#699900" />
            ) : route.name === "redeem" ? (
              <RemixIcon name="shopping-bag-line" size={20} color="#699900" />
            ) : route.name === "history" ? (
              <RemixIcon name="calendar-event-line" size={20} color="#699900" />
            ) : route.name === "users" ? (
              <RemixIcon name="user-smile-line" size={20} color="#699900" />
            ) : route.name === "profile" ? (
              <RemixIcon name="user-4-line" size={20} color="#699900" />
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
