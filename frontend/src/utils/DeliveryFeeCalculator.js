// Delivery Fee Calculation System for Ethiopian Electronics Marketplace
class DeliveryFeeCalculator {
  constructor() {
    this.baseRates = new Map();
    this.zones = new Map();
    this.multipliers = new Map();
    this.discounts = new Map();
    this.specialRules = new Map();
    
    this.initializeBaseRates();
    this.initializeZones();
    this.initializeMultipliers();
    this.initializeDiscounts();
    this.initializeSpecialRules();
  }

  // Initialize base rates for different areas
  initializeBaseRates() {
    const baseRates = {
      'addis_ababa': {
        id: 'addis_ababa',
        name: 'Addis Ababa',
        baseRate: 30,
        perKmRate: 5,
        minimumFee: 30,
        maximumFee: 500,
        freeDeliveryThreshold: 500,
        sameDayFee: 80,
        expressFee: 60,
        priorityFee: 100
      },
      'dire_dawa': {
        id: 'dire_dawa',
        name: 'Dire Dawa',
        baseRate: 50,
        perKmRate: 7,
        minimumFee: 50,
        maximumFee: 800,
        freeDeliveryThreshold: 800,
        sameDayFee: 120,
        expressFee: 90,
        priorityFee: 150
      },
      'mekelle': {
        id: 'mekelle',
        name: 'Mekelle',
        baseRate: 80,
        perKmRate: 10,
        minimumFee: 80,
        maximumFee: 1200,
        freeDeliveryThreshold: 1000,
        sameDayFee: 150,
        expressFee: 120,
        priorityFee: 200
      },
      'bahir_dar': {
        id: 'bahir_dar',
        name: 'Bahir Dar',
        baseRate: 75,
        perKmRate: 9,
        minimumFee: 75,
        maximumFee: 1000,
        freeDeliveryThreshold: 900,
        sameDayFee: 140,
        expressFee: 110,
        priorityFee: 180
      },
      'gondar': {
        id: 'gondar',
        name: 'Gondar',
        baseRate: 90,
        perKmRate: 12,
        minimumFee: 90,
        maximumFee: 1500,
        freeDeliveryThreshold: 1200,
        sameDayFee: 160,
        expressFee: 130,
        priorityFee: 220
      },
      'hawassa': {
        id: 'hawassa',
        name: 'Hawassa',
        baseRate: 85,
        perKmRate: 11,
        minimumFee: 85,
        maximumFee: 1300,
        freeDeliveryThreshold: 1100,
        sameDayFee: 155,
        expressFee: 125,
        priorityFee: 210
      },
      'jimma': {
        id: 'jimma',
        name: 'Jimma',
        baseRate: 100,
        perKmRate: 15,
        minimumFee: 100,
        maximumFee: 1800,
        freeDeliveryThreshold: 1500,
        sameDayFee: 180,
        expressFee: 150,
        priorityFee: 250
      },
      'adama': {
        id: 'adama',
        name: 'Adama',
        baseRate: 70,
        perKmRate: 8,
        minimumFee: 70,
        maximumFee: 1100,
        freeDeliveryThreshold: 1000,
        sameDayFee: 130,
        expressFee: 100,
        priorityFee: 170
      },
      'shashamene': {
        id: 'shashamene',
        name: 'Shashamene',
        baseRate: 95,
        perKmRate: 14,
        minimumFee: 95,
        maximumFee: 1600,
        freeDeliveryThreshold: 1400,
        sameDayFee: 170,
        expressFee: 140,
        priorityFee: 230
      },
      'nazeret': {
        id: 'nazeret',
        name: 'Nazeret',
        baseRate: 85,
        perKmRate: 11,
        minimumFee: 85,
        maximumFee: 1300,
        freeDeliveryThreshold: 1100,
        sameDayFee: 155,
        expressFee: 125,
        priorityFee: 210
      },
      'rural_ethiopia': {
        id: 'rural_ethiopia',
        name: 'Rural Ethiopia',
        baseRate: 150,
        perKmRate: 20,
        minimumFee: 150,
        maximumFee: 2500,
        freeDeliveryThreshold: 2000,
        sameDayFee: 250,
        expressFee: 200,
        priorityFee: 300
      }
    };

    baseRates.forEach((rate, key) => {
      this.baseRates.set(key, rate);
    });
  }

