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

// Dummy Data for Car Rentals
const carRentals = [
  {
    id: '1',
    name: 'Kigali Car Rentals',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQee0zcyLRjbb41-B-S63cwVm7_T37msjozPQ&s',
    location: 'KN 5 Road, Remera, Kigali',
    contact: '+250 783 008 990',
    email: 'info@kigalicarrentals.com',
    website: 'https://kigalicarrentals.com',
  },
  {
    id: '2',
    name: 'Easyride Rwanda',
    image:
      'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/dc/8c/a8/dc8ca897-e310-59ef-926a-8aed4deb4e11/AppIcon-0-0-1x_U007emarketing-0-8-0-0-85-220.png/1200x630wa.png',
    location: 'Kigali, Rwanda',
    contact: '+250 787 809 667',
    email: 'info@easyride.rw',
    website: 'https://easyride.rw',
  },
  {
    id: '3',
    name: 'Rwanda Car Rental Services',
    image:
      'https://www.rwandacarrentalservices.com/wp-content/uploads/2020/08/Rwanda-Car-Rental-Services-Logo-1.png',
    location: 'Kigali, Rwanda',
    contact: '+250 791 955 502',
    email: 'info@rwandacarrentals.com',
    website: 'https://rwandacarrentals.com',
  },
];

export const CarRentalList = () => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
    {carRentals.map((rental) => (
      <View key={rental.id} style={styles.card}>
        <Image source={{ uri: rental.image }} style={styles.image} />
        <Text style={styles.name}>{rental.name}</Text>
        <Text>{rental.location}</Text>
        <Text>{rental.contact}</Text>
        <Text>{rental.email}</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL(rental.website)}
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
    objectFit: 'cover',
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
