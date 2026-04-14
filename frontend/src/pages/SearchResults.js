import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CitySelector from '../components/CitySelector';
import AdvancedSearch from '../components/AdvancedSearch';
import './SearchResults.css';
import API from '../api';

const SearchResults = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchParams, setSearchParams] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    // Get search params from navigation state or URL
    const params = location.state || {};
    const urlParams = new URLSearchParams(location.search);
    
    const initialParams = {
      q: params.q || urlParams.get('q') || '',
      category: params.category || urlParams.get('category') || '',
      brand: params.brand || urlParams.get('brand') || '',
      city: params.city || urlParams.get('city') || '',
      ram: params.ram || urlParams.get('ram') || '',
      storage: params.storage || urlParams.get('storage') || '',
      condition: params.condition || urlParams.get('condition') || '',
      minPrice: params.minPrice || urlParams.get('minPrice') || '',
      maxPrice: params.maxPrice || urlParams.get('maxPrice') || '',
      sortBy: params.sortBy || 'relevance'
    };
    
    setSearchParams(initialParams);
    setSortBy(initialParams.sortBy);
    
    // Set city if provided
    if (initialParams.city) {
      fetchCityById(initialParams.city);
    }
    
    // Perform search
    performSearch(initialParams);
  }, [location]);

  const fetchCityById = async (cityId) => {
    try {
      const response = await API.get(`/cities/${cityId}`);
      setSelectedCity(response.data);
    } catch (error) {
      console.error('Error fetching city:', error);
    }
  };

  const performSearch = async (params, page = 1) => {
    try {
      setLoading(true);
      
      const searchQuery = {
        ...params,
        page,
        limit: pagination.limit,
        sortBy: sortBy
      };
      
      const response = await API.get('/products/search', { params: searchQuery });
      
      setProducts(response.data);
      
      // Update pagination (you might need to get total count from API)
      setPagination(prev => ({
        ...prev,
        page,
        total: response.data.length, // This should come from API headers or separate endpoint
        totalPages: Math.ceil(response.data.length / pagination.limit)
      }));
      
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params) => {
    const newParams = { ...params, sortBy };
    setSearchParams(newParams);
    performSearch(newParams, 1);
    
    // Update URL
    const urlParams = new URLSearchParams();
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) urlParams.set(key, value);
    });
    navigate(`/search?${urlParams.toString()}`, { state: newParams, replace: true });
  };

  const handleFilter = (filters) => {
    const newParams = { ...searchParams, ...filters, sortBy };
    setSearchParams(newParams);
    performSearch(newParams, 1);
  };

  const handleSort = (newSortBy) => {
    setSortBy(newSortBy);
    const newParams = { ...searchParams, sortBy: newSortBy };
    setSearchParams(newParams);
    performSearch(newParams, pagination.page);
  };

  const handlePageChange = (newPage) => {
    performSearch(searchParams, newPage);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    const cityId = city ? city.id : null;
    handleSearch({ ...searchParams, city: cityId });
  };

  const getActiveFiltersCount = () => {
    return Object.entries(searchParams).filter(([key, value]) => 
      key !== 'q' && key !== 'sortBy' && value
    ).length;
  };

  const clearAllFilters = () => {
    const clearedParams = { q: searchParams.q, sortBy: 'relevance' };
    setSearchParams(clearedParams);
    performSearch(clearedParams, 1);
  };

  return (
    <div className="search-results">
      {/* Search Header */}
      <div className="search-header">
        <div className="container">
          <div className="search-controls">
            <CitySelector 
              selectedCity={selectedCity}
              onCityChange={handleCityChange}
              showAllOption={true}
            />
          </div>
          
          <AdvancedSearch 
            onSearch={handleSearch}
            onFilter={handleFilter}
            selectedCity={selectedCity}
          />
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        <div className="container">
          <div className="results-header">
            <div className="results-info">
              <h1>
                {searchParams.q ? `"${searchParams.q}"` : 'Products'}
                {selectedCity && ` in ${selectedCity.name}`}
              </h1>
              <p className="results-count">
                {loading ? 'Searching...' : `${products.length} products found`}
              </p>
            </div>
            
            <div className="results-controls">
              <div className="sort-control">
                <label>Sort by:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => handleSort(e.target.value)}
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
              
              {getActiveFiltersCount() > 0 && (
                <button className="clear-filters-btn" onClick={clearAllFilters}>
                  Clear Filters ({getActiveFiltersCount()})
                </button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {getActiveFiltersCount() > 0 && (
            <div className="active-filters">
              <span className="filters-label">Active Filters:</span>
              <div className="filter-tags">
                {searchParams.category && (
                  <span className="filter-tag">
                    Category: {searchParams.category}
                    <button onClick={() => handleFilter({ category: '' })}>×</button>
                  </span>
                )}
                {searchParams.brand && (
                  <span className="filter-tag">
                    Brand: {searchParams.brand}
                    <button onClick={() => handleFilter({ brand: '' })}>×</button>
                  </span>
                )}
                {searchParams.ram && (
                  <span className="filter-tag">
                    RAM: {searchParams.ram}
                    <button onClick={() => handleFilter({ ram: '' })}>×</button>
                  </span>
                )}
                {searchParams.storage && (
                  <span className="filter-tag">
                    Storage: {searchParams.storage}
                    <button onClick={() => handleFilter({ storage: '' })}>×</button>
                  </span>
                )}
                {searchParams.condition && (
                  <span className="filter-tag">
                    Condition: {searchParams.condition}
                    <button onClick={() => handleFilter({ condition: '' })}>×</button>
                  </span>
                )}
                {searchParams.minPrice && (
                  <span className="filter-tag">
                    Min: {searchParams.minPrice} ETB
                    <button onClick={() => handleFilter({ minPrice: '' })}>×</button>
                  </span>
                )}
                {searchParams.maxPrice && (
                  <span className="filter-tag">
                    Max: {searchParams.maxPrice} ETB
                    <button onClick={() => handleFilter({ maxPrice: '' })}>×</button>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Finding the best electronics for you...</p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && (
            <div className="products-grid">
              {products.length > 0 ? (
                products.map((product) => (
                  <div 
                    key={product.id}
                    className="product-card"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="product-image">
                      <img 
                        src={product.images?.[0] || product.image || '/placeholder-product.png'} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = '/placeholder-product.png';
                        }}
                      />
                      {product.discount_percentage > 0 && (
                        <div className="discount-badge">
                          -{product.discount_percentage}%
                        </div>
                      )}
                      {product.is_featured && (
                        <div className="featured-badge">⭐ Featured</div>
                      )}
                    </div>
                    
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-brand">{product.brand}</p>
                      {product.model && (
                        <p className="product-model">Model: {product.model}</p>
                      )}
                      
                      <div className="product-specs">
                        {product.ram && <span className="spec">{product.ram}</span>}
                        {product.storage && <span className="spec">{product.storage}</span>}
                        {product.condition && <span className="spec">{product.condition}</span>}
                      </div>
                      
                      <div className="product-price">
                        <span className="current-price">{product.price.toLocaleString()} ETB</span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="original-price">{product.original_price.toLocaleString()} ETB</span>
                        )}
                      </div>
                      
                      <div className="product-meta">
                        <span className="shop-name">{product.shop_name}</span>
                        <span className="location">📍 {product.city_name}</span>
                        {product.shop_rating && (
                          <span className="rating">⭐ {product.shop_rating}</span>
                        )}
                      </div>
                      
                      {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                        <div className="low-stock">
                          Only {product.stock_quantity} left!
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h2>No products found</h2>
                  <p>Try adjusting your search or filters to find what you're looking for.</p>
                  <div className="no-results-actions">
                    <button 
                      className="clear-search-btn"
                      onClick={() => handleSearch({})}
                    >
                      Clear Search
                    </button>
                    <button 
                      className="broaden-search-btn"
                      onClick={() => {
                        const broadened = { ...searchParams };
                        delete broadened.category;
                        delete broadened.brand;
                        delete broadened.ram;
                        delete broadened.storage;
                        handleSearch(broadened);
                      }}
                    >
                      Broaden Search
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && products.length > 0 && pagination.totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`page-number ${pagination.page === pageNum ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {pagination.totalPages > 5 && (
                  <>
                    <span className="page-ellipsis">...</span>
                    <button
                      className={`page-number ${pagination.page === pagination.totalPages ? 'active' : ''}`}
                      onClick={() => handlePageChange(pagination.totalPages)}
                    >
                      {pagination.totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button 
                className="pagination-btn"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
