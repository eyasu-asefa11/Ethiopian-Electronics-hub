import React, { useState, useEffect } from 'react';
import './ShopAnalytics.css';
import API from '../api';

const ShopAnalytics = ({ user, shopId }) => {
  const [timeRange, setTimeRange] = useState('30days');
  const [analytics, setAnalytics] = useState({
    overview: {},
    dailyStats: [],
    topProducts: [],
    customerStats: [],
    performance: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, shopId]);

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

  const exportReport = async () => {
    try {
      const response = await API.get(`/shops/${shopId}/export`, {
        params: { dateRange: timeRange },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `shop-analytics-${timeRange}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting analytics:', error);
    }
  };

  const renderOverview = () => (
    <div className="analytics-overview">
      <div className="overview-cards">
        <div className="metric-card">
          <div className="metric-icon">👁️</div>
          <div className="metric-info">
            <h3>{analytics.overview.totalViews || 0}</h3>
            <p>Total Views</p>
            <span className="metric-change positive">
              +{analytics.overview.viewsGrowth || 0}% from last period
            </span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📞</div>
          <div className="metric-info">
            <h3>{analytics.overview.totalInquiries || 0}</h3>
            <p>Customer Inquiries</p>
            <span className="metric-change positive">
              +{analytics.overview.inquiriesGrowth || 0}% from last period
            </span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">📦</div>
          <div className="metric-info">
            <h3>{analytics.overview.productsSold || 0}</h3>
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

  const renderPerformanceChart = () => (
    <div className="performance-chart">
      <h3>Performance Over Time</h3>
      <div className="chart-container">
        {analytics.dailyStats.length > 0 ? (
          <div className="chart-placeholder">
            📊 Performance chart would render here
            <div className="chart-data">
              {analytics.dailyStats.map((stat, index) => (
                <div key={index} className="chart-bar">
                  <div className="bar" style={{ height: `${(stat.views / Math.max(...analytics.dailyStats.map(s => s.views))) * 100}%` }}></div>
                  <div className="bar-label">{new Date(stat.date).getDate()}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-data">
            No performance data available for selected period
          </div>
        )}
      </div>
    </div>
  );

  const renderTopProducts = () => (
    <div className="top-products">
      <h3>Top Performing Products</h3>
      <div className="products-list">
        {analytics.topProducts.length > 0 ? (
          analytics.topProducts.map((product, index) => (
            <div key={product.id} className="product-stat">
              <div className="product-rank">#{index + 1}</div>
              <div className="product-info">
                <h4>{product.name}</h4>
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
                <div className="metric">
                  <span className="value">ETB {product.revenue.toLocaleString()}</span>
                  <span className="label">Revenue</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">
            No product performance data available
          </div>
        )}
      </div>
    </div>
  );

  const renderCustomerInsights = () => (
    <div className="customer-insights">
      <h3>Customer Insights</h3>
      <div className="insights-grid">
        <div className="insight-card">
          <h4>Top Cities</h4>
          <div className="city-list">
            {analytics.customerStats.topCities?.map((city, index) => (
              <div key={index} className="city-item">
                <span className="city-name">{city.city}</span>
                <span className="city-count">{city.count} customers</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="insight-card">
          <h4>Peak Hours</h4>
          <div className="peak-hours">
            {analytics.customerStats.peakHours?.map((hour, index) => (
              <div key={index} className="hour-item">
                <span className="hour">{hour.hour}:00</span>
                <div className="hour-bar">
                  <div 
                    className="hour-fill" 
                    style={{ width: `${(hour.activity / Math.max(...analytics.customerStats.peakHours.map(h => h.activity))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="insight-card">
          <h4>Popular Categories</h4>
          <div className="category-stats">
            {analytics.customerStats.topCategories?.map((category, index) => (
              <div key={index} className="category-item">
                <span className="category-name">{category.category}</span>
                <span className="category-percentage">{category.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="shop-analytics">
      <div className="analytics-header">
        <h1>Shop Analytics</h1>
        <div className="header-controls">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-range-select"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          <button onClick={exportReport} className="export-btn">
            📊 Export Report
          </button>
        </div>
      </div>

      <div className="analytics-content">
        {renderOverview()}
        {renderPerformanceChart()}
        {renderTopProducts()}
        {renderCustomerInsights()}
      </div>
    </div>
  );
};

export default ShopAnalytics;
