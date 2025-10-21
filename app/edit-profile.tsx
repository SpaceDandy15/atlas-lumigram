import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function EditProfileScreen() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState('https://placedog.net/400x400?id=11');
  const [username, setUsername] = useState('atlas-lumi');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const saveProfile = () => {
    Alert.alert('Profile Saved!', `Username: ${username}`);
    router.back(); // navigate back to Profile screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TouchableOpacity onPress={pickImage}>
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 10,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: 'black',
  },
});
