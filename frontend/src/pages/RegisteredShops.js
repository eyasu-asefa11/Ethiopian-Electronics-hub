import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisteredShops.css';
import AdvancedGlobalNavigation from '../components/AdvancedGlobalNavigation';

const RegisteredShops = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showBackButton, setShowBackButton] = useState(true);

  useEffect(() => {
    setShowBackButton(true);
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      // Get shops from localStorage
      const registeredShops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
      console.log('Registered Shops:', registeredShops);
      setShops(registeredShops);
    } catch (error) {
      console.error('Error fetching shops:', error);
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.electronicsHouseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.ownerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !filterCity || shop.city === filterCity;
    const matchesCategory = !filterCategory || shop.category === filterCategory;
    return matchesSearch && matchesCity && matchesCategory;
  });

  const cities = [...new Set(shops.map(shop => shop.city).filter(Boolean))];
  const categories = [...new Set(shops.map(shop => shop.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="registered-shops">
        {/* Back to Home Button */}
        {showBackButton && (
          <AdvancedGlobalNavigation
            showBackButton={true}
            backText="← BACK TO HOME"
            theme="glassmorphism"
            size="medium"
            glassIntensity="medium"
            customBackAction={handleBackToHome}
          />
        )}
        
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading Registered Shops...</h2>
          <p>Please wait while we fetch shop information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="registered-shops">
      {/* Back to Home Button */}
      {showBackButton && (
        <AdvancedGlobalNavigation
          showBackButton={true}
          backText="← BACK TO HOME"
          theme="glassmorphism"
          size="medium"
          glassIntensity="medium"
          customBackAction={handleBackToHome}
        />
      )}

      {/* Header */}
      <div className="shops-header">
        <div className="header-content">
          <h1>🏪 Registered Shops</h1>
          <p>Discover electronics shops across Ethiopia</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <h3>{shops.length}</h3>
            <p>Total Shops</p>
          </div>
          <div className="stat-card">
            <h3>{cities.length}</h3>
            <p>Cities</p>
          </div>
          <div className="stat-card">
            <h3>{categories.length}</h3>
            <p>Categories</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Search shops by name, owner, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filters-container">
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="filter-select"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <button onClick={() => {
            setSearchTerm('');
            setFilterCity('');
            setFilterCategory('');
          }} className="clear-filters-btn">
            🔄 Clear Filters
          </button>
        </div>
      </div>

      {/* Shops Grid */}
      <div className="shops-content">
        {filteredShops.length === 0 ? (
          <div className="no-shops">
            <div className="no-shops-icon">🏪</div>
            <h3>No Shops Found</h3>
            <p>
              {shops.length === 0 
                ? "No shops have been registered yet." 
                : "No shops match your search criteria."}
            </p>
            {shops.length === 0 && (
              <button 
                onClick={() => navigate('/register-shop')}
                className="register-shop-btn"
              >
                🏪 Register First Shop
              </button>
            )}
          </div>
        ) : (
          <div className="shops-grid">
            {filteredShops.map((shop, index) => (
              <div key={`${shop.id || index}-${shop.shopName}`} className="shop-card">
                <div className="shop-header">
                  <div className="shop-avatar">
                    <span className="shop-icon">🏪</span>
                  </div>
                  <div className="shop-info">
                    <h3>{shop.shopName || shop.electronicsHouseName || 'Unnamed Shop'}</h3>
                    <p className="shop-owner">👤 {shop.ownerName || 'Unknown Owner'}</p>
                  </div>
                  <div className="shop-status">
                    <span className="status-badge active">🟢 Active</span>
                  </div>
                </div>

                <div className="shop-details">
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span className="detail-text">{shop.address || 'No address provided'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🏙️</span>
                    <span className="detail-text">{shop.city || 'No city'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🏷️</span>
                    <span className="detail-text">{shop.category || 'General Electronics'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📧</span>
                    <span className="detail-text">{shop.email || 'No email'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">📱</span>
                    <span className="detail-text">{shop.phone || 'No phone'}</span>
                  </div>
                </div>

                <div className="shop-description">
                  <p>{shop.description || 'No description available for this shop.'}</p>
                </div>

                <div className="shop-stats">
                  <div className="stat">
                    <span className="stat-number">{shop.products?.length || 0}</span>
                    <span className="stat-label">Products</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">⭐ 4.5</span>
                    <span className="stat-label">Rating</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">📦 150+</span>
                    <span className="stat-label">Orders</span>
                  </div>
                </div>

                <div className="shop-actions">
                  <button 
                    onClick={() => navigate(`/shop/${shop.id}`)}
                    className="view-shop-btn"
                  >
                    🏪 View Shop
                  </button>
                  <button 
                    onClick={() => window.open(`tel:${shop.phone}`, '_blank')}
                    className="contact-btn"
                  >
                    📞 Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shops-footer">
        <div className="footer-content">
          <p>Showing {filteredShops.length} of {shops.length} shops</p>
          <div className="footer-actions">
            <button onClick={() => navigate('/')} className="home-btn">
              🏠 Back to Home
            </button>
            <button onClick={() => navigate('/register-shop')} className="register-btn">
              🏪 Register New Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisteredShops;
