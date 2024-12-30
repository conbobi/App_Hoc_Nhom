import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './types/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import Room from './types/Room';
import message from './types/Message';
import styles from '../styles/DanhSachPhongStyles';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

type DanhSachPhongScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DanhSachPhong'>;

export default function DanhSachPhong() {
  const navigation = useNavigation<DanhSachPhongScreenNavigationProp>();
  const [rooms, setRooms] = useState<Room[]>([]); // Danh sách phòng
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [userId, setUserId] = useState('');
  const [nextRoomId, setNextRoomId] = useState();

  useEffect(() => {
    const fetchUserId = async () => {
      const user = firebase.auth().currentUser;
      if (user) {
        setUserId(user.uid);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      const snapshot = await firebase.firestore().collection('rooms').get();
      const fetchedRooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Room[];
      setRooms(fetchedRooms);
    };
    fetchRooms();
  }, []);

  const handleJoinRoom = async () => {
    if (roomId.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập mã ID phòng!');
      return;
    }

    const roomRef = firebase.firestore().collection('rooms').doc(roomId);
    const roomDoc = await roomRef.get();

    if (!roomDoc.exists) {
      Alert.alert('Lỗi', 'Phòng không tồn tại!');
      return;
    }

    await roomRef.update({
      membersId: firebase.firestore.FieldValue.arrayUnion(userId),
    });

    Alert.alert('Thành công', `Đã tham gia phòng với mã ID: ${roomId}`);
    setRoomId('');
  };

  const handleCreateRoom = async () => {
    if (roomName.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập tên phòng!');
      return;
    }

    const newRoom: Room = {
      id: nextRoomId.toString(),
      name: roomName,
      ownerId: userId,
      membersId: [userId],
      date: new Date(),
      messages: [] as message[],
      state: "string",
    };

    const roomRef = await firebase.firestore().collection('rooms').add(newRoom);
    setRooms((prevRooms) => [...prevRooms, { ...newRoom, id: roomRef.id }]);
    setNextRoomId(nextRoomId + 1);
    Alert.alert('Thành công', `Đã tạo phòng: ${roomName}`);
    setRoomName('');
  };

  const renderRoomItem = ({ item }: { item: Room }) => (
    <TouchableOpacity
      style={styles.roomItem}
      onPress={() => navigation.navigate('PhongHoc', { roomId: item.id, roomName: item.name, ownerId: item.ownerId })}
    >
      <Text style={styles.roomName}>{item.name}</Text>
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
        <TextInput
          style={styles.input}
          placeholder="Tên phòng mới"
          value={roomName}
          onChangeText={setRoomName}
        />
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