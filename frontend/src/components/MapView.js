import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MapView.css';
import API from '../api';

const MapView = ({ selectedCity, onShopSelect }) => {
  const navigate = useNavigate();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 9.1450, lng: 40.4897 }); // Default: Ethiopia center
  const [zoom, setZoom] = useState(10);

  const ethiopianCityCoordinates = {
    'addis_ababa': { lat: 9.1450, lng: 40.4897, zoom: 12 },
    'hawassa': { lat: 7.0595, lng: 38.4675, zoom: 13 },
    'dilla': { lat: 6.4167, lng: 38.3167, zoom: 14 },
    'hossana': { lat: 7.5500, lng: 37.8500, zoom: 14 },
    'bahirdar': { lat: 11.6000, lng: 37.3667, zoom: 13 },
    'adama': { lat: 8.5500, lng: 39.2833, zoom: 13 },
    'jimma': { lat: 7.6667, lng: 36.8333, zoom: 13 },
    'mekelle': { lat: 13.5000, lng: 39.4667, zoom: 13 },
    'arbaminch': { lat: 6.0333, lng: 37.5500, zoom: 13 },
    'gondar': { lat: 12.6000, lng: 37.4667, zoom: 13 }
  };

  useEffect(() => {
    if (selectedCity) {
      fetchShopsInCity();
      // Update map center to selected city
      const cityCoords = ethiopianCityCoordinates[selectedCity];
      if (cityCoords) {
        setMapCenter(cityCoords);
        setZoom(cityCoords.zoom);
      }
    } else {
      fetchAllShops();
    }
  }, [selectedCity]);

  const fetchShopsInCity = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/shops/by-city/${selectedCity}`);
      setShops(response.data);
    } catch (error) {
      console.error('Error fetching shops:', error);
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllShops = async () => {
    try {
      setLoading(true);
      const response = await API.get('/shops');
      setShops(response.data);
    } catch (error) {
      console.error('Error fetching all shops:', error);
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShopClick = (shop) => {
    setSelectedShop(shop);
    if (onShopSelect) {
      onShopSelect(shop);
    }
  };

  const renderMap = () => (
    <div className="map-container">
      <div className="map-header">
        <h2>🗺️ Electronics Shops Map</h2>
        <p>Showing {shops.length} shops {selectedCity ? `in ${selectedCity}` : 'nationwide'}</p>
      </div>
      
      <div className="map-wrapper">
        {/* This would integrate with a real map service like Google Maps or Mapbox */}
        <div className="map-placeholder">
          <div className="map-content">
            <div className="map-center">
              <div className="map-icon">🗺️</div>
              <h3>Interactive Map View</h3>
              <p>Showing electronics shops in {selectedCity || 'Ethiopia'}</p>
              <div className="map-coordinates">
                <small>Center: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}</small>
                <small>Zoom: {zoom}x</small>
              </div>
            </div>
            
            <div className="shop-markers">
              {shops.map((shop, index) => (
                <div 
                  key={shop.id}
                  className="shop-marker"
                  style={{
                    position: 'absolute',
                    left: `${20 + (index * 80) % 80}%`,
                    top: `${30 + (index * 60) % 60}%`
                  }}
                  onClick={() => handleShopClick(shop)}
                >
                  <div className="marker-icon">
                    {shop.is_verified ? '🏪' : '📱'}
                  </div>
                  <div className="marker-label">
                    {shop.name_en}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="map-controls">
        <button onClick={() => setZoom(Math.max(zoom - 1, 5))} className="zoom-btn">
          − Zoom Out
        </button>
        <button onClick={() => setZoom(Math.min(zoom + 1, 20))} className="zoom-btn">
          + Zoom In
        </button>
        <button onClick={fetchAllShops} className="reset-btn">
          🔄 Reset View
        </button>
      </div>
    </div>
  );

  const renderShopList = () => (
    <div className="shop-list">
      <h3>📋 Shop List</h3>
      <div className="shop-cards">
        {shops.map(shop => (
          <div key={shop.id} className="shop-card" onClick={() => handleShopClick(shop)}>
            <div className="shop-header">
              <div className="shop-info">
                <h4>{shop.name_en}</h4>
                <p>{shop.name_am}</p>
                <div className="shop-rating">
                  {'⭐'.repeat(Math.round(shop.rating || 0))} ({shop.review_count || 0})
                </div>
                {shop.is_verified && (
                  <div className="verified-badge">✓ Verified</div>
                )}
              </div>
              <div className="shop-location">
                <span className="location-icon">📍</span>
                <span>{shop.city}</span>
              </div>
            </div>
            
            <div className="shop-details">
              <p><strong>Address:</strong> {shop.address}</p>
              <p><strong>Phone:</strong> {shop.phone}</p>
              <p><strong>Products:</strong> {shop.product_count || 0}</p>
              <p><strong>Rating:</strong> {shop.rating || 'No rating'}</p>
            </div>
            
            <div className="shop-actions">
              <button className="view-products-btn">
                📱 View Products
              </button>
              <button className="contact-btn">
                📞 Contact Shop
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSelectedShop = () => {
    if (!selectedShop) return null;

    return (
      <div className="selected-shop-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>{selectedShop.name_en}</h3>
            <button onClick={() => setSelectedShop(null)} className="close-btn">×</button>
          </div>
          
          <div className="shop-details-full">
            <div className="shop-info-full">
              <h4>{selectedShop.name_am}</h4>
              <div className="shop-rating">
                {'⭐'.repeat(Math.round(selectedShop.rating || 0))} ({selectedShop.review_count || 0} reviews)
              </div>
              {selectedShop.is_verified && (
                <div className="verified-badge">✓ Verified Shop</div>
              )}
            </div>
            
            <div className="shop-contact-info">
              <p><strong>📍 Address:</strong> {selectedShop.address}</p>
              <p><strong>🏙️ City:</strong> {selectedShop.city}</p>
              <p><strong>📞 Phone:</strong> {selectedShop.phone}</p>
              {selectedShop.whatsapp && (
                <p><strong>💬 WhatsApp:</strong> {selectedShop.whatsapp}</p>
              )}
              {selectedShop.email && (
                <p><strong>📧 Email:</strong> {selectedShop.email}</p>
              )}
              <p><strong>🕒 Hours:</strong> {selectedShop.opening_hours || '8:00 AM - 8:00 PM'}</p>
            </div>
            
            <div className="shop-stats">
              <div className="stat">
                <span className="stat-value">{selectedShop.product_count || 0}</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat">
                <span className="stat-value">{selectedShop.products_sold || 0}</span>
                <span className="stat-label">Sold</span>
              </div>
              <div className="stat">
                <span className="stat-value">{selectedShop.view_count || 0}</span>
                <span className="stat-label">Views</span>
              </div>
            </div>
          </div>
          
          <div className="modal-actions">
            <button onClick={() => navigate(`/shop/${selectedShop.id}/products`)} className="view-products-btn">
              📱 View Products
            </button>
            <button onClick={() => window.open(`tel:${selectedShop.phone}`)} className="call-btn">
              📞 Call Shop
            </button>
            <button className="directions-btn">
              🗺️ Get Directions
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading map...</div>;
  }

  return (
    <div className="map-view">
      <div className="map-view-header">
        <h1>🗺️ Electronics Shops Map</h1>
        <p>Find electronics shops near you in {selectedCity || 'Ethiopia'}</p>
      </div>

      <div className="map-content">
        {renderMap()}
        {renderShopList()}
      </div>

      {renderSelectedShop()}
    </div>
  );
};

export default MapView;
