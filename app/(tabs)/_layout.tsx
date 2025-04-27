import React from 'react';
import { Tabs } from 'expo-router';
import { 
  Map, 
  Cloud, 
  FileText, 
  Languages,
  Compass
} from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#f1f5f9',
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
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
          headerTitle: 'Safara',
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
  );
}