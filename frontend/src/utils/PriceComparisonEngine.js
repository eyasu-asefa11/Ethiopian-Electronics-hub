// Price Comparison Engine for Ethiopian Electronics Marketplace
class PriceComparisonEngine {
  constructor() {
    this.comparisonData = new Map();
    this.priceHistory = new Map();
    this.marketData = new Map();
    this.comparisonCache = new Map();
    this.alerts = new Map();
    
    this.initializeMarketData();
  }

  // Initialize market data
  initializeMarketData() {
    // Sample market data - in production, this would come from API
    this.marketData.set('ethiopian_market', {
      averagePrices: {
        'Smartphones': { min: 2000, max: 50000, avg: 15000 },
        'Laptops': { min: 8000, max: 120000, avg: 35000 },
        'Tablets': { min: 3000, max: 40000, avg: 15000 },
        'Headphones': { min: 200, max: 15000, avg: 3000 },
        'Cameras': { min: 1000, max: 80000, avg: 20000 }
      },
      exchangeRates: {
        'USD': 55, // 1 USD = 55 ETB
        'EUR': 60  // 1 EUR = 60 ETB
      },
      deliveryCosts: {
        'addis_ababa': 100,
        'dire_dawa': 150,
        'mekelle': 120,
        'bahir_dar': 180,
        'gondar': 200
      }
    });
  }

  // Compare prices for multiple products
  compareProducts(productIds) {
    const products = this.getProductsByIds(productIds);
    const comparisons = [];
    
    products.forEach(product => {
      const comparison = this.analyzeProductPricing(product, products);
      comparisons.push(comparison);
    });
    
    return {
      products,
      comparisons,
      bestDeal: this.findBestDeal(comparisons),
      marketAnalysis: this.getMarketAnalysis(products)
    };
  }

  // Analyze individual product pricing
  analyzeProductPricing(product, allProducts) {
    const category = product.category;
    const marketData = this.marketData.get('ethiopian_market');
    const categoryMarketData = marketData.averagePrices[category] || { avg: 0, min: 0, max: 0 };
    
    const sameCategoryProducts = allProducts.filter(p => p.category === category);
    const priceStats = this.calculatePriceStats(product.price, sameCategoryProducts);
    
    return {
      productId: product.id,
      productName: product.name,
      currentPrice: product.price,
      marketPosition: priceStats.position,
      priceRank: priceStats.rank,
      percentCheaper: priceStats.percentCheaper,
      percentMoreExpensive: priceStats.percentMoreExpensive,
      isGoodDeal: priceStats.isGoodDeal,
      isGreatDeal: priceStats.isGreatDeal,
      isOverpriced: priceStats.isOverpriced,
      marketAverage: categoryMarketData.avg,
      marketRange: {
        min: categoryMarketData.min,
        max: categoryMarketData.max
      },
      savings: {
        ifCheapest: Math.max(0, categoryMarketData.min - product.price),
        ifAverage: Math.max(0, categoryMarketData.avg - product.price),
        ifBestDeal: Math.max(0, categoryMarketData.min - product.price)
      },
      recommendations: this.getPriceRecommendations(product, priceStats)
    };
  }

  // Calculate price statistics
  calculatePriceStats(currentPrice, categoryProducts) {
    const prices = categoryProducts.map(p => p.price).sort((a, b) => a - b);
    const rank = prices.indexOf(currentPrice) + 1;
    const position = ((prices.length - rank) / prices.length) * 100;
    
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    const percentCheaper = Math.round(((minPrice - currentPrice) / minPrice) * 100);
    const percentMoreExpensive = Math.round(((currentPrice - minPrice) / minPrice) * 100);
    
    const isGoodDeal = currentPrice <= avgPrice * 0.9; // 10% below average
    const isGreatDeal = currentPrice <= avgPrice * 0.8; // 20% below average
    const isOverpriced = currentPrice >= avgPrice * 1.2; // 20% above average
    
    return {
      rank,
      position,
      avgPrice,
      minPrice,
      maxPrice,
      percentCheaper,
      percentMoreExpensive,
      isGoodDeal,
      isGreatDeal,
      isOverpriced
    };
  }

