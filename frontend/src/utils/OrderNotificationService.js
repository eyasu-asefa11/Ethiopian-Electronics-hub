// Order Notifications Service for Ethiopian Electronics Marketplace
class OrderNotificationService {
  constructor() {
    this.notificationTemplates = new Map();
    this.notificationChannels = new Map();
    this.notificationQueue = [];
    this.isProcessing = false;
    this.notificationHistory = new Map();
    this.userPreferences = new Map();
    
    this.initializeTemplates();
    this.initializeChannels();
    this.initializeFromStorage();
  }

  // Initialize notification templates
  initializeTemplates() {
    const templates = {
      'order_created': {
        subject: 'Order Confirmation - Ethiopian Electronics',
        message: 'Thank you for your order! Your order has been received and is being processed.',
        email: {
          template: 'order_confirmation',
          variables: ['orderId', 'customerName', 'items', 'totalAmount', 'estimatedDelivery']
        },
        sms: {
          template: 'Your order #{orderId} has been confirmed. Total: {totalAmount} ETB',
          variables: ['orderId', 'totalAmount']
        },
        push: {
          title: 'Order Confirmed!',
          body: 'Your order #{orderId} has been confirmed and is being processed.',
          data: { orderId, type: 'order_created' }
        }
      },
      'order_confirmed': {
        subject: 'Order Confirmed - Ethiopian Electronics',
        message: 'Your order has been confirmed and is being prepared for shipment.',
        email: {
          template: 'order_confirmed',
          variables: ['orderId', 'estimatedDelivery']
        },
        sms: {
          template: 'Order #{orderId} confirmed! Estimated delivery: {estimatedDelivery}',
          variables: ['orderId', 'estimatedDelivery']
        },
        push: {
          title: 'Order Confirmed!',
          body: 'Your order #{orderId} has been confirmed.',
          data: { orderId, type: 'order_confirmed' }
        }
      },
      'order_shipped': {
        subject: 'Order Shipped - Ethiopian Electronics',
        message: 'Great news! Your order has been shipped and is on its way to you.',
        email: {
          template: 'order_shipped',
          variables: ['orderId', 'trackingNumber', 'courier', 'estimatedDelivery']
        },
        sms: {
          template: 'Order #{orderId} shipped! Tracking: {trackingNumber}',
          variables: ['orderId', 'trackingNumber']
        },
        push: {
          title: 'Order Shipped! 🚚',
          body: 'Your order #{orderId} is on its way! Track: {trackingNumber}',
          data: { orderId, trackingNumber, type: 'order_shipped' }
        }
      },
      'order_out_for_delivery': {
        subject: 'Order Out for Delivery - Ethiopian Electronics',
        message: 'Your order is out for delivery and will arrive soon!',
        email: {
          template: 'order_out_for_delivery',
          variables: ['orderId', 'deliveryAddress', 'estimatedArrival']
        },
        sms: {
          template: 'Order #{orderId} out for delivery! Arriving today',
          variables: ['orderId']
        },
        push: {
          title: 'Order Out for Delivery! 📦',
          body: 'Your order #{orderId} is out for delivery!',
          data: { orderId, type: 'order_out_for_delivery' }
        }
      },
      'order_delivered': {
        subject: 'Order Delivered - Ethiopian Electronics',
        message: 'Your order has been delivered successfully! Thank you for shopping with us.',
        email: {
          template: 'order_delivered',
          variables: ['orderId', 'deliveryTime', 'items']
        },
        sms: {
          template: 'Order #{orderId} delivered! Enjoy your purchase!',
          variables: ['orderId']
        },
        push: {
          title: 'Order Delivered! ✅',
          body: 'Your order #{orderId} has been delivered successfully!',
          data: { orderId, type: 'order_delivered' }
        }
      },
      'order_cancelled': {
        subject: 'Order Cancelled - Ethiopian Electronics',
        message: 'Your order has been cancelled as requested. We hope to serve you again soon.',
        email: {
          template: 'order_cancelled',
          variables: ['orderId', 'cancellationReason', 'refundAmount']
        },
        sms: {
          template: 'Order #{orderId} cancelled. Refund: {refundAmount} ETB',
          variables: ['orderId', 'refundAmount']
        },
        push: {
          title: 'Order Cancelled',
          body: 'Your order #{orderId} has been cancelled.',
          data: { orderId, type: 'order_cancelled' }
        }
      },
      'return_approved': {
        subject: 'Return Approved - Ethiopian Electronics',
        message: 'Your return request has been approved. We will process your refund shortly.',
        email: {
          template: 'return_approved',
          variables: ['orderId', 'returnId', 'refundAmount', 'refundMethod']
        },
        sms: {
          template: 'Return approved for order #{orderId}. Refund: {refundAmount} ETB',
          variables: ['orderId', 'refundAmount']
        },
        push: {
          title: 'Return Approved! ♻️',
          body: 'Your return request has been approved.',
          data: { orderId, type: 'return_approved' }
        }
      },
      'return_rejected': {
        subject: 'Return Rejected - Ethiopian Electronics',
        message: 'Your return request could not be approved. Please contact us for more details.',
        email: {
          template: 'return_rejected',
          variables: ['orderId', 'returnId', 'rejectionReason']
        },
        sms: {
          template: 'Return rejected for order #{orderId}. Contact support',
          variables: ['orderId']
        },
        push: {
          title: 'Return Rejected',
          body: 'Your return request could not be approved.',
          data: { orderId, type: 'return_rejected' }
        }
      },
      'exchange_approved': {
        subject: 'Exchange Approved - Ethiopian Electronics',
        message: 'Your exchange request has been approved. We will process your exchange shortly.',
        email: {
          template: 'exchange_approved',
          variables: ['orderId', 'exchangeId', 'newItem', 'exchangeMethod']
        },
        sms: {
          template: 'Exchange approved for order #{orderId}. New item: {newItem}',
          variables: ['orderId', 'newItem']
        },
        push: {
          title: 'Exchange Approved! 🔄',
          body: 'Your exchange request has been approved.',
          data: { orderId, type: 'exchange_approved' }
        }
      },
      'payment_reminder': {
        subject: 'Payment Reminder - Ethiopian Electronics',
        message: 'Please complete your payment to avoid order cancellation.',
        email: {
          template: 'payment_reminder',
          variables: ['orderId', 'amount', 'dueDate', 'paymentLink']
        },
        sms: {
          template: 'Payment reminder for order #{orderId}. Amount: {amount} ETB',
          variables: ['orderId', 'amount']
        },
        push: {
          title: 'Payment Reminder 💳',
          body: 'Complete payment for order #{orderId} to avoid cancellation.',
          data: { orderId, type: 'payment_reminder' }
        }
      },
      'delivery_reminder': {
        subject: 'Delivery Reminder - Ethiopian Electronics',
        message: 'Your order will be delivered tomorrow. Please ensure someone is available.',
        email: {
          template: 'delivery_reminder',
          variables: ['orderId', 'deliveryDate', 'deliveryAddress', 'items']
        },
        sms: {
          template: 'Order #{orderId} delivering tomorrow. Be ready!',
          variables: ['orderId']
        },
        push: {
          title: 'Delivery Tomorrow! 📦',
          body: 'Your order #{orderId} will be delivered tomorrow.',
          data: { orderId, type: 'delivery_reminder' }
        }
      },
      'review_request': {
        subject: 'Share Your Experience - Ethiopian Electronics',
        message: 'How was your shopping experience? Please share your review.',
        email: {
          template: 'review_request',
          variables: ['orderId', 'items', 'reviewLink']
        },
        sms: {
          template: 'Review your order #{orderId} experience! Link: {reviewLink}',
          variables: ['orderId', 'reviewLink']
        },
        push: {
          title: 'Review Your Order! ⭐',
          body: 'How was your experience with order #{orderId}?',
          data: { orderId, type: 'review_request' }
        }
      }
    };

    templates.forEach((template, key) => {
      this.notificationTemplates.set(key, template);
    });
  }

