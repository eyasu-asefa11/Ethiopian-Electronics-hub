// Fraud Detection System for Ethiopian Electronics Marketplace
class FraudDetectionService {
  constructor() {
    this.rules = new Map();
    this.riskScores = new Map();
    this.suspiciousActivities = new Map();
    this.blacklist = new Map();
    this.whitelist = new Map();
    this.alerts = new Map();
    this.machineLearning = new Map();
    
    this.initializeRules();
    this.initializeMLModels();
    this.initializeFromStorage();
  }

  // Initialize fraud detection rules
  initializeRules() {
    const rules = {
      'high_velocity_orders': {
        id: 'high_velocity_orders',
        name: 'High Velocity Orders',
        description: 'Multiple orders in short time period',
        severity: 'high',
        enabled: true,
        conditions: [
          { field: 'order_count', operator: '>', value: 5, timeframe: '1h' },
          { field: 'order_count', operator: '>', value: 10, timeframe: '24h' }
        ],
        riskScore: 80,
        action: 'flag_for_review'
      },
      'suspicious_payment': {
        id: 'suspicious_payment',
        name: 'Suspicious Payment Method',
        description: 'Unusual payment patterns',
        severity: 'medium',
        enabled: true,
        conditions: [
          { field: 'payment_method', operator: 'in', value: ['gift_card', 'prepaid_card'] },
          { field: 'amount', operator: '>', value: 50000, currency: 'ETB' }
        ],
        riskScore: 60,
        action: 'additional_verification'
      },
      'account_anomaly': {
        id: 'account_anomaly',
        name: 'Account Anomaly Detection',
        description: 'Unusual account behavior',
        severity: 'high',
        enabled: true,
        conditions: [
          { field: 'login_location', operator: 'different_from_billing', value: true },
          { field: 'device_fingerprint', operator: 'new_device', value: true },
          { field: 'account_age', operator: '<', value: '24h' }
        ],
        riskScore: 70,
        action: 'require_verification'
      },
      'price_manipulation': {
        id: 'price_manipulation',
        name: 'Price Manipulation',
        description: 'Unusual pricing patterns',
        severity: 'medium',
        enabled: true,
        conditions: [
          { field: 'price_change', operator: '>', value: 50, percentage: true },
          { field: 'bulk_orders', operator: '>', value: 100, timeframe: '1h' }
        ],
        riskScore: 50,
        action: 'monitor_prices'
      },
      'fake_reviews': {
        id: 'fake_reviews',
        name: 'Fake Review Detection',
        description: 'Suspicious review patterns',
        severity: 'medium',
        enabled: true,
        conditions: [
          { field: 'review_frequency', operator: '>', value: 10, timeframe: '1h' },
          { field: 'review_similarity', operator: '>', value: 0.8 },
          { field: 'rating_pattern', operator: 'all_5_star', value: true }
        ],
        riskScore: 45,
        action: 'review_audit'
      },
      'identity_fraud': {
        id: 'identity_fraud',
        name: 'Identity Fraud',
        description: 'Suspicious identity information',
        severity: 'critical',
        enabled: true,
        conditions: [
          { field: 'email_domain', operator: 'in', value: ['tempmail.com', '10minutemail.com'] },
          { field: 'phone_verification', operator: 'failed', value: true },
          { field: 'address_verification', operator: 'failed', value: true }
        ],
        riskScore: 90,
        action: 'block_transaction'
      },
      'shipping_fraud': {
        id: 'shipping_fraud',
        name: 'Shipping Fraud',
        description: 'Suspicious shipping patterns',
        severity: 'medium',
        enabled: true,
        conditions: [
          { field: 'shipping_address', operator: 'high_risk_location', value: true },
          { field: 'rush_shipping', operator: 'always', value: true },
          { field: 'order_value', operator: '>', value: 100000, currency: 'ETB' }
        ],
        riskScore: 55,
        action: 'address_verification'
      },
      'return_abuse': {
        id: 'return_abuse',
        name: 'Return Abuse',
        description: 'Excessive return patterns',
        severity: 'medium',
        enabled: true,
        conditions: [
          { field: 'return_rate', operator: '>', value: 0.3, percentage: true },
          { field: 'return_reason', operator: 'always_same', value: 'damaged' },
          { field: 'return_timing', operator: '<', value: '24h' }
        ],
        riskScore: 40,
        action: 'return_monitoring'
      },
      'multiple_accounts': {
        id: 'multiple_accounts',
        name: 'Multiple Account Detection',
        description: 'Same user with multiple accounts',
        severity: 'high',
        enabled: true,
        conditions: [
          { field: 'ip_address', operator: 'multiple_accounts', value: true },
          { field: 'device_fingerprint', operator: 'multiple_accounts', value: true },
          { field: 'payment_method', operator: 'same_card', value: true }
        ],
        riskScore: 75,
        action: 'account_merge'
      },
      'bot_activity': {
        id: 'bot_activity',
        name: 'Bot Activity Detection',
        description: 'Automated/bot behavior',
        severity: 'high',
        enabled: true,
        conditions: [
          { field: 'request_pattern', operator: 'robotic', value: true },
          { field: 'session_duration', operator: '<', value: '10s' },
          { field: 'mouse_movement', operator: 'none', value: true }
        ],
        riskScore: 85,
        action: 'block_ip'
      }
    };

    rules.forEach((rule, key) => {
      this.rules.set(key, rule);
    });
  }

