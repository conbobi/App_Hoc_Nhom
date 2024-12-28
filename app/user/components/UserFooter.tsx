import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../screens/types/RootStackParamList';

type UserFooterRouteProp = RouteProp<RootStackParamList, 'Home'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;
const UserFooter = () => {
  // Xác định kiểu của navigation
  const navigation = useNavigation<NavigationProp>();
const route = useRoute<UserFooterRouteProp>();
const { userData } = route.params;
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={24} color="#000" />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NhiemVu')}>
        <Ionicons name="list" size={24} color="#000" />
        <Text style={styles.label}>Nhiệm Vụ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Notifications')}>
        <Ionicons name="notifications" size={24} color="#000" />
        <Text style={styles.label}>Thông Báo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DanhSachPhong')}>
        <Ionicons name="school" size={24} color="#000" />
        <Text style={styles.label}>Phòng Học</Text>
      </TouchableOpacity>

      <TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate('Profile')} // Thay '123456' bằng giá trị userId thực tế
>
  <Ionicons name="person" size={24} color="#000" />
  <Text style={styles.label}>Hồ Sơ</Text>
</TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
    color: '#000',
  },
});

export default UserFooter;
