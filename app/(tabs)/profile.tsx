import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { profileFeed } from '@/placeholder';

export default function ProfileScreen() {
  const router = useRouter();

  // Placeholder user data
  const [username] = useState('atlas-lumi');
  const [profileImage] = useState('https://placedog.net/400x400?id=11');

  return (
    <View style={styles.container}>
      {/* Profile header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/edit-profile')}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        </TouchableOpacity>
        <Text style={styles.username}>{username}</Text>
      </View>

      {/* Posts grid */}
      <FlatList
        data={profileFeed}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image }} style={styles.postImage} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  postImage: {
    width: 120,
    height: 120,
    margin: 2,
  },
});
