import React, { useState, useEffect } from 'react';
import './AdvancedSearchEnhanced.css';
import API from '../api';
import BackButton from './BackButton';
import SearchResultsDisplay from './SearchResultsDisplay';

const AdvancedSearchEnhanced = ({ onSearch, selectedCity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    ram: '',
    storage: '',
    condition: '',
    city: selectedCity?.id || ''
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Phones', 'Tablets', 'Laptops', 'Accessories', 
    'Smart Watches', 'Cameras', 'Gaming', 'Audio'
  ];

  const brands = [
    'Samsung', 'Apple', 'Huawei', 'Xiaomi', 'Oppo', 
    'Vivo', 'Tecno', 'Infinix', 'Nokia', 'Sony'
  ];

  const ramOptions = ['1GB', '2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB'];
  const storageOptions = ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'];
  const conditions = ['New', 'Like New', 'Good', 'Fair'];

  useEffect(() => {
    if (searchTerm.length >= 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const fetchSuggestions = async () => {
    if (searchTerm.length < 2) return;

    setLoading(true);
    try {
      const response = await API.get('/products/suggestions', {
        params: { q: searchTerm, city: filters.city }
      });
      setSuggestions(response.data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setShowResults(true);
      if (onSearch) {
        onSearch(searchTerm, filters);
      }
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleBackToSearch = () => {
    setShowResults(false);
    setSelectedProduct(null);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.name);
    setShowSuggestions(false);
    handleSearch();
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      ram: '',
      storage: '',
      condition: '',
      city: selectedCity?.id || ''
    });
    setSearchTerm('');
  };

  return (
    <div className="advanced-search-enhanced">
      {showResults ? (
        <SearchResultsDisplay 
          searchTerm={searchTerm}
          filters={filters}
          onProductSelect={handleProductSelect}
        />
      ) : (
        <>
          {/* Back Button */}
          <BackButton 
            text="← Back to Products"
            variant="default"
            size="medium"
          />

          {/* Search Header */}
          <div className="search-header">
            <h2>Find Electronics in Ethiopia</h2>
            <p>Search by model, brand, specifications, or browse by category</p>
          </div>

      {/* Main Search Bar */}
      <div className="search-bar-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for products... (e.g., Samsung A057F 4GB RAM)"
            className="search-input"
          />
          <button onClick={handleSearch} className="search-btn">
            🔍 Search
          </button>
        </div>

        {/* Live Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="suggestion-info">
                  <div className="suggestion-name">{suggestion.name}</div>
                  <div className="suggestion-details">
                    {suggestion.brand && <span className="brand">{suggestion.brand}</span>}
                    {suggestion.ram && <span className="spec">{suggestion.ram}</span>}
                    {suggestion.storage && <span className="spec">{suggestion.storage}</span>}
                    <span className="price">{suggestion.price} ETB</span>
                  </div>
                  <div className="suggestion-shop">
                    {suggestion.shop_name} • {suggestion.city_name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      <div className="filters-section">
        <div className="filters-header">
          <h3>Advanced Filters</h3>
          <button onClick={clearFilters} className="clear-filters">
            Clear All
          </button>
        </div>

        <div className="filters-grid">
          {/* Category Filter */}
          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="filter-group">
            <label>Brand</label>
            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <label>Price Range (ETB)</label>
            <div className="price-range">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>
          </div>

          {/* RAM Filter */}
          <div className="filter-group">
            <label>RAM</label>
            <select
              value={filters.ram}
              onChange={(e) => handleFilterChange('ram', e.target.value)}
            >
              <option value="">Any RAM</option>
              {ramOptions.map(ram => (
                <option key={ram} value={ram}>
                  {ram}
                </option>
              ))}
            </select>
          </div>

          {/* Storage Filter */}
          <div className="filter-group">
            <label>Storage</label>
            <select
              value={filters.storage}
              onChange={(e) => handleFilterChange('storage', e.target.value)}
            >
              <option value="">Any Storage</option>
              {storageOptions.map(storage => (
                <option key={storage} value={storage}>
                  {storage}
                </option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div className="filter-group">
            <label>Condition</label>
            <select
              value={filters.condition}
              onChange={(e) => handleFilterChange('condition', e.target.value)}
            >
              <option value="">Any Condition</option>
              {conditions.map(condition => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="active-filters">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            
            const getDisplayValue = (key, value) => {
              switch (key) {
                case 'minPrice': return `Min: ${value} ETB`;
                case 'maxPrice': return `Max: ${value} ETB`;
                default: return value;
              }
            };

            return (
              <span key={key} className="active-filter">
                {getDisplayValue(key, value)}
                <button onClick={() => handleFilterChange(key, '')}>×</button>
              </span>
            );
          })}
        </div>
      </div>

      {/* Quick Search Examples */}
      <div className="search-examples">
        <h4>Popular Searches:</h4>
        <div className="example-searches">
          <button 
            onClick={() => { setSearchTerm('Samsung A057F'); handleSearch(); }}
            className="example-btn"
          >
            Samsung A057F
          </button>
          <button 
            onClick={() => { setSearchTerm('iPhone 13'); handleSearch(); }}
            className="example-btn"
          >
            iPhone 13
          </button>
          <button 
            onClick={() => { setSearchTerm('4GB RAM'); handleSearch(); }}
            className="example-btn"
          >
            4GB RAM Phones
          </button>
          <button 
            onClick={() => { setSearchTerm('128GB storage'); handleSearch(); }}
            className="example-btn"
          >
            128GB Storage
          </button>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default AdvancedSearchEnhanced;
