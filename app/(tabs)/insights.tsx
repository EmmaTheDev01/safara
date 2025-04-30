import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity,
  ScrollView 
} from 'react-native';
import { useInsights } from '@/hooks/useInsights';
import { InsightCard } from '@/components/InsightCard';
import { useTheme } from '@/context/ThemeContext';
export default function InsightsScreen() {
  const { insights, isLoading } = useInsights();
  const {colors} = useTheme();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  
  const categories = [
    { value: null, label: 'All' },
    { value: 'safety', label: 'Safety' },
    { value: 'cultural', label: 'Culture' },
    { value: 'transportation', label: 'Transport' },
    { value: 'health', label: 'Health' },
  ];
  
  // Filter insights by category
  const filteredInsights = selectedCategory 
    ? insights.filter(insight => insight.category === selectedCategory)
    : insights;
    
  // Handle insight selection
  const handleInsightPress = (id: string) => {
    // In a real app, this would navigate to a detail view
    const insight = insights.find(item => item.id === id);
    if (insight) {
      alert(`Selected insight: ${insight.title}\n\n${insight.description}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Local Safety Insights</Text>
        <Text style={styles.subtitle}>
          Tips and information to help you navigate safely in unfamiliar areas.
        </Text>
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
          <Text style={styles.loadingText}>Loading insights...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredInsights}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <InsightCard 
              insight={item} 
              onPress={() => handleInsightPress(item.id)}
            />
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
    marginBottom: 8,
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
});