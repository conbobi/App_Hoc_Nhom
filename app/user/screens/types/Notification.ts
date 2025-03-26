import Message from "./Message";
import userData from "./UserData";
import Room from "./Room";
interface Notification {
    id: string;
    type: 'admin' | 'group' | 'user' | 'system'; // Loại thông báo
    title: string;
    content: Message;
    sender?: userData; // ID người gửi (nếu có)
    state: string;
    userData: userData;
    room: Room;
}
export default Notification;