  // Find best deal among comparisons
  findBestDeal(comparisons) {
    const goodDeals = comparisons.filter(c => c.isGoodDeal);
    const greatDeals = comparisons.filter(c => c.isGreatDeal);
    
    if (greatDeals.length > 0) {
      return greatDeals.sort((a, b) => a.savings.ifBestDeal - b.savings.ifBestDeal)[0];
    }
    
    if (goodDeals.length > 0) {
      return goodDeals.sort((a, b) => a.savings.ifAverage - b.savings.ifAverage)[0];
    }
    
    return comparisons[0]; // Return first product if no good deals
  }

  // Get market analysis
  getMarketAnalysis(products) {
    const categories = [...new Set(products.map(p => p.category))];
    const brands = [...new Set(products.map(p => p.brand))];
    const priceRange = {
      min: Math.min(...products.map(p => p.price)),
      max: Math.max(...products.map(p => p.price)),
      avg: products.reduce((sum, p) => sum + p.price, 0) / products.length
    };
    
    return {
      categories,
      brands,
      priceRange,
      totalProducts: products.length,
      marketInsights: this.generateMarketInsights(products)
    };
  }

  // Generate market insights
  generateMarketInsights(products) {
    const insights = [];
    
    // Price distribution analysis
    const priceRanges = {
      budget: products.filter(p => p.price < 5000).length,
      mid: products.filter(p => p.price >= 5000 && p.price < 20000).length,
      premium: products.filter(p => p.price >= 20000).length
    };
    
    insights.push({
      type: 'price_distribution',
      title: 'Market Price Distribution',
      description: `${priceRanges.budget} budget, ${priceRanges.mid} mid-range, ${priceRanges.premium} premium products`,
      recommendation: priceRanges.budget > priceRanges.premium ? 'Focus on premium products' : 'Balanced price range'
    });
    
    // Brand competition analysis
    const brandCounts = {};
    products.forEach(p => {
      brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
    });
    
    const topBrands = Object.entries(brandCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([brand, count]) => ({ brand, count }));
    
    insights.push({
      type: 'brand_competition',
      title: 'Top Brands in Market',
      description: `${topBrands.map(b => `${b.brand} (${b.count})`).join(', ')}`,
      recommendation: 'Focus on top 3 brands for better margins'
    });
    
    return insights;
  }

  // Get price recommendations
  getPriceRecommendations(product, priceStats) {
    const recommendations = [];
    
    if (priceStats.isOverpriced) {
      recommendations.push({
        type: 'price_alert',
        title: 'Price Too High',
        description: `This product is ${priceStats.percentMoreExpensive}% above market average`,
        action: 'Consider waiting for a sale or looking for alternatives',
        priority: 'high'
      });
    }
    
    if (priceStats.isGoodDeal) {
      recommendations.push({
        type: 'good_deal',
        title: 'Good Deal Available',
        description: `This product is ${Math.abs(priceStats.percentCheaper)}% below market average`,
        action: 'Buy now - this deal won\'t last long',
        priority: 'medium'
      });
    }
    
    if (priceStats.isGreatDeal) {
      recommendations.push({
        type: 'great_deal',
        title: 'Excellent Deal!',
        description: `This product is ${Math.abs(priceStats.percentCheaper)}% below market average`,
        action: 'Excellent value - buy immediately!',
        priority: 'low'
      });
    }
    
    return recommendations;
  }

  // Track price history
  trackPriceHistory(productId, price) {
    if (!this.priceHistory.has(productId)) {
      this.priceHistory.set(productId, []);
    }
    
    const history = this.priceHistory.get(productId);
    history.push({
      price,
      timestamp: Date.now(),
      source: 'marketplace'
    });
    
    // Keep only last 30 days of history
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentHistory = history.filter(entry => entry.timestamp > thirtyDaysAgo);
    
    this.priceHistory.set(productId, recentHistory);
  }

