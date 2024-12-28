import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
      Home: undefined;
      NhiemVu: undefined;
      Notifications: undefined;
      DanhSachPhong:undefined;
      PhongHoc: {roomId:string; roomName:string};
      Profile: { userId: string; userData: { id: number; fullName: string; email: string; password: string; role: string } };
  DangKy: undefined;
  DangNhap: { userData: { id: number; fullName: string; email: string; password: string; role: string } };
};
