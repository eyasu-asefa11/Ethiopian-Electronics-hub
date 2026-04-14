// Affiliate System for Ethiopian Electronics Marketplace
class AffiliateSystem {
  constructor() {
    this.affiliates = new Map();
    this.commissions = new Map();
    this.payouts = new Map();
    this.analytics = {
      totalSales: 0,
      totalCommission: 0,
      activeAffiliates: 0,
      conversionRate: 0,
      averageOrderValue: 0
    };
    
    this.commissionTiers = {
      bronze: { min: 0, max: 10000, rate: 5 },      // 5% for sales up to 10,000 ETB
      silver: { min: 10001, max: 50000, rate: 7 },   // 7% for sales 10,001-50,000 ETB
      gold: { min: 50001, max: 100000, rate: 10 }, // 10% for sales 50,001-100,000 ETB
      platinum: { min: 100001, max: Infinity, rate: 15 } // 15% for sales over 100,000 ETB
    };
    
    this.initializeFromStorage();
  }

  // Initialize from local storage
  initializeFromStorage() {
    const affiliates = this.loadFromLocalStorage('affiliates');
    const commissions = this.loadFromLocalStorage('commissions');
    const payouts = this.loadFromLocalStorage('payouts');
    
    if (affiliates) this.affiliates = new Map(Object.entries(affiliates));
    if (commissions) this.commissions = new Map(Object.entries(commissions));
    if (payouts) this.payouts = new Map(Object.entries(payouts));
  }

  // Register new affiliate
  registerAffiliate(affiliateData) {
    const affiliate = {
      id: this.generateId(),
      uniqueCode: this.generateAffiliateCode(),
      ...affiliateData,
      status: 'pending',
      commissionRate: 5, // Default bronze tier
      totalSales: 0,
      totalCommission: 0,
      currentBalance: 0,
      totalPayouts: 0,
      referralCount: 0,
      conversionRate: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastActivity: Date.now(),
      trackingLinks: [],
      marketingMaterials: [],
      paymentInfo: {
        method: 'bank',
        bankName: '',
        accountNumber: '',
        accountName: ''
      }
    };
    
    this.affiliates.set(affiliate.id, affiliate);
    this.saveToLocalStorage('affiliates', this.mapToObject(this.affiliates));
    
    return affiliate;
  }

  // Generate affiliate code
  generateAffiliateCode() {
    const prefix = 'ET';
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now().toString(36).substring(4, 8).toUpperCase();
    
    return `${prefix}${random}${timestamp}`;
  }

  // Create affiliate link
  createAffiliateLink(affiliateId, productId = null, customParams = {}) {
    const affiliate = this.affiliates.get(affiliateId);
    if (!affiliate) return null;
    
    const baseUrl = window.location.origin;
    let url = `${baseUrl}?ref=${affiliate.uniqueCode}`;
    
    if (productId) {
      url += `&product=${productId}`;
    }
    
    // Add custom parameters
    Object.entries(customParams).forEach(([key, value]) => {
      url += `&${key}=${value}`;
    });
    
    const trackingLink = {
      id: this.generateId(),
      affiliateId,
      productId,
      url,
      shortUrl: this.shortenUrl(url),
      clicks: 0,
      conversions: 0,
      createdAt: Date.now(),
      lastClicked: null
    };
    
    affiliate.trackingLinks.push(trackingLink);
    affiliate.updatedAt = Date.now();
    
    this.affiliates.set(affiliateId, affiliate);
    this.saveToLocalStorage('affiliates', this.mapToObject(this.affiliates));
    
    return trackingLink;
  }

  // Track affiliate click
  trackAffiliateClick(affiliateCode, productId = null, source = 'direct') {
    const affiliate = this.findAffiliateByCode(affiliateCode);
    if (!affiliate) return false;
    
    // Find or create tracking link
    let trackingLink = affiliate.trackingLinks.find(link => 
      link.productId === productId && link.url.includes(affiliateCode)
    );
    
    if (!trackingLink) {
      trackingLink = this.createAffiliateLink(affiliate.id, productId);
    }
    
    trackingLink.clicks++;
    trackingLink.lastClicked = Date.now();
    affiliate.lastActivity = Date.now();
    affiliate.updatedAt = Date.now();
    
    // Update analytics
    this.updateAnalytics();
    
    this.saveToLocalStorage('affiliates', this.mapToObject(this.affiliates));
    
    console.log('📊 Affiliate Click Tracked:', {
      affiliateCode,
      affiliateId: affiliate.id,
      productId,
      source,
      totalClicks: trackingLink.clicks
    });
    
    return true;
  }

