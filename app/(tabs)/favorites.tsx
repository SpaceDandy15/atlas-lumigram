import React, { useState, useCallback } from 'react';
import { View, Text, Image, StyleSheet, RefreshControl, Alert } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useFocusEffect } from '@react-navigation/native';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  onSnapshot,
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useAuth } from '../../AuthProvider';

const PAGE_SIZE = 5;

export default function FavoritesScreen() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCaptionId, setVisibleCaptionId] = useState<string | null>(null);

  const subscribeToFavorites = useCallback(() => {
    if (!user) return () => {};
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(PAGE_SIZE)
    );

    return onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        setFavorites(snapshot.docs);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        setReachedEnd(snapshot.docs.length < PAGE_SIZE);
      },
      (error) => {
        console.error('Error fetching favorites:', error);
        Alert.alert('Error', 'Could not load favorites');
      }
    );
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = subscribeToFavorites();
      return () => unsubscribe();
    }, [subscribeToFavorites])
  );

  const fetchMoreFavorites = async () => {
    if (loading || reachedEnd || !lastDoc || !user) return;
    setLoading(true);
    try {
      const nextQuery = query(
        collection(db, 'favorites'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );

      const snapshot = await getDocs(nextQuery);
      if (!snapshot.empty) {
        setFavorites((prev) => [...prev, ...snapshot.docs]);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        if (snapshot.docs.length < PAGE_SIZE) setReachedEnd(true);
      } else {
        setReachedEnd(true);
      }
    } catch (error: any) {
      console.error('Error fetching more favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setLastDoc(null);
    setReachedEnd(false);
    subscribeToFavorites();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: QueryDocumentSnapshot<DocumentData> }) => {
    const data = item.data();

    const longPress = Gesture.LongPress()
      .minDuration(400)
      .runOnJS(true)
      .onStart(() => setVisibleCaptionId(item.id));

    const gesture = longPress;

    return (
      <GestureDetector gesture={gesture}>
        <View style={styles.item}>
          <Image source={{ uri: data.imageUrl }} style={styles.image} />
          {visibleCaptionId === item.id && (
            <View style={styles.captionOverlay}>
              <Text style={styles.captionText}>{data.caption}</Text>
            </View>
          )}
        </View>
      </GestureDetector>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FlashList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={320}
        onEndReached={fetchMoreFavorites}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  item: {
    marginVertical: 10,
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  captionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  captionText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});
