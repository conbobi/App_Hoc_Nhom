import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminSidebar = () => {
  return (
    <View style={styles.sidebarContainer}>
      <Text style={styles.sidebarText}>Dashboard</Text>
      <Text style={styles.sidebarText}>Manage Users</Text>
      <Text style={styles.sidebarText}>Reports</Text>
      <Text style={styles.sidebarText}>Settings</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    width: 200,
    backgroundColor: '#555',
    padding: 10,
  },
  sidebarText: {
    color: '#fff',
    marginBottom: 10,
  },
});

export default AdminSidebar;