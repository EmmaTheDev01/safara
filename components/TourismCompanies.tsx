import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';

// Dummy Data for Tourism Companies
const tourismCompanies = [
  {
    id: '1',
    name: 'Rwanda Eco Company',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3jUX83u53zmXHD4dqVWZwlTjPxyR7U7NIbg&s',
    contact: '+250 788 508 228',
    email: 'info@rwandaecocompany.com',
    website: 'https://rwandaecocompany.com',
  },
  {
    id: '2',
    name: 'Wilson Tours',
    image: 'https://wilsontoursafrica.com/wp-content/uploads/2021/11/cropped-small.png',
    contact: '+250 788 306 309',
    email: 'info@wilson-tours.com',
    website: 'https://wilsontoursafrica.com/',
  },
  {
    id: '3',
    name: 'Hermosa Life Tourism',
    image: 'https://hermosalifetourism.com/wp-content/uploads/2022/08/image_6487327-2-300x300.jpg',
    contact: '+250 788 306 309',
    email: 'info@hermosalifetourism.com',
    website: 'https://hermosalifetourism.com/',
  },
];

export const TourismCompanyList = () => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
    {tourismCompanies.map((company) => (
      <View key={company.id} style={styles.card}>
        <Image source={{ uri: company.image }} style={styles.image} />
        <Text style={styles.name}>{company.name}</Text>
        <Text>{company.contact}</Text>
        <Text>{company.email}</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL(company.website)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Visit Website</Text>
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
    width: 200,
    marginRight: 10,
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
  },
  name: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#00a652',
    paddingVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