  // Initialize notification channels
  initializeChannels() {
    const channels = {
      email: {
        name: 'Email',
        enabled: true,
        priority: 1,
        providers: ['sendgrid', 'smtp'],
        templates: ['html', 'text'],
        rateLimit: 1000, // per hour
        retryAttempts: 3,
        retryDelay: 5000 // 5 seconds
      },
      sms: {
        name: 'SMS',
        enabled: true,
        priority: 2,
        providers: ['twilio', 'ethiotelecom'],
        templates: ['text'],
        rateLimit: 500, // per hour
        retryAttempts: 3,
        retryDelay: 10000 // 10 seconds
      },
      push: {
        name: 'Push Notification',
        enabled: true,
        priority: 3,
        providers: ['firebase', 'onesignal'],
        templates: ['push'],
        rateLimit: 2000, // per hour
        retryAttempts: 3,
        retryDelay: 3000 // 3 seconds
      },
      whatsapp: {
        name: 'WhatsApp',
        enabled: true,
        priority: 4,
        providers: ['twilio', 'whatsapp_business'],
        templates: ['text'],
        rateLimit: 100, // per hour
        retryAttempts: 3,
        retryDelay: 15000 // 15 seconds
      }
    };

    channels.forEach((channel, key) => {
      this.notificationChannels.set(key, channel);
    });
  }

