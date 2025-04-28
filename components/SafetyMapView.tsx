import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Location, SafetyZone } from '@/types';

// Define types for map components
type MapViewType = any;
type CircleType = any;
type MarkerType = any;
type MapRefType = {
  animateToRegion: (region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) => void;
};

// Only define map components when not on web
let MapView: MapViewType = null;
let Circle: CircleType = null;
let Marker: MarkerType = null;

// Dynamically import map components only on native platforms
if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Circle = Maps.Circle;
    Marker = Maps.Marker;
  } catch (error) {
    console.error('Failed to load react-native-maps:', error);
  }
}

interface SafetyMapViewProps {
  location: Location;
  safetyZones: SafetyZone[];
  isLoading: boolean;
  onSelectZone?: (zone: SafetyZone) => void;
}

export function SafetyMapView({ location, safetyZones, isLoading, onSelectZone }: SafetyMapViewProps) {
  const mapRef = useRef<MapRefType | null>(null);

  // Initial region is set to New York City
  const initialRegion = {
    latitude: 40.7128,
    longitude: -74.0060,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  // If location is available, animate to user's location
  useEffect(() => {
    if (location && mapRef.current && Platform.OS !== 'web' && MapView) {
      const userLocation = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      
      mapRef.current.animateToRegion(userLocation);
    }
  }, [location]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading map data...</Text>
      </View>
    );
  }

  // Check if map components are available
  const mapComponentsAvailable = Platform.OS === 'web' || (MapView && Circle && Marker);

  // On web or when map components are not available, show a placeholder with the safety zones listed
  if (!mapComponentsAvailable) {
    return (
      <View style={styles.container}>
        <View style={styles.webMapPlaceholder}>
          <Text style={styles.mapTitle}>Safety Map</Text>
          <Text style={styles.mapDescription}>
            Current location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </Text>
          <View style={styles.zonesContainer}>
            <Text style={styles.zonesTitle}>Nearby Safety Zones:</Text>
            {safetyZones.map((zone) => (
              <View 
                key={zone.id} 
                style={styles.zoneItem}
                onTouchEnd={() => onSelectZone && onSelectZone(zone)}
              >
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
      </View>
    );
  }

  // Render the actual map when components are available
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
      >
        {/* User Location Marker */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You are here"
          >
            <View style={styles.currentLocationMarker}>
              <View style={styles.currentLocationDot} />
            </View>
          </Marker>
        )}

        {/* Safety Zones */}
        {safetyZones.map((zone) => (
          <Circle
            key={zone.id}
            center={{
              latitude: zone.latitude,
              longitude: zone.longitude,
            }}
            radius={zone.radius}
            fillColor={getZoneColor(zone.safetyLevel)}
            strokeColor={getZoneColor(zone.safetyLevel)}
            strokeWidth={1}
            onPress={() => onSelectZone && onSelectZone(zone)}
          />
        ))}
      </MapView>
    </View>
  );
}

// Helper to get color based on safety level
function getZoneColor(safetyLevel: string, noOpacity = false): string {
  const opacity = noOpacity ? '' : '80'; // 50% opacity
  
  switch(safetyLevel) {
    case 'safe':
      return '#10b981' + opacity; // green
    case 'moderate':
      return '#f59e0b' + opacity; // yellow/orange
    case 'unsafe':
      return '#ef4444' + opacity; // red
    default:
      return '#10b981' + opacity; // default to safe
  }
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
  map: {
    ...StyleSheet.absoluteFillObject,
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
  currentLocationMarker: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentLocationDot: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#6366f1',
    borderWidth: 2,
    borderColor: '#fff',
  },
});