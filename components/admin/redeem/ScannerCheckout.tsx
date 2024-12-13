import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import {
  BarcodeScanningResult,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { StatusBar } from "expo-status-bar";
import RemixIcon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "@/components/loader";
import Modal from "@/components/modal";
import { useUrl } from "@/context/UrlProvider";
import axios from "axios";

interface Item {
  _id: string;
  name: string;
  category: string;
  image: string;
  pointsRequired: number;
  rewardName: string;
  stocks: number;
}

const ScannerCheckout = ({
  onClose,
  reward,
}: {
  onClose: () => void;
  reward: Item | null;
}) => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const { ipAddress, port } = useUrl();

  //pointsAccumulation
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [scannedIds, setScannedIds] = useState<Set<string>>(new Set());

  interface data {
    did: string;
    uid: string;
    bc: number;
    pa: number;
    d: Date;
  }

  const handleScan = ({ data }: BarcodeScanningResult) => {
    setLoading(true);
    setScanned(true);

    try {
      const parsedData = JSON.parse(data);

      if (scannedIds.has(parsedData.did)) {
        setVisibleModal(true);
        setIsError(true);
        setMessage("Receipt has already been scanned");
        return;
      }

      if (parsedData.uid) {
        setVisibleModal(true);
        setMessage("User ID Detected! This is for non-mobile users only");
        setIsError(true);
      } else if (!parsedData.uid) {
        const points = Number(parsedData.pa);
        setTotalPoints((prevTotal) => prevTotal + points);
        setScannedIds((prevDids) => new Set(prevDids).add(parsedData.did));
        setVisibleModal(true);
        setIsError(true);
        setMessage("QR Receipt scanned successfully");
      }
    } catch (error: any) {
      setVisibleModal(true);
      setIsError(true);
      setMessage("Invalid QR Code");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (reward) {
      try {
        if (totalPoints >= reward?.pointsRequired) {
          let url = `http://${ipAddress}:${port}/api/history/claim`;

          let response = await axios.post(url, {
            rewardId: reward?._id,
          });

          if (response.data.success === true) {
            setVisibleModal(true);
            setIsError(false);
            setMessage(response.data.message);
          }
        } else {
          setIsError(true);
          setVisibleModal(true);
          setMessage("Insufficient Points");
        }
      } catch (error: any) {
        setVisibleModal(true);
        setMessage(error.response.data.message);
        setIsError(true);
      }
    }
  };

  if (!permission?.granted) {
    return (
      <>
        <View className="w-full flex absolute top-0 left-0 bottom-0 right-0 bg-[#050301]/50 items-center justify-center">
          <View className="flex items-center justify-center p-4 rounded-xl bg-[#FAFAFA] space-y-6 max-w-[60%]">
            <View className="w-full flex flex-row items-center justify-end">
              <Pressable onPress={onClose}>
                <RemixIcon name="close-line" size={16} />
              </Pressable>
            </View>
            <View className="w-full flex flex-col items-center justify-center space-y-2">
              <Text className="text-sm font-semibold">Allow Access</Text>
              <Text className="text-xs font-normal text-center">
                Please allow camera access to continue
              </Text>
            </View>
            <Pressable
              className="rounded-md bg-[#050301] min-w-full py-3 flex items-center justify-center"
              onPress={requestPermission}
            >
              <Text className="text-xs font-semibold text-white ">
                Allow Camera
              </Text>
            </Pressable>
          </View>
        </View>
        <StatusBar style="auto" />
      </>
    );
  }

  return (
    <>
      <View className="flex-1 absolute top-0 left-0 bottom-0 right-0 bg-[#F0F0F0]">
        <CameraView
          className="flex-1"
          facing={facing}
          onBarcodeScanned={scanned ? undefined : handleScan}
        >
          <SafeAreaView className="relative flex-1 bg-transparent p-4 items-center">
            <View className=" w-full flex flex-col items-center justify-center">
              <View className="w-full flex flex-row justify-between items-center">
                <Pressable
                  className="p-2 rounded-full bg-white"
                  onPress={onClose}
                >
                  <RemixIcon name="arrow-left-s-line" size={18} />
                </Pressable>
                <Text className="text-xs font-normal text-white">
                  Points: {totalPoints}
                </Text>
              </View>
            </View>

            {totalPoints > 0 ? (
              <Pressable
                className="absolute top-[90%]"
                onPress={handleCheckout}
              >
                <View className="px-6 py-3 rounded-full bg-[#F0F0F0] flex flex-row items-center justify-center space-x-2">
                  <Text className="text-xs font-semibold">Proceed</Text>
                  <RemixIcon name="arrow-right-down-line" size={16} />
                </View>
              </Pressable>
            ) : null}
          </SafeAreaView>
        </CameraView>
        <StatusBar style="auto" />
      </View>
      <StatusBar style="auto" />
      {loading && <Loader />}
      {visibleModal && (
        <Modal
          icon="redeem"
          header="Redeem"
          isVisible={visibleModal}
          message={message}
          onClose={() => {
            setVisibleModal(false);
            setScanned(false);
            if (!isError) {
              onClose();
            }
          }}
        />
      )}
    </>
  );
};

export default ScannerCheckout;
