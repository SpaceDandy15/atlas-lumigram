import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, Text } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter(); // for navigation

  // Small logout button component for header
  const LogoutButton = () => (
  <Pressable
    onPress={() => router.replace('/login')}
    style={{ marginRight: 15 }}
  >
    <IconSymbol size={24} name="rectangle.portrait.and.arrow.right.fill" color={Colors[colorScheme ?? 'light'].tint} />
  </Pressable>
);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        headerRight: () => <LogoutButton />, // 👈 adds logout to header
        tabBarStyle: Platform.select({
          ios: { position: 'absolute' },
          default: {},
        }),
      }}
    >
      {/* Home tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      {/* Search tab */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="magnifyingglass" color={color} />
          ),
        }}
      />

      {/* Add Post tab */}
      <Tabs.Screen
        name="add-post"
        options={{
          title: 'Add Post',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="plus.circle.fill" color={color} />
          ),
        }}
      />

      {/* Favorites tab */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="heart.fill" color={color} />
          ),
        }}
      />

      {/* Profile tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Profile',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