  // Track conversion
  trackConversion(affiliateCode, orderId, orderAmount, productId = null) {
    const affiliate = this.findAffiliateByCode(affiliateCode);
    if (!affiliate) return false;
    
    const commissionRate = this.getCommissionRate(orderAmount);
    const commissionAmount = (orderAmount * commissionRate) / 100;
    
    const conversion = {
      id: this.generateId(),
      affiliateId: affiliate.id,
      affiliateCode,
      orderId,
      orderAmount,
      productId,
      commissionRate,
      commissionAmount,
      status: 'pending',
      createdAt: Date.now(),
      confirmedAt: null,
      paidAt: null
    };
    
    // Update affiliate stats
    affiliate.totalSales += orderAmount;
    affiliate.totalCommission += commissionAmount;
    affiliate.currentBalance += commissionAmount;
    affiliate.referralCount++;
    
    // Update commission tier
    affiliate.commissionRate = this.updateCommissionTier(affiliate.totalSales);
    
    affiliate.lastActivity = Date.now();
    affiliate.updatedAt = Date.now();
    
    // Store commission
    this.commissions.set(conversion.id, conversion);
    
    // Update analytics
    this.updateAnalytics();
    
    this.saveToLocalStorage('affiliates', this.mapToObject(this.affiliates));
    this.saveToLocalStorage('commissions', this.mapToObject(this.commissions));
    
    console.log('💰 Conversion Tracked:', {
      affiliateCode,
      affiliateId: affiliate.id,
      orderId,
      orderAmount,
      commissionAmount,
      commissionRate: `${commissionRate}%`
    });
    
    return conversion;
  }

  // Find affiliate by code
  findAffiliateByCode(code) {
    return Array.from(this.affiliates.values())
      .find(affiliate => affiliate.uniqueCode === code);
  }

  // Get commission rate based on sales amount
  getCommissionRate(salesAmount) {
    for (const [tier, config] of Object.entries(this.commissionTiers)) {
      if (salesAmount >= config.min && salesAmount <= config.max) {
        return config.rate;
      }
    }
    return this.commissionTiers.bronze.rate;
  }

  // Update commission tier
  updateCommissionTier(totalSales) {
    for (const [tier, config] of Object.entries(this.commissionTiers)) {
      if (totalSales >= config.min && totalSales <= config.max) {
        return config.rate;
      }
    }
    return this.commissionTiers.bronze.rate;
  }

  // Confirm commission
  confirmCommission(commissionId) {
    const commission = this.commissions.get(commissionId);
    if (!commission || commission.status !== 'pending') return false;
    
    commission.status = 'confirmed';
    commission.confirmedAt = Date.now();
    
    this.commissions.set(commissionId, commission);
    this.saveToLocalStorage('commissions', this.mapToObject(this.commissions));
    
    return true;
  }

  // Process payout
  processPayout(affiliateId, amount = null) {
    const affiliate = this.affiliates.get(affiliateId);
    if (!affiliate || affiliate.currentBalance <= 0) return false;
    
    const payoutAmount = amount || affiliate.currentBalance;
    
    const payout = {
      id: this.generateId(),
      affiliateId,
      affiliateCode: affiliate.uniqueCode,
      amount: payoutAmount,
      status: 'processing',
      method: affiliate.paymentInfo.method,
      paymentDetails: affiliate.paymentInfo,
      createdAt: Date.now(),
      processedAt: null,
      transactionId: null
    };
    
    // Update affiliate balance
    affiliate.currentBalance -= payoutAmount;
    affiliate.totalPayouts += payoutAmount;
    affiliate.updatedAt = Date.now();
    
    this.payouts.set(payout.id, payout);
    this.affiliates.set(affiliateId, affiliate);
    
    this.saveToLocalStorage('affiliates', this.mapToObject(this.affiliates));
    this.saveToLocalStorage('payouts', this.mapToObject(this.payouts));
    
    return payout;
  }

  // Complete payout
  completePayout(payoutId, transactionId) {
    const payout = this.payouts.get(payoutId);
    if (!payout || payout.status !== 'processing') return false;
    
    payout.status = 'completed';
    payout.processedAt = Date.now();
    payout.transactionId = transactionId;
    
    this.payouts.set(payoutId, payout);
    this.saveToLocalStorage('payouts', this.mapToObject(this.payouts));
    
    return true;
  }

