import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;

  NhiemVu: undefined;

  Notifications: undefined;

  DanhSachPhong: { userData: any };

  Profile: { userId: string; userData: { id: number; fullName: string; email: string; password: string; role: string; imageUri: string; } };
PhongHoc: { roomId: string; roomName: string; ownerId: string; };
  DangKy: undefined;

UserFooter: undefined;

  DangNhap: undefined;
};
