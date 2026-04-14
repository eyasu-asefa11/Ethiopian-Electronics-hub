// Order Status Updates Service for Ethiopian Electronics Marketplace
class OrderStatusService {
  constructor() {
    this.statusUpdates = new Map();
    this.updateQueue = [];
    this.isProcessing = false;
    this.subscribers = new Map();
    this.webhookEndpoints = new Map();
    this.updateHistory = new Map();
    
    this.initializeFromStorage();
  }

  // Initialize from local storage
  initializeFromStorage() {
    const statusUpdates = this.loadFromLocalStorage('status_updates');
    const webhookEndpoints = this.loadFromLocalStorage('webhook_endpoints');
    
    if (statusUpdates) this.statusUpdates = new Map(Object.entries(statusUpdates));
    if (webhookEndpoints) this.webhookEndpoints = new Map(Object.entries(webhookEndpoints));
  }

  // Subscribe to order status updates
  subscribe(orderId, callback) {
    if (!this.subscribers.has(orderId)) {
      this.subscribers.set(orderId, new Set());
    }
    
    this.subscribers.get(orderId).add(callback);
    
    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(orderId);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.subscribers.delete(orderId);
        }
      }
    };
  }

  // Update order status
  async updateOrderStatus(orderId, newStatus, data = {}, options = {}) {
    const update = {
      orderId,
      newStatus,
      oldStatus: data.oldStatus,
      data,
      timestamp: Date.now(),
      updatedBy: options.updatedBy || 'system',
      source: options.source || 'api',
      priority: options.priority || 'normal',
      retryCount: 0,
      maxRetries: options.maxRetries || 3,
      delay: options.delay || 0,
      notifications: options.notifications !== false,
      webhooks: options.webhooks !== false
    };

    // Add to queue
    this.updateQueue.push(update);
    
    // Process queue
    if (!this.isProcessing) {
      this.processQueue();
    }

    return update;
  }

  // Process update queue
  async processQueue() {
    this.isProcessing = true;

    while (this.updateQueue.length > 0) {
      const update = this.updateQueue.shift();
      
      try {
        await this.processUpdate(update);
      } catch (error) {
        console.error('Error processing status update:', error);
        await this.handleUpdateError(update, error);
      }
    }

    this.isProcessing = false;
  }

  // Process individual update
  async processUpdate(update) {
    const { orderId, newStatus, data, notifications, webhooks } = update;

    // Add delay if specified
    if (update.delay > 0) {
      await this.delay(update.delay);
    }

    // Store status update
    this.storeStatusUpdate(update);

    // Add to update history
    this.addToUpdateHistory(orderId, update);

    // Notify subscribers
    this.notifySubscribers(orderId, update);

    // Send notifications
    if (notifications) {
      await this.sendNotifications(update);
    }

    // Trigger webhooks
    if (webhooks) {
      await this.triggerWebhooks(update);
    }

    // Log update
    this.logUpdate(update);

    return update;
  }

  // Store status update
  storeStatusUpdate(update) {
    this.statusUpdates.set(`${update.orderId}_${update.timestamp}`, update);
    this.saveToLocalStorage('status_updates', this.mapToObject(this.statusUpdates));
  }

  // Add to update history
  addToUpdateHistory(orderId, update) {
    if (!this.updateHistory.has(orderId)) {
      this.updateHistory.set(orderId, []);
    }

    const history = this.updateHistory.get(orderId);
    history.push({
      status: update.newStatus,
      timestamp: update.timestamp,
      updatedBy: update.updatedBy,
      data: update.data,
      source: update.source
    });

    // Keep only last 50 updates
    if (history.length > 50) {
      history.shift();
    }

    this.saveToLocalStorage('update_history', this.mapToObject(this.updateHistory));
  }

  // Notify subscribers
  notifySubscribers(orderId, update) {
    const subscribers = this.subscribers.get(orderId);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(update);
        } catch (error) {
          console.error('Error notifying subscriber:', error);
        }
      });
    }
  }

  // Send notifications
  async sendNotifications(update) {
    const notifications = this.generateNotifications(update);
    
    for (const notification of notifications) {
      try {
        await this.sendNotification(notification);
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
  }

  // Generate notifications
  generateNotifications(update) {
    const { orderId, newStatus, data } = update;
    const notifications = [];

    // Customer notification
    notifications.push({
      type: 'customer',
      recipient: data.customerEmail,
      subject: this.getNotificationSubject(newStatus),
      message: this.getNotificationMessage(update),
      channels: ['email', 'sms', 'push'],
      priority: this.getNotificationPriority(newStatus),
      template: this.getNotificationTemplate(newStatus)
    });

    // Shop notification (if applicable)
    if (data.shopEmail) {
      notifications.push({
        type: 'shop',
        recipient: data.shopEmail,
        subject: `Order Update: ${orderId}`,
        message: `Order #${orderId} status updated to ${newStatus}`,
        channels: ['email'],
        priority: 'normal'
      });
    }

    // Admin notification for critical statuses
    if (this.isCriticalStatus(newStatus)) {
      notifications.push({
        type: 'admin',
        recipient: 'admin@ethiopian-electronics.com',
        subject: `Critical Order Update: ${orderId}`,
        message: `Order #${orderId} status updated to ${newStatus}`,
        channels: ['email'],
        priority: 'high'
      });
    }

    return notifications;
  }

  // Send notification
  async sendNotification(notification) {
    // In production, this would integrate with email/SMS/push services
    console.log('🔔 Sending notification:', notification);
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ sent: true, messageId: this.generateId() });
      }, 1000);
    });
  }

  // Get notification subject
  getNotificationSubject(status) {
    const subjects = {
      'pending': 'Order Received',
      'confirmed': 'Order Confirmed',
      'processing': 'Order Processing',
      'shipped': 'Order Shipped',
      'out_for_delivery': 'Order Out for Delivery',
      'delivered': 'Order Delivered',
      'cancelled': 'Order Cancelled',
      'return_approved': 'Return Approved',
      'return_rejected': 'Return Rejected',
      'exchange_approved': 'Exchange Approved',
      'exchange_rejected': 'Exchange Rejected'
    };

    return subjects[status] || 'Order Update';
  }

  // Get notification message
  getNotificationMessage(update) {
    const { orderId, newStatus, data } = update;
    
    const messages = {
      'pending': `Your order #${orderId} has been received and is being processed.`,
      'confirmed': `Your order #${orderId} has been confirmed and is being prepared.`,
      'processing': `Your order #${orderId} is being processed and packaged.`,
      'shipped': `Your order #${orderId} has been shipped. Tracking: ${data.trackingNumber}`,
      'out_for_delivery': `Your order #${orderId} is out for delivery.`,
      'delivered': `Your order #${orderId} has been delivered successfully.`,
      'cancelled': `Your order #${orderId} has been cancelled.`,
      'return_approved': `Your return request for order #${orderId} has been approved.`,
      'return_rejected': `Your return request for order #${orderId} has been rejected.`,
      'exchange_approved': `Your exchange request for order #${orderId} has been approved.`,
      'exchange_rejected': `Your exchange request for order #${orderId} has been rejected.`
    };

    return messages[newStatus] || `Your order #${orderId} status has been updated to ${newStatus}.`;
  }

  // Get notification priority
  getNotificationPriority(status) {
    const highPriorityStatuses = ['delivered', 'cancelled', 'return_approved', 'return_rejected'];
    return highPriorityStatuses.includes(status) ? 'high' : 'normal';
  }

  // Get notification template
  getNotificationTemplate(status) {
    const templates = {
      'shipped': 'order_shipped',
      'delivered': 'order_delivered',
      'cancelled': 'order_cancelled',
      'return_approved': 'return_approved',
      'return_rejected': 'return_rejected'
    };

    return templates[status] || 'order_update';
  }

  // Check if status is critical
  isCriticalStatus(status) {
    const criticalStatuses = ['cancelled', 'failed_delivery', 'return_rejected', 'exchange_rejected'];
    return criticalStatuses.includes(status);
  }

  // Trigger webhooks
  async triggerWebhooks(update) {
    const webhooks = this.getWebhooksForUpdate(update);
    
    for (const webhook of webhooks) {
      try {
        await this.callWebhook(webhook, update);
      } catch (error) {
        console.error('Error calling webhook:', error);
      }
    }
  }

  // Get webhooks for update
  getWebhooksForUpdate(update) {
    const webhooks = [];
    
    // Global webhooks
    Array.from(this.webhookEndpoints.values()).forEach(webhook => {
      if (webhook.events.includes(update.newStatus) || webhook.events.includes('*')) {
        webhooks.push(webhook);
      }
    });

    // Order-specific webhooks
    const orderWebhooks = this.getOrderWebhooks(update.orderId);
    webhooks.push(...orderWebhooks);

    return webhooks;
  }

  // Get order-specific webhooks
  getOrderWebhooks(orderId) {
    // In production, this would fetch from database
    return [];
  }

  // Call webhook
  async callWebhook(webhook, update) {
    const payload = {
      event: `order.${update.newStatus}`,
      data: update,
      timestamp: Date.now(),
      signature: this.generateWebhookSignature(update)
    };

    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': payload.signature,
        'X-Event-Type': payload.event
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }

    return response.json();
  }

  // Generate webhook signature
  generateWebhookSignature(update) {
    // In production, this would use HMAC-SHA256
    return `sig_${Date.now()}_${update.orderId}`;
  }

  // Handle update error
  async handleUpdateError(update, error) {
    update.retryCount++;
    
    if (update.retryCount < update.maxRetries) {
      // Add back to queue with exponential backoff
      update.delay = Math.pow(2, update.retryCount) * 1000; // 1s, 2s, 4s, etc.
      this.updateQueue.push(update);
    } else {
      // Log failed update
      this.logFailedUpdate(update, error);
    }
  }

  // Log update
  logUpdate(update) {
    console.log('📦 Order Status Update:', {
      orderId: update.orderId,
      status: update.newStatus,
      timestamp: new Date(update.timestamp).toISOString(),
      updatedBy: update.updatedBy,
      source: update.source
    });
  }

  // Log failed update
  logFailedUpdate(update, error) {
    console.error('❌ Failed Order Status Update:', {
      orderId: update.orderId,
      status: update.newStatus,
      error: error.message,
      retryCount: update.retryCount,
      timestamp: new Date(update.timestamp).toISOString()
    });
  }

  // Get update history
  getUpdateHistory(orderId, limit = 50) {
    const history = this.updateHistory.get(orderId) || [];
    return history.slice(-limit);
  }

  // Get status updates for order
  getStatusUpdates(orderId) {
    const updates = [];
    
    for (const [key, update] of this.statusUpdates.entries()) {
      if (key.startsWith(orderId)) {
        updates.push(update);
      }
    }

    return updates.sort((a, b) => b.timestamp - a.timestamp);
  }

  // Add webhook endpoint
  addWebhook(id, url, events, secret) {
    const webhook = {
      id,
      url,
      events,
      secret,
      active: true,
      createdAt: Date.now(),
      lastTriggered: null,
      failureCount: 0
    };

    this.webhookEndpoints.set(id, webhook);
    this.saveToLocalStorage('webhook_endpoints', this.mapToObject(this.webhookEndpoints));

    return webhook;
  }

  // Remove webhook
  removeWebhook(id) {
    const webhook = this.webhookEndpoints.get(id);
    if (webhook) {
      webhook.active = false;
      this.webhookEndpoints.set(id, webhook);
      this.saveToLocalStorage('webhook_endpoints', this.mapToObject(this.webhookEndpoints));
    }
  }

  // Get all webhooks
  getWebhooks() {
    return Array.from(this.webhookEndpoints.values());
  }

  // Get update statistics
  getUpdateStatistics() {
    const stats = {
      totalUpdates: this.statusUpdates.size,
      updatesByStatus: {},
      updatesByHour: {},
      updatesBySource: {},
      failureRate: 0,
      averageProcessingTime: 0
    };

    for (const update of this.statusUpdates.values()) {
      // Status breakdown
      stats.updatesByStatus[update.newStatus] = (stats.updatesByStatus[update.newStatus] || 0) + 1;
      
      // Hour breakdown
      const hour = new Date(update.timestamp).getHours();
      stats.updatesByHour[hour] = (stats.updatesByHour[hour] || 0) + 1;
      
      // Source breakdown
      stats.updatesBySource[update.source] = (stats.updatesBySource[update.source] || 0) + 1;
    }

    return stats;
  }

  // Schedule status update
  scheduleStatusUpdate(orderId, newStatus, scheduledTime, data = {}) {
    const update = {
      orderId,
      newStatus,
      data,
      scheduledTime,
      timestamp: Date.now(),
      type: 'scheduled'
    };

    // In production, this would use a job scheduler
    const delay = scheduledTime - Date.now();
    if (delay > 0) {
      setTimeout(() => {
        this.updateOrderStatus(orderId, newStatus, data, { source: 'scheduled' });
      }, delay);
    }

    return update;
  }

  // Cancel scheduled update
  cancelScheduledUpdate(orderId, newStatus) {
    // In production, this would cancel the scheduled job
    console.log(`Cancelled scheduled update for order ${orderId} to status ${newStatus}`);
  }

  // Delay utility
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

module.exports = OrderStatusService;
