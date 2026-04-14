// Return and Exchange System for Ethiopian Electronics Marketplace
class ReturnExchangeSystem {
  constructor() {
    this.returns = new Map();
    this.exchanges = new Map();
    this.policies = new Map();
    this.approvalQueue = [];
    this.isProcessing = false;
    this.returnHistory = new Map();
    this.exchangeHistory = new Map();
    
    this.initializePolicies();
    this.initializeFromStorage();
  }

  // Initialize return/exchange policies
  initializePolicies() {
    const policies = {
      'electronics': {
        returnPeriod: 30, // days
        exchangePeriod: 30, // days
        restockingFee: 0.1, // 10%
        conditions: [
          'Product must be in original condition',
          'All accessories must be included',
          'Original packaging required',
          'Proof of purchase required'
        ],
        nonReturnable: [
          'Software',
          'Digital downloads',
          'Personalized items',
          'Perishable items',
          'Items damaged by customer'
        ],
        exchangeRules: [
          'Only same category items can be exchanged',
          'Price difference applies',
          'One exchange per order',
          'Exchange within 30 days of delivery'
        ]
      },
      'phones': {
        returnPeriod: 14, // days
        exchangePeriod: 14, // days
        restockingFee: 0.15, // 15%
        conditions: [
          'Device must be factory reset',
          'No physical or liquid damage',
          'IMEI must match records',
          'All accessories included'
        ],
        nonReturnable: [
          'Activated devices',
          'Devices with software installed',
          'Devices with accounts logged in'
        ]
      },
      'laptops': {
        returnPeriod: 21, // days
        exchangePeriod: 21, // days
        restockingFee: 0.12, // 12%
        conditions: [
          'No software installed',
          'Factory settings restored',
          'No physical damage',
          'All peripherals included'
        ]
      },
      'accessories': {
        returnPeriod: 30, // days
        exchangePeriod: 30, // days
        restockingFee: 0.05, // 5%
        conditions: [
          'Original packaging',
          'No wear and tear',
          'All parts included'
        ]
      }
    };

    policies.forEach((policy, key) => {
      this.policies.set(key, policy);
    });
  }

  // Initialize from local storage
  initializeFromStorage() {
    const returns = this.loadFromLocalStorage('returns');
    const exchanges = this.loadFromLocalStorage('exchanges');
    const returnHistory = this.loadFromLocalStorage('return_history');
    const exchangeHistory = this.loadFromLocalStorage('exchange_history');
    
    if (returns) this.returns = new Map(Object.entries(returns));
    if (exchanges) this.exchanges = new Map(Object.entries(exchanges));
    if (returnHistory) this.returnHistory = new Map(Object.entries(returnHistory));
    if (exchangeHistory) this.exchangeHistory = new Map(Object.entries(exchangeHistory));
  }

  // Request return
  async requestReturn(orderId, itemId, reason, details, returnMethod = 'refund') {
    const returnRequest = {
      id: this.generateId(),
      orderId,
      itemId,
      reason,
      details,
      returnMethod,
      status: 'pending',
      requestedAt: Date.now(),
      processedAt: null,
      approvedAt: null,
      rejectedAt: null,
      completedAt: null,
      refundAmount: 0,
      refundProcessed: false,
      refundMethod: returnMethod,
      refundId: null,
      trackingNumber: null,
      returnAddress: null,
      customerNotes: details.customerNotes || '',
      adminNotes: '',
      images: details.images || [],
      priority: this.calculatePriority(reason),
      estimatedRefundDate: null,
      restockingFee: 0
    };

    // Validate return request
    const validation = await this.validateReturnRequest(returnRequest);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Calculate refund amount
    returnRequest.refundAmount = this.calculateRefundAmount(returnRequest);
    returnRequest.restockingFee = this.calculateRestockingFee(returnRequest);

    // Store return request
    this.returns.set(returnRequest.id, returnRequest);
    this.saveToLocalStorage('returns', this.mapToObject(this.returns));

    // Add to approval queue
    this.approvalQueue.push({
      type: 'return',
      requestId: returnRequest.id,
      priority: returnRequest.priority
    });

    // Process approval queue
    if (!this.isProcessing) {
      this.processApprovalQueue();
    }

    return returnRequest;
  }

