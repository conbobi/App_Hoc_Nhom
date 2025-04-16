import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
import { Linking, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { Modal, TouchableOpacity } from 'react-native';
const MANAGEMENT_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NDQ2MjU0NzMsImV4cCI6MTc0NTIzMDI3MywianRpIjoiNDc1MmE2MjAtYWFhNS00ZGFkLTkxNWMtYWUwZWIzMjMxYzY4IiwidHlwZSI6Im1hbmFnZW1lbnQiLCJ2ZXJzaW9uIjoyLCJuYmYiOjE3NDQ2MjU0NzMsImFjY2Vzc19rZXkiOiI2N2Y3YWExNzQ5NDRmMDY3MzEzYTk1YzEifQ.z2xntHmYJ7blK5F9w75qXz6LMz72rKUuexeXRnQLBzg"; // rút gọn vì bảo mật
const SUBDOMAIN = "tien-livestream-2011";
const getTemplates = async () => {
  const res = await fetch('https://api.100ms.live/v2/templates', {
    headers: {
      Authorization: `Bearer ${MANAGEMENT_TOKEN}`,
    },
  });
  const data = await res.json();
  console.log('Danh sách template:', data);
};

interface RoomItem {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
  customer_id: string;
  app_id: string;
  recording_info: any; // hoặc thay bằng interface nếu bạn có
  template_id: string;
  template: string;
  region: string;
  created_at: string;
  updated_at: string;
  customer: string;
  large_room: boolean;
  slug: string;
}
const VideoCall = () => {
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  let rawRooms: RoomItem[] = [];
  const route = useRoute();
  const { roomId } = route.params as { roomId: string };
  const [webViewUrl, setWebViewUrl] = useState<string | null>(null);
  const [qrVisible, setQrVisible] = useState(false);
const [qrLink, setQrLink] = useState<string | null>(null);
  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.100ms.live/v2/rooms', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${MANAGEMENT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      let rawRooms: RoomItem[] = [];
  
      if (Array.isArray(data.data)) {
        rawRooms = data.data;
      } else if (Array.isArray(data.rooms)) {
        rawRooms = data.rooms;
      } else if (Array.isArray(data)) {
        rawRooms = data;
      } else {
        console.warn("Không rõ cấu trúc rooms, đang dùng fallback");
        rawRooms = [data];
      }
  
      // ✅ Lọc ra những phòng đang hoạt động
      const activeRooms = rawRooms.filter(room => room.enabled === true && room.description?.includes(`roomId:${roomId}`));
      setRooms(activeRooms);
  
    } catch (err) {
      console.error('Lỗi lấy danh sách phòng:', err);
    }
    setLoading(false);
  };
  

  useEffect(() => {
    fetchRooms();
  }, []);

  const createRoom = async () => {
    try {
      const response = await fetch('https://api.100ms.live/v2/rooms', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${MANAGEMENT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `room-${Date.now()}`,
          description: `roomId:${roomId}`,
          template_id: '67f7c3804b6eb78daeedd585',
        }),
      });
      const data = await response.json();
      console.log('Đã tạo phòng:', data);
      setTimeout(fetchRooms, 1000); // Delay ngắn để đợi server cập nhật
    } catch (err) {
      console.error('Lỗi tạo phòng:', err);
    }
  };

  const disableRoom = async (roomId: string) => {
    try {
      const response = await fetch(`https://api.100ms.live/v2/rooms/${roomId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${MANAGEMENT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled: false,
        }),
      });
  
      const result = await response.json();
      console.log(`Kết quả từ server khi disable room ${roomId}:`, result); // ✅ Log phản hồi để xem có lỗi hay thông báo gì không
  
      fetchRooms(); // Refresh danh sách
    } catch (err) {
      console.error('Lỗi khi vô hiệu hóa phòng:', err);
    }
  };
  const showQRModal = (slug: string) => {
    const link = `https://${SUBDOMAIN}.app.100ms.live/streaming/meeting/${slug}`;
    setQrLink(link);
    setQrVisible(true);
  };
  
  const toggleRoomStatus = async (roomId: string, currentEnabled: boolean) => {
    try {
      const response = await fetch(`https://api.100ms.live/v2/rooms/${roomId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${MANAGEMENT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled: !currentEnabled, // đảo ngược trạng thái hiện tại
        }),
      });
  
      const result = await response.json();
      console.log(`Đã cập nhật trạng thái phòng ${roomId}:`, result);
  
      fetchRooms(); // Cập nhật lại danh sách phòng
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái phòng:', err);
    }
  };
  
  const copyLinkToClipboard = async (slug: string) => {
    const link = `https://${SUBDOMAIN}.app.100ms.live/streaming/meeting/${slug}`;
    await Clipboard.setStringAsync(link);
    Alert.alert("Đã sao chép", "Link phòng đã được sao chép vào clipboard");
  };
  
  const renderRoom = ({ item }: { item: RoomItem }) => (
    <View style={styles.roomContainer}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>{item.description}</Text>
      <Text style={styles.time}>Tạo lúc: {new Date(item.created_at).toLocaleString()}</Text>
      <Text>Trạng thái: {item.enabled ? '🟢 Đang bật' : '🔴 Đang tắt'}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}></View>
      <Button
        title={item.enabled ? 'Tắt phòng' : 'Bật phòng'}
        color={item.enabled ? 'orange' : 'green'}
        onPress={() => toggleRoomStatus(item.id, item.enabled)}
      />
      <Button
        title="❌ Vô hiệu hóa"
        color="red"
        onPress={() => disableRoom(item.id)}
      />
      <Button
          title="📺 Vào phòng"
          color="blue"
          onPress={() => joinRoomInWebView(item.slug)}
        />
      <Button
  title="📋 Sao chép link"
  color="#666"
  onPress={() => copyLinkToClipboard(item.slug)}
/>
<Button
  title="🔳 Mã QR"
  color="#333"
  onPress={() => showQRModal(item.slug)}
/>
    </View>
  );

  const joinRoomInWebView =async (slug: string) => {
    const url = `https://${SUBDOMAIN}.app.100ms.live/streaming/meeting/${slug}`; // hoặc /meeting nếu cần join luôn
    setWebViewUrl(url);
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url); // ✅ Mở bằng trình duyệt mặc định
    } else {
      Alert.alert("Lỗi", "Không thể mở link");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {webViewUrl ? (
        <WebView source={{ uri: webViewUrl }} style={{ flex: 1 }} />
      ) : (
        <>
          <Button title="➕ Tạo phòng" onPress={createRoom} />
          {loading ? (
            <ActivityIndicator size="large" color="#00f" />
          ) : (
            <FlatList
              data={rooms}
              keyExtractor={(item) => item.id}
              renderItem={renderRoom}
              ListEmptyComponent={<Text>Không có phòng nào</Text>}
            />
          )}
        </>
        
      )}
      <Modal visible={qrVisible} transparent={true} animationType="slide">
  <View style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  }}>
    <View style={{
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    }}>
      <Text style={{ marginBottom: 10, fontSize: 16 }}>Quét để vào phòng</Text>
      {qrLink && <QRCode value={qrLink} size={200} />}
      <TouchableOpacity
        onPress={() => setQrVisible(false)}
        style={{ marginTop: 20, padding: 10, backgroundColor: 'gray', borderRadius: 5 }}
      >
        <Text style={{ color: 'white' }}>Đóng</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </SafeAreaView>
  );  
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  roomContainer: {
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  time: {
    fontSize: 14,
    color: 'gray',
  },
});

export default VideoCall;