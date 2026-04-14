// Mobile App Services - Push Notification Service
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert, Linking } from 'react-native';
import EthiopianElectronicsAPI from './api';

class NotificationService {
  constructor() {
    this.isInitialized = false;
    this.notificationQueue = [];
    this.notificationHandlers = new Map();
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Configure push notifications
      PushNotification.configure({
        onRegister: async (token) => {
          console.log('Push notification token:', token);
          
          // Store token locally
          await AsyncStorage.setItem('push_token', token);
          
          // Send token to backend
          try {
            await EthiopianElectronicsAPI.registerPushToken(token);
          } catch (error) {
            console.error('Failed to register push token:', error);
          }
        },

        onNotification: (notification) => {
          console.log('Notification received:', notification);
          
          // Handle notification
          this.handleNotification(notification);
        },

        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },

        popInitialNotification: true,
        requestPermissions: Platform.OS === 'ios',
      });

      // Create notification channels for Android
      if (Platform.OS === 'android') {
        this.createNotificationChannels();
      }

      this.isInitialized = true;
      console.log('Notification service initialized');

    } catch (error) {
      console.error('Notification initialization error:', error);
    }
  }

  createNotificationChannels() {
    PushNotification.createChannel(
      {
        channelId: 'orders',
        channelName: 'Order Updates',
        channelDescription: 'Notifications about your orders',
        playSound: true,
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log('Orders channel created:', created)
    );

    PushNotification.createChannel(
      {
        channelId: 'promotions',
        channelName: 'Promotions & Deals',
        channelDescription: 'Special offers and promotions',
        playSound: true,
        soundName: 'default',
        importance: 3,
        vibrate: true,
      },
      (created) => console.log('Promotions channel created:', created)
    );

    PushNotification.createChannel(
      {
        channelId: 'messages',
        channelName: 'Messages',
        channelDescription: 'Messages from shops and other users',
        playSound: true,
        soundName: 'default',
        importance: 2,
        vibrate: true,
      },
      (created) => console.log('Messages channel created:', created)
    );

    PushNotification.createChannel(
      {
        channelId: 'system',
        channelName: 'System Updates',
        channelDescription: 'Important system notifications',
        playSound: true,
        soundName: 'default',
        importance: 5,
        vibrate: true,
      },
      (created) => console.log('System channel created:', created)
    );
  }

  handleNotification(notification) {
    if (notification.userInteraction) {
      // User tapped on notification
      this.handleNotificationTap(notification);
    } else {
      // Notification received while app is in foreground
      this.handleForegroundNotification(notification);
    }
  }

  handleNotificationTap(notification) {
    const { data } = notification;
    
    // Execute handler if registered
    if (this.notificationHandlers.has(data.type)) {
      const handler = this.notificationHandlers.get(data.type);
      handler(notification);
      return;
    }

    // Default handling based on notification type
    switch (data.type) {
      case 'order':
        this.navigateToOrder(data.orderId);
        break;
      case 'product':
        this.navigateToProduct(data.productId);
        break;
      case 'shop':
        this.navigateToShop(data.shopId);
        break;
      case 'promotion':
        this.navigateToPromotion(data.promotionId);
        break;
      case 'message':
        this.navigateToMessages();
        break;
      case 'rate_app':
        this.promptAppRating();
        break;
      case 'update_required':
        this.promptAppUpdate();
        break;
      default:
        console.log('Unknown notification type:', data.type);
    }
  }

  handleForegroundNotification(notification) {
    // Show in-app notification or update UI
    const { data } = notification;
    
    // Add to notification queue for in-app display
    this.notificationQueue.push({
      id: Date.now(),
      title: notification.title,
      message: notification.message,
      data,
      timestamp: Date.now(),
    });

    // Limit queue size
    if (this.notificationQueue.length > 10) {
      this.notificationQueue.shift();
    }
  }

  // Navigation methods (to be implemented with navigation service)
  navigateToOrder(orderId) {
    console.log('Navigate to order:', orderId);
    // Implementation depends on navigation setup
  }

  navigateToProduct(productId) {
    console.log('Navigate to product:', productId);
    // Implementation depends on navigation setup
  }

  navigateToShop(shopId) {
    console.log('Navigate to shop:', shopId);
    // Implementation depends on navigation setup
  }

  navigateToPromotion(promotionId) {
    console.log('Navigate to promotion:', promotionId);
    // Implementation depends on navigation setup
  }

  navigateToMessages() {
    console.log('Navigate to messages');
    // Implementation depends on navigation setup
  }

  promptAppRating() {
    Alert.alert(
      'Rate Ethiopian Electronics',
      'Enjoying our app? Please take a moment to rate us!',
      [
        {
          text: 'Maybe Later',
          style: 'cancel',
        },
        {
          text: 'Rate Now',
          onPress: () => {
            Linking.openURL('market://details?id=com.ethiopian.electronics');
          },
        },
      ]
    );
  }

  promptAppUpdate() {
    Alert.alert(
      'Update Required',
      'A new version of the app is available. Please update to continue using all features.',
      [
        {
          text: 'Update Now',
          onPress: () => {
            Linking.openURL('market://details?id=com.ethiopian.electronics');
          },
        },
      ]
    );
  }

  // Local notification methods
  showLocalNotification(title, message, data = {}, channelId = 'system') {
    PushNotification.localNotification({
      channelId,
      title,
      message,
      data,
      playSound: true,
      soundName: 'default',
      actions: ['View', 'Dismiss'],
    });
  }

  showOrderNotification(orderId, status, message) {
    this.showLocalNotification(
      'Order Update',
      message,
      { type: 'order', orderId },
      'orders'
    );
  }

  showPromotionNotification(title, message, promotionId) {
    this.showLocalNotification(
      title,
      message,
      { type: 'promotion', promotionId },
      'promotions'
    );
  }

  showMessageNotification(senderName, message, conversationId) {
    this.showLocalNotification(
      `New message from ${senderName}`,
      message,
      { type: 'message', conversationId },
      'messages'
    );
  }

  showSystemNotification(title, message) {
    this.showLocalNotification(
      title,
      message,
      { type: 'system' },
      'system'
    );
  }

  // Scheduled notifications
  scheduleNotification(title, message, date, data = {}) {
    PushNotification.localNotificationSchedule({
      title,
      message,
      date,
      data,
      playSound: true,
      soundName: 'default',
    });
  }

  // Schedule daily deal notification
  scheduleDailyDealNotification() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // 9 AM

    this.scheduleNotification(
      'Daily Deal Alert! 🔥',
      'Check out today\'s amazing deals on Ethiopian Electronics!',
      tomorrow,
      { type: 'promotion' }
    );
  }

  // Schedule abandoned cart reminder
  scheduleCartReminder(cartItems) {
    const reminderTime = new Date();
    reminderTime.setHours(reminderTime.getHours() + 24); // 24 hours later

    this.scheduleNotification(
      'Cart Reminder 🛒',
      `You have ${cartItems.length} items in your cart. Complete your purchase now!`,
      reminderTime,
      { type: 'cart_reminder' }
    );
  }

  // Schedule price drop notification
  schedulePriceDropNotification(productName, newPrice) {
    this.showLocalNotification(
      'Price Drop Alert! 💰',
      `${productName} is now only ${newPrice} ETB!`,
      { type: 'price_drop' },
      'promotions'
    );
  }

  // Cancel scheduled notifications
  cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }

  // Get notification queue
  getNotificationQueue() {
    return this.notificationQueue;
  }

  // Clear notification queue
  clearNotificationQueue() {
    this.notificationQueue = [];
  }

  // Register notification handler
  registerHandler(type, handler) {
    this.notificationHandlers.set(type, handler);
  }

  // Unregister notification handler
  unregisterHandler(type) {
    this.notificationHandlers.delete(type);
  }

  // Check notification permissions
  async checkPermissions() {
    return new Promise((resolve) => {
      PushNotification.checkPermissions((permissions) => {
        resolve(permissions);
      });
    });
  }

  // Request notification permissions
  async requestPermissions() {
    return new Promise((resolve) => {
      PushNotification.requestPermissions((permissions) => {
        resolve(permissions);
      });
    });
  }

  // Get notification settings from backend
  async getNotificationSettings() {
    try {
      const settings = await EthiopianElectronicsAPI.getNotificationSettings();
      return settings;
    } catch (error) {
      console.error('Failed to get notification settings:', error);
      return this.getDefaultSettings();
    }
  }

  // Update notification settings
  async updateNotificationSettings(settings) {
    try {
      await EthiopianElectronicsAPI.updateNotificationSettings(settings);
      return true;
    } catch (error) {
      console.error('Failed to update notification settings:', error);
      return false;
    }
  }

  // Default notification settings
  getDefaultSettings() {
    return {
      orders: true,
      promotions: true,
      messages: true,
      system: true,
      dailyDeals: true,
      priceDrops: true,
      cartReminders: true,
      marketingEmails: false,
    };
  }

  // Test notification
  sendTestNotification() {
    this.showLocalNotification(
      'Test Notification',
      'This is a test notification from Ethiopian Electronics!',
      { type: 'test' }
    );
  }
}

export default NotificationService;
