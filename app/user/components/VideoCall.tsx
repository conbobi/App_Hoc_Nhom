import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Audio } from "expo-av";
import { Camera } from "expo-camera";
import { WebView } from "react-native-webview";

const VideoCall = () => {
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: microphoneStatus } = await Audio.requestPermissionsAsync();

      if (cameraStatus === "granted" && microphoneStatus === "granted") {
        setHasPermissions(true);
      } else {
        alert("Camera and microphone permissions are required for video calls.");
      }
    };

    requestPermissions();
  }, []);

  const injectJavaScript = `
    (async function() {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        console.log('Camera and microphone access granted');
      } catch (error) {
        console.error('Error accessing camera and microphone:', error);
      }
    })();
    true;
  `;

  return (
    <View style={styles.container}>
      {hasPermissions ? (
        <WebView
          source={{ uri: "https://tienzed2003.daily.co/TMpRSyWHrFSrOPKo8mgf" }}
          style={styles.videoCall}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          injectedJavaScript={injectJavaScript}
        />
      ) : (
        <Text>Đang yêu cầu quyền truy cập camera & microphone...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoCall: {
    width: "100%",
    height: "100%",
  },
});

export default VideoCall;
