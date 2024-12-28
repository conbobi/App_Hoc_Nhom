import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import UserSidebar from '../components/UserSidebar'; // Import UserSidebar
import styles from '../styles/ProfileStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';
import { useRoute } from '@react-navigation/native';
import UserFooter from '../components/UserFooter';

const screenWidth = Dimensions.get('window').width;
type ProfileRouteProp = RouteProp<RootStackParamList, 'Profile'>;
const chartData = {
  labels: ['Task 1', 'Task 2', 'Task 3', 'Task 4'],
  datasets: [
    {
      data: [80, 45, 70, 95],
    },
  ],
};

export default function Profile() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const route = useRoute<ProfileRouteProp>();
  const { userId } = route.params || {}; // Nếu không truyền tham số, `params` sẽ là `undefined`.
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Sidebar */}
      {isSidebarVisible && <UserSidebar onClose={toggleSidebar} />}

      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          {/* Avatar Section */}
          <View style={{borderRadius:50, backgroundColor:"#9932CC", width:350,height:200 }}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'data:image/jpeg;base64,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' }} // Placeholder avatar
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
            <TextInput style={styles.input} value="123456" editable={false} />

            <Text style={styles.label}>Họ và Tên:</Text>
            <TextInput style={styles.input} value="Nguyễn Văn A" editable={false} />

            <Text style={styles.label}>Email:</Text>
            <TextInput style={styles.input} value="example@gmail.com" editable={false} />

            <Text style={styles.label}>Mật Khẩu:</Text>
            <TextInput
              style={styles.input}
              value="********"
              editable={false}
              secureTextEntry
            />

            <Text style={styles.label}>Vai Trò:</Text>
            <TextInput style={styles.input} value="Sinh Viên" editable={false} />

            <Text style={styles.label}>Trạng Thái:</Text>
            <TextInput style={styles.input} value="Hoạt Động" editable={false} />
          </View>

          {/* Chart Section */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Báo Cáo Hoàn Thành Nhiệm Vụ</Text>
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
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={styles.chart}
            />
          </View>

          {/* Update Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => alert('Cập nhật hồ sơ')}>
              <Text style={{marginTop:10}}>Cập nhật hồ sơ</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
      <UserFooter></UserFooter>
    </View>
  );
}
