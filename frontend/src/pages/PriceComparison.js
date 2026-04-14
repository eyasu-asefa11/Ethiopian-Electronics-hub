import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PriceComparison.css';
import API from '../api';

const PriceComparison = ({ user }) => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showComparison, setShowComparison] = useState(false);

  const ethiopianCities = [
    { id: 'dilla', name: 'Dilla', name_am: 'ዲላ' },
    { id: 'hawassa', name: 'Hawassa', name_am: 'ሀዋሳ' },
    { id: 'addis_ababa', name: 'Addis Ababa', name_am: 'አዲስ አበባ' },
    { id: 'hossana', name: 'Hossana', name_am: 'ሆሳዕና' },
    { id: 'arbaminch', name: 'Arba Minch', name_am: 'አርባ ምንጭ' }
  ];

  useEffect(() => {
    if (selectedProduct && selectedCity) {
      fetchComparisonData();
    }
  }, [selectedProduct, selectedCity]);

  const fetchComparisonData = async () => {
    setLoading(true);
    try {
      const response = await API.get('/products/compare', {
        params: {
          city: selectedCity,
          product_name: selectedProduct.name,
          brand: selectedProduct.brand,
          model: selectedProduct.model
        }
      });
      setComparisonData(response.data);
      setShowComparison(true);
    } catch (error) {
      console.error('Error fetching comparison data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      const response = await API.get('/products/search', {
        params: { q: searchTerm, limit: 10 }
      });
      
      if (response.data.length > 0) {
        setSelectedProduct(response.data[0]);
      } else {
        alert('Product not found. Try searching with brand and model (e.g., "Samsung A057F")');
      }
    } catch (error) {
      console.error('Error searching product:', error);
    }
  };

  const renderProductSelector = () => (
    <div className="product-selector">
      <h2>🔍 Find Product to Compare</h2>
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for product (e.g., Samsung A057F, iPhone 13)"
          className="search-input"
          onKeyPress={(e) => e.key === 'Enter' && handleProductSearch()}
        />
        <button onClick={handleProductSearch} className="search-btn">
          🔍 Search
        </button>
      </div>
      
      {selectedProduct && (
        <div className="selected-product">
          <h3>Selected Product:</h3>
          <div className="product-card">
            <div className="product-info">
              <h4>{selectedProduct.name}</h4>
              <p>{selectedProduct.brand} • {selectedProduct.model}</p>
              <div className="product-specs">
                <span>💾 {selectedProduct.ram}</span>
                <span>📱 {selectedProduct.storage}</span>
                <span>🔋 {selectedProduct.battery}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {selectedProduct && (
        <div className="city-selector">
          <h3>📍 Select City for Comparison</h3>
          <div className="city-grid">
            {ethiopianCities.map(city => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city.id)}
                className={`city-btn ${selectedCity === city.id ? 'selected' : ''}`}
              >
                {city.name} / {city.name_am}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderComparison = () => {
    if (!showComparison || comparisonData.length === 0) {
      return (
        <div className="no-comparison">
          <div className="no-data-icon">📊</div>
          <h3>No Comparison Data Available</h3>
          <p>This product is not available in {ethiopianCities.find(c => c.id === selectedCity)?.name}</p>
          <button onClick={() => setShowComparison(false)} className="back-btn">
            ← Back to Search
          </button>
        </div>
      );
    }

    const sortedData = [...comparisonData].sort((a, b) => a.price - b.price);
    const lowestPrice = sortedData[0].price;
    const highestPrice = sortedData[sortedData.length - 1].price;
    const averagePrice = Math.round(sortedData.reduce((sum, item) => sum + item.price, 0) / sortedData.length);

    return (
      <div className="comparison-results">
        <div className="comparison-header">
          <h2>📊 Price Comparison: {selectedProduct.name}</h2>
          <p>in {ethiopianCities.find(c => c.id === selectedCity)?.name}</p>
          
          <div className="price-summary">
            <div className="summary-card lowest">
              <span className="label">Lowest Price</span>
              <span className="price">ETB {lowestPrice.toLocaleString()}</span>
            </div>
            <div className="summary-card average">
              <span className="label">Average Price</span>
              <span className="price">ETB {averagePrice.toLocaleString()}</span>
            </div>
            <div className="summary-card highest">
              <span className="label">Highest Price</span>
              <span className="price">ETB {highestPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Shop</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Condition</th>
                <th>Warranty</th>
                <th>Contact</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => (
                <tr key={item.id} className={index === 0 ? 'best-price' : ''}>
                  <td>
                    <div className="shop-info">
                      <strong>{item.shop_name}</strong>
                      <small>📍 {item.shop_city}</small>
                      {item.is_verified && <span className="verified-badge">✓ Verified</span>}
                    </div>
                  </td>
                  <td>
                    <div className="price-cell">
                      <span className="current-price">ETB {item.price.toLocaleString()}</span>
                      {item.original_price && item.original_price > item.price && (
                        <span className="original-price">ETB {item.original_price.toLocaleString()}</span>
                      )}
                      {index === 0 && <span className="best-deal-badge">🏆 Best Deal</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`stock ${item.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {item.stock_quantity > 0 ? `${item.stock_quantity} Available` : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <span className={`condition ${item.condition}`}>
                      {item.condition}
                    </span>
                  </td>
                  <td>
                    <span className="warranty">
                      {item.warranty_info || 'No warranty'}
                    </span>
                  </td>
                  <td>
                    <div className="contact-buttons">
                      <button className="call-btn" onClick={() => window.open(`tel:${item.shop_phone}`)}>
                        📞 Call
                      </button>
                      <button className="whatsapp-btn" onClick={() => window.open(`https://wa.me/${item.shop_whatsapp?.replace('+', '')}`)}>
                        💬 WhatsApp
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="rating">
                      {'⭐'.repeat(Math.round(item.shop_rating || 0))}
                      <small>({item.shop_review_count || 0})</small>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="comparison-insights">
          <h3>💡 Shopping Insights</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <h4>💰 Save Money</h4>
              <p>You can save ETB {(highestPrice - lowestPrice).toLocaleString()} by choosing the lowest price option</p>
            </div>
            <div className="insight-card">
              <h4>🏪 Shop Options</h4>
              <p>{comparisonData.length} shops in {ethiopianCities.find(c => c.id === selectedCity)?.name} have this product</p>
            </div>
            <div className="insight-card">
              <h4>📦 Stock Availability</h4>
              <p>{comparisonData.filter(item => item.stock_quantity > 0).length} shops have it in stock</p>
            </div>
            <div className="insight-card">
              <h4>⭐ Verified Shops</h4>
              <p>{comparisonData.filter(item => item.is_verified).length} shops are verified</p>
            </div>
          </div>
        </div>

        <div className="comparison-actions">
          <button onClick={() => setShowComparison(false)} className="back-btn">
            ← Compare Another Product
          </button>
          <button className="export-btn">
            📊 Export Comparison
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="price-comparison">
      <div className="comparison-header">
        <h1>📊 Electronics Price Comparison</h1>
        <p>Compare prices across different shops in your city to find the best deal</p>
      </div>

      {!showComparison ? renderProductSelector() : renderComparison()}
    </div>
  );
};

export default PriceComparison;
