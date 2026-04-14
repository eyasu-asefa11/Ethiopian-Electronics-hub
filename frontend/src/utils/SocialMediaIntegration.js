// Social Media Integration for Ethiopian Electronics Marketplace
class SocialMediaIntegration {
  constructor() {
    this.platforms = {
      facebook: {
        name: 'Facebook',
        baseUrl: 'https://www.facebook.com',
        shareUrl: 'https://www.facebook.com/sharer/sharer.php',
        icon: '📘',
        color: '#1877f2'
      },
      twitter: {
        name: 'Twitter',
        baseUrl: 'https://twitter.com',
        shareUrl: 'https://twitter.com/intent/tweet',
        icon: '🐦',
        color: '#1da1f2'
      },
      telegram: {
        name: 'Telegram',
        baseUrl: 'https://t.me',
        shareUrl: 'https://t.me/share/url',
        icon: '✈️',
        color: '#0088cc'
      },
      whatsapp: {
        name: 'WhatsApp',
        baseUrl: 'https://wa.me',
        shareUrl: 'https://wa.me/',
        icon: '📱',
        color: '#25d366'
      },
      instagram: {
        name: 'Instagram',
        baseUrl: 'https://www.instagram.com',
        shareUrl: 'https://www.instagram.com',
        icon: '📷',
        color: '#e4405f'
      },
      linkedin: {
        name: 'LinkedIn',
        baseUrl: 'https://www.linkedin.com',
        shareUrl: 'https://www.linkedin.com/sharing/share-offsite/',
        icon: '💼',
        color: '#0077b5'
      },
      pinterest: {
        name: 'Pinterest',
        baseUrl: 'https://pinterest.com',
        shareUrl: 'https://pinterest.com/pin/create/button/',
        icon: '📌',
        color: '#bd081c'
      },
      email: {
        name: 'Email',
        baseUrl: 'mailto:',
        shareUrl: 'mailto:',
        icon: '📧',
        color: '#718096'
      }
    };
    
    this.socialMetrics = new Map();
    this.campaigns = new Map();
    this.analytics = {
      shares: 0,
      clicks: 0,
      conversions: 0,
      revenue: 0
    };
  }

  // Share product on social media
  shareProduct(product, platform, customMessage = '') {
    const platformConfig = this.platforms[platform];
    if (!platformConfig) return false;
    
    const shareData = this.generateShareData(product, customMessage);
    const shareUrl = this.buildShareUrl(platform, shareData);
    
    // Track share
    this.trackShare(product.id, platform);
    
    // Open share dialog
    this.openShareDialog(shareUrl, platform);
    
    return {
      platform,
      shareUrl,
      success: true
    };
  }

  // Generate share data
  generateShareData(product, customMessage) {
    const baseUrl = window.location.origin;
    const productUrl = `${baseUrl}/product/${product.id}`;
    
    const defaultMessage = `Check out this ${product.name} by ${product.brand} on Ethiopian Electronics Marketplace! Only ${product.price} ETB`;
    const hashtags = ['#EthiopianElectronics', '#Ethiopia', '#Electronics', '#ShopEthiopia'];
    
    const message = customMessage || defaultMessage;
    
    return {
      url: productUrl,
      title: `${product.name} - ${product.price} ETB`,
      description: product.description || `${product.name} by ${product.brand}`,
      message,
      hashtags,
      image: product.image || `${baseUrl}/placeholder-product.png`,
      price: product.price,
      brand: product.brand,
      category: product.category
    };
  }

  // Build share URL
  buildShareUrl(platform, shareData) {
    const platformConfig = this.platforms[platform];
    
    switch (platform) {
      case 'facebook':
        return `${platformConfig.shareUrl}?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.message)}`;
        
      case 'twitter':
        return `${platformConfig.shareUrl}?text=${encodeURIComponent(shareData.message)}&url=${encodeURIComponent(shareData.url)}&hashtags=${encodeURIComponent(shareData.hashtags.join(','))}`;
        
      case 'telegram':
        return `${platformConfig.shareUrl}?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.message)}`;
        
      case 'whatsapp':
        return `${platformConfig.shareUrl}?text=${encodeURIComponent(shareData.message + ' ' + shareData.url)}`;
        
      case 'linkedin':
        return `${platformConfig.shareUrl}?url=${encodeURIComponent(shareData.url)}&title=${encodeURIComponent(shareData.title)}&summary=${encodeURIComponent(shareData.description)}`;
        
      case 'pinterest':
        return `${platformConfig.shareUrl}?url=${encodeURIComponent(shareData.url)}&description=${encodeURIComponent(shareData.description)}&media=${encodeURIComponent(shareData.image)}`;
        
      case 'email':
        return `${platformConfig.shareUrl}?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.message + '\n\n' + shareData.url)}`;
        
      default:
        return shareData.url;
    }
  }