  // Initialize from local storage
  initializeFromStorage() {
    const notificationHistory = this.loadFromLocalStorage('notification_history');
    const userPreferences = this.loadFromLocalStorage('user_preferences');
    
    if (notificationHistory) this.notificationHistory = new Map(Object.entries(notificationHistory));
    if (userPreferences) this.userPreferences = new Map(Object.entries(userPreferences));
  }

  // Send notification
  async sendNotification(orderId, type, data, options = {}) {
    const template = this.notificationTemplates.get(type);
    if (!template) {
      throw new Error(`Notification template not found for type: ${type}`);
    }

    const notification = {
      id: this.generateId(),
      orderId,
      type,
      template,
      data,
      options: {
        channels: options.channels || ['email', 'sms', 'push'],
        priority: options.priority || 'normal',
        scheduledAt: options.scheduledAt || null,
        retryAttempts: options.retryAttempts || 3,
        userId: options.userId || data.customerId
      },
      status: 'pending',
      createdAt: Date.now(),
      sentAt: null,
      deliveredAt: null,
      failedAt: null,
      retryCount: 0,
      errors: []
    };

    // Add to queue
    this.notificationQueue.push(notification);
    
    // Process queue
    if (!this.isProcessing) {
      this.processQueue();
    }

    return notification;
  }

  // Process notification queue
  async processQueue() {
    this.isProcessing = true;

    while (this.notificationQueue.length > 0) {
      const notification = this.notificationQueue.shift();
      
      try {
        await this.processNotification(notification);
      } catch (error) {
        console.error('Error processing notification:', error);
        await this.handleNotificationError(notification, error);
      }
    }

    this.isProcessing = false;
  }

  // Process individual notification
  async processNotification(notification) {
    const { orderId, type, template, data, options } = notification;

    // Check if notification should be sent now
    if (options.scheduledAt && options.scheduledAt > Date.now()) {
      // Re-add to queue
      this.notificationQueue.push(notification);
      return;
    }

    // Check user preferences
    const userPrefs = this.getUserPreferences(options.userId);
    if (!this.shouldSendNotification(userPrefs, type, options.channels)) {
      notification.status = 'skipped';
      notification.skippedAt = Date.now();
      this.storeNotification(notification);
      return;
    }

    // Send to each channel
    const results = [];
    for (const channel of options.channels) {
      try {
        const result = await this.sendToChannel(channel, notification);
        results.push({ channel, success: true, result });
      } catch (error) {
        results.push({ channel, success: false, error });
        notification.errors.push({ channel, error: error.message });
      }
    }

    // Update notification status
    const allSuccessful = results.every(r => r.success);
    const anySuccessful = results.some(r => r.success);

    if (allSuccessful) {
      notification.status = 'sent';
      notification.sentAt = Date.now();
    } else if (anySuccessful) {
      notification.status = 'partially_sent';
      notification.sentAt = Date.now();
    } else {
      notification.status = 'failed';
      notification.failedAt = Date.now();
    }

    // Store notification
    this.storeNotification(notification);

    return notification;
  }

