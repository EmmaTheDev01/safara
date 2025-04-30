import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';

// Dummy Data for Suggested Places
const suggestedPlaces = [
  {
    id: '1',
    name: 'Kigali Genocide Memorial',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/a/ae/%D7%90%D7%AA%D7%A8_%D7%94%D7%94%D7%A0%D7%A6%D7%97%D7%94_%D7%9C%D7%A8%D7%A6%D7%97_%D7%94%D7%A2%D7%9D_%D7%91%D7%A8%D7%95%D7%90%D7%A0%D7%93%D7%94_%D7%91%D7%A7%D7%99%D7%92%D7%90%D7%9C%D7%99_12.jpg',
    description:
      'A place of remembrance and learning about the 1994 Genocide against the Tutsi.',
    website: 'https://kgm.rw',
  },
  {
    id: '2',
    name: 'Nyungwe Forest National Park',
    image:
      'https://visitrwanda.com/wp-content/uploads/fly-images/3619/canopy-1650x1014.jpg',
    description:
      'A rainforest known for its biodiversity, canopy walk, and primate tracking.',
    website: 'https://www.nyungweforestnationalpark.org',
  },
  {
    id: '3',
    name: 'Lake Kivu',
    image:
      'https://www.insidenyungwenationalpark.com/wp-content/uploads/2024/02/lake-kivu-boat-cruise-wide.jpg',
    description:
      'One of Africa’s Great Lakes, perfect for relaxation, boating, and views.',
    website: 'https://en.wikipedia.org/wiki/Lake_Kivu',
  },
];

export const SuggestedPlaces = () => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
    {suggestedPlaces.map((place) => (
      <View key={place.id} style={styles.card}>
        <Image source={{ uri: place.image }} style={styles.image} />
        <Text style={styles.name}>{place.name}</Text>
        <Text style={styles.description}>{place.description}</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL(place.website)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Learn More</Text>
        </TouchableOpacity>
      </View>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  card: {
    width: 250,
    marginRight: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    objectFit: 'cover',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  description: {
    fontSize: 13,
    marginTop: 4,
    color: '#444',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#00a652',
    paddingVertical: 6,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