  // Request exchange
  async requestExchange(orderId, itemId, newItemId, reason, details) {
    const exchangeRequest = {
      id: this.generateId(),
      orderId,
      itemId,
      newItemId,
      reason,
      details,
      status: 'pending',
      requestedAt: Date.now(),
      processedAt: null,
      approvedAt: null,
      rejectedAt: null,
      completedAt: null,
      priceDifference: 0,
      paymentRequired: false,
      paymentProcessed: false,
      paymentId: null,
      trackingNumber: null,
      exchangeAddress: null,
      customerNotes: details.customerNotes || '',
      adminNotes: '',
      images: details.images || [],
      priority: this.calculatePriority(reason),
      estimatedDeliveryDate: null,
      exchangeFee: 0
    };

    // Validate exchange request
    const validation = await this.validateExchangeRequest(exchangeRequest);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Calculate price difference
    exchangeRequest.priceDifference = await this.calculatePriceDifference(exchangeRequest);
    exchangeRequest.paymentRequired = exchangeRequest.priceDifference > 0;
    exchangeRequest.exchangeFee = this.calculateExchangeFee(exchangeRequest);

    // Store exchange request
    this.exchanges.set(exchangeRequest.id, exchangeRequest);
    this.saveToLocalStorage('exchanges', this.mapToObject(this.exchanges));

    // Add to approval queue
    this.approvalQueue.push({
      type: 'exchange',
      requestId: exchangeRequest.id,
      priority: exchangeRequest.priority
    });

    // Process approval queue
    if (!this.isProcessing) {
      this.processApprovalQueue();
    }

    return exchangeRequest;
  }

  // Validate return request
  async validateReturnRequest(returnRequest) {
    // Check if order exists and is delivered
    const order = await this.getOrder(returnRequest.orderId);
    if (!order) {
      return { valid: false, error: 'Order not found' };
    }

    if (!['delivered', 'completed'].includes(order.status)) {
      return { valid: false, error: 'Order must be delivered before return' };
    }

    // Check if item exists in order
    const item = order.items.find(item => item.id === returnRequest.itemId);
    if (!item) {
      return { valid: false, error: 'Item not found in order' };
    }

    // Check if item is returnable
    if (item.returnable === false) {
      return { valid: false, error: 'This item cannot be returned' };
    }

    // Check return period
    const policy = this.getPolicyForItem(item);
    const returnPeriod = policy.returnPeriod * 24 * 60 * 60 * 1000; // Convert to milliseconds
    const deliveredAt = order.deliveredAt || order.completedAt;
    
    if (Date.now() - deliveredAt > returnPeriod) {
      return { valid: false, error: `Return period of ${policy.returnPeriod} days has expired` };
    }

    // Check if already returned
    const existingReturn = this.findExistingReturn(returnRequest.orderId, returnRequest.itemId);
    if (existingReturn && !['rejected', 'cancelled'].includes(existingReturn.status)) {
      return { valid: false, error: 'Return request already exists for this item' };
    }

    return { valid: true };
  }

  // Validate exchange request
  async validateExchangeRequest(exchangeRequest) {
    // Check if order exists and is delivered
    const order = await this.getOrder(exchangeRequest.orderId);
    if (!order) {
      return { valid: false, error: 'Order not found' };
    }

    if (!['delivered', 'completed'].includes(order.status)) {
      return { valid: false, error: 'Order must be delivered before exchange' };
    }

    // Check if item exists in order
    const item = order.items.find(item => item.id === exchangeRequest.itemId);
    if (!item) {
      return { valid: false, error: 'Item not found in order' };
    }

    // Check if item is exchangeable
    if (item.exchangeable === false) {
      return { valid: false, error: 'This item cannot be exchanged' };
    }

    // Check exchange period
    const policy = this.getPolicyForItem(item);
    const exchangePeriod = policy.exchangePeriod * 24 * 60 * 60 * 1000; // Convert to milliseconds
    const deliveredAt = order.deliveredAt || order.completedAt;
    
    if (Date.now() - deliveredAt > exchangePeriod) {
      return { valid: false, error: `Exchange period of ${policy.exchangePeriod} days has expired` };
    }

    // Check if new item exists and is valid
    const newItem = await this.getProduct(exchangeRequest.newItemId);
    if (!newItem) {
      return { valid: false, error: 'New item not found' };
    }

    // Check if new item is in same category
    if (item.category !== newItem.category) {
      return { valid: false, error: 'Exchange must be within same category' };
    }

    // Check if already exchanged
    const existingExchange = this.findExistingExchange(exchangeRequest.orderId, exchangeRequest.itemId);
    if (existingExchange && !['rejected', 'cancelled'].includes(existingExchange.status)) {
      return { valid: false, error: 'Exchange request already exists for this item' };
    }

    return { valid: true };
  }

