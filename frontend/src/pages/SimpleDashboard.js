import React, { useState, useEffect } from 'react';
import './SimpleDashboard.css';
import API from '../api';

const SimpleDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    users: [],
    shops: [],
    products: [],
    stats: {
      totalUsers: 0,
      totalShops: 0,
      totalProducts: 0
    }
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data from backend
      const [usersRes, shopsRes, productsRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/shops'),
        API.get('/admin/products')
      ]);

      setData({
        users: usersRes.data || [],
        shops: shopsRes.data || [],
        products: productsRes.data || [],
        stats: {
          totalUsers: usersRes.data?.length || 0,
          totalShops: shopsRes.data?.length || 0,
          totalProducts: productsRes.data?.length || 0
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      // If API fails, show mock data for demonstration
      setData({
        users: [
          { id: 1, username: 'eyasu', email: '+251911234567', city: 'Dilla', role: 'seller', shop_name_en: 'Eyasu Electronics', created_at: new Date().toISOString() },
          { id: 2, username: 'abel', email: '+251922345678', city: 'Hawassa', role: 'buyer', created_at: new Date().toISOString() }
        ],
        shops: [
          { id: 1, name_en: 'Eyasu Electronics', name_am: 'እያሱ ኤሌክትሮኒክስ', city: 'Dilla', phone: '+251911234567', is_verified: true, created_at: new Date().toISOString() }
        ],
        products: [
          { id: 1, name: 'Samsung Galaxy A05', brand: 'Samsung', model: 'A057F', price: 14500, stock_quantity: 8, city: 'Dilla', shop_name: 'Eyasu Electronics', created_at: new Date().toISOString() }
        ],
        stats: {
          totalUsers: 2,
          totalShops: 1,
          totalProducts: 1
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="overview-section">
      <h2>📊 System Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{data.stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.stats.totalShops}</div>
          <div className="stat-label">Registered Shops</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{data.stats.totalProducts}</div>
          <div className="stat-label">Products Listed</div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="users-section">
      <h2>👥 Registered Users ({data.users.length})</h2>
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Phone/Email</th>
              <th>City</th>
              <th>Role</th>
              <th>Shop Name</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map(user => (
              <tr key={user.id}>
                <td><strong>{user.username}</strong></td>
                <td>{user.email}</td>
                <td>{user.city || '-'}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  {user.shop_name_en ? (
                    <div>
                      <div>{user.shop_name_en}</div>
                      <small>{user.shop_name_am}</small>
                    </div>
                  ) : (
                    <span className="no-shop">No shop</span>
                  )}
                </td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderShops = () => (
    <div className="shops-section">
      <h2>🏪 Registered Shops ({data.shops.length})</h2>
      <div className="shops-grid">
        {data.shops.map(shop => (
          <div key={shop.id} className="shop-card">
            <div className="shop-header">
              <h3>{shop.name_en}</h3>
              <p>{shop.name_am}</p>
              <span className={`verification-badge ${shop.is_verified ? 'verified' : 'pending'}`}>
                {shop.is_verified ? '✓ Verified' : '⏳ Pending'}
              </span>
            </div>
            <div className="shop-details">
              <p><strong>📍 Location:</strong> {shop.city}</p>
              <p><strong>📱 Phone:</strong> {shop.phone}</p>
              <p><strong>📞 WhatsApp:</strong> {shop.whatsapp || shop.phone}</p>
              <p><strong>📧 Email:</strong> {shop.email || 'Not provided'}</p>
              <p><strong>📅 Registered:</strong> {new Date(shop.created_at).toLocaleDateString()}</p>
            </div>
            <div className="shop-stats">
              <div className="stat">
                <span className="stat-value">{shop.product_count || 0}</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat">
                <span className="stat-value">{shop.view_count || 0}</span>
                <span className="stat-label">Views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="products-section">
      <h2>📱 Listed Products ({data.products.length})</h2>
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
              <h3>{product.name}</h3>
              <p className="product-brand">{product.brand} • {product.model}</p>
              <div className="product-specs">
                <span>💾 {product.ram || 'N/A'}</span>
                <span>📱 {product.storage || 'N/A'}</span>
                <span>🔋 {product.battery || 'N/A'}</span>
              </div>
              <div className="product-price">
                <span className="current-price">ETB {product.price?.toLocaleString()}</span>
                {product.original_price && product.original_price > product.price && (
                  <span className="discount-badge">
                    {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                  </span>
                )}
              </div>
              <div className="product-stock">
                <span className={`stock-status ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.stock_quantity > 0 ? 
                    `✓ ${product.stock_quantity} Available` : 
                    '✗ Out of Stock'
                  }
                </span>
              </div>
              <div className="shop-info">
                <span className="shop-name">{product.shop_name}</span>
                <span className="shop-location">📍 {product.city}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="simple-dashboard">
        <div className="loading">
          <h2>🔄 Loading Dashboard...</h2>
          <p>Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="simple-dashboard">
      <div className="dashboard-header">
        <h1>🎯 Electronics Marketplace Dashboard</h1>
        <p>Complete overview of your Ethiopian electronics marketplace</p>
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
          👥 Users ({data.stats.totalUsers})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'shops' ? 'active' : ''}`}
          onClick={() => setActiveTab('shops')}
        >
          🏪 Shops ({data.stats.totalShops})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📱 Products ({data.stats.totalProducts})
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'shops' && renderShops()}
        {activeTab === 'products' && renderProducts()}
      </div>

      <div className="dashboard-footer">
        <p>🇪🇹 Ethiopia Electronics Marketplace - Connecting buyers and sellers nationwide</p>
      </div>
    </div>
  );
};

export default SimpleDashboard;
