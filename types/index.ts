// Define common types for the application

export type SafetyZone = {
  id: string;
  name: string;
  safetyLevel: 'safe' | 'moderate' | 'unsafe';
  description: string;
  latitude: number;
  longitude: number;
  radius: number;
  reviews: SafetyReview[];
  averageRating: number;
  verified: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
};

export interface SafetyReview {
  id: string;
  username: string;
  userAvatar?: string;
  text: string;
  rating: number;
  createdAt: string;
}

export type WeatherInfo = {
  condition: string;
  temperature: number;
  feelsLike: number;
  windSpeed: number;
  humidity: number;
  forecast: WeatherForecast[];
  icon: string;
};

export type WeatherForecast = {
  day: string;
  condition: string;
  highTemp: number;
  lowTemp: number;
  icon: string;
};

export type TranslationPhrase = {
  id: string;
  category: 'emergency' | 'general' | 'transportation' | 'health' | 'accommodation';
  english: string;
  translations: {
    [key: string]: string;
  };
};

export type LocalInsight = {
  id: string;
  title: string;
  description: string;
  category: 'safety' | 'cultural' | 'transportation' | 'health';
  imageUrl?: string;
};

export type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
  category: 'police' | 'medical' | 'embassy' | 'fire' | 'general';
};

export type Location = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};