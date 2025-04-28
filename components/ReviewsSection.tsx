import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { SafetyZone } from '@/types';

interface ReviewsSectionProps {
  zone: SafetyZone;
}

export function ReviewsSection({ zone }: ReviewsSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Reviews</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {zone.reviews.map((review) => (
          <View 
            key={review.id} 
            style={[styles.reviewCard, { backgroundColor: colors.card }]}
          >
            <View style={styles.reviewHeader}>
              <Image
                source={{ uri: review.userAvatar || 'https://via.placeholder.com/40' }}
                style={styles.avatar}
              />
              <View style={styles.reviewInfo}>
                <Text style={[styles.username, { color: colors.text }]}>
                  {review.username}
                </Text>
                <Text style={[styles.date, { color: colors.textSecondary }]}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <Text style={[styles.reviewText, { color: colors.text }]}>
              {review.text}
            </Text>
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, index) => (
                <Text 
                  key={index}
                  style={[
                    styles.star,
                    { color: index < review.rating ? colors.primary : colors.border }
                  ]}
                >
                  ★
                </Text>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  reviewCard: {
    width: 300,
    padding: 15,
    borderRadius: 12,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
}); 