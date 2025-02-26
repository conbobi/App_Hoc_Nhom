import { NavigatorScreenParams } from '@react-navigation/native';

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
  Home: { userData: { id: string; fullName: string; email: string; password: string; role: string; avatarUri?: string  } };
  NhiemVu: { userData: { id: string; fullName: string; email: string; password: string; role: string; avatarUri?: string  } };
  Notifications: { userData: { id: string; fullName: string; email: string; password: string; role: string; avatarUri?: string  } };
  DanhSachPhong: { userData: { id: number; fullName: string; email: string; password: string; role: string; avatarUri?: string  } };
  UserFooter: { userData: { id: number; fullName: string; email: string; password: string; role: string; avatarUri?: string  } };
  ChiTietPhong: { roomId: string; roomName: string; ownerId: string; files: string[]; images: string[] };
  PhongHoc: { roomId: string; roomName: string; ownerId: string; membersId: string[] };
  Profile: { userId: string; userData: { id: string; fullName: string; email: string; password: string; role: string; avatarUri?: string } };
  DangKy: undefined;
  DangNhap: { userData?: { id?: number; fullName?: string; email?: string; password?: string; role?: string } };
  QuenMatKhau: undefined;
  VideoCall: undefined;
};