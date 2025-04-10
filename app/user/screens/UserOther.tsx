import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { RootStackParamList } from './types/RootStackParamList';
import UserData from './types/UserData';
import { StackNavigationProp } from '@react-navigation/stack';


// Kiểu route
type UserOtherRouteProp = RouteProp<RootStackParamList, 'UserOther'>;

const UserOther: React.FC = () => {
  const route = useRoute<UserOtherRouteProp>();
  type NavigationProp = StackNavigationProp<RootStackParamList, 'UserOther'>;
const navigation = useNavigation<NavigationProp>();
  const { userId } = route.params as { userId: string };
  const [isFriend, setIsFriend] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const currentUserId = firebase.auth().currentUser?.uid;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        console.error('userId không hợp lệ:', userId);
        return;
      }
    
      try {
        const userDoc = await firebase.firestore().collection('users').doc(userId).get();
        if (userDoc.exists) {
          setUserData(userDoc.data() as UserData);
        } else {
          console.error('Không tìm thấy dữ liệu người dùng với userId:', userId);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu người dùng:', error);
      }
    };

    const checkFriendStatus = async () => {
      if (!currentUserId || !userId) return;
    
      try {
        const doc = await firebase.firestore().collection('ListFriend').doc(currentUserId).get();
        const friends = doc.exists ? doc.data()?.Friends || [] : [];
        console.log("👥 Danh sách bạn bè hiện tại:", friends);
     // Kiểm tra nếu danh sách bạn chứa object có id trùng userId
     const isFriendExists = friends.includes(userId);
        setIsFriend(isFriendExists);
      } catch (error) {
        console.error("❌ Lỗi khi kiểm tra trạng thái bạn bè:", error);
      }
    };
    

    fetchUserData();
    checkFriendStatus();
  }, [userId, currentUserId]);

  const sendFriendRequest = async () => {
    if (!currentUserId) return;
  
    try {
      await firebase.firestore().collection('MakeFriend').add({
        SenderID: currentUserId,
        SenderEmail: firebase.auth().currentUser?.email,
        SenderName: firebase.auth().currentUser?.displayName || "Người dùng",
        SenderAvatar: userData?.avatarUri || "",
        RecipterID: userId,
        Accept: false,
      });
  
      console.log('✅ Đã gửi lời mời kết bạn');
    } catch (error) {
      console.error('❌ Lỗi khi gửi lời mời kết bạn:', error);
    }
  };
  

  const removeFriend = async () => {
    if (!currentUserId) return;
  
    try {
      const db = firebase.firestore();
  
      const currentUserRef = db.collection('ListFriend').doc(currentUserId);
      const otherUserRef = db.collection('ListFriend').doc(userId);
  
      await currentUserRef.update({
        Friends: firebase.firestore.FieldValue.arrayRemove(userId),
      });
  
      await otherUserRef.update({
        Friends: firebase.firestore.FieldValue.arrayRemove({ currentUserId })
      });
  
      setIsFriend(false);
      console.log('✅ Đã hủy kết bạn');
    } catch (error) {
      console.error('❌ Lỗi khi hủy kết bạn:', error);
    }
  };
  
  

 

  if (!userData) {
    return <Text>Đang tải thông tin...</Text>;
  }
  
  const goToChat = () => {
    navigation.navigate("ChatScreen", {
      senderId: currentUserId || "",
      receiverId: userId,
    });
  };
  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: userData.avatarUri || 'https://default-avatar.com' }} style={styles.avatar} />
        <Text style={styles.fullName}>{userData.fullName}</Text>
        <Text style={styles.info}>{userData.email}</Text>
        <Text style={styles.info}>{userData.phone}</Text>
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
        
        <TouchableOpacity style={styles.messageButton} onPress={goToChat}>
          <Text style={{ color: 'white' }}>Nhắn tin</Text>
        </TouchableOpacity>
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
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  friendButton: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderRadius: 10,
  },
  messageButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
  },
});

export default UserOther;
