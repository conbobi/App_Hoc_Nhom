import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from './types/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';

let idCounter = 1; // Biến toàn cục để sinh ID tự động.
type DangKyScreenNavigationProp= StackNavigationProp<RootStackParamList,'DangKy'>;
export default function DangKy() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigation = useNavigation<DangKyScreenNavigationProp>();

  const handleDangKy = () => {
    const userData = {
      id: idCounter++,
      fullName:'',
      email:'',
      password:'',
      role:'',
    };
    console.log('User DangKy:', userData);
    navigation.navigate('DangNhap', { userData });
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  button: { backgroundColor: '#9932CC', padding: 15, borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});
