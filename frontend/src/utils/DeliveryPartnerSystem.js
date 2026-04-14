// Delivery Partner Integration System for Ethiopian Electronics Marketplace
class DeliveryPartnerSystem {
  constructor() {
    this.partners = new Map();
    this.integrations = new Map();
    this.deliveryZones = new Map();
    this.pricingRules = new Map();
    this.deliveryQueue = [];
    this.isProcessing = false;
    this.activeDeliveries = new Map();
    this.deliveryHistory = new Map();
    
    this.initializePartners();
    this.initializeDeliveryZones();
    this.initializePricingRules();
    this.initializeFromStorage();
  }

  // Initialize delivery partners
  initializePartners() {
    const partners = {
      'ethiopian_post': {
        id: 'ethiopian_post',
        name: 'Ethiopian Post',
        type: 'national',
        coverage: ['ethiopia'],
        services: ['standard', 'express', 'international'],
        pricing: {
          'standard': { baseRate: 50, perKm: 5, minDelivery: 2, maxDelivery: 7 },
          'express': { baseRate: 100, perKm: 8, minDelivery: 1, maxDelivery: 3 },
          'international': { baseRate: 500, perKm: 15, minDelivery: 5, maxDelivery: 14 }
        },
        features: ['tracking', 'insurance', 'signature', 'cod'],
        api: {
          endpoint: 'https://api.ethiopianpost.com',
          key: 'ETH_POST_API_KEY',
          version: 'v1'
        },
        contact: {
          phone: '+251-111-111111',
          email: 'service@ethiopianpost.com',
          website: 'https://ethiopianpost.com'
        },
        workingHours: {
          monday: { open: '08:00', close: '18:00' },
          tuesday: { open: '08:00', close: '18:00' },
          wednesday: { open: '08:00', close: '18:00' },
          thursday: { open: '08:00', close: '18:00' },
          friday: { open: '08:00', close: '18:00' },
          saturday: { open: '09:00', close: '15:00' },
          sunday: { closed: true }
        },
        reliability: 0.85,
        averageRating: 4.2
      },
      'dhl_ethiopia': {
        id: 'dhl_ethiopia',
        name: 'DHL Ethiopia',
        type: 'international',
        coverage: ['ethiopia', 'international'],
        services: ['express', 'international', 'freight'],
        pricing: {
          'express': { baseRate: 150, perKm: 12, minDelivery: 1, maxDelivery: 2 },
          'international': { baseRate: 800, perKm: 20, minDelivery: 3, maxDelivery: 7 },
          'freight': { baseRate: 300, perKm: 8, minDelivery: 5, maxDelivery: 10 }
        },
        features: ['tracking', 'insurance', 'signature', 'express', 'international'],
        api: {
          endpoint: 'https://api.dhl.com',
          key: 'DHL_API_KEY',
          version: 'v2'
        },
        contact: {
          phone: '+251-115-515151',
          email: 'ethiopia@dhl.com',
          website: 'https://dhl.com/ethiopia'
        },
        workingHours: {
          monday: { open: '08:00', close: '20:00' },
          tuesday: { open: '08:00', close: '20:00' },
          wednesday: { open: '08:00', close: '20:00' },
          thursday: { open: '08:00', close: '20:00' },
          friday: { open: '08:00', close: '20:00' },
          saturday: { open: '09:00', close: '16:00' },
          sunday: { closed: true }
        },
        reliability: 0.95,
        averageRating: 4.7
      },
      'fedex_ethiopia': {
        id: 'fedex_ethiopia',
        name: 'FedEx Ethiopia',
        type: 'international',
        coverage: ['ethiopia', 'international'],
        services: ['express', 'international', 'freight'],
        pricing: {
          'express': { baseRate: 140, perKm: 11, minDelivery: 1, maxDelivery: 2 },
          'international': { baseRate: 750, perKm: 18, minDelivery: 3, maxDelivery: 6 },
          'freight': { baseRate: 280, perKm: 7, minDelivery: 4, maxDelivery: 8 }
        },
        features: ['tracking', 'insurance', 'signature', 'express', 'international'],
        api: {
          endpoint: 'https://api.fedex.com',
          key: 'FEDEX_API_KEY',
          version: 'v1'
        },
        contact: {
          phone: '+251-116-616161',
          email: 'ethiopia@fedex.com',
          website: 'https://fedex.com/ethiopia'
        },
        workingHours: {
          monday: { open: '08:00', close: '19:00' },
          tuesday: { open: '08:00', close: '19:00' },
          wednesday: { open: '08:00', close: '19:00' },
          thursday: { open: '08:00', close: '19:00' },
          friday: { open: '08:00', close: '19:00' },
          saturday: { open: '09:00', close: '15:00' },
          sunday: { closed: true }
        },
        reliability: 0.93,
        averageRating: 4.6
      },
      'local_courier_addis': {
        id: 'local_courier_addis',
        name: 'Addis Express Courier',
        type: 'local',
        coverage: ['addis_ababa', 'dire_dawa'],
        services: ['standard', 'express', 'same_day'],
        pricing: {
          'standard': { baseRate: 30, perKm: 4, minDelivery: 1, maxDelivery: 3 },
          'express': { baseRate: 60, perKm: 6, minDelivery: 0.5, maxDelivery: 1 },
          'same_day': { baseRate: 80, perKm: 8, minDelivery: 0.25, maxDelivery: 0.5 }
        },
        features: ['tracking', 'signature', 'same_day', 'local'],
        api: {
          endpoint: 'https://api.addisexpress.com',
          key: 'ADDIS_EXPRESS_API_KEY',
          version: 'v1'
        },
        contact: {
          phone: '+251-911-123456',
          email: 'service@addisexpress.com',
          website: 'https://addisexpress.com'
        },
        workingHours: {
          monday: { open: '07:00', close: '22:00' },
          tuesday: { open: '07:00', close: '22:00' },
          wednesday: { open: '07:00', close: '22:00' },
          thursday: { open: '07:00', close: '22:00' },
          friday: { open: '07:00', close: '22:00' },
          saturday: { open: '08:00', close: '20:00' },
          sunday: { open: '09:00', close: '18:00' }
        },
        reliability: 0.88,
        averageRating: 4.3
      },
      'moto_delivery': {
        id: 'moto_delivery',
        name: 'Moto Delivery Ethiopia',
        type: 'local',
        coverage: ['addis_ababa'],
        services: ['express', 'same_day', 'instant'],
        pricing: {
          'express': { baseRate: 40, perKm: 5, minDelivery: 0.5, maxDelivery: 2 },
          'same_day': { baseRate: 70, perKm: 7, minDelivery: 0.25, maxDelivery: 0.5 },
          'instant': { baseRate: 100, perKm: 10, minDelivery: 0.1, maxDelivery: 0.25 }
        },
        features: ['tracking', 'instant', 'motorcycle', 'local'],
        api: {
          endpoint: 'https://api.motodelivery.com',
          key: 'MOTO_DELIVERY_API_KEY',
          version: 'v1'
        },
        contact: {
          phone: '+251-912-345678',
          email: 'service@motodelivery.com',
          website: 'https://motodelivery.com'
        },
        workingHours: {
          monday: { open: '06:00', close: '23:00' },
          tuesday: { open: '06:00', close: '23:00' },
          wednesday: { open: '06:00', close: '23:00' },
          thursday: { open: '06:00', close: '23:00' },
          friday: { open: '06:00', close: '23:00' },
          saturday: { open: '07:00', close: '22:00' },
          sunday: { open: '08:00', close: '20:00' }
        },
        reliability: 0.82,
        averageRating: 4.1
      }
    };

    partners.forEach((partner, key) => {
      this.partners.set(key, partner);
    });
  }

