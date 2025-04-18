import { View, Text } from "react-native";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as Location from "expo-location";
import { useUrl } from "./UrlProvider";
import axios from "axios";
import { over } from "lodash";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

const LocationContext = createContext<any>(null);

export const LocationProvider = ({ children }: any) => {
  const [config, setConfig] = useState();
  const [botLocation, setBotLocation] = useState(null);
  const { ipAddress, port, urlString } = useUrl();
  const [overflow, setOverflow] = useState(null);
  const [orientation, setOrientation] = useState(null);
  const [waterLevel, setWaterLevel] = useState(null);
  const [arrived, setArrived] = useState("");
  const [arrivedAt, setArrivedAt] = useState("");
  const [battery, setBattery] = useState(null);
  const [todayRain, setTodayRain] = useState("");
  const [rainyHours, setRainyHours] = useState<any[]>([]);
  const [date, setDate] = useState("");
  const [yourLocation, setYourLocation] = useState({
    latitude: 14.680105493791455,
    longitude: 121.00993905398246,
    latitudeDelta: 0.0005,
    longitudeDelta: 0.0005,
  });

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  async function sendPushNotification(
    expoPushToken: string,
    title: string,
    body: string
  ) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: title,
      body: body,
      data: { someData: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        handleRegistrationError(
          "Permission not granted to get push token for push notification!"
        );
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        handleRegistrationError("Project ID not found");
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;

        return pushTokenString;
      } catch (e: unknown) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError(
        "Must use physical device for push notifications"
      );
    }
  }

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const fetchAndFilterRainyHours = async () => {
    const apiKey = "PQSRXB9VVDCDL87R3T6ZHPE83";
    const city = "Caloocan";

    try {
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`;
      const response = await axios.get(url);

      // const todayDate = new Date().toISOString().split("T")[0];
      const todayDate = new Date().toISOString().split("T")[0];

      const todayForecast = response.data.days.find(
        (day: any) => day.datetime === todayDate
      );
      setTodayRain(todayForecast.precipprob);
      setDate(todayDate);

      if (todayForecast && todayForecast.hours) {
        const filteredRainyHours = todayForecast.hours.filter(
          (hour: any) => hour.precipprob > 30
        );
        setRainyHours(filteredRainyHours);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAndFilterRainyHours();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const currentHour = new Date().getHours();
      const formattedTime = `${currentHour.toString().padStart(2, "0")}:00:00`;

      if (rainyHours.length > 0) {
        const matchTime = (time: string) => {
          return rainyHours.some((hour) => hour.datetime === time);
        };

        const isRainy = matchTime(formattedTime);

        console.log(
          isRainy ? "It's rainy during this time." : "No rain during this time."
        );

        if (isRainy) {
          try {
            let url = `https://bottlebot.onrender.com/api/queue`;

            let response = await axios.post(url, {
              returnToDefault: "true",
            });

            if (response.data.success === true) {
              console.log(response.data);
              const token = await registerForPushNotificationsAsync();
              if (token) {
                await sendPushNotification(
                  token,
                  "BottleBot",
                  "Rainfall Detected, Returning to Default Location!"
                );
              }
            }
          } catch (error: any) {
            console.log(error.response.data);
          }
        } else {
          console.log("Clear Weather");
        }
      }
    };
    getData();

    const intervalId = setInterval(getData, 600000);

    return () => clearInterval(intervalId);
  }, [rainyHours]);

  useEffect(() => {
    const overflowData = async () => {
      const user = await AsyncStorage.getItem("user");

      if (user) {
        const parsedUser = JSON.parse(user);

        if (parsedUser.credentials.level !== "citizen") {
          if (overflow !== null && overflow > 80) {
            const registerAndSendNotification = async () => {
              const token = await registerForPushNotificationsAsync();
              if (token) {
                await sendPushNotification(
                  token,
                  "BottleBot",
                  "Bot Capacity at Critical Level!"
                );
              }
            };

            registerAndSendNotification();
          }
        }
      }
    };

    overflowData();
  }, [overflow]);

  useEffect(() => {
    const waterLevelData = async () => {
      const user = await AsyncStorage.getItem("user");

      if (user) {
        const parsedUser = JSON.parse(user);

        if (parsedUser.credentials.level !== "citizen") {
          if (waterLevel) {
            if (waterLevel > 80) {
              const registerAndSendNotification = async () => {
                const token = await registerForPushNotificationsAsync();
                if (token) {
                  await sendPushNotification(
                    token,
                    "BottleBot",
                    "High Water Level Detected!"
                  );
                }
              };

              registerAndSendNotification();
            }
          }
        }
      }
    };

    waterLevelData();
  }, [waterLevel]);

  useEffect(() => {
    const orientationData = async () => {
      const user = await AsyncStorage.getItem("user");

      if (user) {
        const parsedUser = JSON.parse(user);

        if (parsedUser.credentials.level !== "citizen") {
          if (orientation) {
            if (orientation > 0) {
              const registerAndSendNotification = async () => {
                const token = await registerForPushNotificationsAsync();
                if (token) {
                  await sendPushNotification(
                    token,
                    "BottleBot",
                    "BottleBot is Tilted!"
                  );
                }
              };

              registerAndSendNotification();
            }
          }
        }
      }
    };

    orientationData();
  }, [orientation]);

  useEffect(() => {
    const batteryData = async () => {
      const user = await AsyncStorage.getItem("user");

      if (user) {
        const parsedUser = JSON.parse(user);

        if (parsedUser.credentials.level !== "citizen") {
          if (battery) {
            if (battery <= 30) {
              try {
                let url = `https://bottlebot.onrender.com/api/queue`;

                let response = await axios.post(url, {
                  returnToDefault: "true",
                });

                if (response.data.success === true) {
                  const token = await registerForPushNotificationsAsync();
                  if (token) {
                    await sendPushNotification(
                      token,
                      "BottleBot",
                      "Bot Power Running Low, Returning to Default Location"
                    );
                  }
                }
              } catch (error: any) {
                console.log(error.response.data);
              }
            }
          }
        }
      }
    };

    batteryData();
  }, [battery]);

  useEffect(() => {
    const getArrivalData = async () => {
      const user = await AsyncStorage.getItem("user");

      if (user) {
        const parsedUser = JSON.parse(user);

        if (arrived === "true" && parsedUser._id === arrivedAt) {
          const token = await registerForPushNotificationsAsync();
          if (token) {
            await sendPushNotification(
              token,
              "BottleBot",
              "BottleBot has Arrived!"
            );
          }
        }
      }
    };

    getArrivalData();
  }, [arrived, arrivedAt]);

  const botLocationWebSocket = () => {
    const socket = new WebSocket(`${urlString}/api/monitor`);

    socket.onopen = () => {
      console.log("BotLocation WebSocket connection opened");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    socket.onclose = () => {
      console.log("BotLocation WebSocket connection closed");
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);

      if (response.success && response.realTimeType === "botstate") {
        setBotLocation(response.data.adminBotLocation);
        setOverflow(response.data.overflowLevel);
        setOrientation(response.data.orientation);
        setWaterLevel(response.data.waterLevel);
        setArrived(response.data.arrived);
        setArrivedAt(response.data.arrivedAt);
        setBattery(response.data.batteryLevel);
        console.log(response.data);
      }
    };
  };

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      setYourLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0005,
        longitudeDelta: 0.0005,
      });
    } catch (error) {
      console.error("Error getting location:", error);
      alert("Unable to retrieve location. Please try again.");
    }
  };

  const getConfig = async () => {
    try {
      let url = `${urlString}/api/configurations`;

      let response = await axios.get(url);

      if (response.data.success === true) {
        setConfig(response.data.config);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const checkTime = async () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    if (hours === 17 && minutes === 0) {
      try {
        let url = `${urlString}/api/queue`;

        let response = await axios.post(url, {
          returnToDefault: "true",
        });

        if (response.data.success === true) {
          const token = await registerForPushNotificationsAsync();
          if (token) {
            await sendPushNotification(
              token,
              "BottleBot",
              "Returning to Default Location!"
            );
          }
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  const timeCheck = () => {
    useEffect(() => {
      const interval = setInterval(checkTime, 60000); // Check every minute

      return () => clearInterval(interval); // Cleanup on unmount
    }, []);
  };

  timeCheck();

  useEffect(() => {
    const initializeLocation = async () => {
      await botLocationWebSocket();
      await getConfig();
    };

    initializeLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        yourLocation,
        config,
        getConfig,
        getUserLocation,
        botLocationWebSocket,
        botLocation,
        battery,
        overflow,
        orientation,
        waterLevel,
        arrived,
        arrivedAt,
        fetchAndFilterRainyHours,
        todayRain,
        date,
        rainyHours,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
