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
} from "react-native";
import { RootStackParamList } from "../types/RootStackParamList";
import Message from "../types/Message";
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
  const navigation = useNavigation(); // Sử dụng navigation
  const currentUserId = firebase.auth().currentUser?.uid || "";
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("rooms")
      .doc(roomId)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) => {
        setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Message[]);
      });

    return () => unsubscribe();
  }, [roomId]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const user = firebase.auth().currentUser;
    const userDoc = await firebase.firestore().collection("users").doc(user?.uid).get();
    const userData = userDoc.data();

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      senderId: currentUserId,
      senderName: userData?.fullName || "Unknown",
      senderAvatar: userData?.avatarUri || "",
      timestamp: firebase.firestore.Timestamp.now(),
    };

    await firebase.firestore().collection("rooms").doc(roomId).collection("messages").add(newMessage);
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
              <TouchableOpacity onPress={() => Linking.openURL(item.file)}>
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
