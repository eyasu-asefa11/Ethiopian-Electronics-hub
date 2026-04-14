import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SellerAnalytics.css';
import API from '../api';

const SellerAnalytics = ({ user, shopId }) => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30days');
  const [analytics, setAnalytics] = useState({
    overview: {},
    topProducts: [],
    viewsData: [],
    messagesData: [],
    salesData: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user && shopId) {
      fetchAnalytics();
    }
  }, [user, shopId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/shops/${shopId}/analytics`, {
        params: { dateRange: timeRange }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="analytics-overview">
      <h3>📊 Shop Performance Overview</h3>
      <div className="overview-grid">
        <div className="metric-card">
          <div className="metric-icon">👁️</div>
          <div className="metric-info">
            <h3>{analytics.overview.totalViews || 0}</h3>
            <p>Product Views</p>
            <span className="metric-change positive">
              +{analytics.overview.viewsGrowth || 0}% from last period
            </span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">💬</div>
          <div className="metric-info">
            <h3>{analytics.overview.totalMessages || 0}</h3>
            <p>Customer Messages</p>
            <span className="metric-change positive">
              +{analytics.overview.messagesGrowth || 0}% from last period
            </span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📦</div>
          <div className="metric-info">
            <h3>{analytics.overview.totalSales || 0}</h3>
            <p>Products Sold</p>
            <span className="metric-change positive">
              +{analytics.overview.salesGrowth || 0}% from last period
            </span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-info">
            <h3>ETB {analytics.overview.totalRevenue ? analytics.overview.totalRevenue.toLocaleString() : 0}</h3>
            <p>Total Revenue</p>
            <span className="metric-change positive">
              +{analytics.overview.revenueGrowth || 0}% from last period
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProductViews = () => (
    <div className="product-views">
      <h3>👁️ Product Views Analysis</h3>
      <div className="views-chart">
        <div className="chart-placeholder">
          <h4>📈 Views Over Time</h4>
          <div className="chart-data">
            {analytics.viewsData.map((data, index) => (
              <div key={index} className="chart-bar">
                <div className="bar" style={{ height: `${(data.views / Math.max(...analytics.viewsData.map(d => d.views))) * 100}%` }}></div>
                <div className="bar-label">{new Date(data.date).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="top-products">
        <h4>🏆 Most Viewed Products</h4>
        <div className="products-list">
          {analytics.topProducts.map((product, index) => (
            <div key={product.id} className="product-stat">
              <div className="product-rank">#{index + 1}</div>
              <div className="product-info">
                <h5>{product.name}</h5>
                <p>{product.brand} • {product.model}</p>
              </div>
              <div className="product-metrics">
                <div className="metric">
                  <span className="value">{product.views}</span>
                  <span className="label">Views</span>
                </div>
                <div className="metric">
                  <span className="value">{product.inquiries}</span>
                  <span className="label">Inquiries</span>
                </div>
                <div className="metric">
                  <span className="value">{product.sold}</span>
                  <span className="label">Sold</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCustomerMessages = () => (
    <div className="customer-messages">
      <h3>💬 Customer Messages</h3>
      <div className="messages-chart">
        <div className="chart-placeholder">
          <h4>📊 Messages Over Time</h4>
          <div className="chart-data">
            {analytics.messagesData.map((data, index) => (
              <div key={index} className="chart-bar">
                <div className="bar messages" style={{ height: `${(data.messages / Math.max(...analytics.messagesData.map(d => d.messages))) * 100}%` }}></div>
                <div className="bar-label">{new Date(data.date).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="message-stats">
        <h4>📈 Message Statistics</h4>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>{analytics.overview.totalMessages || 0}</h4>
            <p>Total Messages</p>
          </div>
          <div className="stat-card">
            <h4>{analytics.overview.responseRate || 0}%</h4>
            <p>Response Rate</p>
          </div>
          <div className="stat-card">
            <h4>{analytics.overview.avgResponseTime || 'N/A'}</h4>
            <p>Avg Response Time</p>
          </div>
          <div className="stat-card">
            <h4>{analytics.overview.conversionRate || 0}%</h4>
            <p>Conversion Rate</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPopularProducts = () => (
    <div className="popular-products">
      <h3>🔥 Popular Products</h3>
      <div className="products-grid">
        {analytics.topProducts.map((product, index) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.images?.[0] || '/placeholder-product.jpg'} alt={product.name} />
              <div className="product-rank">#{index + 1}</div>
            </div>
            <div className="product-info">
              <h4>{product.name}</h4>
              <p>{product.brand} • {product.model}</p>
              <div className="product-stats">
                <div className="stat">
                  <span className="value">{product.views}</span>
                  <span className="label">Views</span>
                </div>
                <div className="stat">
                  <span className="value">{product.inquiries}</span>
                  <span className="label">Inquiries</span>
                </div>
                <div className="stat">
                  <span className="value">{product.sold}</span>
                  <span className="label">Sold</span>
                </div>
              </div>
              <div className="product-price">
                <span className="price">ETB {product.price.toLocaleString()}</span>
                <span className="stock">{product.stock_quantity} in stock</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeaturedProducts = () => (
    <div className="featured-products">
      <h3>⭐ Featured Products Management</h3>
      <div className="featured-info">
        <p>Featured products get increased visibility and appear at the top of search results</p>
      </div>
      
      <div className="products-list">
        {analytics.topProducts.map(product => (
          <div key={product.id} className="featured-product">
            <div className="product-info">
              <h4>{product.name}</h4>
              <p>{product.brand} • {product.model}</p>
              <div className="product-stats">
                <span>Views: {product.views}</span>
                <span>Inquiries: {product.inquiries}</span>
                <span>Sold: {product.sold}</span>
              </div>
            </div>
            <div className="featured-toggle">
              <label className="switch">
                <input type="checkbox" checked={product.is_featured} />
                <span className="slider"></span>
              </label>
              <span className="featured-label">
                {product.is_featured ? 'Featured' : 'Not Featured'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="seller-analytics">
      <div className="analytics-header">
        <h1>📊 Seller Analytics</h1>
        <p>Track your shop performance and customer demand</p>
        
        <div className="time-range-selector">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      <div className="analytics-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'views' ? 'active' : ''}`}
          onClick={() => setActiveTab('views')}
        >
          👁️ Product Views
        </button>
        <button 
          className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          💬 Messages
        </button>
        <button 
          className={`tab-btn ${activeTab === 'popular' ? 'active' : ''}`}
          onClick={() => setActiveTab('popular')}
        >
          🔥 Popular
        </button>
        <button 
          className={`tab-btn ${activeTab === 'featured' ? 'active' : ''}`}
          onClick={() => setActiveTab('featured')}
        >
          ⭐ Featured
        </button>
      </div>

      <div className="analytics-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'views' && renderProductViews()}
        {activeTab === 'messages' && renderCustomerMessages()}
        {activeTab === 'popular' && renderPopularProducts()}
        {activeTab === 'featured' && renderFeaturedProducts()}
      </div>
    </div>
  );
};

export default SellerAnalytics;
