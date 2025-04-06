import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Layout from '../components/layout';
import firebase from '../../../FirebaseConfig';
import styles from '../styles/HomeStyle'; // Đường dẫn đến file styles/HomeStyle.ts

export default function Home() {
  const [taskStats, setTaskStats] = useState({
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });
  const [roomStats, setRoomStats] = useState({
    created: 0,
    joined: 0,
  });

  const currentUserId = firebase.auth().currentUser?.uid || '';
  const db = firebase.firestore();

  
  // Lấy dữ liệu nhiệm vụ từ Firestore
  const fetchTaskStats = async () => {
    const tasksQuery = query(collection(db, 'tasks'), where('createdBy', '==', currentUserId));
    const querySnapshot = await getDocs(tasksQuery);

    let inProgress = 0;
    let completed = 0;
    let overdue = 0;

    querySnapshot.forEach((doc) => {
      const task = doc.data();
      if (task.status === 'Đang thực hiện') inProgress++;
      else if (task.status === 'Đã hoàn thành') completed++;
      else if (task.status === 'Quá hạn') overdue++;
    });

    setTaskStats({ inProgress, completed, overdue });
  };

  // Lấy dữ liệu phòng học từ Firestore
 
  const fetchRoomStats = async () => {
    try {
      // Lấy tất cả các phòng mà người dùng đã tạo
      const createdRoomsQuery = query(
        collection(db, 'rooms'),
        where('ownerId', '==', currentUserId)
      );
      const createdRoomsSnapshot = await getDocs(createdRoomsQuery);
  
      // Lấy tất cả các phòng mà người dùng là thành viên
      const joinedRoomsQuery = query(
        collection(db, 'rooms'),
        where('membersId', 'array-contains', currentUserId)
      );
      const joinedRoomsSnapshot = await getDocs(joinedRoomsQuery);
  
      // Lọc các phòng mà ownerId không phải là currentUserId
      const filteredRooms = joinedRoomsSnapshot.docs.filter(
        (doc) => doc.data().ownerId !== currentUserId
      );
  
      // Cập nhật thống kê phòng
      setRoomStats({
        created: createdRoomsSnapshot.size, // Số lượng phòng đã tạo
        joined: filteredRooms.length, // Số lượng phòng đã tham gia nhưng không phải là chủ sở hữu
      });
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu phòng:', error);
    }
  };
  

  useEffect(() => {
    fetchTaskStats();
    fetchRoomStats();
  }, []);

  return (
<Layout>

    <ScrollView style={styles.container}>
      <Text style={styles.title}>Home</Text>

    
        {/* Biểu đồ nhiệm vụ */}
      <Text style={styles.sectionTitle}>Nhiệm vụ</Text>
      <BarChart
        data={{
          labels: ['Đang thực hiện', 'Đã hoàn thành', 'Quá hạn'],
          datasets: [
            {
              data: [taskStats.inProgress, taskStats.completed, taskStats.overdue],
            },
          ],
        }}
        width={Dimensions.get('window').width - 60} // Chiều rộng biểu đồ
        height={300} // Tăng chiều cao để dễ nhìn hơn
        yAxisLabel="" // Nhãn trục Y (để trống nếu không cần)
        yAxisSuffix="" // Hậu tố trục Y (để trống nếu không cần)
        fromZero={true} // Bắt đầu trục Y từ 0
        yAxisInterval={1} // Khoảng cách giữa các giá trị trên trục Y
        chartConfig={{
          backgroundColor: '#CFCFCF', // Nền màu trắng
          backgroundGradientFrom: '#CFCFCF', // Gradient từ màu trắng
          backgroundGradientTo: '#ffffff', // Gradient đến màu trắng
          decimalPlaces: 0, // Hiển thị số nguyên
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Màu chữ (đen)
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Màu nhãn (đen)
          fillShadowGradient: '#f1c40f', // Màu gradient cho cột (vàng)
          fillShadowGradientOpacity: 2, // Độ đậm của màu gradient
          propsForBackgroundLines: {
            strokeWidth: 2, // Độ dày đường lưới
            stroke: '#e3e3e3', // Màu đường lưới
            strokeDasharray: '4', // Đường nét đứt
          },
          propsForLabels: {
            fontSize: 14, // Kích thước chữ
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        showValuesOnTopOfBars={true} // Hiển thị số liệu trên đầu cột
      />

      {/* Biểu đồ phòng học */}
    
  <Text style={styles.sectionTitle}>Phòng học</Text>
  <View style={styles.chartContainer}>
  <PieChart
    data={[
      {
        name: 'Phòng',
        population: roomStats.created,
        color: '#f39c12',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
      {
        name: 'Phòng',
        population: roomStats.joined,
        color: '#3498db',
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      },
    ]}
    width={Dimensions.get('window').width - 40} // Chiều rộng biểu đồ
    height={220}
    chartConfig={{
      backgroundColor: '#1cc910',
      backgroundGradientFrom: '#1cc910',
      backgroundGradientTo: '#1cc910',
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    }}
    accessor="population"
    backgroundColor="transparent"
    paddingLeft="15"
    absolute
  />
  {/* Chú thích */}
  <View style={styles.legendContainer}>
    <View style={styles.legendItem}>
      <View style={[styles.legendColorBox, { backgroundColor: '#f39c12' }]} />
      <Text style={styles.legendText}>Phòng đã tạo</Text>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendColorBox, { backgroundColor: '#3498db' }]} />
      <Text style={styles.legendText}>Phòng đã tham gia</Text>
    </View>
  </View>
</View>
    </ScrollView>
    </Layout>
  );
}