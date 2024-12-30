import { RouteProp } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { RootStackParamList } from './types/RootStackParamList';
import Message from './types/Message';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

type PhongHocProps = {
  route: RouteProp<RootStackParamList, 'PhongHoc'>;
};

export default function PhongHoc({ route }: PhongHocProps) {
  const { roomId, roomName, ownerId } = route.params || {};
  const currentUserId = firebase.auth().currentUser?.uid || ''; // ID người dùng hiện tại
  const isOwner = currentUserId === ownerId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      const snapshot = await firebase.firestore().collection('rooms').doc(roomId).collection('messages').orderBy('timestamp').get();
      const fetchedMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
      setMessages(fetchedMessages);
    };
    fetchMessages();
  }, [roomId]);

  const handleSend = async () => {
    if (message.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      senderId: currentUserId,
      timestamp: new Date(),
    };

    await firebase.firestore().collection('rooms').doc(roomId).collection('messages').add(newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!isOwner) {
      Alert.alert('Lỗi', 'Chỉ trưởng phòng có quyền xóa tin nhắn!');
      return;
    }

    await firebase.firestore().collection('rooms').doc(roomId).collection('messages').doc(messageId).delete();
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={styles.messageItem}>
      <Text style={styles.messageText}>{item.content}</Text>
      {isOwner && (
        <TouchableOpacity onPress={() => handleDeleteMessage(item.id)}>
          <Text style={styles.sendButton}>Xóa</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.roomTitle}>{roomName}</Text>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        style={styles.messageList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  roomTitle: { fontSize: 20, fontWeight: 'bold' },
  iconContainer: { flexDirection: 'row', gap: 10 },
  icon: { fontSize: 20, marginHorizontal: 10 },
  messageList: { flex: 1 },
  messageItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  messageText: { fontSize: 16 },
  inputContainer: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  sendButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 10, marginLeft: 10 },
  sendButtonText: { color: '#fff' },
});