  // Initialize delivery zones
  initializeDeliveryZones() {
    const zones = {
      'addis_ababa': {
        id: 'addis_ababa',
        name: 'Addis Ababa',
        type: 'city',
        coordinates: { lat: 9.1450, lng: 40.4897 },
        radius: 50, // km
        priority: 1,
        baseFee: 30,
        partners: ['ethiopian_post', 'local_courier_addis', 'moto_delivery'],
        timeSlots: [
          { start: '08:00', end: '12:00', available: true },
          { start: '12:00', end: '16:00', available: true },
          { start: '16:00', end: '20:00', available: true }
        ]
      },
      'dire_dawa': {
        id: 'dire_dawa',
        name: 'Dire Dawa',
        type: 'city',
        coordinates: { lat: 9.5944, lng: 41.8661 },
        radius: 30,
        priority: 2,
        baseFee: 50,
        partners: ['ethiopian_post', 'local_courier_addis'],
        timeSlots: [
          { start: '09:00', end: '13:00', available: true },
          { start: '13:00', end: '17:00', available: true }
        ]
      },
      'mekelle': {
        id: 'mekelle',
        name: 'Mekelle',
        type: 'city',
        coordinates: { lat: 13.4967, lng: 39.4733 },
        radius: 25,
        priority: 3,
        baseFee: 80,
        partners: ['ethiopian_post', 'dhl_ethiopia'],
        timeSlots: [
          { start: '09:00', end: '13:00', available: true },
          { start: '13:00', end: '17:00', available: true }
        ]
      },
      'bahir_dar': {
        id: 'bahir_dar',
        name: 'Bahir Dar',
        type: 'city',
        coordinates: { lat: 11.5761, lng: 37.3617 },
        radius: 25,
        priority: 4,
        baseFee: 75,
        partners: ['ethiopian_post', 'dhl_ethiopia'],
        timeSlots: [
          { start: '09:00', end: '13:00', available: true },
          { start: '13:00', end: '17:00', available: true }
        ]
      },
      'gondar': {
        id: 'gondar',
        name: 'Gondar',
        type: 'city',
        coordinates: { lat: 12.6000, lng: 37.4667 },
        radius: 20,
        priority: 5,
        baseFee: 90,
        partners: ['ethiopian_post'],
        timeSlots: [
          { start: '09:00', end: '13:00', available: true },
          { start: '13:00', end: '17:00', available: true }
        ]
      },
      'hawassa': {
        id: 'hawassa',
        name: 'Hawassa',
        type: 'city',
        coordinates: { lat: 7.0583, lng: 38.4667 },
        radius: 20,
        priority: 6,
        baseFee: 85,
        partners: ['ethiopian_post'],
        timeSlots: [
          { start: '09:00', end: '13:00', available: true },
          { start: '13:00', end: '17:00', available: true }
        ]
      },
      'rural_ethiopia': {
        id: 'rural_ethiopia',
        name: 'Rural Ethiopia',
        type: 'region',
        coordinates: { lat: 9.1450, lng: 40.4897 },
        radius: 500,
        priority: 10,
        baseFee: 150,
        partners: ['ethiopian_post'],
        timeSlots: [
          { start: '09:00', end: '13:00', available: true },
          { start: '13:00', end: '17:00', available: true }
        ]
      }
    };

    zones.forEach((zone, key) => {
      this.deliveryZones.set(key, zone);
    });
  }