  // Initialize machine learning models
  initializeMLModels() {
    const models = {
      'transaction_classifier': {
        id: 'transaction_classifier',
        name: 'Transaction Classification Model',
        type: 'supervised',
        algorithm: 'random_forest',
        features: [
          'amount', 'time_of_day', 'day_of_week', 'user_age', 'device_type',
          'payment_method', 'shipping_speed', 'product_category', 'seller_rating'
        ],
        accuracy: 0.94,
        precision: 0.91,
        recall: 0.89,
        f1Score: 0.90,
        trainedAt: Date.now(),
        version: '1.2.0'
      },
      'user_behavior_analyzer': {
        id: 'user_behavior_analyzer',
        name: 'User Behavior Analyzer',
        type: 'unsupervised',
        algorithm: 'isolation_forest',
        features: [
          'session_duration', 'pages_viewed', 'click_pattern', 'search_queries',
          'cart_additions', 'login_frequency', 'device_changes', 'location_changes'
        ],
        accuracy: 0.87,
        precision: 0.85,
        recall: 0.82,
        f1Score: 0.83,
        trainedAt: Date.now(),
        version: '1.1.0'
      },
      'review_sentiment': {
        id: 'review_sentiment',
        name: 'Review Sentiment Analysis',
        type: 'supervised',
        algorithm: 'naive_bayes',
        features: [
          'review_text', 'rating', 'review_length', 'product_category',
          'reviewer_age', 'verified_purchase', 'helpful_votes'
        ],
        accuracy: 0.92,
        precision: 0.88,
        recall: 0.94,
        f1Score: 0.91,
        trainedAt: Date.now(),
        version: '1.0.0'
      }
    };

    models.forEach((model, key) => {
      this.machineLearning.set(key, model);
    });
  }

  // Initialize from local storage
  initializeFromStorage() {
    const riskScores = this.loadFromLocalStorage('fraud_risk_scores');
    const suspiciousActivities = this.loadFromLocalStorage('suspicious_activities');
    const blacklist = this.loadFromLocalStorage('fraud_blacklist');
    const whitelist = this.loadFromLocalStorage('fraud_whitelist');
    const alerts = this.loadFromLocalStorage('fraud_alerts');
    
    if (riskScores) this.riskScores = new Map(Object.entries(riskScores));
    if (suspiciousActivities) this.suspiciousActivities = new Map(Object.entries(suspiciousActivities));
    if (blacklist) this.blacklist = new Map(Object.entries(blacklist));
    if (whitelist) this.whitelist = new Map(Object.entries(whitelist));
    if (alerts) this.alerts = new Map(Object.entries(alerts));
  }

