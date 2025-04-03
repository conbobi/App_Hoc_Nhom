import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity } from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "./types/RootStackParamList";
import Message from "./types/Message";
import UserData from "./types/UserData";

type ChatScreenRouteProp = RouteProp<RootStackParamList, "ChatScreen">;

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const senderData: UserData = route.params?.senderData as UserData;
  const receiverId: string = route.params?.receiverId as string;  
  if (!senderData || !receiverId) {
    console.error("Dữ liệu truyền vào ChatScreen không hợp lệ!");
    return null; // Hoặc hiển thị loading/error
  }
  const [receiverData, setReceiverData] = useState<UserData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    // Lấy thông tin user nhận tin nhắn
    const fetchReceiverData = async () => {
      const doc = await firebase.firestore().collection("users").doc(receiverId).get();
      if (doc.exists) setReceiverData(doc.data() as UserData);
      if (doc.exists && doc.data()) {
        setReceiverData(doc.data() as UserData);
      } else {
        console.error("Không tìm thấy dữ liệu của người nhận!");
      }
    };

    fetchReceiverData();
  }, [receiverId]);

  useEffect(() => {
    if (!receiverData) return;

    const chatQuery = firebase
      .firestore()
      .collection("messages")
      .where("senderId", "in", [senderData.id, receiverId])
      .where("receiverId", "in", [senderData.id, receiverId])
      .orderBy("timestamp", "asc");

    const unsubscribe = chatQuery.onSnapshot((snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    });

    return unsubscribe;
  }, [receiverData]);

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    await firebase.firestore().collection("messages").add({
      content: messageText,
      senderId: senderData.id,
      senderName: senderData.fullName,
      senderAvatar: senderData.avatarUri,
      receiverId: receiverId,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setMessageText("");
  };

  return (
    <View>
      <Text>Chat với {receiverData?.fullName}</Text>
      <FlatList data={messages} keyExtractor={(item) => item.id} renderItem={({ item }) => <Text>{item.content}</Text>} />
      <TextInput value={messageText} onChangeText={setMessageText} placeholder="Nhập tin nhắn..." />
      <TouchableOpacity onPress={sendMessage}><Text>Gửi</Text></TouchableOpacity>
    </View>
  );
};

export default ChatScreen;
