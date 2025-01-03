import React, { useState } from 'react';
import { View, Button, Image, StyleSheet, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { account, storage, bucketId } from '../../../appwriteConfig';

const UpAppWrite = () => {
  const [image, setImage] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const handleLogin = async () => {
    try {
      const session = await account.createSession(email, password);
      setUserId(session.userId);
      Alert.alert('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login failed', (error as any).message || 'Unknown error');
    }
  };

  const handleRegister = async () => {
    try {
      const user = await account.create('unique()', email, password, userName);
      setUserId(user.$id);
      Alert.alert('Registration successful');
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Registration failed', (error as any).message || 'Unknown error');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (image && userId) {
      try {
        const fileUri = await FileSystem.downloadAsync(image, FileSystem.documentDirectory + 'temp.jpg');
        const file = await fetch(fileUri.uri)
          .then(res => res.blob())
          .then(blob => new File([blob], 'photo.jpg', { type: 'image/jpeg' }));

        const response = await storage.createFile(bucketId, 'unique()', file);
        console.log('File uploaded successfully:', response);
        Alert.alert('Upload successful', `File ID: ${response.$id}`);
      } catch (error) {
        console.error('Error uploading file:', error);
        Alert.alert('Upload failed', (error as any).message || 'Unknown error');
      }
    } else {
      Alert.alert('No image selected or not logged in');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {!isLogin && (
        <TextInput
          placeholder="User Name"
          value={userName}
          onChangeText={setUserName}
          style={styles.input}
        />
      )}
      <Button title={isLogin ? "Login" : "Register"} onPress={isLogin ? handleLogin : handleRegister} />
      <Button title={isLogin ? "Switch to Register" : "Switch to Login"} onPress={() => setIsLogin(!isLogin)} />
      {userId && (
        <>
          <Button title="Pick an image from camera roll" onPress={pickImage} />
          {image && <Image source={{ uri: image }} style={styles.image} />}
          <Button title="Upload to AppWrite" onPress={handleUpload} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});

export default UpAppWrite;