import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types/RootStackParamList';
import styles from '../styles/DangKyStyles';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import * as ImagePicker from 'expo-image-picker';

type DangKyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DangKy'>;

export default function DangKy() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigation = useNavigation<DangKyScreenNavigationProp>();

  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

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
        imageUri: uploadedImageUrl || '',
      });

      Alert.alert('Thành công', 'Đăng ký thành công!');
      navigation.navigate('DangNhap'); // Chuyển đến màn hình đăng nhập
    } catch (error) {
      console.error('Error registering user:', error);
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
      <TouchableOpacity onPress={pickImage} style={{ marginTop: 10, backgroundColor: "yellow", shadowColor: 'black', marginBottom: 20 }}>
        <Text style={styles.buttonText}>Chọn Ảnh</Text>
      </TouchableOpacity>
      {imageUri ? <Image source={{ uri: imageUri }} style={{ width: 100, height: 100, marginTop: 10 }} /> : null}
      <TouchableOpacity onPress={handleDangKy} style={styles.button}>
        <Text style={styles.buttonText}>Đăng Ký</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('DangNhap')} style={styles.button}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>
    </View>
  );
}