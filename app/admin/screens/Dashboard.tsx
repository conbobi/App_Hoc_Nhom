import React from 'react';
import { View, Text } from 'react-native';
import AdminHeader from '../components/AdminHeader';
import AdminSidebar from '../components/AdminSidebar';
import { styles } from '../styles/DashboardStyles';

const Dashboard = () => {
  return (
    <View style={styles.container}>
      <AdminHeader />
      <View style={styles.content}>
        <AdminSidebar />
        <View style={styles.mainContent}>
          <Text style={styles.title}>Welcome to the Admin Dashboard!</Text>
        </View>
      </View>
    </View>
  );
};

export default Dashboard;