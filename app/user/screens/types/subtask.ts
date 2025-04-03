export default interface Subtask {  
  id: string; // Thêm thuộc tính id
  title: string;
  deadline: string;
  progress: number;
  completed: boolean; // Thêm thuộc tính này nếu chưa có
  labelColor: string; // Nhãn màu sắc
  description: string; // Mô tả nhiệm vụ con
  checklist: { id: string; title: string; completed: boolean }[]; // Danh sách mục tiêu
  attachments?: { name: string; url: string }[]; // Danh sách file đính kèm
}
