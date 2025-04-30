import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Types for mesh network messages
type MessageType = 'DETECTION' | 'ALERT' | 'STATUS' | 'PANIC';

type Message = {
  id?: string;
  type: MessageType;
  data?: any;
  source?: string;
  destination?: string;
  timestamp?: string;
  hops?: number;
};

type Alert = {
  type: 'PANIC' | 'WEAPON' | 'SUSPICIOUS';
  location?: string;
  peopleCount?: number;
  weaponCount?: number;
  timestamp: string;
};

type Device = {
  id: string;
  lastSeen: string;
  batteryLevel?: number;
};

/**
 * Custom hook to manage the simulated mesh network
 */
export function useMeshNetwork() {
  const [connectedDevices, setConnectedDevices] = useState<Device[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [lastReceivedMessage, setLastReceivedMessage] = useState<Message | null>(null);
  const [networkStatus, setNetworkStatus] = useState<'active' | 'idle' | 'disconnected'>('idle');
  const deviceId = useRef<string>(generateDeviceId());
  const messageInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize the mesh network
  useEffect(() => {
    // Load previously saved data
    loadStoredData();
    
    // Simulate discovering nearby devices
    simulateDeviceDiscovery();
    
    // Simulate receiving messages from the mesh network
    startMessageSimulation();
    
    return () => {
      if (messageInterval.current) {
        clearInterval(messageInterval.current);
      }
      
      // Save state on unmount
      saveNetworkState();
    };
  }, []);
  
  // Generate a unique device ID
  function generateDeviceId(): string {
    return 'device_' + Math.random().toString(36).substring(2, 9);
  }
  
  // Load stored data from secure storage
  const loadStoredData = async () => {
    if (Platform.OS === 'web') return; // Not supported on web
    
    try {
      // Load device ID
      const storedDeviceId = await SecureStore.getItemAsync('mesh_device_id');
      if (storedDeviceId) {
        deviceId.current = storedDeviceId;
      } else {
        await SecureStore.setItemAsync('mesh_device_id', deviceId.current);
      }
      
      // Load messages
      const storedMessages = await SecureStore.getItemAsync('mesh_messages');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
      
      // Load connected devices
      const storedDevices = await SecureStore.getItemAsync('mesh_devices');
      if (storedDevices) {
        setConnectedDevices(JSON.parse(storedDevices));
      }
    } catch (error) {
      console.error('Failed to load stored network data:', error);
    }
  };
  
  // Save network state to secure storage
  const saveNetworkState = async () => {
    if (Platform.OS === 'web') return; // Not supported on web
    
    try {
      await SecureStore.setItemAsync('mesh_messages', JSON.stringify(messages.slice(-50))); // Save last 50 messages
      await SecureStore.setItemAsync('mesh_devices', JSON.stringify(connectedDevices));
    } catch (error) {
      console.error('Failed to save network state:', error);
    }
  };
  
  // Simulate discovering nearby devices
  const simulateDeviceDiscovery = () => {
    // Simulate 2-5 nearby devices
    const deviceCount = Math.floor(Math.random() * 4) + 2;
    const mockDevices: Device[] = [];
    
    for (let i = 0; i < deviceCount; i++) {
      mockDevices.push({
        id: `device_${Math.random().toString(36).substring(2, 9)}`,
        lastSeen: new Date().toISOString(),
        batteryLevel: Math.floor(Math.random() * 100)
      });
    }
    
    // Add "police receiver" device
    mockDevices.push({
      id: 'police_receiver_1',
      lastSeen: new Date().toISOString(),
      batteryLevel: 100
    });
    
    setConnectedDevices(mockDevices);
    setNetworkStatus('active');
  };
  
  // Simulate receiving messages from the mesh network
  const startMessageSimulation = () => {
    messageInterval.current = setInterval(() => {
      // 20% chance of receiving a message
      if (Math.random() < 0.2) {
        const mockMessage: Message = {
          id: `msg_${Math.random().toString(36).substring(2, 9)}`,
          type: Math.random() < 0.8 ? 'DETECTION' : 'STATUS',
          source: connectedDevices[Math.floor(Math.random() * connectedDevices.length)]?.id,
          timestamp: new Date().toISOString(),
          hops: Math.floor(Math.random() * 3) + 1,
          data: {
            peopleCount: Math.floor(Math.random() * 5),
            weaponCount: Math.floor(Math.random() * 2)
          }
        };
        
        // Add to messages
        setMessages(prev => [...prev, mockMessage]);
        setLastReceivedMessage(mockMessage);
        
        // Update network status
        setNetworkStatus('active');
        
        // After 2 seconds, set back to idle
        setTimeout(() => {
          setNetworkStatus('idle');
        }, 2000);
      }
    }, 8000); // Check every 8 seconds
  };
  
  // Send data through the mesh network
  const sendData = (data: any) => {
    const message: Message = {
      id: `msg_${Math.random().toString(36).substring(2, 9)}`,
      type: 'DETECTION',
      source: deviceId.current,
      timestamp: new Date().toISOString(),
      hops: 0,
      data
    };
    
    // Add to messages
    setMessages(prev => [...prev, message]);
    
    // Update network status
    setNetworkStatus('active');
    
    // After 2 seconds, set back to idle
    setTimeout(() => {
      setNetworkStatus('idle');
    }, 2000);
    
    // Return the message ID
    return message.id;
  };
  
  // Send an alert through the mesh network
  const sendAlert = (alert: Alert) => {
    const message: Message = {
      id: `alert_${Math.random().toString(36).substring(2, 9)}`,
      type: 'ALERT',
      source: deviceId.current,
      destination: 'police_receiver_1', // Target the police receiver
      timestamp: new Date().toISOString(),
      hops: 0,
      data: alert
    };
    
    // Add to messages
    setMessages(prev => [...prev, message]);
    
    // Update network status
    setNetworkStatus('active');
    
    // After 2 seconds, set back to idle
    setTimeout(() => {
      setNetworkStatus('idle');
    }, 2000);
    
    // Return the message ID
    return message.id;
  };
  
  return {
    deviceId: deviceId.current,
    connectedDevices,
    messages,
    lastReceivedMessage,
    networkStatus,
    sendData,
    sendAlert
  };
}