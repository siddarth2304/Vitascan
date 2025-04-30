import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TriangleAlert as AlertTriangle, Users } from 'lucide-react-native';
import { useMeshNetwork } from '@/services/meshNetworkService';
import { useDetectionService } from '@/services/detectionService';
import { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function MapScreen() {
  const { sendAlert, connectedDevices, lastReceivedMessage } = useMeshNetwork();
  const { peopleCount, weaponCount, isDetecting } = useDetectionService();
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [panicMode, setPanicMode] = useState(false);

  // Toggle control panel with triple tap
  let tapCount = 0;
  let tapTimer: NodeJS.Timeout | null = null;

  const handleTripleTap = () => {
    tapCount++;
    
    if (tapCount === 1) {
      // Start timer to reset count if triple tap doesn't happen
      if (tapTimer) clearTimeout(tapTimer);
      tapTimer = setTimeout(() => { tapCount = 0; }, 800);
    }
    
    if (tapCount === 3) {
      tapCount = 0;
      if (tapTimer) clearTimeout(tapTimer);
      
      // Toggle control panel
      setShowControlPanel(prev => !prev);
      
      // Provide haptic feedback on supported platforms
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
      }
    }
  };

  const triggerPanicMode = () => {
    setPanicMode(true);
    sendAlert({
      type: 'PANIC',
      location: 'Unknown',
      peopleCount,
      weaponCount,
      timestamp: new Date().toISOString()
    });
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      );
    }
    
    // Auto-disable panic mode after 10 seconds
    setTimeout(() => {
      setPanicMode(false);
    }, 10000);
  };

  useEffect(() => {
    return () => {
      if (tapTimer) clearTimeout(tapTimer);
    };
  }, []);

  return (
    <LinearGradient
      colors={['#1E3A8A', '#2563EB', '#1E3A8A']}
      style={styles.container}
    >
      <TouchableOpacity 
        activeOpacity={1} 
        style={styles.mapContainer}
        onPress={handleTripleTap}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Local Weather Radar</Text>
        </View>
        
        {/* Weather map image placeholder */}
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
          style={styles.mapImage}
          resizeMode="cover"
        />
        
        {/* Mock map controls */}
        <View style={styles.mapControls}>
          <View style={styles.zoomButtons}>
            <TouchableOpacity style={styles.zoomButton}>
              <Text style={styles.zoomButtonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomButton}>
              <Text style={styles.zoomButtonText}>-</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.weatherLayersButtons}>
            <TouchableOpacity style={[styles.layerButton, styles.layerButtonActive]}>
              <Text style={styles.layerButtonText}>Rain</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.layerButton}>
              <Text style={styles.layerButtonText}>Wind</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.layerButton}>
              <Text style={styles.layerButtonText}>Temp</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Hidden control panel */}
        {showControlPanel && (
          <Animated.View 
            entering={FadeIn.duration(300)}
            style={styles.controlPanel}
          >
            <View style={styles.controlHeader}>
              <Text style={styles.controlTitle}>VitaScan Control Panel</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowControlPanel(false)}
              >
                <Text style={styles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.statRow}>
              <Users size={20} color="#D1D5DB" />
              <Text style={styles.statText}>
                People Detected: {peopleCount}
              </Text>
            </View>
            
            <View style={styles.statRow}>
              <AlertTriangle size={20} color="#DC2626" />
              <Text style={styles.statText}>
                Weapons Detected: {weaponCount}
              </Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Mesh Network Status:</Text>
              <Text style={styles.statText}>
                {connectedDevices.length} device(s) connected
              </Text>
            </View>
            
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Last Message:</Text>
              <Text style={styles.statText}>
                {lastReceivedMessage ? new Date(lastReceivedMessage.timestamp).toLocaleTimeString() : 'None'}
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.panicButton, panicMode && styles.panicButtonActive]} 
              onPress={triggerPanicMode}
              disabled={panicMode}
            >
              <Text style={styles.panicButtonText}>
                {panicMode ? 'PANIC ALERT SENT' : 'TRIGGER PANIC ALERT'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
  },
  mapImage: {
    width: '100%',
    height: 350,
    borderRadius: 16,
  },
  mapControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  zoomButtons: {
    flexDirection: 'column',
    gap: 10,
  },
  zoomButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  weatherLayersButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  layerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
  },
  layerButtonActive: {
    backgroundColor: 'rgba(22, 163, 74, 0.6)',
  },
  layerButtonText: {
    color: 'white',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  controlPanel: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    borderRadius: 16,
    padding: 20,
  },
  controlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  controlTitle: {
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    fontSize: 18,
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statLabel: {
    fontFamily: 'Inter-Medium',
    color: '#D1D5DB',
    fontSize: 14,
    marginRight: 5,
  },
  statText: {
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    fontSize: 14,
    marginLeft: 5,
  },
  panicButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  panicButtonActive: {
    backgroundColor: '#7F1D1D',
  },
  panicButtonText: {
    fontFamily: 'Inter-Bold',
    color: 'white',
    fontSize: 16,
  },
});