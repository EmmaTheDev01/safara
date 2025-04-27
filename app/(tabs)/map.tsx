import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { useLocation } from '@/hooks/useLocation';
import { useSafetyZones } from '@/hooks/useSafetyZones';
import { SafetyMapView } from '@/components/SafetyMapView';

export default function MapScreen() {
  const { location, isLoading: locationLoading } = useLocation();
  const { safetyZones, isLoading: zonesLoading } = useSafetyZones();

  const isLoading = locationLoading || zonesLoading;

  return (
    <View style={styles.container}>
      <SafetyMapView 
        location={location}
        safetyZones={safetyZones}
        isLoading={isLoading}
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Safety Information</Text>
        <Text style={styles.infoText}>
          The safety map shows areas color-coded by security level based on local crime statistics 
          and traveler reports. Green areas are considered safe, yellow areas require some caution, 
          and red areas should be approached with extra caution or avoided during certain hours.
        </Text>
        
        <Text style={styles.updateText}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  infoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 8,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 12,
  },
  updateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'right',
  },
});