  // Open share dialog
  openShareDialog(url, platform) {
    const windowFeatures = 'width=600,height=400,scrollbars=yes,resizable=yes,toolbar=yes,menubar=yes,location=yes';
    
    if (platform === 'email') {
      window.location.href = url;
    } else {
      window.open(url, '_blank', windowFeatures);
    }
  }

  // Track share
  trackShare(productId, platform) {
    const key = `${productId}_${platform}`;
    const currentCount = this.socialMetrics.get(key) || 0;
    this.socialMetrics.set(key, currentCount + 1);
    
    this.analytics.shares++;
    
    // Save to local storage
    this.saveToLocalStorage('social_metrics', this.mapToObject(this.socialMetrics));
    
    // In production, send to analytics
    console.log('📊 Social Share Tracked:', {
      productId,
      platform,
      totalShares: currentCount + 1
    });
  }

  // Generate social share buttons
  generateShareButtons(product, containerId = 'social-share-buttons') {
    const container = document.getElementById(containerId);
    if (!container) return false;
    
    const buttons = Object.entries(this.platforms).map(([platform, config]) => {
      const button = document.createElement('button');
      button.className = 'social-share-btn';
      button.setAttribute('data-platform', platform);
      button.style.backgroundColor = config.color;
      button.innerHTML = `${config.icon} ${config.name}`;
      
      button.addEventListener('click', () => {
        this.shareProduct(product, platform);
      });
      
      return button;
    });
    
    container.innerHTML = '';
    buttons.forEach(button => container.appendChild(button));
    
    return true;
  }

