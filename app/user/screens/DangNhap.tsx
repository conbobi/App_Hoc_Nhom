import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';

type DangNhapScreenNavigationProp = StackNavigationProp<RootStackParamList,'DangNhap'>;
type DangNhapRouteProp =RouteProp<RootStackParamList, 'DangNhap'>;

export default function DangNhap() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<DangNhapScreenNavigationProp>();
  const route = useRoute<DangNhapRouteProp>();
  const { userData } = route.params ;

  const handleDangNhap = () => {
    console.log(userData.email);
    if (email === userData?.email && password === userData?.password) {
      navigation.navigate('Profile', { userId: userData.id.toString(), userData });
    } else {
      alert('Thông tin đăng nhập không chính xác.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
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
      <TouchableOpacity onPress={handleDangNhap} style={styles.button}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
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
