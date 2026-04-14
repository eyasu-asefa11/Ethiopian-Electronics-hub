// Mobile App Services - API Service
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

class EthiopianElectronicsAPI {
  constructor() {
    this.baseURL = 'https://api.ethiopian-electronics.com';
    this.token = null;
    this.user = null;
    this.isOnline = true;
    
    this.initialize();
  }

  async initialize() {
    // Check network status
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected;
    });

    // Load stored token and user
    this.token = await AsyncStorage.getItem('auth_token');
    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
    }
  }

  // Generic request method with offline support
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const requestOptions = {
      ...options,
      headers,
    };

    try {
      if (this.isOnline) {
        const response = await fetch(url, requestOptions);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Request failed');
        }

        // Cache successful GET requests
        if (options.method === 'GET' || !options.method) {
          storage.set(`cache:${endpoint}`, JSON.stringify({
            data,
            timestamp: Date.now(),
            ttl: 5 * 60 * 1000 // 5 minutes
          }));
        }

        return data;
      } else {
        // Offline mode - return cached data
        return this.getCachedData(endpoint);
      }
    } catch (error) {
      console.error('API Error:', error);
      
      // Return cached data on error
      return this.getCachedData(endpoint);
    }
  }

  // Get cached data
  async getCachedData(endpoint) {
    try {
      const cached = storage.getString(`cache:${endpoint}`);
      if (cached) {
        const { data, timestamp, ttl } = JSON.parse(cached);
        
        // Check if cache is still valid
        if (Date.now() - timestamp < ttl) {
          return data;
        }
      }
    } catch (error) {
      console.error('Cache error:', error);
    }
    
    throw new Error('No cached data available');
  }

  // Authentication
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.token = data.token;
    this.user = data.user;

    await AsyncStorage.setItem('auth_token', this.token);
    await AsyncStorage.setItem('user', JSON.stringify(this.user));

    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    this.token = data.token;
    this.user = data.user;

    await AsyncStorage.setItem('auth_token', this.token);
    await AsyncStorage.setItem('user', JSON.stringify(this.user));

    return data;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    
    this.token = null;
    this.user = null;

    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user');
  }

  // Products
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products?${queryString}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async searchProducts(query, filters = {}) {
    return this.request('/products/search', {
      method: 'POST',
      body: JSON.stringify({ query, filters }),
    });
  }

  async getProductsByCategory(category) {
    return this.request(`/products/category/${category}`);
  }

  async getFeaturedProducts() {
    return this.request('/products/featured');
  }

  async getTrendingProducts() {
    return this.request('/products/trending');
  }

  async getDealsProducts() {
    return this.request('/products/deals');
  }

  // Cart
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(itemId, quantity) {
    return this.request(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId) {
    return this.request(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart/clear', { method: 'DELETE' });
  }

  // Wishlist
  async getWishlist() {
    return this.request('/wishlist');
  }

  async addToWishlist(productId) {
    return this.request('/wishlist/add', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async removeFromWishlist(productId) {
    return this.request(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Shops
  async getShops(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/shops?${queryString}`);
  }

  async getShop(id) {
    return this.request(`/shops/${id}`);
  }

  async getShopProducts(shopId) {
    return this.request(`/shops/${shopId}/products`);
  }

  async getNearbyShops(latitude, longitude, radius = 10) {
    return this.request('/shops/nearby', {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude, radius }),
    });
  }

  // Reviews
  async getProductReviews(productId) {
    return this.request(`/products/${productId}/reviews`);
  }

  async addProductReview(productId, review) {
    return this.request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  async getShopReviews(shopId) {
    return this.request(`/shops/${shopId}/reviews`);
  }

  async addShopReview(shopId, review) {
    return this.request(`/shops/${shopId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  // User Profile
  async getProfile() {
    return this.request('/user/profile');
  }

  async updateProfile(profileData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(oldPassword, newPassword) {
    return this.request('/user/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  }

  async uploadAvatar(imageUri) {
    const formData = new FormData();
    formData.append('avatar', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'avatar.jpg',
    });

    return this.request('/user/avatar', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Notifications
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async registerPushToken(token) {
    return this.request('/notifications/push-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // Categories
  async getCategories() {
    return this.request('/categories');
  }

  // Locations
  async getRegions() {
    return this.request('/locations/regions');
  }

  async getCities(regionId) {
    return this.request(`/locations/regions/${regionId}/cities`);
  }

  // Payment
  async initiatePayment(orderId, paymentMethod, paymentData) {
    return this.request('/payment/initiate', {
      method: 'POST',
      body: JSON.stringify({ orderId, paymentMethod, paymentData }),
    });
  }

  async verifyPayment(paymentId) {
    return this.request(`/payment/verify/${paymentId}`);
  }

  // Analytics
  async trackEvent(eventName, eventData) {
    return this.request('/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ eventName, eventData }),
    });
  }

  // Camera/QR Code
  async scanQRCode(qrData) {
    return this.request('/qr/scan', {
      method: 'POST',
      body: JSON.stringify({ qrData }),
    });
  }

  async identifyProduct(imageUri) {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'product.jpg',
    });

    return this.request('/products/identify', {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Offline sync
  async syncOfflineData() {
    if (!this.isOnline) return false;

    try {
      const offlineActions = storage.getString('offline_actions');
      if (offlineActions) {
        const actions = JSON.parse(offlineActions);
        
        for (const action of actions) {
          await this.request(action.endpoint, action.options);
        }

        // Clear synced actions
        storage.delete('offline_actions');
      }

      return true;
    } catch (error) {
      console.error('Sync error:', error);
      return false;
    }
  }

  // Store offline action
  storeOfflineAction(endpoint, options) {
    try {
      const offlineActions = storage.getString('offline_actions');
      const actions = offlineActions ? JSON.parse(offlineActions) : [];
      
      actions.push({
        endpoint,
        options,
        timestamp: Date.now(),
      });

      storage.set('offline_actions', JSON.stringify(actions));
    } catch (error) {
      console.error('Offline storage error:', error);
    }
  }
}

export default EthiopianElectronicsAPI;
