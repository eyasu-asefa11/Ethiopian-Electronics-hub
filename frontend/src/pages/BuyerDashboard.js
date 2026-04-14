import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BuyerDashboard.css';
import API from '../api';

const BuyerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    recentSearches: [],
    wishlist: [],
    savedShops: [],
    messages: [],
    alerts: [],
    recentViews: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [searchesRes, wishlistRes, savedShopsRes, messagesRes, alertsRes, viewsRes] = await Promise.all([
        API.get('/buyer/recent-searches'),
        API.get('/wishlist'),
        API.get('/buyer/saved-shops'),
        API.get('/buyer/messages'),
        API.get('/stock-alerts'),
        API.get('/buyer/recent-views')
      ]);

      setDashboardData({
        recentSearches: searchesRes.data || [],
        wishlist: wishlistRes.data || [],
        savedShops: savedShopsRes.data || [],
        messages: messagesRes.data || [],
        alerts: alertsRes.data || [],
        recentViews: viewsRes.data || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="dashboard-overview">
      <h2>👋 Welcome back, {user.username}!</h2>
      <p>Continue your electronics shopping journey</p>
      
      <div className="overview-stats">
        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-info">
            <h3>{dashboardData.wishlist.length}</h3>
            <p>Saved Products</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-info">
            <h3>{dashboardData.savedShops.length}</h3>
            <p>Saved Shops</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-info">
            <h3>{dashboardData.alerts.length}</h3>
            <p>Stock Alerts</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-info">
            <h3>{dashboardData.messages.filter(m => !m.read).length}</h3>
            <p>Unread Messages</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>🚀 Quick Actions</h3>
        <div className="action-buttons">
          <button onClick={() => navigate('/shop')} className="action-btn">
            🔍 Browse Products
          </button>
          <button onClick={() => navigate('/wishlist')} className="action-btn">
            ❤️ View Wishlist
          </button>
          <button onClick={() => navigate('/compare')} className="action-btn">
            📊 Compare Prices
          </button>
          <button onClick={() => navigate('/map')} className="action-btn">
            🗺️ Find Shops
          </button>
        </div>
      </div>
    </div>
  );

  const renderRecentSearches = () => (
    <div className="recent-searches">
      <h3>🔍 Recent Searches</h3>
      {dashboardData.recentSearches.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p>No recent searches</p>
          <button onClick={() => navigate('/shop')} className="action-btn">
            Start Searching
          </button>
        </div>
      ) : (
        <div className="searches-list">
          {dashboardData.recentSearches.map((search, index) => (
            <div key={index} className="search-item">
              <div className="search-info">
                <h4>{search.query}</h4>
                <p>{search.results_count} results found</p>
                <small>{new Date(search.created_at).toLocaleDateString()}</small>
              </div>
              <button 
                onClick={() => navigate(`/shop?q=${search.query}`)}
                className="repeat-search-btn"
              >
                🔍 Search Again
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderWishlist = () => (
    <div className="wishlist-section">
      <h3>❤️ Your Wishlist</h3>
      {dashboardData.wishlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">❤️</div>
          <p>No saved products yet</p>
          <button onClick={() => navigate('/shop')} className="action-btn">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {dashboardData.wishlist.slice(0, 6).map(product => (
            <div key={product.id} className="wishlist-item" onClick={() => navigate(`/product/${product.id}`)}>
              <div className="product-image">
                <img src={product.images?.[0] || '/placeholder-product.jpg'} alt={product.name} />
              </div>
              <div className="product-info">
                <h4>{product.name}</h4>
                <p>{product.brand} • {product.model}</p>
                <div className="product-price">ETB {product.price?.toLocaleString()}</div>
                <div className="shop-name">{product.shop_name}</div>
              </div>
            </div>
          ))}
        </div>
        )}
    </div>
  );

  const renderMessages = () => (
    <div className="messages-section">
      <h3>💬 Messages from Shops</h3>
      {dashboardData.messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <p>No messages yet</p>
          <button onClick={() => navigate('/shop')} className="action-btn">
            Contact Shops
          </button>
        </div>
      ) : (
        <div className="messages-list">
          {dashboardData.messages.map(message => (
            <div key={message.id} className={`message-item ${message.read ? 'read' : 'unread'}`}>
              <div className="message-header">
                <div className="shop-info">
                  <h4>{message.shop_name}</h4>
                  <small>{new Date(message.created_at).toLocaleDateString()}</small>
                </div>
                {!message.read && <div className="unread-badge">New</div>}
              </div>
              <div className="message-content">
                <p>{message.subject}</p>
                <p>{message.message_preview}</p>
              </div>
              <button onClick={() => navigate(`/messages/${message.id}`)} className="view-message-btn">
                View Message
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAlerts = () => (
    <div className="alerts-section">
      <h3>🔔 Stock Alerts</h3>
      {dashboardData.alerts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <p>No stock alerts set</p>
          <button onClick={() => navigate('/stock-alerts')} className="action-btn">
            Create Alert
          </button>
        </div>
      ) : (
        <div className="alerts-list">
          {dashboardData.alerts.map(alert => (
            <div key={alert.id} className="alert-item">
              <div className="alert-info">
                <h4>{alert.product_name}</h4>
                <p>{alert.brand} • {alert.model}</p>
                <div className="alert-type">
                  {alert.alert_type === 'available' ? '📦 When Available' : '💰 Price Drop'}
                </div>
              </div>
              <div className="alert-status">
                <span className={`status ${alert.is_active ? 'active' : 'inactive'}`}>
                  {alert.is_active ? '🟢 Active' : '🔴 Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRecentViews = () => (
    <div className="recent-views">
      <h3>👁️ Recently Viewed</h3>
      {dashboardData.recentViews.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👁️</div>
          <p>No recently viewed products</p>
          <button onClick={() => navigate('/shop')} className="action-btn">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="views-grid">
          {dashboardData.recentViews.slice(0, 6).map(product => (
            <div key={product.id} className="viewed-item" onClick={() => navigate(`/product/${product.id}`)}>
              <div className="product-image">
                <img src={product.images?.[0] || '/placeholder-product.jpg'} alt={product.name} />
              </div>
              <div className="product-info">
                <h4>{product.name}</h4>
                <p>{product.brand} • {product.model}</p>
                <div className="product-price">ETB {product.price?.toLocaleString()}</div>
                <small>Viewed {new Date(product.viewed_at).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="buyer-dashboard">
        <div className="loading">
          <h2>🔄 Loading your dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="buyer-dashboard">
      <div className="dashboard-header">
        <h1>🛍️ My Dashboard</h1>
        <p>Welcome back, {user.username}! Manage your electronics shopping</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          🏠 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'searches' ? 'active' : ''}`}
          onClick={() => setActiveTab('searches')}
        >
          🔍 Recent Searches
        </button>
        <button 
          className={`tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          ❤️ Wishlist ({dashboardData.wishlist.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          💬 Messages ({dashboardData.messages.filter(m => !m.read).length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          🔔 Alerts ({dashboardData.alerts.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'views' ? 'active' : ''}`}
          onClick={() => setActiveTab('views')}
        >
          👁️ Recent Views
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'searches' && renderRecentSearches()}
        {activeTab === 'wishlist' && renderWishlist()}
        {activeTab === 'messages' && renderMessages()}
        {activeTab === 'alerts' && renderAlerts()}
        {activeTab === 'views' && renderRecentViews()}
      </div>
    </div>
  );
};

export default BuyerDashboard;
