import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

interface Notification {
  id: string;
  title: string;
  content: string;
  sender: 'Admin' | 'Nhóm';
  time: string;
}

const Notifications = () => {
  const [filter, setFilter] = useState<'Tất cả' | 'Admin' | 'Nhóm'>('Tất cả');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Cập nhật lịch học nhóm',
      content: 'Nhóm Khoa học máy tính sẽ họp vào thứ 4 lúc 14h tại phòng A301.',
      sender: 'Nhóm',
      time: '1 giờ trước',
    },
    {
      id: '2',
      title: 'Thông báo nghỉ học',
      content: 'Admin thông báo: Lớp Toán 2 sẽ nghỉ vào ngày 27/12/2024.',
      sender: 'Admin',
      time: '3 giờ trước',
    },
    {
      id: '3',
      title: 'Kế hoạch cuối kỳ',
      content: 'Họp nhóm để chuẩn bị kế hoạch cuối kỳ và phân chia công việc.',
      sender: 'Nhóm',
      time: 'Hôm qua',
    },
  ];

  const filteredNotifications = notifications.filter(
    (notification) =>
      filter === 'Tất cả' || notification.sender === filter
  );

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={styles.notificationCard}
      onPress={() => setSelectedNotification(item)}
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
      <Text style={styles.notificationContent} numberOfLines={2}>
        {item.content}
      </Text>
      <Text style={styles.notificationSender}>
        {item.sender === 'Admin' ? 'Từ Admin' : 'Từ Nhóm'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông báo</Text>
      </View>

      {/* Bộ lọc */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {['Tất cả', 'Admin', 'Nhóm'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterButton, filter === type && styles.filterButtonActive]}
            onPress={() => setFilter(type as 'Tất cả' | 'Admin' | 'Nhóm')}
          >
            <Text
              style={[styles.filterText, filter === type && styles.filterTextActive]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Danh sách thông báo */}
      {!selectedNotification ? (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.notificationList}
        />
      ) : (
        <View style={styles.detailContainer}>
          <Text style={styles.detailTitle}>{selectedNotification.title}</Text>
          <Text style={styles.detailSender}>
            {selectedNotification.sender === 'Admin'
              ? 'Người gửi: Admin'
              : 'Người gửi: Trưởng nhóm'}
          </Text>
          <Text style={styles.detailTime}>{selectedNotification.time}</Text>
          <Text style={styles.detailContent}>{selectedNotification.content}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedNotification(null)}
          >
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
  },
  filterText: {
    fontSize: 14,
    color: '#555',
  },
  filterTextActive: {
    color: '#fff',
  },
  notificationList: {
    paddingBottom: 16,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
  },
  notificationContent: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  notificationSender: {
    fontSize: 12,
    color: '#007bff',
    fontStyle: 'italic',
  },
  detailContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  detailSender: {
    fontSize: 14,
    marginBottom: 8,
    color: '#007bff',
  },
  detailTime: {
    fontSize: 12,
    marginBottom: 16,
    color: '#888',
  },
  detailContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Notifications;