  // Initialize pricing rules
  initializePricingRules() {
    const rules = {
      'weight_based': {
        enabled: true,
        tiers: [
          { maxWeight: 1, multiplier: 1.0 },
          { maxWeight: 5, multiplier: 1.2 },
          { maxWeight: 10, multiplier: 1.5 },
          { maxWeight: 20, multiplier: 2.0 },
          { maxWeight: Infinity, multiplier: 2.5 }
        ]
      },
      'distance_based': {
        enabled: true,
        tiers: [
          { maxDistance: 5, multiplier: 1.0 },
          { maxDistance: 10, multiplier: 1.1 },
          { maxDistance: 25, multiplier: 1.2 },
          { maxDistance: 50, multiplier: 1.3 },
          { maxDistance: 100, multiplier: 1.5 },
          { maxDistance: Infinity, multiplier: 2.0 }
        ]
      },
      'size_based': {
        enabled: true,
        tiers: [
          { maxSize: 'small', multiplier: 1.0 },
          { maxSize: 'medium', multiplier: 1.3 },
          { maxSize: 'large', multiplier: 1.6 },
          { maxSize: 'xlarge', multiplier: 2.0 },
          { maxSize: 'xxlarge', multiplier: 2.5 }
        ]
      },
      'value_based': {
        enabled: true,
        tiers: [
          { maxValue: 1000, multiplier: 1.0 },
          { maxValue: 5000, multiplier: 1.1 },
          { maxValue: 10000, multiplier: 1.2 },
          { maxValue: 25000, multiplier: 1.3 },
          { maxValue: 50000, multiplier: 1.4 },
          { maxValue: Infinity, multiplier: 1.5 }
        ]
      },
      'time_based': {
        enabled: true,
        multipliers: {
          'standard': 1.0,
          'express': 1.5,
          'same_day': 2.0,
          'instant': 3.0
        }
      },
      'insurance': {
        enabled: true,
        rate: 0.02, // 2% of declared value
        mandatoryValue: 10000, // Mandatory insurance above 10,000 ETB
        coverage: ['loss', 'damage', 'theft']
      },
      'cod': {
        enabled: true,
        fee: 0.03, // 3% of order value
        minFee: 50, // Minimum 50 ETB
        maxFee: 500 // Maximum 500 ETB
      }
    };

    rules.forEach((rule, key) => {
      this.pricingRules.set(key, rule);
    });
  }

