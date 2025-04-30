import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocation } from '@/hooks/useLocation';
import { useWeather } from '@/hooks/useWeather';
import { WeatherCard } from '@/components/WeatherCard';
import { useTheme } from '@/context/ThemeContext';
export default function WeatherScreen() {
  const { location } = useLocation();
  const { weather, isLoading, error } = useWeather(location.latitude, location.longitude);
  const {colors} = useTheme();
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Weather Forecast</Text>
        <Text style={styles.subtitle}>
          Current weather information for your location. Stay informed about conditions that might 
          affect your travel safety.
        </Text>
      </View>
      
      <WeatherCard  
        weather={weather}
        isLoading={isLoading}
      />
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <View style={[styles.tipsContainer, { backgroundColor: colors.background }]}>
        <Text style={styles.tipsTitle}>Weather Safety Tips</Text>
        <View style={styles.tipItem}>
          <Text style={styles.tipHeader}>Hot Weather</Text>
          <Text style={styles.tipText}>
            Stay hydrated, wear light clothing, use sunscreen, and seek shade during peak hours (10am-4pm).
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipHeader}>Rainy Weather</Text>
          <Text style={styles.tipText}>
            Carry an umbrella, wear water-resistant footwear, and be cautious of slippery surfaces.
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipHeader}>Storms</Text>
          <Text style={styles.tipText}>
            Seek shelter indoors, avoid open areas, and stay away from trees and metal objects during lightning.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    padding: 16,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 16,
  },
  errorContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fee',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#e74c3c',
  },
  tipsContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tipsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 16,
  },
  tipItem: {
    marginBottom: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#3498db',
    paddingLeft: 12,
  },
  tipHeader: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 4,
  },
  tipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
});