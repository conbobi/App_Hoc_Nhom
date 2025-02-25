import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../screens/types/RootStackParamList';

type NavigationProp = DrawerNavigationProp<RootStackParamList>;

const UserHeader = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // Thực hiện tìm kiếm hoặc lọc dữ liệu dựa trên searchQuery
    console.log('Searching for:', searchQuery);
  };

  return (
    <View>
    <View style={styles.topBar} />
    <View style={styles.header}>
     <TouchableOpacity onPress={() => navigation.openDrawer()}>
     <Ionicons name="filter" size={28} color="#fff" />
      </TouchableOpacity>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="add-circle" size={26} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="qr-code" size={24} color="#fff" />  
        </TouchableOpacity>

      </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    height: 45,
    backgroundColor: '#0000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 15,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0056b3',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginLeft: 10,
    flex: 10,
    marginRight: 5,
    height: 35,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10, 
    fontSize: 18,
  },

iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
iconButton: {
  marginLeft: 20,
},

});

export default UserHeader;