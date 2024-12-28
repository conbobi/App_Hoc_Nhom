import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './types/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import Room from './types/Room';

type DanhSachPhongScreenNavigationProp = StackNavigationProp<RootStackParamList,'DanhSachPhong'>;
export default function DanhSachPhong() {
  const navigation = useNavigation<DanhSachPhongScreenNavigationProp>();
  const [rooms, setRooms] = useState([
    { id: '1', name: 'Nhóm Toán', messages: 3 },
    { id: '2', name: 'Nhóm Lý', messages: 1 },
    { id: '3', name: 'Nhóm Hóa', messages: 0 },
  ]);
  const [roomId, setRoomId] = useState('');

  const handleJoinRoom = () => {
    if (roomId.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập mã ID phòng!');
      return;
    }
    Alert.alert('Thành công', `Đã tham gia phòng với mã ID: ${roomId}`);
    setRoomId('');
  };

  const handleCreateRoom = () => {
    Alert.alert('Tạo phòng', 'Chức năng tạo phòng chưa hoàn thiện.');
  };

  const renderRoomItem = ({ item }:{item:Room}) => (
    <TouchableOpacity
      style={styles.roomItem}
      onPress={() => navigation.navigate('PhongHoc', { roomId: item.id, roomName: item.name })}
    >
      <Text style={styles.roomName}>{item.name}</Text>
      {item.messages > 0 && (
        <View style={styles.messageBadge}>
          <Text style={styles.messageBadgeText}>{item.messages}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách phòng học</Text>
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={renderRoomItem}
        style={styles.roomList}
      />
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCreateRoom}>
          <Text style={styles.buttonText}>Tạo phòng</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Nhập mã ID phòng"
          value={roomId}
          onChangeText={setRoomId}
        />
        <TouchableOpacity style={styles.button} onPress={handleJoinRoom}>
          <Text style={styles.buttonText}>Tham gia phòng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  roomList: { marginBottom: 20 },
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
  },
  roomName: { fontSize: 18 },
  messageBadge: {
    backgroundColor: 'red',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  messageBadgeText: { color: '#fff', fontWeight: 'bold' },
  actionContainer: { flexDirection: 'row', alignItems: 'center' },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  buttonText: { color: '#fff' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
});
