import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useMeshNetwork } from './meshNetworkService';

// Mock AI model data with accuracy metrics
const mockDetectionData = {
  people: [0, 1, 2, 3, 2, 1, 2, 3, 4, 3, 2, 1, 0, 1, 2],
  weapons: [0, 0, 0, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0],
  accuracy: {
    people: 0.95, // 95% accuracy for people detection
    weapons: 0.92, // 92% accuracy for weapon detection
    falsePositives: 0.03, // 3% false positive rate
    latency: 150, // 150ms average detection time
  }
};

// Buffer to store detection data
const BUFFER_SIZE = 5 * 60; // 5 minutes of data at 1 sample per second
type DetectionRecord = {
  timestamp: string;
  peopleCount: number;
  weaponCount: number;
  accuracy: number;
  location?: string;
};

/**
 * Custom hook to manage detection services
 */
export function useDetectionService() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [peopleCount, setPeopleCount] = useState(0);
  const [weaponCount, setWeaponCount] = useState(0);
  const [confidence, setConfidence] = useState(0.8);
  const [accuracy, setAccuracy] = useState(mockDetectionData.accuracy);
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);
  const detectionBuffer = useRef<DetectionRecord[]>([]);
  const currentIndex = useRef(0);
  const { sendData } = useMeshNetwork();
  
  // Volume button press detection
  const volumePressCount = useRef(0);
  const volumePressTimer = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (Platform.OS !== 'web') {
      // Listen for volume button events
      const subscription = new EventEmitter().addListener(
        'volumeButtonPressed',
        (event) => {
          if (event.button === 'down') {
            handleVolumePress();
          }
        }
      );
      
      return () => subscription.remove();
    }
  }, []);
  
  const handleVolumePress = () => {
    volumePressCount.current++;
    
    if (volumePressTimer.current) {
      clearTimeout(volumePressTimer.current);
    }
    
    volumePressTimer.current = setTimeout(() => {
      if (volumePressCount.current >= 3) {
        // Trigger panic mode
        sendData({
          type: 'PANIC',
          data: {
            timestamp: new Date().toISOString(),
            peopleCount,
            weaponCount,
            accuracy: accuracy.weapons
          }
        });
      }
      volumePressCount.current = 0;
    }, 800);
  };
  
  // Start the detection process
  const startDetection = () => {
    if (isDetecting) return;
    
    setIsDetecting(true);
    
    // Simulate detection process with random data from our mock dataset
    detectionInterval.current = setInterval(() => {
      // Get a random index from our mock data
      const randomIndex = Math.floor(Math.random() * mockDetectionData.people.length);
      
      // Update detection values
      const newPeopleCount = mockDetectionData.people[randomIndex];
      const newWeaponCount = mockDetectionData.weapons[randomIndex];
      
      setPeopleCount(newPeopleCount);
      setWeaponCount(newWeaponCount);
      
      // Simulate varying confidence levels
      const newConfidence = 0.8 + (Math.random() * 0.15);
      setConfidence(newConfidence);
      
      // Record detection data
      const record: DetectionRecord = {
        timestamp: new Date().toISOString(),
        peopleCount: newPeopleCount,
        weaponCount: newWeaponCount,
        accuracy: newConfidence
      };
      
      // Add to circular buffer
      if (detectionBuffer.current.length < BUFFER_SIZE) {
        detectionBuffer.current.push(record);
      } else {
        detectionBuffer.current[currentIndex.current] = record;
        currentIndex.current = (currentIndex.current + 1) % BUFFER_SIZE;
      }
      
      // Send data through mesh network if there are meaningful changes
      if (newPeopleCount > 0 || newWeaponCount > 0) {
        sendData({
          type: 'DETECTION',
          data: {
            ...record,
            confidence: newConfidence,
            modelAccuracy: accuracy
          }
        });
      }
      
    }, 1000); // Update every second
    
    // Save detection state
    saveDetectionState(true);
  };
  
  // Stop the detection process
  const stopDetection = () => {
    if (!isDetecting) return;
    
    setIsDetecting(false);
    
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    }
    
    // Save detection buffer to secure storage
    saveDetectionBuffer();
    
    // Save detection state
    saveDetectionState(false);
  };
  
  // Save detection buffer to secure storage
  const saveDetectionBuffer = async () => {
    if (Platform.OS === 'web') return; // Not supported on web
    
    try {
      const bufferString = JSON.stringify(detectionBuffer.current);
      await SecureStore.setItemAsync('detection_buffer', bufferString);
    } catch (error) {
      console.error('Failed to save detection buffer:', error);
    }
  };
  
  // Load detection buffer from secure storage
  const loadDetectionBuffer = async () => {
    if (Platform.OS === 'web') return; // Not supported on web
    
    try {
      const bufferString = await SecureStore.getItemAsync('detection_buffer');
      if (bufferString) {
        detectionBuffer.current = JSON.parse(bufferString);
      }
    } catch (error) {
      console.error('Failed to load detection buffer:', error);
    }
  };
  
  // Save detection state to secure storage
  const saveDetectionState = async (state: boolean) => {
    if (Platform.OS === 'web') return; // Not supported on web
    
    try {
      await SecureStore.setItemAsync('detection_state', state ? 'true' : 'false');
    } catch (error) {
      console.error('Failed to save detection state:', error);
    }
  };
  
  // Load detection state from secure storage
  const loadDetectionState = async () => {
    if (Platform.OS === 'web') return; // Not supported on web
    
    try {
      const state = await SecureStore.getItemAsync('detection_state');
      if (state === 'true') {
        startDetection();
      }
    } catch (error) {
      console.error('Failed to load detection state:', error);
    }
  };
  
  // Handle cleanup on unmount
  useEffect(() => {
    // Load saved detection buffer and state on mount
    loadDetectionBuffer();
    loadDetectionState();
    
    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
      
      // Save buffer on unmount
      saveDetectionBuffer();
    };
  }, []);
  
  return {
    isDetecting,
    peopleCount,
    weaponCount,
    confidence,
    accuracy,
    startDetection,
    stopDetection,
    detectionData: detectionBuffer.current
  };
}

export { useDetectionService }