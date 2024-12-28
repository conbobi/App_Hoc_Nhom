import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import styles from '../styles/NhiemVuStyles';
import UserFooter from '../components/UserFooter';
interface Task {
  id: string;
  title: string;
  deadline: string;
  status: string;
  description: string;
  assignedBy: string;
  createdAt: string;
  attachments: string[];
}

const NhiemVu = () => {
  const [filter, setFilter] = useState('Tất cả');

  const tasks: Task[] = [
    {
      id: '1',
      title: 'Hoàn thành bài tập nhóm',
      deadline: '2024-12-28',
      status: 'Đang thực hiện',
      description: 'Hoàn thành báo cáo và chuẩn bị thuyết trình môn Kinh tế học.',
      assignedBy: 'Nguyễn Văn A',
      createdAt: '2024-12-20',
      attachments: ['File1.docx', 'Slide.pptx'],
    },
    {
      id: '2',
      title: 'Nộp bài tập lập trình',
      deadline: '2024-12-25',
      status: 'Đã hoàn thành',
      description: 'Nộp bài tập React Native trước hạn chót.',
      assignedBy: 'Trần Thị B',
      createdAt: '2024-12-18',
      attachments: [],
    },
    {
      id: '3',
      title: 'Chuẩn bị thuyết trình nhóm',
      deadline: '2024-12-24',
      status: 'Quá hạn',
      description: 'Thuyết trình về dự án môn Khoa học máy tính.',
      assignedBy: 'Lê Minh C',
      createdAt: '2024-12-15',
      attachments: ['Outline.docx'],
    },
  ];

  const filteredTasks = tasks.filter(
    (task) =>
      filter === 'Tất cả' ||
      (filter === 'Đang thực hiện' && task.status === 'Đang thực hiện') ||
      (filter === 'Đã hoàn thành' && task.status === 'Đã hoàn thành') ||
      (filter === 'Quá hạn' && task.status === 'Quá hạn')
  );

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text
          style={[
            styles.taskStatus,
            item.status === 'Đang thực hiện'
              ? styles.statusInProgress
              : item.status === 'Đã hoàn thành'
              ? styles.statusCompleted
              : styles.statusOverdue,
          ]}
        >
          {item.status}
        </Text>
      </View>
      <Text style={styles.taskDeadline}>Hạn chót: {item.deadline}</Text>
      <TouchableOpacity style={styles.detailButton}>
        <Text style={styles.detailButtonText}>Chi tiết</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nhiệm vụ</Text>
      </View>

      {/* Bộ lọc */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
        {['Tất cả', 'Đang thực hiện', 'Đã hoàn thành', 'Quá hạn'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filter === status && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(status)}
          >
            <Text
              style={[
                styles.filterText,
                filter === status && styles.filterTextActive,
              ]}
            >
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Danh sách nhiệm vụ */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.taskList}
      />
      <UserFooter/>
    </View>
    
  );
};
export default NhiemVu;