  // Analyze transaction for fraud
  async analyzeTransaction(transactionData) {
    const transactionId = this.generateId();
    const analysis = {
      id: transactionId,
      type: 'transaction',
      data: transactionData,
      timestamp: Date.now(),
      riskScore: 0,
      riskLevel: 'low',
      triggeredRules: [],
      mlPredictions: {},
      recommendations: [],
      status: 'analyzing'
    };

    try {
      // Check blacklist
      if (this.isBlacklisted(transactionData)) {
        analysis.riskScore = 100;
        analysis.riskLevel = 'critical';
        analysis.recommendations.push('BLOCK_TRANSACTION');
        this.createAlert('blacklisted_entity', analysis);
        return analysis;
      }

      // Check whitelist
      if (this.isWhitelisted(transactionData)) {
        analysis.riskScore = 0;
        analysis.riskLevel = 'low';
        analysis.recommendations.push('APPROVE_TRANSACTION');
        return analysis;
      }

      // Rule-based analysis
      const ruleResults = await this.applyRules(transactionData);
      analysis.triggeredRules = ruleResults.triggeredRules;
      analysis.riskScore += ruleResults.totalRiskScore;

      // Machine learning analysis
      const mlResults = await this.applyMLModels(transactionData);
      analysis.mlPredictions = mlResults;
      analysis.riskScore += mlResults.mlRiskScore;

      // Determine risk level
      analysis.riskLevel = this.determineRiskLevel(analysis.riskScore);

      // Generate recommendations
      analysis.recommendations = this.generateRecommendations(analysis);

      // Update status
      analysis.status = 'completed';

      // Store analysis
      this.riskScores.set(transactionId, analysis);
      this.saveToLocalStorage('fraud_risk_scores', this.mapToObject(this.riskScores));

      // Create alert if high risk
      if (analysis.riskLevel === 'high' || analysis.riskLevel === 'critical') {
        this.createAlert('high_risk_transaction', analysis);
      }

      return analysis;

    } catch (error) {
      analysis.status = 'error';
      analysis.error = error.message;
      return analysis;
    }
  }

  // Apply fraud detection rules
  async applyRules(transactionData) {
    const triggeredRules = [];
    let totalRiskScore = 0;

    for (const [ruleId, rule] of this.rules.entries()) {
      if (!rule.enabled) continue;

      const ruleResult = await this.evaluateRule(rule, transactionData);
      if (ruleResult.triggered) {
        triggeredRules.push({
          ruleId,
          ruleName: rule.name,
          severity: rule.severity,
          riskScore: rule.riskScore,
          conditions: ruleResult.conditions,
          action: rule.action
        });
        totalRiskScore += rule.riskScore;
      }
    }

    return {
      triggeredRules,
      totalRiskScore
    };
  }

  // Evaluate individual rule
  async evaluateRule(rule, transactionData) {
    const triggeredConditions = [];
    let allConditionsMet = true;

    for (const condition of rule.conditions) {
      const conditionResult = await this.evaluateCondition(condition, transactionData);
      triggeredConditions.push({
        condition,
        result: conditionResult.met,
        actualValue: conditionResult.actualValue
      });

      if (!conditionResult.met) {
        allConditionsMet = false;
      }
    }

    return {
      triggered: allConditionsMet,
      conditions: triggeredConditions
    };
  }

