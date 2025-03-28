import { NavigatorScreenParams } from '@react-navigation/native';
import UserData from './UserData';
import ChatScreen from '../ChatScreen';
export type RootStackParamList = {
  // admin
  AdminDashboard: undefined;
  EditGroup: { groupId: string };
  AdminProfile: { userId: string };
  AdminNotification: undefined;
  AdminGroup: { groupId: string };
  AdminUser: { userId: string };
  AdminRoom: { roomId: string };
  AdminMessage: { message: string };
  AdminSetting: undefined;
  AdminReport: undefined;
  AdminFeedback: undefined;
  AdminHelp: undefined;
  AdminAbout: undefined;
  AdminLogout: undefined;
  AdminLogin: undefined;
  QlNhom: undefined;
  UserManagement: undefined;
  GroupDetail: { groupId: string };
  AdminAcc: undefined;
  HomeAdmin: undefined;
  // user
  Home: { UserData: { id: string; fullName: string; email: string; password: string; role: string; avatarUri?: string  } };
  NhiemVu: { UserData: { id: string; fullName: string; email: string; password: string; role: string; avatarUri?: string  } };
  Notifications: { UserData: { id: string; fullName: string; email: string; password: string; role: string; avatarUri?: string  } };
  DanhSachPhong: { UserData: { id: number; fullName: string; email: string; password: string; role: string; avatarUri?: string  } };
  UserFooter: { UserData: { id: number; fullName: string; email: string; password: string; role: string; avatarUri?: string  } };
  ChiTietPhong: { roomId: string; roomName: string; ownerId: string; files: string[]; images: string[] , TotalMembers: number };
  PhongHoc: { roomId: string; roomName: string; ownerId: string; membersId: string[] };
  Profile: { userId: string; UserData: { id: string; fullName: string; email: string; password: string; role: string; avatarUri?: string } };
  DangKy: undefined;
  DangNhap: { UserData?: { id?: number; fullName?: string; email?: string; password?: string; role?: string } };
  QuenMatKhau: undefined;
  VideoCall: undefined;
  MessageAllUser: { currentUser: UserData }; // Cần chắc chắn UserData đã được khai báo
  ChatScreen: { senderData: UserData; receiverId: string }; // Đảm bảo senderData có kiểu UserData
};
