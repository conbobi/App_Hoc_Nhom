import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import { Camera } from "expo-camera";
import QRCode from "react-native-qrcode-svg";
import * as Clipboard from "expo-clipboard";
import { Linking } from "react-native";
// @ts-ignore
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";

const VideoCall = () => {
  const navigation = useNavigation(); // Lấy đối tượng navigation
  const [hasPermissions, setHasPermissions] = useState(false);
  const [roomLink, setRoomLink] = useState("");
  const [inputLink, setInputLink] = useState("");

  useEffect(() => {
    const requestPermissions = async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: microphoneStatus } = await Audio.requestPermissionsAsync();
      
      if (cameraStatus === "granted" && microphoneStatus === "granted") {
        setHasPermissions(true);
      } else {
        Alert.alert("Lỗi", "Cần quyền truy cập camera & micro để gọi video!");
      }
    };

    requestPermissions();
  }, []);

  const createRoom = async () => {
    try {
      const response = await fetch("https://api.daily.co/v1/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer e777991d01e389a2d21012a5ce9209e74d659b9990e3a7f0f1b9ed92da280adf"
        },
        body: JSON.stringify({
          properties: {
            enable_chat: true,
            enable_knocking: true,
            exp: Math.floor(Date.now() / 1000) + 3600,
          },
        }),
      });

      const data = await response.json();
      if (data?.url) {
        setRoomLink(data.url);
        Alert.alert("Phòng mới", `Đã tạo phòng: ${data.url}`);
      } else {
        Alert.alert("Lỗi", "Không thể tạo phòng video call.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo phòng:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi tạo phòng.");
    }
  };

  const joinRoom = () => {
    if (inputLink.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng nhập link phòng video call!");
      return;
    }
    setRoomLink(inputLink.trim());
  };

  const copyToClipboard = () => {
    Clipboard.setStringAsync(roomLink);
    Alert.alert("Đã sao chép", "Link phòng đã được sao chép vào clipboard!");
  };

  const openInBrowser = () => {
    if (roomLink) {
      Linking.openURL(roomLink);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Quay lại</Text>
      </TouchableOpacity>

      {hasPermissions ? (
        <>
          <Text style={styles.label}>Nhập link phòng hoặc tạo phòng mới:</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập link Daily.co..."
            value={inputLink}
            onChangeText={setInputLink}
          />
          <View style={styles.buttonContainer}>
            <Button title="Tham gia phòng" onPress={joinRoom} />
            <Button title="Tạo phòng mới" onPress={createRoom} color="green" />
          </View>

          {roomLink !== "" && (
            <View style={styles.qrContainer}>
              <QRCode value={roomLink} size={150} />
              <Text style={styles.roomLink}>{roomLink}</Text>
              <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                <Text style={styles.copyText}>Sao chép link</Text>
              </TouchableOpacity>
              <Button title="Mở trong trình duyệt" onPress={openInBrowser} color="blue" />
            </View>
          )}
        </>
      ) : (
        <Text>Đang yêu cầu quyền truy cập camera & microphone...</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    fontSize: 18,
    color: "blue",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  qrContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  roomLink: {
    fontSize: 14,
    color: "blue",
    marginVertical: 10,
    textAlign: "center",
  },
  copyButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  copyText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default VideoCall;