  // Create social campaign
  createCampaign(name, products, settings = {}) {
    const campaign = {
      id: this.generateId(),
      name,
      products,
      settings: {
        startDate: settings.startDate || Date.now(),
        endDate: settings.endDate || Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
        budget: settings.budget || 0,
        targetAudience: settings.targetAudience || 'general',
        platforms: settings.platforms || Object.keys(this.platforms),
        autoShare: settings.autoShare || false,
        shareInterval: settings.shareInterval || (4 * 60 * 60 * 1000), // 4 hours
        ...settings
      },
      metrics: {
        shares: 0,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        impressions: 0
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    this.campaigns.set(campaign.id, campaign);
    this.saveToLocalStorage('social_campaigns', this.mapToObject(this.campaigns));
    
    return campaign;
  }

  // Execute campaign
  executeCampaign(campaignId) {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) return false;
    
    const now = Date.now();
    if (now < campaign.settings.startDate || now > campaign.settings.endDate) {
      return false;
    }
    
    // Auto-share products
    if (campaign.settings.autoShare) {
      const productsToShare = this.selectProductsForSharing(campaign.products);
      const platforms = campaign.settings.platforms;
      
      productsToShare.forEach(product => {
        platforms.forEach(platform => {
          this.shareProduct(product, platform, this.generateCampaignMessage(campaign, product));
        });
      });
    }
    
    campaign.metrics.shares += productsToShare.length * platforms.length;
    campaign.updatedAt = now;
    
    this.campaigns.set(campaignId, campaign);
    this.saveToLocalStorage('social_campaigns', this.mapToObject(this.campaigns));
    
    return true;
  }

  // Select products for sharing
  selectProductsForSharing(products) {
    // Share products with good deals, high ratings, or new arrivals
    return products
      .filter(product => 
        (product.discount && product.discount > 10) || // 10%+ discount
        (product.rating && product.rating >= 4) || // 4+ rating
        (product.isNew) // New product
      )
      .slice(0, 10); // Limit to 10 products per batch
  }

  // Generate campaign message
  generateCampaignMessage(campaign, product) {
    const templates = {
      discount: `🔥 Special Deal! ${product.name} is ${product.discount}% OFF! Only ${product.price} ETB on Ethiopian Electronics Marketplace!`,
      rating: `⭐ Top Rated! ${product.name} has ${product.rating}/5 stars! Get yours for ${product.price} ETB!`,
      new: `🆕 Just Arrived! ${product.name} is now available on Ethiopian Electronics Marketplace for ${product.price} ETB!`,
      default: `🛍️ Check out ${product.name} by ${product.brand} on Ethiopian Electronics Marketplace! Only ${product.price} ETB`
    };
    
    let message = templates.default;
    
    if (product.discount && product.discount > 10) {
      message = templates.discount;
    } else if (product.rating && product.rating >= 4) {
      message = templates.rating;
    } else if (product.isNew) {
      message = templates.new;
    }
    
    return `${message}\n\n#EthiopianElectronics #${campaign.name}`;
  }

  // Track social click
  trackSocialClick(productId, platform, source = 'share') {
    const key = `click_${productId}_${platform}`;
    const currentCount = this.socialMetrics.get(key) || 0;
    this.socialMetrics.set(key, currentCount + 1);
    
    this.analytics.clicks++;
    
    console.log('📊 Social Click Tracked:', {
      productId,
      platform,
      source,
      totalClicks: currentCount + 1
    });
  }

  // Track conversion
  trackConversion(productId, platform, revenue) {
    const key = `conversion_${productId}_${platform}`;
    const currentCount = this.socialMetrics.get(key) || 0;
    this.socialMetrics.set(key, currentCount + 1);
    
    this.analytics.conversions++;
    this.analytics.revenue += revenue;
    
    console.log('💰 Conversion Tracked:', {
      productId,
      platform,
      revenue,
      totalConversions: currentCount + 1,
      totalRevenue: this.analytics.revenue
    });
  }

  // Get social analytics
  getSocialAnalytics() {
    const platformStats = {};
    
    Object.keys(this.platforms).forEach(platform => {
      const shares = Array.from(this.socialMetrics.keys())
        .filter(key => key.includes('_') && key.split('_')[1] === platform)
        .reduce((sum, key) => sum + this.socialMetrics.get(key), 0);
      
      const clicks = Array.from(this.socialMetrics.keys())
        .filter(key => key.includes('click_') && key.split('_')[2] === platform)
        .reduce((sum, key) => sum + this.socialMetrics.get(key), 0);
      
      const conversions = Array.from(this.socialMetrics.keys())
        .filter(key => key.includes('conversion_') && key.split('_')[2] === platform)
        .reduce((sum, key) => sum + this.socialMetrics.get(key), 0);
      
      platformStats[platform] = {
        shares,
        clicks,
        conversions,
        ctr: shares > 0 ? ((clicks / shares) * 100).toFixed(2) : 0,
        conversionRate: clicks > 0 ? ((conversions / clicks) * 100).toFixed(2) : 0
      };
    });
    
    return {
      overall: this.analytics,
      platforms: platformStats,
      campaigns: this.getCampaignStats(),
      topProducts: this.getTopSharedProducts()
    };
  }

  // Get campaign statistics
  getCampaignStats() {
    const campaigns = Array.from(this.campaigns.values());
    
    return campaigns.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      status: this.getCampaignStatus(campaign),
      metrics: campaign.metrics,
      settings: campaign.settings,
      roi: campaign.settings.budget > 0 ? 
        ((campaign.metrics.revenue - campaign.settings.budget) / campaign.settings.budget * 100).toFixed(2) : 0
    }));
  }

  // Get campaign status
  getCampaignStatus(campaign) {
    const now = Date.now();
    
    if (now < campaign.settings.startDate) return 'scheduled';
    if (now > campaign.settings.endDate) return 'completed';
    if (now >= campaign.settings.startDate && now <= campaign.settings.endDate) return 'active';
    
    return 'unknown';
  }

  // Get top shared products
  getTopSharedProducts(limit = 10) {
    const productShares = {};
    
    Array.from(this.socialMetrics.keys()).forEach(key => {
      if (key.includes('_') && !key.includes('click_') && !key.includes('conversion_')) {
        const [type, productId, platform] = key.split('_');
        if (type === 'product') {
          productShares[productId] = (productShares[productId] || 0) + this.socialMetrics.get(key);
        }
      }
    });
    
    return Object.entries(productShares)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([productId, shares]) => ({ productId, shares }));
  }

  // Generate social proof
  generateSocialProof(productId) {
    const shares = this.getProductShares(productId);
    const likes = Math.floor(shares * 1.5); // Mock likes
    const comments = Math.floor(shares * 0.8); // Mock comments
    
    return {
      shares,
      likes,
      comments,
      socialProof: this.getSocialProofLevel(shares)
    };
  }

  // Get product shares
  getProductShares(productId) {
    return Array.from(this.socialMetrics.keys())
      .filter(key => key.includes('_') && key.split('_')[1] === productId && !key.includes('click_') && !key.includes('conversion_'))
      .reduce((sum, key) => sum + this.socialMetrics.get(key), 0);
  }

  // Get social proof level
  getSocialProofLevel(shares) {
    if (shares >= 1000) return 'viral';
    if (shares >= 500) return 'trending';
    if (shares >= 100) return 'popular';
    if (shares >= 50) return 'growing';
    if (shares >= 10) return 'active';
    return 'new';
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

module.exports = SocialMediaIntegration;
