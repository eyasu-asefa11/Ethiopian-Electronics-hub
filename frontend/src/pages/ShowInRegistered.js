import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShowInRegistered.css';
import AdvancedGlobalNavigation from '../components/AdvancedGlobalNavigation';

const ShowInRegistered = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShops, setSelectedShops] = useState([]);
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
      console.log('Show in Registered - Shops:', registeredShops);
      setShops(registeredShops);
      setSelectedShops(registeredShops.slice(0, 6)); // Show first 6 shops by default
    } catch (error) {
      console.error('Error fetching shops:', error);
      setShops([]);
      setSelectedShops([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleShopClick = (shopId) => {
    navigate(`/shop/${shopId}`);
  };

  const handleSelectShop = (shopId) => {
    if (selectedShops.find(shop => shop.id === shopId)) {
      setSelectedShops(selectedShops.filter(shop => shop.id !== shopId));
    } else {
      const shop = shops.find(s => s.id === shopId);
      if (shop) {
        setSelectedShops([...selectedShops, shop]);
      }
    }
  };

  const handleShowSelected = () => {
    if (selectedShops.length === 0) {
      alert('Please select at least one shop to display');
      return;
    }
    // Navigate to a filtered view or update display
    console.log('Showing selected shops:', selectedShops);
  };

  const handleSelectAll = () => {
    if (selectedShops.length === shops.length) {
      setSelectedShops([]);
    } else {
      setSelectedShops(shops);
    }
  };

  if (loading) {
    return (
      <div className="show-in-registered">
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
    <div className="show-in-registered">
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
      <div className="show-header">
        <div className="header-content">
          <h1>📋 Show in Registered</h1>
          <p>Select and display registered electronics shops</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <h3>{shops.length}</h3>
            <p>Total Shops</p>
          </div>
          <div className="stat-card">
            <h3>{selectedShops.length}</h3>
            <p>Selected</p>
          </div>
          <div className="stat-card">
            <h3>{selectedShops.filter(s => s.products?.length > 0).length}</h3>
            <p>With Products</p>
          </div>
        </div>
      </div>

      {/* Selection Controls */}
      <div className="selection-controls">
        <div className="control-buttons">
          <button 
            onClick={handleSelectAll}
            className={`select-all-btn ${selectedShops.length === shops.length ? 'selected' : ''}`}
          >
            {selectedShops.length === shops.length ? '🔄 Deselect All' : '✅ Select All'}
          </button>
          <button 
            onClick={handleShowSelected}
            className="show-selected-btn"
            disabled={selectedShops.length === 0}
          >
            📋 Show Selected ({selectedShops.length})
          </button>
        </div>
        <div className="view-options">
          <button className="view-btn active">
            📱 Grid View
          </button>
          <button className="view-btn">
            📋 List View
          </button>
          <button className="view-btn">
            🗺️ Map View
          </button>
        </div>
      </div>

      {/* Shops Display */}
      <div className="shops-display">
        {shops.length === 0 ? (
          <div className="no-shops">
            <div className="no-shops-icon">🏪</div>
            <h3>No Registered Shops</h3>
            <p>No shops have been registered yet.</p>
            <button 
              onClick={() => navigate('/register-shop')}
              className="register-shop-btn"
            >
              🏪 Register First Shop
            </button>
          </div>
        ) : (
          <div className="shops-grid">
            {shops.map((shop, index) => {
              const isSelected = selectedShops.find(s => s.id === shop.id);
              return (
                <div 
                  key={`${shop.id || index}-${shop.shopName}`} 
                  className={`shop-display-card ${isSelected ? 'selected' : ''}`}
                >
                  {/* Selection Checkbox */}
                  <div className="selection-checkbox">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectShop(shop.id)}
                      id={`shop-${shop.id || index}`}
                    />
                    <label htmlFor={`shop-${shop.id || index}`} className="checkbox-label">
                      <span className="checkmark">✓</span>
                    </label>
                  </div>

                  {/* Shop Content */}
                  <div className="shop-content" onClick={() => handleShopClick(shop.id)}>
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
                      <div className="detail-row">
                        <span className="detail-icon">📍</span>
                        <span className="detail-text">{shop.city || 'No city'}, {shop.address || 'No address'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-icon">🏷️</span>
                        <span className="detail-text">{shop.category || 'General Electronics'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-icon">📱</span>
                        <span className="detail-text">{shop.phone || 'No phone'}</span>
                      </div>
                    </div>

                    <div className="shop-stats">
                      <div className="mini-stat">
                        <span className="stat-number">{shop.products?.length || 0}</span>
                        <span className="stat-label">Products</span>
                      </div>
                      <div className="mini-stat">
                        <span className="stat-number">⭐ 4.5</span>
                        <span className="stat-label">Rating</span>
                      </div>
                      <div className="mini-stat">
                        <span className="stat-number">📦 150+</span>
                        <span className="stat-label">Orders</span>
                      </div>
                    </div>

                    <div className="shop-description">
                      <p>{shop.description ? 
                        shop.description.substring(0, 100) + (shop.description.length > 100 ? '...' : '') 
                        : 'No description available'}</p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="quick-actions">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShopClick(shop.id);
                      }}
                      className="quick-action-btn view-btn"
                    >
                      👁️ View
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`tel:${shop.phone}`, '_blank');
                      }}
                      className="quick-action-btn contact-btn"
                    >
                      📞 Call
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectShop(shop.id);
                      }}
                      className={`quick-action-btn select-btn ${isSelected ? 'selected' : ''}`}
                    >
                      {isSelected ? '✅ Selected' : '⭕ Select'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Shops Summary */}
      {selectedShops.length > 0 && (
        <div className="selected-summary">
          <div className="summary-header">
            <h3>📋 Selected Shops ({selectedShops.length})</h3>
            <button 
              onClick={() => setSelectedShops([])}
              className="clear-selection-btn"
            >
              🗑️ Clear Selection
            </button>
          </div>
          <div className="selected-shops-list">
            {selectedShops.map((shop, index) => (
              <div key={`selected-${shop.id || index}`} className="selected-shop-item">
                <span className="shop-name">{shop.shopName || shop.electronicsHouseName}</span>
                <span className="shop-location">{shop.city || 'No city'}</span>
                <button 
                  onClick={() => handleSelectShop(shop.id)}
                  className="remove-btn"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
          <div className="summary-actions">
            <button className="export-btn">
              📤 Export List
            </button>
            <button className="compare-btn">
              📊 Compare Shops
            </button>
            <button className="show-btn">
              👁️ Show Details
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="show-footer">
        <div className="footer-content">
          <div className="footer-info">
            <p>Showing {selectedShops.length} of {shops.length} registered shops</p>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="footer-actions">
            <button onClick={() => navigate('/')} className="home-btn">
              🏠 Back to Home
            </button>
            <button onClick={() => navigate('/shops')} className="all-shops-btn">
              🏪 All Shops
            </button>
            <button onClick={() => navigate('/register-shop')} className="register-btn">
              ➕ Register Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowInRegistered;
