import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface Story {
  id: string;
  username: string;
  imageUrl: string;
  hasUnseenStory: boolean;
}

interface StoriesSectionProps {
  stories: Story[];
  onStoryPress: (story: Story) => void;
}

export function StoriesSection({ stories, onStoryPress }: StoriesSectionProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {stories.map((story) => (
          <TouchableOpacity
            key={story.id}
            style={styles.storyContainer}
            onPress={() => onStoryPress(story)}
          >
            <View style={[
              styles.storyRing,
              { 
                borderColor: story.hasUnseenStory ? colors.primary : colors.border,
                backgroundColor: colors.background
              }
            ]}>
              <Image
                source={{ uri: story.imageUrl }}
                style={styles.storyImage}
              />
            </View>
            <Text 
              style={[styles.username, { color: colors.text }]}
              numberOfLines={1}
            >
              {story.username}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  scrollContent: {
    paddingHorizontal: 10,
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: 15,
    width: 70,
    paddingLeft:10,
  },
  storyRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  username: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
}); 