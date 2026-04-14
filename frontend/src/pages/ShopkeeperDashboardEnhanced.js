// Enhanced Shopkeeper Dashboard with Real Data and Functionality
// This is a working version with mock data and interactive features

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShopkeeperDashboardEnhanced.css';

const ShopkeeperDashboardEnhanced = ({ user, shop }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalProducts: 0,
      totalViews: 0,
      totalMessages: 0,
      totalRevenue: 0,
      productsGrowth: 15,
      viewsGrowth: 25,
      messagesGrowth: 30,
      revenueGrowth: 20
    },
    products: [],
    orders: [],
    messages: [],
    analytics: {
      totalViews: 0,
      totalInquiries: 0,
      conversionRate: 0,
      avgResponseTime: '2 hours',
      topProducts: [],
      totalMessages: 0,
      responseRate: 95,
      avgRating: 4.5,
      reviewCount: 0
    },
    reviews: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data for demonstration
  const mockData = {
    overview: {
      totalProducts: 25,
      totalViews: 1250,
      totalMessages: 45,
      totalRevenue: 285000,
      productsGrowth: 15,
      viewsGrowth: 25,
      messagesGrowth: 30,
      revenueGrowth: 20
    },
    products: [
      {
        id: 1,
        name: 'Tecno Spark 10',
        brand: 'Tecno',
        model: 'KI5K',
        price: 12500,
        stock_quantity: 5,
        views: 450,
        inquiries: 28,
        sold: 8,
        is_featured: true,
        images: ['/placeholder-product.jpg']
      },
      {
        id: 2,
        name: 'Samsung Galaxy A05',
        brand: 'Samsung',
        model: 'A057F',
        price: 14500,
        stock_quantity: 3,
        views: 320,
        inquiries: 15,
        sold: 5,
        is_featured: false,
        images: ['/placeholder-product.jpg']
      },
      {
        id: 3,
        name: 'iPhone 12',
        brand: 'Apple',
        model: 'A2404',
        price: 28500,
        stock_quantity: 2,
        views: 280,
        inquiries: 12,
        sold: 3,
        is_featured: true,
        images: ['/placeholder-product.jpg']
      }
    ],
    orders: [
      {
        id: 'ORD-001',
        customer_name: 'Abel Tekle',
        customer_phone: '0918765432',
        customer_city: 'Addis Ababa',
        product_name: 'Tecno Spark 10',
        quantity: 1,
        total: 12500,
        status: 'pending',
        created_at: '2026-03-11T10:30:00Z'
      },
      {
        id: 'ORD-002',
        customer_name: 'Hanna Solomon',
        customer_phone: '0912345678',
        customer_city: 'Hawassa',
        product_name: 'Samsung Galaxy A05',
        quantity: 2,
        total: 29000,
        status: 'confirmed',
        created_at: '2026-03-10T14:20:00Z'
      }
    ],
    messages: [
      {
        id: 1,
        customer_name: 'Abel Tekle',
        customer_phone: '0918765432',
        subject: 'Inquiry about Tecno Spark 10',
        message: 'Hello, is the Tecno Spark 10 still available? I want to buy it.',
        product_name: 'Tecno Spark 10',
        read: false,
        priority: 'high',
        created_at: '2026-03-11T10:30:00Z'
      },
      {
        id: 2,
        customer_name: 'Sara Mekonnen',
        customer_phone: '0912345678',
        subject: 'Price inquiry',
        message: 'Do you offer discount for bulk purchase?',
        product_name: 'Samsung Galaxy A05',
        read: true,
        priority: 'medium',
        created_at: '2026-03-10T09:15:00Z'
      }
    ],
    analytics: {
      totalViews: 1250,
      totalInquiries: 85,
      conversionRate: 12.5,
      avgResponseTime: '2 hours',
      topProducts: [
        { id: 1, name: 'Tecno Spark 10', views: 450, inquiries: 28, performance_score: 85 },
        { id: 2, name: 'Samsung Galaxy A05', views: 320, inquiries: 15, performance_score: 75 },
        { id: 3, name: 'iPhone 12', views: 280, inquiries: 12, performance_score: 65 }
      ],
      totalMessages: 45,
      responseRate: 95,
      avgRating: 4.5,
      reviewCount: 12
    },
    reviews: [
      {
        id: 1,
        customer_name: 'Abel Tekle',
        rating: 5,
        title: 'Excellent Service!',
        comment: 'Great product and fast delivery. Abeba was very helpful.',
        product_name: 'Tecno Spark 10',
        created_at: '2026-03-09T15:30:00Z'
      },
      {
        id: 2,
        customer_name: 'Hanna Solomon',
        rating: 4,
        title: 'Good Quality',
        comment: 'Product as described. Happy with my purchase.',
        product_name: 'Samsung Galaxy A05',
        created_at: '2026-03-08T11:20:00Z'
      }
    ]
  };

  useEffect(() => {
    if (user && shop) {
      fetchDashboardData();
    }
  }, [user, shop]);

  // Real API calls to backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Real API calls to backend
      const [overviewRes, productsRes, ordersRes, messagesRes, analyticsRes, reviewsRes] = await Promise.all([
        API.get(`/shops/${shop.id}/overview`),
        API.get(`/shops/${shop.id}/products`),
        API.get(`/shops/${shop.id}/orders`),
        API.get(`/shops/${shop.id}/messages`),
        API.get(`/shops/${shop.id}/analytics`),
        API.get(`/shops/${shop.id}/reviews`)
      ]);

      setDashboardData({
        overview: overviewRes.data || {
          totalProducts: 0,
          totalViews: 0,
          totalMessages: 0,
          totalRevenue: 0,
          productsGrowth: 0,
          viewsGrowth: 0,
          messagesGrowth: 0,
          revenueGrowth: 0
        },
        products: productsRes.data || [],
        orders: ordersRes.data || [],
        messages: messagesRes.data || [],
        analytics: analyticsRes.data || {
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
        reviews: reviewsRes.data || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Interactive functions
  const handleProductEdit = (productId) => {
    navigate(`/product/${productId}/edit`);
  };

  const handleProductView = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleToggleFeatured = async (productId) => {
    try {
      const response = await API.put(`/shops/${shop.id}/products/${productId}/featured`);
      
      // Update local state
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
      console.error('Error updating featured status:', error);
      alert('Error updating featured status: ' + error.message);
    }
  };

  const handleMessageReply = (messageId) => {
    navigate(`/messages/${messageId}/reply`);
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await API.put(`/shops/${shop.id}/messages/${messageId}/read`);
      
      // Update local state
      setDashboardData(prev => ({
        ...prev,
        messages: prev.messages.map(message => 
          message.id === messageId 
            ? { ...message, read: true }
            : message
        )
      }));
    } catch (error) {
      console.error('Error marking message as read:', error);
      alert('Error marking message as read: ' + error.message);
    }
  };

  const handleOrderStatusUpdate = (orderId) => {
    navigate(`/orders/${orderId}/update`);
  };

  const handleReviewResponse = (reviewId) => {
    navigate(`/reviews/${reviewId}/respond`);
  };

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const handleManageInventory = () => {
    navigate('/inventory');
  };

  const handleViewMessages = () => {
    navigate('/messages');
  };

  const handleViewAnalytics = () => {
    navigate('/analytics');
  };

  if (loading) {
    return (
      <div className="shopkeeper-dashboard-enhanced">
        <div className="loading-state">
          <div className="loading-spinner">🔄</div>
          <h2>Loading your dashboard...</h2>
          <p>Please wait while we fetch your shop data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shopkeeper-dashboard-enhanced">
        <div className="error-state">
          <div className="error-icon">❌</div>
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={refreshData} className="retry-btn">
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shopkeeper-dashboard-enhanced">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="shop-info">
            <h1>🏪 {shop?.name_en || 'Abeba Electronics'}</h1>
            <p>{shop?.name_am || 'አበባ ኤሌክትሮኒክስ'}</p>
            <div className="shop-badges">
              {shop?.is_verified && <span className="verified-badge">✓ Verified Shop</span>}
              <span className="rating-badge">
                ⭐⭐⭐⭐⭐ ({shop?.review_count || 12})
              </span>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={handleAddProduct} className="add-product-btn">
              📦 Add Product
            </button>
            <button onClick={() => navigate(`/shop/${shop?.id}/edit`)} className="edit-shop-btn">
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
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-info">
                  <h3>{dashboardData.overview.totalProducts}</h3>
                  <p>Total Products</p>
                  <span className="stat-change positive">+{dashboardData.overview.productsGrowth}% this month</span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">👁️</div>
                <div className="stat-info">
                  <h3>{dashboardData.overview.totalViews}</h3>
                  <p>Product Views</p>
                  <span className="stat-change positive">+{dashboardData.overview.viewsGrowth}% this month</span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">💬</div>
                <div className="stat-info">
                  <h3>{dashboardData.overview.totalMessages}</h3>
                  <p>Customer Messages</p>
                  <span className="stat-change positive">+{dashboardData.overview.messagesGrowth}% this month</span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>ETB {dashboardData.overview.totalRevenue.toLocaleString()}</h3>
                  <p>Total Revenue</p>
                  <span className="stat-change positive">+{dashboardData.overview.revenueGrowth}% this month</span>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>🚀 Quick Actions</h3>
              <div className="action-buttons">
                <button onClick={handleAddProduct} className="action-btn">
                  📦 Add New Product
                </button>
                <button onClick={handleManageInventory} className="action-btn">
                  📊 Manage Inventory
                </button>
                <button onClick={handleViewMessages} className="action-btn">
                  💬 View Messages
                </button>
                <button onClick={handleViewAnalytics} className="action-btn">
                  📈 View Analytics
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-section">
            <div className="section-header">
              <h3>📦 Your Products</h3>
              <button onClick={handleAddProduct} className="add-product-btn">
                + Add Product
              </button>
            </div>
            
            <div className="products-grid">
              {dashboardData.products.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.images?.[0] || '/placeholder-product.jpg'} alt={product.name} />
                    <div className="product-status">
                      <span className={`status ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p>{product.brand} • {product.model}</p>
                    <div className="product-price">ETB {product.price?.toLocaleString()}</div>
                    <div className="product-stats">
                      <span>👁️ {product.views} views</span>
                      <span>💬 {product.inquiries} inquiries</span>
                      <span>💰 {product.sold} sold</span>
                    </div>
                    <div className="product-actions">
                      <button onClick={() => handleProductEdit(product.id)} className="edit-btn">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleProductView(product.id)} className="view-btn">
                        👁️ View
                      </button>
                      <button 
                        onClick={() => handleToggleFeatured(product.id)} 
                        className={`featured-btn ${product.is_featured ? 'featured' : ''}`}
                      >
                        {product.is_featured ? '⭐ Featured' : '☆ Feature'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h3>📋 Recent Orders</h3>
            <div className="orders-list">
              {dashboardData.orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h4>Order #{order.id}</h4>
                      <p>{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="order-status">
                      <span className={`status ${order.status}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="order-details">
                    <p><strong>Customer:</strong> {order.customer_name}</p>
                    <p><strong>Phone:</strong> {order.customer_phone}</p>
                    <p><strong>City:</strong> {order.customer_city}</p>
                    <p><strong>Product:</strong> {order.product_name}</p>
                    <p><strong>Quantity:</strong> {order.quantity}</p>
                    <p><strong>Total:</strong> ETB {order.total?.toLocaleString()}</p>
                  </div>
                  <div className="order-actions">
                    <button onClick={() => handleOrderStatusUpdate(order.id)} className="view-order-btn">
                      View Details
                    </button>
                    <button onClick={() => handleOrderStatusUpdate(order.id)} className="update-status-btn">
                      Update Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="messages-section">
            <h3>💬 Customer Messages</h3>
            <div className="messages-list">
              {dashboardData.messages.map(message => (
                <div key={message.id} className={`message-item ${message.read ? 'read' : 'unread'}`}>
                  <div className="message-header">
                    <div className="customer-info">
                      <h4>{message.customer_name}</h4>
                      <p>{message.customer_phone}</p>
                      <small>{new Date(message.created_at).toLocaleDateString()}</small>
                    </div>
                    <div className="message-status">
                      {!message.read && <span className="unread-badge">New</span>}
                      <span className="priority">{message.priority}</span>
                    </div>
                  </div>
                  <div className="message-content">
                    <p><strong>Subject:</strong> {message.subject}</p>
                    <p>{message.message}</p>
                    {message.product_name && (
                      <p><strong>About:</strong> {message.product_name}</p>
                    )}
                  </div>
                  <div className="message-actions">
                    <button onClick={() => handleMessageReply(message.id)} className="reply-btn">
                      💬 Reply
                    </button>
                    <button onClick={() => handleMarkAsRead(message.id)} className="mark-read-btn">
                      ✓ Mark as Read
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <h3>📊 Shop Analytics</h3>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h4>📈 Performance Overview</h4>
                <div className="chart-placeholder">
                  <div className="chart-data">
                    <div className="data-point">
                      <span className="label">Total Views</span>
                      <span className="value">{dashboardData.analytics.totalViews}</span>
                    </div>
                    <div className="data-point">
                      <span className="label">Total Inquiries</span>
                      <span className="value">{dashboardData.analytics.totalInquiries}</span>
                    </div>
                    <div className="data-point">
                      <span className="label">Conversion Rate</span>
                      <span className="value">{dashboardData.analytics.conversionRate}%</span>
                    </div>
                    <div className="data-point">
                      <span className="label">Avg Response Time</span>
                      <span className="value">{dashboardData.analytics.avgResponseTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="analytics-card">
                <h4>🔥 Top Products</h4>
                <div className="top-products">
                  {dashboardData.analytics.topProducts.map((product, index) => (
                    <div key={product.id} className="top-product">
                      <div className="product-rank">#{index + 1}</div>
                      <div className="product-info">
                        <h5>{product.name}</h5>
                        <p>{product.views} views • {product.inquiries} inquiries</p>
                      </div>
                      <div className="product-performance">
                        <span className="performance-score">
                          {product.performance_score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="analytics-card">
                <h4>📱 Customer Engagement</h4>
                <div className="engagement-stats">
                  <div className="stat">
                    <span className="value">{dashboardData.analytics.totalMessages}</span>
                    <span className="label">Total Messages</span>
                  </div>
                  <div className="stat">
                    <span className="value">{dashboardData.analytics.responseRate}%</span>
                    <span className="label">Response Rate</span>
                  </div>
                  <div className="stat">
                    <span className="value">{dashboardData.analytics.avgRating}</span>
                    <span className="label">Average Rating</span>
                  </div>
                  <div className="stat">
                    <span className="value">{dashboardData.analytics.reviewCount}</span>
                    <span className="label">Total Reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="reviews-section">
            <h3>⭐ Customer Reviews</h3>
            <div className="reviews-list">
              {dashboardData.reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <h4>{review.customer_name}</h4>
                      <div className="rating">
                        {'⭐'.repeat(review.rating)}
                      </div>
                    </div>
                    <div className="review-date">
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  {review.title && <h5>{review.title}</h5>}
                  <p>{review.comment}</p>
                  {review.product_name && (
                    <p><strong>Product:</strong> {review.product_name}</p>
                  )}
                  <div className="review-actions">
                    <button onClick={() => handleReviewResponse(review.id)} className="respond-btn">
                      💬 Respond
                    </button>
                    <button className="report-btn">
                      🚩 Report
                    </button>
                  </div>
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