  // Initialize from local storage
  initializeFromStorage() {
    const partners = this.loadFromLocalStorage('delivery_partners');
    const activeDeliveries = this.loadFromLocalStorage('active_deliveries');
    const deliveryHistory = this.loadFromLocalStorage('delivery_history');
    
    if (partners) this.partners = new Map(Object.entries(partners));
    if (activeDeliveries) this.activeDeliveries = new Map(Object.entries(activeDeliveries));
    if (deliveryHistory) this.deliveryHistory = new Map(Object.entries(deliveryHistory));
  }

  // Get available delivery partners
  getAvailablePartners(pickupLocation, deliveryLocation, options = {}) {
    const availablePartners = [];
    
    // Find delivery zone
    const deliveryZone = this.findDeliveryZone(deliveryLocation);
    if (!deliveryZone) {
      return this.partners.get('ethiopian_post') ? [this.partners.get('ethiopian_post')] : [];
    }

    // Filter partners by zone
    deliveryZone.partners.forEach(partnerId => {
      const partner = this.partners.get(partnerId);
      if (partner) {
        // Check if partner supports requested service
        if (!options.service || partner.services.includes(options.service)) {
          availablePartners.push({
            ...partner,
            estimatedCost: this.calculateDeliveryCost(partner, pickupLocation, deliveryLocation, options),
            estimatedTime: this.calculateDeliveryTime(partner, pickupLocation, deliveryLocation, options),
            reliability: partner.reliability,
            rating: partner.averageRating
          });
        }
      }
    });

    // Sort by cost and reliability
    return availablePartners.sort((a, b) => {
      const scoreA = (a.reliability * 0.6) + (b.rating / 5 * 0.4);
      const scoreB = (b.reliability * 0.6) + (a.rating / 5 * 0.4);
      return scoreB - scoreA;
    });
  }

