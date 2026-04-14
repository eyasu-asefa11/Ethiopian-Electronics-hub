import React, { useState, useEffect } from 'react';
import './AdminDashboardEnhanced.css';
import API from '../api';

const AdminDashboardEnhanced = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    overview: {},
    users: [],
    shops: [],
    products: [],
    analytics: {},
    recentActivity: []
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    city: '',
    dateRange: '30days'
  });

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab, filters]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [overviewRes, usersRes, shopsRes, productsRes, analyticsRes, activityRes] = await Promise.all([
        API.get('/admin/overview'),
        API.get('/admin/users', { params: filters }),
        API.get('/admin/shops', { params: filters }),
        API.get('/admin/products', { params: filters }),
        API.get('/admin/analytics', { params: { dateRange: filters.dateRange } }),
        API.get('/admin/recent-activity')
      ]);

      setData({
        overview: overviewRes.data,
        users: usersRes.data,
        shops: shopsRes.data,
        products: productsRes.data,
        analytics: analyticsRes.data,
        recentActivity: activityRes.data
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleShopVerification = async (shopId, status) => {
    try {
      await API.post(`/admin/shops/${shopId}/verify`, { status });
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating shop status:', error);
    }
  };

  const handleUserStatus = async (userId, status) => {
    try {
      await API.post(`/admin/users/${userId}/status`, { status });
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const exportData = async (type) => {
    try {
      const response = await API.get(`/admin/export/${type}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-export.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{data.overview.totalUsers || 0}</h3>
            <p>Total Users</p>
            <span className="stat-change positive">
              +{data.overview.newUsersThisMonth || 0} this month
            </span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-info">
            <h3>{data.overview.totalShops || 0}</h3>
            <p>Registered Shops</p>
            <span className="stat-change positive">
              +{data.overview.newShopsThisMonth || 0} this month
            </span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📱</div>
          <div className="stat-info">
            <h3>{data.overview.totalProducts || 0}</h3>
            <p>Total Products</p>
            <span className="stat-change positive">
              +{data.overview.newProductsThisMonth || 0} this month
            </span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>{data.overview.totalRevenue ? `ETB ${data.overview.totalRevenue.toLocaleString()}` : 'ETB 0'}</h3>
            <p>Platform Revenue</p>
            <span className="stat-change positive">
              +{data.overview.revenueGrowth || 0}% growth
            </span>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>User Registration Trend</h3>
          <div className="chart-placeholder">
            📊 User registration chart would go here
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Product Categories</h3>
          <div className="chart-placeholder">
            📈 Product categories chart would go here
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="users-section">
      <div className="section-header">
        <h3>Registered Users</h3>
        <div className="section-actions">
          <button onClick={() => exportData('users')} className="export-btn">
            📊 Export Users
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search users..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="search-input"
        />
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
        <select
          value={filters.city}
          onChange={(e) => handleFilterChange('city', e.target.value)}
          className="filter-select"
        >
          <option value="">All Cities</option>
          <option value="addis_ababa">Addis Ababa</option>
          <option value="hawassa">Hawassa</option>
          <option value="hossana">Hossana</option>
        </select>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Role</th>
              <th>Shop</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map(user => (
              <tr key={user.id}>
                <td className="user-info">
                  <div className="user-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="user-name">{user.username}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div>📱 {user.phone}</div>
                    {user.city && <div>📍 {user.city}</div>}
                  </div>
                </td>
                <td>{user.city || '-'}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  {user.shop_name_en ? (
                    <div className="shop-info">
                      <div className="shop-name">{user.shop_name_en}</div>
                      <div className="shop-name-am">{user.shop_name_am}</div>
                    </div>
                  ) : (
                    <span className="no-shop">No shop</span>
                  )}
                </td>
                <td>
                  <span className={`status-badge ${user.status || 'active'}`}>
                    {user.status || 'Active'}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button className="view-btn">View</button>
                    <button className="suspend-btn">Suspend</button>
                    <button className="delete-btn">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderShops = () => (
    <div className="shops-section">
      <div className="section-header">
        <h3>Registered Shops</h3>
        <div className="section-actions">
          <button onClick={() => exportData('shops')} className="export-btn">
            📊 Export Shops
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search shops..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="search-input"
        />
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="shops-grid">
        {data.shops.map(shop => (
          <div key={shop.id} className="shop-card">
            <div className="shop-header">
              <div className="shop-logo">
                {shop.logo ? (
                  <img src={shop.logo} alt={shop.name_en} />
                ) : (
                  <div className="shop-avatar">
                    {shop.name_en.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="shop-info">
                <h4>{shop.name_en}</h4>
                <p>{shop.name_am}</p>
                <div className="shop-rating">
                  {'⭐'.repeat(Math.round(shop.rating || 0))} ({shop.review_count || 0})
                </div>
              </div>
              <div className="shop-status">
                <span className={`verification-badge ${shop.is_verified ? 'verified' : 'pending'}`}>
                  {shop.is_verified ? '✓ Verified' : '⏳ Pending'}
                </span>
              </div>
            </div>

            <div className="shop-details">
              <p><strong>📍 Location:</strong> {shop.address}, {shop.city}</p>
              <p><strong>📱 Phone:</strong> {shop.phone}</p>
              <p><strong>👤 Owner:</strong> {shop.owner_username}</p>
              <p><strong>📦 Products:</strong> {shop.product_count || 0}</p>
              <p><strong>👁️ Views:</strong> {shop.view_count || 0}</p>
            </div>

            <div className="shop-stats">
              <div className="stat">
                <span className="stat-value">{shop.total_revenue || 0}</span>
                <span className="stat-label">Revenue (ETB)</span>
              </div>
              <div className="stat">
                <span className="stat-value">{shop.products_sold || 0}</span>
                <span className="stat-label">Products Sold</span>
              </div>
              <div className="stat">
                <span className="stat-value">{shop.messages_count || 0}</span>
                <span className="stat-label">Messages</span>
              </div>
            </div>

            <div className="shop-actions">
              <button className="view-shop-btn">View Shop</button>
              <button className="view-products-btn">View Products</button>
              {shop.is_verified ? (
                <button className="suspend-shop-btn">Suspend</button>
              ) : (
                <button 
                  onClick={() => handleShopVerification(shop.id, 'verified')}
                  className="verify-shop-btn"
                >
                  Verify Shop
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="products-section">
      <div className="section-header">
        <h3>All Products</h3>
        <div className="section-actions">
          <button onClick={() => exportData('products')} className="export-btn">
            📊 Export Products
          </button>
        </div>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="search-input"
        />
        <select
          value={filters.city}
          onChange={(e) => handleFilterChange('city', e.target.value)}
          className="filter-select"
        >
          <option value="">All Cities</option>
          <option value="addis_ababa">Addis Ababa</option>
          <option value="hawassa">Hawassa</option>
        </select>
      </div>

      <div className="products-grid">
        {data.products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img 
                src={product.images?.[0] || '/placeholder-product.jpg'} 
                alt={product.name}
              />
              <span className="product-category">{product.category}</span>
            </div>
            <div className="product-info">
              <h4>{product.name}</h4>
              <p className="product-brand">{product.brand}</p>
              <p className="product-model">{product.model}</p>
              <div className="product-price">
                ETB {product.price.toLocaleString()}
                {product.original_price && product.original_price > product.price && (
                  <span className="discount-badge">
                    {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                  </span>
                )}
              </div>
              <div className="product-stats">
                <span>👁️ {product.view_count || 0} views</span>
                <span>❤️ {product.wishlist_count || 0} saved</span>
                <span>📦 {product.stock_quantity} in stock</span>
              </div>
            </div>
            <div className="product-shop">
              <p><strong>Shop:</strong> {product.shop_name}</p>
              <p><strong>Location:</strong> {product.city}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard-enhanced">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, shops, and products across Ethiopia</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button 
          className={`tab-btn ${activeTab === 'shops' ? 'active' : ''}`}
          onClick={() => setActiveTab('shops')}
        >
          🏪 Shops
        </button>
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📱 Products
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'shops' && renderShops()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <h3>Analytics</h3>
            <div className="analytics-placeholder">
              📊 Advanced analytics charts would go here
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity Feed */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-feed">
          {data.recentActivity.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">{activity.icon}</div>
              <div className="activity-content">
                <p>{activity.description}</p>
                <span className="activity-time">
                  {new Date(activity.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardEnhanced;
