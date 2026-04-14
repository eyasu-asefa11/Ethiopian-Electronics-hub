// Advanced Search Filters for Ethiopian Electronics Marketplace
class AdvancedSearchFilters {
  constructor() {
    this.filters = {
      price: { min: 0, max: 100000 },
      specifications: {
        ram: [],
        storage: [],
        screenSize: [],
        camera: [],
        battery: [],
        processor: []
      },
      condition: [],
      brand: [],
      seller: {
        rating: 0,
        location: '',
        verified: false
      },
      features: {
        waterproof: false,
        wireless: false,
        touchscreen: false,
        warranty: false,
        original: false
      },
      availability: 'all',
      sortBy: 'relevance'
    };
    
    this.searchHistory = [];
    this.savedSearches = [];
  }

  // Apply price filter
  applyPriceFilter(min, max) {
    this.filters.price = { min, max };
    return this.getFilterQueryString();
  }

  // Apply specification filters
  applySpecificationFilter(specType, value) {
    if (this.filters.specifications[specType]) {
      const index = this.filters.specifications[specType].indexOf(value);
      if (index > -1) {
        this.filters.specifications[specType].splice(index, 1);
      }
    }
    return this.getFilterQueryString();
  }

  // Apply condition filter
  applyConditionFilter(conditions) {
    this.filters.condition = conditions;
    return this.getFilterQueryString();
  }

  // Apply brand filter
  applyBrandFilter(brands) {
    this.filters.brand = brands;
    return this.getFilterQueryString();
  }

  // Apply seller filters
  applySellerFilter(sellerFilters) {
    this.filters.seller = { ...this.filters.seller, ...sellerFilters };
    return this.getFilterQueryString();
  }

  // Apply feature filters
  applyFeatureFilter(features) {
    this.filters.features = { ...this.filters.features, ...features };
    return this.getFilterQueryString();
  }

  // Apply availability filter
  applyAvailabilityFilter(availability) {
    this.filters.availability = availability;
    return this.getFilterQueryString();
  }

  // Apply sorting
  applySorting(sortBy, order = 'desc') {
    this.filters.sortBy = sortBy;
    this.filters.order = order;
    return this.getFilterQueryString();
  }

  // Get filter query string
  getFilterQueryString() {
    const params = new URLSearchParams();
    
    // Price filters
    if (this.filters.price.min > 0) params.append('min_price', this.filters.price.min);
    if (this.filters.price.max < 100000) params.append('max_price', this.filters.price.max);
    
    // Specification filters
    Object.entries(this.filters.specifications).forEach(([key, values]) => {
      values.forEach(value => params.append(`spec_${key}`, value));
    });
    
    // Condition filters
    if (this.filters.condition.length > 0) {
      this.filters.condition.forEach(condition => params.append('condition', condition));
    }
    
    // Brand filters
    if (this.filters.brand.length > 0) {
      this.filters.brand.forEach(brand => params.append('brand', brand));
    }
    
    // Seller filters
    if (this.filters.seller.rating > 0) params.append('min_rating', this.filters.seller.rating);
    if (this.filters.seller.location) params.append('seller_location', this.filters.seller.location);
    if (this.filters.seller.verified) params.append('verified_seller', 'true');
    
    // Feature filters
    Object.entries(this.filters.features).forEach(([feature, enabled]) => {
      if (enabled) params.append(`feature_${feature}`, 'true');
    });
    
    // Availability
    if (this.filters.availability !== 'all') {
      params.append('availability', this.filters.availability);
    }
    
    // Sorting
    params.append('sort_by', this.filters.sortBy);
    params.append('order', this.filters.order);
    
    return params.toString();
  }

  // Parse filter query string
  parseFilterQueryString(queryString) {
    const params = new URLSearchParams(queryString);
    
    // Parse price
    const minPrice = parseFloat(params.get('min_price')) || 0;
    const maxPrice = parseFloat(params.get('max_price')) || 100000;
    this.filters.price = { min: minPrice, max: maxPrice };
    
    // Parse specifications
    for (const [key, value] of params.entries()) {
      if (key.startsWith('spec_')) {
        const specType = key.substring(5); // Remove 'spec_' prefix
        if (!this.filters.specifications[specType]) {
          this.filters.specifications[specType] = [];
        }
        if (!this.filters.specifications[specType].includes(value)) {
          this.filters.specifications[specType].push(value);
        }
      }
    }
    
    // Parse conditions
    const conditions = params.getAll('condition');
    if (conditions.length > 0) {
      this.filters.condition = conditions;
    }
    
    // Parse brands
    const brands = params.getAll('brand');
    if (brands.length > 0) {
      this.filters.brand = brands;
    }
    
    // Parse seller filters
    this.filters.seller.rating = parseFloat(params.get('min_rating')) || 0;
    this.filters.seller.location = params.get('seller_location') || '';
    this.filters.seller.verified = params.get('verified_seller') === 'true';
    
    // Parse features
    for (const [key, value] of params.entries()) {
      if (key.startsWith('feature_')) {
        const feature = key.substring(8); // Remove 'feature_' prefix
        this.filters.features[feature] = value === 'true';
      }
    }
    
    // Parse availability and sorting
    this.filters.availability = params.get('availability') || 'all';
    this.filters.sortBy = params.get('sort_by') || 'relevance';
    this.filters.order = params.get('order') || 'desc';
  }

