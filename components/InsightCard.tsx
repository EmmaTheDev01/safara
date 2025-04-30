import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { LocalInsight } from '@/types';
import { useTheme } from '@/context/ThemeContext';
interface InsightCardProps {
  insight: LocalInsight;
  onPress: () => void;
}

export function InsightCard({ insight, onPress }: InsightCardProps) {
  // Get category icon color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'safety':
        return '#e74c3c';
      case 'cultural':
        return '#9b59b6';
      case 'transportation':
        return '#2ecc71';
      case 'health':
        return '#3498db';
      default:
        return '#7f8c8d';
    }
  };
  const {colors} = useTheme();
  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: colors.background }]} onPress={onPress} activeOpacity={0.8}>
      {insight.imageUrl && (
        <Image 
          source={{ uri: insight.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{insight.title}</Text>
          <View 
            style={[
              styles.categoryBadge, 
              { backgroundColor: getCategoryColor(insight.category) }
            ]}
          >
            <Text style={styles.categoryText}>
              {insight.category.charAt(0).toUpperCase() + insight.category.slice(1)}
            </Text>
          </View>
        </View>
        
        <Text 
          style={styles.description}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {insight.description}
        </Text>
        
        <View style={styles.readMore}>
          <Text style={styles.readMoreText}>Read more</Text>
          <ChevronRight size={16} color="#3498db" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
    lineHeight: 20,
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
});