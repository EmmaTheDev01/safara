import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Platform,
  Dimensions 
} from 'react-native';
import { Link } from 'expo-router';
import { Shield, TriangleAlert as AlertTriangle, Phone, MapPin, Cloud, Languages, Navigation } from 'lucide-react-native';

import { useLocation } from '@/hooks/useLocation';
import { useSafetyZones } from '@/hooks/useSafetyZones';
import { useWeather } from '@/hooks/useWeather';
import { EmergencyButton } from '@/components/EmergencyButton';
import { SafetyMapView } from '@/components/SafetyMapView';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { location } = useLocation();
  const { safetyZones } = useSafetyZones();
  const { weather } = useWeather(location.latitude, location.longitude);
  
  const handleEmergency = () => {
    alert('In a real app, this would connect to emergency services.');
  };

  const nearestSafetyZones = safetyZones.slice(0, 3);
  const hasUnsafeZones = safetyZones.some(zone => zone.safetyLevel === 'unsafe');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.appName}>Safara</Text>
        <Text style={styles.subtitle}>Your intelligent travel companion</Text>
      </View>

      <View style={styles.mapContainer}>
        <SafetyMapView 
          location={location}
          safetyZones={safetyZones}
          isLoading={false}
        />
        <Link href="/map" asChild>
          <TouchableOpacity style={styles.expandMapButton}>
            <Navigation size={20} color="#6366f1" />
            <Text style={styles.expandMapText}>Open Full Map</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.alertContainer}>
        {hasUnsafeZones ? (
          <View style={styles.alertWarning}>
            <AlertTriangle size={24} color="#fff" />
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>Safety Alert</Text>
              <Text style={styles.alertText}>
                Exercise caution in marked areas. Check the map for details.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.alertSafe}>
            <Shield size={24} color="#fff" />
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>Safe Area</Text>
              <Text style={styles.alertText}>
                Current location is considered safe for travelers.
              </Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.emergencyContainer}>
        <EmergencyButton onPress={handleEmergency} />
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <Link href="/weather" asChild>
            <TouchableOpacity style={styles.quickActionButton}>
              <Cloud size={24} color="#6366f1" />
              <Text style={styles.quickActionText}>Weather</Text>
              {weather && (
                <Text style={styles.quickActionDetail}>{weather.temperature}°F</Text>
              )}
            </TouchableOpacity>
          </Link>
          <Link href="/translator" asChild>
            <TouchableOpacity style={styles.quickActionButton}>
              <Languages size={24} color="#6366f1" />
              <Text style={styles.quickActionText}>Translator</Text>
              <Text style={styles.quickActionDetail}>15 phrases</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View style={styles.safetyZonesContainer}>
        <View style={styles.sectionHeader}>
          <MapPin size={20} color="#6366f1" />
          <Text style={styles.sectionTitle}>Nearby Safety Zones</Text>
          <Link href="/map" asChild>
            <TouchableOpacity>
              <Text style={styles.seeAllLink}>View All</Text>
            </TouchableOpacity>
          </Link>
        </View>
        {nearestSafetyZones.map((zone) => (
          <View 
            key={zone.id} 
            style={[
              styles.safetyZoneItem, 
              zone.safetyLevel === 'safe' 
                ? styles.safeZone 
                : zone.safetyLevel === 'moderate' 
                  ? styles.moderateZone 
                  : styles.unsafeZone
            ]}
          >
            <Text style={styles.safetyZoneName}>{zone.name}</Text>
            <Text style={styles.safetyZoneDesc}>{zone.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 24,
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748b',
  },
  appName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#0f172a',
    marginTop: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  mapContainer: {
    margin: 20,
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
  },
  expandMapButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  expandMapText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6366f1',
    marginLeft: 8,
  },
  alertContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  alertWarning: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertSafe: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  alertText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#fff',
  },
  emergencyContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickActionsContainer: {
    padding: 20,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  quickActionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#0f172a',
    marginTop: 8,
  },
  quickActionDetail: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  safetyZonesContainer: {
    padding: 20,
    paddingBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#0f172a',
    marginLeft: 8,
    flex: 1,
  },
  seeAllLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6366f1',
  },
  safetyZoneItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  safeZone: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  moderateZone: {
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  unsafeZone: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  safetyZoneName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 4,
  },
  safetyZoneDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
  },
});