  // Evaluate individual condition
  async evaluateCondition(condition, transactionData) {
    const { field, operator, value, timeframe, currency, percentage } = condition;
    let actualValue = this.getFieldValue(transactionData, field);
    let met = false;

    switch (operator) {
      case '>':
        met = actualValue > value;
        break;
      case '<':
        met = actualValue < value;
        break;
      case '>=':
        met = actualValue >= value;
        break;
      case '<=':
        met = actualValue <= value;
        break;
      case '==':
        met = actualValue === value;
        break;
      case '!=':
        met = actualValue !== value;
        break;
      case 'in':
        met = Array.isArray(value) && value.includes(actualValue);
        break;
      case 'not_in':
        met = Array.isArray(value) && !value.includes(actualValue);
        break;
      case 'contains':
        met = typeof actualValue === 'string' && actualValue.includes(value);
        break;
      case 'different_from_billing':
        met = this.isDifferentFromBilling(transactionData);
        break;
      case 'new_device':
        met = this.isNewDevice(transactionData);
        break;
      case 'high_risk_location':
        met = this.isHighRiskLocation(transactionData);
        break;
      case 'robotic':
        met = this.isRoboticBehavior(transactionData);
        break;
      case 'multiple_accounts':
        met = this.hasMultipleAccounts(transactionData);
        break;
      default:
        met = false;
    }

    return {
      met,
      actualValue
    };
  }

  // Apply machine learning models
  async applyMLModels(transactionData) {
    const predictions = {};
    let mlRiskScore = 0;

    for (const [modelId, model] of this.machineLearning.entries()) {
      try {
        const prediction = await this.runMLModel(model, transactionData);
        predictions[modelId] = prediction;
        
        // Add to ML risk score based on prediction confidence
        if (model.type === 'supervised') {
          mlRiskScore += prediction.isFraud ? prediction.confidence * 100 : 0;
        } else {
          mlRiskScore += prediction.anomalyScore * 50;
        }
      } catch (error) {
        console.error(`Error running ML model ${modelId}:`, error);
      }
    }

    return {
      predictions,
      mlRiskScore: Math.min(mlRiskScore, 100)
    };
  }

  // Run individual ML model
  async runMLModel(model, transactionData) {
    // Mock ML model implementation
    // In production, this would call actual ML service
    
    const features = this.extractFeatures(model.features, transactionData);
    const prediction = this.mockPrediction(model, features);
    
    return prediction;
  }

  // Extract features for ML model
  extractFeatures(requiredFeatures, transactionData) {
    const features = {};
    
    requiredFeatures.forEach(feature => {
      features[feature] = this.getFieldValue(transactionData, feature);
    });
    
    return features;
  }

  // Mock ML prediction
  mockPrediction(model, features) {
    // Simulate ML prediction based on features
    let fraudProbability = 0.1; // Base 10% fraud probability
    
    // Adjust based on features
    if (features.amount > 50000) fraudProbability += 0.2;
    if (features.user_age < 7) fraudProbability += 0.3;
    if (features.payment_method === 'gift_card') fraudProbability += 0.4;
    if (features.device_type === 'mobile') fraudProbability += 0.1;
    
    if (model.type === 'supervised') {
      return {
        isFraud: fraudProbability > 0.5,
        confidence: Math.abs(fraudProbability - 0.5) * 2,
        probability: fraudProbability
      };
    } else {
      return {
        anomalyScore: fraudProbability,
        isAnomaly: fraudProbability > 0.7,
        confidence: 0.85
      };
    }
  }

  // Get field value from transaction data
  getFieldValue(data, field) {
    const fieldPath = field.split('.');
    let value = data;
    
    for (const path of fieldPath) {
      if (value && typeof value === 'object' && path in value) {
        value = value[path];
      } else {
        return null;
      }
    }
    
    return value;
  }

  // Determine risk level based on score
  determineRiskLevel(score) {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'low';
    return 'very_low';
  }

