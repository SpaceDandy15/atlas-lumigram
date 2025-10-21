import React from 'react';
import { View, Text, Image, Alert, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { favoritesFeed } from '@/placeholder'; // Use favorites feed data

export default function FavoritesScreen() {
  // Function to render each image item
  const renderItem = ({ item }: { item: typeof favoritesFeed[0] }) => {
    // --- Long press gesture ---
    const longPress = Gesture.LongPress()
      .runOnJS(true) // ensures it runs in JS thread
      .onStart(() => {
        Alert.alert('Caption', `Placeholder caption: ${item.caption}`);
      });

    // --- Double tap gesture ---
    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .runOnJS(true)
      .onStart(() => {
        Alert.alert('Double tapped! (placeholder for favorite)');
      });

    // Combine gestures safely
    const gesture = Gesture.Race(doubleTap, longPress);

    return (
      <GestureDetector gesture={gesture}>
        <View style={styles.item}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.caption}>{item.caption}</Text>
        </View>
      </GestureDetector>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Favorites</Text>

        <FlashList
          data={favoritesFeed}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          estimatedItemSize={320}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </GestureHandlerRootView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  item: {
    marginBottom: 16,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  caption: {
    marginTop: 8,
    fontSize: 16,
    color: '#000',
  },
});