  // Get affiliate dashboard data
  getAffiliateDashboard(affiliateId) {
    const affiliate = this.affiliates.get(affiliateId);
    if (!affiliate) return null;
    
    const commissions = Array.from(this.commissions.values())
      .filter(commission => commission.affiliateId === affiliateId);
    
    const pendingCommissions = commissions.filter(c => c.status === 'pending');
    const confirmedCommissions = commissions.filter(c => c.status === 'confirmed');
    const paidCommissions = commissions.filter(c => c.status === 'paid');
    
    const recentCommissions = confirmedCommissions
      .sort((a, b) => b.confirmedAt - a.confirmedAt)
      .slice(0, 10);
    
    const topProducts = this.getTopProductsForAffiliate(affiliateId);
    const monthlyStats = this.getMonthlyStats(affiliateId);
    
    return {
      affiliate: {
        id: affiliate.id,
        uniqueCode: affiliate.uniqueCode,
        status: affiliate.status,
        commissionRate: affiliate.commissionRate,
        currentBalance: affiliate.currentBalance,
        totalSales: affiliate.totalSales,
        totalCommission: affiliate.totalCommission,
        totalPayouts: affiliate.totalPayouts,
        referralCount: affiliate.referralCount,
        tier: this.getCurrentTier(affiliate.totalSales)
      },
      commissions: {
        pending: pendingCommissions.length,
        confirmed: confirmedCommissions.length,
        paid: paidCommissions.length,
        recent: recentCommissions
      },
      analytics: {
        topProducts,
        monthlyStats,
        conversionRate: affiliate.referralCount > 0 ? 
          ((confirmedCommissions.length / affiliate.referralCount) * 100).toFixed(2) : 0,
        averageOrderValue: confirmedCommissions.length > 0 ? 
          (confirmedCommissions.reduce((sum, c) => sum + c.orderAmount, 0) / confirmedCommissions.length) : 0
      }
    };
  }

