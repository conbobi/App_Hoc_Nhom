import React, { useState } from "react";
import { View, TouchableOpacity, Text, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import styles from "../styles/PhongHocStyles";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dzysrtemd/image/upload";
const UPLOAD_PRESET = "vfk2qscm";
const SUPABASE_URL = "https://krelfrgskjrgbxwuobtb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyZWxmcmdza2pyZ2J4d3VvYnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1OTI4MDksImV4cCI6MjA1NTE2ODgwOX0.5HPrTckrMB3xPbezMx8_BeoW1-gJqV7dXzvOez6IS68";

type UpFileProps = {
  roomId: string;
  currentUserId: string;
};

const UpFile = ({ roomId, currentUserId }: UpFileProps) => {
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled && result.assets.length > 0) {
      uploadImage(result.assets[0].uri);
    }
  };
  const sanitizeFileName = (fileName: string): string => {
    return fileName.normalize("NFD") // Loại bỏ dấu tiếng Việt
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]/g, "_"); // Giữ lại ký tự hợp lệ
  };

  
  const uploadImage = async (imageUri: string) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("file", { uri: imageUri, type: "image/jpeg", name: "upload.jpg" } as any);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      let response = await fetch(CLOUDINARY_URL, { method: "POST", body: formData });
      let data = await response.json();
      setLoading(false);
      if (data.secure_url) {
        saveMessageToFirestore("Đã gửi một ảnh", data.secure_url, null);
      }
    } catch {
      setLoading(false);
      Alert.alert("Lỗi", "Tải ảnh lên thất bại!");
    }
  };
  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
  
    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      console.log("Selected file:", asset);
  
      uploadFile(asset.uri, sanitizeFileName(asset.name), asset.mimeType || "application/octet-stream");
    }
  };
  
  const uploadFile = async (fileUri: string, fileName: string, mimeType: string) => {
    setLoading(true);
  
    // Xử lý tên file để tránh lỗi ký tự đặc biệt
    const safeFileName = sanitizeFileName(fileName);
    const url = `${SUPABASE_URL}/storage/v1/object/File_Upload/${safeFileName}`;
  
    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": mimeType,
      "x-upsert": "true",  // Cho phép ghi đè nếu file đã tồn tại
      "Tus-Resumable": "1.0.0",  // Bắt buộc để Supabase nhận diện file upload
    };
  
    try {
      const response = await FileSystem.uploadAsync(url, fileUri, {
        httpMethod: "POST", // Đảm bảo dùng `POST`
        headers,
      });
  
      if (response.status === 200 || response.status === 201) {
        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/File_Upload/${safeFileName}`;
        console.log("File uploaded successfully:", publicUrl);
  
        saveMessageToFirestore("Đã gửi một tập tin", null, publicUrl);
      } else {
        console.log("Upload failed with status:", response.status, response.body);
        Alert.alert("Lỗi", "Tải file lên thất bại!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi tải file lên Supabase!");
    }
  
    setLoading(false);
  };
  

  const saveMessageToFirestore = async (content: string, imageUrl: string | null, fileUrl: string | null) => {
    const user = firebase.auth().currentUser;
    if (!user) return;

    const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();
    const UserData = userDoc.data();

    const newMessage = {
      id: Date.now().toString(),
      content,
      image: imageUrl,
      file: fileUrl,
      senderId: user.uid,
      senderName: UserData?.fullName || "Người dùng",
      senderAvatar: UserData?.avatarUri || "",
      timestamp: firebase.firestore.Timestamp.now(),
    };

    await firebase.firestore().collection("rooms").doc(roomId).collection("messages").add(newMessage);
    console.log("Message saved to Firestore:", newMessage);
  };

  return (
    <View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <TouchableOpacity style={styles.uploadButton} onPress={pickFile}>
        <Text style={styles.uploadButtonText}>📎 File</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>🖼 Ảnh</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UpFile;
