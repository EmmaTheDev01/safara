export interface Location {
  latitude: number;
  longitude: number;
}

export type SafetyLevel = 'safe' | 'moderate' | 'danger';

export interface SafetyZone {
  id: string;
  name: string;
  description: string;
  location: Location;
  radius: number;
  safetyLevel: SafetyLevel;
  lastUpdated: string;
} 