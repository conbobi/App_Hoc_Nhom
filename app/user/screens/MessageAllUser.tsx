import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Image } from "react-native";
import UserData from "./types/UserData";
import { RootStackParamList } from "./types/RootStackParamList";
const Tab = createMaterialTopTabNavigator();

// Định nghĩa kiểu dữ liệu
interface FriendRequest {
  id: string;
  SenderID: string;
  RecipterID: string;
}


const MessageAllUserData = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const [friends, setFriends] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  
  useEffect(() => {
    const fetchCurrentUserData = async () => {
      const UserData = firebase.auth().currentUser;
      if (UserData) {
        const UserDataDoc = await firebase.firestore().collection("users").doc(UserData.uid).get();
        if (UserDataDoc.exists) {
          setCurrentUserData({ id: UserData.uid, ...UserDataDoc.data() } as UserData);
        }
        else if (UserDataDoc.exists && UserDataDoc.data()) {
          setCurrentUserData({ id: UserData.uid, ...UserDataDoc.data() } as UserData);
        }
      }
    };
    fetchCurrentUserData();
  }, []);

  useEffect(() => {
    if (!currentUserData) return;

    const fetchFriends = firebase.firestore().collection("ListFriend").doc(currentUserData.id).onSnapshot((doc) => {
      if (doc.exists) {
        setFriends(doc.data()?.Friends || []);
      }
    });

    const fetchFriendRequests = firebase
      .firestore()
      .collection("MakeFriend")
      .where("RecipterID", "==", currentUserData.id)
      .onSnapshot((snapshot) => {
        setFriendRequests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as FriendRequest)));
      });

    return () => {
      fetchFriends();
      fetchFriendRequests();
    };
  }, [currentUserData]);

  const searchUserDataByEmail = async () => {
    const snapshot = await firebase.firestore().collection("users").where("email", "==", searchText).get();
    
    const results: UserData[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        avatarUri: data.avatarUri || "",
        fullName: data.fullName || "", 
        email: data.email || "",
        password: data.password || "",
        role: data.role || ""
      } as UserData;
    });
  
    setSearchResults(results);
  };
  
  const searchUserDataByFullName = async () => {
    const snapshot = await firebase.firestore().collection("users").get();
    
    const UserDatas: UserData[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        fullName: data.fullName || "", 
        email: data.email || "",
        password: data.password || "",
        role: data.role || ""
      } as UserData;
    });
  
    const filteredUserDatas = UserDatas.filter(UserData => 
      (UserData.fullName ?? "").toLowerCase().includes(searchText.toLowerCase())
    );
  
    setSearchResults(filteredUserDatas);
  };
  const AcceptFriend = async (request: FriendRequest) => {
    try {
      const senderID = request.SenderID;
      const recipterID = request.RecipterID;

      const recipientRef = firebase.firestore().collection("ListFriend").doc(recipterID);
      await recipientRef.set({ Friends: firebase.firestore.FieldValue.arrayUnion(senderID) }, { merge: true });

      const senderRef = firebase.firestore().collection("ListFriend").doc(senderID);
      await senderRef.set({ Friends: firebase.firestore.FieldValue.arrayUnion(recipterID) }, { merge: true });

      await firebase.firestore().collection("MakeFriend").doc(request.id).delete();

      Alert.alert("Thành công", "Bạn đã kết bạn thành công!");
    } catch (error) {
      console.error("Lỗi khi chấp nhận kết bạn:", error);
    }
  };
  const goToUserProfile = (userId: string) => {
    navigation.navigate("UserOther", { userId });
  };
  return (
    <Tab.Navigator>
      <Tab.Screen name="Bạn bè">
        {() => (
          <View style={styles.container}>
          <TextInput 
            style={styles.searchInput} 
            placeholder="Tìm kiếm bạn bè theo tên..." 
            value={searchText} 
            onChangeText={setSearchText} 
          />
          <TouchableOpacity style={styles.searchButton} onPress={searchUserDataByFullName}>
            <Text style={styles.buttonText}>Tìm kiếm</Text>
          </TouchableOpacity>
          // Trong FlatList, thay vì chỉ hiển thị tên, thêm TouchableOpacity để mở hồ sơ
<FlatList
  data={searchResults}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => goToUserProfile(item.id)}>
      <View style={styles.friendItem}>
        <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
        <Text>{item.fullName}</Text>
      </View>
    </TouchableOpacity>
  )}
/>
        </View>
        )}
      </Tab.Screen>
      <Tab.Screen name="Tìm kiếm">
        {() => (
          <View style={styles.container}>
            <TextInput style={styles.searchInput} placeholder="Nhập email người dùng" value={searchText} onChangeText={setSearchText} />
            <TouchableOpacity onPress={searchUserDataByEmail}>
              <Text>Tìm</Text>
            </TouchableOpacity>
            <FlatList
  data={searchResults}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => goToUserProfile(item.id)}>
      <View style={styles.friendItem}>
        <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
        <Text>{item.fullName}</Text>
      </View>
    </TouchableOpacity>
  )}
/>
          </View>
        )}
      </Tab.Screen>
      <Tab.Screen name="Lời mời kết bạn">
        {() => (
          <View style={styles.container}>
            <FlatList
              data={friendRequests}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.requestItem}>
                  <Text>{item.SenderID}</Text>
                  <TouchableOpacity onPress={() => AcceptFriend(item)}>
                    <Text>Đồng ý</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({

  requestItem: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  searchInput: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 },
  searchButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  UserDataItem: { flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1, borderColor: "#ddd" },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  UserDataName: { fontSize: 16, fontWeight: "bold" },
  friendItem: { flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1, borderColor: "#ddd" },
});

export default MessageAllUserData;

