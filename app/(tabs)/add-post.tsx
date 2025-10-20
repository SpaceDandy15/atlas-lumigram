import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Keyboard, 
  TouchableWithoutFeedback 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function AddPostScreen() {
  // State to store the selected image URI
  const [image, setImage] = useState<string | null>(null);
  // State to store the caption text
  const [caption, setCaption] = useState('');

  // --- Function to handle selecting an image from camera roll
  const pickImage = async () => {
    // Ask for permission first
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    // Open the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    // If user picked an image, update the state
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // --- Function to handle "Save" button press (placeholder for now)
  const handleSave = () => {
    console.log('Post saved:', { image, caption });
    alert('Post saved! (placeholder behavior)');
  };

  // --- Function to reset image and caption
  const handleReset = () => {
    setImage(null);
    setCaption('');
  };

  return (
    // Dismiss the keyboard when tapping outside input fields
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* --- Title at the top left corner --- */}
        <Text style={styles.title}>Add Post</Text>

        {/* --- Touchable area to pick an image --- */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={styles.imagePlaceholder}>Tap to select an image</Text>
          )}
        </TouchableOpacity>

        {/* --- Caption input field with visible placeholder --- */}
        <TextInput
          style={styles.captionInput}
          placeholder="Add a caption"
          placeholderTextColor="#888"
          value={caption}
          onChangeText={setCaption}
        />

        {/* --- Green Save button --- */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        {/* --- Reset button underneath --- */}
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

// --- Stylesheet for layout and appearance ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
  },
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
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imagePlaceholder: {
    color: '#666',
    fontSize: 16,
  },
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
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: 'green',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#eee',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
});
