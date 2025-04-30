import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Camera, Cpu, Eye, Lock, MoveUpRight, Shield, Smartphone, Volume2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [dataCollection, setDataCollection] = useState(true);
  const [stealthMode, setStealthMode] = useState(false);
  
  const toggleSwitch = (setting, value) => {
    // Provide haptic feedback on supported platforms
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    switch(setting) {
      case 'notifications':
        setNotifications(value);
        break;
      case 'locationTracking':
        setLocationTracking(value);
        break;
      case 'darkMode':
        setDarkMode(value);
        break;
      case 'dataCollection':
        setDataCollection(value);
        break;
      case 'stealthMode':
        setStealthMode(value);
        break;
    }
  };
  
  return (
    <LinearGradient
      colors={['#1E3A8A', '#2563EB', '#1E3A8A']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>App Settings</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Weather Settings</Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Bell size={20} color="#D1D5DB" />
                <Text style={styles.settingText}>Weather Notifications</Text>
              </View>
              <Switch
                trackColor={{ false: '#3F3F46', true: '#16A34A' }}
                thumbColor={notifications ? '#FFFFFF' : '#D1D5DB'}
                ios_backgroundColor="#3F3F46"
                onValueChange={(value) => toggleSwitch('notifications', value)}
                value={notifications}
              />
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <MoveUpRight size={20} color="#D1D5DB" />
                <Text style={styles.settingText}>Location Tracking</Text>
              </View>
              <Switch
                trackColor={{ false: '#3F3F46', true: '#16A34A' }}
                thumbColor={locationTracking ? '#FFFFFF' : '#D1D5DB'}
                ios_backgroundColor="#3F3F46"
                onValueChange={(value) => toggleSwitch('locationTracking', value)}
                value={locationTracking}
              />
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Eye size={20} color="#D1D5DB" />
                <Text style={styles.settingText}>Dark Mode</Text>
              </View>
              <Switch
                trackColor={{ false: '#3F3F46', true: '#16A34A' }}
                thumbColor={darkMode ? '#FFFFFF' : '#D1D5DB'}
                ios_backgroundColor="#3F3F46"
                onValueChange={(value) => toggleSwitch('darkMode', value)}
                value={darkMode}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Advanced Features</Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Camera size={20} color="#D1D5DB" />
                <Text style={styles.settingText}>Camera Access</Text>
              </View>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Configure</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Volume2 size={20} color="#D1D5DB" />
                <Text style={styles.settingText}>Audio Features</Text>
              </View>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Configure</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Shield size={20} color="#D1D5DB" />
                <Text style={styles.settingText}>Data Collection</Text>
              </View>
              <Switch
                trackColor={{ false: '#3F3F46', true: '#16A34A' }}
                thumbColor={dataCollection ? '#FFFFFF' : '#D1D5DB'}
                ios_backgroundColor="#3F3F46"
                onValueChange={(value) => toggleSwitch('dataCollection', value)}
                value={dataCollection}
              />
            </View>
          </View>
          
          {/* Hidden VitaScan settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Developer Options</Text>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Lock size={20} color="#DC2626" />
                <Text style={styles.settingTextSpecial}>Stealth Mode</Text>
              </View>
              <Switch
                trackColor={{ false: '#3F3F46', true: '#DC2626' }}
                thumbColor={stealthMode ? '#FFFFFF' : '#D1D5DB'}
                ios_backgroundColor="#3F3F46"
                onValueChange={(value) => toggleSwitch('stealthMode', value)}
                value={stealthMode}
              />
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Cpu size={20} color="#0D9488" />
                <Text style={styles.settingText}>Detection Sensitivity</Text>
              </View>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Configure</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Smartphone size={20} color="#0D9488" />
                <Text style={styles.settingText}>Mesh Network</Text>
              </View>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Configure</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.version}>Version 1.0.0</Text>
            <Text style={styles.copyright}>
              © 2025 VitaScan - All rights reserved
            </Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100, // Space for tab bar
  },
  header: {
    marginTop: 60,
    marginBottom: 30,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#D1D5DB',
    marginLeft: 10,
  },
  settingTextSpecial: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#DC2626',
    marginLeft: 10,
  },
  button: {
    backgroundColor: 'rgba(13, 148, 136, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: {
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  version: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#D1D5DB',
  },
  copyright: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 5,
  }
});