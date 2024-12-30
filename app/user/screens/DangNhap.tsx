import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types/RootStackParamList';
import styles from '../styles/DangNhapStyles';
import firebase from '../../../FirebaseConfig'; // Import firebase from FirebaseConfig.js

type DangNhapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DangNhap'>;

export default function DangNhap() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<DangNhapScreenNavigationProp>();

  const handleDangNhap = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu.');
      return;
    }

    try {
      // Đăng nhập với Firebase Authentication
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Lấy thông tin người dùng từ Firestore
      const userDoc = await firebase.firestore().collection('users').doc(user?.uid).get();
      const userData = userDoc.data();

      if (userData) {
        Alert.alert('Thành công', 'Đăng nhập thành công!');
        if (user?.uid) {
          navigation.navigate('Profile', { 
            userId: user.uid,
            userData: {
              id: Number(user.uid),
              fullName: userData.fullName,
              email: userData.email,
              password: userData.password,
              role: userData.role
            }
          });
        } else {
          Alert.alert('Lỗi', 'Không tìm thấy ID người dùng.');
        }
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', (error as any).message || 'Đăng nhập thất bại!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleDangNhap}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>
    </View>
  );
}