// React Native Mobile App - Main App Component
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  PermissionsAndroid,
  Alert,
  Linking
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';

// Import screens
import HomeScreen from './screens/HomeScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchScreen from './screens/SearchScreen';
import WishlistScreen from './screens/WishlistScreen';
import ShopScreen from './screens/ShopScreen';
import CameraScreen from './screens/CameraScreen';
import ARScreen from './screens/ARScreen';
import OfflineScreen from './screens/OfflineScreen';

// Import services
import { EthiopianElectronicsAPI } from './services/api';
import { NotificationService } from './services/NotificationService';
import { LocationService } from './services/LocationService';
import { OfflineService } from './services/OfflineService';
import { BiometricService } from './services/BiometricService';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const EthiopianElectronicsApp = () => {
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [location, setLocation] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check internet connection
      NetInfo.addEventListener(state => {
        setIsOnline(state.isConnected);
      });

      // Initialize notifications
      await initializeNotifications();

      // Initialize location services
      await initializeLocation();

      // Initialize biometrics
      await initializeBiometrics();

      // Check for stored user session
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // Initialize offline data
      await OfflineService.initialize();

    } catch (error) {
      console.error('App initialization error:', error);
    }
  };

  const initializeNotifications = async () => {
    PushNotification.configure({
      onRegister: (token) => {
        console.log('Push notification token:', token);
        // Send token to backend
        EthiopianElectronicsAPI.registerPushToken(token);
      },
      onNotification: (notification) => {
        console.log('Notification received:', notification);
        // Handle notification navigation
        handleNotification(notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Request permission for Android
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    }

    setNotificationsEnabled(true);
  };

  const initializeLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Location error:', error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    } catch (error) {
      console.error('Location permission error:', error);
    }
  };

  const initializeBiometrics = async () => {
    try {
      const isAvailable = await BiometricService.isAvailable();
      if (isAvailable) {
        setBiometricEnabled(true);
      }
    } catch (error) {
      console.error('Biometric initialization error:', error);
    }
  };

  const handleNotification = (notification) => {
    if (notification.userInteraction) {
      // User tapped on notification
      switch (notification.data.type) {
        case 'product':
          // Navigate to product detail
          navigation.navigate('ProductDetail', { 
            productId: notification.data.productId 
          });
          break;
        case 'order':
          // Navigate to orders
          navigation.navigate('Orders');
          break;
        case 'promotion':
          // Navigate to promotion
          navigation.navigate('Promotion', { 
            promotionId: notification.data.promotionId 
          });
          break;
      }
    }
  };

  const MainTabs = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Search':
                iconName = 'search';
                break;
              case 'Camera':
                iconName = 'camera-alt';
                break;
              case 'Wishlist':
                iconName = 'favorite';
                break;
              case 'Profile':
                iconName = 'person';
                break;
              default:
                iconName = 'help';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#667eea',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          headerStyle: {
            backgroundColor: '#667eea',
          },
          headerTintColor: '#ffffff',
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Ethiopian Electronics' }}
        />
        <Tab.Screen 
          name="Search" 
          component={SearchScreen} 
          options={{ title: 'Search' }}
        />
        <Tab.Screen 
          name="Camera" 
          component={CameraScreen} 
          options={{ title: 'Scan Product' }}
        />
        <Tab.Screen 
          name="Wishlist" 
          component={WishlistScreen} 
          options={{ title: 'Wishlist' }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ title: 'Profile' }}
        />
      </Tab.Navigator>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <NavigationContainer>
        <Stack.Navigator>
          {user ? (
            <>
              <Stack.Screen 
                name="Main" 
                component={MainTabs} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="ProductDetail" 
                component={ProductDetailScreen}
                options={{ title: 'Product Details' }}
              />
              <Stack.Screen 
                name="ProductList" 
                component={ProductListScreen}
                options={{ title: 'Products' }}
              />
              <Stack.Screen 
                name="Cart" 
                component={CartScreen}
                options={{ title: 'Shopping Cart' }}
              />
              <Stack.Screen 
                name="Shop" 
                component={ShopScreen}
                options={{ title: 'Shop Details' }}
              />
              <Stack.Screen 
                name="AR" 
                component={ARScreen}
                options={{ title: 'AR View' }}
              />
            </>
          ) : (
            <>
              <Stack.Screen 
                name="Login" 
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Register" 
                component={RegisterScreen}
                options={{ headerShown: false }}
              />
            </>
          )}
          {!isOnline && (
            <Stack.Screen 
              name="Offline" 
              component={OfflineScreen}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default EthiopianElectronicsApp;
