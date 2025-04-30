import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Tabs } from 'expo-router';
import {
  Map,
  Cloud,
  FileText,
  Languages,
  Compass,
  Settings,
} from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            overflow: 'hidden',
            bottom: 20,
            left: 20,
            right: 20,
            elevation: 0,
            backgroundColor: isDark
              ? 'rgba(30, 41, 59, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            borderRadius: 24,
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            borderTopWidth: 0,
          },
          tabBarBackground: () => (
            <BlurView
              intensity={80}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ),
          tabBarLabelStyle: {
            fontFamily: 'Inter-Medium',
            fontSize: 12,
          },
          headerStyle: {
            backgroundColor: colors.background,
            elevation: 1,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
          headerTitleStyle: {
            fontFamily: 'Poppins-SemiBold',
            fontSize: 20,
            color: colors.text,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, size }) => (
              <Compass size={size} color={color} />
            ),
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: 'Safety Map',
            tabBarIcon: ({ color, size }) => <Map size={size} color={color} />,
            headerTitle: 'Safety Map',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="weather"
          options={{
            title: 'Weather',
            tabBarIcon: ({ color, size }) => (
              <Cloud size={size} color={color} />
            ),
            headerTitle: 'Weather',
          }}
        />
        <Tabs.Screen
          name="translator"
          options={{
            title: 'Translator',
            tabBarIcon: ({ color, size }) => (
              <Languages size={size} color={color} />
            ),
            headerTitle: 'Phrase Translator',
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            title: 'Insights',
            tabBarIcon: ({ color, size }) => (
              <FileText size={size} color={color} />
            ),
            headerTitle: 'Local Insights',
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Settings size={size} color={color} />
            ),
            headerTitle: 'Settings',
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
