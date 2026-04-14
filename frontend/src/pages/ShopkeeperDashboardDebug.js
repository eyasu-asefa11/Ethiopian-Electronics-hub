// DEBUG: Shopkeeper Dashboard Component
// This file helps diagnose why the dashboard is not appearing

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShopkeeperDashboardEnhanced.css';
import API from '../api';

const ShopkeeperDashboardEnhanced = ({ user, shop }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalProducts: 0,
      totalViews: 0,
      totalMessages: 0,
      totalRevenue: 0,
      productsGrowth: 0,
      viewsGrowth: 0,
      messagesGrowth: 0,
      revenueGrowth: 0
    },
    products: [],
    orders: [],
    messages: [],
    analytics: {
      totalViews: 0,
      totalInquiries: 0,
      conversionRate: 0,
      avgResponseTime: 'N/A',
      topProducts: [],
      totalMessages: 0,
      responseRate: 0,
      avgRating: 0,
      reviewCount: 0
    },
    reviews: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get shop data from localStorage if not provided
  const currentShop = shop || JSON.parse(localStorage.getItem('currentShop') || '{}');
  const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');

  // DEBUG: Add console logs
  useEffect(() => {
    console.log('🔍 ShopkeeperDashboardEnhanced rendered with:', { user: currentUser, shop: currentShop });
    console.log('🔍 Active tab:', activeTab);
    console.log('🔍 Dashboard data:', dashboardData);
  }, [currentUser, currentShop, activeTab, dashboardData]);

  useEffect(() => {
    if (currentUser && currentShop) {
      console.log('🔍 Fetching dashboard data...');
      fetchDashboardData();
    } else {
      console.log('🔍 No user or shop data available');
      setLoading(false);
    }
  }, [currentUser, currentShop]);

  const fetchDashboardData = async () => {
    console.log('🔍 Starting fetchDashboardData...');
    try {
      setLoading(true);
      setError(null);
      
      // DEBUG: Log API calls
      console.log('🔍 Making API calls for shop:', currentShop.id);
      
      // Check if we have mock data or need to simulate API calls
      const useMockData = true; // Set to true for now since backend doesn't exist
      
      // Define mock data structure
      const mockDataStructure = {
        overview: {
          totalProducts: 0,
          totalViews: 0,
          totalMessages: 0,
          totalRevenue: 0,
          productsGrowth: 0,
          viewsGrowth: 0,
          messagesGrowth: 0,
          revenueGrowth: 0
        },
        products: [],
        orders: [],
        messages: [],
        analytics: {
          totalViews: 0,
          totalInquiries: 0,
          conversionRate: 0,
          avgResponseTime: 'N/A',
          topProducts: [],
          totalMessages: 0,
          responseRate: 0,
          avgRating: 0,
          reviewCount: 0
        },
        reviews: []
      };
      
      if (useMockData) {
        console.log('🔍 Using mock data for new registered shop');
        setDashboardData(mockDataStructure);
        console.log('🔍 Mock data set:', mockDataStructure);
        
      } else {
        // Real API calls to backend (when backend exists)
        const [overviewRes, productsRes, ordersRes, messagesRes, analyticsRes, reviewsRes] = await Promise.all([
          API.get(`/shops/${currentShop.id}/overview`),
          API.get(`/shops/${currentShop.id}/products`),
          API.get(`/shops/${currentShop.id}/orders`),
          API.get(`/shops/${currentShop.id}/messages`),
          API.get(`/shops/${currentShop.id}/analytics`),
          API.get(`/shops/${currentShop.id}/reviews`)
        ]);

        console.log('🔍 API responses received:', {
          overview: overviewRes.data,
          products: productsRes.data,
          orders: ordersRes.data,
          messages: messagesRes.data,
          analytics: analyticsRes.data,
          reviews: reviewsRes.data
        });

        setDashboardData({
          overview: overviewRes.data || mockDataStructure.overview,
          products: productsRes.data || [],
          orders: ordersRes.data || [],
          messages: messagesRes.data || [],
          analytics: analyticsRes.data || mockDataStructure.analytics,
          reviews: reviewsRes.data || []
        });
      }
      
      console.log('🔍 Dashboard data set successfully');
    } catch (error) {
      console.error('🔍 Error fetching dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      console.log('🔍 Fetch completed');
    }
  };

  // DEBUG: Add console logs to all functions
  const handleProductEdit = (productId) => {
    console.log('🔍 handleProductEdit called with productId:', productId);
    navigate(`/product/${productId}/edit`);
  };

  const handleProductView = (productId) => {
    console.log('🔍 handleProductView called with productId:', productId);
    navigate(`/product/${productId}`);
  };

  const handleToggleFeatured = async (productId) => {
    console.log('🔍 handleToggleFeatured called with productId:', productId);
    try {
      // For now, just update local state since backend doesn't exist
      setDashboardData(prev => ({
        ...prev,
        products: prev.products.map(product => 
          product.id === productId 
            ? { ...product, is_featured: !product.is_featured }
            : product
        )
      }));
      
      alert('Product featured status updated successfully!');
    } catch (error) {
      console.error('🔍 Error updating featured status:', error);
      alert('Error updating featured status: ' + error.message);
    }
  };

  const handleMessageReply = (messageId) => {
    console.log('🔍 handleMessageReply called with messageId:', messageId);
    navigate(`/messages/${messageId}/reply`);
  };

  const handleMarkAsRead = async (messageId) => {
    console.log('🔍 handleMarkAsRead called with messageId:', messageId);
    try {
      // For now, just update local state since backend doesn't exist
      setDashboardData(prev => ({
        ...prev,
        messages: prev.messages.map(message => 
          message.id === messageId 
            ? { ...message, read: true }
            : message
        )
      }));
    } catch (error) {
      console.error('🔍 Error marking message as read:', error);
      alert('Error marking message as read: ' + error.message);
    }
  };

  const handleOrderStatusUpdate = (orderId) => {
    console.log('🔍 handleOrderStatusUpdate called with orderId:', orderId);
    navigate(`/orders/${orderId}/update`);
  };

  const handleReviewResponse = (reviewId) => {
    console.log('🔍 handleReviewResponse called with reviewId:', reviewId);
    navigate(`/reviews/${reviewId}/respond`);
  };

  const handleAddProduct = () => {
    console.log('🔍 handleAddProduct called');
    navigate('/add-product');
  };

  const handleManageInventory = () => {
    console.log('🔍 handleManageInventory called');
    navigate('/inventory');
  };

  const handleViewMessages = () => {
    console.log('🔍 handleViewMessages called');
    navigate('/messages');
  };

  const handleViewAnalytics = () => {
    console.log('🔍 handleViewAnalytics called');
    navigate('/analytics');
  };

  const refreshData = async () => {
    console.log('🔍 Refreshing dashboard data...');
    await fetchDashboardData();
  };

  // DEBUG: Add console log to render
  if (loading) {
    console.log('🔍 Dashboard is in loading state');
    return (
      <div className="shopkeeper-dashboard-enhanced">
        <div className="loading-state">
          <div className="loading-spinner">🔄</div>
          <h2>Loading your dashboard...</h2>
          <p>Please wait while we fetch your shop data</p>
          <p>DEBUG: Loading state active</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('🔍 Dashboard is in error state:', error);
    return (
      <div className="shopkeeper-dashboard-enhanced">
        <div className="error-state">
          <div className="error-icon">❌</div>
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <p>DEBUG: Error state: {error}</p>
          <button onClick={refreshData} className="retry-btn">
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  // DEBUG: Add console log to main return
  console.log('🔍 About to render dashboard with state:', {
    hasUser: !!user,
    hasShop: !!shop,
    activeTab,
    hasData: dashboardData.products.length > 0 || dashboardData.messages.length > 0,
    loading,
    error
  });

  return (
    <div className="shopkeeper-dashboard-enhanced">
      <div className="debug-info">
        <h3>🔍 DEBUG INFO:</h3>
        <p>Has User: {currentUser ? 'Yes' : 'No'}</p>
        <p>Has Shop: {currentShop ? 'Yes' : 'No'}</p>
        <p>Active Tab: {activeTab}</p>
        <p>Has Data: {dashboardData.products.length > 0 || dashboardData.messages.length > 0 ? 'Yes' : 'No'}</p>
        <p>Loading: {loading ? 'Yes' : 'No'}</p>
        <p>Error: {error ? error : 'None'}</p>
        {currentShop && (
          <div>
            <p><strong>Shop Name:</strong> {currentShop.shopName}</p>
            <p><strong>Owner:</strong> {currentShop.ownerName}</p>
            <p><strong>City:</strong> {currentShop.city}</p>
          </div>
        )}
      </div>

      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="shop-info">
            <h1>🏪 {currentShop.shopName || 'Abeba Electronics'}</h1>
            <p>{currentShop.ownerName || 'አበባ ኤሌክትሮኒክስ'}</p>
            <div className="shop-badges">
              {currentShop.isVerified && <span className="verified-badge">✓ Verified Shop</span>}
              <span className="rating-badge">
                ⭐⭐⭐ ({currentShop.reviews?.length || 12})
              </span>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={handleAddProduct} className="add-product-btn">
              📦 Add Product
            </button>
            <button onClick={() => navigate(`/shop/${currentShop?.id}/edit`)} className="edit-shop-btn">
              ✏️ Edit Shop
            </button>
            <button onClick={refreshData} className="refresh-btn">
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          🏠 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 Products ({dashboardData.products.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📋 Orders ({dashboardData.orders.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          💬 Messages ({dashboardData.messages.filter(m => !m.read).length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          ⭐ Reviews ({dashboardData.reviews.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="dashboard-content">
        <div className="debug-info">
          <h4>🔍 RENDERING: {activeTab} TAB</h4>
          <p>Products: {dashboardData.products.length}</p>
          <p>Messages: {dashboardData.messages.length}</p>
          <p>Orders: {dashboardData.orders.length}</p>
          <p>Reviews: {dashboardData.reviews.length}</p>
        </div>

        {activeTab === 'overview' && (
          <div className="overview-section">
            <h3>🏠 Overview Tab</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>{dashboardData.overview.totalProducts}</h3>
                  <p>Total Products</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-section">
            <h3>📦 Products Tab</h3>
            <div className="products-grid">
              {dashboardData.products.map(product => (
                <div key={product.id} className="product-card">
                  <h4>{product.name}</h4>
                  <p>Price: ETB {product.price?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="messages-section">
            <h3>💬 Messages Tab</h3>
            <div className="messages-list">
              {dashboardData.messages.map(message => (
                <div key={message.id} className="message-item">
                  <h4>{message.subject}</h4>
                  <p>{message.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopkeeperDashboardEnhanced;
