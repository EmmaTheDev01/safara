import { useState, useEffect } from 'react';
import { WeatherInfo } from '@/types';

export function useWeather(latitude: number, longitude: number) {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    
    // In a real app, this would be an API call to OpenWeatherMap or similar
    // For demo purposes, we'll use mock data
    const fetchWeather = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock weather data
        const mockWeather: WeatherInfo = {
          condition: 'Partly Cloudy',
          temperature: 72,
          feelsLike: 70,
          windSpeed: 8,
          humidity: 65,
          icon: 'cloudy',
          forecast: [
            {
              day: 'Today',
              condition: 'Partly Cloudy',
              highTemp: 75,
              lowTemp: 65,
              icon: 'cloudy',
            },
            {
              day: 'Tomorrow',
              condition: 'Sunny',
              highTemp: 82,
              lowTemp: 68,
              icon: 'sun',
            },
            {
              day: 'Wednesday',
              condition: 'Rain',
              highTemp: 70,
              lowTemp: 62,
              icon: 'cloud-rain',
            },
            {
              day: 'Thursday',
              condition: 'Thunderstorms',
              highTemp: 68,
              lowTemp: 60,
              icon: 'cloud-lightning',
            },
            {
              day: 'Friday',
              condition: 'Sunny',
              highTemp: 76,
              lowTemp: 64,
              icon: 'sun',
            },
          ],
        };
        
        setWeather(mockWeather);
      } catch (err) {
        setError('Failed to fetch weather data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (latitude && longitude) {
      fetchWeather();
    }
  }, [latitude, longitude]);

  return { weather, isLoading, error };
}