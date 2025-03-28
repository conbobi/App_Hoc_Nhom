import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native"; // Import navigation
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Linking,
  Button,
} from "react-native";
import { RootStackParamList } from "../screens/types/RootStackParamList";
import Message from "../screens/types/Message";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import styles from "../styles/PhongHocStyles";
import UpFile from "../components/UpFile";

type PhongHocProps = {
  route: RouteProp<RootStackParamList, "PhongHoc">;
};

export default function PhongHoc({ route }: PhongHocProps) {
  const { roomId, roomName } = route.params || {};
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>(); // Sử dụng navigation
  const currentUserId = firebase.auth().currentUser?.uid || "";
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [Lst_files, setLst_files] = useState<string[]>([]);
  const [lst_images, setLst_images] = useState<string[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Message[]);
      }
      
    );

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    const images = messages.map((msg) => msg.image).filter(Boolean) as string[];
    const files = messages.map((msg) => msg.file).filter(Boolean) as string[];
    setLst_images(images);
    setLst_files(files);
  }, [messages]);
  
  console.log("tong so nguoi"+totalMembers);
  // tổng số thành viên
  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .collection("members") // Giả sử mỗi thành viên được lưu tại đây
      .onSnapshot((snapshot) => {
        setTotalMembers(snapshot.size); // Lấy tổng số thành viên
      });
  console.log(totalMembers);
    return () => unsubscribe();
  }, [roomId]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const user = firebase.auth().currentUser;
    const userDoc = await firebase.firestore().collection("users").doc(user?.uid).get();
    const UserData = userDoc.data();

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      senderId: currentUserId,
      senderName: UserData?.fullName || "Unknown",
      senderAvatar: UserData?.avatarUri || "",
      timestamp: firebase.firestore.Timestamp.now(),
    };

    await firebase.firestore().collection("rooms").doc(roomId).collection("messages").add(newMessage);
     // **Thêm thông báo mới vào Firestore**
  const notification = {
    id: firebase.firestore().collection("notifications").doc().id,
    type: "group",
    title: `Tin nhắn mới từ ${UserData?.fullName || "Unknown"}`,
    content: message,
    sender: { id: user?.uid, name: UserData?.fullName || "Unknown", avatar: UserData?.avatarUri || "" },
    state: "unread",
    timestamp: firebase.firestore.Timestamp.now(),
    roomId: roomId,
    roomName: roomName
  };

  await firebase.firestore().collection("notifications").doc(notification.id).set(notification);
    setMessage("");
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderId === currentUserId;
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
        ]}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.senderAvatar }} style={styles.avatar} />
        </View>
        <View style={styles.messageContent}>
          <View
            style={[
              styles.messageBubble,
              isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
            ]}
          >
            {item.image && <Image source={{ uri: item.image }} style={styles.messageImage} />}
            {item.file && (
              <TouchableOpacity onPress={() => Linking.openURL(item.file||"")}>
                <Text style={styles.fileLinkText}>📄 {decodeURIComponent(item.file.split("/").pop() || "Tập tin")}</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.messageText}>{item.content}</Text>
          </View>
          <Text style={styles.senderName}>{item.senderName}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Nút Call ở góc phải */}
      <TouchableOpacity style={styles.callButton} onPress={() => navigation.navigate("VideoCall" as never)}>
        <Text style={styles.callButtonText}>📞 Call</Text>
      </TouchableOpacity>
      <Button 
  title="Xem Chi Tiết Phòng" 
  onPress={() => navigation.navigate("ChiTietPhong", { roomId, roomName, ownerId: currentUserId, files: Lst_files, images: lst_images, TotalMembers: totalMembers })}
/>


      <Text style={styles.roomTitle}>{roomName}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <UpFile roomId={roomId} currentUserId={currentUserId} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Nhập tin nhắn..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>📩</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