  // Process approval queue
  async processApprovalQueue() {
    this.isProcessing = true;

    // Sort by priority
    this.approvalQueue.sort((a, b) => b.priority - a.priority);

    while (this.approvalQueue.length > 0) {
      const queueItem = this.approvalQueue.shift();
      
      try {
        await this.processApproval(queueItem);
      } catch (error) {
        console.error('Error processing approval:', error);
      }
    }

    this.isProcessing = false;
  }

  // Process approval
  async processApproval(queueItem) {
    const { type, requestId } = queueItem;

    if (type === 'return') {
      await this.processReturnApproval(requestId);
    } else if (type === 'exchange') {
      await this.processExchangeApproval(requestId);
    }
  }

  // Process return approval
  async processReturnApproval(returnId) {
    const returnRequest = this.returns.get(returnId);
    if (!returnRequest) return;

    // Auto-approve for low-risk returns
    if (returnRequest.priority <= 3) {
      await this.approveReturn(returnId, 'Auto-approved for low-risk return', 'system');
    } else {
      // Manual approval required for high-risk returns
      returnRequest.status = 'awaiting_approval';
      this.returns.set(returnId, returnRequest);
    }

    this.saveToLocalStorage('returns', this.mapToObject(this.returns));
  }

  // Process exchange approval
  async processExchangeApproval(exchangeId) {
    const exchangeRequest = this.exchanges.get(exchangeId);
    if (!exchangeRequest) return;

    // Auto-approve for low-risk exchanges
    if (exchangeRequest.priority <= 3) {
      await this.approveExchange(exchangeId, 'Auto-approved for low-risk exchange', 'system');
    } else {
      // Manual approval required for high-risk exchanges
      exchangeRequest.status = 'awaiting_approval';
      this.exchanges.set(exchangeId, exchangeRequest);
    }

    this.saveToLocalStorage('exchanges', this.mapToObject(this.exchanges));
  }

  // Approve return
  async approveReturn(returnId, notes = '', approvedBy = 'admin') {
    const returnRequest = this.returns.get(returnId);
    if (!returnRequest) {
      throw new Error('Return request not found');
    }

    returnRequest.status = 'approved';
    returnRequest.processedAt = Date.now();
    returnRequest.approvedAt = Date.now();
    returnRequest.adminNotes = notes;
    returnRequest.approvedBy = approvedBy;
    returnRequest.estimatedRefundDate = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days

    // Add to history
    this.addToReturnHistory(returnId, 'approved', notes, approvedBy);

    // Send notification
    this.sendReturnNotification(returnRequest, 'approved');

    this.returns.set(returnId, returnRequest);
    this.saveToLocalStorage('returns', this.mapToObject(this.returns));

    return returnRequest;
  }

  // Reject return
  async rejectReturn(returnId, reason = '', rejectedBy = 'admin') {
    const returnRequest = this.returns.get(returnId);
    if (!returnRequest) {
      throw new Error('Return request not found');
    }

    returnRequest.status = 'rejected';
    returnRequest.processedAt = Date.now();
    returnRequest.rejectedAt = Date.now();
    returnRequest.adminNotes = reason;
    returnRequest.rejectedBy = rejectedBy;

    // Add to history
    this.addToReturnHistory(returnId, 'rejected', reason, rejectedBy);

    // Send notification
    this.sendReturnNotification(returnRequest, 'rejected');

    this.returns.set(returnId, returnRequest);
    this.saveToLocalStorage('returns', this.mapToObject(this.returns));

    return returnRequest;
  }

