import React, { useState, useEffect } from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Google from 'expo-auth-session/providers/google';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';

const CLIENT_ID = '875870614648-bfpe3fit950oqup2ukn3ovpoerk8bevu.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBLQqdvFKpB_tzfYx7E9hP2cqhtZKVxmMk';

async function uploadFileToDrive(fileUri: string, accessToken: string) {
  const file = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=media&key=' + API_KEY, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/octet-stream',
    },
    body: file,
  });

  const result = await response.json();
  return result;
}

const UploadScreen = () => {
  const [image, setImage] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: CLIENT_ID,
    iosClientId: CLIENT_ID,
    androidClientId: CLIENT_ID,
    webClientId: CLIENT_ID,
    redirectUri: makeRedirectUri({
      native: 'myapp:/oauth2redirect',
    }),
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      setAccessToken(authentication?.accessToken || null);
    }
  }, [response]);

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
    if (image && accessToken) {
      try {
        const result = await uploadFileToDrive(image, accessToken);
        console.log('File uploaded successfully:', result);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {accessToken ? (
        <Button title="Upload to Google Drive" onPress={handleUpload} />
      ) : (
        <Button title="Sign in with Google" onPress={() => promptAsync()} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});

export default UploadScreen;