  // Get top products for affiliate
  getTopProductsForAffiliate(affiliateId, limit = 5) {
    const commissions = Array.from(this.commissions.values())
      .filter(commission => commission.affiliateId === affiliateId && commission.status === 'confirmed');
    
    const productSales = {};
    
    commissions.forEach(commission => {
      if (commission.productId) {
        productSales[commission.productId] = (productSales[commission.productId] || 0) + commission.orderAmount;
      }
    });
    
    return Object.entries(productSales)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([productId, totalSales]) => ({ productId, totalSales }));
  }

  // Get monthly stats
  getMonthlyStats(affiliateId) {
    const commissions = Array.from(this.commissions.values())
      .filter(commission => commission.affiliateId === affiliateId && commission.status === 'confirmed');
    
    const monthlyStats = {};
    const currentYear = new Date().getFullYear();
    
    for (let month = 1; month <= 12; month++) {
      const monthCommissions = commissions.filter(commission => {
        const date = new Date(commission.confirmedAt);
        return date.getFullYear() === currentYear && date.getMonth() + 1 === month;
      });
      
      monthlyStats[month] = {
        sales: monthCommissions.length,
        revenue: monthCommissions.reduce((sum, c) => sum + c.orderAmount, 0),
        commission: monthCommissions.reduce((sum, c) => sum + c.commissionAmount, 0)
      };
    }
    
    return monthlyStats;
  }

  // Get current tier
  getCurrentTier(totalSales) {
    for (const [tier, config] of Object.entries(this.commissionTiers)) {
      if (totalSales >= config.min && totalSales <= config.max) {
        return tier;
      }
    }
    return 'bronze';
  }

  // Generate marketing materials
  generateMarketingMaterials(affiliateId) {
    const affiliate = this.affiliates.get(affiliateId);
    if (!affiliate) return null;
    
    const materials = {
      banners: [
        {
          id: this.generateId(),
          type: 'banner',
          size: '728x90',
          url: `${window.location.origin}/assets/banners/ethiopian-electronics-728x90.jpg`,
          trackingLink: this.createAffiliateLink(affiliateId),
          html: this.generateBannerHtml(affiliateId, '728x90')
        },
        {
          id: this.generateId(),
          type: 'banner',
          size: '300x250',
          url: `${window.location.origin}/assets/banners/ethiopian-electronics-300x250.jpg`,
          trackingLink: this.createAffiliateLink(affiliateId),
          html: this.generateBannerHtml(affiliateId, '300x250')
        }
      ],
      textLinks: [
        {
          id: this.generateId(),
          type: 'text',
          text: 'Shop Electronics at Ethiopian Electronics Marketplace',
          trackingLink: this.createAffiliateLink(affiliateId),
          html: `<a href="${this.createAffiliateLink(affiliateId).url}" target="_blank">Shop Electronics at Ethiopian Electronics Marketplace</a>`
        }
      ],
      socialMedia: {
        facebook: `Check out amazing deals on Ethiopian Electronics Marketplace! Use my code ${affiliate.uniqueCode} for exclusive discounts!`,
        twitter: `🛍️ Amazing electronics deals on Ethiopian Electronics Marketplace! Use code ${affiliate.uniqueCode} for discounts! #EthiopianElectronics`,
        email: `Hi! I wanted to share this amazing electronics marketplace with you. Use my code ${affiliate.uniqueCode} for special discounts!`
      }
    };
    
    affiliate.marketingMaterials = materials;
    this.affiliates.set(affiliateId, affiliate);
    this.saveToLocalStorage('affiliates', this.mapToObject(this.affiliates));
    
    return materials;
  }

  // Generate banner HTML
  generateBannerHtml(affiliateId, size) {
    const trackingLink = this.createAffiliateLink(affiliateId);
    return `<a href="${trackingLink.url}" target="_blank"><img src="${trackingLink.url}" alt="Ethiopian Electronics Marketplace" border="0" /></a>`;
  }

  // Shorten URL (mock implementation)
  shortenUrl(url) {
    // In production, this would integrate with URL shortening service
    return url;
  }

  // Update analytics
  updateAnalytics() {
    const affiliates = Array.from(this.affiliates.values());
    const commissions = Array.from(this.commissions.values());
    
    this.analytics.totalSales = affiliates.reduce((sum, a) => sum + a.totalSales, 0);
    this.analytics.totalCommission = affiliates.reduce((sum, a) => sum + a.totalCommission, 0);
    this.analytics.activeAffiliates = affiliates.filter(a => a.status === 'active').length;
    
    const totalClicks = Array.from(this.affiliates.values())
      .reduce((sum, a) => sum + a.trackingLinks.reduce((linkSum, link) => linkSum + link.clicks, 0), 0);
    
    this.analytics.conversionRate = totalClicks > 0 ? 
      ((commissions.filter(c => c.status === 'confirmed').length / totalClicks) * 100).toFixed(2) : 0;
    
    const confirmedCommissions = commissions.filter(c => c.status === 'confirmed');
    this.analytics.averageOrderValue = confirmedCommissions.length > 0 ? 
      (confirmedCommissions.reduce((sum, c) => sum + c.orderAmount, 0) / confirmedCommissions.length) : 0;
  }

  // Get system analytics
  getSystemAnalytics() {
    this.updateAnalytics();
    
    const topAffiliates = Array.from(this.affiliates.values())
      .sort((a, b) => b.totalCommission - a.totalCommission)
      .slice(0, 10);
    
    return {
      overview: this.analytics,
      topAffiliates,
      commissionTiers: this.commissionTiers,
      recentActivity: this.getRecentActivity(),
      payoutStats: this.getPayoutStats()
    };
  }

  // Get recent activity
  getRecentActivity() {
    const activities = [];
    
    Array.from(this.commissions.values()).forEach(commission => {
      activities.push({
        type: 'commission',
        affiliateId: commission.affiliateId,
        amount: commission.commissionAmount,
        timestamp: commission.createdAt,
        status: commission.status
      });
    });
    
    Array.from(this.payouts.values()).forEach(payout => {
      activities.push({
        type: 'payout',
        affiliateId: payout.affiliateId,
        amount: payout.amount,
        timestamp: payout.createdAt,
        status: payout.status
      });
    });
    
    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);
  }

  // Get payout statistics
  getPayoutStats() {
    const payouts = Array.from(this.payouts.values());
    
    return {
      total: payouts.reduce((sum, p) => sum + p.amount, 0),
      pending: payouts.filter(p => p.status === 'processing').length,
      completed: payouts.filter(p => p.status === 'completed').length,
      thisMonth: payouts.filter(p => {
        const date = new Date(p.createdAt);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).reduce((sum, p) => sum + p.amount, 0)
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

module.exports = AffiliateSystem;
