import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, Image, StyleSheet } from 'react-native';
// @ts-ignore
import { useNavigation } from '@react-navigation/native';
import UserData from '../screens/types/UserData';
import firebase from 'firebase/compat/app';

const BanBeTab = () => {
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<UserData[]>([]);

  const searchUserDataByFullName = async () => {
    const snapshot = await firebase.firestore().collection('users').get();
    const allUsers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as UserData[];

    const filtered = allUsers.filter(user =>
      user.fullName?.toLowerCase().includes(searchText.toLowerCase())
    );

    setSearchResults(filtered);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm bạn bè theo tên..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <TouchableOpacity style={styles.searchButton} onPress={searchUserDataByFullName}>
        <Text style={styles.buttonText}>Tìm kiếm</Text>
      </TouchableOpacity>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
<TouchableOpacity
  style={styles.item}
  onPress={() => navigation.navigate('UserOther', { userId: item.id })}  // CHỈ TRUYỀN item.id
>
  <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
  <Text>{item.fullName}</Text>
</TouchableOpacity>

        )}
      />
    </View>
  );
};

export default BanBeTab;

const styles = StyleSheet.create({
  container: { padding: 10 },
  searchInput: { borderWidth: 1, padding: 8, borderRadius: 5 },
  searchButton: { backgroundColor: 'blue', marginTop: 10, padding: 10 },
  buttonText: { color: 'white', textAlign: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
});
