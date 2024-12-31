import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types/RootStackParamList';
import styles from '../styles/DangKyStyles';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/supabase';

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
      // Đăng ký tài khoản người dùng với Supabase
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      let uploadedImageUrl = '';
      if (imageUri) {
        console.log('Uploading image...');
        const response = await fetch(imageUri);
        if (!response.ok) {
          throw new Error('Failed to fetch the image from the URI');
        }
        const blob = await response.blob();
        const { data, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(`public/${user?.id}`, blob, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        uploadedImageUrl = data?.path ? supabase.storage.from('avatars').getPublicUrl(data.path).data.publicUrl : '';
        console.log('Image uploaded successfully:', uploadedImageUrl);
      }

      console.log('Đang ghi dữ liệu vào Supabase...');
      const { error: insertError } = await supabase.from('users').insert([
        {
          id: user?.id,
          fullName,
          email,
          password,
          role,
          imageUri: uploadedImageUrl || '',
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      Alert.alert('Thành công', 'Đăng ký thành công!');
      navigation.navigate('DangNhap');
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