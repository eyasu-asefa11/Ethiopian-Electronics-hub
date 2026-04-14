import React, { useState, useEffect, useRef } from 'react';
import './AdvancedSearch.css';
import './ProductPreviewCard.css';
import API from '../api';

const AdvancedSearch = ({ onSearch, onFilter, selectedCity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    priceRange: '',
    condition: '',
    sortBy: 'relevance'
  });

  // Helper functions for file and image handling
  const isValidImageUrl = (url) => {
    if (!url) return false;
    
    // Check if it's a valid URL format
    try {
      new URL(url);
      return true;
    } catch {
      // If not a valid URL, check if it's a data URL or blob URL
      return url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('http');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetail, setShowProductDetail] = useState(false);

  // Electronics categories for suggestions
  const electronicsCategories = [
    { value: 'phones', label: '📱 Phones', icon: '📱' },
    { value: 'laptops', label: '💻 Laptops', icon: '💻' },
    { value: 'tablets', label: '📱 Tablets', icon: '📱' },
    { value: 'accessories', label: '🎧 Accessories', icon: '🎧' },
    { value: 'smartwatches', label: '⌚ Smart Watches', icon: '⌚' },
    { value: 'cameras', label: '📷 Cameras', icon: '📷' },
    { value: 'gaming', label: '🎮 Gaming', icon: '🎮' },
    { value: 'audio', label: '🔊 Audio', icon: '🔊' }
  ];

  const popularBrands = [
    'Samsung', 'Apple', 'Xiaomi', 'Huawei', 'Oppo', 'Vivo', 
    'Tecno', 'Infinix', 'Itel', 'Nokia', 'Sony', 'LG', 'HTC', 'Motorola'
  ];

  const ramOptions = ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB'];
  const storageOptions = ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'];
  const conditionOptions = [
    { value: 'new', label: 'New' },
    { value: 'like_new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' }
  ];

  // Enhanced live search with immediate results
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Immediate live search - wait 200ms after user stops typing
    if (searchTerm.length > 0) {
      setIsSearching(true);
      const newTimeout = setTimeout(() => {
        fetchSuggestions();
        setSelectedSuggestionIndex(-1);
      }, 200); // Reduced from 300ms for faster response
      setSearchTimeout(newTimeout);
    } else {
      setSuggestions([]);
      setSelectedSuggestionIndex(-1);
      setIsSearching(false);
    }

    // Cleanup timeout on unmount
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTerm]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Handle clicks outside suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-input-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSuggestions]);

  const fetchSuggestions = () => {
    try {
      // Get all products from localStorage
      const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
      const allProducts = [];
      
      shops.forEach(shop => {
        if (shop.products && shop.products.length > 0) {
          shop.products.forEach(product => {
            allProducts.push({
              ...product,
              shop_name: shop.electronicsHouseName || shop.shopName,
              city: shop.city || 'Unknown'
            });
          });
        }
      });

      // Add sample products if no registered products found
      if (allProducts.length === 0) {
        const sampleProducts = [
          {
            id: '1',
            name: 'HP Laptop 15',
            brand: 'HP',
            model: 'Laptop 15',
            category: 'Laptops',
            ram: '8GB',
            storage: '512GB SSD',
            battery: '3-cell 41 Wh',
            camera: 'HD Webcam',
            price: 25000,
            shop_name: 'Abebe Electronics',
            city: 'Dilla',
            condition: 'New',
            description: 'High-performance HP laptop perfect for work and study'
          },
          {
            id: '2',
            name: 'HP Pavilion Desktop',
            brand: 'HP',
            model: 'P Pavilion',
            category: 'Computers',
            ram: '16GB',
            storage: '1TB HDD',
            battery: 'N/A',
            camera: 'N/A',
            price: 35000,
            shop_name: 'Mekelle Tech',
            city: 'Mekelle',
            condition: 'New',
            description: 'Powerful HP desktop computer for home and office use'
          },
          {
            id: '3',
            name: 'HP EliteBook 840',
            brand: 'HP',
            model: 'EliteBook 840',
            category: 'Laptops',
            ram: '16GB',
            storage: '256GB SSD',
            battery: '3-cell 51 Wh',
            camera: 'HD Webcam',
            price: 45000,
            shop_name: 'Addis Computers',
            city: 'Addis Abeba',
            condition: 'Like New',
            description: 'Business-class HP EliteBook with premium features'
          }
        ];
        
        allProducts.push(...sampleProducts);
      }

      // Enhanced filtering for live search
      const filteredSuggestions = allProducts.filter(product => {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = product.name && product.name.toLowerCase().includes(searchLower);
        const brandMatch = product.brand && product.brand.toLowerCase().includes(searchLower);
        const categoryMatch = product.category && product.category.toLowerCase().includes(searchLower);
        const descriptionMatch = product.description && product.description.toLowerCase().includes(searchLower);
        const modelMatch = product.model && product.model.toLowerCase().includes(searchLower);
        const shopMatch = product.shop_name && product.shop_name.toLowerCase().includes(searchLower);
        const cityMatch = product.city && product.city.toLowerCase().includes(searchLower);
        
        return nameMatch || brandMatch || categoryMatch || descriptionMatch || modelMatch || shopMatch || cityMatch;
      });

      // Enhanced sorting for better relevance
      const sortedSuggestions = filteredSuggestions
        .slice(0, 10) // Increased from 8 to 10
        .sort((a, b) => {
          const searchLower = searchTerm.toLowerCase();
          const aNameLower = (a.name || '').toLowerCase();
          const bNameLower = (b.name || '').toLowerCase();
          const aBrandLower = (a.brand || '').toLowerCase();
          const bBrandLower = (b.brand || '').toLowerCase();
          
          // Priority 1: Exact name match
          const aExactName = aNameLower === searchLower;
          const bExactName = bNameLower === searchLower;
          if (aExactName && !bExactName) return -1;
          if (!aExactName && bExactName) return 1;
          
          // Priority 2: Name starts with search
          const aNameStarts = aNameLower.startsWith(searchLower);
          const bNameStarts = bNameLower.startsWith(searchLower);
          if (aNameStarts && !bNameStarts) return -1;
          if (!aNameStarts && bNameStarts) return 1;
          
          // Priority 3: Brand starts with search
          const aBrandStarts = aBrandLower.startsWith(searchLower);
          const bBrandStarts = bBrandLower.startsWith(searchLower);
          if (aBrandStarts && !bBrandStarts) return -1;
          if (!aBrandStarts && bBrandStarts) return 1;
          
          // Priority 4: Alphabetical order
          return aNameLower.localeCompare(bNameLower);
        });

      setSuggestions(sortedSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search form submitted!');
    console.log('Search term:', searchTerm);
    console.log('Filters:', filters);
    console.log('Selected city:', selectedCity);
    performSearch();
  };

  const performSearch = () => {
    console.log('=== PERFORMING SEARCH ===');
    const searchParams = {
      q: searchTerm,
      city: selectedCity?.id || null,
      ...filters
    };
    
    console.log('Search params before cleanup:', searchParams);
    
    // Remove empty filters
    Object.keys(searchParams).forEach(key => {
      if (!searchParams[key] || searchParams[key] === '') {
        delete searchParams[key];
      }
    });
    
    console.log('Final search params:', searchParams);
    console.log('Calling onSearch with:', searchParams);
    
    onSearch(searchParams);
    setShowSuggestions(false);
    console.log('========================');
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleSuggestionClick = (suggestion) => {
    console.log('Clicked suggestion:', suggestion);
    console.log('Setting selectedProduct to:', suggestion);
    setSelectedProduct(suggestion);
    setShowProductDetail(true);
    setShowSuggestions(false);
  };

  const closeProductDetail = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
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
      sortBy: 'relevance'
    });
    setSearchTerm('');
    onSearch({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <>
      <div className="advanced-search">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-main">
            <div className="search-input-wrapper">
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search by model, brand, or specs... (e.g., 'Samsung A057F 4GB RAM')"
                  value={searchTerm}
                  onChange={(e) => {
                  console.log('Input changed:', e.target.value);
                  setSearchTerm(e.target.value);
                }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  className={`search-input ${isSearching ? 'searching' : ''}`}
                />
                {isSearching && (
                  <div className="search-loading">
                    <div className="loading-spinner"></div>
                  </div>
                )}
              </div>
              <button type="submit" className="search-button">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                Search
              </button>
            </div>

            {showSuggestions && (
              <div className="search-suggestions">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion.id || index}
                      className={`suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseEnter={() => setSelectedSuggestionIndex(index)}
                    >
                      <div className="suggestion-info">
                        <span className="suggestion-name">{suggestion.name}</span>
                        <span className="suggestion-details">
                          {suggestion.brand} • {suggestion.category} • {suggestion.shop_name} • {suggestion.city}
                        </span>
                      </div>
                      <span className="suggestion-price">{suggestion.price ? `${suggestion.price.toLocaleString()} ETB` : 'Price TBD'}</span>
                    </div>
                  ))
                ) : searchTerm.length > 0 && !isSearching && (
                  <div className="no-suggestions">
                    <div className="no-results-icon">🔍</div>
                    <div className="no-results-text">
                      <strong>No products found</strong>
                      <span>Try different keywords or browse categories</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="search-controls">
            {selectedCity && (
              <div className="selected-city-info">
                <span className="city-label">City:</span>
                <span className="city-name">{selectedCity}</span>
              </div>
            )}
          </div>
        </form>
      </div>

      {showProductDetail && selectedProduct && (
        <div className="product-preview-card">
          <div className="product-preview-header">
            <h3 className="product-preview-title">Product Details</h3>
            <button className="close-preview-btn" onClick={closeProductDetail}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="product-preview-content">
            <div className="product-preview-image">
              {selectedProduct.image && isValidImageUrl(selectedProduct.image) ? (
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="preview-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div className="preview-image-placeholder" style={{display: 'flex'}}>
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                  </svg>
                  <span>No Image Available</span>
                </div>
              )}
            </div>

            {/* Additional Images Gallery */}
            {(selectedProduct.frontImage || selectedProduct.backImage || 
              (selectedProduct.shopGallery && selectedProduct.shopGallery.length > 0)) && (
              <div className="product-additional-images">
                <h5>Additional Images</h5>
                <div className="additional-images-grid">
                  {selectedProduct.frontImage && isValidImageUrl(selectedProduct.frontImage) && (
                    <div className="additional-image-item">
                      <img 
                        src={selectedProduct.frontImage} 
                        alt="Front view"
                        className="additional-image"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <span>Front</span>
                    </div>
                  )}
                  
                  {selectedProduct.backImage && isValidImageUrl(selectedProduct.backImage) && (
                    <div className="additional-image-item">
                      <img 
                        src={selectedProduct.backImage} 
                        alt="Back view"
                        className="additional-image"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <span>Back</span>
                    </div>
                  )}
                  
                  {selectedProduct.shopGallery && selectedProduct.shopGallery.map((img, index) => (
                    isValidImageUrl(img) && (
                      <div key={index} className="additional-image-item">
                        <img 
                          src={img} 
                          alt={`Gallery ${index + 1}`}
                          className="additional-image"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                        <span>View {index + 1}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Videos Section */}
            {selectedProduct.shopVideos && selectedProduct.shopVideos.length > 0 && (
              <div className="product-videos">
                <h5>Product Videos</h5>
                <div className="videos-grid">
                  {selectedProduct.shopVideos.map((video, index) => (
                    <div key={index} className="video-item">
                      <video controls width="150" height="100">
                        <source src={video.preview || video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <span>Video {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warranty Documents Section */}
            {selectedProduct.warrantyDocuments && selectedProduct.warrantyDocuments.length > 0 && (
              <div className="product-documents">
                <h5>📄 Warranty Documents</h5>
                <div className="documents-list">
                  {selectedProduct.warrantyDocuments.map((doc, index) => (
                    <div key={index} className="document-item">
                      <div className="document-icon">📄</div>
                      <div className="document-info">
                        <span className="document-name">{doc.name}</span>
                        <span className="document-size">{formatFileSize(doc.size)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="product-preview-details">
              <h4 className="preview-product-name">{selectedProduct.name}</h4>
              <div style={{color: 'red', fontSize: '12px', marginBottom: '10px'}}>
                DEBUG: {selectedProduct.name} - {selectedProduct.brand} - {selectedProduct.model}
              </div>
              
              <div className="preview-specs-grid">
                {selectedProduct.brand && (
                  <div className="preview-spec-item">
                    <span className="preview-spec-label">Brand:</span>
                    <span className="preview-spec-value">{selectedProduct.brand}</span>
                  </div>
                )}
                
                {selectedProduct.model && (
                  <div className="preview-spec-item">
                    <span className="preview-spec-label">Model:</span>
                    <span className="preview-spec-value">{selectedProduct.model}</span>
                  </div>
                )}
                
                {selectedProduct.ram && (
                  <div className="preview-spec-item">
                    <span className="preview-spec-label">RAM:</span>
                    <span className="preview-spec-value">{selectedProduct.ram}</span>
                  </div>
                )}
                
                {selectedProduct.storage && (
                  <div className="preview-spec-item">
                    <span className="preview-spec-label">Storage:</span>
                    <span className="preview-spec-value">{selectedProduct.storage}</span>
                  </div>
                )}
                
                {selectedProduct.camera && (
                  <div className="preview-spec-item">
                    <span className="preview-spec-label">Camera:</span>
                    <span className="preview-spec-value">{selectedProduct.camera}</span>
                  </div>
                )}
                
                {selectedProduct.battery && (
                  <div className="preview-spec-item">
                    <span className="preview-spec-label">Battery:</span>
                    <span className="preview-spec-value">{selectedProduct.battery}</span>
                  </div>
                )}
              </div>

              <div className="preview-shop-info">
                <div className="preview-price">
                  <span className="preview-price-label">Price:</span>
                  <span className="preview-price-value">
                    {selectedProduct.price ? `${selectedProduct.price.toLocaleString()} ETB` : 'Price TBD'}
                  </span>
                </div>
                
                <div className="preview-shop">
                  <span className="preview-shop-label">Shop:</span>
                  <span className="preview-shop-value">{selectedProduct.shop_name}</span>
                </div>
                
                <div className="preview-city">
                  <span className="preview-city-label">City:</span>
                  <span className="preview-city-value">{selectedProduct.city}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="product-preview-actions">
            <button className="preview-contact-btn" onClick={() => {
              console.log('Contact shop:', selectedProduct.shop_name);
            }}>
              📞 Contact Shop
            </button>
            <button className="preview-view-btn" onClick={() => {
              console.log('View shop:', selectedProduct.shop_name);
            }}>
              🏪 View Shop
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdvancedSearch;
