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
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#6c757d',
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
});

export default styles;
