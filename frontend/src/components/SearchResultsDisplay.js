import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchResultsDisplay.css';
import API from '../api';
import BackButton from './BackButton';

const SearchResultsDisplay = ({ searchTerm, filters, onProductSelect }) => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (searchTerm && searchTerm.length >= 2) {
      searchProducts();
    } else {
      setResults([]);
    }
  }, [searchTerm, filters]);

  const searchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await API.get('/products/search', {
        params: {
          q: searchTerm,
          category: filters.category,
          brand: filters.brand,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          ram: filters.ram,
          storage: filters.storage,
          condition: filters.condition,
          city: filters.city
        }
      });
      
      setResults(response.data.products || []);
    } catch (err) {
      setError('Failed to search products. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowDetails(true);
    
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedProduct(null);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('et-ET', {
      style: 'currency',
      currency: 'ETB'
    }).format(price);
  };

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'new': return '#28a745';
      case 'like new': return '#17a2b8';
      case 'good': return '#ffc107';
      case 'fair': return '#fd7e14';
      default: return '#6c757d';
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star full">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="search-results-display">
        <div className="search-loading">
          <div className="loading-spinner"></div>
          <p>Searching for electronics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="search-results-display">
        <div className="search-error">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button onClick={searchProducts} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (results.length === 0 && searchTerm && searchTerm.length >= 2) {
    return (
      <div className="search-results-display">
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No products found</h3>
          <p>No electronics found matching "{searchTerm}"</p>
          <div className="search-suggestions">
            <h4>Try searching for:</h4>
            <div className="suggestion-chips">
              <button onClick={() => navigate('/search?q=iPhone')}>iPhone</button>
              <button onClick={() => navigate('/search?q=Samsung')}>Samsung</button>
              <button onClick={() => navigate('/search?q=laptop')}>Laptop</button>
              <button onClick={() => navigate('/search?q=tablet')}>Tablet</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-display">
      {/* Search Results Header */}
      <div className="search-results-header">
        <BackButton text="← Back to Search" />
        <div className="results-info">
          <h3>Search Results</h3>
          <p>{results.length} products found for "{searchTerm}"</p>
        </div>
      </div>

      {/* Results Grid */}
      <div className="search-results-grid">
        {results.map((product) => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => handleProductClick(product)}
          >
            <div className="product-image">
              <img 
                src={product.image || '/api/placeholder/300/200'} 
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/api/placeholder/300/200';
                }}
              />
              <div className="product-badge" style={{ backgroundColor: getConditionColor(product.condition) }}>
                {product.condition || 'Good'}
              </div>
            </div>
            
            <div className="product-info">
              <h4 className="product-name">{product.name}</h4>
              <p className="product-brand">{product.brand}</p>
              
              <div className="product-specs">
                {product.ram && <span className="spec">{product.ram}</span>}
                {product.storage && <span className="spec">{product.storage}</span>}
                {product.screenSize && <span className="spec">{product.screenSize}"</span>}
                {product.color && <span className="spec">{product.color}</span>}
              </div>
              
              <div className="product-rating">
                <div className="stars">
                  {getRatingStars(product.rating || 4.5)}
                </div>
                <span className="rating-text">
                  ({product.reviews || 0} reviews)
                </span>
              </div>
              
              <div className="product-price-row">
                <div className="price-info">
                  <span className="current-price">{formatPrice(product.price)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="original-price">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
                <div className="discount-badge">
                  {product.discount && <span>-{product.discount}%</span>}
                </div>
              </div>
              
              <div className="product-location">
                <span className="location-icon">📍</span>
                <span>{product.city || 'Addis Ababa'}</span>
              </div>
            </div>
            
            <div className="product-actions">
              <button className="view-details-btn">
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Details Modal */}
      {showDetails && selectedProduct && (
        <div className="product-details-modal">
          <div className="modal-overlay" onClick={handleCloseDetails}></div>
          <div className="modal-content">
            <button className="close-modal" onClick={handleCloseDetails}>
              ×
            </button>
            
            <div className="product-details">
              <div className="product-details-image">
                <img 
                  src={selectedProduct.image || '/api/placeholder/400/300'} 
                  alt={selectedProduct.name}
                  onError={(e) => {
                    e.target.src = '/api/placeholder/400/300';
                  }}
                />
                <div className="image-gallery">
                  {/* Additional images would go here */}
                  <div className="thumbnail active">
                    <img src="/api/placeholder/80/80" alt="Thumbnail 1" />
                  </div>
                  <div className="thumbnail">
                    <img src="/api/placeholder/80/80" alt="Thumbnail 2" />
                  </div>
                  <div className="thumbnail">
                    <img src="/api/placeholder/80/80" alt="Thumbnail 3" />
                  </div>
                </div>
              </div>
              
              <div className="product-details-info">
                <h1>{selectedProduct.name}</h1>
                <p className="brand-name">{selectedProduct.brand}</p>
                
                <div className="details-rating">
                  <div className="stars">
                    {getRatingStars(selectedProduct.rating || 4.5)}
                  </div>
                  <span className="rating-text">
                    {selectedProduct.rating || 4.5} ({selectedProduct.reviews || 0} reviews)
                  </span>
                </div>
                
                <div className="details-price">
                  <span className="current-price">{formatPrice(selectedProduct.price)}</span>
                  {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                    <>
                      <span className="original-price">{formatPrice(selectedProduct.originalPrice)}</span>
                      <span className="discount-badge">-{Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}%</span>
                    </>
                  )}
                </div>
                
                <div className="product-description">
                  <h3>Description</h3>
                  <p>{selectedProduct.description || 'High-quality electronics product with excellent performance and reliability. Perfect for your daily needs.'}</p>
                </div>
                
                <div className="product-specifications">
                  <h3>Specifications</h3>
                  <div className="specs-grid">
                    {selectedProduct.ram && (
                      <div className="spec-item">
                        <span className="spec-label">RAM:</span>
                        <span className="spec-value">{selectedProduct.ram}</span>
                      </div>
                    )}
                    {selectedProduct.storage && (
                      <div className="spec-item">
                        <span className="spec-label">Storage:</span>
                        <span className="spec-value">{selectedProduct.storage}</span>
                      </div>
                    )}
                    {selectedProduct.screenSize && (
                      <div className="spec-item">
                        <span className="spec-label">Screen:</span>
                        <span className="spec-value">{selectedProduct.screenSize}</span>
                      </div>
                    )}
                    {selectedProduct.camera && (
                      <div className="spec-item">
                        <span className="spec-label">Camera:</span>
                        <span className="spec-value">{selectedProduct.camera}</span>
                      </div>
                    )}
                    {selectedProduct.battery && (
                      <div className="spec-item">
                        <span className="spec-label">Battery:</span>
                        <span className="spec-value">{selectedProduct.battery}</span>
                      </div>
                    )}
                    {selectedProduct.color && (
                      <div className="spec-item">
                        <span className="spec-label">Color:</span>
                        <span className="spec-value">{selectedProduct.color}</span>
                      </div>
                    )}
                    <div className="spec-item">
                      <span className="spec-label">Condition:</span>
                      <span className="spec-value" style={{ color: getConditionColor(selectedProduct.condition) }}>
                        {selectedProduct.condition || 'Good'}
                      </span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Location:</span>
                      <span className="spec-value">📍 {selectedProduct.city || 'Addis Ababa'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="seller-info">
                  <h3>Seller Information</h3>
                  <div className="seller-card">
                    <div className="seller-avatar">
                      <img src="/api/placeholder/50/50" alt="Seller" />
                    </div>
                    <div className="seller-details">
                      <h4>{selectedProduct.sellerName || 'Electronics Store'}</h4>
                      <div className="seller-rating">
                        <span className="rating">⭐ 4.8</span>
                        <span className="sales">234 sales</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="action-buttons">
                  <button className="contact-seller-btn">
                    💬 Contact Seller
                  </button>
                  <button className="add-to-cart-btn">
                    🛒 Add to Cart
                  </button>
                  <button className="buy-now-btn">
                    ⚡ Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResultsDisplay;
