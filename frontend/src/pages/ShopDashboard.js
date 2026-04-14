import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ShopDashboard.css';
import API from '../api';

const ShopDashboard = ({ user }) => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (user) {
      fetchShopData();
    }
  }, [user, shopId]);

  const fetchShopData = async () => {
    try {
      setLoading(true);
      const [shopRes, productsRes, analyticsRes, messagesRes] = await Promise.all([
        API.get(`/shops/${shopId || user.shop_id}`),
        API.get(`/shops/${shopId || user.shop_id}/products`),
        API.get(`/shops/${shopId || user.shop_id}/analytics`),
        API.get(`/shops/${shopId || user.shop_id}/messages`)
      ]);
      
      setShop(shopRes.data);
      setProducts(productsRes.data);
      setAnalytics(analyticsRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      console.error('Error fetching shop data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      const formData = new FormData();
      
      // Add all product fields
      Object.keys(productData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, productData[key]);
        }
      });
      
      // Add images
      if (productData.images) {
        productData.images.forEach(image => {
          formData.append('images', image);
        });
      }
      
      await API.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setShowAddProduct(false);
      fetchShopData();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async (productData) => {
    try {
      await API.put(`/products/${editingProduct.id}`, productData);
      setEditingProduct(null);
      fetchShopData();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/products/${productId}`);
        fetchShopData();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      await API.patch(`/products/${productId}/status`, {
        is_available: !currentStatus
      });
      fetchShopData();
    } catch (error) {
      console.error('Error toggling product status:', error);
    }
  };

  if (loading) {
    return (
      <div className="shop-dashboard-loading">
        <div className="spinner"></div>
        <p>Loading shop dashboard...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="shop-not-found">
        <h2>Shop Not Found</h2>
        <p>You don't have access to this shop or it doesn't exist.</p>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="shop-dashboard">
      {/* Shop Header with Logo, Banner and Marquee */}
      <div className="shop-header">
        <div className="shop-logo-section">
          {shop?.shopLogo ? (
            <img 
              src={shop.shopLogo} 
              alt={shop.electronicsHouseName}
              className="shop-logo"
            />
          ) : (
            <div className="shop-logo-placeholder">
              🏪
            </div>
          )}
          <div className="shop-info">
            <h2 className="shop-name">{shop?.electronicsHouseName || 'Electronics Shop'}</h2>
            <p className="shop-location">📍 {shop?.city || 'Location'}</p>
            <p className="shop-contact">📞 {shop?.phoneNumbers?.[0]?.number || 'Contact'}</p>
          </div>
        </div>
        
        {shop?.shopPhoto && (
          <div className="shop-banner">
            <img 
              src={shop.shopPhoto} 
              alt="Shop Banner"
              className="banner-image"
            />
          </div>
        )}
      </div>

      {/* Marquee Animation */}
      <div className="shop-marquee">
        <div className="marquee-content">
          <span className="marquee-text">
            🎉 Welcome to {shop?.electronicsHouseName || 'Electronics Shop'} - 
            📱 Quality Electronics - 
            💻 Laptops & Computers - 
            🎧 Accessories - 
            🏪 Best Prices in {shop?.city || 'Ethiopia'} - 
            ⭐ Customer Satisfaction Guaranteed - 
            🚀 Fast Delivery Available - 
            📞 Call Now: {shop?.phoneNumbers?.[0]?.number || 'Contact Us'}
          </span>
        </div>
      </div>

      <div className="dashboard-header">
        <div className="shop-info">
          <img src={shop.logo || '/placeholder-shop.png'} alt={shop.name} className="shop-logo" />
          <div className="shop-details">
            <h1>{shop.name}</h1>
            <p className="shop-location">{shop.city_name}</p>
            <div className="shop-stats">
              <span className="rating">⭐ {shop.rating || '0.0'}</span>
              <span className="review-count">({shop.total_reviews || 0} reviews)</span>
              {shop.is_verified && (
                <span className="verified-badge">✅ Verified</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="quick-actions">
          <button 
            className="add-product-btn"
            onClick={() => setShowAddProduct(true)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Product
          </button>
        </div>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="analytics-overview">
          <div className="stat-card">
            <h3>Total Views</h3>
            <span className="stat-value">{analytics.total_views || 0}</span>
            <span className="stat-change">+12% this month</span>
          </div>
          <div className="stat-card">
            <h3>Products</h3>
            <span className="stat-value">{products.length}</span>
            <span className="stat-change">{products.filter(p => p.is_available).length} active</span>
          </div>
          <div className="stat-card">
            <h3>Messages</h3>
            <span className="stat-value">{messages.filter(m => !m.is_read).length}</span>
            <span className="stat-change">Unread</span>
          </div>
          <div className="stat-card">
            <h3>Inquiries</h3>
            <span className="stat-value">{analytics.total_inquiries || 0}</span>
            <span className="stat-change">+8% this month</span>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products ({products.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          Messages ({messages.filter(m => !m.is_read).length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'products' && (
          <div className="products-management">
            <div className="products-header">
              <h2>Product Management</h2>
              <div className="filter-controls">
                <select>
                  <option>All Products</option>
                  <option>Available Only</option>
                  <option>Out of Stock</option>
                  <option>Featured</option>
                </select>
              </div>
            </div>
            
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img 
                      src={product.images?.[0] || product.image || '/placeholder-product.png'} 
                      alt={product.name}
                      onError={(e) => {
                        console.log('Product image failed to load:', product.name);
                        console.log('Available images:', {
                          'images[0]': product.images?.[0],
                          'image': product.image,
                          'frontImage': product.frontImage,
                          'backImage': product.backImage
                        });
                        
                        // Try fallback options
                        if (e.target.src !== product.frontImage && product.frontImage) {
                          e.target.src = product.frontImage;
                        } else if (e.target.src !== product.backImage && product.backImage) {
                          e.target.src = product.backImage;
                        } else {
                          e.target.src = '/placeholder-product.png';
                        }
                      }}
                      onLoad={() => {
                        console.log('✅ Product image loaded successfully:', product.name);
                      }}
                    />
                    <div className={`status-badge ${product.is_available ? 'available' : 'unavailable'}`}>
                      {product.is_available ? 'Available' : 'Out of Stock'}
                    </div>
                  </div>
                  
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-brand">{product.brand}</p>
                    <p className="product-price">{product.price.toLocaleString()} ETB</p>
                    <p className="product-stock">{product.stock_quantity} in stock</p>
                  </div>
                  
                  <div className="product-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => setEditingProduct(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="status-btn"
                      onClick={() => toggleProductStatus(product.id, product.is_available)}
                    >
                      {product.is_available ? 'Hide' : 'Show'}
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="messages-management">
            <h2>Customer Messages</h2>
            <div className="messages-list">
              {messages.length === 0 ? (
                <p>No messages yet.</p>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`message-item ${!message.is_read ? 'unread' : ''}`}>
                    <div className="message-header">
                      <span className="sender">{message.sender_username}</span>
                      <span className="date">
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {message.product_name && (
                      <p className="product-reference">Re: {message.product_name}</p>
                    )}
                    <p className="message-content">{message.message}</p>
                    <div className="message-actions">
                      <button className="reply-btn">Reply</button>
                      <button className="mark-read-btn">Mark as Read</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-detail">
            <h2>Shop Analytics</h2>
            {analytics ? (
              <div className="analytics-content">
                <div className="chart-container">
                  <h3>Product Views (Last 30 Days)</h3>
                  <div className="chart-placeholder">
                    Chart implementation would go here
                  </div>
                </div>
                
                <div className="top-products">
                  <h3>Most Viewed Products</h3>
                  {analytics.top_products?.map((product, index) => (
                    <div key={product.id} className="top-product-item">
                      <span className="rank">#{index + 1}</span>
                      <span className="name">{product.name}</span>
                      <span className="views">{product.views} views</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No analytics data available.</p>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="shop-settings">
            <h2>Shop Settings</h2>
            <div className="settings-form">
              <div className="form-group">
                <label>Shop Name</label>
                <input type="text" defaultValue={shop.name} />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea defaultValue={shop.description} rows={4} />
              </div>
              
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" defaultValue={shop.phone} />
              </div>
              
              <div className="form-group">
                <label>WhatsApp</label>
                <input type="tel" defaultValue={shop.whatsapp} />
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <input type="text" defaultValue={shop.address} />
              </div>
              
              <div className="form-group">
                <label>Operating Hours</label>
                <input type="text" defaultValue={shop.operating_hours} />
              </div>
              
              <button className="save-settings-btn">Save Changes</button>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <ProductModal
          onClose={() => setShowAddProduct(false)}
          onSave={handleAddProduct}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <ProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleEditProduct}
        />
      )}
    </div>
  );
};

const ProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    brand: product?.brand || '',
    model: product?.model || '',
    category: product?.category || 'Phones',
    price: product?.price || '',
    description: product?.description || '',
    ram: product?.ram || '',
    storage: product?.storage || '',
    condition: product?.condition || 'new',
    stock_quantity: product?.stock_quantity || 1,
    warranty_period: product?.warranty_period || '',
    images: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      images: Array.from(e.target.files)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content product-modal">
        <div className="modal-header">
          <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Brand *</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="Phones">Phones</option>
                <option value="Tablets">Tablets</option>
                <option value="Laptops">Laptops</option>
                <option value="Accessories">Accessories</option>
                <option value="Smart Watches">Smart Watches</option>
                <option value="Cameras">Cameras</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Price (ETB) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            
            <div className="form-group">
              <label>RAM</label>
              <select
                name="ram"
                value={formData.ram}
                onChange={handleInputChange}
              >
                <option value="">Select RAM</option>
                <option value="2GB">2GB</option>
                <option value="3GB">3GB</option>
                <option value="4GB">4GB</option>
                <option value="6GB">6GB</option>
                <option value="8GB">8GB</option>
                <option value="12GB">12GB</option>
                <option value="16GB">16GB</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Storage</label>
              <select
                name="storage"
                value={formData.storage}
                onChange={handleInputChange}
              >
                <option value="">Select Storage</option>
                <option value="32GB">32GB</option>
                <option value="64GB">64GB</option>
                <option value="128GB">128GB</option>
                <option value="256GB">256GB</option>
                <option value="512GB">512GB</option>
                <option value="1TB">1TB</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
              >
                <option value="new">Brand New</option>
                <option value="like_new">Like New</option>
                <option value="used">Used</option>
                <option value="refurbished">Refurbished</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Warranty Period</label>
              <input
                type="text"
                name="warranty_period"
                value={formData.warranty_period}
                onChange={handleInputChange}
                placeholder="e.g., 1 year"
              />
            </div>
          </div>
          
          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe your product..."
            />
          </div>
          
          <div className="form-group full-width">
            <label>Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
            <small>Upload up to 5 images. First image will be the main product image.</small>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopDashboard;
