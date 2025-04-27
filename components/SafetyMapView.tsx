import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Location, SafetyZone } from '@/types';

interface SafetyMapViewProps {
  location: Location;
  safetyZones: SafetyZone[];
  isLoading: boolean;
}

export function SafetyMapView({ location, safetyZones, isLoading }: SafetyMapViewProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading map data...</Text>
      </View>
    );
  }

  // On web, we'll show a placeholder with the safety zones listed
  // In a real app with react-native-maps, we'd render an actual map here
  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        <View style={styles.webMapPlaceholder}>
          <Text style={styles.mapTitle}>Safety Map</Text>
          <Text style={styles.mapDescription}>
            Current location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
          <View style={styles.zonesContainer}>
            <Text style={styles.zonesTitle}>Nearby Safety Zones:</Text>
            {safetyZones.map((zone) => (
              <View key={zone.id} style={styles.zoneItem}>
                <View style={[
                  styles.zoneIndicator, 
                  zone.safetyLevel === 'safe' 
                    ? styles.safeZone 
                    : zone.safetyLevel === 'moderate' 
                      ? styles.moderateZone 
                      : styles.unsafeZone
                ]} />
                <View style={styles.zoneInfo}>
                  <Text style={styles.zoneName}>{zone.name}</Text>
                  <Text style={styles.zoneDescription}>{zone.description}</Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, styles.safeZone]} />
              <Text style={styles.legendText}>Safe</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, styles.moderateZone]} />
              <Text style={styles.legendText}>Moderate</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIndicator, styles.unsafeZone]} />
              <Text style={styles.legendText}>Use Caution</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.mapContainer}>
          {/* On native, this would be a real map component */}
          <Text>Native map will be rendered here</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  webMapPlaceholder: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mapTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#2c3e50',
  },
  mapDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 16,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zonesContainer: {
    marginTop: 16,
  },
  zonesTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2c3e50',
  },
  zoneItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  zoneIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
    marginTop: 4,
  },
  safeZone: {
    backgroundColor: '#2ecc71',
  },
  moderateZone: {
    backgroundColor: '#f39c12',
  },
  unsafeZone: {
    backgroundColor: '#e74c3c',
  },
  zoneInfo: {
    flex: 1,
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  zoneDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#2c3e50',
  },
});