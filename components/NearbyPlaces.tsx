import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MapPin, AlertTriangle, Clock, Phone } from 'lucide-react-native';
import { useLocation } from '@/hooks/useLocation';
import { useTheme } from '@/context/ThemeContext';

// Rwanda-related mock data
const rwandaPlaces = [
  {
    id: '1',
    name: 'Kigali Genocide Memorial',
    type: 'attraction',
    safety_level: 'safe',
    safety_notes: 'A historical memorial with security staff present.',
    operating_hours: '8:00 AM - 5:00 PM',
    contact_info: '+250 788-308-111',
    location_lat: -1.9493,
    location_lng: 30.0588,
    imageUrl: 'https://images.unsplash.com/photo-1567122744-d6f823b2050c',
  },
  {
    id: '2',
    name: 'Inema Arts Center',
    type: 'attraction',
    safety_level: 'safe',
    safety_notes: 'A well-known cultural and art center in Kigali.',
    operating_hours: '9:00 AM - 7:00 PM',
    contact_info: '+250 788-300-232',
    location_lat: -1.9570,
    location_lng: 30.0750,
    imageUrl: 'https://images.unsplash.com/photo-1597229263386-cd599f5fa9ad',
  },
  {
    id: '3',
    name: 'Kigali Convention Centre',
    type: 'hotel',
    safety_level: 'safe',
    safety_notes: 'A luxurious venue with 24/7 security and amenities.',
    operating_hours: 'Open 24 hours',
    contact_info: '+250 788-303-030',
    location_lat: -1.9670,
    location_lng: 30.1217,
    imageUrl: 'https://images.unsplash.com/photo-1547520556-d4f443a3eab1',
  },
  {
    id: '4',
    name: 'Café Kigali',
    type: 'restaurant',
    safety_level: 'moderate',
    safety_notes: 'Located in a well-lit area, ideal for day-time visits.',
    operating_hours: '7:00 AM - 10:00 PM',
    contact_info: '+250 788-445-467',
    location_lat: -1.9630,
    location_lng: 30.1020,
    imageUrl: 'https://images.unsplash.com/photo-1535593156-67c0d2a2b3fd',
  },
  {
    id: '5',
    name: 'The Retreat by Heaven',
    type: 'hotel',
    safety_level: 'safe',
    safety_notes: 'A well-known and secure hotel with top-rated services.',
    operating_hours: 'Open 24 hours',
    contact_info: '+250 788-402-425',
    location_lat: -1.9548,
    location_lng: 30.1089,
    imageUrl: 'https://images.unsplash.com/photo-1563126245-27adad82a24b',
  },
  {
    id: '6',
    name: 'Kingfisher Restaurant',
    type: 'restaurant',
    safety_level: 'moderate',
    safety_notes: 'Located in a busy area, best to visit with a group.',
    operating_hours: '8:00 AM - 9:00 PM',
    contact_info: '+250 788-303-303',
    location_lat: -1.9310,
    location_lng: 30.0505,
    imageUrl: 'https://images.unsplash.com/photo-1593597759310-0f7b31f70e1b',
  },
];

export function NearbyPlaces() {
  const { location } = useLocation();
  const [places] = useState(rwandaPlaces);
  const { colors } = useTheme();

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'safe':
        return '#4CAF50';
      case 'moderate':
        return '#FFC107';
      case 'unsafe':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getPlaceIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return '🍽️';
      case 'hotel':
        return '🏨';
      case 'attraction':
        return '🎯';
      default:
        return '📍';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {places.map((place) => (
        <TouchableOpacity key={place.id} style={[styles.placeCard, { backgroundColor: colors.card }]}>
          <View style={styles.placeHeader}>
            <Text style={[styles.placeIcon, { color: colors.text }]}>{getPlaceIcon(place.type)}</Text>
            <View style={styles.placeInfo}>
              <Text style={[styles.placeName, { color: colors.text }]}>{place.name}</Text>
              <Text style={[styles.placeType, { color: colors.textSecondary }]}>
                {place.type.charAt(0).toUpperCase() + place.type.slice(1)}
              </Text>
            </View>
            <View style={[styles.safetyBadge, { backgroundColor: getSafetyColor(place.safety_level) }]}>
              <Text style={styles.safetyText}>
                {place.safety_level.toUpperCase()}
              </Text>
            </View>
          </View>

          {place.safety_notes && (
            <View style={styles.safetyNotes}>
              <AlertTriangle size={16} color="#F44336" />
              <Text style={styles.safetyNotesText}>{place.safety_notes}</Text>
            </View>
          )}

          <View style={styles.placeDetails}>
            <View style={styles.detailRow}>
              <MapPin size={16} color="#757575" />
              <Text style={styles.detailText}>
                {calculateDistance(
                  location.latitude,
                  location.longitude,
                  place.location_lat,
                  place.location_lng
                ).toFixed(1)} km away
              </Text>
            </View>
            {place.operating_hours && (
              <View style={styles.detailRow}>
                <Clock size={16} color="#757575" />
                <Text style={styles.detailText}>{place.operating_hours}</Text>
              </View>
            )}
            {place.contact_info && (
              <View style={styles.detailRow}>
                <Phone size={16} color="#757575" />
                <Text style={styles.detailText}>{place.contact_info}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  placeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  placeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeType: {
    fontSize: 14,
    color: '#757575',
  },
  safetyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  safetyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  safetyNotes: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  safetyNotesText: {
    marginLeft: 8,
    color: '#F44336',
    fontSize: 14,
  },
  placeDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    color: '#757575',
    fontSize: 14,
  },
});
