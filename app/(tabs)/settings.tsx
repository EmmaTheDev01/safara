import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useRouter } from 'expo-router';
import { 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  LogIn,
  Settings as SettingsIcon,
  Map,
  MessageSquare
} from 'lucide-react-native';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // This should be managed by your auth context

  const handleLogin = () => {
    router.push('/auth/login');
  };

  const handleLogout = () => {
    // Add logout logic here
    setIsLoggedIn(false);
  };

  const settingsOptions = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      onPress: () => {},
      requiresAuth: true,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      onPress: () => {},
    },
    {
      id: 'safety',
      label: 'Safety Settings',
      icon: Shield,
      onPress: () => {},
    },
    {
      id: 'map',
      label: 'Map Preferences',
      icon: Map,
      onPress: () => {},
    },
    {
      id: 'messages',
      label: 'Message Settings',
      icon: MessageSquare,
      onPress: () => {},
      requiresAuth: true,
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      onPress: () => {},
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
      paddingHorizontal: 16,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    optionText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
      flex: 1,
    },
    authButton: {
      margin: 16,
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.primary,
      alignItems: 'center',
    },
    authButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {isLoggedIn ? (
            <TouchableOpacity style={styles.authButton} onPress={handleLogout}>
              <LogOut size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.authButtonText}>Log Out</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.authButton} onPress={handleLogin}>
              <LogIn size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.authButtonText}>Log In</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settingsOptions.map((option) => {
            if (option.requiresAuth && !isLoggedIn) return null;
            
            const Icon = option.icon;
            return (
              <TouchableOpacity
                key={option.id}
                style={styles.option}
                onPress={option.onPress}
              >
                <Icon size={24} color={colors.text} />
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
} 