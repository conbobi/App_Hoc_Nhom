// Define the Message type
interface Message {
  id: string;
  content: string;
  senderId: string; // Add this line if it's missing
  timestamp: Date;
}
export default Message;