  // Approve exchange
  async approveExchange(exchangeId, notes = '', approvedBy = 'admin') {
    const exchangeRequest = this.exchanges.get(exchangeId);
    if (!exchangeRequest) {
      throw new Error('Exchange request not found');
    }

    exchangeRequest.status = 'approved';
    exchangeRequest.processedAt = Date.now();
    exchangeRequest.approvedAt = Date.now();
    exchangeRequest.adminNotes = notes;
    exchangeRequest.approvedBy = approvedBy;
    exchangeRequest.estimatedDeliveryDate = Date.now() + (5 * 24 * 60 * 60 * 1000); // 5 days

    // Add to history
    this.addToExchangeHistory(exchangeId, 'approved', notes, approvedBy);

    // Send notification
    this.sendExchangeNotification(exchangeRequest, 'approved');

    // Process payment if required
    if (exchangeRequest.paymentRequired) {
      await this.processExchangePayment(exchangeRequest);
    }

    this.exchanges.set(exchangeId, exchangeRequest);
    this.saveToLocalStorage('exchanges', this.mapToObject(this.exchanges));

    return exchangeRequest;
  }

  // Reject exchange
  async rejectExchange(exchangeId, reason = '', rejectedBy = 'admin') {
    const exchangeRequest = this.exchanges.get(exchangeId);
    if (!exchangeRequest) {
      throw new Error('Exchange request not found');
    }

    exchangeRequest.status = 'rejected';
    exchangeRequest.processedAt = Date.now();
    exchangeRequest.rejectedAt = Date.now();
    exchangeRequest.adminNotes = reason;
    exchangeRequest.rejectedBy = rejectedBy;

    // Add to history
    this.addToExchangeHistory(exchangeId, 'rejected', reason, rejectedBy);

    // Send notification
    this.sendExchangeNotification(exchangeRequest, 'rejected');

    this.exchanges.set(exchangeId, exchangeRequest);
    this.saveToLocalStorage('exchanges', this.mapToObject(this.exchanges));

    return exchangeRequest;
  }

  // Process return received
  async processReturnReceived(returnId, condition = 'good', notes = '') {
    const returnRequest = this.returns.get(returnId);
    if (!returnRequest) {
      throw new Error('Return request not found');
    }

    returnRequest.status = 'received';
    returnRequest.receivedAt = Date.now();
    returnRequest.condition = condition;
    returnRequest.receivedNotes = notes;

    // Add to history
    this.addToReturnHistory(returnId, 'received', notes, 'system');

    // Process refund
    await this.processRefund(returnRequest);

    this.returns.set(returnId, returnRequest);
    this.saveToLocalStorage('returns', this.mapToObject(this.returns));

    return returnRequest;
  }

  // Process refund
  async processRefund(returnRequest) {
    const refundAmount = returnRequest.refundAmount - returnRequest.restockingFee;
    
    // In production, this would integrate with payment gateway
    console.log('💰 Processing refund:', {
      returnId: returnRequest.id,
      amount: refundAmount,
      method: returnRequest.refundMethod
    });

    // Mock refund processing
    returnRequest.status = 'refund_processing';
    returnRequest.refundProcessedAt = Date.now();
    returnRequest.refundId = this.generateId();

    // Add to history
    this.addToReturnHistory(returnRequest.id, 'refund_processing', '', 'system');

    // Complete refund after processing
    setTimeout(() => {
      this.completeRefund(returnRequest.id);
    }, 3000); // 3 seconds processing time

    this.returns.set(returnRequest.id, returnRequest);
    this.saveToLocalStorage('returns', this.mapToObject(this.returns));
  }

  // Complete refund
  completeRefund(returnId) {
    const returnRequest = this.returns.get(returnId);
    if (!returnRequest) return;

    returnRequest.status = 'refunded';
    returnRequest.refundCompletedAt = Date.now();

    // Add to history
    this.addToReturnHistory(returnId, 'refunded', '', 'system');

    // Send notification
    this.sendReturnNotification(returnRequest, 'refunded');

    this.returns.set(returnId, returnRequest);
    this.saveToLocalStorage('returns', this.mapToObject(this.returns));
  }

  // Process exchange shipped
  async processExchangeShipped(exchangeId, trackingNumber) {
    const exchangeRequest = this.exchanges.get(exchangeId);
    if (!exchangeRequest) {
      throw new Error('Exchange request not found');
    }

    exchangeRequest.status = 'shipped';
    exchangeRequest.shippedAt = Date.now();
    exchangeRequest.trackingNumber = trackingNumber;

    // Add to history
    this.addToExchangeHistory(exchangeId, 'shipped', '', 'system');

    // Send notification
    this.sendExchangeNotification(exchangeRequest, 'shipped');

    this.exchanges.set(exchangeId, exchangeRequest);
    this.saveToLocalStorage('exchanges', this.mapToObject(this.exchanges));

    return exchangeRequest;
  }

