import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Button,
} from 'react-native';
import styles from '../styles/NhiemVuStyles';
import UserFooter from '../components/UserFooter';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import Task from '../screens/types/task'; // Import interface Task

const NhiemVu = () => {
  const [filter, setFilter] = useState('Tất cả');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
    status: 'Đang thực hiện',
    assignedBy: '',
    createdAt: new Date().toISOString(),
    attachments: [],
  });

  const fetchTasks = async () => {
    const tasksSnapshot = await firebase.firestore().collection('tasks').get();
    const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[];
    setTasks(tasksList);
  };

  const addTask = async () => {
    await firebase.firestore().collection('tasks').add(newTask);
    setModalVisible(false);
    fetchTasks();
  };

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

      {/* Nút thêm nhiệm vụ */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>Thêm Nhiệm Vụ</Text>
      </TouchableOpacity>

      {/* Modal thêm nhiệm vụ */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Thêm Nhiệm Vụ</Text>
          <TextInput
            placeholder="Tên nhiệm vụ"
            value={newTask.title}
            onChangeText={(text) => setNewTask({ ...newTask, title: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Mô tả"
            value={newTask.description}
            onChangeText={(text) => setNewTask({ ...newTask, description: text })}
            style={styles.input}
          />
          <TextInput
            placeholder="Hạn chót"
            value={newTask.deadline}
            onChangeText={(text) => setNewTask({ ...newTask, deadline: text })}
            style={styles.input}
          />
          <Button title="Thêm" onPress={addTask} />
          <Button title="Hủy" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      <UserFooter />
    </View>
  );
};

export default NhiemVu; 