import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
// @ts-ignore
import { useRoute, RouteProp } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import firebase from '../../../FirebaseConfig';
import Task from './types/task'; // Import kiểu dữ liệu Task
import Subtask from './types/subtask'; // Import kiểu dữ liệu Subtask
import taskDetailStyles from '../styles/taskDetailStyles'; // Import taskDetailStyles
import * as DocumentPicker from 'expo-document-picker';
import UpFile from "../components/UpFile";


const db = firebase.firestore();

type RootStackParamList = {
  TaskDetail: { taskId: string };
};

const TaskDetail = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'TaskDetail'>>();
  const { taskId } = route.params;

  // Tạo form chi tiết nhiệm vụ con
  const [isEditingSubtask, setIsEditingSubtask] = useState<boolean>(false);
  const [editingSubtask, setEditingSubtask] = useState<Subtask | null>(null);

  const [isAddingSubtask, setIsAddingSubtask] = useState<boolean>(false);
  const [task, setTask] = useState<Task | null>(null);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState<string>('');
  const [assignees, setAssignees] = useState<string[]>([]);
  const [newAssignee, setNewAssignee] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    fetchTaskDetails();
  }, []);

  // add subtask
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [newSubtaskDeadline, setNewSubtaskDeadline] = useState<Date | null>(null);
  const [newChecklistItem, setNewChecklistItem] = useState<string>(''); // Khai báo state


  const fetchTaskDetails = async () => {
    try {
      const taskDoc = await getDoc(doc(db, 'tasks', taskId));
      if (taskDoc.exists()) {
        const taskData = taskDoc.data() as Task;
        setTask({
          id: taskDoc.id,
          title: taskData.title,
          deadline: taskData.deadline, // Ngày hết hạn
          status: taskData.status, // Trạng thái nhiệm vụ
          description: taskData.description,
          assignedBy: taskData.assignedBy, // Người giao nhiệm vụ
          createdAt: taskData.createdAt,
          attachments: taskData.attachments,
          createdBy: taskData.createdBy,
          subtasks: taskData.subtasks || [],
          assignees: taskData.assignees || [],
          notes: taskData.notes || '',
          comments: taskData.comments || [],
          progress: taskData.progress || 0, // Thêm giá trị mặc định cho progress
        });
        setSubtasks(taskData.subtasks || []);
        setAssignees(taskData.assignees || []);
        setNotes(taskData.notes || '');
        setComments(taskData.comments || []);
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy nhiệm vụ.');
      }
    } catch (error) {
      console.error('Lỗi khi tải chi tiết nhiệm vụ:', error);
    }
  };

  // ADĐ SUBTASK--------------------------//
  // Hàm thêm nhiệm vụ con

    const addSubtask = async () => {
      if (newSubtask.trim() === '' || !newSubtaskDeadline) {
        Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin.');
        return;
      }
    
      const updatedSubtasks = [...subtasks];
      const editingIndex = subtasks.findIndex((subtask) => subtask.title === newSubtask);
    
      if (editingIndex !== -1) {
        // Chỉnh sửa nhiệm vụ con
        updatedSubtasks[editingIndex] = {
          ...updatedSubtasks[editingIndex],
          title: newSubtask,
          deadline: newSubtaskDeadline.toISOString(),
        };
      } else {
        // Thêm nhiệm vụ con mới
        updatedSubtasks.push({
          id: Date.now().toString(), // Tạo ID duy nhất dựa trên timestamp
          title: newSubtask,
          deadline: newSubtaskDeadline.toISOString(),
          progress: 0,
          completed: false,
          labelColor: "#FFFFFF", // Giá trị mặc định cho nhãn màu sắc
          description: "", // Giá trị mặc định cho mô tả
          checklist: [] // Giá trị mặc định cho danh sách mục tiêu
        });
      }
      
      setSubtasks(updatedSubtasks);
      setNewSubtask('');
      setNewSubtaskDeadline(null);
      setIsAddingSubtask(false);
    
      try {
        await updateDoc(doc(db, 'tasks', taskId), { subtasks: updatedSubtasks });
        Alert.alert('Thành công', editingIndex !== -1 ? 'Nhiệm vụ con đã được cập nhật.' : 'Nhiệm vụ con đã được thêm.');
      } catch (error) {
        console.error('Lỗi khi cập nhật nhiệm vụ con:', error);
      }
    };
  // END ADD SUBTASK--------------------------//


  const toggleSubtask = async (index: number) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
    setSubtasks(updatedSubtasks);

    try {
      await updateDoc(doc(db, 'tasks', taskId), { subtasks: updatedSubtasks });
    } catch (error) {
      console.error('Lỗi khi cập nhật nhiệm vụ con:', error);
    }
  };

  const addAssignee = async () => {
    if (newAssignee.trim() === '') return;

    const updatedAssignees = [...assignees, newAssignee];
    setAssignees(updatedAssignees);
    setNewAssignee('');

    try {
      await updateDoc(doc(db, 'tasks', taskId), { assignees: updatedAssignees });
      Alert.alert('Thành công', 'Người thực hiện đã được thêm.');
    } catch (error) {
      console.error('Lỗi khi thêm người thực hiện:', error);
    }
  };

  const addComment = async () => {
    if (newComment.trim() === '') return;

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setNewComment('');

    try {
      await updateDoc(doc(db, 'tasks', taskId), { comments: updatedComments });
      Alert.alert('Thành công', 'Bình luận đã được thêm.');
    } catch (error) {
      console.error('Lỗi khi thêm bình luận:', error);
    }
  };

  const updateNotes = async () => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), { notes });
      Alert.alert('Thành công', 'Ghi chú đã được cập nhật.');
    } catch (error) {
      console.error('Lỗi khi cập nhật ghi chú:', error);
    }
  };

  if (!task) {
    return (
      <View style={taskDetailStyles.container}>
        <Text>Đang tải chi tiết nhiệm vụ...</Text>
      </View>
    );
  }

  //--------------------------------------------//

    // Hàm xóa nhiệm vụ con
    const deleteSubtask = async (index: number) => {
      const updatedSubtasks = subtasks.filter((_, i) => i !== index);
      setSubtasks(updatedSubtasks);

      try {
        await updateDoc(doc(db, 'tasks', taskId), { subtasks: updatedSubtasks });
        Alert.alert('Thành công', 'Nhiệm vụ con đã được xóa.');
      } catch (error) {
        console.error('Lỗi khi xóa nhiệm vụ con:', error);
      }
    };

    // Hàm mở form chi tiết nhiệm vụ con
    const openSubtaskDetail = (index: number) => {
      const subtask = subtasks[index];
      setEditingSubtask({
        ...subtask,
        checklist: subtask.checklist || [], // Khởi tạo checklist nếu chưa có
      });
      setIsEditingSubtask(true); // Hiển thị form chi tiết
    };


  


  return (
   
   
   
    <FlatList
    data={[{ key: 'content' }]} // Dữ liệu giả để hiển thị toàn bộ nội dung
    keyExtractor={(item) => item.key}
    renderItem={() => (

      
      <View style={taskDetailStyles.container}>
  {/* Tiêu đề nhiệm vụ */}
  <Text style={taskDetailStyles.title}>{task.title}</Text>

  {/* Khung chứa thông tin nhiệm vụ */}
  <View style={taskDetailStyles.infoContainer}>
    {/* Người giao nhiệm vụ và trạng thái */}
    <View style={taskDetailStyles.infoRow}>
      <View style={taskDetailStyles.infoBox}>
        <Text style={taskDetailStyles.label}>Người giao:</Text>
        <Text style={taskDetailStyles.value}>{task.assignedBy}</Text>
      </View>
      <View style={taskDetailStyles.infoBox}>
        <Text style={taskDetailStyles.label}>Ngày hết hạn:</Text>
        <Text style={taskDetailStyles.value}>{task.deadline}</Text>
      </View>
    </View>

      {/* Trạng thái và mô tả */}
      <View style={[taskDetailStyles.infoRow, { flexDirection: 'row', alignItems: 'center' }]}>
        <Text style={taskDetailStyles.label1}>Trạng thái:</Text>
        <Text
          style={[
            taskDetailStyles.value1,
            { marginLeft: 10 }, // Tạo khoảng cách giữa tiêu đề và dữ liệu
            task.status === 'Đang thực hiện' && { color: '#FFC107' }, // Màu vàng
            task.status === 'Đã hoàn thành' && { color: '#4CAF50' }, // Màu xanh lá cây
            task.status === 'Quá hạn' && { color: '#F44336' }, // Màu đỏ
          ]}
        >
          {task.status}
        </Text>
      </View>

    {/* Mô tả nhiệm vụ */}
    <View style={taskDetailStyles.infoBox}>
      <Text style={taskDetailStyles.label}>Mô tả:</Text>
      <Text style={taskDetailStyles.value}>{task.description}</Text>
    </View>
  </View>

  {/* Danh sách nhiệm vụ con */}
<Text style={taskDetailStyles.label}>Nhiệm vụ con:</Text>
<View style={{ flex: 1 }}>
  <FlatList
    data={subtasks}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item, index }) => (
      <View style={taskDetailStyles.subtaskContainer}>
         {/* Nhãn màu sắc */}
         <View
          style={[
            taskDetailStyles.labelColorIndicator,
            { backgroundColor: item.labelColor || '#FFFFFF' }, // Màu sắc từ labelColor
          ]}
        />
        <Text style={taskDetailStyles.subtaskTitle}>Tên: {item.title}</Text>
        <Text style={taskDetailStyles.subtaskDeadline}>
          Deadline: {item.deadline ? new Date(item.deadline).toLocaleDateString('vi-VN') : 'Chưa đặt'}
        </Text>

         {/* Thanh mức độ hoàn thành */}
         <View style={taskDetailStyles.progressBarContainer}>
          <View
            style={[
              taskDetailStyles.progressBar,
              { width: `${item.progress || 0}%` }, // Độ rộng dựa trên progress
            ]}
          />
        </View>
        <Text style={taskDetailStyles.progressText}>
          Hoàn thành: {item.progress || 0}%
        </Text>

        <View style={taskDetailStyles.buttonRow}>
          <TouchableOpacity
            style={taskDetailStyles.detailButton}
            onPress={() => openSubtaskDetail(index)}
          >
            <Text style={taskDetailStyles.detailButtonText}>Chi tiết</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={taskDetailStyles.deleteButton}
            onPress={() => deleteSubtask(index)}
          >
            <Text style={taskDetailStyles.deleteButtonText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
  />
</View>

  {/* Nút thêm nhiệm vụ con */}
  {isAddingSubtask ? (
    <View style={taskDetailStyles.formContainer}>
      <TextInput
        style={taskDetailStyles.input}
        placeholder="Tên nhiệm vụ con..."
        value={newSubtask}
        onChangeText={setNewSubtask}
      />
      <View style={[taskDetailStyles.infoRow, { flexDirection: 'row', alignItems: 'center' }]}>
        <Text style={taskDetailStyles.label}>Deadline:</Text>
        <TouchableOpacity
          style={{ flex: 1, marginLeft: 10, marginBottom: 5 }}
          onPress={() => setDatePickerVisibility(true)}
        >
          <Text style={taskDetailStyles.value}>
            {newSubtaskDeadline
              ? newSubtaskDeadline.toLocaleDateString('vi-VN')
              : 'Chọn Thời gian'}
          </Text>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setDatePickerVisibility(false);
          setNewSubtaskDeadline(date);
        }}
        onCancel={() => {
          setDatePickerVisibility(false);
        }}
      />
      <View style={taskDetailStyles.buttonRow}>
        <TouchableOpacity
          style={taskDetailStyles.saveButton}
          onPress={addSubtask}
        >
          <Text style={taskDetailStyles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={taskDetailStyles.cancelButton}
          onPress={() => setIsAddingSubtask(false)}
        >
          <Text style={taskDetailStyles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
      </View>
    </View>
      ) : (
        <TouchableOpacity
          style={taskDetailStyles.addButton1}
          onPress={() => setIsAddingSubtask(true)}
        >
          <Text style={taskDetailStyles.addButtonText1}>Thêm nhiệm vụ con</Text>
        </TouchableOpacity>
      )}


  {/* ----------Form chi tiết nhiệm vụ con---------- */}



     {/* Form chi tiết nhiệm vụ con dưới dạng Modal */}
    
     <Modal
  visible={isEditingSubtask}
  animationType="slide"
  transparent={true}
  onRequestClose={() => {
    setIsEditingSubtask(false);
    setEditingSubtask(null);
  }}
>
  <View style={taskDetailStyles.modalOverlay}>
    <View style={taskDetailStyles.modalContainer}>
      {/* Tiêu đề */}
      <TextInput
  style={taskDetailStyles.input}
  placeholder="Tiêu đề nhiệm vụ con..."
  value={editingSubtask?.title || ''}
  onChangeText={(text) =>
    setEditingSubtask((prev) => ({
      ...(prev || {
        id: Date.now().toString(), // Tạo ID duy nhất dựa trên timestamp
        title: '', // Giá trị mặc định cho title
        deadline: '', // Giá trị mặc định cho deadline
        progress: 0, // Giá trị mặc định cho progress
        completed: false, // Giá trị mặc định cho completed
        labelColor: '#FFFFFF', // Giá trị mặc định cho labelColor
        description: '', // Giá trị mặc định cho description
        checklist: [], // Giá trị mặc định cho checklist
      }),
      title: text || '', // Đảm bảo title luôn là string
    }))
  }
/>

      {/* Deadline */}
      <View style={[taskDetailStyles.infoRow, { flexDirection: 'row', alignItems: 'center' }]}>
        <Text style={taskDetailStyles.label}>Deadline:</Text>
        <TouchableOpacity
          style={{ flex: 1, marginLeft: 10, marginBottom: 5 }}
          onPress={() => setDatePickerVisibility(true)}
        >
          <Text style={taskDetailStyles.value}>
            {editingSubtask?.deadline
              ? new Date(editingSubtask.deadline).toLocaleDateString('vi-VN')
              : 'Chọn Thời gian'}
          </Text>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
      isVisible={isDatePickerVisible}
      mode="date"
      onConfirm={(date) => {
        setDatePickerVisibility(false);
        setEditingSubtask((prev) => ({
          ...(prev || {
            id: Date.now().toString(), // Tạo ID duy nhất dựa trên timestamp
            title: '', // Giá trị mặc định cho title
            deadline: '', // Giá trị mặc định cho deadline
            progress: 0, // Giá trị mặc định cho progress
            completed: false, // Giá trị mặc định cho completed
            labelColor: '#FFFFFF', // Giá trị mặc định cho labelColor
            description: '', // Giá trị mặc định cho description
            checklist: [], // Giá trị mặc định cho checklist
          }),
          deadline: date.toISOString(), // Đảm bảo deadline luôn là string
        }));
      }}
      onCancel={() => setDatePickerVisibility(false)}
    />

      {/* Nhãn màu sắc */}
<View style={taskDetailStyles.colorPickerContainer}>
  <Text style={taskDetailStyles.label}>Chọn màu nhãn:</Text>
  <View style={taskDetailStyles.colorOptions}>
    {/* Tùy chọn "Không có màu" */}
    <TouchableOpacity
      key="none"
      style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#FFFFFF', // Màu trắng đại diện cho "None"
        margin: 5,
        borderWidth: editingSubtask?.labelColor === '#FFFFFF' ? 2 : 0,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={() =>
        setEditingSubtask((prev) => ({
          ...(prev || {
            id: Date.now().toString(), // Tạo ID duy nhất dựa trên timestamp
            title: '', // Giá trị mặc định cho title
            deadline: '', // Giá trị mặc định cho deadline
            progress: 0, // Giá trị mặc định cho progress
            completed: false, // Giá trị mặc định cho completed
            labelColor: '#FFFFFF', // Giá trị mặc định cho labelColor
            description: '', // Giá trị mặc định cho description
            checklist: [], // Giá trị mặc định cho checklist
          }),
          labelColor: '#FFFFFF', // Đặt nhãn màu thành "None"
        }))
      }
    >
      <Text style={{ fontSize: 10, color: '#000' }}>None</Text>
    </TouchableOpacity>

    {/* Các tùy chọn màu sắc */}
    {[
      '#FFC107', // Vàng
      '#4CAF50', // Xanh lá
      '#F44336', // Đỏ
      '#2196F3', // Xanh dương
      '#9C27B0', // Tím
      '#FF5722', // Cam
      '#795548', // Nâu
      '#607D8B', // Xanh xám
    ].map((color) => (
      <TouchableOpacity
        key={color}
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: color,
          margin: 5,
          borderWidth: editingSubtask?.labelColor === color ? 2 : 0,
          borderColor: '#000',
        }}
        onPress={() =>
          setEditingSubtask((prev) => ({
            ...(prev || {
              id: Date.now().toString(), // Tạo ID duy nhất dựa trên timestamp
              title: '', // Giá trị mặc định cho title
              deadline: '', // Giá trị mặc định cho deadline
              progress: 0, // Giá trị mặc định cho progress
              completed: false, // Giá trị mặc định cho completed
              labelColor: '#FFFFFF', // Giá trị mặc định cho labelColor
              description: '', // Giá trị mặc định cho description
              checklist: [], // Giá trị mặc định cho checklist
            }),
            labelColor: color, // Đặt nhãn màu thành màu được chọn
          }))
        }
      />
    ))}
  </View>
</View>

      {/* Mô tả */}
      <TextInput
        style={taskDetailStyles.textArea}
        placeholder="Mô tả nhiệm vụ con..."
        value={editingSubtask?.description || ''}
        onChangeText={(text) =>
          setEditingSubtask((prev) => ({
            ...(prev || {
              id: Date.now().toString(), // Tạo ID duy nhất dựa trên timestamp
              title: '', // Giá trị mặc định cho title
              deadline: '', // Giá trị mặc định cho deadline
              progress: 0, // Giá trị mặc định cho progress
              completed: false, // Giá trị mặc định cho completed
              labelColor: '#FFFFFF', // Giá trị mặc định cho labelColor
              description: '', // Giá trị mặc định cho description
              checklist: [], // Giá trị mặc định cho checklist
            }),
            description: text || '', // Đảm bảo description luôn là string
          }))
        }
        multiline
      />
    

    {/* Checklist */}
<Text style={taskDetailStyles.label}>Mục tiêu thực hiện:</Text>
{(editingSubtask?.checklist || []).map((item, index) => (
  <View key={item.id} style={taskDetailStyles.checklistItem}>
    <TouchableOpacity
      style={taskDetailStyles.checkboxContainer}
      onPress={() => {
        const updatedChecklist = [...(editingSubtask?.checklist || [])];
        updatedChecklist[index].completed = !updatedChecklist[index].completed;
        const completedCount = updatedChecklist.filter((i) => i.completed).length;
        const progress = Math.round((completedCount / updatedChecklist.length) * 100);
        setEditingSubtask((prev) => ({
          ...(prev || {
            id: Date.now().toString(), // Tạo ID duy nhất dựa trên timestamp
            title: '', // Giá trị mặc định cho title
            deadline: '', // Giá trị mặc định cho deadline
            progress: 0, // Giá trị mặc định cho progress
            completed: false, // Giá trị mặc định cho completed
            labelColor: '#FFFFFF', // Giá trị mặc định cho labelColor
            description: '', // Giá trị mặc định cho description
            checklist: [], // Giá trị mặc định cho checklist
          }),
          checklist: updatedChecklist,
          progress, // Cập nhật progress
        }));
      }}
    >
      <View
        style={[
          taskDetailStyles.checkbox,
          item.completed && taskDetailStyles.checkboxChecked,
        ]}
      />
      <Text
        style={[
          taskDetailStyles.checklistText,
          item.completed && taskDetailStyles.checklistTextCompleted,
        ]}
        numberOfLines={1} // Giới hạn hiển thị 1 dòng, nếu dài thì cắt
        ellipsizeMode="tail" // Hiển thị dấu "..." nếu nội dung bị cắt
      >
        {item.title}
      </Text>
    </TouchableOpacity>
    {/* Nút xóa mục tiêu */}
    <TouchableOpacity
      style={taskDetailStyles.deleteChecklistButton}
      onPress={() => {
        const updatedChecklist = (editingSubtask?.checklist || []).filter((_, i) => i !== index);
        const completedCount = updatedChecklist.filter((i) => i.completed).length;
        const progress = Math.round((completedCount / updatedChecklist.length) * 100);
        setEditingSubtask((prev) => ({
          ...(prev || {
            id: Date.now().toString(), // Tạo ID duy nhất dựa trên timestamp
            title: '', // Giá trị mặc định cho title
            deadline: '', // Giá trị mặc định cho deadline
            progress: 0, // Giá trị mặc định cho progress
            completed: false, // Giá trị mặc định cho completed
            labelColor: '#FFFFFF', // Giá trị mặc định cho labelColor
            description: '', // Giá trị mặc định cho description
            checklist: [], // Giá trị mặc định cho checklist
          }),
          checklist: updatedChecklist,
          progress, // Cập nhật progress
        }));
      }}
    >
      <Text style={taskDetailStyles.deleteChecklistButtonText}>X</Text>
    </TouchableOpacity>
  </View>
))}

{/* Thêm mục tiêu */}
<View style={taskDetailStyles.addChecklistContainer}>
  <TextInput
    style={taskDetailStyles.input}
    placeholder="Nhập mục tiêu mới..."
    value={newChecklistItem}
    onChangeText={setNewChecklistItem}
  />
  <TouchableOpacity
    style={taskDetailStyles.addButton}
    onPress={() => {
      if (!newChecklistItem.trim()) return;

      const newChecklist = {
        id: Date.now().toString(),
        title: newChecklistItem.trim(),
        completed: false,
      };

      setEditingSubtask((prev) => ({
        ...(prev || {
          id: Date.now().toString(), // Tạo ID duy nhất dựa trên timestamp
          title: '', // Giá trị mặc định cho title
          deadline: '', // Giá trị mặc định cho deadline
          progress: 0, // Giá trị mặc định cho progress
          completed: false, // Giá trị mặc định cho completed
          labelColor: '#FFFFFF', // Giá trị mặc định cho labelColor
          description: '', // Giá trị mặc định cho description
          checklist: [], // Giá trị mặc định cho checklist
        }),
        checklist: [...(prev?.checklist || []), newChecklist],
      }));

      setNewChecklistItem(''); // Xóa nội dung trong ô nhập liệu
    }}
  >
    <Text style={taskDetailStyles.addButtonText}>Thêm mục tiêu</Text>
  </TouchableOpacity>
    </View>

    
      {/* đính file */}

      
      






        {/* end đính file */}
    

    {/* Nút lưu và hủy */}
    <View style={taskDetailStyles.buttonRow}>

      {/* Nút Lưu */}
      <TouchableOpacity
        style={taskDetailStyles.saveButton}
        onPress={async () => {
          if (!editingSubtask) return;

          // Cập nhật danh sách subtasks
          const updatedSubtasks = subtasks.map((subtask) =>
            subtask.title === editingSubtask.title ? editingSubtask : subtask
          );

          // Cập nhật state
          setSubtasks(updatedSubtasks);

          // Đồng bộ với Firestore
          try {
            await updateDoc(doc(db, 'tasks', taskId), { subtasks: updatedSubtasks });
            Alert.alert('Thành công', 'Nhiệm vụ con đã được cập nhật.');
          } catch (error) {
            console.error('Lỗi khi cập nhật nhiệm vụ con:', error);
            Alert.alert('Lỗi', 'Không thể cập nhật nhiệm vụ con.');
            return; // Thoát nếu có lỗi
          }

          // Đóng form sau khi cập nhật thành công
          setIsEditingSubtask(false);
          setEditingSubtask(null);
        }}
      >
        <Text style={taskDetailStyles.saveButtonText}>Lưu</Text>
      </TouchableOpacity>

      {/* Nút Hủy */}
      <TouchableOpacity
        style={taskDetailStyles.cancelButton}
        onPress={() => {
          setIsEditingSubtask(false);
          setEditingSubtask(null);
        }}
      >
        <Text style={taskDetailStyles.cancelButtonText}>Hủy</Text>
      </TouchableOpacity>
    </View>



    </View>
  </View>
</Modal>




    </View>
   )}
    />

  );
  
};


export default TaskDetail;