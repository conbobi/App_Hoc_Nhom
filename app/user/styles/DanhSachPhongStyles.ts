import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    roomList: { marginBottom: 20 },
    roomItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 15,
      backgroundColor: '#f5f5f5',
      borderRadius: 10,
      marginBottom: 10,
    },
    roomName: { fontSize: 18 },
    messageBadge: {
      backgroundColor: 'red',
      borderRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    messageBadgeText: { color: '#fff', fontWeight: 'bold' },
    actionContainer: { flexDirection: 'row', alignItems: 'center' },
    button: {
      backgroundColor: '#007bff',
      padding: 10,
      borderRadius: 10,
      marginLeft: 10,
    },
    buttonText: { color: '#fff' },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      paddingHorizontal: 10,
    },
  });
export default styles;