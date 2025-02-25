interface Message {
  id: string;
  content: string;
  image?: string | null;
  file?: string | null;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: firebase.default.firestore.Timestamp;
}
export default Message;