import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Wishlist.css';
import API from '../api';

const Wishlist = ({ user }) => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      navigate('/auth');
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await API.get('/wishlist');
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await API.delete(`/wishlist/${productId}`);
      setWishlist(wishlist.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const toggleItemSelection = (productId) => {
    setSelectedItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const compareSelected = () => {
    if (selectedItems.length < 2) {
      alert('Please select at least 2 products to compare');
      return;
    }
    setShowComparison(true);
  };

  const renderWishlist = () => (
    <div className="wishlist-content">
      <div className="wishlist-header">
        <h2>❤️ My Wishlist ({wishlist.length})</h2>
        <div className="wishlist-actions">
          {selectedItems.length > 0 && (
            <button onClick={compareSelected} className="compare-btn">
              📊 Compare Selected ({selectedItems.length})
            </button>
          )}
          <button 
            onClick={() => setSelectedItems(wishlist.map(item => item.id))}
            className="select-all-btn"
          >
            ☑️ Select All
          </button>
          <button 
            onClick={() => setSelectedItems([])}
            className="clear-selection-btn"
          >
            ❌ Clear Selection
          </button>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-icon">💝</div>
          <h3>Your wishlist is empty</h3>
          <p>Save products you're interested in to compare them later</p>
          <button onClick={() => navigate('/shop')} className="browse-btn">
            🛍️ Browse Products
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(item => (
            <div key={item.id} className="wishlist-item">
              <div className="item-checkbox">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleItemSelection(item.id)}
                />
              </div>
              
              <div className="item-image">
                <img 
                  src={item.images?.[0] || '/placeholder-product.jpg'} 
                  alt={item.name}
                />
                <span className="item-category">{item.category}</span>
              </div>
              
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-brand">{item.brand} • {item.model}</p>
                
                <div className="item-specs">
                  <span>💾 {item.ram || 'N/A'}</span>
                  <span>📱 {item.storage || 'N/A'}</span>
                  <span>🔋 {item.battery || 'N/A'}</span>
                </div>
                
                <div className="item-price">
                  <span className="current-price">ETB {item.price?.toLocaleString()}</span>
                  {item.original_price && item.original_price > item.price && (
                    <span className="discount-badge">
                      {Math.round((1 - item.price / item.original_price) * 100)}% OFF
                    </span>
                  )}
                </div>
                
                <div className="item-stock">
                  <span className={`stock-status ${item.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {item.stock_quantity > 0 ? 
                      `✓ ${item.stock_quantity} Available` : 
                      '✗ Out of Stock'
                    }
                  </span>
                </div>
                
                <div className="item-shop">
                  <span className="shop-name">{item.shop_name}</span>
                  <span className="shop-location">📍 {item.shop_city}</span>
                </div>
              </div>
              
              <div className="item-actions">
                <button className="view-btn" onClick={() => navigate(`/product/${item.id}`)}>
                  👁️ View
                </button>
                <button className="contact-btn">
                  📞 Contact
                </button>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderComparison = () => {
    const selectedProducts = wishlist.filter(item => selectedItems.includes(item.id));
    
    return (
      <div className="wishlist-comparison">
        <div className="comparison-header">
          <h3>📊 Compare Selected Products ({selectedProducts.length})</h3>
          <button onClick={() => setShowComparison(false)} className="back-btn">
            ← Back to Wishlist
          </button>
        </div>
        
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                {selectedProducts.map(product => (
                  <th key={product.id}>
                    {product.name}
                    <br />
                    <small>{product.shop_name}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Price</strong></td>
                {selectedProducts.map(product => (
                  <td key={product.id}>
                    <span className="price">ETB {product.price?.toLocaleString()}</span>
                    {product.original_price && product.original_price > product.price && (
                      <div className="discount">
                        {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                      </div>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td><strong>Brand</strong></td>
                {selectedProducts.map(product => (
                  <td key={product.id}>{product.brand}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Model</strong></td>
                {selectedProducts.map(product => (
                  <td key={product.id}>{product.model}</td>
                ))}
              </tr>
              <tr>
                <td><strong>RAM</strong></td>
                {selectedProducts.map(product => (
                  <td key={product.id}>{product.ram || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Storage</strong></td>
                {selectedProducts.map(product => (
                  <td key={product.id}>{product.storage || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Battery</strong></td>
                {selectedProducts.map(product => (
                  <td key={product.id}>{product.battery || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Camera</strong></td>
                {selectedProducts.map(product => (
                  <td key={product.id}>{product.camera || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Screen</strong></td>
                {selectedProducts.map(product => (
                  <td key={product.id}>{product.screen_size || 'N/A'}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Condition</strong></td>
                {selectedProducts.map(product => (
                  <td key={product.id}>
                    <span className={`condition ${product.condition}`}>
                      {product.condition}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td><strong>Stock</strong></td>
                {selectedProducts.map(product => (
                  <td key={product.id}>
                    <span className={`stock ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {product.stock_quantity > 0 ? 
                        `${product.stock_quantity} Available` : 
                        'Out of Stock'
                      }
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td><strong>Shop</strong></td>
                {selectedProducts.map(product => (
                  <td key={product.id}>
                    <div className="shop-info">
                      <strong>{product.shop_name}</strong>
                      <br />
                      <small>📍 {product.shop_city}</small>
                      <br />
                      {product.shop_verified && (
                        <span className="verified-badge">✓ Verified</span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td><strong>Contact</strong></td>
                {selectedProducts.map(product => (
                  <td key={product.id}>
                    <div className="contact-buttons">
                      <button className="call-btn">
                        📞 Call
                      </button>
                      <button className="whatsapp-btn">
                        💬 WhatsApp
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="comparison-actions">
          <button onClick={() => setShowComparison(false)} className="back-btn">
            ← Back to Wishlist
          </button>
          <button className="export-btn">
            📊 Export Comparison
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="wishlist">
        <div className="loading">
          <h2>🔄 Loading your wishlist...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist">
      <div className="wishlist-header-main">
        <h1>❤️ My Wishlist</h1>
        <p>Save your favorite products and compare them to find the best deal</p>
      </div>

      {!showComparison ? renderWishlist() : renderComparison()}
    </div>
  );
};

export default Wishlist;