  // Calculate delivery cost
  calculateDeliveryCost(partner, pickupLocation, deliveryLocation, options = {}) {
    const { service = 'standard', weight = 1, size = 'medium', value = 1000 } = options;
    const pricing = partner.pricing[service];
    
    if (!pricing) {
      throw new Error(`Service ${service} not available for partner ${partner.name}`);
    }

    // Calculate distance
    const distance = this.calculateDistance(pickupLocation, deliveryLocation);
    
    // Base calculation
    let cost = pricing.baseRate + (pricing.perKm * distance);
    
    // Apply weight multiplier
    if (this.pricingRules.get('weight_based').enabled) {
      const weightMultiplier = this.getWeightMultiplier(weight);
      cost *= weightMultiplier;
    }
    
    // Apply distance multiplier
    if (this.pricingRules.get('distance_based').enabled) {
      const distanceMultiplier = this.getDistanceMultiplier(distance);
      cost *= distanceMultiplier;
    }
    
    // Apply size multiplier
    if (this.pricingRules.get('size_based').enabled) {
      const sizeMultiplier = this.getSizeMultiplier(size);
      cost *= sizeMultiplier;
    }
    
    // Apply value multiplier
    if (this.pricingRules.get('value_based').enabled) {
      const valueMultiplier = this.getValueMultiplier(value);
      cost *= valueMultiplier;
    }
    
    // Apply time multiplier
    if (this.pricingRules.get('time_based').enabled) {
      const timeMultiplier = this.pricingRules.get('time_based').multipliers[service] || 1.0;
      cost *= timeMultiplier;
    }
    
    // Add insurance cost
    if (options.insurance && this.pricingRules.get('insurance').enabled) {
      const insuranceRule = this.pricingRules.get('insurance');
      if (value > insuranceRule.mandatoryValue || options.insurance === 'required') {
        cost += value * insuranceRule.rate;
      }
    }
    
    // Add COD fee
    if (options.cod && this.pricingRules.get('cod').enabled) {
      const codRule = this.pricingRules.get('cod');
      const codFee = Math.max(codRule.minFee, Math.min(codRule.maxFee, value * codRule.fee));
      cost += codFee;
    }
    
    return Math.round(cost);
  }

  // Calculate delivery time
  calculateDeliveryTime(partner, pickupLocation, deliveryLocation, options = {}) {
    const { service = 'standard' } = options;
    const pricing = partner.pricing[service];
    
    if (!pricing) {
      return { min: 7, max: 14, unit: 'days' };
    }
    
    // Calculate distance
    const distance = this.calculateDistance(pickupLocation, deliveryLocation);
    
    // Base delivery time
    let minTime = pricing.minDelivery;
    let maxTime = pricing.maxDelivery;
    
    // Adjust for distance
    if (distance > 100) {
      minTime += 1;
      maxTime += 2;
    } else if (distance > 50) {
      minTime += 0.5;
      maxTime += 1;
    }
    
    // Adjust for working hours
    const workingHours = this.getWorkingHours(partner);
    const now = new Date();
    const currentHour = now.getHours();
    
    if (!this.isWithinWorkingHours(currentHour, workingHours)) {
      minTime += 0.5;
      maxTime += 1;
    }
    
    // Adjust for weekends
    const dayOfWeek = now.getDay();
    if (dayOfWeek === 0) { // Sunday
      minTime += 1;
      maxTime += 1;
    }
    
    return {
      min: Math.ceil(minTime),
      max: Math.ceil(maxTime),
      unit: pricing.minDelivery <= 1 ? 'hours' : 'days'
    };
  }

  // Get available time slots
  getAvailableTimeSlots(partnerId, date, options = {}) {
    const partner = this.partners.get(partnerId);
    if (!partner) {
      return [];
    }

    const workingHours = partner.workingHours;
    const dayOfWeek = date.getDay();
    const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek];
    const daySchedule = workingHours[dayName];

    if (!daySchedule || daySchedule.closed) {
      return [];
    }

    const timeSlots = [];
    const { open, close } = daySchedule;
    
