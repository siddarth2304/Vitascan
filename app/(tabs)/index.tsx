import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, Sun, Thermometer } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useDetectionService } from '@/services/detectionService';
import { DetectionOverlay } from '@/components/DetectionOverlay';
import * as Haptics from 'expo-haptics';

// Mock weather data
const mockWeatherData = {
  current: {
    temp: 72,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 8,
    feelsLike: 74,
  },
  forecast: [
    { day: 'Mon', high: 75, low: 62, icon: 'sun' },
    { day: 'Tue', high: 78, low: 65, icon: 'cloud' },
    { day: 'Wed', high: 72, low: 60, icon: 'cloud-rain' },
    { day: 'Thu', high: 70, low: 58, icon: 'cloud-drizzle' },
    { day: 'Fri', high: 74, low: 62, icon: 'cloud' },
    { day: 'Sat', high: 76, low: 64, icon: 'sun' },
    { day: 'Sun', high: 79, low: 66, icon: 'sun' },
  ],
  location: 'New York, NY',
};

// Weather icon mapping
const weatherIcons = {
  'sun': <Sun size={24} color="#FFD700" />,
  'cloud': <Cloud size={24} color="#D1D5DB" />,
  'cloud-rain': <CloudRain size={24} color="#D1D5DB" />,
  'cloud-drizzle': <CloudDrizzle size={24} color="#D1D5DB" />,
  'cloud-lightning': <CloudLightning size={24} color="#D1D5DB" />,
  'cloud-fog': <CloudFog size={24} color="#D1D5DB" />,
};

// Tap counter for triggering detection mode
let tapCount = 0;
let tapTimer: NodeJS.Timeout | null = null;

export default function WeatherScreen() {
  const [showDetection, setShowDetection] = useState(false);
  const [tapFeedback, setTapFeedback] = useState(false);
  const { peopleCount, weaponCount, startDetection, stopDetection, isDetecting } = useDetectionService();

  // Reset tap counter after delay
  const resetTapCount = () => {
    tapCount = 0;
    if (tapTimer) {
      clearTimeout(tapTimer);
      tapTimer = null;
    }
  };

  // Handle triple tap to toggle detection mode
  const handleTripleTap = () => {
    tapCount++;
    
    if (tapCount === 1) {
      // Start timer to reset count if triple tap doesn't happen
      tapTimer = setTimeout(resetTapCount, 800);
    }
    
    if (tapCount === 3) {
      resetTapCount();
      
      // Toggle detection overlay
      setShowDetection(prev => !prev);
      
      // Provide haptic feedback on supported platforms
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
      }
      
      // Visual feedback
      setTapFeedback(true);
      setTimeout(() => setTapFeedback(false), 300);
      
      // Start or stop detection
      if (!showDetection) {
        startDetection();
      } else {
        stopDetection();
      }
    }
  };

  // Component cleanup
  useEffect(() => {
    return () => {
      if (tapTimer) {
        clearTimeout(tapTimer);
      }
      stopDetection();
    };
  }, []);

  return (
    <LinearGradient
      colors={['#1E3A8A', '#2563EB', '#1E3A8A']}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <TouchableOpacity 
          activeOpacity={1}
          style={styles.weatherContainer} 
          onPress={handleTripleTap}
        >
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>{mockWeatherData.location}</Text>
            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>

          <View style={styles.currentWeatherBox}>
            <View style={styles.tempContainer}>
              <Text style={styles.currentTemp}>
                {mockWeatherData.current.temp}°
              </Text>
              <Text style={styles.currentCondition}>
                {mockWeatherData.current.condition}
              </Text>
            </View>

            <View style={styles.weatherDetails}>
              <View style={styles.weatherDetail}>
                <Thermometer size={18} color="#D1D5DB" />
                <Text style={styles.detailText}>
                  Feels like {mockWeatherData.current.feelsLike}°
                </Text>
              </View>
              <View style={styles.weatherDetail}>
                <CloudDrizzle size={18} color="#D1D5DB" />
                <Text style={styles.detailText}>
                  Humidity {mockWeatherData.current.humidity}%
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.forecastContainer}>
            <Text style={styles.forecastTitle}>7-Day Forecast</Text>
            <View style={styles.forecastList}>
              {mockWeatherData.forecast.map((day, index) => (
                <View key={index} style={styles.forecastDay}>
                  <Text style={styles.dayText}>{day.day}</Text>
                  {weatherIcons[day.icon]}
                  <Text style={styles.tempText}>{day.high}°</Text>
                  <Text style={styles.tempTextLow}>{day.low}°</Text>
                </View>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
      
      {/* Visual feedback for tap */}
      {tapFeedback && (
        <Animated.View 
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(150)}
          style={styles.tapFeedback} 
        />
      )}
      
      {/* Detection overlay */}
      {showDetection && (
        <DetectionOverlay 
          onClose={() => {
            setShowDetection(false);
            stopDetection();
          }}
          peopleCount={peopleCount}
          weaponCount={weaponCount}
          isDetecting={isDetecting}
        />
      )}
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
  contentContainer: {
    paddingBottom: 100, // Space for tab bar
  },
  weatherContainer: {
    padding: 20,
  },
  locationContainer: {
    marginTop: 60,
    marginBottom: 30,
  },
  locationText: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#D1D5DB',
    marginTop: 4,
  },
  currentWeatherBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  tempContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  currentTemp: {
    fontFamily: 'Inter-Bold',
    fontSize: 64,
    color: '#FFFFFF',
  },
  currentCondition: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#D1D5DB',
    marginLeft: 12,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#D1D5DB',
    marginLeft: 6,
  },
  forecastContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  forecastTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 15,
  },
  forecastList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastDay: {
    alignItems: 'center',
    width: 40,
  },
  dayText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#D1D5DB',
    marginBottom: 8,
  },
  tempText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 8,
  },
  tempTextLow: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#D1D5DB',
    marginTop: 2,
  },
  tapFeedback: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});