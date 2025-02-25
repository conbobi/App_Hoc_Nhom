import React from "react";
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../screens/types/RootStackParamList"; // Cập nhật đúng đường dẫn tới RootStackParamList


type ChiTietPhongScreenNavigationProp = StackNavigationProp<RootStackParamList, "ChiTietPhong">;
type ChiTietPhongScreenRouteProp = RouteProp<RootStackParamList, "ChiTietPhong">;
const ChiTietPhong = () => {
  const navigation = useNavigation<ChiTietPhongScreenNavigationProp>();
  const route = useRoute<ChiTietPhongScreenRouteProp>(); // Lấy dữ liệu từ navigation
  const { roomId, roomName, ownerId } = route.params; 
  const danhSachNhom = [
    { id: "1", ten: "Nhóm 1", soLuong: 5 },
    { id: "2", ten: "Nhóm 2", soLuong: 8 },
    { id: "3", ten: "Nhóm 3", soLuong: 3 },
  ];

  const danhSachFiles = [
    { id: "1", ten: "Tài liệu 1.pdf" },
    { id: "2", ten: "Slide bài giảng.pptx" },
  ];

  const danhSachAnh = [
    { id: "1", url: "https://via.placeholder.com/150" },
    { id: "2", url: "https://via.placeholder.com/150" },
  ];

  return (
    <View style={styles.container}>
      {/* Tên phòng và ảnh */}
      <Text style={styles.title}>Tên Phòng: Phòng Học 101</Text>
      <Image source={{ uri: "https://via.placeholder.com/300" }} style={styles.roomImage} />

      {/* Danh sách nhóm */}
      <Text style={styles.sectionTitle}>Danh Sách Nhóm</Text>
      <FlatList
        data={danhSachNhom}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.groupItem}>
            <Text>{item.ten} - {item.soLuong} người</Text>
          </View>
        )}
      />

      {/* Danh sách file đã gửi */}
      <Text style={styles.sectionTitle}>Tệp Đã Gửi</Text>
      <FlatList
        data={danhSachFiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.fileItem}>
            <Text>{item.ten}</Text>
          </View>
        )}
      />

      {/* Danh sách ảnh đã gửi */}
      <Text style={styles.sectionTitle}>Ảnh Đã Gửi</Text>
      <FlatList
        horizontal
        data={danhSachAnh}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.url }} style={styles.image} />
        )}
      />

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
