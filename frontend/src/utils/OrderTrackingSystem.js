// Order Tracking System for Ethiopian Electronics Marketplace
class OrderTrackingSystem {
  constructor() {
    this.orders = new Map();
    this.orderHistory = new Map();
    this.orderStatuses = new Map();
    this.notifications = new Map();
    this.returns = new Map();
    this.exchanges = new Map();
    
    this.statusFlow = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['processing', 'cancelled'],
      'processing': ['shipped', 'cancelled'],
      'shipped': ['out_for_delivery', 'delivered'],
      'out_for_delivery': ['delivered', 'failed_delivery'],
      'delivered': ['completed'],
      'failed_delivery': ['retry_delivery', 'cancelled'],
      'retry_delivery': ['delivered', 'failed_delivery'],
      'cancelled': [],
      'completed': ['return_requested', 'exchange_requested'],
      'return_requested': ['return_approved', 'return_rejected'],
      'return_approved': ['return_received', 'return_cancelled'],
      'return_received': ['refund_processing'],
      'refund_processing': ['refunded'],
      'refunded': ['completed'],
      'return_rejected': ['completed'],
      'return_cancelled': ['completed'],
      'exchange_requested': ['exchange_approved', 'exchange_rejected'],
      'exchange_approved': ['exchange_processed'],
      'exchange_processed': ['exchange_shipped'],
      'exchange_shipped': ['exchange_delivered'],
      'exchange_delivered': ['completed'],
      'exchange_rejected': ['completed']
    };
    
    this.statusDescriptions = {
      'pending': 'Order received and waiting for confirmation',
      'confirmed': 'Order confirmed and being prepared',
      'processing': 'Order is being processed and packaged',
      'shipped': 'Order has been shipped from warehouse',
      'out_for_delivery': 'Order is out for delivery',
      'delivered': 'Order has been delivered successfully',
      'failed_delivery': 'Delivery attempt failed',
      'retry_delivery': 'Order is being redelivered',
      'cancelled': 'Order has been cancelled',
      'completed': 'Order completed successfully',
      'return_requested': 'Customer requested return',
      'return_approved': 'Return request approved',
      'return_received': 'Returned item received',
      'refund_processing': 'Refund is being processed',
      'refunded': 'Refund processed successfully',
      'return_rejected': 'Return request rejected',
      'return_cancelled': 'Return request cancelled',
      'exchange_requested': 'Customer requested exchange',
      'exchange_approved': 'Exchange request approved',
      'exchange_processed': 'Exchange item processed',
      'exchange_shipped': 'Exchange item shipped',
      'exchange_delivered': 'Exchange item delivered',
      'exchange_rejected': 'Exchange request rejected'
    };

