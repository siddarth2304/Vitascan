import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Video, Radio, Shield, Users, TriangleAlert as AlertTriangle, Activity, Clock } from 'lucide-react-native';
import { CameraView } from 'expo-camera';
import Animated, { 
  FadeIn, 
  useAnimatedStyle, 
  withSpring, 
  withRepeat, 
  withSequence,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useDetectionService } from '@/services/detectionService';

const { width } = Dimensions.get('window');

export default function MonitorScreen() {
  const [activeStream, setActiveStream] = useState<'video' | 'audio'>('video');
  const [isStreaming, setIsStreaming] = useState(false);
  const { 
    peopleCount, 
    weaponCount, 
    accuracy, 
    startDetection, 
    stopDetection,
    confidence 
  } = useDetectionService();
  
  const [streamMetrics, setStreamMetrics] = useState({
    bandwidth: '2.4 Mbps',
    latency: '120ms',
    uptime: '00:00:00',
    activeNodes: 4,
    processedFrames: 0
  });

  // Animated values for pulse effect using modern Reanimated API
  const pulseValue = useSharedValue(1);

  // Start pulsing animation when streaming
  useEffect(() => {
    if (isStreaming) {
      pulseValue.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1 // Infinite repetition
      );
    } else {
      pulseValue.value = withTiming(1);
    }
  }, [isStreaming]);

  // Pulse animation style using useAnimatedStyle
  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseValue.value }],
    opacity: pulseValue.value
  }));

  // Start streaming and detection
  const toggleStreaming = () => {
    setIsStreaming(!isStreaming);
    if (!isStreaming) {
      startDetection();
      startMetricsUpdate();
    } else {
      stopDetection();
      stopMetricsUpdate();
    }
  };

  // Update metrics
  const metricsInterval = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef<Date | null>(null);

  const startMetricsUpdate = () => {
    startTime.current = new Date();
    metricsInterval.current = setInterval(() => {
      const now = new Date();
      const diff = startTime.current ? now.getTime() - startTime.current.getTime() : 0;
      const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');

      setStreamMetrics(prev => ({
        bandwidth: `${(2 + Math.random()).toFixed(1)} Mbps`,
        latency: `${110 + Math.floor(Math.random() * 20)}ms`,
        activeNodes: 3 + Math.floor(Math.random() * 3),
        uptime: `${hours}:${minutes}:${seconds}`,
        processedFrames: prev.processedFrames + 30 // Assuming 30fps
      }));
    }, 1000);
  };

  const stopMetricsUpdate = () => {
    if (metricsInterval.current) {
      clearInterval(metricsInterval.current);
    }
    startTime.current = null;
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stopMetricsUpdate();
      stopDetection();
    };
  }, []);

  return (
    <LinearGradient
      colors={['#1E3A8A', '#2563EB', '#1E3A8A']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Live Monitoring</Text>
            <Animated.View style={[styles.streamStatus, isStreaming && pulseStyle]}>
              <View style={[styles.statusDot, isStreaming ? styles.statusActive : styles.statusInactive]} />
              <Text style={styles.statusText}>{isStreaming ? 'STREAMING' : 'OFFLINE'}</Text>
            </Animated.View>
          </View>

          <View style={styles.streamContainer}>
            {Platform.OS === 'web' ? (
              <View style={styles.mockCamera}>
                <Camera size={48} color="#D1D5DB" />
                <Text style={styles.mockText}>Camera Preview</Text>
                <Text style={styles.mockSubtext}>Live streaming enabled on mobile devices</Text>
              </View>
            ) : (
              <CameraView style={styles.camera} />
            )}
            
            {isStreaming && (
              <View style={styles.streamOverlay}>
                <View style={styles.streamIndicator}>
                  <Activity size={16} color="#16A34A" />
                  <Text style={styles.streamIndicatorText}>LIVE</Text>
                </View>
                <Text style={styles.streamTime}>{streamMetrics.uptime}</Text>
              </View>
            )}
          </View>

          <View style={styles.controls}>
            <TouchableOpacity 
              style={[styles.controlButton, activeStream === 'video' && styles.controlActive]}
              onPress={() => setActiveStream('video')}
            >
              <Camera size={20} color={activeStream === 'video' ? '#FFFFFF' : '#D1D5DB'} />
              <Text style={[styles.controlText, activeStream === 'video' && styles.controlTextActive]}>Video</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.controlButton, activeStream === 'audio' && styles.controlActive]}
              onPress={() => setActiveStream('audio')}
            >
              <Radio size={20} color={activeStream === 'audio' ? '#FFFFFF' : '#D1D5DB'} />
              <Text style={[styles.controlText, activeStream === 'audio' && styles.controlTextActive]}>Audio</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Shield size={24} color="#0D9488" />
              <Text style={styles.metricValue}>{streamMetrics.bandwidth}</Text>
              <Text style={styles.metricLabel}>Bandwidth</Text>
            </View>
            
            <View style={styles.metricBox}>
              <Activity size={24} color="#0D9488" />
              <Text style={styles.metricValue}>{streamMetrics.latency}</Text>
              <Text style={styles.metricLabel}>Latency</Text>
            </View>
            
            <View style={styles.metricBox}>
              <Clock size={24} color="#0D9488" />
              <Text style={styles.metricValue}>{streamMetrics.processedFrames}</Text>
              <Text style={styles.metricLabel}>Frames</Text>
            </View>
            
            <View style={styles.metricBox}>
              <Users size={24} color="#0D9488" />
              <Text style={styles.metricValue}>{streamMetrics.activeNodes}</Text>
              <Text style={styles.metricLabel}>Nodes</Text>
            </View>
          </View>

          <View style={styles.detectionStats}>
            <Text style={styles.sectionTitle}>Detection Statistics</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Users size={20} color="#FFFFFF" />
                <Text style={styles.statValue}>{peopleCount}</Text>
                <Text style={styles.statLabel}>People Detected</Text>
                <View style={styles.accuracyBar}>
                  <View style={[styles.accuracyFill, { width: `${accuracy.people * 100}%` }]} />
                  <Text style={styles.accuracyText}>{(accuracy.people * 100).toFixed(1)}%</Text>
                </View>
                <Text style={styles.confidenceText}>Confidence: {(confidence * 100).toFixed(1)}%</Text>
              </View>
              
              <View style={styles.statBox}>
                <AlertTriangle size={20} color="#DC2626" />
                <Text style={[styles.statValue, styles.statValueAlert]}>{weaponCount}</Text>
                <Text style={styles.statLabel}>Weapons Detected</Text>
                <View style={styles.accuracyBar}>
                  <View style={[styles.accuracyFill, { width: `${accuracy.weapons * 100}%` }]} />
                  <Text style={styles.accuracyText}>{(accuracy.weapons * 100).toFixed(1)}%</Text>
                </View>
                <Text style={styles.confidenceText}>False Positives: {(accuracy.falsePositives * 100).toFixed(1)}%</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.streamButton, isStreaming && styles.streamButtonActive]}
            onPress={toggleStreaming}
          >
            <Text style={styles.streamButtonText}>
              {isStreaming ? 'STOP STREAMING' : 'START STREAMING'}
            </Text>
          </TouchableOpacity>
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
    paddingBottom: 100,
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#FFFFFF',
  },
  streamStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
    fontSize: 12,
    color: '#D1D5DB',
  },
  streamContainer: {
    height: 300,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  streamOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streamIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  streamIndicatorText: {
    color: '#16A34A',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  streamTime: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mockCamera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#D1D5DB',
    marginTop: 12,
  },
  mockSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  camera: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  controlActive: {
    backgroundColor: '#0D9488',
  },
  controlText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#D1D5DB',
  },
  controlTextActive: {
    color: '#FFFFFF',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  metricBox: {
    flex: 1,
    minWidth: (width - 52) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  metricValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
    marginVertical: 8,
  },
  metricLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#D1D5DB',
  },
  detectionStats: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
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
    marginBottom: 8,
  },
  accuracyBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    marginVertical: 8,
    overflow: 'hidden',
  },
  accuracyFill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 2,
  },
  accuracyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#16A34A',
    marginTop: 4,
  },
  confidenceText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#D1D5DB',
    marginTop: 4,
  },
  streamButton: {
    backgroundColor: '#16A34A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  streamButtonActive: {
    backgroundColor: '#DC2626',
  },
  streamButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});