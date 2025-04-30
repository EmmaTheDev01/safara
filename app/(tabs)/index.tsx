import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  Modal,
  Image,
  StatusBar,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import {
  Shield,
  TriangleAlert as AlertTriangle,
  MapPin,
  Cloud,
  Languages,
  Navigation,
  X,
  FileText,
  Star,
  ThumbsUp,
  MessageCircle,
  Search,
  ChevronRight,
  DollarSign,
  Globe,
  Phone,
  Clock,
  Heart,
  Mail,
  User,
} from 'lucide-react-native';
import { CustomHeader } from '@/components/CustomHeader';
import { SafetyMapView } from '@/components/SafetyMapView';
import { StoriesSection } from '@/components/StoriesSection';
import { ReviewsSection } from '@/components/ReviewsSection';
import { SafetyZone } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { useLocation } from '@/hooks/useLocation';
import { useSafetyZones } from '@/hooks/useSafetyZones';
import { useWeather } from '@/hooks/useWeather';
import { EmergencyButton } from '@/components/EmergencyButton';
import { Video, ResizeMode } from 'expo-av';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { CreateContent } from '@/components/CreateContent';
import { NearbyPlaces } from '@/components/NearbyPlaces';
import { CarRentalList } from '@/components/CarRentalList';
import CurrencyConverter from '@/components/CurrencyConverter';
import { TourismCompanyList } from '@/components/TourismCompanies';
import { SuggestedPlaces } from '@/components/SuggestesPlaces';

const { width, height } = Dimensions.get('window');
const BOTTOM_TAB_HEIGHT = 80;

// Story data with media URLs
const dummyStories = [
  {
    id: '1',
    username: 'musema_gabriel', // Common Rwandan name
    imageUrl:
      'https://www.newtimes.co.rw/thenewtimes/uploads/images/2023/04/17/thumbs/1200x700/16637.jpg',
    hasUnseenStory: true,
    mediaUrl:
      'https://www.newtimes.co.rw/thenewtimes/uploads/images/2023/03/17/thumbs/1200x700/14341.jpg', // Replace with actual video URL
    mediaType: 'video',
  },
  {
    id: '2',
    username: 'niyonsaba_marie', // Another common Rwandan name
    imageUrl:
      'https://cf.bstatic.com/xdata/images/hotel/max1024x768/548611537.jpg?k=1006c1484f0fd65395e611a70101aa4b43b9922eccde18e595f40efb39b45265&o=&hp=1',
    hasUnseenStory: true,
    mediaUrl:
      'https://cf.bstatic.com/xdata/images/hotel/max1024x768/548611537.jpg?k=1006c1484f0fd65395e611a70101aa4b43b9922eccde18e595f40efb39b45265&o=&hp=1',
    mediaType: 'image',
  },
  {
    id: '3',
    username: 'mugenzi_jean', // Common Rwandan name
    imageUrl: 'https://ichef.bbci.co.uk/images/ic/480xn/p07y6m73.jpg.webp',
    hasUnseenStory: true,
    mediaUrl: 'https://ichef.bbci.co.uk/images/ic/480xn/p07y6m73.jpg.webp',
    mediaType: 'image',
  },
  {
    id: '4',
    username: 'nyiranshuti_angelique', // Another common name
    imageUrl:
      'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSlDxDPxVSUEydboUbnlI5QFKa3J_SvNgRKxhgwrhRl4P0IR-OKj9CrR7hcL7ZZs2NTUyBaTBIIyPJ5sqsWXVqFHaxWUXMETYp9dU9Clg',
    hasUnseenStory: true,
    mediaUrl:
      'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSlDxDPxVSUEydboUbnlI5QFKa3J_SvNgRKxhgwrhRl4P0IR-OKj9CrR7hcL7ZZs2NTUyBaTBIIyPJ5sqsWXVqFHaxWUXMETYp9dU9Clg',
    mediaType: 'image',
  },
  {
    id: '5',
    username: 'habimana_david', // Common Rwandan name
    imageUrl:
      'https://visitrwanda.com/wp-content/uploads/fly-images/1630/Visit-Rwanda-NH_OO_Lifestyle_Canopy_Walk_0657_MASTER-700x467.jpg',
    hasUnseenStory: true,
    mediaUrl:
      'https://visitrwanda.com/wp-content/uploads/fly-images/1630/Visit-Rwanda-NH_OO_Lifestyle_Canopy_Walk_0657_MASTER-700x467.jpg',
    mediaType: 'image',
  },
  {
    id: '6',
    username: 'nyirabagenzi_viviane', // Another common name
    imageUrl:
      'https://ugandarwandagorillatours.com/wp-content/uploads/2021/10/Best-time-to-Visit-Rwanda-1.jpg',
    hasUnseenStory: true,
    mediaUrl:
      'https://ugandarwandagorillatours.com/wp-content/uploads/2021/10/Best-time-to-Visit-Rwanda-1.jpg',
    mediaType: 'image',
  },
];

