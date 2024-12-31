import { BarChart } from 'react-native-chart-kit';
import UserFooter from '../components/UserFooter';
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types/RootStackParamList';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
import styles from '../styles/ProfileStyles';

const screenWidth = Dimensions.get('window').width;

type ProfileRouteProp = RouteProp<RootStackParamList, 'Profile'>;

export default function Profile() {
  const route = useRoute<ProfileRouteProp>();
  const { userData } = route.params || {}; // Nhận dữ liệu người dùng từ tham số điều hướng

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(userData.fullName);
  const [email, setEmail] = useState(userData.email);
  const [password, setPassword] = useState(userData.password);
  const [role, setRole] = useState(userData.role);
  const [imageUri, setImageUri] = useState(userData.imageUri || '');

  // Nếu không có thông tin người dùng, hiển thị thông báo lỗi
  if (!userData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Không tìm thấy thông tin người dùng.</Text>
      </View>
    );
  }

  const handleEditProfile = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      const userRef = firebase.firestore().collection('users').doc(userData.id.toString());

      // Upload image if a new one is selected
      let imageUrl = imageUri;
      if (imageUri && imageUri !== userData.imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const ref = firebase.storage().ref().child(`avatars/${userData.id}`);
        await ref.put(blob);
        imageUrl = await ref.getDownloadURL();
      }

      await userRef.update({
        fullName,
        email,
        password,
        role,
        imageUri: imageUrl,
      });

      Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Lỗi', 'Cập nhật thông tin thất bại. Vui lòng thử lại.');
    }
  };

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

  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

  function rgba(r: number, g: number, b: number, opacity: number): string {
    return `rgba(${r},${g},${b},${opacity})`;
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {/* Avatar Section */}
          <View style={{ borderRadius: 50, backgroundColor: "#9932CC", width: 350, height: 200 }}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={handlePickImage}>
                <Image
                  source={{ uri: imageUri || '' }} // Placeholder avatar
                  style={styles.avatar}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <Text style={styles.buttonText}>{isEditing ? 'Save' : 'Edit Profile'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.changePasswordButton} onPress={() => alert('Change Password clicked!')}>
                <Text style={styles.buttonText}>Change Password</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.signOutButton} onPress={() => alert('Sign Out clicked!')}>
                <Text style={styles.buttonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* User Info Section */}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>ID Người Dùng:</Text>
            <TextInput
              style={styles.input}
              value={String(userData.id) || 'N/A'}
              editable={false}
            />

            <Text style={styles.label}>Họ và Tên:</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              editable={isEditing}
            />

            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              editable={isEditing}
            />

            <Text style={styles.label}>Mật Khẩu:</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              editable={isEditing}
              secureTextEntry
            />

            <Text style={styles.label}>Vai Trò:</Text>
            <TextInput
              style={styles.input}
              value={role}
              onChangeText={setRole}
              editable={isEditing}
            />
          </View>

          <BarChart
            data={chartData}
            width={screenWidth * 0.9}
            height={220}
            yAxisLabel="%"
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#eff3ff',
              backgroundGradientTo: '#efefef',
              decimalPlaces: 1,
              color: (opacity = 1) => rgba(0, 0, 0, opacity),
              labelColor: (opacity = 1) => rgba(0, 0, 0, opacity),
            }}
            style={styles.chart}
          />
        </ScrollView>
      </SafeAreaView>
      <UserFooter></UserFooter>
    </View>
  );
}