  // Process exchange delivered
  async processExchangeDelivered(exchangeId) {
    const exchangeRequest = this.exchanges.get(exchangeId);
    if (!exchangeRequest) {
      throw new Error('Exchange request not found');
    }

    exchangeRequest.status = 'completed';
    exchangeRequest.completedAt = Date.now();

    // Add to history
    this.addToExchangeHistory(exchangeId, 'completed', '', 'system');

    // Send notification
    this.sendExchangeNotification(exchangeRequest, 'completed');

    this.exchanges.set(exchangeId, exchangeRequest);
    this.saveToLocalStorage('exchanges', this.mapToObject(this.exchanges));

    return exchangeRequest;
  }

  // Get policy for item
  getPolicyForItem(item) {
    // Get policy based on category
    const category = item.category.toLowerCase();
    
    // Specific category policies
    if (category.includes('phone') || category.includes('smartphone')) {
      return this.policies.get('phones');
    }
    if (category.includes('laptop') || category.includes('computer')) {
      return this.policies.get('laptops');
    }
    if (category.includes('accessory') || category.includes('case') || category.includes('cable')) {
      return this.policies.get('accessories');
    }
    
    // Default electronics policy
    return this.policies.get('electronics');
  }

  // Calculate refund amount
  calculateRefundAmount(returnRequest) {
    // In production, this would fetch actual item price
    const itemPrice = 1000; // Mock price
    return itemPrice;
  }

  // Calculate restocking fee
  calculateRestockingFee(returnRequest) {
    // In production, this would fetch actual item and policy
    const itemPrice = 1000; // Mock price
    const policy = this.policies.get('electronics');
    return itemPrice * policy.restockingFee;
  }

  // Calculate price difference
  async calculatePriceDifference(exchangeRequest) {
    // In production, this would fetch actual prices
    const oldItemPrice = 1000; // Mock old item price
    const newItemPrice = 1200; // Mock new item price
    return newItemPrice - oldItemPrice;
  }

  // Calculate exchange fee
  calculateExchangeFee(exchangeRequest) {
    // In production, this would calculate based on policy
    return 50; // Mock exchange fee
  }

  // Calculate priority based on reason
  calculatePriority(reason) {
    const highPriorityReasons = ['defective', 'wrong_item', 'damaged'];
    const mediumPriorityReasons = ['not_as_described', 'changed_mind'];
    
    if (highPriorityReasons.some(r => reason.toLowerCase().includes(r))) {
      return 1; // High priority
    }
    
    if (mediumPriorityReasons.some(r => reason.toLowerCase().includes(r))) {
      return 3; // Medium priority
    }
    
    return 5; // Low priority
  }

  // Find existing return
  findExistingReturn(orderId, itemId) {
    for (const returnRequest of this.returns.values()) {
      if (returnRequest.orderId === orderId && returnRequest.itemId === itemId) {
        return returnRequest;
      }
    }
    return null;
  }

  // Find existing exchange
  findExistingExchange(orderId, itemId) {
    for (const exchangeRequest of this.exchanges.values()) {
      if (exchangeRequest.orderId === orderId && exchangeRequest.itemId === itemId) {
        return exchangeRequest;
      }
    }
    return null;
  }

  // Add to return history
  addToReturnHistory(returnId, action, notes, updatedBy) {
    if (!this.returnHistory.has(returnId)) {
      this.returnHistory.set(returnId, []);
    }

    const history = this.returnHistory.get(returnId);
    history.push({
      action,
      notes,
      updatedBy,
      timestamp: Date.now()
    });

    this.saveToLocalStorage('return_history', this.mapToObject(this.returnHistory));
  }

  // Add to exchange history
  addToExchangeHistory(exchangeId, action, notes, updatedBy) {
    if (!this.exchangeHistory.has(exchangeId)) {
      this.exchangeHistory.set(exchangeId, []);
    }

    const history = this.exchangeHistory.get(exchangeId);
    history.push({
      action,
      notes,
      updatedBy,
      timestamp: Date.now()
    });

    this.saveToLocalStorage('exchange_history', this.mapToObject(this.exchangeHistory));
  }

