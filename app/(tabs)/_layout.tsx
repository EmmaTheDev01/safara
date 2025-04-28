import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Tabs } from 'expo-router';
import { 
  Map, 
  Cloud, 
  FileText, 
  Languages,
  Compass
} from 'lucide-react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  return (
    <View style={styles.container}>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            elevation: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
            <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
          ),
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        headerTitleStyle: {
          fontFamily: 'Poppins-SemiBold',
          fontSize: 20,
          color: '#0f172a',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Compass size={size} color={color} />
          ),
          
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Safety Map',
          tabBarIcon: ({ color, size }) => (
            <Map size={size} color={color} />
          ),
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
    </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});