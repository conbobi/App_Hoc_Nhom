import { RouteProp } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { RootStackParamList } from './types/RootStackParamList';
import Message from './types/Message';
type PhongHocProps={
  route: RouteProp<RootStackParamList, 'PhongHoc'>;
};
export default function PhongHoc({ route }:PhongHocProps) {
  const { roomId, roomName } = route.params || {};
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() === '') return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), content: message }]);
    setMessage('');
  };

  const renderMessageItem = ({ item }:{item:Message}) => (
    <View style={styles.messageItem}>
      <Text style={styles.messageText}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.roomTitle}>{roomName}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity>
            <Text style={styles.icon}>📹</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.icon}>📄</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.icon}>📊</Text>
          </TouchableOpacity>
        </View>
      </View>
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