    this.initializeFromStorage();
  }

  // Initialize from local storage
  initializeFromStorage() {
    const orders = this.loadFromLocalStorage('orders');
    const orderHistory = this.loadFromLocalStorage('order_history');
    const returns = this.loadFromLocalStorage('returns');
    const exchanges = this.loadFromLocalStorage('exchanges');
    
    if (orders) this.orders = new Map(Object.entries(orders));
    if (orderHistory) this.orderHistory = new Map(Object.entries(orderHistory));
    if (returns) this.returns = new Map(Object.entries(returns));
    if (exchanges) this.exchanges = new Map(Object.entries(exchanges));
  }

  // Create new order
  createOrder(orderData) {
    const order = {
      id: this.generateOrderId(),
      customerId: orderData.customerId,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus || 'pending',
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      estimatedDelivery: this.calculateEstimatedDelivery(),
      trackingNumber: null,
      courier: null,
      notes: orderData.notes || '',
      priority: orderData.priority || 'normal',
      source: orderData.source || 'web'
    };

    // Add order status history
    this.addStatusHistory(order.id, 'pending', 'Order created');

    // Store order
    this.orders.set(order.id, order);
    this.saveToLocalStorage('orders', this.mapToObject(this.orders));

    // Send notification
    this.sendOrderNotification(order.id, 'order_created', order);

    return order;
  }

  // Update order status
  updateOrderStatus(orderId, newStatus, notes = '', updatedBy = 'system') {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Validate status transition
    if (!this.isValidStatusTransition(order.status, newStatus)) {
      throw new Error(`Invalid status transition from ${order.status} to ${newStatus}`);
    }

    const oldStatus = order.status;
    order.status = newStatus;
    order.updatedAt = Date.now();
    
    if (notes) {
      order.notes = order.notes ? `${order.notes}\n${notes}` : notes;
    }

    // Add status history
    this.addStatusHistory(orderId, newStatus, notes, updatedBy);

    // Handle special status changes
    this.handleStatusChange(order, oldStatus, newStatus);

    // Store updated order
    this.orders.set(orderId, order);
    this.saveToLocalStorage('orders', this.mapToObject(this.orders));

    // Send notification
    this.sendOrderNotification(orderId, 'status_updated', order, {
      oldStatus,
      newStatus,
      notes
    });

    return order;
  }

  // Validate status transition
  isValidStatusTransition(currentStatus, newStatus) {
    const validTransitions = this.statusFlow[currentStatus];
    return validTransitions && validTransitions.includes(newStatus);
  }

  // Add status history
  addStatusHistory(orderId, status, notes = '', updatedBy = 'system') {
    if (!this.orderHistory.has(orderId)) {
      this.orderHistory.set(orderId, []);
    }

    const history = this.orderHistory.get(orderId);
    history.push({
      status,
      notes,
      updatedBy,
      timestamp: Date.now()
    });

    this.saveToLocalStorage('order_history', this.mapToObject(this.orderHistory));
  }

  // Handle special status changes
  handleStatusChange(order, oldStatus, newStatus) {
    switch (newStatus) {
      case 'confirmed':
        this.generateTrackingNumber(order.id);
        break;
      case 'shipped':
        this.assignCourier(order.id);
        break;
      case 'delivered':
        this.markAsCompleted(order.id);
        break;
      case 'cancelled':
        this.processCancellation(order.id);
        break;
    }
  }

  // Generate tracking number
  generateTrackingNumber(orderId) {
    const order = this.orders.get(orderId);
    const trackingNumber = `ET${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    order.trackingNumber = trackingNumber;
    order.updatedAt = Date.now();
    this.orders.set(orderId, order);
    return trackingNumber;
  }

  // Assign courier
  assignCourier(orderId) {
    const order = this.orders.get(orderId);
    const couriers = ['Ethiopian Post', 'DHL Ethiopia', 'FedEx Ethiopia', 'Local Courier'];
    order.courier = couriers[Math.floor(Math.random() * couriers.length)];
    order.updatedAt = Date.now();
    this.orders.set(orderId, order);
  }

  // Mark as completed
  markAsCompleted(orderId) {
    const order = this.orders.get(orderId);
    order.completedAt = Date.now();
    order.updatedAt = Date.now();
    this.orders.set(orderId, order);
  }

  // Process cancellation
  processCancellation(orderId) {
    const order = this.orders.get(orderId);
    order.cancelledAt = Date.now();
    order.cancelledReason = order.notes || 'Customer request';
    order.updatedAt = Date.now();
    this.orders.set(orderId, order);
  }

  // Get order by ID
  getOrder(orderId) {
    return this.orders.get(orderId);
  }

  // Get orders by customer
  getCustomerOrders(customerId, status = null, limit = 50, offset = 0) {
    const orders = Array.from(this.orders.values())
      .filter(order => order.customerId === customerId)
      .filter(order => !status || order.status === status)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(offset, offset + limit);

    return orders;
  }

  // Get order history
  getOrderHistory(orderId) {
    return this.orderHistory.get(orderId) || [];
  }

  // Get order status description
  getStatusDescription(status) {
    return this.statusDescriptions[status] || 'Unknown status';
  }

  // Get next possible statuses
  getNextPossibleStatuses(currentStatus) {
    return this.statusFlow[currentStatus] || [];
  }

  // Cancel order
  cancelOrder(orderId, reason = '', cancelledBy = 'customer') {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Check if order can be cancelled
    if (!this.canCancelOrder(order)) {
      throw new Error('Order cannot be cancelled at this stage');
    }

    return this.updateOrderStatus(orderId, 'cancelled', reason, cancelledBy);
  }

  // Check if order can be cancelled
  canCancelOrder(order) {
    const cancellableStatuses = ['pending', 'confirmed'];
    return cancellableStatuses.includes(order.status);
  }

  // Request return
  requestReturn(orderId, itemId, reason, returnMethod = 'refund') {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Check if item can be returned
    if (!this.canReturnItem(order, itemId)) {
      throw new Error('Item cannot be returned');
    }

    const returnRequest = {
      id: this.generateId(),
      orderId,
      itemId,
      reason,
      returnMethod,
      status: 'pending',
      requestedAt: Date.now(),
      processedAt: null,
      approvedAt: null,
      rejectedAt: null,
      refundAmount: this.calculateRefundAmount(order, itemId),
      refundProcessed: false
    };

    this.returns.set(returnRequest.id, returnRequest);
    this.saveToLocalStorage('returns', this.mapToObject(this.returns));

    // Update order status
    this.updateOrderStatus(orderId, 'return_requested', `Return requested for item ${itemId}`);

    return returnRequest;
  }

  // Check if item can be returned
  canReturnItem(order, itemId) {
    const deliveredStatuses = ['delivered', 'completed'];
    const item = order.items.find(item => item.id === itemId);
    
    return deliveredStatuses.includes(order.status) && 
           item && 
           item.returnable !== false &&
           (Date.now() - order.deliveredAt) <= (30 * 24 * 60 * 60 * 1000); // 30 days
  }

  // Calculate refund amount
  calculateRefundAmount(order, itemId) {
    const item = order.items.find(item => item.id === itemId);
    return item ? item.price * item.quantity : 0;
  }

  // Process return
  processReturn(returnId, approved = true, notes = '') {
    const returnRequest = this.returns.get(returnId);
    if (!returnRequest) {
      throw new Error('Return request not found');
    }

    returnRequest.status = approved ? 'approved' : 'rejected';
    returnRequest.processedAt = Date.now();
    returnRequest.notes = notes;

    if (approved) {
      returnRequest.approvedAt = Date.now();
      this.updateOrderStatus(returnRequest.orderId, 'return_approved', `Return approved: ${notes}`);
    } else {
      returnRequest.rejectedAt = Date.now();
      this.updateOrderStatus(returnRequest.orderId, 'return_rejected', `Return rejected: ${notes}`);
    }

    this.returns.set(returnId, returnRequest);
    this.saveToLocalStorage('returns', this.mapToObject(this.returns));

    return returnRequest;
  }

  // Request exchange
  requestExchange(orderId, itemId, newItemId, reason) {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Check if item can be exchanged
    if (!this.canExchangeItem(order, itemId)) {
      throw new Error('Item cannot be exchanged');
    }

    const exchangeRequest = {
      id: this.generateId(),
      orderId,
      itemId,
      newItemId,
      reason,
      status: 'pending',
      requestedAt: Date.now(),
      processedAt: null,
      approvedAt: null,
      rejectedAt: null,
      exchangeProcessed: false,
      exchangeShipped: false,
      exchangeDelivered: false
    };

    this.exchanges.set(exchangeRequest.id, exchangeRequest);
    this.saveToLocalStorage('exchanges', this.mapToObject(this.exchanges));

    // Update order status
    this.updateOrderStatus(orderId, 'exchange_requested', `Exchange requested for item ${itemId}`);

    return exchangeRequest;
  }

  // Check if item can be exchanged
  canExchangeItem(order, itemId) {
    const deliveredStatuses = ['delivered', 'completed'];
    const item = order.items.find(item => item.id === itemId);
    
    return deliveredStatuses.includes(order.status) && 
           item && 
           item.exchangeable !== false &&
           (Date.now() - order.deliveredAt) <= (30 * 24 * 60 * 60 * 1000); // 30 days
  }

  // Process exchange
  processExchange(exchangeId, approved = true, notes = '') {
    const exchangeRequest = this.exchanges.get(exchangeId);
    if (!exchangeRequest) {
      throw new Error('Exchange request not found');
    }

    exchangeRequest.status = approved ? 'approved' : 'rejected';
    exchangeRequest.processedAt = Date.now();
    exchangeRequest.notes = notes;

    if (approved) {
      exchangeRequest.approvedAt = Date.now();
      this.updateOrderStatus(exchangeRequest.orderId, 'exchange_approved', `Exchange approved: ${notes}`);
    } else {
      exchangeRequest.rejectedAt = Date.now();
      this.updateOrderStatus(exchangeRequest.orderId, 'exchange_rejected', `Exchange rejected: ${notes}`);
    }

    this.exchanges.set(exchangeId, exchangeRequest);
    this.saveToLocalStorage('exchanges', this.mapToObject(this.exchanges));

    return exchangeRequest;
  }

  // Get customer order statistics
  getCustomerOrderStats(customerId) {
    const orders = this.getCustomerOrders(customerId);
    
    const stats = {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.totalAmount, 0) / orders.length : 0,
      statusBreakdown: {},
      returnsCount: 0,
      exchangesCount: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      pendingOrders: 0
    };

    orders.forEach(order => {
      // Status breakdown
      stats.statusBreakdown[order.status] = (stats.statusBreakdown[order.status] || 0) + 1;
      
      // Count completed/cancelled/pending
      if (order.status === 'completed') stats.completedOrders++;
      if (order.status === 'cancelled') stats.cancelledOrders++;
      if (['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery'].includes(order.status)) {
        stats.pendingOrders++;
      }
    });

    // Count returns and exchanges
    Array.from(this.returns.values()).forEach(returnRequest => {
      const order = this.orders.get(returnRequest.orderId);
      if (order && order.customerId === customerId) {
        stats.returnsCount++;
      }
    });

    Array.from(this.exchanges.values()).forEach(exchangeRequest => {
      const order = this.orders.get(exchangeRequest.orderId);
      if (order && order.customerId === customerId) {
        stats.exchangesCount++;
      }
    });

    return stats;
  }

  // Get order tracking information
  getOrderTracking(orderId) {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const history = this.getOrderHistory(orderId);
    const currentStatus = order.status;
    const nextStatuses = this.getNextPossibleStatuses(currentStatus);
    const estimatedDelivery = order.estimatedDelivery;

    return {
      order,
      currentStatus,
      statusDescription: this.getStatusDescription(currentStatus),
      nextStatuses,
      trackingNumber: order.trackingNumber,
      courier: order.courier,
      estimatedDelivery,
      history: history.sort((a, b) => b.timestamp - a.timestamp),
      canCancel: this.canCancelOrder(order),
      canReturn: order.items.some(item => this.canReturnItem(order, item.id)),
      canExchange: order.items.some(item => this.canExchangeItem(order, item.id))
    };
  }

  // Send order notification
  sendOrderNotification(orderId, type, order, data = {}) {
    const notification = {
      id: this.generateId(),
      orderId,
      type,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      title: this.getNotificationTitle(type, order),
      message: this.getNotificationMessage(type, order, data),
      data: { orderId, type, ...data },
      createdAt: Date.now(),
      sent: false,
      sentAt: null
    };

    this.notifications.set(notification.id, notification);
    
    // In production, this would send email/SMS/push notification
    console.log('🔔 Order Notification:', notification);
    
    return notification;
  }

  // Get notification title
  getNotificationTitle(type, order) {
    const titles = {
      'order_created': 'Order Confirmation',
      'status_updated': 'Order Status Update',
      'shipped': 'Order Shipped',
      'delivered': 'Order Delivered',
      'cancelled': 'Order Cancelled',
      'return_approved': 'Return Approved',
      'return_rejected': 'Return Rejected',
      'exchange_approved': 'Exchange Approved',
      'exchange_rejected': 'Exchange Rejected'
    };

    return titles[type] || 'Order Update';
  }

  // Get notification message
  getNotificationMessage(type, order, data) {
    const messages = {
      'order_created': `Your order #${order.id} has been received and is being processed.`,
      'status_updated': `Your order #${order.id} status has been updated to ${data.newStatus}.`,
      'shipped': `Your order #${order.id} has been shipped. Tracking: ${order.trackingNumber}`,
      'delivered': `Your order #${order.id} has been delivered successfully.`,
      'cancelled': `Your order #${order.id} has been cancelled. Reason: ${data.notes || 'Customer request'}`,
      'return_approved': `Your return request for order #${order.id} has been approved.`,
      'return_rejected': `Your return request for order #${order.id} has been rejected.`,
      'exchange_approved': `Your exchange request for order #${order.id} has been approved.`,
      'exchange_rejected': `Your exchange request for order #${order.id} has been rejected.`
    };

    return messages[type] || `Your order #${order.id} has been updated.`;
  }

  // Calculate estimated delivery
  calculateEstimatedDelivery() {
    const now = Date.now();
    const deliveryDays = 3 + Math.floor(Math.random() * 5); // 3-7 days
    return now + (deliveryDays * 24 * 60 * 60 * 1000);
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Generate order ID
  generateOrderId() {
    return `ORD${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
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

  // Get system statistics
  getSystemStats() {
    const orders = Array.from(this.orders.values());
    const returns = Array.from(this.returns.values());
    const exchanges = Array.from(this.exchanges.values());

    return {
      totalOrders: orders.length,
      ordersByStatus: this.getOrdersByStatus(orders),
      totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0),
      averageOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length : 0,
      totalReturns: returns.length,
      totalExchanges: exchanges.length,
      returnRate: orders.length > 0 ? (returns.length / orders.length) * 100 : 0,
      exchangeRate: orders.length > 0 ? (exchanges.length / orders.length) * 100 : 0,
      cancellationRate: orders.length > 0 ? (orders.filter(o => o.status === 'cancelled').length / orders.length) * 100 : 0
    };
  }

  // Get orders by status
  getOrdersByStatus(orders) {
    const statusCount = {};
    orders.forEach(order => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });
    return statusCount;
  }
}

module.exports = OrderTrackingSystem;
