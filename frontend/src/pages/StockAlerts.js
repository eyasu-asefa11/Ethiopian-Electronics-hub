import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StockAlerts.css';
import API from '../api';

const StockAlerts = ({ user }) => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAlert, setNewAlert] = useState({
    product_id: '',
    alert_type: 'available',
    target_price: '',
    email_notification: true,
    sms_notification: false
  });

  useEffect(() => {
    if (user) {
      fetchAlerts();
    } else {
      navigate('/auth');
    }
  }, [user]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await API.get('/stock-alerts');
      setAlerts(response.data);
    } catch (error) {
      console.error('Error fetching stock alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async () => {
    try {
      await API.post('/stock-alerts', newAlert);
      setShowCreateModal(false);
      setNewAlert({
        product_id: '',
        alert_type: 'available',
        target_price: '',
        email_notification: true,
        sms_notification: false
      });
      fetchAlerts();
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  const deleteAlert = async (alertId) => {
    try {
      await API.delete(`/stock-alerts/${alertId}`);
      setAlerts(alerts.filter(alert => alert.id !== alertId));
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  const renderAlerts = () => (
    <div className="alerts-container">
      <div className="alerts-header">
        <h2>🔔 Stock Alerts</h2>
        <button onClick={() => setShowCreateModal(true)} className="create-alert-btn">
          + Create Alert
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="no-alerts">
          <div className="no-alerts-icon">🔔</div>
          <h3>No Stock Alerts</h3>
          <p>Create alerts to get notified when products become available</p>
          <button onClick={() => setShowCreateModal(true)} className="create-first-alert">
            Create Your First Alert
          </button>
        </div>
      ) : (
        <div className="alerts-grid">
          {alerts.map(alert => (
            <div key={alert.id} className="alert-card">
              <div className="alert-header">
                <div className="alert-info">
                  <h4>{alert.product_name}</h4>
                  <p>{alert.brand} • {alert.model}</p>
                  <span className={`alert-type ${alert.alert_type}`}>
                    {alert.alert_type === 'available' ? '📦 Available' : '💰 Price Drop'}
                  </span>
                </div>
                <div className="alert-status">
                  <span className={`status ${alert.is_active ? 'active' : 'inactive'}`}>
                    {alert.is_active ? '🟢 Active' : '🔴 Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="alert-details">
                <div className="detail-item">
                  <span className="detail-icon">🏪</span>
                  <span>{alert.shop_name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <span>{alert.shop_city}</span>
                </div>
                {alert.target_price && (
                  <div className="detail-item">
                    <span className="detail-icon">💰</span>
                    <span>Alert at ETB {alert.target_price}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <span>Created {new Date(alert.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="alert-actions">
                <button className="edit-btn">✏️ Edit</button>
                <button 
                  onClick={() => deleteAlert(alert.id)}
                  className="delete-btn"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCreateModal = () => (
    <div className="modal-overlay">
      <div className="create-alert-modal">
        <h3>🔔 Create Stock Alert</h3>
        
        <div className="form-group">
          <label>Product Search</label>
          <input
            type="text"
            placeholder="Search for product..."
            className="product-search"
          />
        </div>
        
        <div className="form-group">
          <label>Alert Type</label>
          <select
            value={newAlert.alert_type}
            onChange={(e) => setNewAlert({...newAlert, alert_type: e.target.value})}
          >
            <option value="available">📦 When Available</option>
            <option value="price_drop">💰 When Price Drops</option>
          </select>
        </div>
        
        {newAlert.alert_type === 'price_drop' && (
          <div className="form-group">
            <label>Target Price (ETB)</label>
            <input
              type="number"
              value={newAlert.target_price}
              onChange={(e) => setNewAlert({...newAlert, target_price: e.target.value})}
              placeholder="Enter target price"
            />
          </div>
        )}
        
        <div className="form-group">
          <label>Notification Preferences</label>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={newAlert.email_notification}
                onChange={(e) => setNewAlert({...newAlert, email_notification: e.target.checked})}
              />
              Email notifications
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={newAlert.sms_notification}
                onChange={(e) => setNewAlert({...newAlert, sms_notification: e.target.checked})}
              />
              SMS notifications
            </label>
          </div>
        </div>
        
        <div className="modal-actions">
          <button onClick={() => setShowCreateModal(false)} className="cancel-btn">
            Cancel
          </button>
          <button onClick={createAlert} className="create-btn">
            Create Alert
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading stock alerts...</div>;
  }

  return (
    <div className="stock-alerts">
      <div className="alerts-header-main">
        <h1>🔔 Stock Alerts</h1>
        <p>Get notified when products become available or prices drop</p>
      </div>

      {renderAlerts()}
      {showCreateModal && renderCreateModal()}
    </div>
  );
};

export default StockAlerts;
