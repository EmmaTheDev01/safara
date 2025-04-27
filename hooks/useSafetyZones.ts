import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { SafetyZone, SafetyReview } from '@/types';

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
);

export function useSafetyZones() {
  const [safetyZones, setSafetyZones] = useState<SafetyZone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSafetyZones();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('safety_zones_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'safety_zones'
      }, () => {
        fetchSafetyZones();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchSafetyZones() {
    try {
      const { data: zones, error: zonesError } = await supabase
        .from('safety_zones')
        .select(`
          *,
          reviews:safety_reviews(*)
        `)
        .order('created_at', { ascending: false });

      if (zonesError) throw zonesError;

      const formattedZones: SafetyZone[] = zones.map(zone => ({
        id: zone.id,
        name: zone.name,
        safetyLevel: zone.safety_level,
        description: zone.description,
        latitude: zone.latitude,
        longitude: zone.longitude,
        radius: zone.radius,
        reviews: zone.reviews,
        averageRating: calculateAverageRating(zone.reviews),
        verified: zone.verified,
        createdBy: zone.created_by,
        createdAt: zone.created_at,
        updatedAt: zone.updated_at
      }));

      setSafetyZones(formattedZones);
    } catch (err) {
      console.error('Error fetching safety zones:', err);
      setError('Failed to fetch safety zones');
    } finally {
      setIsLoading(false);
    }
  }

  async function addSafetyZone(zone: Partial<SafetyZone>) {
    try {
      const { data, error } = await supabase
        .from('safety_zones')
        .insert([{
          name: zone.name,
          safety_level: zone.safetyLevel,
          description: zone.description,
          latitude: zone.latitude,
          longitude: zone.longitude,
          radius: zone.radius
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error adding safety zone:', err);
      throw err;
    }
  }

  async function addReview(review: Partial<SafetyReview>) {
    try {
      const { data, error } = await supabase
        .from('safety_reviews')
        .insert([{
          zone_id: review.zoneId,
          rating: review.rating,
          comment: review.comment,
          is_local_guide: review.isLocalGuide,
          images: review.images
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error adding review:', err);
      throw err;
    }
  }

  function calculateAverageRating(reviews: SafetyReview[]): number {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  }

  return {
    safetyZones,
    isLoading,
    error,
    addSafetyZone,
    addReview,
    refreshZones: fetchSafetyZones
  };
}