import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
// @ts-ignore
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import UserData from '../screens/types/UserData';
import { Image } from 'react-native-animatable';
const TimKiemTab = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<UserData[]>([]);
  const navigation = useNavigation<any>();

  const searchUserDataByEmail = async () => {
    const snapshot = await firebase.firestore().collection('users').where('email', '==', searchText).get();
    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UserData[];
    setSearchResults(results);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nhập email người dùng"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.input}
      />
      <TouchableOpacity onPress={searchUserDataByEmail} style={styles.button}>
        <Text style={styles.buttonText}>Tìm</Text>
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

export default TimKiemTab;

const styles = StyleSheet.create({
  container: { padding: 10 },
  input: { borderWidth: 1, padding: 8, borderRadius: 5 },
  button: { backgroundColor: 'green', marginTop: 10, padding: 10 },
  buttonText: { color: 'white', textAlign: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  item: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
});
