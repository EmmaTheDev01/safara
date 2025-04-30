import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as Location from 'expo-location';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { MapPin, AlertTriangle, Info } from 'lucide-react-native';

type ContentType = 'story' | 'post';

interface CreateContentProps {
  type: ContentType;
  onClose: () => void;
}

export function CreateContent({ type, onClose }: CreateContentProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [caption, setCaption] = useState('');
  const [safetyLevel, setSafetyLevel] = useState<'safe' | 'moderate' | 'unsafe'>('safe');
  const [safetyNotes, setSafetyNotes] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const cameraRef = useRef<Camera>(null);
  const { user } = useAuth();

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      const locationPermission = await Location.requestForegroundPermissionsAsync();
      if (locationPermission.status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    })();
  }, []);

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        await uploadMedia(photo.uri);
      } catch (error) {
        Alert.alert('Error', 'Failed to capture photo');
      }
    }
  };

  const uploadMedia = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `${user?.id}/${Date.now()}.jpg`;
      
      const { data, error } = await supabase.storage
        .from('media')
        .upload(filename, blob);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filename);

      if (type === 'story') {
        await supabase.from('stories').insert({
          user_id: user?.id,
          media_url: publicUrl,
          media_type: 'image',
          caption,
          location_lat: location?.latitude,
          location_lng: location?.longitude,
          safety_level: safetyLevel,
          safety_notes: safetyNotes,
        });
      } else {
        await supabase.from('posts').insert({
          user_id: user?.id,
          title: caption,
          content: safetyNotes,
          location_lat: location?.latitude,
          location_lng: location?.longitude,
          category: 'safety_alert',
          safety_level: safetyLevel,
        });
      }

      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to upload media');
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting permissions...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Camera 
        style={styles.camera} 
        ref={cameraRef} 
        type={CameraType.back}
      >
        <View style={styles.controls}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          
          <View style={styles.safetyControls}>
            <TouchableOpacity
              style={[styles.safetyButton, safetyLevel === 'safe' && styles.safetyButtonActive]}
              onPress={() => setSafetyLevel('safe')}
            >
              <Text style={styles.safetyButtonText}>Safe</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.safetyButton, safetyLevel === 'moderate' && styles.safetyButtonActive]}
              onPress={() => setSafetyLevel('moderate')}
            >
              <Text style={styles.safetyButtonText}>Moderate</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.safetyButton, safetyLevel === 'unsafe' && styles.safetyButtonActive]}
              onPress={() => setSafetyLevel('unsafe')}
            >
              <Text style={styles.safetyButtonText}>Unsafe</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={type === 'story' ? 'Add caption...' : 'Add title...'}
              value={caption}
              onChangeText={setCaption}
              placeholderTextColor="#fff"
            />
            <TextInput
              style={[styles.input, styles.notesInput]}
              placeholder="Add safety notes..."
              value={safetyNotes}
              onChangeText={setSafetyNotes}
              placeholderTextColor="#fff"
              multiline
            />
          </View>

          <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  controls: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  safetyControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 40,
  },
  safetyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  safetyButtonActive: {
    backgroundColor: '#007AFF',
  },
  safetyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
  },
  input: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 10,
    color: '#fff',
    marginBottom: 10,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  captureButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
}); 