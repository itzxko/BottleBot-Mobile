import Modal from "@/components/modal";
import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from "expo-camera";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUrl } from "@/context/UrlProvider";
import axios from "axios";

export default function ScannerModal({ onClose }: { onClose: () => void }) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  //modals
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const { ipAddress, port, urlString } = useUrl();

  interface data {
    transactId: string;
    did: string;
    uid: string;
    bc: number;
    pa: number;
    d: Date;
  }

  const handleScan = async ({ data }: BarcodeScanningResult) => {
    setLoading(true);
    setScanned(true);

    try {
      const scannedData = JSON.parse(data);

      if (!scannedData.uid) {
        setVisibleModal(true);
        setMessage("History is for Mobile Users Only");
        setIsError(false);
      } else if (scannedData.uid) {
        if (scannedData.transactId) {
          updatePointsHistory(scannedData);
        } else if (!scannedData.transactId) {
          await addPointsHistory(scannedData);
        }
      }
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updatePointsHistory = async (data: data) => {
    try {
      let url = `${urlString}/api/history/dispose/${data.transactId}`;
      console.log(data.did);

      let response = await axios.put(url, {
        userId: data.uid,
        bottleCount: data.bc,
        pointsAccumulated: data.pa,
        dateDispose: data.d,
      });

      if (response.data.success === true) {
        setVisibleModal(true);
        setMessage(response.data.message);
        setIsError(false);
      }
    } catch (error: any) {
      setVisibleModal(true);
      setMessage(error.response.data.message);
      setIsError(true);
    }
  };

  const addPointsHistory = async (data: data) => {
    try {
      let url = `${urlString}/api/history/dispose`;

      let response = await axios.post(url, {
        userId: data.uid,
        bottleCount: data.bc,
        pointsAccumulated: data.pa,
        dateDisposed: data.d,
      });

      if (response.data.success === true) {
        setVisibleModal(true);
        setMessage(response.data.message);
        setIsError(false);
      }
    } catch (error: any) {
      setVisibleModal(true);
      setIsError(true);
      setMessage(error.response.data.message);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
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
          <SafeAreaView className=" flex-1 items-start justify-start bg-transparent p-4">
            <Pressable className="p-2 rounded-full bg-white" onPress={onClose}>
              <RemixIcon name="arrow-left-s-line" size={18} />
            </Pressable>
          </SafeAreaView>
        </CameraView>
        <StatusBar style="auto" />
      </View>
      {visibleModal && (
        <Modal
          message={message}
          onClose={() => {
            setVisibleModal(false);
            if (!isError) {
              onClose();
            }
          }}
          icon="history"
          header="History"
          isVisible={visibleModal}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
