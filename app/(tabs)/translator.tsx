import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Filter, Search } from 'lucide-react-native';
import { usePhrasebook } from '@/hooks/usePhrasebook';
import { PhraseCard } from '@/components/PhraseCard';

export default function TranslatorScreen() {
  const { 
    phrases, 
    isLoading, 
    selectedLanguage, 
    setSelectedLanguage, 
    supportedLanguages 
  } = usePhrasebook();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [
    { value: null, label: 'All' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'health', label: 'Health' },
    { value: 'transportation', label: 'Transport' },
    { value: 'accommodation', label: 'Lodging' },
    { value: 'general', label: 'General' },
  ];

  // Filter phrases by search query and category
  const filteredPhrases = phrases.filter(phrase => {
    const matchesQuery = phrase.english.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === null || phrase.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Essential Phrases</Text>
        <Text style={styles.subtitle}>
          Use these phrases for quick communication in emergency situations or while navigating.
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#7f8c8d" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search phrases..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.languageSelector}>
        <Text style={styles.languageLabel}>Translate to:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {supportedLanguages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageButton,
                selectedLanguage === language.code && styles.selectedLanguage,
              ]}
              onPress={() => setSelectedLanguage(language.code)}
            >
              <Text 
                style={[
                  styles.languageButtonText,
                  selectedLanguage === language.code && styles.selectedLanguageText,
                ]}
              >
                {language.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.value || 'all'}
              style={[
                styles.categoryButton,
                selectedCategory === category.value && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(category.value)}
            >
              <Text 
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category.value && styles.selectedCategoryText,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading phrases...</Text>
        </View>
      ) : filteredPhrases.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No phrases found. Try a different search term.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPhrases}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PhraseCard phrase={item} language={selectedLanguage} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#2c3e50',
    paddingVertical: 12,
  },
  languageSelector: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  languageLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 20,
  },
  selectedLanguage: {
    backgroundColor: '#3498db',
  },
  languageButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#7f8c8d',
  },
  selectedLanguageText: {
    color: '#fff',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 20,
  },
  selectedCategory: {
    backgroundColor: '#9b59b6',
  },
  categoryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#7f8c8d',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  listContent: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#7f8c8d',
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  noResultsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});