import Message from "./Message";
interface Room {
    id: string;
    name: string;
    ownerId: string;
    membersId: string[];
    date: Date;
    messages: Message[];
    state: string;
  }
  export default Room;