  // Get available filter options
  getFilterOptions() {
    return {
      priceRanges: [
        { label: 'Under 1,000 ETB', min: 0, max: 1000 },
        { label: '1,000 - 5,000 ETB', min: 1000, max: 5000 },
        { label: '5,000 - 15,000 ETB', min: 5000, max: 15000 },
        { label: '15,000 - 50,000 ETB', min: 15000, max: 50000 },
        { label: 'Over 50,000 ETB', min: 50000, max: 100000 }
      ],
      ramOptions: ['2GB', '4GB', '6GB', '8GB', '12GB', '16GB', '32GB'],
      storageOptions: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'],
      screenSizes: ['5.5"', '6.1"', '6.5"', '6.7"', '7.0"', '7.5"'],
      cameraOptions: ['No Camera', '5MP', '8MP', '12MP', '16MP', '48MP', '64MP', '108MP'],
      batteryOptions: ['Under 3000mAh', '3000-4000mAh', '4000-5000mAh', 'Over 5000mAh'],
      processorOptions: ['Snapdragon', 'MediaTek', 'Exynos', 'Apple A', 'Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'AMD Ryzen'],
      conditions: ['New', 'Like New', 'Excellent', 'Good', 'Fair'],
      brands: ['Samsung', 'Apple', 'Xiaomi', 'Oppo', 'Vivo', 'Tecno', 'Huawei', 'Nokia', 'OnePlus', 'Realme'],
      sortOptions: [
        { value: 'relevance', label: 'Most Relevant' },
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' },
        { value: 'newest', label: 'Newest First' },
        { value: 'popular', label: 'Most Popular' },
        { value: 'rating', label: 'Highest Rated' },
        { value: 'discount', label: 'Biggest Discount' }
      ]
    };
  }

  // Save search
  saveSearch(name, query) {
    const search = {
      name,
      query,
      filters: { ...this.filters },
      timestamp: Date.now()
    };
    
    this.savedSearches.push(search);
    this.saveToLocalStorage('saved_searches', this.savedSearches);
  }

  // Load saved searches
  loadSavedSearches() {
    return this.loadFromLocalStorage('saved_searches') || [];
  }

  // Get search suggestions
  getSearchSuggestions(query) {
    const suggestions = [];
    
    // Get from search history
    const historySuggestions = this.getHistorySuggestions(query);
    suggestions.push(...historySuggestions);
    
    // Get from popular searches
    const popularSuggestions = this.getPopularSuggestions(query);
    suggestions.push(...popularSuggestions);
    
    // Get from saved searches
    const savedSuggestions = this.getSavedSuggestions(query);
    suggestions.push(...savedSuggestions);
    
    // Remove duplicates and limit
    return this.removeDuplicates(suggestions).slice(0, 10);
  }

  // Get history suggestions
  getHistorySuggestions(query) {
    return this.searchHistory
      .filter(search => search.query.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map(search => ({
        text: search.query,
        type: 'history'
      }));
  }

  // Get popular suggestions
  getPopularSuggestions(query) {
    const popularSearches = [
      'Samsung Galaxy S24', 'iPhone 15', 'Tecno Spark', 'Xiaomi Redmi', 'Oppo Find X',
      'Laptop Dell', 'HP Pavilion', 'MacBook Pro', 'iPad Pro', 'Samsung Tablet'
    ];
    
    return popularSearches
      .filter(search => search.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map(search => ({
        text: search,
        type: 'popular'
      }));
  }

  // Get saved suggestions
  getSavedSuggestions(query) {
    return this.savedSearches
      .filter(search => search.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 2)
      .map(search => ({
        text: search.name,
        type: 'saved'
      }));
  }

  // Remove duplicates
  removeDuplicates(items) {
    const seen = new Set();
    return items.filter(item => {
      const key = item.text.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
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

  // Clear all filters
  clearFilters() {
    this.filters = {
      price: { min: 0, max: 100000 },
      specifications: {
        ram: [],
        storage: [],
        screenSize: [],
        camera: [],
        battery: [],
        processor: []
      },
      condition: [],
      brand: [],
      seller: {
        rating: 0,
        location: '',
        verified: false
      },
      features: {
        waterproof: false,
        wireless: false,
        touchscreen: false,
        warranty: false,
        original: false
      },
      availability: 'all',
      sortBy: 'relevance'
    };
    
    return this.getFilterQueryString();
  }

  // Get active filters count
  getActiveFiltersCount() {
    let count = 0;
    
    if (this.filters.price.min > 0 || this.filters.price.max < 100000) count++;
    if (this.filters.specifications.ram.length > 0) count++;
    if (this.filters.specifications.storage.length > 0) count++;
    if (this.filters.condition.length > 0) count++;
    if (this.filters.brand.length > 0) count++;
    if (this.filters.seller.rating > 0 || this.filters.seller.verified) count++;
    if (this.filters.seller.location) count++;
    
    Object.values(this.filters.features).forEach(enabled => {
      if (enabled) count++;
    });
    
    return count;
  }
}

module.exports = AdvancedSearchFilters;
