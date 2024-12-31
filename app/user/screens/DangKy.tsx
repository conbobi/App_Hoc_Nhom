import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert,Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types/RootStackParamList';
import styles from '../styles/DangKyStyles';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import * as ImagePicker from 'expo-image-picker';

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
  const [imageUri, setImageUri] = useState('');
  const navigation = useNavigation<DangKyScreenNavigationProp>();

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };
const handleDangNhap = () => {
  navigation.navigate('DangNhap');
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

      // Upload image if a new one is selected
      let uploadedImageUrl = '';
      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const ref = firebase.storage().ref().child(`avatars/${user?.uid}`);
        await ref.put(blob);
        uploadedImageUrl = await ref.getDownloadURL();
      }

      // Lưu thông tin bổ sung vào Firestore
      await firebase.firestore().collection('users').doc(user?.uid).set({
        fullName,
        email,
        password,
        role,
        imageUri: uploadedImageUrl,
      });

      Alert.alert('Thành công', 'Đăng ký thành công!');
      navigation.navigate('DangNhap'); // Chuyển đến màn hình đăng nhập
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
      <TouchableOpacity onPress={handlePickImage} style={{ marginTop: 10 ,backgroundColor:"yellow", shadowColor: 'black', marginBottom: 20}}>
        <Text style={styles.buttonText}>Chọn Ảnh</Text>
      </TouchableOpacity>
      {imageUri ? <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, marginTop: 10 }} /> : null}
      <TouchableOpacity onPress={handleDangKy} style={styles.button}>
        <Text style={styles.buttonText}>Đăng Ký</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDangNhap} style={styles.button}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>
    </View>
  );
}