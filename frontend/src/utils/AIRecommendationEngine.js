// AI-Powered Recommendations Engine
class AIRecommendationEngine {
  constructor() {
    this.userBehavior = new Map();
    this.productInteractions = new Map();
    this.mlModel = {
      collaborative: new Map(),
      contentBased: new Map(),
      popularityBased: new Map()
    };
  }

  // Track user behavior
  trackUserBehavior(userId, action, data) {
    if (!this.userBehavior.has(userId)) {
      this.userBehavior.set(userId, {
        views: [],
        clicks: [],
        purchases: [],
        searches: [],
        timeSpent: 0
      });
    }

    const behavior = this.userBehavior.get(userId);
    const timestamp = Date.now();

    switch (action) {
      case 'view':
        behavior.views.push({ productId: data.productId, timestamp, duration: data.duration || 0 });
        break;
      case 'click':
        behavior.clicks.push({ productId: data.productId, timestamp, position: data.position });
        break;
      case 'purchase':
        behavior.purchases.push({ productId: data.productId, timestamp, price: data.price });
        break;
      case 'search':
        behavior.searches.push({ query: data.query, timestamp, filters: data.filters });
        break;
      case 'time_spent':
        behavior.timeSpent += data.duration;
        break;
    }

    // Update behavior
    this.userBehavior.set(userId, behavior);
    this.updateMLModel(userId, behavior);
  }

  // Update machine learning model
  updateMLModel(userId, behavior) {
    // Collaborative filtering
    this.updateCollaborativeFiltering(userId, behavior);

    // Content-based filtering
    this.updateContentBasedFiltering(userId, behavior);

    // Popularity-based filtering
    this.updatePopularityBasedFiltering(behavior);
  }

  // Collaborative filtering
  updateCollaborativeFiltering(userId, behavior) {
    const similarUsers = this.findSimilarUsers(userId, behavior);
    const userProducts = new Set(behavior.purchases.map(p => p.productId));
    
    similarUsers.forEach(similarUser => {
      const similarBehavior = this.userBehavior.get(similarUser) || { purchases: [] };
      similarBehavior.purchases.forEach(purchase => {
        if (!userProducts.has(purchase.productId)) {
          this.mlModel.collaborative.set(userId, (this.mlModel.collaborative.get(userId) || []).concat([{
            productId: purchase.productId,
            score: this.calculateSimilarity(behavior, similarBehavior),
            reason: 'similar_users_liked'
          }]));
        }
      });
    });
  }

  // Content-based filtering
  updateContentBasedFiltering(userId, behavior) {
    const userPreferences = this.extractUserPreferences(behavior);
    const allProducts = this.getAllProducts();
    
    allProducts.forEach(product => {
      const score = this.calculateContentScore(product, userPreferences);
      if (score > 0.7) {
        const currentRecs = this.mlModel.contentBased.get(userId) || [];
        this.mlModel.contentBased.set(userId, currentRecs.concat([{
          productId: product.id,
          score,
          reason: 'content_based_match'
        }]));
      }
    });
  }

  // Popularity-based filtering
  updatePopularityBasedFiltering(behavior) {
    const allProducts = this.getAllProducts();
    const trendingProducts = allProducts
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 20);

    this.mlModel.popularityBased.set('global', trendingProducts.map(product => ({
      productId: product.id,
      score: this.calculatePopularityScore(product),
      reason: 'trending_popular'
    })));
  }

  // Get personalized recommendations
  getRecommendations(userId, count = 10) {
    const recommendations = [];
    
    // Get recommendations from all models
    const collaborative = this.mlModel.collaborative.get(userId) || [];
    const contentBased = this.mlModel.contentBased.get(userId) || [];
    const popularity = this.mlModel.popularityBased.get('global') || [];

    // Combine and score recommendations
    const allRecs = [
      ...collaborative.map(rec => ({ ...rec, weight: 0.4, source: 'collaborative' })),
      ...contentBased.map(rec => ({ ...rec, weight: 0.4, source: 'content' })),
      ...popularity.map(rec => ({ ...rec, weight: 0.2, source: 'popularity' }))
    ];

    // Remove duplicates and sort by score
    const uniqueRecs = this.removeDuplicates(allRecs);
    const sortedRecs = uniqueRecs.sort((a, b) => (b.score * b.weight) - (a.score * a.weight));

    // Return top recommendations
    return sortedRecs.slice(0, count).map(rec => ({
      productId: rec.productId,
      score: rec.score,
      reason: rec.reason,
      source: rec.source
    }));
  }

  // Calculate similarity between users
  calculateSimilarity(user1Behavior, user2Behavior) {
    const user1Products = new Set(user1Behavior.purchases.map(p => p.productId));
    const user2Products = new Set(user2Behavior.purchases.map(p => p.productId));
    
    const intersection = [...user1Products].filter(product => user2Products.has(product));
    const union = new Set([...user1Products, ...user2Products]);
    
    return intersection.length / union.size;
  }

  // Calculate content score
  calculateContentScore(product, preferences) {
    let score = 0;
    
    if (preferences.categories.includes(product.category)) score += 0.3;
    if (preferences.brands.includes(product.brand)) score += 0.3;
    if (preferences.priceRange.min <= product.price && product.price <= preferences.priceRange.max) score += 0.2;
    if (preferences.features.includes('camera') && product.category === 'Cameras') score += 0.2;
    
    return Math.min(1, score);
  }

  // Extract user preferences
  extractUserPreferences(behavior) {
    const categories = [...new Set(behavior.purchases.map(p => p.category))];
    const brands = [...new Set(behavior.purchases.map(p => p.brand))];
    const prices = behavior.purchases.map(p => p.price);
    
    return {
      categories,
      brands,
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices)
      },
      features: this.extractFeaturesFromBehavior(behavior)
    };
  }

  // Extract features from behavior
  extractFeaturesFromBehavior(behavior) {
    const features = [];
    
    // Analyze search patterns
    behavior.searches.forEach(search => {
      if (search.query.toLowerCase().includes('camera')) features.push('camera');
      if (search.query.toLowerCase().includes('gaming')) features.push('gaming');
      if (search.query.toLowerCase().includes('laptop')) features.push('laptop');
    });

    // Analyze product preferences
    behavior.purchases.forEach(purchase => {
      if (purchase.category === 'Smartphones') features.push('mobile');
      if (purchase.category === 'Laptops') features.push('computer');
    });

    return [...new Set(features)];
  }

  // Calculate popularity score
  calculatePopularityScore(product) {
    const age = Date.now() - new Date(product.createdAt).getTime();
    const ageInDays = age / (1000 * 60 * 60 * 24);
    
    // Recent products get higher score
    const recencyScore = Math.max(0, 1 - (ageInDays / 30));
    const viewScore = Math.log10((product.views || 1) + 1) / 5;
    const purchaseScore = Math.log10((product.purchases || 1) + 1) / 3;
    
    return (recencyScore * 0.3) + (viewScore * 0.4) + (purchaseScore * 0.3);
  }

  // Remove duplicates
  removeDuplicates(recommendations) {
    const seen = new Set();
    return recommendations.filter(rec => {
      if (seen.has(rec.productId)) return false;
      seen.add(rec.productId);
      return true;
    });
  }

  // Get all products (mock implementation)
  getAllProducts() {
    // In real implementation, this would fetch from database
    return [];
  }
}

module.exports = AIRecommendationEngine;