  // Initialize delivery zones
  initializeZones() {
    const zones = {
      'zone_1': {
        id: 'zone_1',
        name: 'Central Ethiopia',
        cities: ['addis_ababa', 'adama', 'shashamene', 'nazeret'],
        baseMultiplier: 1.0,
        priority: 1
      },
      'zone_2': {
        id: 'zone_2',
        name: 'Northern Ethiopia',
        cities: ['mekelle', 'gondar', 'bahir_dar'],
        baseMultiplier: 1.2,
        priority: 2
      },
      'zone_3': {
        id: 'zone_3',
        name: 'Southern Ethiopia',
        cities: ['hawassa', 'jimma', 'arbaminch'],
        baseMultiplier: 1.3,
        priority: 3
      },
      'zone_4': {
        id: 'zone_4',
        name: 'Eastern Ethiopia',
        cities: ['dire_dawa', 'harar', 'jijiga'],
        baseMultiplier: 1.4,
        priority: 4
      },
      'zone_5': {
        id: 'zone_5',
        name: 'Western Ethiopia',
        cities: ['gambela', 'assosa', 'metekel'],
        baseMultiplier: 1.5,
        priority: 5
      }
    };

    zones.forEach((zone, key) => {
      this.zones.set(key, zone);
    });
  }

  // Initialize multipliers
  initializeMultipliers() {
    const multipliers = {
      'weight': {
        'light': { maxWeight: 1, multiplier: 1.0 },
        'medium': { maxWeight: 5, multiplier: 1.2 },
        'heavy': { maxWeight: 10, multiplier: 1.5 },
        'extra_heavy': { maxWeight: 20, multiplier: 2.0 },
        'oversized': { maxWeight: Infinity, multiplier: 2.5 }
      },
      'size': {
        'small': { dimensions: { length: 30, width: 20, height: 10 }, multiplier: 1.0 },
        'medium': { dimensions: { length: 50, width: 40, height: 30 }, multiplier: 1.3 },
        'large': { dimensions: { length: 80, width: 60, height: 50 }, multiplier: 1.6 },
        'extra_large': { dimensions: { length: 120, width: 80, height: 70 }, multiplier: 2.0 },
        'oversized': { dimensions: { length: Infinity, width: Infinity, height: Infinity }, multiplier: 2.5 }
      },
      'value': {
        'low': { maxValue: 1000, multiplier: 1.0 },
        'medium': { maxValue: 5000, multiplier: 1.1 },
        'high': { maxValue: 10000, multiplier: 1.2 },
        'premium': { maxValue: 25000, multiplier: 1.3 },
        'luxury': { maxValue: 50000, multiplier: 1.4 },
        'ultra_luxury': { maxValue: Infinity, multiplier: 1.5 }
      },
      'urgency': {
        'standard': { multiplier: 1.0 },
        'express': { multiplier: 1.5 },
        'same_day': { multiplier: 2.0 },
        'priority': { multiplier: 2.5 },
        'instant': { multiplier: 3.0 }
      },
      'time': {
        'morning': { hours: [6, 12], multiplier: 0.9 },
        'afternoon': { hours: [12, 18], multiplier: 1.0 },
        'evening': { hours: [18, 22], multiplier: 1.1 },
        'night': { hours: [22, 6], multiplier: 1.3 },
        'weekend': { multiplier: 1.2 },
        'holiday': { multiplier: 1.5 }
      },
      'distance': {
        'local': { maxDistance: 5, multiplier: 1.0 },
        'short': { maxDistance: 25, multiplier: 1.1 },
        'medium': { maxDistance: 50, multiplier: 1.2 },
        'long': { maxDistance: 100, multiplier: 1.3 },
        'very_long': { maxDistance: 250, multiplier: 1.5 },
        'extreme': { maxDistance: Infinity, multiplier: 2.0 }
      }
    };

    multipliers.forEach((multiplier, key) => {
      this.multipliers.set(key, multiplier);
    });
  }

