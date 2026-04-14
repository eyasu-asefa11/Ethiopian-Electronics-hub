// Mobile App Services - Location Service
import Geolocation from '@react-native-community/geolocation';
import PermissionsAndroid from 'react-native';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LocationService {
  constructor() {
    this.currentLocation = null;
    this.watchId = null;
    this.locationHistory = [];
    this.maxHistorySize = 100;
  }

  // Request location permissions
  async requestLocationPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted');
          return true;
        } else {
          console.log('Location permission denied');
          return false;
        }
      } catch (err) {
        console.warn('Location permission error:', err);
        return false;
      }
    } else {
      // iOS permissions are handled automatically
      return true;
    }
  }

  // Get current location
  async getCurrentLocation() {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        return null;
      }

      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              speed: position.coords.speed,
              timestamp: position.timestamp,
            };

            this.currentLocation = location;
            this.addToHistory(location);
            this.saveLocation(location);
            
            resolve(location);
          },
          (error) => {
            console.error('Location error:', error);
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          }
        );
      });
    } catch (error) {
      console.error('Get location error:', error);
      return null;
    }
  }

  // Start watching location changes
  startLocationUpdates(callback) {
    try {
      this.watchId = Geolocation.watchPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };

          this.currentLocation = location;
          this.addToHistory(location);
          this.saveLocation(location);
          
          if (callback) {
            callback(location);
          }
        },
        (error) => {
          console.error('Location watch error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 10, // Update every 10 meters
        }
      );
    } catch (error) {
      console.error('Start location updates error:', error);
    }
  }

  // Stop watching location updates
  stopLocationUpdates() {
    if (this.watchId) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Add location to history
  addToHistory(location) {
    this.locationHistory.push({
      ...location,
      recordedAt: Date.now(),
    });

    // Limit history size
    if (this.locationHistory.length > this.maxHistorySize) {
      this.locationHistory.shift();
    }
  }

  // Get location history
  getLocationHistory() {
    return this.locationHistory;
  }

  // Calculate distance between two points (in kilometers)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Get address from coordinates (reverse geocoding)
  async getAddressFromCoordinates(latitude, longitude) {
    try {
      // In production, this would use a geocoding API
      // For now, return mock Ethiopian addresses
      const ethiopianAddresses = [
        'Addis Ababa, Ethiopia',
        'Dire Dawa, Ethiopia',
        'Mekelle, Ethiopia',
        'Bahir Dar, Ethiopia',
        'Gondar, Ethiopia',
        'Hawassa, Ethiopia',
        'Jimma, Ethiopia',
        'Jijiga, Ethiopia',
      ];

      const randomAddress = ethiopianAddresses[
        Math.floor(Math.random() * ethiopianAddresses.length)
      ];

      return {
        address: randomAddress,
        city: randomAddress.split(',')[0],
        country: 'Ethiopia',
        latitude,
        longitude,
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  }

  // Search for nearby places
  async searchNearbyPlaces(latitude, longitude, type, radius = 1000) {
    try {
      // In production, this would use a places API
      // For now, return mock Ethiopian electronics shops
      const mockShops = [
        {
          id: '1',
          name: 'Ethiopian Electronics Hub',
          address: 'Bole, Addis Ababa',
          distance: this.calculateDistance(latitude, longitude, 9.1450, 40.4897),
          rating: 4.5,
          type: 'electronics',
        },
        {
          id: '2',
          name: 'Digital World',
          address: 'Mekelle, Ethiopia',
          distance: this.calculateDistance(latitude, longitude, 13.4967, 39.4733),
          rating: 4.2,
          type: 'electronics',
        },
        {
          id: '3',
          name: 'Tech Store Ethiopia',
          address: 'Bahir Dar, Ethiopia',
          distance: this.calculateDistance(latitude, longitude, 11.5761, 37.3617),
          rating: 4.7,
          type: 'electronics',
        },
      ];

      // Filter by distance
      const nearbyShops = mockShops
        .filter(shop => shop.distance <= radius / 1000) // Convert to km
        .sort((a, b) => a.distance - b.distance);

      return nearbyShops;
    } catch (error) {
      console.error('Search nearby places error:', error);
      return [];
    }
  }

  // Save location to local storage
  async saveLocation(location) {
    try {
      await AsyncStorage.setItem('last_location', JSON.stringify(location));
    } catch (error) {
      console.error('Save location error:', error);
    }
  }

  // Load saved location
  async loadSavedLocation() {
    try {
      const savedLocation = await AsyncStorage.getItem('last_location');
      if (savedLocation) {
        this.currentLocation = JSON.parse(savedLocation);
        return this.currentLocation;
      }
    } catch (error) {
      console.error('Load saved location error:', error);
    }
    return null;
  }

  // Get Ethiopian regions with coordinates
  getEthiopianRegions() {
    return [
      {
        id: 'addis_ababa',
        name: 'Addis Ababa',
        latitude: 9.1450,
        longitude: 40.4897,
        region: 'chartered_city',
      },
      {
        id: 'afar',
        name: 'Afar',
        latitude: 11.7590,
        longitude: 41.0040,
        region: 'regional_state',
      },
      {
        id: 'amhara',
        name: 'Amhara',
        latitude: 11.8650,
        longitude: 37.6650,
        region: 'regional_state',
      },
      {
        id: 'benishangul_gumuz',
        name: 'Benishangul-Gumuz',
        latitude: 10.6800,
        longitude: 34.5800,
        region: 'regional_state',
      },
      {
        id: 'dire_dawa',
        name: 'Dire Dawa',
        latitude: 9.5944,
        longitude: 41.8661,
        region: 'chartered_city',
      },
      {
        id: 'gambela',
        name: 'Gambela',
        latitude: 8.2500,
        longitude: 34.5800,
        region: 'regional_state',
      },
      {
        id: 'harari',
        name: 'Harari',
        latitude: 9.3119,
        longitude: 42.1180,
        region: 'regional_state',
      },
      {
        id: 'oromia',
        name: 'Oromia',
        latitude: 8.9806,
        longitude: 40.9333,
        region: 'regional_state',
      },
      {
        id: 'sidama',
        name: 'Sidama',
        latitude: 6.8333,
        longitude: 38.4167,
        region: 'regional_state',
      },
      {
        id: 'somali',
        name: 'Somali',
        latitude: 6.7667,
        longitude: 44.2500,
        region: 'regional_state',
      },
      {
        id: 'southern_nations',
        name: 'Southern Nations',
        latitude: 7.0833,
        longitude: 37.5833,
        region: 'regional_state',
      },
      {
        id: 'tigray',
        name: 'Tigray',
        latitude: 13.4967,
        longitude: 39.4733,
        region: 'regional_state',
      },
    ];
  }

  // Get cities in a region
  getCitiesInRegion(regionId) {
    const cities = {
      addis_ababa: [
        { id: 'bole', name: 'Bole', latitude: 9.0200, longitude: 38.7467 },
        { id: 'kirkos', name: 'Kirkos', latitude: 9.0300, longitude: 38.7400 },
        { id: 'arada', name: 'Arada', latitude: 9.0270, longitude: 38.7500 },
        { id: 'gulele', name: 'Gulele', latitude: 9.0500, longitude: 38.7200 },
        { id: 'yeka', name: 'Yeka', latitude: 9.0400, longitude: 38.8000 },
      ],
      tigray: [
        { id: 'mekelle', name: 'Mekelle', latitude: 13.4967, longitude: 39.4733 },
        { id: 'axum', name: 'Axum', latitude: 14.1378, longitude: 38.7167 },
        { id: 'adigrat', name: 'Adigrat', latitude: 14.2833, longitude: 39.4667 },
        { id: 'shire', name: 'Shire', latitude: 14.1167, longitude: 38.2833 },
        { id: 'humera', name: 'Humera', latitude: 14.0500, longitude: 36.6167 },
      ],
      amhara: [
        { id: 'bahir_dar', name: 'Bahir Dar', latitude: 11.5761, longitude: 37.3617 },
        { id: 'gondar', name: 'Gondar', latitude: 12.6000, longitude: 37.4667 },
        { id: 'dessie', name: 'Dessie', latitude: 11.1167, longitude: 39.6333 },
        { id: 'debretabor', name: 'Debre Tabor', latitude: 11.5167, longitude: 38.1833 },
        { id: 'woldiya', name: 'Woldiya', latitude: 11.8333, longitude: 39.5000 },
      ],
      oromia: [
        { id: 'adama', name: 'Adama', latitude: 8.5667, longitude: 39.2833 },
        { id: 'jimma', name: 'Jimma', latitude: 7.6833, longitude: 36.8333 },
        { id: 'hawassa', name: 'Hawassa', latitude: 7.0583, longitude: 38.4667 },
        { id: 'negele', name: 'Negele', latitude: 5.3500, longitude: 39.5833 },
        { id: 'asella', name: 'Asella', latitude: 7.9500, longitude: 39.1167 },
      ],
    };

    return cities[regionId] || [];
  }

  // Find nearest Ethiopian region
  findNearestRegion(latitude, longitude) {
    const regions = this.getEthiopianRegions();
    let nearestRegion = null;
    let minDistance = Infinity;

    regions.forEach(region => {
      const distance = this.calculateDistance(
        latitude, longitude,
        region.latitude, region.longitude
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        nearestRegion = region;
      }
    });

    return nearestRegion;
  }

  // Get location-based recommendations
  async getLocationBasedRecommendations(latitude, longitude) {
    try {
      const nearbyShops = await this.searchNearbyPlaces(latitude, longitude, 'electronics', 5000);
      const nearestRegion = this.findNearestRegion(latitude, longitude);
      
      return {
        nearbyShops,
        region: nearestRegion,
        localDeals: this.generateLocalDeals(nearestRegion?.name),
        trendingInArea: this.generateTrendingInArea(nearestRegion?.name),
      };
    } catch (error) {
      console.error('Location recommendations error:', error);
      return null;
    }
  }

  // Generate local deals (mock)
  generateLocalDeals(regionName) {
    if (!regionName) return [];

    const deals = [
      {
        id: '1',
        title: 'Local Phone Special',
        description: 'Smartphones from local shops',
        discount: 15,
        region: regionName,
      },
      {
        id: '2',
        title: 'Regional Electronics Sale',
        description: 'Laptops and accessories',
        discount: 20,
        region: regionName,
      },
    ];

    return deals;
  }

  // Generate trending in area (mock)
  generateTrendingInArea(regionName) {
    if (!regionName) return [];

    const trending = [
      {
        id: '1',
        name: 'Samsung Galaxy S24',
        category: 'Smartphones',
        popularity: 95,
        region: regionName,
      },
      {
        id: '2',
        name: 'Dell Laptop',
        category: 'Laptops',
        popularity: 88,
        region: regionName,
      },
    ];

    return trending;
  }

  // Check if user is in Ethiopia
  isUserInEthiopia(latitude, longitude) {
    // Ethiopia boundaries (approximate)
    const ethiopiaBounds = {
      north: 14.8937,
      south: 3.4071,
      east: 47.9890,
      west: 32.9870,
    };

    return (
      latitude >= ethiopiaBounds.south &&
      latitude <= ethiopiaBounds.north &&
      longitude >= ethiopiaBounds.west &&
      longitude <= ethiopiaBounds.east
    );
  }

  // Get current location with fallback
  async getLocationWithFallback() {
    try {
      // Try to get current location
      let location = await this.getCurrentLocation();
      
      if (!location) {
        // Fallback to saved location
        location = await this.loadSavedLocation();
      }
      
      if (!location) {
        // Fallback to Addis Ababa (Ethiopia capital)
        location = {
          latitude: 9.1450,
          longitude: 40.4897,
          accuracy: 1000,
          timestamp: Date.now(),
        };
      }

      return location;
    } catch (error) {
      console.error('Get location with fallback error:', error);
      // Return Addis Ababa as ultimate fallback
      return {
        latitude: 9.1450,
        longitude: 40.4897,
        accuracy: 1000,
        timestamp: Date.now(),
      };
    }
  }

  // Clear location history
  clearLocationHistory() {
    this.locationHistory = [];
  }

  // Get location statistics
  getLocationStats() {
    if (this.locationHistory.length === 0) {
      return null;
    }

    const totalDistance = this.locationHistory.reduce((total, location, index) => {
      if (index === 0) return 0;
      const prevLocation = this.locationHistory[index - 1];
      return total + this.calculateDistance(
        prevLocation.latitude, prevLocation.longitude,
        location.latitude, location.longitude
      );
    }, 0);

    const averageAccuracy = this.locationHistory.reduce((sum, location) => 
      sum + location.accuracy, 0) / this.locationHistory.length;

    return {
      totalLocations: this.locationHistory.length,
      totalDistance: Math.round(totalDistance * 100) / 100, // Round to 2 decimal places
      averageAccuracy: Math.round(averageAccuracy * 100) / 100,
      firstLocation: this.locationHistory[0],
      lastLocation: this.locationHistory[this.locationHistory.length - 1],
    };
  }
}

export { LocationService };
