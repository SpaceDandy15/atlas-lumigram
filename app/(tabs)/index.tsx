import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, Alert, StyleSheet, RefreshControl } from "react-native";
import { FlashList } from "@shopify/flash-list";
import {
  GestureHandlerRootView,
  TapGestureHandler,
  LongPressGestureHandler,
  State
} from "react-native-gesture-handler";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp
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

  const fetchPosts = useCallback(async (refresh = false) => {
    if (loading) return;
    setLoading(true);

    try {
      let q;
      if (refresh || !lastDoc) {
        q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(PAGE_SIZE));
      } else {
        const lastValue = lastDoc.data().createdAt?.toMillis
          ? lastDoc.data().createdAt.toMillis()
          : Date.now();
        q = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          startAfter(lastValue),
          limit(PAGE_SIZE)
        );
      }

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setReachedEnd(true);
      } else {
        if (refresh) setPosts(snapshot.docs);
        else setPosts(prev => [...prev, ...snapshot.docs]);

        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      }
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      Alert.alert("Error", "Could not load posts");
    } finally {
      setLoading(false);
      if (refresh) setRefreshing(false);
    }
  }, [lastDoc, loading]);

  useEffect(() => {
    fetchPosts(true);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setLastDoc(null);
    setReachedEnd(false);
    fetchPosts(true);
  };

  const handleEndReached = () => {
    if (!reachedEnd) fetchPosts();
  };

  const handleNewPost = (newPost: QueryDocumentSnapshot<DocumentData>) => {
    // Prepend the new post to the feed
    setPosts(prev => [newPost, ...prev]);
  };

  const renderItem = ({ item }: { item: QueryDocumentSnapshot<DocumentData> }) => {
    const data = item.data();
    return (
      <LongPressGestureHandler
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.ACTIVE) setVisibleCaptionId(item.id);
          else if (nativeEvent.state === State.END) setVisibleCaptionId(null);
        }}
        minDurationMs={400}
      >
        <TapGestureHandler
          numberOfTaps={2}
          onActivated={() => Alert.alert("Double tapped!")}
        >
          <View style={styles.item}>
            <Image source={{ uri: data.imageUrl }} style={styles.image} />
            {visibleCaptionId === item.id && (
              <View style={styles.captionOverlay}>
                <Text style={styles.captionText}>{data.caption}</Text>
              </View>
            )}
          </View>
        </TapGestureHandler>
      </LongPressGestureHandler>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FlashList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={320}
        onEndReached={handleEndReached}
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