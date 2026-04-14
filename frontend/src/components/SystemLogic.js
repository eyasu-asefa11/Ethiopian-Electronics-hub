// Complete System Logic for Ethiopian Electronics Platform
// This demonstrates all the core functionality

import React, { useState, useEffect } from 'react';
import './SystemLogic.css';

const SystemLogic = () => {
  const [activeView, setActiveView] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Database simulation
  const [database, setDatabase] = useState({
    shops: [
      {
        id: 1,
        name: 'Abeba Electronics',
        city: 'Dilla',
        phone: '0912345678',
        whatsapp: '0912345678',
        rating: 4.5,
        verified: true,
        products: [
          {
            id: 1,
            name: 'Tecno Spark 10',
            brand: 'Tecno',
            model: 'KI5K',
            price: 12500,
            stock: 5,
            specifications: {
              ram: '4GB',
              storage: '128GB',
              battery: '5000mAh',
              camera: '50MP',
              color: 'Black'
            }
          }
        ]
      },
      {
        id: 2,
        name: 'Sidama Mobile',
        city: 'Hawassa',
        phone: '0911223344',
        whatsapp: '0911223344',
        rating: 4.2,
        verified: false,
        products: [
          {
            id: 2,
            name: 'Tecno Spark 10',
            brand: 'Tecno',
            model: 'KI5K',
            price: 12800,
            stock: 3,
            specifications: {
              ram: '4GB',
              storage: '128GB',
              battery: '5000mAh',
              camera: '50MP',
              color: 'Black'
            }
          }
        ]
      },
      {
        id: 3,
        name: 'Addis Tech Store',
        city: 'Addis Ababa',
        phone: '0911334455',
        whatsapp: '0911334455',
        rating: 4.0,
        verified: true,
        products: [
          {
            id: 3,
            name: 'Tecno Spark 10',
            brand: 'Tecno',
            model: 'KI5K',
            price: 13100,
            stock: 7,
            specifications: {
              ram: '4GB',
              storage: '128GB',
              battery: '5000mAh',
              camera: '50MP',
              color: 'Black'
            }
          }
        ]
      }
    ],
    messages: [],
    reviews: []
  });

  const cities = [
    { id: 'all', name: 'All Cities' },
    { id: 'addis_ababa', name: 'Addis Ababa' },
    { id: 'hawassa', name: 'Hawassa' },
    { id: 'dilla', name: 'Dilla' },
    { id: 'bahir_dar', name: 'Bahir Dar' },
    { id: 'hossana', name: 'Hossana' }
  ];

  // System Functions
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    let results = [];
    
    database.shops.forEach(shop => {
      shop.products.forEach(product => {
        if (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.model.toLowerCase().includes(searchQuery.toLowerCase())) {
          
          // Check city filter
          if (selectedCity === 'all' || shop.city === selectedCity) {
            results.push({
              ...product,
              shop_name: shop.name,
              shop_city: shop.city,
              shop_phone: shop.phone,
              shop_whatsapp: shop.whatsapp,
              shop_rating: shop.rating,
              shop_verified: shop.verified
            });
          }
        }
      });
    });

    // Sort by price (lowest first)
    results.sort((a, b) => a.price - b.price);
    setSearchResults(results);
    setActiveView('results');
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setActiveView('detail');
  };

  const handleContactSeller = (product) => {
    const message = {
      id: database.messages.length + 1,
      product_id: product.id,
      product_name: product.name,
      shop_name: product.shop_name,
      buyer_name: 'Abel',
      content: `Hello ${product.shop_name},\nIs ${product.name} still available?\nI want to buy it.`,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setDatabase(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));

    alert(`Message sent to ${product.shop_name}! They will respond soon.`);
  };

  const renderSystemConcept = () => (
    <div className="system-concept">
      <h2>🏗️ Simple System Concept</h2>
      
      <div className="flow-diagram">
        <div className="flow-section">
          <h3>Sellers</h3>
          <div className="flow-steps">
            <div className="flow-step">Add Products</div>
            <div className="flow-arrow">↓</div>
          </div>
        </div>

        <div className="flow-section">
          <h3>Database</h3>
          <div className="database-box">
            <div className="db-content">
              <p>📦 Products</p>
              <p>🏪 Shops</p>
              <p>💬 Messages</p>
              <p>⭐ Reviews</p>
            </div>
          </div>
        </div>

        <div className="flow-section">
          <h3>Buyers</h3>
          <div className="flow-steps">
            <div className="flow-step">Search Products</div>
            <div className="flow-arrow">↓</div>
            <div className="flow-step">View Details</div>
            <div className="flow-arrow">↓</div>
            <div className="flow-step">Contact Seller</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSearchInterface = () => (
    <div className="search-interface">
      <h2>🔍 Product Search</h2>
      
      <div className="search-controls">
        <div className="city-filter">
          <label>City:</label>
          <select 
            value={selectedCity} 
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {cities.map(city => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name, brand, or model..."
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>🔍 Search</button>
        </div>
      </div>

      <div className="quick-filters">
        <h4>Quick Filters:</h4>
        <div className="filter-buttons">
          <button onClick={() => setSearchQuery('Tecno Spark 10')}>Tecno Spark 10</button>
          <button onClick={() => setSearchQuery('Samsung Galaxy')}>Samsung Galaxy</button>
          <button onClick={() => setSearchQuery('iPhone')}>iPhone</button>
          <button onClick={() => setSearchQuery('Laptop')}>Laptops</button>
        </div>
      </div>
    </div>
  );

  const renderSearchResults = () => (
    <div className="search-results">
      <h2>📱 Search Results: "{searchQuery}"</h2>
      
      <div className="results-table">
        <table>
          <thead>
            <tr>
              <th>Shop</th>
              <th>City</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((product, index) => (
              <tr key={product.id} className={index === 0 ? 'best-price' : ''}>
                <td>
                  <div className="shop-cell">
                    <span className="shop-name">{product.shop_name}</span>
                    {product.shop_verified && <span className="verified">✓</span>}
                  </div>
                </td>
                <td>{product.shop_city}</td>
                <td className="price">ETB {product.price.toLocaleString()}</td>
                <td className="stock">{product.stock}</td>
                <td className="rating">{'⭐'.repeat(Math.round(product.shop_rating))}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      onClick={() => handleProductSelect(product)}
                      className="view-btn"
                    >
                      👁️ View
                    </button>
                    <button 
                      onClick={() => handleContactSeller(product)}
                      className="contact-btn"
                    >
                      💬 Contact
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {searchResults.length > 0 && (
        <div className="search-summary">
          <p><strong>Best Price:</strong> ETB {searchResults[0].price.toLocaleString()} ({searchResults[0].shop_name})</p>
          <p><strong>Total Shops:</strong> {searchResults.length} shops have this product</p>
          <p><strong>Total Stock:</strong> {searchResults.reduce((sum, p) => sum + p.stock, 0)} units available</p>
        </div>
      )}
    </div>
  );

  const renderProductDetail = () => {
    if (!selectedProduct) return null;

    return (
      <div className="product-detail">
        <h2>📱 {selectedProduct.name}</h2>
        
        <div className="detail-sections">
          {/* Top Section - Images */}
          <div className="images-section">
            <h3>📸 Product Images</h3>
            <div className="image-gallery">
              <div className="main-image">
                <div className="image-placeholder">📱 Front View</div>
              </div>
              <div className="thumbnails">
                <div className="thumbnail active">📱 Front</div>
                <div className="thumbnail">📱 Back</div>
                <div className="thumbnail">📱 Interface</div>
              </div>
            </div>
          </div>

          {/* Middle Section - Specifications */}
          <div className="specs-section">
            <h3>📋 Specifications</h3>
            <div className="specs-grid">
              <div className="spec-item">
                <label>Brand:</label>
                <span>{selectedProduct.brand}</span>
              </div>
              <div className="spec-item">
                <label>Model:</label>
                <span>{selectedProduct.model}</span>
              </div>
              <div className="spec-item">
                <label>RAM:</label>
                <span>{selectedProduct.specifications.ram}</span>
              </div>
              <div className="spec-item">
                <label>Storage:</label>
                <span>{selectedProduct.specifications.storage}</span>
              </div>
              <div className="spec-item">
                <label>Battery:</label>
                <span>{selectedProduct.specifications.battery}</span>
              </div>
              <div className="spec-item">
                <label>Camera:</label>
                <span>{selectedProduct.specifications.camera}</span>
              </div>
              <div className="spec-item">
                <label>Color:</label>
                <span>{selectedProduct.specifications.color}</span>
              </div>
              <div className="spec-item price">
                <label>Price:</label>
                <span>ETB {selectedProduct.price.toLocaleString()}</span>
              </div>
              <div className="spec-item stock">
                <label>Stock:</label>
                <span>{selectedProduct.stock} units</span>
              </div>
            </div>
          </div>

          {/* Bottom Section - Shop Information */}
          <div className="shop-section">
            <h3>🏪 Shop Information</h3>
            <div className="shop-details">
              <div className="shop-info">
                <h4>{selectedProduct.shop_name}</h4>
                {selectedProduct.shop_verified && <span className="verified-badge">✓ Verified Shop</span>}
                <div className="shop-rating">{'⭐'.repeat(Math.round(selectedProduct.shop_rating))}</div>
              </div>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="icon">📍</span>
                  <span>{selectedProduct.shop_city}</span>
                </div>
                <div className="contact-item">
                  <span className="icon">📞</span>
                  <span>{selectedProduct.shop_phone}</span>
                </div>
                <div className="contact-item">
                  <span className="icon">💬</span>
                  <span>{selectedProduct.shop_whatsapp}</span>
                </div>
              </div>
              <div className="action-buttons">
                <button 
                  onClick={() => handleContactSeller(selectedProduct)}
                  className="contact-btn primary"
                >
                  💬 Contact Seller
                </button>
                <button className="wishlist-btn">
                  ❤️ Save to Wishlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSystemPurpose = () => (
    <div className="system-purpose">
      <h2>🎯 Purpose of System</h2>
      
      <div className="purpose-grid">
        <div className="purpose-section">
          <h3>🛍️ For Buyers</h3>
          <ul>
            <li>✅ Know which shop has a product</li>
            <li>✅ See price and specifications</li>
            <li>✅ Contact seller before traveling</li>
            <li>✅ Compare prices across cities</li>
            <li>✅ Read reviews and ratings</li>
            <li>✅ Save favorite products</li>
          </ul>
        </div>

        <div className="purpose-section">
          <h3>🏪 For Sellers</h3>
          <ul>
            <li>✅ Promote products nationwide</li>
            <li>✅ Update inventory daily</li>
            <li>✅ Reach customers across Ethiopia</li>
            <li>✅ Receive customer inquiries</li>
            <li>✅ Build online reputation</li>
            <li>✅ Track product performance</li>
          </ul>
        </div>
      </div>

      <div className="system-benefits">
        <h3>🌟 Key Benefits</h3>
        <div className="benefits-grid">
          <div className="benefit-item">
            <span className="benefit-icon">💰</span>
            <h4>Price Transparency</h4>
            <p>Compare prices across different shops and cities</p>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">📍</span>
            <h4>Location Independence</h4>
            <p>Buy from any city in Ethiopia</p>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">⏰</span>
            <h4>Time Saving</h4>
            <p>Know availability before traveling</p>
          </div>
          <div className="benefit-item">
            <span className="benefit-icon">🤝</span>
            <h4>Direct Communication</h4>
            <p>Contact sellers directly</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="system-logic">
      <div className="system-header">
        <h1>🇪🇹 Ethiopian Electronics - Complete System Logic</h1>
        <p>Demonstrating all core functionality</p>
      </div>

      <div className="navigation-tabs">
        <button 
          className={activeView === 'concept' ? 'active' : ''}
          onClick={() => setActiveView('concept')}
        >
          🏗️ System Concept
        </button>
        <button 
          className={activeView === 'search' ? 'active' : ''}
          onClick={() => setActiveView('search')}
        >
          🔍 Search Products
        </button>
        <button 
          className={activeView === 'results' ? 'active' : ''}
          onClick={() => setActiveView('results')}
        >
          📊 Search Results
        </button>
        <button 
          className={activeView === 'detail' ? 'active' : ''}
          onClick={() => setActiveView('detail')}
        >
          📱 Product Detail
        </button>
        <button 
          className={activeView === 'purpose' ? 'active' : ''}
          onClick={() => setActiveView('purpose')}
        >
          🎯 System Purpose
        </button>
      </div>

      <div className="content-area">
        {activeView === 'concept' && renderSystemConcept()}
        {activeView === 'search' && renderSearchInterface()}
        {activeView === 'results' && renderSearchResults()}
        {activeView === 'detail' && renderProductDetail()}
        {activeView === 'purpose' && renderSystemPurpose()}
      </div>
    </div>
  );
};

export default SystemLogic;
