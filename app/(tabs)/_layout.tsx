import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { Cloud, Map, Settings, Radio } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

// Custom tab bar component
function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  
  const tabBarHeight = 60 + insets.bottom;
  
  return (
    <BlurView 
      intensity={80} 
      tint="dark" 
      style={[
        styles.tabBar, 
        { height: tabBarHeight, paddingBottom: insets.bottom }
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={index}
            onPress={onPress}
            style={[styles.tabItem]}
          >
            <View style={[
              styles.tabIconContainer,
              isFocused && styles.tabIconContainerActive
            ]}>
              {options.tabBarIcon({ 
                color: isFocused ? '#16A34A' : '#D1D5DB', 
                size: 24, 
                focused: isFocused 
              })}
            </View>
          </Pressable>
        );
      })}
    </BlurView>
  );
}

// Animated tab container
const AnimatedTabContainer = forwardRef(({ children }, ref) => {
  const opacity = useSharedValue(1);
  
  useImperativeHandle(ref, () => ({
    hide: () => {
      opacity.value = withTiming(0, { duration: 300 });
    },
    show: () => {
      opacity.value = withTiming(1, { duration: 300 });
    }
  }));
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value
    };
  });
  
  return (
    <Animated.View style={[styles.tabsContainer, animatedStyle]}>
      {children}
    </Animated.View>
  );
});

export default function TabLayout() {
  const tabsRef = useRef(null);
  
  return (
    <AnimatedTabContainer ref={tabsRef}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Weather',
            tabBarIcon: ({ color, size }) => (
              <Cloud size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: 'Map',
            tabBarIcon: ({ color, size }) => (
              <Map size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="monitor"
          options={{
            title: 'Monitor',
            tabBarIcon: ({ color, size }) => (
              <Radio size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Settings size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </AnimatedTabContainer>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 58, 138, 0.5)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconContainerActive: {
    backgroundColor: 'rgba(30, 58, 138, 0.5)',
  },
});