import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types/RootStackParamList';
import styles from '../styles/DangKyStyles';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD-ye8v7QJmC3kLAIQLpGNNP48CUDZQQFM",
  authDomain: "app-hoc-nhom.firebaseapp.com",
  projectId: "app-hoc-nhom",
  storageBucket: "app-hoc-nhom.appspot.com",
  messagingSenderId: "45281545059",
  appId: "1:45281545059:web:edace200e76939e062a156",
  measurementId: "G-8XECQG39J8",
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

type DangKyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DangKy'>;

export default function DangKy() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigation = useNavigation<DangKyScreenNavigationProp>();
  const handelDangNhap = async () => {
    navigation.navigate('DangNhap', { userData: { fullName, email, role } });
  }
  const handleDangKy = async () => {
    if (!fullName || !email || !password || !role) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      // Đăng ký tài khoản với Firebase Authentication
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Lưu thông tin bổ sung vào Firestore
      await firebase.firestore().collection('users').doc(user?.uid).set({
        fullName,
        email,
        role,
      });

    // **Thêm thông báo đăng ký thành công vào Firestore**
    const notification = {
      id: firebase.firestore().collection("notifications").doc().id,
      type: "system",
      title: "Chào mừng thành viên mới!",
      content: `${fullName} vừa đăng ký tài khoản.`,
      sender: { id: user?.uid, name: fullName },
      state: "unread",
      timestamp: firebase.firestore.Timestamp.now()
    };

    await firebase.firestore().collection("notifications").doc(notification.id).set(notification);

    Alert.alert('Thành công', 'Đăng ký thành công!');

      navigation.navigate('DangNhap', { userData: { fullName, email, role } }); // Chuyển đến màn hình đăng nhập
    } catch (error) {
      Alert.alert('Lỗi', (error as any).message || 'Đăng ký thất bại!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Ký</Text>
      <TextInput
        placeholder="Họ và Tên"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Mật Khẩu"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        placeholder="Vai Trò (e.g., Sinh Viên)"
        value={role}
        onChangeText={setRole}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleDangKy} style={styles.button}>
        <Text style={styles.buttonText}>Đăng Ký</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>hoặc</Text>
      <TouchableOpacity onPress={handelDangNhap} style={styles.buttonSecondary}>
        <Text style={styles.buttonTextSecondary}>Đăng Nhập</Text>
      </TouchableOpacity>
    </View>
  );
}