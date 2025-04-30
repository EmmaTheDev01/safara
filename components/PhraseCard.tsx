import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Volume2, Copy } from 'lucide-react-native';
import { TranslationPhrase } from '@/types';
import { useTheme } from '@/context/ThemeContext';
interface PhraseCardProps {
  phrase: TranslationPhrase;
  language: string;
}

export function PhraseCard({ phrase, language }: PhraseCardProps) {
  const [copied, setCopied] = useState(false);
  const { colors } = useTheme();

  const handleCopy = () => {
    // In a real app, we would use Clipboard.setString
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    // In a real app, we would use Speech.speak
    console.log('Speaking:', phrase.translations[language]);
  };

  // Get badge color based on category
  const getBadgeColor = (category: string) => {
    switch (category) {
      case 'emergency':
        return '#e74c3c';
      case 'health':
        return '#3498db';
      case 'transportation':
        return '#2ecc71';
      case 'accommodation':
        return '#9b59b6';
      default:
        return '#7f8c8d';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: getBadgeColor(phrase.category) },
          ]}
        >
          <Text style={styles.categoryText}>
            {phrase.category.charAt(0).toUpperCase() + phrase.category.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.englishPhrase}>{phrase.english}</Text>
        <Text style={styles.translatedPhrase}>
          {phrase.translations[language] || 'Translation not available'}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleSpeak}>
          <Volume2 size={20} color="#3498db" />
          <Text style={styles.actionText}>Speak</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
          <Copy size={20} color="#7f8c8d" />
          <Text style={styles.actionText}>{copied ? 'Copied!' : 'Copy'}</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  header: {
    flexDirection: 'row',
    padding: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
  englishPhrase: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  translatedPhrase: {
    fontSize: 18,
    color: '#34495e',
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionText: {
    marginLeft: 8,
    color: '#7f8c8d',
    fontSize: 14,
    fontWeight: '500',
  },
});
