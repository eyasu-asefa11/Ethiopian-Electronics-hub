// Main Dashboard Component
// This is the main landing page with search, city selection, and featured products

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShopRegistration from './ShopRegistration';
import './MainDashboard.css';

const MainDashboard = () => {
  const navigate = useNavigate();
  const [showShopRegistration, setShowShopRegistration] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const ethiopianCities = [
    { id: 'all', name: 'All Cities', name_am: 'ሁሉኣ ከተማዛ' },
    { id: 'addis_ababa', name: 'Addis Ababa', name_am: 'አዲስ አበባ' },
    { id: 'hawassa', name: 'Hawassa', name_am: 'ሀዋሳ' },
    { id: 'dilla', name: 'Dilla', name_am: 'ዲላ' },
    { id: 'bahir_dar', name: 'Bahir Dar', name_am: 'ባህር ዳር' },
    { id: 'hossana', name: 'Hossana', name_am: 'ሆሳዕና' },
    { id: 'jimma', name: 'Jimma', name_am: 'ጅማ' },
    { id: 'mekelle', name: 'Mekelle', name_am: 'መቀለ' },
    { id: 'gondar', name: 'Gondar', name_am: 'ጎንደር' },
    { id: 'adama', name: 'Adama', name_am: 'አዳማ' }
  ];

  const categories = [
    { id: 'phones', name: 'Phones', icon: '📱', count: 245 },
    { id: 'laptops', name: 'Laptops', icon: '💻', count: 89 },
    { id: 'tablets', name: 'Tablets', icon: '📲', count: 67 },
    { id: 'accessories', name: 'Accessories', icon: '🎧', count: 412 }
  ];

  const mockFeaturedProducts = [
    {
      id: 1,
      name: 'Tecno Spark 10',
      brand: 'Tecno',
      model: 'KI5K',
      price: 12500,
      original_price: 14000,
      image: '/products/tecno-spark-10.jpg',
      shop_name: 'Abeba Electronics',
      shop_city: 'Dilla',
      shop_verified: true,
      rating: 4.5,
      stock: 5,
      discount: 10
    },
    {
      id: 2,
      name: 'Samsung Galaxy A05',
      brand: 'Samsung',
      model: 'A057F',
      price: 14500,
      original_price: 16000,
      image: '/products/samsung-a05.jpg',
      shop_name: 'Addis Tech Store',
      shop_city: 'Addis Ababa',
      shop_verified: true,
      rating: 4.3,
      stock: 8,
      discount: 9
    },
    {
      id: 3,
      name: 'iPhone 12',
      brand: 'Apple',
      model: 'A2404',
      price: 28500,
      original_price: 32000,
      image: '/products/iphone-12.jpg',
      shop_name: 'Premium Mobile',
      shop_city: 'Addis Ababa',
      shop_verified: true,
      rating: 4.8,
      stock: 3,
      discount: 11
    },
    {
      id: 4,
      name: 'HP Laptop 15',
      brand: 'HP',
      model: '15-fd0033dx',
      price: 22000,
      original_price: 25000,
      image: '/products/hp-laptop.jpg',
      shop_name: 'Computer World',
      shop_city: 'Hawassa',
      shop_verified: true,
      rating: 4.2,
      stock: 6,
      discount: 12
    },
    {
      id: 5,
      name: 'iPad Air',
      brand: 'Apple',
      model: 'A2602',
      price: 18500,
      original_price: 20000,
      image: '/products/ipad-air.jpg',
      shop_name: 'TechHub Ethiopia',
      shop_city: 'Addis Ababa',
      shop_verified: false,
      rating: 4.0,
      stock: 4,
      discount: 8
    },
    {
      id: 6,
      name: 'Samsung Galaxy Buds',
      brand: 'Samsung',
      model: 'SM-R510',
      price: 3500,
      original_price: 4000,
      image: '/products/galaxy-buds.jpg',
      shop_name: 'Audio Pro',
      shop_city: 'Dilla',
      shop_verified: true,
      rating: 4.6,
      stock: 15,
      discount: 13
    }
  ];

  useEffect(() => {
    // Simulate loading featured products
    setLoading(true);
    setTimeout(() => {
      setFeaturedProducts(mockFeaturedProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&city=${selectedCity}`);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}?city=${selectedCity}`);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleShopRegistrationComplete = (shopData) => {
    console.log('Shop registered:', shopData);
    setShowShopRegistration(false);
    // Redirect to shop dashboard or show success message
    navigate('/shopkeeper-dashboard');
  };

  return (
    <div className="main-dashboard">
      {/* Top Navigation */}
      <header className="top-navigation">
        <div className="nav-container">
          <div className="nav-left">
            <div className="logo">
              <span className="logo-icon">🇪🇹</span>
              <span className="logo-text">Ethiopian Electronics</span>
            </div>
          </div>

          <div className="nav-center">
            <div className="nav-search">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="nav-search-input"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button onClick={handleSearch} className="nav-search-btn">
                🔍
              </button>
            </div>
          </div>

          <div className="nav-right">
            <div className="city-selector">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="city-dropdown"
              >
                {ethiopianCities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            
            <button className="nav-btn login-btn">
              👤 Login
            </button>
            
            <button 
              onClick={() => setShowShopRegistration(true)}
              className="nav-btn register-shop-btn"
            >
              🏪 Register Shop
            </button>
          </div>
        </div>
      </header>

      {/* Main Search Area */}
      <section className="main-search-area">
        <div className="search-container">
          <h1>🇪🇹 Find Electronics Across Ethiopia</h1>
          <p>Search products from verified shops nationwide</p>
          
          <div className="main-search-bar">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Samsung A057F 4GB RAM"
              className="main-search-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="city-selector-main">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="city-dropdown-main"
              >
                {ethiopianCities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={handleSearch} className="main-search-btn">
              🔍 Search
            </button>
          </div>

          <div className="quick-searches">
            <span>Popular searches:</span>
            <button onClick={() => setSearchQuery('Tecno Spark 10')}>Tecno Spark 10</button>
            <button onClick={() => setSearchQuery('Samsung Galaxy A05')}>Samsung Galaxy A05</button>
            <button onClick={() => setSearchQuery('iPhone 12')}>iPhone 12</button>
            <button onClick={() => setSearchQuery('HP Laptop')}>HP Laptop</button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header">
          <h2>📂 Categories</h2>
          <p>Browse electronics by category</p>
        </div>
        
        <div className="categories-grid">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="category-card"
            >
              <div className="category-icon">{category.icon}</div>
              <div className="category-name">{category.name}</div>
              <div className="category-count">{category.count} products</div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2>⭐ Featured Products</h2>
          <p>Popular products from trusted shops</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner">🔄</div>
            <p>Loading featured products...</p>
          </div>
        ) : (
          <div className="featured-grid">
            {featuredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="product-card"
              >
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-badges">
                    {product.shop_verified && (
                      <span className="badge verified">✓</span>
                    )}
                    {product.discount > 0 && (
                      <span className="badge discount">-{product.discount}%</span>
                    )}
                  </div>
                </div>

                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-brand">{product.brand} • {product.model}</p>
                  
                  <div className="product-price">
                    <span className="current-price">ETB {product.price.toLocaleString()}</span>
                    {product.original_price > product.price && (
                      <span className="original-price">ETB {product.original_price.toLocaleString()}</span>
                    )}
                  </div>

                  <div className="product-meta">
                    <div className="shop-info">
                      <span className="shop-name">🏪 {product.shop_name}</span>
                      <span className="shop-city">📍 {product.shop_city}</span>
                    </div>
                    
                    <div className="product-stats">
                      <span className="rating">⭐ {product.rating}</span>
                      <span className="stock">📦 {product.stock}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="view-all-section">
          <button 
            onClick={() => navigate('/products')}
            className="view-all-btn"
          >
            🛍️ View All Products
          </button>
        </div>
      </section>

      {/* Shop Registration Modal */}
      {showShopRegistration && (
        <ShopRegistration
          onClose={() => setShowShopRegistration(false)}
          onRegistrationComplete={handleShopRegistrationComplete}
        />
      )}
    </div>
  );
};

export default MainDashboard;