  // Get price trend
  getPriceTrend(productId, days = 30) {
    const history = this.priceHistory.get(productId) || [];
    if (history.length < 2) return 'insufficient_data';
    
    const recentHistory = history
      .filter(entry => Date.now() - entry.timestamp < days * 24 * 60 * 60 * 1000)
      .sort((a, b) => a.timestamp - b.timestamp);
    
    if (recentHistory.length < 2) return 'insufficient_data';
    
    const firstPrice = recentHistory[0].price;
    const lastPrice = recentHistory[recentHistory.length - 1].price;
    const priceChange = ((lastPrice - firstPrice) / firstPrice) * 100;
    
    if (priceChange > 5) return 'increasing';
    if (priceChange < -5) return 'decreasing';
    return 'stable';
  }

  // Set price alert
  setPriceAlert(productId, targetPrice, userEmail) {
    const currentPrice = this.getCurrentPrice(productId);
    if (!currentPrice) return false;
    
    const alertData = {
      productId,
      targetPrice,
      currentPrice,
      userEmail,
      created: Date.now(),
      triggered: false
    };
    
    this.alerts.set(`${productId}_${userEmail}`, alertData);
    
    // Check if alert should be triggered
    if (currentPrice <= targetPrice) {
      this.triggerPriceAlert(alertData);
    }
  }

  // Trigger price alert
  triggerPriceAlert(alertData) {
    alertData.triggered = true;
    alertData.triggeredAt = Date.now();
    
    // In production, this would send email/notification
    console.log('🔔 Price Alert Triggered:', {
      product: alertData.productId,
      targetPrice: alertData.targetPrice,
      currentPrice: alertData.currentPrice,
      user: alertData.userEmail
    });
    
    // Remove alert after triggering
    setTimeout(() => {
      this.alerts.delete(`${alertData.productId}_${alertData.userEmail}`);
    }, 60000); // Remove after 1 minute
  }

  // Get current price (mock implementation)
  getCurrentPrice(productId) {
    // In production, this would fetch from API
    return Math.random() * 50000; // Mock price
  }

  // Get products by IDs (mock implementation)
  getProductsByIds(productIds) {
    // In production, this would fetch from database
    return productIds.map(id => ({
      id,
      name: `Product ${id}`,
      price: Math.random() * 50000,
      category: ['Smartphones', 'Laptops', 'Tablets'][Math.floor(Math.random() * 3)],
      brand: ['Samsung', 'Apple', 'Xiaomi', 'Oppo'][Math.floor(Math.random() * 4)]
    }));
  }

  // Get comparison statistics
  getComparisonStats() {
    const totalComparisons = this.comparisonData.size;
    const averageSavings = this.calculateAverageSavings();
    
    return {
      totalComparisons,
      averageSavings,
      topComparedCategories: this.getTopComparedCategories(),
      userSatisfaction: this.calculateUserSatisfaction()
    };
  }

  // Calculate average savings
  calculateAverageSavings() {
    let totalSavings = 0;
    let comparisonCount = 0;
    
    for (const comparison of this.comparisonData.values()) {
      if (comparison.bestDeal && comparison.bestDeal.savings) {
        totalSavings += comparison.bestDeal.savings.ifAverage;
        comparisonCount++;
      }
    }
    
    return comparisonCount > 0 ? totalSavings / comparisonCount : 0;
  }

  // Get top compared categories
  getTopComparedCategories() {
    const categoryCount = {};
    
    for (const comparison of this.comparisonData.values()) {
      comparison.products.forEach(product => {
        categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
      });
    }
    
    return Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));
  }

  // Calculate user satisfaction
  calculateUserSatisfaction() {
    const totalComparisons = this.comparisonData.size;
    if (totalComparisons === 0) return 0;
    
    let satisfactionScore = 0;
    
    for (const comparison of this.comparisonData.values()) {
      if (comparison.bestDeal) {
        satisfactionScore += 10;
      } else if (comparison.comparisons.some(c => c.isGoodDeal)) {
        satisfactionScore += 5;
      } else {
        satisfactionScore += 2;
      }
    }
    
    return Math.min(100, (satisfactionScore / totalComparisons) * 20);
  }
}

module.exports = PriceComparisonEngine;
