import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';

// Default to Central Park, NYC for demo
const defaultLocation = {
  latitude: 40.785091,
  longitude: -73.968285,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export function useLocation() {
  const [location, setLocation] = useState(defaultLocation);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription;

    async function getLocationPermission() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          setIsLoading(false);
          return;
        }

        // Get initial location
        const initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setLocation({
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        // Subscribe to location updates
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 10000, // Update every 10 seconds
            distanceInterval: 10, // Update if moved by 10 meters
          },
          (newLocation) => {
            setLocation({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }
        );

        setIsLoading(false);
      } catch (err) {
        setError('Failed to get location');
        setIsLoading(false);
        console.error(err);
      }
    }

    if (Platform.OS !== 'web') {
      getLocationPermission();
    } else {
      // For web, use browser's geolocation API
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
            setIsLoading(false);
          },
          (err) => {
            setError('Failed to get location');
            setIsLoading(false);
            console.error(err);
          }
        );
      } else {
        setError('Geolocation is not supported by this browser');
        setIsLoading(false);
      }
    }

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  return { location, setLocation, isLoading, error };
}