  // Initialize discounts
  initializeDiscounts() {
    const discounts = {
      'loyalty': {
        'bronze': { minOrders: 1, discount: 0.05 },
        'silver': { minOrders: 5, discount: 0.10 },
        'gold': { minOrders: 10, discount: 0.15 },
        'platinum': { minOrders: 25, discount: 0.20 },
        'diamond': { minOrders: 50, discount: 0.25 }
      },
      'volume': {
        'small': { minOrders: 1, discount: 0.05 },
        'medium': { minOrders: 5, discount: 0.10 },
        'large': { minOrders: 10, discount: 0.15 },
        'enterprise': { minOrders: 25, discount: 0.20 }
      },
      'seasonal': {
        'new_year': { discount: 0.15, validFrom: '2024-01-01', validTo: '2024-01-15' },
        'eid_al_fitr': { discount: 0.10, validFrom: '2024-04-10', validTo: '2024-04-15' },
        'eid_al_adha': { discount: 0.10, validFrom: '2024-06-17', validTo: '2024-06-22' },
        'christmas': { discount: 0.12, validFrom: '2024-12-20', validTo: '2024-12-31' },
        'meskel': { discount: 0.08, validFrom: '2024-09-27', validTo: '2024-09-30' },
        'timkat': { discount: 0.08, validFrom: '2024-01-19', validTo: '2024-01-20' }
      },
      'promotional': {
        'first_order': { discount: 0.20, maxDiscount: 100 },
        'friend_referral': { discount: 0.15, maxDiscount: 75 },
        'bulk_order': { minItems: 5, discount: 0.10, maxDiscount: 200 },
        'student_discount': { discount: 0.10, requiresVerification: true },
        'senior_discount': { discount: 0.08, minAge: 60 },
        'employee_discount': { discount: 0.15, requiresVerification: true }
      },
      'partner': {
        'shop_owner': { discount: 0.25, requiresVerification: true },
        'corporate': { discount: 0.20, requiresVerification: true },
        'government': { discount: 0.30, requiresVerification: true },
        'ngo': { discount: 0.25, requiresVerification: true }
      }
    };

    discounts.forEach((discount, key) => {
      this.discounts.set(key, discount);
    });
  }