// Dummy data for Safety Zones
const dummyZones = [
  {
    id: '1',
    name: 'Kigali Heights',
    description:
      'A modern and vibrant area in Kigali known for its excellent infrastructure and peaceful surroundings.',
    safetyLevel: 'safe',
  },
  {
    id: '2',
    name: 'Nyamirambo',
    description:
      'A lively and bustling neighborhood with a rich culture, but be cautious at night as it can be a little unsafe.',
    safetyLevel: 'moderate',
  },
  {
    id: '3',
    name: 'Gisenyi',
    description:
      'A lakeside city located on the shores of Lake Kivu, known for its tranquility and scenic beauty.',
    safetyLevel: 'safe',
  },
  {
    id: '4',
    name: 'Rubavu',
    description:
      'A small town situated on Lake Kivu with serene views, perfect for relaxing holidays and nature walks.',
    safetyLevel: 'safe',
  },
  {
    id: '5',
    name: 'Kibuye',
    description:
      'A scenic area offering great views of Lake Kivu. It has a moderate safety level, especially at night.',
    safetyLevel: 'moderate',
  },
];

const reviews = [
  {
    id: '1',
    username: 'Munyaneza Claude',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Claude',
    createdAt: '2025-04-29T10:00:00Z',
    text: 'Kacyiru is very secure, especially near the embassy area. I walk freely even in the evenings.',
    rating: 5,
  },
  {
    id: '2',
    username: 'Uwimana Aline',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aline',
    createdAt: '2025-04-28T14:30:00Z',
    text: 'Nyamirambo has lively streets but you have to be alert at night, especially in less lit areas.',
    rating: 3,
  },
  {
    id: '3',
    username: 'Niyonsenga Jean',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean',
    createdAt: '2025-04-27T08:15:00Z',
    text: 'Gikondo can be risky at night — I wouldn’t recommend walking alone after 9 PM.',
    rating: 2,
  },
  {
    id: '4',
    username: 'Mukamana Chantal',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chantal',
    createdAt: '2025-04-26T09:45:00Z',
    text: 'Remera has improved a lot. The police patrols are frequent, and I feel safe.',
    rating: 4,
  },
];

// Add dummy reviews data at the top of the file with other dummy data
const dummyReviews = [
  {
    id: '1',
    username: 'niyonsaba_marie',
    userAvatar: 'https://via.placeholder.com/40',
    text: 'The city center is generally safe during the day. I felt comfortable walking around, but would recommend staying in well-lit areas after dark.',
    rating: 4,
    helpful: 12,
    createdAt: '2 days ago',
    images: [
      'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg',
      'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg',
    ],
  },
  {
    id: '2',
    username: 'mugenzi_jean',
    userAvatar: 'https://via.placeholder.com/40',
    text: 'The transportation system is reliable but can be crowded during rush hours. I recommend using ride-sharing apps for convenience.',
    rating: 3,
    helpful: 8,
    createdAt: '5 days ago',
    images: [],
  },
  {
    id: '3',
    username: 'nyiranshuti_angelique',
    userAvatar: 'https://via.placeholder.com/40',
    text: 'The local markets are vibrant and safe. The vendors are friendly and prices are reasonable. Just be mindful of your belongings in crowded areas.',
    rating: 5,
    helpful: 15,
    createdAt: '1 week ago',
    images: [
      'https://images.pexels.com/photos/2387875/pexels-photo-2387875.jpeg',
    ],
  },
];

