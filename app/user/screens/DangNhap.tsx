import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types/RootStackParamList';
import styles from '../styles/DangNhapStyles';
import { supabase } from '@/supabase';

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
      // Đăng nhập với Supabase Authentication
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Lấy thông tin người dùng từ Supabase Database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (userError) {
        throw userError;
      }

      if (userData) {
        Alert.alert('Thành công', 'Đăng nhập thành công!');
        navigation.navigate('Profile', { 
          userId: user?.id || '',
          userData: {
            id: userData.id,
            fullName: userData.fullName,
            email: userData.email,
            password: userData.password,
            role: userData.role,
            imageUri: userData.imageUri || '',
          }
        });
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
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