  // Initialize special rules
  initializeSpecialRules() {
    const specialRules = {
      'free_delivery': {
        'order_value': { threshold: 500, appliesTo: 'all' },
        'loyalty_points': { threshold: 1000, appliesTo: 'all' },
        'subscription': { tier: 'premium', appliesTo: 'all' }
      },
      'flat_rate': {
        'city_wide': { city: 'addis_ababa', rate: 50, maxDistance: 10 },
        'zone_wide': { zone: 'zone_1', rate: 100, maxDistance: 25 },
        'national': { rate: 200, maxDistance: 100 }
      },
      'peak_pricing': {
        'hours': [8, 10, 17, 19], multiplier: 1.2 },
        'days': ['friday', 'saturday'], multiplier: 1.15 },
        'holidays': ['eid_al_fitr', 'eid_al_adha', 'christmas'], multiplier: 1.3
      },
      'bulk_discounts': {
        'small_bulk': { minItems: 3, discount: 0.05 },
        'medium_bulk': { minItems: 5, discount: 0.10 },
        'large_bulk': { minItems: 10, discount: 0.15 },
        'enterprise_bulk': { minItems: 25, discount: 0.20 }
      }
    };

    specialRules.forEach((rule, key) => {
      this.specialRules.set(key, rule);
    });
  }

  // Calculate delivery fee
  calculateDeliveryFee(deliveryRequest) {
    const {
      pickupLocation,
      deliveryLocation,
      packageInfo = {},
      serviceType = 'standard',
      options = {}
    } = deliveryRequest;

    // Determine base rate
    const baseRate = this.getBaseRate(pickupLocation, deliveryLocation);
    
    // Calculate distance
    const distance = this.calculateDistance(pickupLocation, deliveryLocation);
    
    // Calculate base cost
    let cost = baseRate.baseRate + (baseRate.perKmRate * distance);
    
    // Apply multipliers
    cost = this.applyMultipliers(cost, packageInfo, serviceType, options);
    
    // Apply special rules
    cost = this.applySpecialRules(cost, deliveryRequest);
    
    // Apply discounts
    cost = this.applyDiscounts(cost, options);
    
    // Apply minimum and maximum fees
    cost = Math.max(baseRate.minimumFee, Math.min(baseRate.maximumFee, cost));
    
    // Round to nearest ETB
    cost = Math.round(cost);
    
    return {
      cost,
      baseRate: baseRate.baseRate,
      distance,
      appliedMultipliers: this.getAppliedMultipliers(packageInfo, serviceType, options),
      appliedDiscounts: this.getAppliedDiscounts(options),
      breakdown: this.getFeeBreakdown(cost, baseRate, distance, packageInfo, serviceType, options)
    };
  }

  // Get base rate for location
  getBaseRate(pickupLocation, deliveryLocation) {
    // Try to find specific city rate
    const deliveryCity = this.findCity(deliveryLocation);
    if (deliveryCity) {
      return this.baseRates.get(deliveryCity);
    }
    
    // Fall back to rural Ethiopia rate
    return this.baseRates.get('rural_ethiopia');
  }

  // Find city from location
  findCity(location) {
    for (const [key, rate] of this.baseRates.entries()) {
      const cityCoords = {
        lat: 9.1450, // Addis Ababa (mock coordinates for each city)
        lng: 40.4897
      };
      
      // In production, this would use actual city coordinates
      const distance = this.calculateDistance(location, cityCoords);
      if (distance <= 50) { // Within 50km of city center
        return key;
      }
    }
    return null;
  }

  // Apply multipliers
  applyMultipliers(cost, packageInfo, serviceType, options) {
    let totalMultiplier = 1.0;
    const appliedMultipliers = [];

    // Weight multiplier
    const weightMultiplier = this.getWeightMultiplier(packageInfo.weight || 1);
    totalMultiplier *= weightMultiplier;
    appliedMultipliers.push({ type: 'weight', value: weightMultiplier });

    // Size multiplier
    const sizeMultiplier = this.getSizeMultiplier(packageInfo);
    totalMultiplier *= sizeMultiplier;
    appliedMultipliers.push({ type: 'size', value: sizeMultiplier });

    // Value multiplier
    const valueMultiplier = this.getValueMultiplier(packageInfo.value || 0);
    totalMultiplier *= valueMultiplier;
    appliedMultipliers.push({ type: 'value', value: valueMultiplier });

    // Urgency multiplier
    const urgencyMultiplier = this.getUrgencyMultiplier(serviceType);
    totalMultiplier *= urgencyMultiplier;
    appliedMultipliers.push({ type: 'urgency', value: urgencyMultiplier });

    // Time multiplier
    const timeMultiplier = this.getTimeMultiplier(options.deliveryTime);
    totalMultiplier *= timeMultiplier;
    appliedMultipliers.push({ type: 'time', value: timeMultiplier });

    // Distance multiplier
    const distance = this.calculateDistance(options.pickupLocation, options.deliveryLocation);
    const distanceMultiplier = this.getDistanceMultiplier(distance);
    totalMultiplier *= distanceMultiplier;
    appliedMultipliers.push({ type: 'distance', value: distanceMultiplier });

    return cost * totalMultiplier;
  }

  // Apply special rules
  applySpecialRules(cost, deliveryRequest) {
    const { options = {} } = deliveryRequest;

    // Check for free delivery
    if (this.isEligibleForFreeDelivery(deliveryRequest)) {
      return 0;
    }

    // Check for flat rate
    const flatRate = this.getFlatRate(deliveryRequest);
    if (flatRate) {
      return flatRate.rate;
    }

    // Apply peak pricing
    const peakMultiplier = this.getPeakMultiplier();
    if (peakMultiplier > 1) {
      cost *= peakMultiplier;
    }

    // Apply bulk discounts
    const bulkDiscount = this.getBulkDiscount(deliveryRequest);
    if (bulkDiscount > 0) {
      cost *= (1 - bulkDiscount);
    }

    return cost;
  }

  // Apply discounts
  applyDiscounts(cost, options) {
    let totalDiscount = 0;
    const appliedDiscounts = [];

    // Loyalty discount
    if (options.customerTier) {
      const loyaltyDiscount = this.getLoyaltyDiscount(options.customerTier);
      if (loyaltyDiscount > 0) {
        totalDiscount += loyaltyDiscount;
        appliedDiscounts.push({ type: 'loyalty', value: loyaltyDiscount });
      }
    }

    // Volume discount
    if (options.orderCount) {
      const volumeDiscount = this.getVolumeDiscount(options.orderCount);
      if (volumeDiscount > 0) {
        totalDiscount += volumeDiscount;
        appliedDiscounts.push({ type: 'volume', value: volumeDiscount });
      }
    }

    // Seasonal discount
    const seasonalDiscount = this.getSeasonalDiscount();
    if (seasonalDiscount > 0) {
      totalDiscount += seasonalDiscount;
      appliedDiscounts.push({ type: 'seasonal', value: seasonalDiscount });
    }

    // Promotional discount
    if (options.promoCode) {
      const promoDiscount = this.getPromotionalDiscount(options.promoCode, options);
      if (promoDiscount > 0) {
        totalDiscount += promoDiscount;
        appliedDiscounts.push({ type: 'promo', value: promoDiscount });
      }
    }

    // Partner discount
    if (options.partnerType) {
      const partnerDiscount = this.getPartnerDiscount(options.partnerType);
      if (partnerDiscount > 0) {
        totalDiscount += partnerDiscount;
        appliedDiscounts.push({ type: 'partner', value: partnerDiscount });
      }
    }

    return cost * (1 - totalDiscount);
  }

  // Get weight multiplier
  getWeightMultiplier(weight) {
    const weightTiers = this.multipliers.get('weight');
    for (const [tier, config] of Object.entries(weightTiers)) {
      if (weight <= config.maxWeight) {
        return config.multiplier;
      }
    }
    return 2.5;
  }

  // Get size multiplier
  getSizeMultiplier(packageInfo) {
    const { dimensions = {} } = packageInfo;
    const sizeTiers = this.multipliers.get('size');
    
    for (const [tier, config] of Object.entries(sizeTiers)) {
      if (dimensions.length <= config.dimensions.length &&
          dimensions.width <= config.dimensions.width &&
          dimensions.height <= config.dimensions.height) {
        return config.multiplier;
      }
    }
    return 2.5;
  }

  // Get value multiplier
  getValueMultiplier(value) {
    const valueTiers = this.multipliers.get('value');
    for (const [tier, config] of Object.entries(valueTiers)) {
      if (value <= config.maxValue) {
        return config.multiplier;
      }
    }
    return 1.5;
  }

  // Get urgency multiplier
  getUrgencyMultiplier(serviceType) {
    const urgencyTiers = this.multipliers.get('urgency');
    return urgencyTiers[serviceType]?.multiplier || 1.0;
  }

  // Get time multiplier
  getTimeMultiplier(deliveryTime) {
    if (!deliveryTime) return 1.0;

    const now = new Date();
    const deliveryDate = new Date(deliveryTime);
    const hour = deliveryDate.getHours();
    const dayOfWeek = deliveryDate.getDay();

    let multiplier = 1.0;

    // Check time-based multiplier
    const timeTiers = this.multipliers.get('time');
    for (const [tier, config] of Object.entries(timeTiers)) {
      if (tier === 'morning' && hour >= config.hours[0] && hour < config.hours[1]) {
        multiplier *= config.multiplier;
      } else if (tier === 'afternoon' && hour >= config.hours[0] && hour < config.hours[1]) {
        multiplier *= config.multiplier;
      } else if (tier === 'evening' && hour >= config.hours[0] && hour < config.hours[1]) {
        multiplier *= config.multiplier;
      } else if (tier === 'night' && (hour >= config.hours[0] || hour < config.hours[1])) {
        multiplier *= config.multiplier;
      }
    }

    // Weekend multiplier
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Saturday or Sunday
      multiplier *= timeTiers.weekend.multiplier;
    }

    return multiplier;
  }

  // Get distance multiplier
  getDistanceMultiplier(distance) {
    const distanceTiers = this.multipliers.get('distance');
    for (const [tier, config] of Object.entries(distanceTiers)) {
      if (distance <= config.maxDistance) {
        return config.multiplier;
      }
    }
    return 2.0;
  }

  // Check eligibility for free delivery
  isEligibleForFreeDelivery(deliveryRequest) {
    const { options = {} } = deliveryRequest;

    // Order value threshold
    if (options.orderValue >= 500) {
      return true;
    }

    // Loyalty points threshold
    if (options.loyaltyPoints >= 1000) {
      return true;
    }

    // Subscription tier
    if (options.subscriptionTier === 'premium') {
      return true;
    }

    return false;
  }

  // Get flat rate
  getFlatRate(deliveryRequest) {
    const { options = {} } = deliveryRequest;
    const distance = this.calculateDistance(options.pickupLocation, options.deliveryLocation);

    // City-wide flat rate
    if (options.deliveryCity === 'addis_ababa' && distance <= 10) {
      return { rate: 50, type: 'city_wide' };
    }

    // Zone-wide flat rate
    if (options.deliveryZone === 'zone_1' && distance <= 25) {
      return { rate: 100, type: 'zone_wide' };
    }

    // National flat rate
    if (distance <= 100) {
      return { rate: 200, type: 'national' };
    }

    return null;
  }

  // Get peak multiplier
  getPeakMultiplier() {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    const peakHours = this.specialRules.get('peak_pricing').hours;
    const peakDays = this.specialRules.get('peak_pricing').days;

    let multiplier = 1.0;

    // Check peak hours
    if (peakHours.some(h => h === hour)) {
      multiplier *= this.specialRules.get('peak_pricing').multiplier;
    }

    // Check peak days
    if (peakDays.includes(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'][dayOfWeek])) {
      multiplier *= this.specialRules.get('peak_pricing').multiplier;
    }

    return multiplier;
  }

  // Get bulk discount
  getBulkDiscount(deliveryRequest) {
    const { packageInfo = {} } = deliveryRequest;
    const itemCount = packageInfo.itemCount || 1;

    const bulkDiscounts = this.specialRules.get('bulk_discounts');
    for (const [tier, config] of Object.entries(bulkDiscounts)) {
      if (itemCount >= config.minItems) {
        return config.discount;
      }
    }

    return 0;
  }

  // Get loyalty discount
  getLoyaltyDiscount(tier) {
    const loyaltyDiscounts = this.discounts.get('loyalty');
    return loyaltyDiscounts[tier]?.discount || 0;
  }

  // Get volume discount
  getVolumeDiscount(orderCount) {
    const volumeDiscounts = this.discounts.get('volume');
    for (const [tier, config] of Object.entries(volumeDiscounts)) {
      if (orderCount >= config.minOrders) {
        return config.discount;
      }
    }
    return 0;
  }

  // Get seasonal discount
  getSeasonalDiscount() {
    const now = new Date();
    const seasonalDiscounts = this.discounts.get('seasonal');

    for (const [holiday, config] of Object.entries(seasonalDiscounts)) {
      const validFrom = new Date(config.validFrom);
      const validTo = new Date(config.validTo);
      
      if (now >= validFrom && now <= validTo) {
        return config.discount;
      }
    }

    return 0;
  }

  // Get promotional discount
  getPromotionalDiscount(promoCode, options) {
    const promotionalDiscounts = this.discounts.get('promotional');
    
    // Mock promo code validation
    const validPromos = {
      'FIRST20': { discount: 0.20, maxDiscount: 100 },
      'SAVE10': { discount: 0.10, maxDiscount: 50 },
      'WELCOME15': { discount: 0.15, maxDiscount: 75 }
    };

    const promo = validPromos[promoCode.toUpperCase()];
    if (promo) {
      return promo.discount;
    }

    return 0;
  }

  // Get partner discount
  getPartnerDiscount(partnerType) {
    const partnerDiscounts = this.discounts.get('partner');
    return partnerDiscounts[partnerType]?.discount || 0;
  }

  // Get applied multipliers
  getAppliedMultipliers(packageInfo, serviceType, options) {
    const multipliers = [];

    // Weight
    multipliers.push(this.getWeightMultiplier(packageInfo.weight || 1));

    // Size
    multipliers.push(this.getSizeMultiplier(packageInfo));

    // Value
    multipliers.push(this.getValueMultiplier(packageInfo.value || 0));

    // Urgency
    multipliers.push(this.getUrgencyMultiplier(serviceType));

    // Time
    multipliers.push(this.getTimeMultiplier(options.deliveryTime));

    // Distance
    const distance = this.calculateDistance(options.pickupLocation, options.deliveryLocation);
    multipliers.push(this.getDistanceMultiplier(distance));

    return multipliers;
  }

  // Get applied discounts
  getAppliedDiscounts(options) {
    const discounts = [];

    // Loyalty
    if (options.customerTier) {
      discounts.push(this.getLoyaltyDiscount(options.customerTier));
    }

    // Volume
    if (options.orderCount) {
      discounts.push(this.getVolumeDiscount(options.orderCount));
    }

    // Seasonal
    discounts.push(this.getSeasonalDiscount());

    // Promotional
    if (options.promoCode) {
      discounts.push(this.getPromotionalDiscount(options.promoCode, options));
    }

    // Partner
    if (options.partnerType) {
      discounts.push(this.getPartnerDiscount(options.partnerType));
    }

    return discounts.filter(d => d > 0);
  }

  // Get fee breakdown
  getFeeBreakdown(cost, baseRate, distance, packageInfo, serviceType, options) {
    return {
      baseRate: baseRate.baseRate,
      distanceCost: baseRate.perKmRate * distance,
      weightMultiplier: this.getWeightMultiplier(packageInfo.weight || 1),
      sizeMultiplier: this.getSizeMultiplier(packageInfo),
      valueMultiplier: this.getValueMultiplier(packageInfo.value || 0),
      urgencyMultiplier: this.getUrgencyMultiplier(serviceType),
      timeMultiplier: this.getTimeMultiplier(options.deliveryTime),
      distanceMultiplier: this.getDistanceMultiplier(distance),
      discounts: this.getAppliedDiscounts(options),
      specialRules: this.getAppliedSpecialRules(options),
      finalCost: cost
    };
  }

  // Get applied special rules
  getAppliedSpecialRules(options) {
    const rules = [];

    // Free delivery
    if (this.isEligibleForFreeDelivery({ options })) {
      rules.push({ type: 'free_delivery', applied: true });
    }

    // Flat rate
    const flatRate = this.getFlatRate({ options });
    if (flatRate) {
      rules.push({ type: 'flat_rate', applied: true, rate: flatRate.rate });
    }

    // Peak pricing
    const peakMultiplier = this.getPeakMultiplier();
    if (peakMultiplier > 1) {
      rules.push({ type: 'peak_pricing', applied: true, multiplier: peakMultiplier });
    }

    // Bulk discount
    const bulkDiscount = this.getBulkDiscount({ packageInfo: options });
    if (bulkDiscount > 0) {
      rules.push({ type: 'bulk_discount', applied: true, discount: bulkDiscount });
    }

    return rules;
  }

  // Calculate distance between two points
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

  // Convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Get available delivery options
  getAvailableDeliveryOptions(pickupLocation, deliveryLocation, packageInfo = {}) {
    const distance = this.calculateDistance(pickupLocation, deliveryLocation);
    const baseRate = this.getBaseRate(pickupLocation, deliveryLocation);
    
    const options = [
      {
        type: 'standard',
        name: 'Standard Delivery',
        estimatedTime: `${baseRate.minDelivery}-${baseRate.maxDelivery} days`,
        cost: this.calculateDeliveryFee({
          pickupLocation,
          deliveryLocation,
          packageInfo,
          serviceType: 'standard'
        }).cost,
        features: ['tracking', 'insurance', 'signature']
      },
      {
        type: 'express',
        name: 'Express Delivery',
        estimatedTime: `${baseRate.minDelivery / 2}-${baseRate.maxDelivery / 2} days`,
        cost: this.calculateDeliveryFee({
          pickupLocation,
          deliveryLocation,
          packageInfo,
          serviceType: 'express'
        }).cost,
        features: ['tracking', 'insurance', 'signature', 'priority']
      },
      {
        type: 'same_day',
        name: 'Same Day Delivery',
        estimatedTime: 'Same day',
        cost: this.calculateDeliveryFee({
          pickupLocation,
          deliveryLocation,
          packageInfo,
          serviceType: 'same_day'
        }).cost,
        features: ['tracking', 'insurance', 'signature', 'priority', 'same_day']
      },
      {
        type: 'priority',
        name: 'Priority Delivery',
        estimatedTime: '2-4 hours',
        cost: this.calculateDeliveryFee({
          pickupLocation,
          deliveryLocation,
          packageInfo,
          serviceType: 'priority'
        }).cost,
        features: ['tracking', 'insurance', 'signature', 'priority', 'real_time']
      }
    ];

    // Filter options based on distance and package size
    return options.filter(option => {
      if (option.type === 'same_day' && distance > 25) return false;
      if (option.type === 'priority' && distance > 50) return false;
      if (packageInfo.weight && packageInfo.weight > 20 && option.type === 'same_day') return false;
      return true;
    });
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}

module.exports = DeliveryFeeCalculator;
