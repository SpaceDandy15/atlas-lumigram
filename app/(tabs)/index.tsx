import React, { useState, useCallback } from "react";
import { View, Text, Image, Alert, StyleSheet, RefreshControl } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useFocusEffect } from "@react-navigation/native";
import { GestureHandlerRootView, Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  getDocs,
  addDoc,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useAuth } from "../../AuthProvider";

const PAGE_SIZE = 5;

export default function HomeScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [visibleCaptionId, setVisibleCaptionId] = useState<string | null>(null);

  // Real-time listener for first page
  const subscribeToPosts = useCallback(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(PAGE_SIZE));
    return onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        if (!snapshot.empty) {
          setPosts(snapshot.docs);
          setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
          setReachedEnd(snapshot.docs.length < PAGE_SIZE);
        } else {
          setPosts([]);
          setReachedEnd(true);
        }
      },
      (error) => {
        console.error("Error listening to posts:", error);
        Alert.alert("Error", "Could not load posts");
      }
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = subscribeToPosts();
      return () => unsubscribe();
    }, [subscribeToPosts])
  );

  const fetchMorePosts = async () => {
    if (loading || reachedEnd || !lastDoc) return;
    setLoading(true);
    try {
      const nextQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
      const snapshot = await getDocs(nextQuery);
      if (!snapshot.empty) {
        setPosts((prev) => [...prev, ...snapshot.docs]);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        if (snapshot.docs.length < PAGE_SIZE) setReachedEnd(true);
      } else {
        setReachedEnd(true);
      }
    } catch (error: any) {
      console.error("Error fetching more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setLastDoc(null);
    setReachedEnd(false);
    subscribeToPosts();
    setRefreshing(false);
  };

  const handleNewPost = (newPost: QueryDocumentSnapshot<DocumentData>) => {
    setPosts((prev) => [newPost, ...prev]);
    setLastDoc(null);
    setReachedEnd(false);
  };

  const renderItem = ({ item }: { item: QueryDocumentSnapshot<DocumentData> }) => {
    const data = item.data();

    //JS function for double-tap
    const handleDoubleTap = async () => {
      if (!user) return Alert.alert("Not signed in", "Please log in to favorite posts.");
      try {
        await addDoc(collection(db, "favorites"), {
          userId: user.uid,
          postId: item.id,
          imageUrl: data.imageUrl,
          caption: data.caption,
          createdAt: serverTimestamp(),
          createdAtMillis: Date.now(),
        });
        Alert.alert("Added to Favorites!");
      } catch (error) {
        console.error("Error adding favorite:", error);
        Alert.alert("Error", "Could not add favorite.");
      }
    };

    const doubleTap = Gesture.Tap()
      .numberOfTaps(2)
      .runOnJS(true)
      .onStart(handleDoubleTap);

    const longPress = Gesture.LongPress()
      .minDuration(400)
      .runOnJS(true)
      .onStart(() => setVisibleCaptionId(item.id));

    const gesture = Gesture.Race(doubleTap, longPress);

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
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={320}
        onEndReached={fetchMorePosts}
        onEndReachedThreshold={0.5}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  item: {
    marginVertical: 10,
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  captionOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  captionText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
