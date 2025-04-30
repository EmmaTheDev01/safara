import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  country?: string;
  preferredLanguage?: string;
  emergencyContacts?: EmergencyContact[];
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<void>;
  removeEmergencyContact: (id: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  countries: Country[];
  selectedCountry: Country | null;
  setSelectedCountry: (country: Country | null) => void;
}

interface Country {
  id: string;
  name: string;
  code: string;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample countries data - in a real app, this would come from an API
const sampleCountries: Country[] = [
  {
    id: '1',
    name: 'Rwanda',
    code: 'RW',
    flag: '🇷🇼',
    currency: 'Rwandan Franc',
    currencySymbol: 'RWF',
    languages: ['Kinyarwanda', 'French', 'English', 'Swahili'],
    emergencyNumbers: {
      police: '112',
      ambulance: '912',
      fire: '112',
    },
  },
  {
    id: '2',
    name: 'Kenya',
    code: 'KE',
    flag: '🇰🇪',
    currency: 'Kenyan Shilling',
    currencySymbol: 'KES',
    languages: ['Swahili', 'English'],
    emergencyNumbers: {
      police: '999',
      ambulance: '999',
      fire: '999',
    },
  },
  {
    id: '3',
    name: 'Tanzania',
    code: 'TZ',
    flag: '🇹🇿',
    currency: 'Tanzanian Shilling',
    currencySymbol: 'TZS',
    languages: ['Swahili', 'English'],
    emergencyNumbers: {
      police: '115',
      ambulance: '114',
      fire: '113',
    },
  },
  {
    id: '4',
    name: 'Uganda',
    code: 'UG',
    flag: '🇺🇬',
    currency: 'Ugandan Shilling',
    currencySymbol: 'UGX',
    languages: ['English', 'Swahili', 'Luganda'],
    emergencyNumbers: {
      police: '999',
      ambulance: '999',
      fire: '999',
    },
  },
  {
    id: '5',
    name: 'Ethiopia',
    code: 'ET',
    flag: '🇪🇹',
    currency: 'Ethiopian Birr',
    currencySymbol: 'ETB',
    languages: ['Amharic', 'English'],
    emergencyNumbers: {
      police: '991',
      ambulance: '907',
      fire: '939',
    },
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countries] = useState<Country[]>(sampleCountries);

  useEffect(() => {
    // Check for existing session
    checkUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          avatar: data.avatar_url,
          country: data.country,
          preferredLanguage: data.preferred_language,
          emergencyContacts: data.emergency_contacts || [],
        });

        // Set selected country if user has one
        if (data.country) {
          const country = countries.find(c => c.id === data.country);
          if (country) {
            setSelectedCountry(country);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login error:', error.message);
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      router.replace('/auth/login');
    } catch (error: any) {
      console.error('Logout error:', error.message);
      throw new Error(error.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email,
              name,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

        if (profileError) throw profileError;
      }
      
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Signup error:', error.message);
      throw new Error(error.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setIsLoading(true);
      
      if (!user) throw new Error('No user logged in');
      
      const updates = {
        name: data.name,
        avatar_url: data.avatar,
        country: data.country,
        preferred_language: data.preferredLanguage,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local user state
      setUser({
        ...user,
        ...data,
      });
      
      return true;
    } catch (error: any) {
      console.error('Update profile error:', error.message);
      throw new Error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const addEmergencyContact = async (contact: Omit<EmergencyContact, 'id'>) => {
    try {
      setIsLoading(true);
      
      if (!user) throw new Error('No user logged in');
      
      const newContact = {
        ...contact,
        id: Date.now().toString(), // Simple ID generation
      };
      
      const updatedContacts = [...(user.emergencyContacts || []), newContact];
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          emergency_contacts: updatedContacts,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local user state
      setUser({
        ...user,
        emergencyContacts: updatedContacts,
      });
      
      return true;
    } catch (error: any) {
      console.error('Add emergency contact error:', error.message);
      throw new Error(error.message || 'Failed to add emergency contact');
    } finally {
      setIsLoading(false);
    }
  };

  const removeEmergencyContact = async (id: string) => {
    try {
      setIsLoading(true);
      
      if (!user) throw new Error('No user logged in');
      
      const updatedContacts = (user.emergencyContacts || []).filter(
        contact => contact.id !== id
      );
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          emergency_contacts: updatedContacts,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local user state
      setUser({
        ...user,
        emergencyContacts: updatedContacts,
      });
      
      return true;
    } catch (error: any) {
      console.error('Remove emergency contact error:', error.message);
      throw new Error(error.message || 'Failed to remove emergency contact');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'safara://auth/reset-password',
      });
      
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      console.error('Reset password error:', error.message);
      throw new Error(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        login,
        logout,
        signup,
        updateProfile,
        addEmergencyContact,
        removeEmergencyContact,
        resetPassword,
        countries,
        selectedCountry,
        setSelectedCountry,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 