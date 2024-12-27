import React, { useState } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import UserSidebar from '../components/UserSidebar'; // Import UserSidebar
import styles from '../styles/ProfileStyles';

const screenWidth = Dimensions.get('window').width;

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

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Sidebar */}
      {isSidebarVisible && <UserSidebar onClose={toggleSidebar} />}

      <ScrollView style={styles.container}>
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder avatar
            style={styles.avatar}
          />
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
          <TextInput style={styles.input} value="********" editable={false} secureTextEntry />

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
  yAxisLabel="%" // Đơn vị phía trước giá trị trục Y
  yAxisSuffix="" // Đơn vị phía sau giá trị trục Y (nếu không cần, để trống)
  chartConfig={{
    backgroundColor: '#1cc910',
    backgroundGradientFrom: '#eff3ff',
    backgroundGradientTo: '#efefef',
    decimalPlaces: 1, // Số chữ số thập phân
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  }}
  style={styles.chart}
/>
        </View>

        {/* Update Button */}
        <View style={styles.buttonContainer}>
          <Button title="Cập Nhật Hồ Sơ" onPress={() => alert('Cập nhật hồ sơ')} />
        </View>
      </ScrollView>

      {/* Menu Button */}
      <View style={styles.menuButton}>
        <Button title="☰ Menu" onPress={toggleSidebar} />
      </View>
    </View>
  );
}