    if (open && close) {
      const [openHour, openMinute] = open.split(':').map(Number);
      const [closeHour, closeMinute] = close.split(':').map(Number);
      
      const startMinutes = openHour * 60 + openMinute;
      const endMinutes = closeHour * 60 + closeMinute;
      const slotDuration = 60; // 1 hour slots
      
      for (let time = startMinutes; time < endMinutes - 30; time += slotDuration) {
        const slotStart = this.formatTime(time);
        const slotEnd = this.formatTime(Math.min(time + slotDuration, endMinutes));
        
        timeSlots.push({
          start: slotStart,
          end: slotEnd,
          available: true,
          capacity: 10 // Mock capacity
        });
      }
    }

    return timeSlots;
  }

  // Create delivery booking
  async createDeliveryBooking(bookingData) {
    const {
      orderId,
      pickupLocation,
      deliveryLocation,
      partnerId,
      service,
      timeSlot,
      packageInfo,
      options = {}
    } = bookingData;

    const partner = this.partners.get(partnerId);
    if (!partner) {
      throw new Error('Delivery partner not found');
    }

    const booking = {
      id: this.generateId(),
      orderId,
      partnerId,
      partnerName: partner.name,
      pickupLocation,
      deliveryLocation,
      service,
      timeSlot,
      packageInfo,
      options,
      cost: this.calculateDeliveryCost(partner, pickupLocation, deliveryLocation, { service, ...packageInfo, ...options }),
      estimatedTime: this.calculateDeliveryTime(partner, pickupLocation, deliveryLocation, { service }),
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      trackingNumber: null,
      pickupAt: null,
      deliveredAt: null,
      notes: '',
      customerInfo: bookingData.customerInfo,
      paymentStatus: 'pending',
      insurance: options.insurance || false,
      cod: options.cod || false
    };

    // Add to queue
    this.deliveryQueue.push(booking);
    
    // Process queue
    if (!this.isProcessing) {
      this.processDeliveryQueue();
    }

    return booking;
  }

  // Process delivery queue
  async processDeliveryQueue() {
    this.isProcessing = true;

    while (this.deliveryQueue.length > 0) {
      const booking = this.deliveryQueue.shift();
      
      try {
        await this.processDeliveryBooking(booking);
      } catch (error) {
        console.error('Error processing delivery booking:', error);
        booking.status = 'failed';
        booking.error = error.message;
        this.activeDeliveries.set(booking.id, booking);
      }
    }

    this.isProcessing = false;
  }

  // Process individual delivery booking
  async processDeliveryBooking(booking) {
    const partner = this.partners.get(booking.partnerId);
    
    // Create booking with partner API
    const partnerBooking = await this.createPartnerBooking(booking, partner);
    
    // Update booking with partner response
    booking.status = 'confirmed';
    booking.trackingNumber = partnerBooking.trackingNumber;
    booking.partnerBookingId = partnerBooking.id;
    booking.updatedAt = Date.now();
    
    // Store active delivery
    this.activeDeliveries.set(booking.id, booking);
    this.saveToLocalStorage('active_deliveries', this.mapToObject(this.activeDeliveries));

    return booking;
  }

  // Create booking with partner API
  async createPartnerBooking(booking, partner) {
    // In production, this would integrate with partner's API
    console.log(`📦 Creating booking with ${partner.name}:`, booking);
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: this.generateId(),
          trackingNumber: this.generateTrackingNumber(partner.id),
          status: 'confirmed',
          estimatedDelivery: booking.estimatedTime
        });
      }, 2000);
    });
  }

  // Track delivery
  async trackDelivery(deliveryId) {
    const delivery = this.activeDeliveries.get(deliveryId);
    if (!delivery) {
      throw new Error('Delivery not found');
    }

    // Get tracking from partner
    const tracking = await this.getPartnerTracking(delivery);
    
    // Update delivery status
    if (tracking.status !== delivery.status) {
      delivery.status = tracking.status;
      delivery.updatedAt = Date.now();
      
      if (tracking.status === 'delivered') {
        delivery.deliveredAt = Date.now();
        this.completeDelivery(deliveryId);
      }
      
      this.activeDeliveries.set(deliveryId, delivery);
      this.saveToLocalStorage('active_deliveries', this.mapToObject(this.activeDeliveries));
    }

    return {
      delivery,
      tracking,
      history: this.getDeliveryHistory(deliveryId)
    };
  }

  // Get tracking from partner
  async getPartnerTracking(delivery) {
    const partner = this.partners.get(delivery.partnerId);
    
    // In production, this would integrate with partner's tracking API
    console.log(`📦 Getting tracking from ${partner.name}:`, delivery.trackingNumber);
    
    // Mock implementation
    const statuses = ['picked_up', 'in_transit', 'out_for_delivery', 'delivered'];
    const currentStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      trackingNumber: delivery.trackingNumber,
      status: currentStatus,
      location: this.generateMockLocation(delivery),
      timestamp: Date.now(),
      estimatedDelivery: delivery.estimatedTime
    };
  }

  // Complete delivery
  completeDelivery(deliveryId) {
    const delivery = this.activeDeliveries.get(deliveryId);
    if (!delivery) return;

    delivery.status = 'completed';
    delivery.completedAt = Date.now();
    
    // Move to history
    this.deliveryHistory.set(deliveryId, delivery);
    this.activeDeliveries.delete(deliveryId);
    
    this.saveToLocalStorage('active_deliveries', this.mapToObject(this.activeDeliveries));
    this.saveToLocalStorage('delivery_history', this.mapToObject(this.deliveryHistory));
  }

  // Cancel delivery
  async cancelDelivery(deliveryId, reason = '') {
    const delivery = this.activeDeliveries.get(deliveryId);
    if (!delivery) {
      throw new Error('Delivery not found');
    }

    if (['picked_up', 'in_transit', 'out_for_delivery'].includes(delivery.status)) {
      throw new Error('Cannot cancel delivery after pickup');
    }

    delivery.status = 'cancelled';
    delivery.cancelledAt = Date.now();
    delivery.cancelReason = reason;
    
    // Cancel with partner
    await this.cancelPartnerBooking(delivery);
    
    this.activeDeliveries.set(deliveryId, delivery);
    this.saveToLocalStorage('active_deliveries', this.mapToObject(this.activeDeliveries));

    return delivery;
  }

  // Cancel booking with partner
  async cancelPartnerBooking(delivery) {
    const partner = this.partners.get(delivery.partnerId);
    
    // In production, this would integrate with partner's API
    console.log(`📦 Cancelling booking with ${partner.name}:`, delivery.partnerBookingId);
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ cancelled: true });
      }, 1000);
    });
  }

  // Helper methods
  findDeliveryZone(location) {
    for (const zone of this.deliveryZones.values()) {
      if (this.isInZone(location, zone)) {
        return zone;
      }
    }
    return this.deliveryZones.get('rural_ethiopia');
  }

  isInZone(location, zone) {
    const distance = this.calculateDistance(location, zone.coordinates);
    return distance <= zone.radius;
  }

  calculateDistance(point1, point2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLon = this.toRadians(point2.lng - point1.lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  getWeightMultiplier(weight) {
    const tiers = this.pricingRules.get('weight_based').tiers;
    for (const tier of tiers) {
      if (weight <= tier.maxWeight) {
        return tier.multiplier;
      }
    }
    return 2.5;
  }

  getDistanceMultiplier(distance) {
    const tiers = this.pricingRules.get('distance_based').tiers;
    for (const tier of tiers) {
      if (distance <= tier.maxDistance) {
        return tier.multiplier;
      }
    }
    return 2.0;
  }

  getSizeMultiplier(size) {
    const tiers = this.pricingRules.get('size_based').tiers;
    for (const tier of tiers) {
      if (size === tier.maxSize) {
        return tier.multiplier;
      }
    }
    return 2.5;
  }

  getValueMultiplier(value) {
    const tiers = this.pricingRules.get('value_based').tiers;
    for (const tier of tiers) {
      if (value <= tier.maxValue) {
        return tier.multiplier;
      }
    }
    return 1.5;
  }

  getWorkingHours(partner) {
    const today = new Date();
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today.getDay()];
    return partner.workingHours[dayOfWeek];
  }

  isWithinWorkingHours(hour, workingHours) {
    if (!workingHours || workingHours.closed) return false;
    
    const [openHour] = workingHours.open.split(':').map(Number);
    const [closeHour] = workingHours.close.split(':').map(Number);
    
    return hour >= openHour && hour < closeHour;
  }

  formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  generateTrackingNumber(partnerId) {
    const prefix = partnerId.toUpperCase().substring(0, 3);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${random}`;
  }

  generateMockLocation(delivery) {
    const locations = [
      'Addis Ababa Distribution Center',
      'Dire Dawa Hub',
      'Mekelle Facility',
      'Bahir Dar Warehouse',
      'Gondar Depot',
      'In Transit',
      'Local Delivery Hub'
    ];
    
    return locations[Math.floor(Math.random() * locations.length)];
  }

  getDeliveryHistory(deliveryId) {
    const history = this.deliveryHistory.get(deliveryId);
    if (history) {
      return [history];
    }
    
    const activeDelivery = this.activeDeliveries.get(deliveryId);
    if (activeDelivery) {
      return [activeDelivery];
    }
    
    return [];
  }

  // Get delivery statistics
  getDeliveryStatistics() {
    const activeDeliveries = Array.from(this.activeDeliveries.values());
    const history = Array.from(this.deliveryHistory.values());
    
    return {
      totalDeliveries: activeDeliveries.length + history.length,
      activeDeliveries: activeDeliveries.length,
      completedDeliveries: history.length,
      deliveriesByPartner: this.getDeliveriesByPartner(activeDeliveries, history),
      deliveriesByService: this.getDeliveriesByService(activeDeliveries, history),
      averageDeliveryTime: this.calculateAverageDeliveryTime(history),
      onTimeDeliveryRate: this.calculateOnTimeDeliveryRate(history),
      averageCost: this.calculateAverageCost(activeDeliveries, history)
    };
  }

  getDeliveriesByPartner(active, history) {
    const allDeliveries = [...active, ...history];
    const breakdown = {};
    
    allDeliveries.forEach(delivery => {
      breakdown[delivery.partnerName] = (breakdown[delivery.partnerName] || 0) + 1;
    });
    
    return breakdown;
  }

  getDeliveriesByService(active, history) {
    const allDeliveries = [...active, ...history];
    const breakdown = {};
    
    allDeliveries.forEach(delivery => {
      breakdown[delivery.service] = (breakdown[delivery.service] || 0) + 1;
    });
    
    return breakdown;
  }

  calculateAverageDeliveryTime(history) {
    if (history.length === 0) return 0;
    
    const totalTime = history.reduce((sum, delivery) => {
      if (delivery.deliveredAt && delivery.createdAt) {
        return sum + (delivery.deliveredAt - delivery.createdAt);
      }
      return sum;
    }, 0);
    
    return totalTime / history.length;
  }

  calculateOnTimeDeliveryRate(history) {
    if (history.length === 0) return 0;
    
    const onTimeDeliveries = history.filter(delivery => {
      // Mock on-time calculation
      return Math.random() > 0.1; // 90% on-time rate
    }).length;
    
    return (onTimeDeliveries / history.length) * 100;
  }

  calculateAverageCost(active, history) {
    const allDeliveries = [...active, ...history];
    if (allDeliveries.length === 0) return 0;
    
    const totalCost = allDeliveries.reduce((sum, delivery) => sum + delivery.cost, 0);
    return totalCost / allDeliveries.length;
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

  mapToObject(map) {
    const obj = {};
    for (const [key, value] of map.entries()) {
      obj[key] = value;
    }
    return obj;
  }
}

module.exports = DeliveryPartnerSystem;
