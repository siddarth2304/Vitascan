import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { TriangleAlert as AlertTriangle, Users, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

type DetectionOverlayProps = {
  onClose: () => void;
  peopleCount: number;
  weaponCount: number;
  isDetecting: boolean;
};

export function DetectionOverlay({ 
  onClose, 
  peopleCount, 
  weaponCount, 
  isDetecting 
}: DetectionOverlayProps) {
  
  // Provide haptic feedback on mount
  if (Platform.OS !== 'web') {
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Warning
    );
  }
  
  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={styles.overlay}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>VitaScan Detection</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <X size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator, 
            isDetecting ? styles.statusActive : styles.statusInactive
          ]} />
          <Text style={styles.statusText}>
            {isDetecting ? 'ACTIVE' : 'INACTIVE'}
          </Text>
        </View>
        
        <View style={styles.detectionStats}>
          <View style={styles.statBox}>
            <Users size={24} color="#FFFFFF" />
            <Text style={styles.statValue}>{peopleCount}</Text>
            <Text style={styles.statLabel}>People Detected</Text>
          </View>
          
          <View style={styles.statBox}>
            <AlertTriangle size={24} color="#DC2626" />
            <Text style={[styles.statValue, weaponCount > 0 && styles.statValueAlert]}>
              {weaponCount}
            </Text>
            <Text style={styles.statLabel}>Weapons Detected</Text>
          </View>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Detection is active and processing camera data. Triple-tap anywhere to hide this overlay.
          </Text>
          <Text style={styles.infoText}>
            Data is being stored locally and transmitted via offline mesh network when possible.
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>RETURN TO WEATHER</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    width: '85%',
    backgroundColor: '#1E3A8A',
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusActive: {
    backgroundColor: '#16A34A',
  },
  statusInactive: {
    backgroundColor: '#DC2626',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#D1D5DB',
  },
  detectionStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginVertical: 8,
  },
  statValueAlert: {
    color: '#DC2626',
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0D9488',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});