import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { Ionicons } from '@expo/vector-icons';
import Layout from '../components/layout';
import styles from '../styles/HomeStyles';
export default function Home() {
  const dummyTasks = [
    { id: '1', name: 'Hoàn thành bài tập nhóm', status: 'Đang thực hiện' },
    { id: '2', name: 'Chuẩn bị thuyết trình', status: 'Hoàn thành' },
  ];

  const dummyGroups = [
    { id: '1', name: 'Nhóm học React Native' },
    { id: '2', name: 'Nhóm thuyết trình môn Toán' },
  ];
  return (
    <Layout>
    <View style={styles.container}>
       <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Học Nhóm Đại Học</Text>
        <TouchableOpacity style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Lịch học */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lịch học</Text>
        <Text style={styles.sectionContent}>Lớp Toán Cao Cấp - 14:00, Thứ 4</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      {/* Nhiệm vụ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nhiệm vụ</Text>
        <FlatList
          data={dummyTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskName}>{item.name}</Text>
              <Text style={styles.taskStatus}>{item.status}</Text>
            </View>
          )}
          nestedScrollEnabled
        />
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>Xem chi tiết</Text>
        </TouchableOpacity>
      </View>
          
      {/* Nhóm */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nhóm</Text>
        <FlatList
          data={dummyGroups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.groupItem}>
              <Text style={styles.groupName}>{item.name}</Text>
            </View>
          )}
          nestedScrollEnabled
        />
        <View style={styles.groupButtons}>
          <TouchableOpacity style={styles.createGroupButton}>
            <Text style={styles.groupButtonText}>Tạo nhóm</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.joinGroupButton}>
            <Text style={styles.groupButtonText}>Tham gia nhóm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
      
    </View>
  </Layout>
  );
}
