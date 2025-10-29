import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../../firebaseConfig';
import { useAuth } from '../../AuthProvider';

export default function AddPostScreen() {
  const { user } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  // Pick an image from gallery
  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Camera roll access is required.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // ✅ FIXED
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Error picking image:', err);
      Alert.alert('Error', 'Something went wrong while selecting an image.');
    }
  };

  // Upload image and save post to Firestore
  const handleSave = async () => {
    if (!user) return Alert.alert('Not signed in', 'Please log in to post.');
    if (!image) return Alert.alert('No image', 'Select an image before posting.');

    setLoading(true);

    try {
      // Convert image to blob
      const response = await fetch(image);
      const blob = await response.blob();

      // Upload to Firebase Storage
      const imageRef = ref(storage, `posts/${user.uid}_${Date.now()}.jpg`);
      await uploadBytes(imageRef, blob);

      // Get download URL
      const downloadURL = await getDownloadURL(imageRef);

      // Add post to Firestore
      await addDoc(collection(db, 'posts'), {
        imageUrl: downloadURL,
        caption,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      });

      Alert.alert('Success', 'Post uploaded successfully!');
      setImage(null);
      setCaption('');
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('Upload failed', error.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Post</Text>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={styles.imagePlaceholder}>Tap to select an image</Text>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.captionInput}
          placeholder="Add a caption"
          placeholderTextColor="#888"
          value={caption}
          onChangeText={setCaption}
        />

        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', color: '#000', marginBottom: 20 },
  imagePicker: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  image: { width: '100%', height: '100%', borderRadius: 10 },
  imagePlaceholder: { color: '#666', fontSize: 16 },
  captionInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
  },
  saveButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
