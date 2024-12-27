import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import Dashboard from './app/admin/screens/Dashboard';
import ManageUsers from './app/admin/screens/ManageUsers';
import Home from './app/user/screens/Home';
import Profile from './app/user/screens/Profile';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Profile">
        {/* User Screens */}
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />

        {/* Admin Screens */}
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="ManageUsers" component={ManageUsers} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
