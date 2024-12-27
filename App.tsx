import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './app/user/screens/Home';
import NhiemVu from './app/user/screens/NhiemVu';
import Notifications from './app/user/screens/Notifications';
import PhongHoc from './app/user/screens/PhongHoc';
import Profile from './app/user/screens/Profile';

export type RootStackParamList = {
  Home: undefined;
  NhiemVu: undefined;
  Notifications: undefined;
  PhongHoc: undefined;
  Profile: { userId: string };
};
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="NhiemVu" component={NhiemVu} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="PhongHoc" component={PhongHoc} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
