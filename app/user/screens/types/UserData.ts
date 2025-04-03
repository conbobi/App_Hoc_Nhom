type UserData = {
    id: string;
    avatarUri?: string;
    fullName: string;
    email: string;
    password: string;
    role: string;
    gender?: string; // Thêm giới tính nếu cần
    birthday?: string; // Thêm ngày sinh nếu cần
    phone?: string; // Thêm số điện thoại nếu cần
    };
    export default UserData;