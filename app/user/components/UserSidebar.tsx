import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type UserSidebarProps = {
    onClose: () => void; // Định nghĩa kiểu dữ liệu cho onClose
  };

export default function UserSidebar({ onClose }:UserSidebarProps) {
  return (
    <View style={styles.sidebar}>
      <Text style={styles.title}>Menu</Text>

      <TouchableOpacity style={styles.menuItem} onPress={() => alert('Trang Hồ Sơ')}>
        <Text style={styles.menuText}>Hồ Sơ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => alert('Trang Cài Đặt')}>
        <Text style={styles.menuText}>Cài Đặt</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => alert('Trang Trợ Giúp')}>
        <Text style={styles.menuText}>Trợ Giúp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeText}>Đóng</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '70%',
    height: '100%',
    backgroundColor: '#f8f9fa',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuText: {
    fontSize: 18,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#dc3545',
    borderRadius: 5,
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
  },
});
