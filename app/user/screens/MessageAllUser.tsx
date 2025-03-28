import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { RootStackParamList } from "./types/RootStackParamList";
import UserData from "./types/UserData";

type MessageAllUserRouteProp = RouteProp<RootStackParamList, "MessageAllUser">;

const MessageAllUser = () => {
  const navigation = useNavigation();
  const route = useRoute<MessageAllUserRouteProp>();

  const currentUser = route.params?.currentUser; // User hiện tại đang đăng nhập
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (!currentUser) {
      console.error("Không có user hiện tại!");
      return;
    }

    const fetchUsers = firebase.firestore().collection("users").onSnapshot(snapshot => {
      const usersData: UserData[] = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as UserData))
        .filter(user => user.id !== currentUser.id); // Lọc bỏ user đang đăng nhập

      setUsers(usersData);
    });

    return () => fetchUsers(); // Unsubscribe khi component bị unmount
  }, [currentUser]);

  const navigateToChat = (receiverId: string) => {
    if (!currentUser) return;
    navigation.navigate("ChatScreen", { senderData: currentUser as UserData, receiverId: receiverId as string });
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm người dùng..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userItem} onPress={() => navigateToChat(item.id)}>
            <Image source={{ uri: item.avatarUri || "https://default-avatar.com" }} style={styles.avatar} />
            <Text>{item.fullName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  searchInput: { height: 40, borderBottomWidth: 1, marginBottom: 10 },
  userItem: { flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
});

export default MessageAllUser;
