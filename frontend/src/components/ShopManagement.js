import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ShopManagement.css';
import AdvancedGlobalNavigation from './AdvancedGlobalNavigation';

const ShopManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBackButton, setShowBackButton] = useState(true);

  useEffect(() => {
    // Check if user came from another page
    const fromNavigation = location.state?.fromNavigation;
    const hasHistory = window.history.length > 1;
    setShowBackButton(hasHistory || fromNavigation);
    
    // Simulate loading shop data
    setTimeout(() => {
      setShopData({
        name: 'My Electronics Shop',
        owner: 'Shop Owner',
        email: 'shop@example.com',
        phone: '+251 911 234 567',
        location: 'Addis Ababa, Ethiopia',
        category: 'Electronics',
        status: 'Active',
        registeredDate: '2024-01-15',
        products: 156,
        rating: 4.8,
        reviews: 234,
        revenue: 245000,
        description: 'Premium electronics shop offering latest gadgets and accessories'
      });
      setLoading(false);
    }, 1000);
  }, [location]);

  const handleBack = () => {
    // Navigate back to previous page or home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'products', label: 'Products', icon: '📱' },
    { id: 'orders', label: 'Orders', icon: '📦' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'admin', label: 'Admin Panel', icon: '🔧' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ShopOverview shopData={shopData} />;
      case 'products':
        return <ShopProducts shopData={shopData} />;
      case 'orders':
        return <ShopOrders shopData={shopData} />;
      case 'analytics':
        return <ShopAnalytics shopData={shopData} />;
      case 'settings':
        return <ShopSettings shopData={shopData} />;
      case 'admin':
        return <ShopAdmin shopData={shopData} />;
      default:
        return <ShopOverview shopData={shopData} />;
    }
  };

  if (loading) {
    return (
      <div className="shop-management-loading">
        <div className="loading-spinner"></div>
        <p>Loading shop management...</p>
      </div>
    );
  }

  return (
    <div className="shop-management">
      {/* Advanced Back Button */}
      {showBackButton && (
        <AdvancedGlobalNavigation
          showBackButton={true}
          backText="← Back to Shops"
          theme="glassmorphism"
          size="medium"
          glassIntensity="medium"
          customBackAction={handleBack}
        />
      )}

      {/* Shop Management Header */}
      <div className="shop-management-header">
        <div className="shop-info">
          <h1>{shopData?.name || 'My Shop'}</h1>
          <p className="shop-subtitle">Manage your electronics shop</p>
        </div>
        
        <div className="shop-status">
          <span className={`status-badge ${shopData?.status?.toLowerCase()}`}>
            {shopData?.status}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="shop-tabs">
        <div className="tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'tab-button--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {activeTab === tab.id && (
                <span className="tab-indicator"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="shop-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

// Shop Overview Component
const ShopOverview = ({ shopData }) => {
  return (
    <div className="shop-overview">
      <div className="overview-grid">
        <div className="stat-card">
          <div className="stat-icon">📱</div>
          <div className="stat-info">
            <h3>{shopData?.products || 0}</h3>
            <p>Total Products</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{shopData?.orders || 0}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <h3>{shopData?.rating || 0}</h3>
            <p>Shop Rating</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>ETB {shopData?.revenue?.toLocaleString() || 0}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="shop-details">
        <h2>Shop Information</h2>
        <div className="details-grid">
          <div className="detail-item">
            <label>Shop Name:</label>
            <span>{shopData?.name}</span>
          </div>
          <div className="detail-item">
            <label>Owner:</label>
            <span>{shopData?.owner}</span>
          </div>
          <div className="detail-item">
            <label>Email:</label>
            <span>{shopData?.email}</span>
          </div>
          <div className="detail-item">
            <label>Phone:</label>
            <span>{shopData?.phone}</span>
          </div>
          <div className="detail-item">
            <label>Location:</label>
            <span>{shopData?.location}</span>
          </div>
          <div className="detail-item">
            <label>Category:</label>
            <span>{shopData?.category}</span>
          </div>
          <div className="detail-item">
            <label>Registered:</label>
            <span>{shopData?.registeredDate}</span>
          </div>
          <div className="detail-item">
            <label>Description:</label>
            <span>{shopData?.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shop Products Component
const ShopProducts = ({ shopData }) => {
  const [products] = useState([
    { id: 1, name: 'iPhone 13 Pro', price: 45000, stock: 15, status: 'Active' },
    { id: 2, name: 'Samsung Galaxy S23', price: 38000, stock: 8, status: 'Active' },
    { id: 3, name: 'MacBook Air M2', price: 85000, stock: 5, status: 'Active' },
    { id: 4, name: 'iPad Air', price: 28000, stock: 12, status: 'Active' }
  ]);

  return (
    <div className="shop-products">
      <div className="products-header">
        <h2>Shop Products</h2>
        <button className="add-product-btn">
          + Add New Product
        </button>
      </div>
      
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src="/api/placeholder/200/150" alt={product.name} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-price">ETB {product.price.toLocaleString()}</p>
              <p className="product-stock">Stock: {product.stock}</p>
              <span className="product-status">{product.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Shop Orders Component
const ShopOrders = ({ shopData }) => {
  const [orders] = useState([
    { id: 1, customer: 'John Doe', product: 'iPhone 13 Pro', amount: 45000, status: 'Delivered', date: '2024-01-20' },
    { id: 2, customer: 'Jane Smith', product: 'Samsung Galaxy S23', amount: 38000, status: 'Processing', date: '2024-01-21' },
    { id: 3, customer: 'Mike Johnson', product: 'MacBook Air M2', amount: 85000, status: 'Shipped', date: '2024-01-22' }
  ]);

  return (
    <div className="shop-orders">
      <div className="orders-header">
        <h2>Recent Orders</h2>
        <button className="view-all-orders-btn">
          View All Orders
        </button>
      </div>
      
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.id} className="order-item">
            <div className="order-info">
              <h4>Order #{order.id}</h4>
              <p>{order.customer}</p>
              <p>{order.product}</p>
              <p className="order-amount">ETB {order.amount.toLocaleString()}</p>
            </div>
            <div className="order-meta">
              <span className="order-date">{order.date}</span>
              <span className={`order-status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Shop Analytics Component
const ShopAnalytics = ({ shopData }) => {
  return (
    <div className="shop-analytics">
      <h2>Shop Analytics</h2>
      <div className="analytics-grid">
        <div className="chart-card">
          <h3>Revenue Overview</h3>
          <div className="chart-placeholder">
            📊 Revenue chart would go here
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Product Performance</h3>
          <div className="chart-placeholder">
            📈 Product performance chart
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Customer Analytics</h3>
          <div className="chart-placeholder">
            👥 Customer analytics chart
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Sales Trends</h3>
          <div className="chart-placeholder">
            📉 Sales trends chart
          </div>
        </div>
      </div>
    </div>
  );
};

// Shop Settings Component
const ShopSettings = ({ shopData }) => {
  return (
    <div className="shop-settings">
      <h2>Shop Settings</h2>
      <div className="settings-grid">
        <div className="setting-group">
          <h3>Basic Information</h3>
          <div className="setting-item">
            <label>Shop Name</label>
            <input type="text" defaultValue={shopData?.name} />
          </div>
          <div className="setting-item">
            <label>Description</label>
            <textarea defaultValue={shopData?.description}></textarea>
          </div>
        </div>
        
        <div className="setting-group">
          <h3>Contact Information</h3>
          <div className="setting-item">
            <label>Email</label>
            <input type="email" defaultValue={shopData?.email} />
          </div>
          <div className="setting-item">
            <label>Phone</label>
            <input type="tel" defaultValue={shopData?.phone} />
          </div>
        </div>
        
        <div className="setting-group">
          <h3>Business Settings</h3>
          <div className="setting-item">
            <label>Location</label>
            <input type="text" defaultValue={shopData?.location} />
          </div>
          <div className="setting-item">
            <label>Category</label>
            <select defaultValue={shopData?.category}>
              <option>Electronics</option>
              <option>Mobile Phones</option>
              <option>Computers</option>
              <option>Accessories</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="settings-actions">
        <button className="save-btn">Save Changes</button>
        <button className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};

// Shop Admin Component
const ShopAdmin = ({ shopData }) => {
  return (
    <div className="shop-admin">
      <h2>Admin Panel</h2>
      <div className="admin-grid">
        <div className="admin-card">
          <h3>Website Management</h3>
          <p>Manage your shop website, themes, and appearance</p>
          <button className="admin-btn">Manage Website</button>
        </div>
        
        <div className="admin-card">
          <h3>User Management</h3>
          <p>Manage staff members and user permissions</p>
          <button className="admin-btn">Manage Users</button>
        </div>
        
        <div className="admin-card">
          <h3>Payment Settings</h3>
          <p>Configure payment methods and billing</p>
          <button className="admin-btn">Payment Settings</button>
        </div>
        
        <div className="admin-card">
          <h3>Shipping Settings</h3>
          <p>Set up shipping options and delivery zones</p>
          <button className="admin-btn">Shipping Settings</button>
        </div>
        
        <div className="admin-card">
          <h3>Tax Configuration</h3>
          <p>Configure tax rates and tax rules</p>
          <button className="admin-btn">Tax Settings</button>
        </div>
        
        <div className="admin-card">
          <h3>Advanced Settings</h3>
          <p>Advanced configuration options</p>
          <button className="admin-btn">Advanced Settings</button>
        </div>
      </div>
    </div>
  );
};

export default ShopManagement;
