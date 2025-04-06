import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
// @ts-ignore
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "./types/RootStackParamList";
import Message from "./types/Message";
import UserData from "./types/UserData";

// Định nghĩa kiểu route
type ChatScreenRouteProp = RouteProp<RootStackParamList, "ChatScreen">;

const ChatScreen = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const senderData = route.params?.senderId as string;
  const { senderId, receiverId } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    if (!senderId || !receiverId) return;

    const chatQuery = firebase
      .firestore()
      .collection("messages")
      .where("participants", "array-contains", senderId)
      .orderBy("timestamp", "asc");

    const unsubscribe = chatQuery.onSnapshot((snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    });

    return unsubscribe;
  }, [senderId, receiverId]);

  const sendMessage = async () => {
    if (!messageText.trim() || !senderId || !receiverId) return;

    await firebase.firestore().collection("messages").add({
      content: messageText,
      senderId: senderId,
      receiverId: receiverId,
      participants: [senderId, receiverId],
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setMessageText("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={item.senderId === senderId ? styles.sentMessage : styles.receivedMessage}>
            {item.content}
          </Text>
        )}
      />
      <TextInput
        value={messageText}
        onChangeText={setMessageText}
        placeholder="Nhập tin nhắn..."
        style={styles.input}
      />
      <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
        <Text style={styles.sendButtonText}>Gửi</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 16,
  },
  sendButton: {
    backgroundColor: "#4caf50",
    padding: 8,
    borderRadius: 4,
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: "white",
  },
  sentMessage: {
    backgroundColor: "#eeeeee",
    padding: 16,
    borderRadius: 16,
    maxWidth: "75%",
    marginBottom: 8,
    marginLeft: 8,
  },
  receivedMessage: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    maxWidth: "75%",
    marginBottom: 8,
    marginLeft: "auto",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    maxWidth: "75%",
    marginLeft: 8,
  },
  });