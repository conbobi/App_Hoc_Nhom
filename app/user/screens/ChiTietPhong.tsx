import React from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../screens/types/RootStackParamList"; // Cập nhật đúng đường dẫn tới RootStackParamList


type ChiTietPhongScreenNavigationProp = StackNavigationProp<RootStackParamList, "ChiTietPhong">;
type ChiTietPhongScreenRouteProp = RouteProp<RootStackParamList, "ChiTietPhong">;
const ChiTietPhong = () => {
  const navigation = useNavigation<ChiTietPhongScreenNavigationProp>();
  const route = useRoute<ChiTietPhongScreenRouteProp>(); // Lấy dữ liệu từ navigation
  const { roomId, roomName, ownerId, files, images } = route.params; 

  return (
    <View style={styles.container}>
      {/* Tên phòng và ảnh */}
      <Text style={styles.title}>Tên Phòng: {roomName}</Text>
      <Image source={{ uri: "https://via.placeholder.com/300" }} style={styles.roomImage} />

      {/* Danh sách nhóm */}
      <Text style={styles.sectionTitle}>Danh Sách Nhóm</Text>
     
          <View style={styles.groupItem}>
           
          </View>


      {/* Danh sách file đã gửi */}
     {/* Danh sách file đã gửi */}
<Text style={styles.sectionTitle}>Tệp Đã Gửi</Text>
{files.length > 0 ? (
  files.map((file, index) => (
    <TouchableOpacity key={index} onPress={() => Linking.openURL(file)}>
      <Text style={styles.fileItem}>📄 {decodeURIComponent(file.split("/").pop() || "Tệp tin")}</Text>
    </TouchableOpacity>
  ))
) : (
  <Text>Không có tệp tin nào</Text>
)}


{/* Danh sách ảnh đã gửi */}
<Text style={styles.sectionTitle}>Ảnh Đã Gửi</Text>
{images && images.length > 0 ? (
  <FlatList
    data={images}
    keyExtractor={(item, index) => index.toString()}
    horizontal
    renderItem={({ item }) =>
      item ? (
        <Image source={{ uri: item }} style={styles.image} />
      ) : (
        <Text>Ảnh không hợp lệ</Text>
      )
    }
  />
) : (
  <Text>Không có hình ảnh nào</Text>
)}



      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  roomImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  groupItem: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginBottom: 5,
  },
  fileItem: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "blue",
    borderRadius: 5,
    alignItems: "center",
  },
  backText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChiTietPhong;
