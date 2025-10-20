import React, { useState } from "react";
import { View, Text, Image, Alert, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { GestureHandlerRootView, TapGestureHandler, LongPressGestureHandler, State } from "react-native-gesture-handler";
import { homeFeed } from "@/placeholder";

export default function HomeScreen() {
  const [visibleCaptionId, setVisibleCaptionId] = useState<string | null>(null);

  const renderItem = ({ item }: { item: typeof homeFeed[0] }) => (
    <LongPressGestureHandler
      onHandlerStateChange={({ nativeEvent }) => {
        if (nativeEvent.state === State.ACTIVE) {
          setVisibleCaptionId(item.id);
        } else if (nativeEvent.state === State.END) {
          setVisibleCaptionId(null);
        }
      }}
      minDurationMs={400}
    >
      <TapGestureHandler
        numberOfTaps={2}
        onActivated={() => Alert.alert("Double tapped!")}
      >
        <View style={styles.item}>
          <Image source={{ uri: item.image }} style={styles.image} />
          {visibleCaptionId === item.id && (
            <View style={styles.captionOverlay}>
              <Text style={styles.captionText}>{item.caption}</Text>
            </View>
          )}
        </View>
      </TapGestureHandler>
    </LongPressGestureHandler>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FlashList
        data={homeFeed}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        estimatedItemSize={320}
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
