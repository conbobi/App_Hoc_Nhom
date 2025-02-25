import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../screens/types/RootStackParamList';

type UserFooterRouteProp = RouteProp<RootStackParamList, 'UserFooter'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;

const UserFooter = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<UserFooterRouteProp>();
  const { userData } = route.params || {};

  // Kiểm tra giá trị của userData
  console.log('userData:', userData);

  // Chuyển đổi userData.id thành string
  const updatedUserData = { ...userData, id: userData.id.toString() };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home', { userData: updatedUserData })}>
        <Ionicons name="home" size={24} color="#000" />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('NhiemVu', { userData: updatedUserData })}>
        <Ionicons name="list" size={24} color="#000" />
        <Text style={styles.label}>Nhiệm Vụ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Notifications', { userData: updatedUserData })}>
        <Ionicons name="notifications" size={24} color="#000" />
        <Text style={styles.label}>Thông Báo</Text>
      </TouchableOpacity>

     
<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DanhSachPhong', { userData })}>
        <Ionicons name="school" size={24} color="#000" />
        <Text style={styles.label}>Phòng Học</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => {
        if (userData && userData.id) {
          navigation.navigate('Profile', { userId: userData.id.toString(), userData: updatedUserData });
        } else {
          console.error('userData hoặc userData.id không tồn tại');
        }
      }}>
        <Ionicons name="person" size={24} color="#000" />
        <Text style={styles.label}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-around', padding: 10, backgroundColor: '#fff' },
  button: { alignItems: 'center' },
  label: { marginTop: 5, fontSize: 12 },
});

export default UserFooter;