  // Generate recommendations based on analysis
  generateRecommendations(analysis) {
    const recommendations = [];
    const { riskLevel, triggeredRules, mlPredictions } = analysis;

    switch (riskLevel) {
      case 'critical':
        recommendations.push('BLOCK_TRANSACTION');
        recommendations.push('IMMEDIATE_REVIEW');
        recommendations.push('NOTIFY_SECURITY_TEAM');
        break;
      case 'high':
        recommendations.push('REQUIRE_ADDITIONAL_VERIFICATION');
        recommendations.push('MANUAL_REVIEW');
        recommendations.push('LIMIT_TRANSACTION_AMOUNT');
        break;
      case 'medium':
        recommendations.push('ENHANCED_MONITORING');
        recommendations.push('DELAY_PROCESSING');
        recommendations.push('CUSTOMER_VERIFICATION');
        break;
      case 'low':
        recommendations.push('STANDARD_PROCESSING');
        recommendations.push('LOG_FOR_ANALYSIS');
        break;
      case 'very_low':
        recommendations.push('AUTO_APPROVE');
        recommendations.push('FAST_PROCESSING');
        break;
    }

    // Add rule-specific recommendations
    triggeredRules.forEach(rule => {
      switch (rule.action) {
        case 'block_transaction':
          recommendations.push('BLOCK_TRANSACTION');
          break;
        case 'require_verification':
          recommendations.push('REQUIRE_ADDITIONAL_VERIFICATION');
          break;
        case 'flag_for_review':
          recommendations.push('MANUAL_REVIEW');
          break;
        case 'monitor_prices':
          recommendations.push('PRICE_MONITORING');
          break;
        case 'review_audit':
          recommendations.push('REVIEW_AUDIT');
          break;
      }
    });

    return [...new Set(recommendations)]; // Remove duplicates
  }

  // Check if entity is blacklisted
  isBlacklisted(data) {
    const entities = [
      data.email,
      data.phone,
      data.ip_address,
      data.device_fingerprint,
      data.payment_method,
      data.shipping_address
    ].filter(Boolean);

    return entities.some(entity => {
      const blacklistEntry = this.blacklist.get(entity);
      return blacklistEntry && blacklistEntry.active;
    });
  }

  // Check if entity is whitelisted
  isWhitelisted(data) {
    const entities = [
      data.email,
      data.phone,
      data.ip_address,
      data.device_fingerprint,
      data.user_id
    ].filter(Boolean);

    return entities.some(entity => {
      const whitelistEntry = this.whitelist.get(entity);
      return whitelistEntry && whitelistEntry.active;
    });
  }

  // Add to blacklist
  addToBlacklist(entity, reason, severity = 'high') {
    this.blacklist.set(entity, {
      entity,
      reason,
      severity,
      addedAt: Date.now(),
      addedBy: 'fraud_system',
      active: true,
      expiresAt: null // Permanent blacklist
    });
    
    this.saveToLocalStorage('fraud_blacklist', this.mapToObject(this.blacklist));
  }

  // Remove from blacklist
  removeFromBlacklist(entity) {
    const entry = this.blacklist.get(entity);
    if (entry) {
      entry.active = false;
      entry.removedAt = Date.now();
      this.blacklist.set(entity, entry);
      this.saveToLocalStorage('fraud_blacklist', this.mapToObject(this.blacklist));
    }
  }

  // Add to whitelist
  addToWhitelist(entity, reason, expiresAt = null) {
    this.whitelist.set(entity, {
      entity,
      reason,
      addedAt: Date.now(),
      addedBy: 'fraud_system',
      active: true,
      expiresAt
    });
    
    this.saveToLocalStorage('fraud_whitelist', this.mapToObject(this.whitelist));
  }

  // Create fraud alert
  createAlert(alertType, analysis) {
    const alert = {
      id: this.generateId(),
      type: alertType,
      analysisId: analysis.id,
      severity: analysis.riskLevel,
      timestamp: Date.now(),
      status: 'open',
      assignedTo: null,
      resolvedAt: null,
      notes: '',
      metadata: {
        triggeredRules: analysis.triggeredRules,
        mlPredictions: analysis.mlPredictions,
        recommendations: analysis.recommendations
      }
    };

    this.alerts.set(alert.id, alert);
    this.saveToLocalStorage('fraud_alerts', this.mapToObject(this.alerts));

    // In production, this would send notification to security team
    console.log('🚨 FRAUD ALERT:', alert);
  }

