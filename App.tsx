import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './app/user/screens/Home';
import NhiemVu from './app/user/screens/NhiemVu';
import Notifications from './app/user/screens/Notifications';
import PhongHoc from './app/user/screens/PhongHoc';
import Profile from './app/user/screens/Profile';
import DangNhap from './app/user/screens/DangNhap';
import DangKy from './app/user/screens/DangKy';
import DanhSachPhong from './app/user/screens/DanhSachPhong';
import UserFooter from './app/user/components/UserFooter';
import { RootStackParamList } from './app/user/screens/types/RootStackParamList';
import UploadScreen from './app/user/screens/UploadScreen';
import UpAppWrite from './app/user/screens/UpAppWrite';
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UpAppWrite">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="NhiemVu" component={NhiemVu} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="DanhSachPhong" component={DanhSachPhong} />
        <Stack.Screen name="PhongHoc" component={PhongHoc} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="UserFooter" component={UserFooter} />
        <Stack.Screen name='DangNhap' component={DangNhap} />
        <Stack.Screen name='DangKy' component={DangKy}/>
        <Stack.Screen name='UploadScreen' component={UploadScreen}/>
        <Stack.Screen name='UpAppWrite' component={UpAppWrite}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}