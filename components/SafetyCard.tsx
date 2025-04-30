import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafetyZone } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/theme/colors';
interface SafetyCardProps {
  zone: SafetyZone;
  onClose: () => void;
}

export default function SafetyCard({ zone, onClose }: SafetyCardProps) {
  const {colors} = useTheme()
  return (
    <View style={[styles.safetyCardContainer, { backgroundColor: colors.background }]}>
      <View style={styles.safetyCard}>
        <Text style={styles.safetyCardTitle}>{zone.name}</Text>
        <Text style={styles.safetyCardDescription}>{zone.description}</Text>
        <View style={styles.safetyLevelIndicator}>
          <View 
            style={[
              styles.safetyLevelDot, 
              { backgroundColor: getZoneColor(zone.safetyLevel, true) }
            ]} 
          />
          <Text style={styles.safetyLevelText}>
            {zone.safetyLevel.charAt(0).toUpperCase() + zone.safetyLevel.slice(1)}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
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
  safetyCardContainer: {
    position: 'absolute',
    bottom: 96,
    left: 16,
    right: 16,
    zIndex: 2,
   
  },
  safetyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  safetyCardTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#0f172a',
    marginBottom: 8,
  },
  safetyCardDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  safetyLevelIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  safetyLevelDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  safetyLevelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#0f172a',
  },
  closeButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#0f172a',
  },
}); 