  // Send to specific channel
  async sendToChannel(channel, notification) {
    const channelConfig = this.notificationChannels.get(channel);
    if (!channelConfig || !channelConfig.enabled) {
      throw new Error(`Channel ${channel} is not enabled`);
    }

    const { template, data } = notification;
    const channelTemplate = template[channel];
    
    if (!channelTemplate) {
      throw new Error(`No template for channel ${channel}`);
    }

    // Generate content
    const content = this.generateContent(channelTemplate, data);

    // Send notification
    switch (channel) {
      case 'email':
        return await this.sendEmail(content, notification);
      case 'sms':
        return await this.sendSMS(content, notification);
      case 'push':
        return await this.sendPushNotification(content, notification);
      case 'whatsapp':
        return await this.sendWhatsApp(content, notification);
      default:
        throw new Error(`Unknown channel: ${channel}`);
    }
  }

  // Generate content from template
  generateContent(template, data) {
    let content = { ...template };

    // Replace variables
    if (template.variables) {
      template.variables.forEach(variable => {
        const value = this.getVariableValue(variable, data);
        const placeholder = `{${variable}}`;
        
        if (template.template) {
          content.template = content.template.replace(new RegExp(placeholder, 'g'), value);
        }
        if (template.subject) {
          content.subject = content.subject.replace(new RegExp(placeholder, 'g'), value);
        }
        if (template.body) {
          content.body = content.body.replace(new RegExp(placeholder, 'g'), value);
        }
        if (template.title) {
          content.title = content.title.replace(new RegExp(placeholder, 'g'), value);
        }
      });
    }

    return content;
  }

  // Get variable value
  getVariableValue(variable, data) {
    const value = data[variable];
    if (value !== undefined) {
      return value;
    }

    // Handle nested variables
    const parts = variable.split('.');
    let current = data;
    for (const part of parts) {
      if (current && current[part] !== undefined) {
        current = current[part];
      } else {
        return `[${variable}]`;
      }
    }
    
    return current;
  }

