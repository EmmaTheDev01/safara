import React, { useState, useCallback } from 'react';
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
    mediaUrl: 'https://youtu.be/IpNekyJQ-KI', // Replace with actual video URL
    mediaType: 'video',
  },
  {
    id: '2',
    username: 'niyonsaba_marie', // Another common Rwandan name
    imageUrl: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/548611537.jpg?k=1006c1484f0fd65395e611a70101aa4b43b9922eccde18e595f40efb39b45265&o=&hp=1',
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
    mediaUrl:
      'https://ichef.bbci.co.uk/images/ic/480xn/p07y6m73.jpg.webp',
    mediaType: 'image',
  },
  {
    id: '4',
    username: 'nyiranshuti_angelique', // Another common name
    imageUrl: 'https://via.placeholder.com/50',
    hasUnseenStory: true,
    mediaUrl:
      'https://images.pexels.com/photos/2387875/pexels-photo-2387875.jpeg',
    mediaType: 'image',
  },
  {
    id: '5',
    username: 'habimana_david', // Common Rwandan name
    imageUrl: 'https://via.placeholder.com/50',
    hasUnseenStory: true,
    mediaUrl:
      'https://images.pexels.com/photos/2387877/pexels-photo-2387877.jpeg',
    mediaType: 'image',
  },
  {
    id: '6',
    username: 'nyirabagenzi_viviane', // Another common name
    imageUrl: 'https://via.placeholder.com/50',
    hasUnseenStory: true,
    mediaUrl:
      'https://images.pexels.com/photos/2387879/pexels-photo-2387879.jpeg',
    mediaType: 'image',
  },
  {
    id: '7',
    username: 'bimenyimana_jeanne', // Common name
    imageUrl: 'https://via.placeholder.com/50',
    hasUnseenStory: true,
    mediaUrl:
      'https://images.pexels.com/photos/2387881/pexels-photo-2387881.jpeg',
    mediaType: 'image',
  },
  {
    id: '8',
    username: 'rukundo_eric', // Common Rwandan name
    imageUrl: 'https://via.placeholder.com/50',
    hasUnseenStory: true,
    mediaUrl:
      'https://images.pexels.com/photos/2387883/pexels-photo-2387883.jpeg',
    mediaType: 'image',
  },
  {
    id: '9',
    username: 'ndahiro_diane', // Common name
    imageUrl: 'https://via.placeholder.com/50',
    hasUnseenStory: true,
    mediaUrl:
      'https://images.pexels.com/photos/2387885/pexels-photo-2387885.jpeg',
    mediaType: 'image',
  },
  {
    id: '10',
    username: 'nshimiyimana_paul', // Common Rwandan name
    imageUrl: 'https://via.placeholder.com/50',
    hasUnseenStory: true,
    mediaUrl:
      'https://images.pexels.com/photos/2387887/pexels-photo-2387887.jpeg',
    mediaType: 'image',
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    content: {
      flex: 1,
      marginTop: 60,
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
    sectionTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 18,
      color: colors.text,
      marginBottom: 12,
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
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Fixed header below status bar */}
      <View style={styles.headerContainer}>
        <CustomHeader
          searchPlaceholder="Search locations..."
          onSearch={handleSearch}
        />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <StoriesSection
            stories={dummyStories}
            onStoryPress={handleStoryPress}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.mapContainer}>
            <SafetyMapView
              location={location}
              safetyZones={safetyZones}
              isLoading={false}
              onSelectZone={setSelectedZone}
            />
            <Link href="/map" asChild>
              <TouchableOpacity style={styles.expandMapButton}>
                <Navigation size={20} color="#6366f1" />
                <Text style={styles.expandMapText}>Open Full Map</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {selectedZone && (
          <View style={styles.section}>
            <ReviewsSection zone={selectedZone} />
          </View>
        )}

        <View style={styles.alertContainer}>
          {hasUnsafeZones ? (
            <View style={styles.alertWarning}>
              <AlertTriangle size={24} color="#fff" />
              <View style={styles.alertTextContainer}>
                <Text style={styles.alertTitle}>Safety Alert</Text>
                <Text style={styles.alertText}>
                  Exercise caution in marked areas. Check the map for details.
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.alertSafe}>
              <Shield size={24} color="#fff" />
              <View style={styles.alertTextContainer}>
                <Text style={styles.alertTitle}>Safe Area</Text>
                <Text style={styles.alertText}>
                  Current location is considered safe for travelers.
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <Link href="/weather" asChild>
              <TouchableOpacity style={styles.quickActionButton}>
                <Cloud size={24} color="#6366f1" />
                <Text style={styles.quickActionText}>Weather</Text>
                {weather && (
                  <Text style={styles.quickActionDetail}>
                    {weather.temperature}°F
                  </Text>
                )}
              </TouchableOpacity>
            </Link>
            <Link href="/translator" asChild>
              <TouchableOpacity style={styles.quickActionButton}>
                <Languages size={24} color="#6366f1" />
                <Text style={styles.quickActionText}>Translator</Text>
                <Text style={styles.quickActionDetail}>15 phrases</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <View style={styles.safetyZonesContainer}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#6366f1" />
            <Text style={styles.sectionTitle}>Nearby Safety Zones</Text>
            <Link href="/map" asChild>
              <TouchableOpacity>
                <Text style={styles.seeAllLink}>View All</Text>
              </TouchableOpacity>
            </Link>
          </View>
          {nearestSafetyZones.map((zone) => (
            <View
              key={zone.id}
              style={[
                styles.safetyZoneCard,
                zone.safetyLevel === 'safe'
                  ? styles.safeZone
                  : zone.safetyLevel === 'moderate'
                  ? styles.moderateZone
                  : styles.unsafeZone,
              ]}
            >
              <Text style={styles.safetyZoneTitle}>{zone.name}</Text>
              <Text style={styles.safetyZoneDescription}>{zone.description}</Text>
            </View>
          ))}
        </View>

        {/* Reviews Section */}
        <View style={styles.reviewsContainer}>
          <View style={styles.sectionHeader}>
            <FileText size={20} color="#6366f1" />
            <Text style={styles.sectionTitle}>Recent Reviews</Text>
            <Link href="/insights" asChild>
              <TouchableOpacity>
                <Text style={styles.seeAllLink}>View All</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          {dummyReviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Image 
                  source={{ uri: review.userAvatar || 'https://via.placeholder.com/40' }} 
                  style={styles.reviewAvatar} 
                />
                <View style={styles.reviewUserInfo}>
                  <Text style={styles.reviewUsername}>{review.username}</Text>
                  <Text style={styles.reviewDate}>{review.createdAt}</Text>
                </View>
                <View style={styles.reviewRating}>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      color={i < review.rating ? '#f59e0b' : '#e2e8f0'} 
                      fill={i < review.rating ? '#f59e0b' : 'none'} 
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
              {review.images && review.images.length > 0 && (
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.reviewImagesContainer}
                >
                  {review.images.map((image, index) => (
                    <Image 
                      key={index} 
                      source={{ uri: image }} 
                      style={styles.reviewImage} 
                    />
                  ))}
                </ScrollView>
              )}
              <View style={styles.reviewFooter}>
                <TouchableOpacity style={styles.reviewAction}>
                  <ThumbsUp size={16} color="#64748b" />
                  <Text style={styles.reviewActionText}>{review.helpful}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reviewAction}>
                  <MessageCircle size={16} color="#64748b" />
                  <Text style={styles.reviewActionText}>Reply</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.emergencyContainer}>
            <EmergencyButton onPress={handleEmergency} />
          </View>
        </View>
      </ScrollView>

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
