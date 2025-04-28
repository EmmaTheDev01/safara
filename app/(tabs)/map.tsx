import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomHeader } from '@/components/CustomHeader';
import { SafetyMapView } from '@/components/SafetyMapView';
import { SafetyZone } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { Region } from 'react-native-maps';
import { useLocation } from '@/hooks/useLocation';

// Dummy safety zones data
const dummyZones: SafetyZone[] = [
  {
    id: '1',
    name: 'City Center',
    description: 'A safe area in the heart of the city',
    latitude: 37.7749,
    longitude: -122.4194,
    radius: 1000,
    safetyLevel: 'safe',
    reviews: [],
    averageRating: 0,
    verified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Downtown',
    description: 'Moderate safety level in downtown area',
    latitude: 37.7833,
    longitude: -122.4167,
    radius: 800,
    safetyLevel: 'moderate',
    reviews: [],
    averageRating: 0,
    verified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function MapScreen() {
  const { colors } = useTheme();
  const { location } = useLocation();
  const [filteredZones, setFilteredZones] = useState<SafetyZone[]>(dummyZones);
  const [searchQuery, setSearchQuery] = useState('');

  const handleZoneSelect = (zone: SafetyZone) => {
    console.log('Selected zone:', zone);
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredZones(dummyZones);
      return;
    }

    const filtered = dummyZones.filter(zone => 
      zone.name.toLowerCase().includes(query.toLowerCase()) ||
      zone.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredZones(filtered);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafetyMapView
        location={location}
        safetyZones={filteredZones}
        isLoading={false}
        onSelectZone={handleZoneSelect}
      />
      <CustomHeader 
        searchPlaceholder="Search locations..."
        onSearch={handleSearch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});