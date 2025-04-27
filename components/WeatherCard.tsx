import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { 
  Cloud, 
  CloudRain, 
  CloudLightning, 
  Sun, 
  CloudSun, 
  CloudFog 
} from 'lucide-react-native';
import { WeatherInfo } from '@/types';

interface WeatherCardProps {
  weather: WeatherInfo | null;
  isLoading: boolean;
}

export function WeatherCard({ weather, isLoading }: WeatherCardProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to load weather</Text>
      </View>
    );
  }

  const renderWeatherIcon = (iconName: string, size = 40) => {
    switch (iconName) {
      case 'sun':
        return <Sun size={size} color="#f39c12" />;
      case 'cloudy':
        return <Cloud size={size} color="#7f8c8d" />;
      case 'partly-cloudy':
        return <CloudSun size={size} color="#7f8c8d" />;
      case 'cloud-rain':
        return <CloudRain size={size} color="#7f8c8d" />;
      case 'cloud-lightning':
        return <CloudLightning size={size} color="#7f8c8d" />;
      case 'fog':
        return <CloudFog size={size} color="#7f8c8d" />;
      default:
        return <Cloud size={size} color="#7f8c8d" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.currentWeather}>
        <View style={styles.weatherIcon}>
          {renderWeatherIcon(weather.icon)}
        </View>
        <View style={styles.weatherInfo}>
          <Text style={styles.temperature}>{weather.temperature}°F</Text>
          <Text style={styles.condition}>{weather.condition}</Text>
          <Text style={styles.feelsLike}>Feels like {weather.feelsLike}°F</Text>
        </View>
      </View>
      
      <View style={styles.weatherDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Wind</Text>
          <Text style={styles.detailValue}>{weather.windSpeed} mph</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Humidity</Text>
          <Text style={styles.detailValue}>{weather.humidity}%</Text>
        </View>
      </View>
      
      <View style={styles.forecastContainer}>
        <Text style={styles.forecastTitle}>5-Day Forecast</Text>
        <View style={styles.forecastList}>
          {weather.forecast.map((day, index) => (
            <View key={index} style={styles.forecastDay}>
              <Text style={styles.forecastDayName}>{day.day}</Text>
              <View style={styles.forecastIconContainer}>
                {renderWeatherIcon(day.icon, 24)}
              </View>
              <Text style={styles.forecastTemperature}>
                {day.highTemp}°/{day.lowTemp}°
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loadingContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
  },
  currentWeather: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherIcon: {
    marginRight: 16,
  },
  weatherInfo: {
    flex: 1,
  },
  temperature: {
    fontSize: 36,
    fontWeight: '600',
    color: '#2c3e50',
  },
  condition: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  feelsLike: {
    fontSize: 14,
    color: '#95a5a6',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 16,
    marginBottom: 16,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  forecastContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 16,
  },
  forecastTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  forecastList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastDay: {
    alignItems: 'center',
    flex: 1,
  },
  forecastDayName: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  forecastIconContainer: {
    marginVertical: 4,
  },
  forecastTemperature: {
    fontSize: 14,
    color: '#2c3e50',
  },
});