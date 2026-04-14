import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShopkeeperDashboard.css';
import API from '../api';

const ShopkeeperDashboard = ({ user, shop }) => {
  const navigate = useNavigate();
  
  const shopCategories = [
    { value: 'mobile_phones', label: 'Mobile Phones' },
    { value: 'computers_laptops', label: 'Computers & Laptops' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'home_electronics', label: 'Home Electronics' },
    { value: 'mixed_electronics', label: 'Mixed Electronics' },
    { value: 'repair_service', label: 'Repair Service' }
  ];
  
  const getShopCategoryLabel = (categoryValue) => {
    const category = shopCategories.find(cat => cat.value === categoryValue);
    return category ? category.label : 'Not Specified';
  };
  
  const getPaymentMethodsLabels = (paymentMethods) => {
    const methodLabels = {
      'cash': 'Cash',
      'bank_transfer': 'Bank Transfer',
      'telebirr': 'Telebirr',
      'cbe_birr': 'CBE Birr',
      'mobile_banking': 'Mobile Banking'
    };
    
    if (!paymentMethods || paymentMethods.length === 0) {
      return ['Not Specified'];
    }
    
    return paymentMethods.map(method => methodLabels[method] || method);
  };
  
  const [activeTab, setActiveTab] = useState('overview');
  const [currentShop, setCurrentShop] = useState(null);
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

  // Load current shop from localStorage
  useEffect(() => {
    const shopData = shop || JSON.parse(localStorage.getItem('currentShop') || '{}');
    if (shopData && shopData.id) {
      setCurrentShop(shopData);
    } else {
      // Try to get shop from registered shops
      const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
      if (shops.length > 0) {
        setCurrentShop(shops[0]);
        localStorage.setItem('currentShop', JSON.stringify(shops[0]));
      }
    }
  }, [shop]);

  const handleRefresh = () => {
    // Reload shop data from localStorage
    const shopData = JSON.parse(localStorage.getItem('currentShop') || '{}');
    if (shopData && shopData.id) {
      setCurrentShop(shopData);
    }
    // Optionally reload the page
    window.location.reload();
  };

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
        images: ['/products/tecno-spark-10.jpg']
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
        images: ['/products/samsung-a05.jpg']
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
        images: ['/products/iphone-12.jpg']
      }
    ],
    orders: [
      {
        id: 'ORD-001',
        customer_name: 'Abel Tekle',
        product_name: 'Tecno Spark 10',
        quantity: 1,
        total: 12500,
        status: 'pending',
        created_at: '2026-03-11T10:30:00Z'
      },
      {
        id: 'ORD-002',
        customer_name: 'Hanna Solomon',
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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDashboardData(mockData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data as fallback
      setDashboardData(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Add interactive functions
  const handleProductEdit = (productId) => {
    navigate(`/product/${productId}/edit`);
  };

  const handleProductClick = (product) => {
    // Navigate to product detail view
    navigate(`/product/${product.id}`, { 
      state: { 
        product: product,
        fromShop: true 
      } 
    });
  };

  const handleProductView = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleToggleFeatured = async (productId) => {
    try {
      // Toggle featured status
      setDashboardData(prev => ({
        ...prev,
        products: prev.products.map(product => 
          product.id === productId 
            ? { ...product, is_featured: !product.is_featured }
            : product
        )
      }));
      
      // Show success message
      alert('Product featured status updated!');
    } catch (error) {
      console.error('Error updating featured status:', error);
      alert('Error updating featured status');
    }
  };

  const handleMessageReply = (messageId) => {
    navigate(`/messages/${messageId}/reply`);
  };

  const handleMarkAsRead = async (messageId) => {
    try {
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
    }
  };

  const handleOrderStatusUpdate = (orderId) => {
    navigate(`/orders/${orderId}/update`);
  };

  const handleReviewResponse = (reviewId) => {
    navigate(`/reviews/${reviewId}/respond`);
  };

  const renderOverview = () => (
    <div className="dashboard-overview">
      <div className="shop-header">
        {currentShop?.logo && (
          <div className="shop-banner">
            <img 
              src={currentShop.logo} 
              alt={`${currentShop.electronicsHouseName} Logo`}
              className="shop-logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="shop-info">
          {currentShop?.logo ? (
            <div className="shop-name-marquee">
              <marquee behavior="scroll" direction="left" scrollamount="5">
                <span className="marquee-text">{currentShop?.electronicsHouseName || 'Shop Name'}</span>
              </marquee>
            </div>
          ) : (
            <h2>{currentShop?.electronicsHouseName || 'Shop Name'}</h2>
          )}
          <p>{currentShop?.ownerName || 'Owner Name'}</p>
          <div className="shop-category">
            {getShopCategoryLabel(currentShop?.shopCategory)}
          </div>
          <div className="shop-payment-methods">
            <div className="payment-methods-title">Payment Methods:</div>
            <div className="payment-methods-list">
              {getPaymentMethodsLabels(currentShop?.paymentMethods).map((method, index) => (
                <span key={index} className="payment-method-badge">{method}</span>
              ))}
            </div>
          </div>
          <div className="shop-badges">
            {currentShop?.isVerified && <span className="verified-badge">✓ Verified Shop</span>}
            <span className="rating-badge">
              {'⭐'.repeat(Math.round(currentShop?.rating || 0))} ({currentShop?.reviewCount || 0})
            </span>
          </div>
        </div>
        <div className="shop-actions">
          <button 
            onClick={() => {
              if (currentShop && currentShop.id) {
                navigate('/add-product');
              } else {
                alert('Please register your shop first!');
                navigate('/register-shop');
              }
            }} 
            className="add-product-btn"
            disabled={!currentShop}
          >
            + Add Product
          </button>
          <button 
            onClick={() => {
              if (currentShop && currentShop.id) {
                navigate(`/shop/${currentShop.id}/edit`);
              } else {
                alert('Please register your shop first!');
                navigate('/register-shop');
              }
            }} 
            className="edit-shop-btn"
            disabled={!currentShop}
          >
            ✏️ Edit Shop
          </button>
          <button 
            onClick={handleRefresh}
            className="refresh-btn"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="overview-stats">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{dashboardData.overview.totalProducts || 0}</h3>
            <p>Total Products</p>
            <span className="stat-change positive">+{dashboardData.overview.productsGrowth || 0}% this month</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-info">
            <h3>{dashboardData.overview.totalViews || 0}</h3>
            <p>Product Views</p>
            <span className="stat-change positive">+{dashboardData.overview.viewsGrowth || 0}% this month</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-info">
            <h3>{dashboardData.overview.totalMessages || 0}</h3>
            <p>Customer Messages</p>
            <span className="stat-change positive">+{dashboardData.overview.messagesGrowth || 0}% this month</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>ETB {dashboardData.overview.totalRevenue ? dashboardData.overview.totalRevenue.toLocaleString() : 0}</h3>
            <p>Total Revenue</p>
            <span className="stat-change positive">+{dashboardData.overview.revenueGrowth || 0}% this month</span>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>🚀 Quick Actions</h3>
        <div className="action-buttons">
          <button onClick={() => navigate('/add-product')} className="action-btn">
            📦 Add New Product
          </button>
          <button onClick={() => navigate('/inventory')} className="action-btn">
            📊 Manage Inventory
          </button>
          <button onClick={() => navigate('/messages')} className="action-btn">
            💬 View Messages
          </button>
          <button onClick={() => navigate('/analytics')} className="action-btn">
            📈 View Analytics
          </button>
        </div>
      </div>
    </div>
  );

  const handleDeleteDuplicate = (productId) => {
    if (window.confirm("Are you sure you want to remove this duplicate product?")) {
      const updatedProducts = dashboardData.products.filter(p => p.id !== productId);
      setDashboardData(prev => ({
        ...prev,
        products: updatedProducts
      }));
      
      // Also update localStorage
      const currentShop = JSON.parse(localStorage.getItem('currentShop') || '{}');
      if (currentShop.id) {
        const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
        const shopIndex = shops.findIndex(shop => shop.id === currentShop.id);
        if (shopIndex !== -1) {
          shops[shopIndex].products = updatedProducts;
          localStorage.setItem('registeredShops', JSON.stringify(shops));
          localStorage.setItem('currentShop', JSON.stringify(shops[shopIndex]));
        }
      }
      
      alert("Duplicate product removed successfully!");
    }
  };

  const renderProducts = () => {
    // Group products by name and brand to identify duplicates
    const productGroups = {};
    dashboardData.products.forEach(product => {
      const key = `${product.name.toLowerCase()}-${product.brand?.toLowerCase() || 'unknown'}`;
      if (!productGroups[key]) {
        productGroups[key] = [];
      }
      productGroups[key].push(product);
    });

    return (
      <div className="products-section">
        <div className="products-header">
          <h3>📦 Shop Products</h3>
          <div className="product-stats">
            <span className="stat-item">Total: {dashboardData.products.length}</span>
            <span className="stat-item">Unique: {Object.keys(productGroups).length}</span>
            <span className="stat-item">Duplicates: {dashboardData.products.length - Object.keys(productGroups).length}</span>
          </div>
        </div>

        {dashboardData.products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No products yet</h3>
            <p>Add your first product to get started</p>
            <button onClick={() => navigate('/add-product')} className="add-product-btn">
              ➕ Add Product
            </button>
          </div>
        ) : (
          <div className="products-container">
            {Object.entries(productGroups).map(([key, products]) => (
              <div key={key} className="product-group">
                {products.length > 1 && (
                  <div className="duplicate-badge">
                    ⚠️ {products.length} duplicates found
                  </div>
                )}
                
                {products.map((product, index) => (
                  <div key={product.id} className={`product-card ${products.length > 1 ? 'duplicate' : ''}`} onClick={() => handleProductClick(product)}>
                    <div className="product-image">
                      <img 
                        src={product.images?.[0] || product.image || product.frontImage || `https://picsum.photos/seed/${product.name || 'product'}/400/300.jpg`} 
                        alt={product.name}
                        onError={(e) => {
                          console.log('❌ Image failed to load:', e.target.src);
                          // Try fallback images in order
                          if (product.image) {
                            e.target.src = product.image;
                          } else if (product.frontImage) {
                            e.target.src = product.frontImage;
                          } else {
                            e.target.src = `https://picsum.photos/seed/${product.name || 'product'}/400/300.jpg`;
                          }
                        }}
                        onLoad={(e) => {
                          console.log('✅ Image loaded successfully:', product.name);
                          console.log('🖼️ Image source:', e.target.src);
                          // Apply brightness and clarity enhancements
                          e.target.style.filter = 'brightness(1.1) contrast(1.1) saturate(1.2)';
                        }}
                        style={{
                          width: '100%',
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          filter: 'brightness(1.1) contrast(1.1) saturate(1.2)',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.filter = 'brightness(1.2) contrast(1.2) saturate(1.3)';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.filter = 'brightness(1.1) contrast(1.1) saturate(1.2)';
                          e.target.style.transform = 'scale(1)';
                        }}
                      />
                      <div className="product-status">
                        <span className={`status ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                          {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                        </span>
                      </div>
                      {products.length > 1 && (
                        <div className="duplicate-indicator">
                          #{index + 1}
                        </div>
                      )}
                    </div>
                    <div className="product-info">
                      <div className="product-header">
                        <h4>{product.name}</h4>
                        {products.length > 1 && (
                          <span className="duplicate-count">Copy {index + 1}/{products.length}</span>
                        )}
                      </div>
                      <div className="product-specs">
                        <div className="spec-item">
                          <span className="spec-label">🏷️ Brand:</span>
                          <span className="spec-value">{product.brand || 'N/A'}</span>
                        </div>
                        <div className="spec-item">
                          <span className="spec-label">💰 Price:</span>
                          <span className="spec-value price">ETB {product.price?.toLocaleString()}</span>
                        </div>
                        {product.ram && (
                          <div className="spec-item">
                            <span className="spec-label">🧠 RAM:</span>
                            <span className="spec-value">{product.ram}</span>
                          </div>
                        )}
                        {product.storage && (
                          <div className="spec-item">
                            <span className="spec-label">💾 Storage:</span>
                            <span className="spec-value">{product.storage}</span>
                          </div>
                        )}
                        {product.category && (
                          <div className="spec-item">
                            <span className="spec-label">📂 Category:</span>
                            <span className="spec-value">{product.category}</span>
                          </div>
                        )}
                        {product.model && (
                          <div className="spec-item">
                            <span className="spec-label">📱 Model:</span>
                            <span className="spec-value">{product.model}</span>
                          </div>
                        )}
                      </div>
                      <div className="product-stats">
                        <span>👁️ {product.views || 0} views</span>
                        <span>💬 {product.inquiries || 0} inquiries</span>
                        <span>💰 {product.sold || 0} sold</span>
                      </div>
                      <div className="product-actions">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleProductEdit(product.id); }} 
                          className="edit-btn"
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleProductView(product.id); }} 
                          className="view-btn"
                        >
                          👁️ View
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleToggleFeatured(product.id); }} 
                          className={`featured-btn ${product.is_featured ? 'featured' : ''}`}
                        >
                          {product.is_featured ? '⭐ Featured' : '☆ Feature'}
                        </button>
                        {products.length > 1 && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteDuplicate(product.id); }} 
                            className="delete-duplicate-btn"
                            title="Delete duplicate product"
                          >
                            🗑️ Remove Duplicate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderOrders = () => (
    <div className="orders-section">
      <h3>📋 Recent Orders</h3>
      {dashboardData.orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No orders yet</h3>
          <p>When customers place orders, they'll appear here</p>
        </div>
      ) : (
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
      )}
    </div>
  );

  const renderMessages = () => (
    <div className="messages-section">
      <h3>💬 Customer Messages</h3>
      {dashboardData.messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h3>No messages yet</h3>
          <p>Customer inquiries will appear here</p>
        </div>
      ) : (
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
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="analytics-section">
      <h3>📊 Shop Analytics</h3>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h4>📈 Performance Overview</h4>
          <div className="chart-placeholder">
            <div className="chart-data">
              <div className="data-point">
                <span className="label">Total Views</span>
                <span className="value">{dashboardData.analytics.totalViews || 0}</span>
              </div>
              <div className="data-point">
                <span className="label">Total Inquiries</span>
                <span className="value">{dashboardData.analytics.totalInquiries || 0}</span>
              </div>
              <div className="data-point">
                <span className="label">Conversion Rate</span>
                <span className="value">{dashboardData.analytics.conversionRate || 0}%</span>
              </div>
              <div className="data-point">
                <span className="label">Avg Response Time</span>
                <span className="value">{dashboardData.analytics.avgResponseTime || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h4>🔥 Top Products</h4>
          <div className="top-products">
            {dashboardData.analytics.topProducts?.slice(0, 5).map((product, index) => (
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
              <span className="value">{dashboardData.analytics.totalMessages || 0}</span>
              <span className="label">Total Messages</span>
            </div>
            <div className="stat">
              <span className="value">{dashboardData.analytics.responseRate || 0}%</span>
              <span className="label">Response Rate</span>
            </div>
            <div className="stat">
              <span className="value">{dashboardData.analytics.avgRating || 0}</span>
              <span className="label">Average Rating</span>
            </div>
            <div className="stat">
              <span className="value">{dashboardData.analytics.reviewCount || 0}</span>
              <span className="label">Total Reviews</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="reviews-section">
      <h3>⭐ Customer Reviews</h3>
      {dashboardData.reviews.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">⭐</div>
          <h3>No reviews yet</h3>
          <p>Customer reviews will appear here</p>
        </div>
      ) : (
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
      )}
    </div>
  );

  if (!currentShop) {
    return (
      <div className="shopkeeper-dashboard">
        <div className="loading-container">
          <h2>🔄 Loading shop information...</h2>
          <p>Please wait while we prepare your dashboard.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="shopkeeper-dashboard">
        <div className="loading">
          <h2>🔄 Loading your dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="shopkeeper-dashboard">
      {/* Shop Header with Logo, Banner and Marquee */}
      <div className="shop-header">
        <div className="shop-logo-section">
          {currentShop?.shopLogo ? (
            <img 
              src={currentShop.shopLogo} 
              alt={currentShop.electronicsHouseName}
              className="shop-logo"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                filter: 'brightness(1.2) contrast(1.1) saturate(1.3)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                border: '3px solid white'
              }}
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect width="80" height="80" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="Arial" font-size="14" fill="%23999"%3E🏪%3C/text%3E%3C/svg%3E';
              }}
            />
          ) : (
            <div className="shop-logo-placeholder">
              🏪
            </div>
          )}
          <div className="shop-info">
            <h2 className="shop-name">{currentShop?.electronicsHouseName || 'My Electronics Shop'}</h2>
            <p className="shop-location">📍 {currentShop?.city || 'Location'}</p>
          </div>
        </div>
        
        {currentShop?.shopPhoto && (
          <div className="shop-banner">
            <img 
              src={currentShop.shopPhoto} 
              alt="Shop Banner"
              className="banner-image"
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                filter: 'brightness(1.15) contrast(1.1) saturate(1.2)',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                borderRadius: '12px'
              }}
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="200" viewBox="0 0 800 200"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23667eea;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23764ba2;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="800" height="200" fill="url(%23grad)"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="Arial" font-size="24" fill="white" font-weight="bold"%3E🏪 Welcome to Our Shop%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
        )}
      </div>

      {/* Marquee Animation */}
      <div className="shop-marquee">
        <div className="marquee-content">
          <span className="marquee-text">
            🎉 Welcome to {currentShop?.electronicsHouseName || 'My Electronics Shop'} - 
            📱 Quality Electronics - 
            💻 Laptops & Computers - 
            🎧 Accessories - 
            🏪 Best Prices in {currentShop?.city || 'Ethiopia'} - 
            ⭐ Customer Satisfaction Guaranteed - 
            🚀 Fast Delivery Available
          </span>
        </div>
      </div>

      <div className="dashboard-header">
        <h1>🏪 Shop Dashboard</h1>
        <p>Manage your {currentShop?.electronicsHouseName || 'electronics'} shop</p>
      </div>

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

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'messages' && renderMessages()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'reviews' && renderReviews()}
      </div>
    </div>
  );
};

export default ShopkeeperDashboard;
