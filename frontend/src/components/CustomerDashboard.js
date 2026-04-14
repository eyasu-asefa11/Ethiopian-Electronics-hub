import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';
import API from '../api';

const CustomerDashboard = ({ language = 'am' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [customerData, setCustomerData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const translations = {
    en: {
      welcome: 'Welcome back',
      dashboard: 'Customer Dashboard',
      overview: 'Overview',
      orders: 'My Orders',
      savedItems: 'Saved Items',
      profile: 'Profile Settings',
      addresses: 'Addresses',
      notifications: 'Notifications',
      totalOrders: 'Total Orders',
      totalSpent: 'Total Spent',
      savedProducts: 'Saved Products',
      recentOrders: 'Recent Orders',
      orderNumber: 'Order #',
      date: 'Date',
      status: 'Status',
      total: 'Total',
      viewDetails: 'View Details',
      trackOrder: 'Track Order',
      reorder: 'Reorder',
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      personalInfo: 'Personal Information',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmNewPassword: 'Confirm New Password',
      updateProfile: 'Update Profile',
      addAddress: 'Add New Address',
      defaultAddress: 'Default Address',
      edit: 'Edit',
      remove: 'Remove',
      save: 'Save',
      cancel: 'Cancel',
      noOrders: 'No orders yet',
      noSavedItems: 'No saved items',
      startShopping: 'Start Shopping'
    },
    am: {
      welcome: 'እንኳን ተመለሳችሁ',
      dashboard: 'የደንበኛ ዳሽቦርድ',
      overview: 'አጠቃቋማ',
      orders: 'የእኔት ትዕዛዛዎች',
      savedItems: 'የተቀመጡ እቃዎች',
      profile: 'የመገለጫ ቅንብቮች',
      addresses: 'አድራሻዎች',
      notifications: 'ማስታወቂያዎች',
      totalOrders: 'ጠቅልሏ ትዕዛዛዎች',
      totalSpent: 'ጠቅልሏ የተከፈለ',
      savedProducts: 'የተቀመጡ ምርቶች',
      recentOrders: 'የቅርብ ትዕዛዛዎች',
      orderNumber: 'ትዕዛዛ #',
      date: 'ቀን',
      status: 'ሁኔታ',
      total: 'ድምር',
      viewDetails: 'ዝርዝር',
      trackOrder: 'ትዕዛዛን አከታትል',
      reorder: 'እንደገና ይውሰድ',
      pending: 'በመጠባበት ላይ',
      processing: 'በሂደት ላይ',
      shipped: 'ተላክቷል',
      delivered: 'ተሰጥቷል',
      cancelled: '��ሰርዟ',
      personalInfo: 'የግልስኛ መረጃ',
      firstName: 'ስም',
      lastName: 'የአባት ስም',
      email: 'ኢሜይል',
      phone: 'ስልክ',
      changePassword: 'የይለፍ ቃል ይቀይሩ',
      currentPassword: 'የአሁኑ የይለፍ ቃል',
      newPassword: 'አዲስ የይለፍ ቃል',
      confirmNewPassword: 'አዲስ የይለፍ ቃል ያረጋግጡ',
      updateProfile: 'መገለጫ አዘምጥ',
      addAddress: 'አዲስ አድራስ ይጨምሩ',
      defaultAddress: 'ነባላዊ አድራስ',
      edit: 'አሻሽ',
      remove: 'አስወግድ',
      save: 'አስቀምጥ',
      cancel: 'ይቅር',
      noOrders: 'ትዕዛዛዎች ገናሸርም',
      noSavedItems: 'የተቀመጡ እቃዎች የሉም',
      startShopping: 'ግዢን ጀምሩ'
    }
  };

  const t = translations[language];

  useEffect(() => {
    checkAuth();
    loadDashboardData();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('customerToken');
    const user = localStorage.getItem('customerUser');
    
    if (!token || !user) {
      navigate('/customer-login');
      return;
    }
    
    setCustomerData(JSON.parse(user));
  };

  const loadDashboardData = async () => {
    try {
      const [ordersRes, savedRes] = await Promise.all([
        API.get('/customer/orders'),
        API.get('/customer/saved-items')
      ]);
      
      setOrders(ordersRes.data);
      setSavedItems(savedRes.data);
    } catch (error) {
      console.error('Dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalSpent = () => {
    return orders
      .filter(order => order.status === 'delivered')
      .reduce((total, order) => total + order.total, 0);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      processing: '#17a2b8',
      shipped: '#007bff',
      delivered: '#28a745',
      cancelled: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{t.totalOrders}</h3>
            <p className="stat-number">{orders.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{t.totalSpent}</h3>
            <p className="stat-number">ETB {calculateTotalSpent().toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <h3>{t.savedProducts}</h3>
            <p className="stat-number">{savedItems.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-content">
            <h3>{t.personalInfo}</h3>
            <p className="stat-number">{customerData?.firstName || 'Customer'}</p>
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h3>{t.recentOrders}</h3>
        {orders.length > 0 ? (
          <div className="orders-list">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="order-card">
                <div className="order-info">
                  <h4>{t.orderNumber}{order.orderNumber}</h4>
                  <p>{formatDate(order.createdAt)}</p>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {t[order.status] || order.status}
                  </span>
                </div>
                <div className="order-total">
                  <p>ETB {order.total.toFixed(2)}</p>
                  <button 
                    className="btn btn-sm"
                    onClick={() => navigate(`/order-details/${order.id}`)}
                  >
                    {t.viewDetails}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>{t.noOrders}</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/products')}
            >
              {t.startShopping}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="orders-section">
      <div className="section-header">
        <h2>{t.orders}</h2>
        <div className="filter-buttons">
          <button className="btn btn-sm active">All</button>
          <button className="btn btn-sm">Pending</button>
          <button className="btn btn-sm">Delivered</button>
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="orders-table">
          <div className="table-header">
            <div>{t.orderNumber}</div>
            <div>{t.date}</div>
            <div>{t.status}</div>
            <div>{t.total}</div>
            <div>Actions</div>
          </div>
          {orders.map(order => (
            <div key={order.id} className="table-row">
              <div>#{order.orderNumber}</div>
              <div>{formatDate(order.createdAt)}</div>
              <div>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {t[order.status] || order.status}
                </span>
              </div>
              <div>ETB {order.total.toFixed(2)}</div>
              <div className="action-buttons">
                <button 
                  className="btn btn-sm"
                  onClick={() => navigate(`/order-details/${order.id}`)}
                >
                  {t.viewDetails}
                </button>
                {order.status === 'delivered' && (
                  <button className="btn btn-sm btn-success">
                    {t.reorder}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>{t.noOrders}</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            {t.startShopping}
          </button>
        </div>
      )}
    </div>
  );

  const renderSavedItems = () => (
    <div className="saved-items-section">
      <h2>{t.savedItems}</h2>
      {savedItems.length > 0 ? (
        <div className="saved-items-grid">
          {savedItems.map(item => (
            <div key={item.id} className="saved-item-card">
              <div className="item-image">
                <img 
                  src={item.images?.[0] || item.image || '/placeholder-product.jpg'} 
                  alt={item.name}
                />
              </div>
              <div className="item-details">
                <h4>{item.name}</h4>
                <p className="item-price">ETB {item.price}</p>
                <p className="item-shop">{item.shopName}</p>
              </div>
              <div className="item-actions">
                <button className="btn btn-sm btn-primary">
                  Add to Cart
                </button>
                <button className="btn btn-sm btn-outline">
                  {t.remove}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>{t.noSavedItems}</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            {t.startShopping}
          </button>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="profile-section">
      <h2>{t.profile}</h2>
      <div className="profile-form">
        <div className="form-row">
          <div className="form-group">
            <label>{t.firstName}</label>
            <input 
              type="text" 
              defaultValue={customerData?.firstName || ''}
              disabled
            />
          </div>
          <div className="form-group">
            <label>{t.lastName}</label>
            <input 
              type="text" 
              defaultValue={customerData?.lastName || ''}
              disabled
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>{t.email}</label>
          <input 
            type="email" 
            defaultValue={customerData?.email || ''}
            disabled
          />
        </div>
        
        <div className="form-group">
          <label>{t.phone}</label>
          <input 
            type="tel" 
            defaultValue={customerData?.phone || ''}
            disabled
          />
        </div>

        <div className="password-section">
          <h3>{t.changePassword}</h3>
          <div className="form-group">
            <label>{t.currentPassword}</label>
            <input type="password" />
          </div>
          <div className="form-group">
            <label>{t.newPassword}</label>
            <input type="password" />
          </div>
          <div className="form-group">
            <label>{t.confirmNewPassword}</label>
            <input type="password" />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary">{t.updateProfile}</button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="customer-dashboard">
      <div className="dashboard-header">
        <h1>{t.welcome}, {customerData?.firstName}!</h1>
        <p>{t.dashboard}</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          {t.overview}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          {t.orders}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          {t.savedItems}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          {t.profile}
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'saved' && renderSavedItems()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  );
};

export default CustomerDashboard;
