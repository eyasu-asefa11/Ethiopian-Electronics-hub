// Abel's Complete Buyer Workflow
// This demonstrates the exact user journey from website visit to product view

import React, { useState, useEffect } from 'react';
import './BuyerWorkflow.css';

const BuyerWorkflow = () => {
  const [currentStep, setCurrentStep] = useState('city-selection');
  const [selectedCity, setSelectedCity] = useState('all-cities');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const ethiopianCities = [
    { id: 'addis_ababa', name: 'Addis Ababa', name_am: 'አዲስ አበባ' },
    { id: 'hawassa', name: 'Hawassa', name_am: 'ሀዋሳ' },
    { id: 'dilla', name: 'Dilla', name_am: 'ዲላ' },
    { id: 'bahir_dar', name: 'Bahir Dar', name_am: 'ባህር ዳር' },
    { id: 'hossana', name: 'Hossana', name_am: 'ሆሳዕና' }
  ];

  const mockSearchResults = [
    {
      id: 1,
      name: 'Tecno Spark 10',
      brand: 'Tecno',
      model: 'KI5K',
      price: 12500,
      original_price: 14000,
      stock_quantity: 5,
      shop_name: 'Abeba Electronics',
      shop_city: 'Dilla',
      shop_rating: 4.5,
      shop_verified: true,
      images: ['/products/tecno-spark-10-front.jpg'],
      specifications: {
        ram: '4GB',
        storage: '128GB',
        battery: '5000mAh',
        camera: '50MP',
        screen_size: '6.6 inch',
        color: 'Black'
      }
    },
    {
      id: 2,
      name: 'Tecno Spark 10',
      brand: 'Tecno',
      model: 'KI5K',
      price: 12800,
      original_price: 14500,
      stock_quantity: 3,
      shop_name: 'Sidama Mobile',
      shop_city: 'Hawassa',
      shop_rating: 4.2,
      shop_verified: false,
      images: ['/products/tecno-spark-10-front.jpg'],
      specifications: {
        ram: '4GB',
        storage: '128GB',
        battery: '5000mAh',
        camera: '50MP',
        screen_size: '6.6 inch',
        color: 'Black'
      }
    }
  ];

  const handleCitySelection = (cityId) => {
    setSelectedCity(cityId);
    setTimeout(() => setCurrentStep('product-search'), 500);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchResults(mockSearchResults);
      setTimeout(() => setCurrentStep('search-results'), 500);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setTimeout(() => setCurrentStep('product-detail'), 500);
  };

  const renderCitySelection = () => (
    <div className="workflow-step city-selection">
      <div className="step-header">
        <h2>🌍 Welcome to Ethiopian Electronics</h2>
        <p>Find electronics shops and products across Ethiopia</p>
      </div>

      <div className="city-selection-container">
        <h3>📍 Select Your City</h3>
        <div className="cities-grid">
          {ethiopianCities.map(city => (
            <button
              key={city.id}
              className="city-card"
              onClick={() => handleCitySelection(city.id)}
            >
              <div className="city-icon">🏙️</div>
              <div className="city-name">{city.name}</div>
              <div className="city-name-am">{city.name_am}</div>
            </button>
          ))}
          
          <button
            className="city-card all-cities"
            onClick={() => handleCitySelection('all-cities')}
          >
            <div className="city-icon">🇪🇹</div>
            <div className="city-name">View All Cities</div>
            <div className="city-name-am">ሁሉኣ ከተማዛ</div>
          </button>
        </div>

        <div className="selection-info">
          <p>Abel chooses: <strong>View All Cities</strong></p>
          <p>Because he wants to search nationwide</p>
        </div>
      </div>
    </div>
  );

  const renderProductSearch = () => (
    <div className="workflow-step product-search">
      <div className="step-header">
        <h2>🔍 Search for Electronics</h2>
        <p>Searching in: {selectedCity === 'all-cities' ? 'All Ethiopia' : ethiopianCities.find(c => c.id === selectedCity)?.name}</p>
      </div>

      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, brand, or model..."
            className="search-input"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="search-btn">
            🔍 Search
          </button>
        </div>

        <div className="search-suggestions">
          <h4>Popular Searches:</h4>
          <div className="suggestions">
            <span onClick={() => setSearchQuery('Tecno Spark 10')}>Tecno Spark 10</span>
            <span onClick={() => setSearchQuery('Samsung Galaxy A05')}>Samsung Galaxy A05</span>
            <span onClick={() => setSearchQuery('iPhone 13')}>iPhone 13</span>
            <span onClick={() => setSearchQuery('Laptop under 20000')}>Laptop under 20000</span>
          </div>
        </div>

        <div className="search-info">
          <p>Abel searches for: <strong>"Tecno Spark 10"</strong></p>
          <p>The system searches all shops nationwide</p>
        </div>
      </div>
    </div>
  );

  const renderSearchResults = () => (
    <div className="workflow-step search-results">
      <div className="step-header">
        <h2>📱 Search Results</h2>
        <p>Found {searchResults.length} products for "{searchQuery}"</p>
      </div>

      <div className="results-container">
        <div className="results-grid">
          {searchResults.map((product, index) => (
            <div key={product.id} className="result-card">
              <div className="result-header">
                <h3>{product.name}</h3>
                <div className="result-badges">
                  {product.shop_verified && <span className="badge verified">✓ Verified</span>}
                  {product.original_price > product.price && (
                    <span className="badge discount">
                      {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                    </span>
                  )}
                </div>
              </div>

              <div className="result-image">
                <img src={product.images[0]} alt={product.name} />
                <div className="image-placeholder">📱</div>
              </div>

              <div className="result-details">
                <div className="shop-info">
                  <span className="shop-name">🏪 {product.shop_name}</span>
                  <span className="shop-city">📍 {product.shop_city}</span>
                </div>

                <div className="price-info">
                  <span className="current-price">ETB {product.price.toLocaleString()}</span>
                  {product.original_price > product.price && (
                    <span className="original-price">ETB {product.original_price.toLocaleString()}</span>
                  )}
                </div>

                <div className="stock-info">
                  <span className={`stock ${product.stock_quantity > 0 ? 'available' : 'out-of-stock'}`}>
                    {product.stock_quantity > 0 ? `📦 ${product.stock_quantity} in stock` : '❌ Out of stock'}
                  </span>
                </div>

                <div className="rating-info">
                  <span className="rating">
                    {'⭐'.repeat(Math.round(product.shop_rating))}
                  </span>
                  <span className="rating-number">({product.shop_rating})</span>
                </div>
              </div>

              <div className="result-actions">
                <button 
                  onClick={() => handleProductClick(product)}
                  className="view-product-btn"
                >
                  👁️ View Details
                </button>
                <button className="contact-shop-btn">
                  💬 Contact Shop
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="comparison-info">
          <h3>📊 Price Comparison</h3>
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Shop</th>
                  <th>City</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map(product => (
                  <tr key={product.id} className={product.price === Math.min(...searchResults.map(p => p.price)) ? 'best-price' : ''}>
                    <td>{product.shop_name}</td>
                    <td>{product.shop_city}</td>
                    <td className="price">ETB {product.price.toLocaleString()}</td>
                    <td>{product.stock_quantity}</td>
                    <td>{'⭐'.repeat(Math.round(product.shop_rating))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="comparison-summary">
            <p><strong>Best Price:</strong> Abeba Electronics (ETB 12,500)</p>
            <p><strong>Abel's Choice:</strong> Clicks Abeba Electronics product</p>
            <p><strong>Savings:</strong> ETB 300 compared to Hawassa shop</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProductDetail = () => {
    if (!selectedProduct) return null;

    return (
      <div className="workflow-step product-detail">
        <div className="step-header">
          <h2>📱 {selectedProduct.name}</h2>
          <p>Sold by {selectedProduct.shop_name} in {selectedProduct.shop_city}</p>
        </div>

        {/* Top Section - Product Images */}
        <div className="product-images-section">
          <h3>📸 Product Images</h3>
          <div className="images-gallery">
            <div className="main-image">
              <img src={selectedProduct.images[0]} alt={selectedProduct.name} />
              <div className="image-placeholder main">📱 Front View</div>
            </div>
            <div className="image-thumbnails">
              <div className="thumbnail active">
                <div className="thumb-placeholder">📱 Front</div>
              </div>
              <div className="thumbnail">
                <div className="thumb-placeholder">📱 Back</div>
              </div>
              <div className="thumbnail">
                <div className="thumb-placeholder">📱 Side</div>
              </div>
              <div className="thumbnail">
                <div className="thumb-placeholder">📱 Interface</div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section - Specifications */}
        <div className="product-specs-section">
          <h3>📋 Specifications</h3>
          <div className="specs-table">
            <table>
              <tbody>
                <tr>
                  <td>Brand</td>
                  <td>{selectedProduct.brand}</td>
                </tr>
                <tr>
                  <td>Model</td>
                  <td>{selectedProduct.model}</td>
                </tr>
                <tr>
                  <td>RAM</td>
                  <td>{selectedProduct.specifications.ram}</td>
                </tr>
                <tr>
                  <td>Storage</td>
                  <td>{selectedProduct.specifications.storage}</td>
                </tr>
                <tr>
                  <td>Battery</td>
                  <td>{selectedProduct.specifications.battery}</td>
                </tr>
                <tr>
                  <td>Camera</td>
                  <td>{selectedProduct.specifications.camera}</td>
                </tr>
                <tr>
                  <td>Screen Size</td>
                  <td>{selectedProduct.specifications.screen_size}</td>
                </tr>
                <tr>
                  <td>Color</td>
                  <td>{selectedProduct.specifications.color}</td>
                </tr>
                <tr className="price-row">
                  <td>Price</td>
                  <td className="price">ETB {selectedProduct.price.toLocaleString()}</td>
                </tr>
                <tr className="stock-row">
                  <td>Stock</td>
                  <td className="stock">{selectedProduct.stock_quantity} units available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Section - Shop Information */}
        <div className="shop-info-section">
          <h3>🏪 Shop Information</h3>
          <div className="shop-details">
            <div className="shop-header">
              <div className="shop-name">
                <h4>{selectedProduct.shop_name}</h4>
                {selectedProduct.shop_verified && (
                  <span className="verified-badge">✓ Verified Shop</span>
                )}
              </div>
              <div className="shop-rating">
                <span className="stars">
                  {'⭐'.repeat(Math.round(selectedProduct.shop_rating))}
                </span>
                <span className="rating-number">({selectedProduct.shop_rating})</span>
              </div>
            </div>

            <div className="shop-contact">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span className="contact-value">{selectedProduct.shop_city}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span className="contact-value">0912345678</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">💬</span>
                <span className="contact-value">0912345678</span>
              </div>
            </div>

            <div className="shop-actions">
              <button className="contact-btn primary">
                💬 Message Seller
              </button>
              <button className="call-btn">
                📞 Call Shop
              </button>
              <button className="whatsapp-btn">
                📱 WhatsApp
              </button>
              <button className="save-btn">
                ❤️ Save to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStepNavigation = () => (
    <div className="step-navigation">
      <div className="nav-buttons">
        <button 
          onClick={() => {
            const steps = ['city-selection', 'product-search', 'search-results', 'product-detail'];
            const currentIndex = steps.indexOf(currentStep);
            if (currentIndex > 0) {
              setCurrentStep(steps[currentIndex - 1]);
            }
          }}
          disabled={currentStep === 'city-selection'}
          className="nav-btn prev"
        >
          ← Previous
        </button>
        
        <div className="step-indicator">
          Step {['city-selection', 'product-search', 'search-results', 'product-detail'].indexOf(currentStep) + 1} of 4
        </div>
        
        <button 
          onClick={() => {
            const steps = ['city-selection', 'product-search', 'search-results', 'product-detail'];
            const currentIndex = steps.indexOf(currentStep);
            if (currentIndex < steps.length - 1) {
              setCurrentStep(steps[currentIndex + 1]);
            }
          }}
          disabled={currentStep === 'product-detail'}
          className="nav-btn next"
        >
          Next →
        </button>
      </div>
    </div>
  );

  return (
    <div className="buyer-workflow">
      <div className="workflow-header">
        <h1>🛍️ Abel's Buyer Journey</h1>
        <p>Complete step-by-step demonstration of how Abel buys electronics on Ethiopian Electronics</p>
      </div>

      <div className="workflow-content">
        {currentStep === 'city-selection' && renderCitySelection()}
        {currentStep === 'product-search' && renderProductSearch()}
        {currentStep === 'search-results' && renderSearchResults()}
        {currentStep === 'product-detail' && renderProductDetail()}
      </div>

      {renderStepNavigation()}
    </div>
  );
};

export default BuyerWorkflow;