  // Send return notification
  sendReturnNotification(returnRequest, action) {
    // In production, this would integrate with notification service
    console.log('🔔 Return notification:', {
      returnId: returnRequest.id,
      action,
      customerEmail: returnRequest.details.customerEmail
    });
  }

  // Send exchange notification
  sendExchangeNotification(exchangeRequest, action) {
    // In production, this would integrate with notification service
    console.log('🔔 Exchange notification:', {
      exchangeId: exchangeRequest.id,
      action,
      customerEmail: exchangeRequest.details.customerEmail
    });
  }

  // Get returns by customer
  getCustomerReturns(customerId, status = null) {
    const returns = Array.from(this.returns.values())
      .filter(returnRequest => returnRequest.details.customerId === customerId)
      .filter(returnRequest => !status || returnRequest.status === status)
      .sort((a, b) => b.requestedAt - a.requestedAt);

    return returns;
  }

  // Get exchanges by customer
  getCustomerExchanges(customerId, status = null) {
    const exchanges = Array.from(this.exchanges.values())
      .filter(exchangeRequest => exchangeRequest.details.customerId === customerId)
      .filter(exchangeRequest => !status || exchangeRequest.status === status)
      .sort((a, b) => b.requestedAt - a.requestedAt);

    return exchanges;
  }

  // Get return statistics
  getReturnStatistics() {
    const returns = Array.from(this.returns.values());
    const exchanges = Array.from(this.exchanges.values());

    return {
      totalReturns: returns.length,
      totalExchanges: exchanges.length,
      returnsByStatus: this.getStatusBreakdown(returns),
      exchangesByStatus: this.getStatusBreakdown(exchanges),
      returnsByReason: this.getReasonBreakdown(returns),
      exchangesByReason: this.getReasonBreakdown(exchanges),
      averageRefundAmount: this.calculateAverageRefund(returns),
      refundRate: this.calculateRefundRate(returns),
      exchangeRate: this.calculateExchangeRate(exchanges)
    };
  }

  // Get status breakdown
  getStatusBreakdown(items) {
    const breakdown = {};
    items.forEach(item => {
      breakdown[item.status] = (breakdown[item.status] || 0) + 1;
    });
    return breakdown;
  }

  // Get reason breakdown
  getReasonBreakdown(items) {
    const breakdown = {};
    items.forEach(item => {
      breakdown[item.reason] = (breakdown[item.reason] || 0) + 1;
    });
    return breakdown;
  }

  // Calculate average refund amount
  calculateAverageRefund(returns) {
    const approvedReturns = returns.filter(r => r.status === 'refunded');
    if (approvedReturns.length === 0) return 0;
    
    const totalRefund = approvedReturns.reduce((sum, r) => sum + r.refundAmount, 0);
    return totalRefund / approvedReturns.length;
  }

  // Calculate refund rate
  calculateRefundRate(returns) {
    const totalReturns = returns.length;
    const approvedReturns = returns.filter(r => ['approved', 'refunded'].includes(r.status)).length;
    
    return totalReturns > 0 ? (approvedReturns / totalReturns) * 100 : 0;
  }

  // Calculate exchange rate
  calculateExchangeRate(exchanges) {
    const totalExchanges = exchanges.length;
    const approvedExchanges = exchanges.filter(e => ['approved', 'completed'].includes(e.status)).length;
    
    return totalExchanges > 0 ? (approvedExchanges / totalExchanges) * 100 : 0;
  }

  // Mock methods (would integrate with actual services)
  async getOrder(orderId) {
    // Mock implementation
    return {
      id: orderId,
      status: 'delivered',
      deliveredAt: Date.now() - (10 * 24 * 60 * 60 * 1000),
      items: [
        { id: 'item1', name: 'Sample Product', price: 1000, returnable: true, exchangeable: true, category: 'electronics' }
      ]
    };
  }

  async getProduct(productId) {
    // Mock implementation
    return {
      id: productId,
      name: 'Sample Product',
      price: 1200,
      category: 'electronics'
    };
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

module.exports = ReturnExchangeSystem;
