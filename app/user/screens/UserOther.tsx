import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { RootStackParamList } from './types/RootStackParamList';
import UserData from './types/UserData';

// Định nghĩa kiểu cho route
type UserOtherRouteProp = RouteProp<RootStackParamList, 'UserOther'>;

const UserOther: React.FC = () => {
  const route = useRoute<UserOtherRouteProp>();
  const { user } = route.params as { user: UserData };
  const [isFriend, setIsFriend] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const currentUserId = firebase.auth().currentUser?.uid;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firebase.firestore().collection('users').doc(user.id).get();
        if (userDoc.exists) {
          setUserData(userDoc.data() as UserData);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu người dùng:', error);
      }
    };

    const checkFriendStatus = async () => {
      const userFriendRef = firebase.firestore().collection('ListFriend').doc(currentUserId);
      const recipientFriendRef = firebase.firestore().collection('ListFriend').doc(user.id);

      await userFriendRef.set({
        Friends: firebase.firestore.FieldValue.arrayUnion({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          avatarUri: user.avatarUri,
        })
      }, { merge: true });

      await recipientFriendRef.set({
        Friends: firebase.firestore.FieldValue.arrayUnion({
          id: currentUserId,
          email: userData?.email,
          fullName: userData?.fullName,
          avatarUri: userData?.avatarUri,
        })
      }, { merge: true });
      console.log('Đã thêm vào danh sách bạn bè');
    };

    fetchUserData();
    checkFriendStatus();
  }, [user.id, currentUserId]);

  const sendFriendRequest = async () => {
    if (!currentUserId) return;
    try {
      await firebase.firestore().collection('MakeFriend').add({
        SenderID: currentUserId,
        SenderEmail: userData?.email,
        // SenderPhone: userData?.phone,
        SenderName: userData?.fullName,
        SenderAvatar: userData?.avatarUri,
        RecipterID: user.id,
        RecipterEmail: user.email,
        // RecipterPhone: user?.phone,
        RecipterName: user.fullName,
        RecipterAvatar: user?.avatarUri,
        Accept: false,
      });
      console.log('Đã gửi lời mời kết bạn');
    } catch (error) {
      console.error('Lỗi khi gửi lời mời kết bạn:', error);
    }
  };

  const removeFriend = async () => {
    if (!currentUserId) return;
    try {
      const friendListRef = firebase.firestore().collection('ListFriend').doc(currentUserId);
      const friendListDoc = await friendListRef.get();

      if (friendListDoc.exists) {
        const friends = friendListDoc.data()?.Friends || [];
        const updatedFriends = friends.filter((friendId: string) => friendId !== user.id);
        await friendListRef.update({ Friends: updatedFriends });
      }
      setIsFriend(false);
      console.log('Đã hủy kết bạn');
    } catch (error) {
      console.error('Lỗi khi hủy kết bạn:', error);
    }
  };

  if (!userData) {
    return <Text>Đang tải thông tin...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: userData.avatarUri || 'https://default-avatar.com' }} style={styles.avatar} />
        <Text style={styles.fullName}>{userData.fullName}</Text>
      </View>

      <View style={styles.actions}>
        {isFriend ? (
          <TouchableOpacity style={styles.friendButton} onPress={removeFriend}>
            <Text>Hủy kết bạn</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.friendButton} onPress={sendFriendRequest}>
            <Text>Kết bạn</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  fullName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  friendButton: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 5,
  },
  messageButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  details: {
    marginTop: 20,
  },
});

export default UserOther;