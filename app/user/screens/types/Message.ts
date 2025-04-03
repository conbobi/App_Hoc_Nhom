import firebase from "firebase/compat/app";
interface Message {
  id: string;
  content: string;
  image?: string | null;
  file?: string | null;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId?: string;
  timestamp: firebase.firestore.Timestamp;
}
export default Message;