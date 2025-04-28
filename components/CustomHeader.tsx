import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Platform,
  Modal,
  FlatList
} from 'react-native';
import { 
  Search, 
  MoreVertical, 
  X, 
  Moon, 
  Sun, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/theme/colors';

interface CustomHeaderProps {
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  rightComponent?: React.ReactNode;
}

export function CustomHeader({ 
  showSearch = true, 
  onSearch, 
  searchPlaceholder = "Search...",
  rightComponent
}: CustomHeaderProps) {
  const { isDark, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  
  const themeColors = isDark ? colors.dark : colors.light;
  
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (onSearch) {
      onSearch(text);
    }
  };
  
  const menuItems = [
    { id: 'theme', label: isDark ? 'Light Mode' : 'Dark Mode', icon: isDark ? Sun : Moon, onPress: toggleTheme },
    { id: 'settings', label: 'Settings', icon: Settings, onPress: () => {} },
    { id: 'help', label: 'Help', icon: HelpCircle, onPress: () => {} },
    { id: 'logout', label: 'Logout', icon: LogOut, onPress: () => {} },
  ];
  
  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: themeColors.card }]}>
          <Search size={20} color={themeColors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: themeColors.text }]}
            placeholder={searchPlaceholder}
            placeholderTextColor={themeColors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => handleSearch('')}
              style={styles.clearButton}
            >
              <X size={20} color={themeColors.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity 
          onPress={() => setMenuVisible(true)}
          style={styles.iconButton}
        >
          <MoreVertical size={24} color={themeColors.text} />
        </TouchableOpacity>
      </View>
      
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={[styles.menuContainer, { backgroundColor: themeColors.card }]}>
            <FlatList
              data={menuItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.menuItem}
                  onPress={() => {
                    item.onPress();
                    setMenuVisible(false);
                  }}
                >
                  <item.icon size={20} color={themeColors.text} />
                  <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    right: 16,
    zIndex: 1,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  clearButton: {
    padding: 4,
  },
  iconButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 12,
  },
}); 