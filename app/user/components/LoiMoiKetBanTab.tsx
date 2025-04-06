import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import firebase from 'firebase/compat/app';
import { Image } from 'react-native-animatable';
interface FriendRequest {
  id: string;
  SenderID: string;
  RecipterID: string;
}

const LoiMoiKetBanTab = ({ currentUserId }: { currentUserId: string }) => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    const unsubscribe = firebase.firestore()
      .collection('MakeFriend')
      .where('RecipterID', '==', currentUserId)
      .onSnapshot(snapshot => {
        const requests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FriendRequest[];
        setFriendRequests(requests);
      });

    return () => unsubscribe();
  }, []);

  const acceptFriend = async (request: FriendRequest) => {
    const { SenderID, RecipterID } = request;
  
    try {
      const db = firebase.firestore();
  
      const batch = db.batch();
  
      const senderFriendRef = db.collection('ListFriend').doc(SenderID);
      const recipterFriendRef = db.collection('ListFriend').doc(RecipterID);
  
      // Cập nhật cho SenderID
      batch.set(senderFriendRef, {
        Friends: firebase.firestore.FieldValue.arrayUnion(RecipterID)
      }, { merge: true });
  
      // Cập nhật cho RecipterID
      batch.set(recipterFriendRef, {
        Friends: firebase.firestore.FieldValue.arrayUnion(SenderID)
      }, { merge: true });
  
      // Xóa yêu cầu kết bạn
      batch.delete(db.collection('MakeFriend').doc(request.id));
  
      await batch.commit();
  
      Alert.alert("✅ Thành công", "Bạn đã chấp nhận lời mời kết bạn!");
    } catch (err) {
      console.error("❌ Lỗi khi chấp nhận lời mời kết bạn:", err);
    }
  };
  

  return (
    <View style={styles.container}>
      <FlatList
        data={friendRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.requestItem}>
            <Text>{item.SenderID}</Text>
            <Image source={{ uri: item.RecipterID }} style={styles.avatar} />
            <TouchableOpacity onPress={() => acceptFriend(item)} style={styles.button}>
              <Text style={styles.buttonText}>Đồng ý</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default LoiMoiKetBanTab;

const styles = StyleSheet.create({
  container: { padding: 10 },
  requestItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  button: { backgroundColor: '#007AFF', padding: 10 },
  buttonText: { color: 'white' },
  input: { borderWidth: 1, padding: 8, borderRadius: 5 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  avatarUri:{ width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  fullName: { fontSize: 16, fontWeight: 'bold' },
});