  // Get fraud statistics
  getFraudStatistics() {
    const analyses = Array.from(this.riskScores.values());
    const alerts = Array.from(this.alerts.values());
    
    return {
      totalAnalyses: analyses.length,
      analysesByRiskLevel: this.getAnalysesByRiskLevel(analyses),
      analysesByType: this.getAnalysesByType(analyses),
      averageRiskScore: this.calculateAverageRiskScore(analyses),
      totalAlerts: alerts.length,
      alertsBySeverity: this.getAlertsBySeverity(alerts),
      alertsByStatus: this.getAlertsByStatus(alerts),
      blacklistSize: this.blacklist.size,
      whitelistSize: this.whitelist.size,
      rulesTriggered: this.getRulesTriggered(analyses),
      mlModelPerformance: this.getMLModelPerformance(),
      fraudPreventionRate: this.calculateFraudPreventionRate(analyses)
    };
  }

  getAnalysesByRiskLevel(analyses) {
    const levelCount = {};
    analyses.forEach(analysis => {
      levelCount[analysis.riskLevel] = (levelCount[analysis.riskLevel] || 0) + 1;
    });
    return levelCount;
  }

  getAnalysesByType(analyses) {
    const typeCount = {};
    analyses.forEach(analysis => {
      typeCount[analysis.type] = (typeCount[analysis.type] || 0) + 1;
    });
    return typeCount;
  }

  calculateAverageRiskScore(analyses) {
    if (analyses.length === 0) return 0;
    const totalScore = analyses.reduce((sum, analysis) => sum + analysis.riskScore, 0);
    return totalScore / analyses.length;
  }

  getAlertsBySeverity(alerts) {
    const severityCount = {};
    alerts.forEach(alert => {
      severityCount[alert.severity] = (severityCount[alert.severity] || 0) + 1;
    });
    return severityCount;
  }

  getAlertsByStatus(alerts) {
    const statusCount = {};
    alerts.forEach(alert => {
      statusCount[alert.status] = (statusCount[alert.status] || 0) + 1;
    });
    return statusCount;
  }

  getRulesTriggered(analyses) {
    const ruleCount = {};
    analyses.forEach(analysis => {
      analysis.triggeredRules.forEach(rule => {
        ruleCount[rule.ruleId] = (ruleCount[rule.ruleId] || 0) + 1;
      });
    });
    return ruleCount;
  }

  getMLModelPerformance() {
    const performance = {};
    this.machineLearning.forEach((model, modelId) => {
      performance[modelId] = {
        accuracy: model.accuracy,
        precision: model.precision,
        recall: model.recall,
        f1Score: model.f1Score,
        version: model.version
      };
    });
    return performance;
  }

  calculateFraudPreventionRate(analyses) {
    const highRiskAnalyses = analyses.filter(a => a.riskLevel === 'high' || a.riskLevel === 'critical');
    if (analyses.length === 0) return 0;
    return (highRiskAnalyses.length / analyses.length) * 100;
  }

  // Helper methods for condition evaluation
  isDifferentFromBilling(data) {
    return data.shipping_address && data.billing_address && 
           data.shipping_address !== data.billing_address;
  }

  isNewDevice(data) {
    // In production, check against device database
    return Math.random() > 0.8; // 20% chance of new device
  }

  isHighRiskLocation(data) {
    const highRiskLocations = ['Nigeria', 'Russia', 'China', 'North Korea'];
    return highRiskLocations.includes(data.shipping_country);
  }

  isRoboticBehavior(data) {
    // In production, analyze actual behavior patterns
    return data.session_duration < 10000; // Less than 10 seconds
  }

  hasMultipleAccounts(data) {
    // In production, check against user database
    return Math.random() > 0.95; // 5% chance of multiple accounts
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

  mapToObject(map) {
    const obj = {};
    for (const [key, value] of map.entries()) {
      obj[key] = value;
    }
    return obj;
  }
}

module.exports = FraudDetectionService;