  // Send email
  async sendEmail(content, notification) {
    const { data } = notification;
    
    // In production, this would integrate with email service
    console.log('📧 Sending email:', {
      to: data.customerEmail,
      subject: content.subject,
      template: content.template
    });

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          messageId: this.generateId(),
          provider: 'sendgrid',
          status: 'delivered'
        });
      }, 2000);
    });
  }

  // Send SMS
  async sendSMS(content, notification) {
    const { data } = notification;
    
    // In production, this would integrate with SMS service
    console.log('📱 Sending SMS:', {
      to: data.customerPhone,
      message: content.template
    });

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          messageId: this.generateId(),
          provider: 'twilio',
          status: 'delivered'
        });
      }, 1500);
    });
  }

  // Send push notification
  async sendPushNotification(content, notification) {
    const { data } = notification;
    
    // In production, this would integrate with push service
    console.log('🔔 Sending push notification:', {
      to: data.customerId,
      title: content.title,
      body: content.body,
      data: content.data
    });

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          messageId: this.generateId(),
          provider: 'firebase',
          status: 'delivered'
        });
      }, 1000);
    });
  }

  // Send WhatsApp message
  async sendWhatsApp(content, notification) {
    const { data } = notification;
    
    // In production, this would integrate with WhatsApp Business API
    console.log('💬 Sending WhatsApp:', {
      to: data.customerPhone,
      message: content.template
    });

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          messageId: this.generateId(),
          provider: 'twilio',
          status: 'delivered'
        });
      }, 2000);
    });
  }

  // Check if notification should be sent
  shouldSendNotification(userPrefs, type, channels) {
    if (!userPrefs) return true;

    // Check if user has disabled this type
    if (userPrefs.disabledTypes && userPrefs.disabledTypes.includes(type)) {
      return false;
    }

    // Check if user has disabled these channels
    const enabledChannels = channels.filter(channel => 
      !userPrefs.disabledChannels || !userPrefs.disabledChannels.includes(channel)
    );

    return enabledChannels.length > 0;
  }

  // Get user preferences
  getUserPreferences(userId) {
    return this.userPreferences.get(userId) || this.getDefaultPreferences();
  }

  // Get default preferences
  getDefaultPreferences() {
    return {
      enabledTypes: ['all'],
      disabledTypes: [],
      enabledChannels: ['email', 'push'],
      disabledChannels: ['sms', 'whatsapp'],
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      },
      frequency: 'immediate'
    };
  }

  // Update user preferences
  updateUserPreferences(userId, preferences) {
    this.userPreferences.set(userId, preferences);
    this.saveToLocalStorage('user_preferences', this.mapToObject(this.userPreferences));
  }

  // Store notification
  storeNotification(notification) {
    const key = `${notification.orderId}_${notification.id}`;
    this.notificationHistory.set(key, notification);
    this.saveToLocalStorage('notification_history', this.mapToObject(this.notificationHistory));
  }

  // Get notification history
  getNotificationHistory(orderId, limit = 50) {
    const notifications = [];
    
    for (const [key, notification] of this.notificationHistory.entries()) {
      if (key.startsWith(orderId)) {
        notifications.push(notification);
      }
    }

    return notifications
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  }

  // Get notification statistics
  getNotificationStatistics() {
    const stats = {
      totalNotifications: this.notificationHistory.size,
      notificationsByType: {},
      notificationsByChannel: {},
      notificationsByStatus: {},
      deliveryRate: 0,
      averageDeliveryTime: 0
    };

    let totalDelivered = 0;
    let totalDeliveryTime = 0;

    for (const notification of this.notificationHistory.values()) {
      // Type breakdown
      stats.notificationsByType[notification.type] = (stats.notificationsByType[notification.type] || 0) + 1;
      
      // Channel breakdown
      notification.options.channels.forEach(channel => {
        stats.notificationsByChannel[channel] = (stats.notificationsByChannel[channel] || 0) + 1;
      });
      
      // Status breakdown
      stats.notificationsByStatus[notification.status] = (stats.notificationsByStatus[notification.status] || 0) + 1;
      
      // Delivery metrics
      if (notification.status === 'sent' || notification.status === 'partially_sent') {
        totalDelivered++;
        if (notification.sentAt && notification.createdAt) {
          totalDeliveryTime += notification.sentAt - notification.createdAt;
        }
      }
    }

    stats.deliveryRate = this.notificationHistory.size > 0 ? 
      (totalDelivered / this.notificationHistory.size) * 100 : 0;
    
    stats.averageDeliveryTime = totalDelivered > 0 ? 
      totalDeliveryTime / totalDelivered : 0;

    return stats;
  }

  // Schedule notification
  scheduleNotification(orderId, type, data, scheduledAt, options = {}) {
    return this.sendNotification(orderId, type, data, {
      ...options,
      scheduledAt
    });
  }

  // Cancel scheduled notification
  cancelScheduledNotification(notificationId) {
    // In production, this would cancel the scheduled notification
    console.log(`Cancelled scheduled notification: ${notificationId}`);
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Local storage helpers
  saveToLocalStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  loadFromLocalStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }

  // Convert Map to Object
  mapToObject(map) {
    const obj = {};
    for (const [key, value] of map.entries()) {
      obj[key] = value;
    }
    return obj;
  }
}

module.exports = OrderNotificationService;
