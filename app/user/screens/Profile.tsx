import { BarChart } from 'react-native-chart-kit';
import UserFooter from '../components/UserFooter';
import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './types/RootStackParamList';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../styles/ProfileStyles';
const screenWidth = Dimensions.get('window').width;

type ProfileRouteProp = RouteProp<RootStackParamList, 'Profile'>;

export default function Profile() {
  const route = useRoute<ProfileRouteProp>();
  const { userData } = route.params || {}; // Nhận dữ liệu người dùng từ tham số điều hướng

  // Nếu không có thông tin người dùng, hiển thị thông báo lỗi
  if (!userData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Không tìm thấy thông tin người dùng.</Text>
      </View>
    );
  }

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
          <View style={{borderRadius:50, backgroundColor:"#9932CC", width:350,height:200 }}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: '' }} // Placeholder avatar
              style={styles.avatar}
            />
          </View>
          <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.editButton} onPress={() => alert('Edit Profile clicked!')}>
                <Text style={styles.buttonText}>Edit Profile</Text>
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
              value={userData.fullName || 'N/A'}
              editable={false}
            />

            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={userData.email || 'N/A'}
              editable={false}
            />

            <Text style={styles.label}>Mật Khẩu:</Text>
            <TextInput
              style={styles.input}
              value={userData.password || '********'}
              editable={false}
              secureTextEntry
            />

            <Text style={styles.label}>Vai Trò:</Text>
            <TextInput
              style={styles.input}
              value={userData.role || 'N/A'}
              editable={false}
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
