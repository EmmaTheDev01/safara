import { useState, useEffect } from 'react';
import { LocalInsight } from '@/types';

export function useInsights() {
  const [insights, setInsights] = useState<LocalInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    
    // In a real app, this would be fetched from a backend
    const fetchInsights = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 700));
        
        // Mock insight data
        const mockInsights: LocalInsight[] = [
          {
            id: '1',
            title: 'Safety in Central Park',
            description: 'Central Park is generally safe during daylight hours. Stick to populated areas and main paths. Avoid the park after dark, especially the northern sections.',
            category: 'safety',
            imageUrl: 'https://images.pexels.com/photos/2225442/pexels-photo-2225442.jpeg',
          },
          {
            id: '2',
            title: 'NYC Subway Tips',
            description: 'The subway is safe but stay alert. Avoid empty cars, keep valuables concealed, and be aware of your surroundings. Consider using ride-sharing services late at night.',
            category: 'transportation',
            imageUrl: 'https://images.pexels.com/photos/2767814/pexels-photo-2767814.jpeg',
          },
          {
            id: '3',
            title: 'Tipping Culture',
            description: 'In the US, tipping is customary. Tip 15-20% at restaurants, $1-2 per drink at bars, and $1-2 per bag for hotel porters. Not tipping is considered rude.',
            category: 'cultural',
            imageUrl: 'https://images.pexels.com/photos/4386366/pexels-photo-4386366.jpeg',
          },
          {
            id: '4',
            title: 'Weather Preparedness',
            description: 'NYC weather can change quickly. Summer is hot and humid, while winter can bring snow and freezing temperatures. Always check the forecast and dress accordingly.',
            category: 'health',
            imageUrl: 'https://images.pexels.com/photos/1107717/pexels-photo-1107717.jpeg',
          },
          {
            id: '5',
            title: 'Emergency Services',
            description: 'For emergencies, dial 911. This connects you to police, fire, and medical services. For non-emergencies, call 311 for city services and information.',
            category: 'safety',
            imageUrl: 'https://images.pexels.com/photos/3849167/pexels-photo-3849167.jpeg',
          },
        ];
        
        setInsights(mockInsights);
      } catch (err) {
        setError('Failed to fetch insights');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return { insights, isLoading, error };
}