interface Country {
  id: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  languages: string[];
  emergencyNumbers: {
    police: string;
    ambulance: string;
    fire: string;
  };
}

interface HistoryItem {
  id: string;
  date: string;
  event: string;
  location: string;
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const { location } = useLocation();
  const { safetyZones } = useSafetyZones();
  const { weather } = useWeather(location.latitude, location.longitude);
  const [selectedZone, setSelectedZone] = useState<SafetyZone | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);
  const [videoRef, setVideoRef] = useState<any>(null);
  const { user, selectedCountry, countries, setSelectedCountry } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [countryHistory, setCountryHistory] = useState<HistoryItem[]>([]);
  const [showCreateContent, setShowCreateContent] = useState(false);
  const [contentType, setContentType] = useState<'story' | 'post'>('story');

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleEmergency = () => {
    alert('In a real app, this would connect to emergency services.');
  };

  const handleStoryPress = (story: any) => {
    setSelectedStory(story);
    setIsStoryModalVisible(true);

    // Mark story as seen
    const updatedStories = dummyStories.map((s) =>
      s.id === story.id ? { ...s, hasUnseenStory: false } : s
    );
    // In a real app, you would update the stories state here
  };

  const closeStoryModal = () => {
    if (videoRef) {
      videoRef.pauseAsync();
    }
    setIsStoryModalVisible(false);
    setSelectedStory(null);
  };

  const renderStoryContent = () => {
    if (!selectedStory) return null;

    if (selectedStory.mediaType === 'video') {
      return (
        <Video
          ref={(ref: any) => setVideoRef(ref)}
          source={{ uri: selectedStory.mediaUrl }}
          style={styles.storyMedia}
          useNativeControls={false}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={true}
          shouldPlay={true}
        />
      );
    } else {
      return (
        <Image
          source={{ uri: selectedStory.mediaUrl }}
          style={styles.storyMedia}
          resizeMode="contain"
        />
      );
    }
  };

  const nearestSafetyZones = safetyZones.slice(0, 3);
  const hasUnsafeZones = safetyZones.some(
    (zone) => zone.safetyLevel === 'unsafe'
  );

  useEffect(() => {
    if (selectedCountry) {
      fetchCountryData();
    }
  }, [selectedCountry]);

  const fetchCountryData = async () => {
    try {
      setIsLoading(true);

      // In a real app, these would be API calls to fetch data
      // For now, we'll use the dummy data

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set the data
      // setSafetyZones(dummySafetyZones);
      // setReviews(dummyReviews);
      // setStories(dummyStories);

      // Set country history (in a real app, this would come from an API)
      setCountryHistory([
        {
          id: '1',
          date: '2023-05-15',
          event: 'Visited Kigali',
          location: 'Kigali, Rwanda',
        },
        {
          id: '2',
          date: '2023-05-10',
          event: 'Explored Nyamata Genocide Memorial',
          location: 'Nyamata, Rwanda',
        },
        {
          id: '3',
          date: '2023-05-05',
          event: 'Tried local cuisine',
          location: 'Kigali, Rwanda',
        },
      ]);
    } catch (error) {
      console.error('Error fetching country data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCountryInfo = () => {
    if (!selectedCountry) {
      return (
        <View style={styles.countrySelector}>
          <Text style={[styles.countrySelectorTitle, { color: colors.text }]}>
            Select a Country
          </Text>
          <FlatList
            data={countries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.countryItem, { backgroundColor: colors.card }]}
                onPress={() => setSelectedCountry(item)}
              >
                <Text style={[styles.countryFlag, { fontSize: 24 }]}>
                  {item.flag}
                </Text>
                <Text style={[styles.countryName, { color: colors.text }]}>
                  {item.name}
                </Text>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }

    return (
      <View style={styles.countryInfo}>
        <View style={styles.countryHeader}>
          <Text style={[styles.countryFlag, { fontSize: 32 }]}>
            {selectedCountry.flag}
          </Text>
          <Text
            style={[styles.countryName, { color: colors.text, fontSize: 24 }]}
          >
            {selectedCountry.name}
          </Text>
        </View>

        <View style={styles.countryDetails}>
          <View style={styles.countryDetailItem}>
            <DollarSign size={20} color={colors.primary} />
            <Text style={[styles.countryDetailText, { color: colors.text }]}>
              {selectedCountry.currency} ({selectedCountry.currencySymbol})
            </Text>
          </View>

          <View style={styles.countryDetailItem}>
            <Globe size={20} color={colors.primary} />
            <Text style={[styles.countryDetailText, { color: colors.text }]}>
              Languages: {selectedCountry.languages.join(',')}
            </Text>
          </View>

          <View style={styles.countryDetailItem}>
            <Phone size={20} color={colors.primary} />
            <Text style={[styles.countryDetailText, { color: colors.text }]}>
              Emergency: {selectedCountry.emergencyNumbers.police}
            </Text>
          </View>
        </View>

        <View style={styles.emergencyInfo}>
          <AlertTriangle size={20} color={colors.primary} />
          <Text style={[styles.emergencyInfoText, { color: colors.text }]}>
            Emergency Numbers:
          </Text>
          <Text style={[styles.emergencyInfoText, { color: colors.text }]}>
            Police: {selectedCountry.emergencyNumbers.police}
          </Text>
          <Text style={[styles.emergencyInfoText, { color: colors.text }]}>
            Ambulance: {selectedCountry.emergencyNumbers.ambulance}
          </Text>
          <Text style={[styles.emergencyInfoText, { color: colors.text }]}>
            Fire: {selectedCountry.emergencyNumbers.fire}
          </Text>
        </View>
      </View>
    );
  };

  const renderCountryHistory = () => {
    if (!selectedCountry || countryHistory.length === 0) return null;

    return (
      <View style={styles.historySection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Your History in {selectedCountry.name}
        </Text>
        <FlatList
          data={countryHistory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[styles.historyItem, { backgroundColor: colors.card }]}
            >
              <Clock size={20} color={colors.primary} />
              <View style={styles.historyItemContent}>
                <Text
                  style={[
                    styles.historyItemDate,
                    { color: colors.textSecondary },
                  ]}
                >
                  {item.date}
                </Text>
                <Text style={[styles.historyItemEvent, { color: colors.text }]}>
                  {item.event}
                </Text>
                <Text
                  style={[
                    styles.historyItemLocation,
                    { color: colors.textSecondary },
                  ]}
                >
                  {item.location}
                </Text>
              </View>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  const handleCreateContent = (type: 'story' | 'post') => {
    setContentType(type);
    setShowCreateContent(true);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 60,
      paddingBottom: 16,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    content: {
      flex: 1,
    },
    headerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: colors.background,
      paddingTop: Platform.OS === 'ios' ? 50 : 20,
      paddingBottom: 10,
    },
    contentContainer: {
      paddingTop: 0,
      paddingBottom: 80,
    },
    mapContainer: {
      height: 200,
      marginHorizontal: 15,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: colors.card,
    },
    expandMapButton: {
      position: 'absolute',
      bottom: 12,
      right: 12,
      backgroundColor: colors.card,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 3,
        },
        web: {
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
      }),
    },
    expandMapText: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.primary,
      marginLeft: 8,
    },
    alertContainer: {
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    alertWarning: {
      backgroundColor: '#ef4444',
      padding: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    alertSafe: {
      backgroundColor: '#10b981',
      padding: 16,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    alertTextContainer: {
      flex: 1,
      marginLeft: 12,
    },
    alertTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 16,
      color: '#fff',
      marginBottom: 4,
    },
    alertText: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: '#fff',
    },
    emergencyContainer: {
      padding: 20,
    },
    quickActionsContainer: {
      padding: 20,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      marginTop: 12,
      gap: 12,
    },
    quickActionButton: {
      flex: 1,
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
        web: {
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
      }),
    },
    quickActionText: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.text,
      marginTop: 8,
    },
    quickActionDetail: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
    },
    storyTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 18,
      color: colors.text,
      marginBottom: 12,
      paddingLeft: 24,
      marginTop: 40,
    },
    sectionTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 18,
      color: colors.text,
      marginBottom: 12,
      paddingLeft: 24,
      marginTop: 10,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    seeAllLink: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: colors.primary,
      marginLeft: 'auto',
    },
    safetyZonesContainer: {
      padding: 20,
    },
    safetyZoneCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      ...Platform.select({
        ios: {
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
        web: {
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
      }),
    },
    safetyZoneTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 16,
      color: colors.text,
      marginBottom: 4,
    },
    safetyZoneDescription: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    safetyZoneMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    safetyZoneMetaText: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      color: colors.textSecondary,
      marginLeft: 4,
    },
    emergencyButton: {
      backgroundColor: colors.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
    },
    emergencyButtonText: {
      fontFamily: 'Inter-Bold',
      fontSize: 16,
      color: '#fff',
    },
    storyModal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    storyModalContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    storyModalHeader: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      paddingTop: Platform.OS === 'ios' ? 50 : 20,
    },
    storyModalUserInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    storyModalUsername: {
      fontFamily: 'Inter-Bold',
      fontSize: 16,
      color: '#fff',
      marginLeft: 8,
    },
    storyModalClose: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? 50 : 20,
      right: 20,
      padding: 8,
    },
    storyMedia: {
      width: width,
      height: height * 0.7,
    },
    reviewsContainer: {
      padding: 20,
      paddingBottom: 32,
    },
    reviewItem: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
        web: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
      }),
    },
    reviewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    reviewAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    reviewUserInfo: {
      flex: 1,
    },
    reviewUsername: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 14,
      color: '#0f172a',
    },
    reviewDate: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      color: '#64748b',
    },
    reviewRating: {
      flexDirection: 'row',
    },
    reviewText: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: '#334155',
      lineHeight: 20,
      marginBottom: 12,
    },
    reviewImagesContainer: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    reviewImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
      marginRight: 8,
    },
    reviewFooter: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: '#e2e8f0',
      paddingTop: 12,
    },
    reviewAction: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    reviewActionText: {
      fontFamily: 'Inter-Medium',
      fontSize: 12,
      color: '#64748b',
      marginLeft: 4,
    },
    section: {
      marginBottom: 20,
      marginTop: 60,
    },
    safeZone: {
      borderLeftWidth: 4,
      borderLeftColor: '#10b981',
    },
    moderateZone: {
      borderLeftWidth: 4,
      borderLeftColor: '#f59e0b',
    },
    unsafeZone: {
      borderLeftWidth: 4,
      borderLeftColor: '#ef4444',
    },
    storyModalAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    countrySelector: {
      padding: 16,
    },
    countrySelectorTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    countryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 8,
      marginBottom: 8,
    },
    countryFlag: {
      marginRight: 12,
    },
    countryName: {
      flex: 1,
      fontSize: 16,
    },
    countryInfo: {
      padding: 16,
    },
    countryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    countryDetails: {
      marginBottom: 16,
    },
    countryDetailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    countryDetailText: {
      marginLeft: 8,
      fontSize: 16,
    },
    emergencyInfo: {
      backgroundColor: '#f8f8f8',
      padding: 16,
      borderRadius: 8,
    },
    emergencyInfoText: {
      fontSize: 16,
      marginTop: 8,
    },
    historySection: {
      padding: 16,
    },
    historyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 8,
      marginRight: 16,
      width: 250,
    },
    historyItemContent: {
      marginLeft: 12,
      flex: 1,
    },
    historyItemDate: {
      fontSize: 12,
    },
    historyItemEvent: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 4,
    },
    historyItemLocation: {
      fontSize: 14,
      marginTop: 4,
    },
    headerButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    createButton: {
      backgroundColor: '#007AFF',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    postButton: {
      backgroundColor: '#34C759',
    },
    createButtonText: {
      color: '#fff',
      fontWeight: '600',
    },
    storiesContainer: {
      marginBottom: 24,
      paddingHorizontal: 10,
    },
    storyItem: {
      alignItems: 'center',
      marginRight: 16,
      width: 80,
    },
    storyRing: {
      width: 70,
      height: 70,
      borderRadius: 35,
      borderWidth: 3,
      borderColor: colors.primary, // highlight ring (can be theme.primary)
      justifyContent: 'center',
      alignItems: 'center',
    },
    storyImage: {
      width: 62,
      height: 62,
      borderRadius: 31,
    },
    storyUsername: {
      marginTop: 6,
      fontSize: 12,
      fontWeight: '600',
      textAlign: 'center',
      color: '#333',
    },

    nearbyContainer: {
      marginBottom: 24,
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {showCreateContent ? (
        <CreateContent
          type={contentType}
          onClose={() => setShowCreateContent(false)}
        />
      ) : (
        <>
          {/* <View style={styles.header}>
            <Text style={styles.title}>Safara</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => handleCreateContent('story')}
              >
                <Text style={styles.createButtonText}>Create Story</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.createButton, styles.postButton]}
                onPress={() => handleCreateContent('post')}
              >
                <Text style={styles.createButtonText}>Create Post</Text>
              </TouchableOpacity>
          </View>
        </View> */}

          <ScrollView
            style={[styles.content, { backgroundColor: colors.background }]}
          >
            <View
              style={[styles.container, { backgroundColor: colors.background }]}
            >
              

              <Text style={styles.storyTitle}>Stories</Text>
              <View style={{ marginBottom: 24 }}>
                <StoriesSection
                  stories={dummyStories}
                  onStoryPress={handleStoryPress}
                />
              </View>
            </View>
            <View>
            <Text style={styles.storyTitle}>
                 Suggestions
                </Text>
                <SuggestedPlaces />
              </View>
            <View style={styles.section}>
              <Text style={styles.storyTitle}>Conversion</Text>
              <CurrencyConverter />
            </View>
            <View style={styles.section}>
              <Text style={styles.storyTitle}>Rentals</Text>
              <CarRentalList />
            </View>

            <View style={styles.section}>
              <Text style={styles.storyTitle}>Tourism</Text>
              <TourismCompanyList />
            </View>
            <View style={styles.nearbyContainer}>
              <Text style={styles.sectionTitle}>Nearby Places</Text>
              <NearbyPlaces />
            </View>

            {renderCountryInfo()}
            {renderCountryHistory()}

            <View style={styles.nearbyContainer}>
              <Text style={styles.sectionTitle}>User Reviews</Text>
              <ReviewsSection zone={{ reviews }} />
            </View>
          </ScrollView>

          {/* <EmergencyButton onPress={handleEmergency} /> */}
        </>
      )}

      {/* Story Modal */}
      <Modal
        visible={isStoryModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeStoryModal}
      >
        <StatusBar hidden />
        <View style={styles.storyModal}>
          <View style={styles.storyModalHeader}>
            <View style={styles.storyModalUserInfo}>
              <Image
                source={{ uri: selectedStory?.imageUrl }}
                style={styles.storyModalAvatar}
              />
              <Text style={styles.storyModalUsername}>
                {selectedStory?.username}
              </Text>
            </View>
            <TouchableOpacity
              onPress={closeStoryModal}
              style={styles.storyModalClose}
            >
              <X size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.storyModalContent}>{renderStoryContent()}</View>
        </View>
      </Modal>
    </View>
  );
}
