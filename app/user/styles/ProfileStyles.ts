import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    top: 10, // Khoảng cách từ đỉnh màn hình
    left: 10, // Khoảng cách từ cạnh trái
    zIndex: 10, // Đảm bảo nút menu luôn nằm phía trên các phần tử khác
    backgroundColor: '#007bff', // Màu nền (có thể thay đổi)
    padding: 10, // Khoảng cách bên trong
    borderRadius: 5, // Bo góc
    shadowColor: '#000', // Đổ bóng
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // Đổ bóng cho Android
  },
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
  alignContent: 'center',
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 20,
    
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343a40',
    marginTop: 10,
  },
  input: {
    fontSize: 16,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ced4da',
    borderWidth: 1,
    marginTop: 5,
  },
  chartContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 8,
    marginBottom:50
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },

  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#f06292',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  changePasswordButton: {
    backgroundColor: '#ba68c8',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  signOutButton: {
    backgroundColor: '#ff8a65',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default styles;
