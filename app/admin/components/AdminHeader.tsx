import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Admin Panel</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdminHeader;
