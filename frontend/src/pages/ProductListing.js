import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductListing.css';
import API from '../api';

const ProductListing = ({ user, shopId }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  
  const [productData, setProductData] = useState({
    // Basic Information
    name: 'Samsung Galaxy A05',
    brand: 'Samsung',
    model: 'A057F',
    category: 'Phones',
    condition: 'New',
    color: 'Black',
    
    // Detailed Specifications
    ram: '4GB',
    storage: '64GB',
    battery: '5000mAh',
    camera: '50MP',
    screen_size: '6.5 inch',
    processor: 'MediaTek Helio G35',
    operating_system: 'Android 13',
    network: '4G LTE',
    sim_card: 'Dual SIM',
    
    // Pricing & Stock
    price: 14500,
    original_price: 16500,
    stock_quantity: 8,
    min_stock_alert: 2,
    
    // Additional Details
    description: 'Brand new Samsung Galaxy A05 with excellent features and warranty',
    warranty_info: '1 year manufacturer warranty',
    discount_info: 'Special offer - Limited time discount',
    features: [
      'Large 6.5-inch display',
      'Long-lasting 5000mAh battery',
      '50MP main camera',
      '4GB RAM for smooth performance',
      '64GB storage expandable to 1TB',
      'Dual SIM support',
      'Android 13 latest version'
    ],
    
    // Images
    images: [],
    
    // Shop Information
    shop_id: shopId,
    city: 'Dilla',
    region: 'SNNPR'
  });

  const categories = [
    'Phones', 'Tablets', 'Laptops', 'Accessories', 
    'Smart Watches', 'Cameras', 'Gaming', 'Audio'
  ];

  const brands = [
    'Samsung', 'Apple', 'Huawei', 'Xiaomi', 'Oppo', 
    'Vivo', 'Tecno', 'Infinix', 'Nokia', 'Sony', 'LG'
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair'];
  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gold', 'Silver', 'Pink'];

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setProductData({ ...productData, [name]: parseFloat(value) || 0 });
    } else {
      setProductData({ ...productData, [name]: value });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...productData.images, ...files];
    setProductData({ ...productData, images: newImages });
  };

  const removeImage = (index) => {
    const newImages = productData.images.filter((_, i) => i !== index);
    setProductData({ ...productData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      
      // Add all product data
      Object.keys(productData).forEach(key => {
        if (key === 'images') {
          // Add each image file
          productData.images.forEach((image, index) => {
            if (image instanceof File) {
              formData.append(`image_${index}`, image);
            }
          });
        } else if (key === 'features') {
          // Convert features array to JSON
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await API.post('/products/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Redirect to shop dashboard
      navigate('/shop-dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Product listing failed');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const calculateDiscount = () => {
    if (productData.original_price && productData.original_price > productData.price) {
      return Math.round((1 - productData.price / productData.original_price) * 100);
    }
    return 0;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-content">
            <h3>📱 Basic Product Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Samsung Galaxy A05"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Brand *</label>
                <select
                  name="brand"
                  value={productData.brand}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select brand</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Model *</label>
                <input
                  type="text"
                  name="model"
                  value={productData.model}
                  onChange={handleInputChange}
                  placeholder="e.g., A057F"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={productData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Condition *</label>
                <select
                  name="condition"
                  value={productData.condition}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select condition</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Color *</label>
                <select
                  name="color"
                  value={productData.color}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select color</option>
                  {colors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={productData.description}
                onChange={handleInputChange}
                placeholder="Describe your product in detail..."
                rows="4"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3>⚙️ Technical Specifications</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>RAM *</label>
                <select
                  name="ram"
                  value={productData.ram}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select RAM</option>
                  <option value="1GB">1GB</option>
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
                <label>Storage *</label>
                <select
                  name="storage"
                  value={productData.storage}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select storage</option>
                  <option value="16GB">16GB</option>
                  <option value="32GB">32GB</option>
                  <option value="64GB">64GB</option>
                  <option value="128GB">128GB</option>
                  <option value="256GB">256GB</option>
                  <option value="512GB">512GB</option>
                  <option value="1TB">1TB</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Battery *</label>
                <input
                  type="text"
                  name="battery"
                  value={productData.battery}
                  onChange={handleInputChange}
                  placeholder="e.g., 5000mAh"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Camera *</label>
                <input
                  type="text"
                  name="camera"
                  value={productData.camera}
                  onChange={handleInputChange}
                  placeholder="e.g., 50MP"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Screen Size *</label>
                <input
                  type="text"
                  name="screen_size"
                  value={productData.screen_size}
                  onChange={handleInputChange}
                  placeholder="e.g., 6.5 inch"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Processor</label>
                <input
                  type="text"
                  name="processor"
                  value={productData.processor}
                  onChange={handleInputChange}
                  placeholder="e.g., MediaTek Helio G35"
                />
              </div>
              
              <div className="form-group">
                <label>Operating System</label>
                <input
                  type="text"
                  name="operating_system"
                  value={productData.operating_system}
                  onChange={handleInputChange}
                  placeholder="e.g., Android 13"
                />
              </div>
              
              <div className="form-group">
                <label>Network</label>
                <select
                  name="network"
                  value={productData.network}
                  onChange={handleInputChange}
                >
                  <option value="4G LTE">4G LTE</option>
                  <option value="5G">5G</option>
                  <option value="3G">3G</option>
                  <option value="2G">2G</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>SIM Card</label>
                <select
                  name="sim_card"
                  value={productData.sim_card}
                  onChange={handleInputChange}
                >
                  <option value="Dual SIM">Dual SIM</option>
                  <option value="Single SIM">Single SIM</option>
                  <option value="eSIM">eSIM</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3>💰 Pricing & Stock</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Selling Price (ETB) *</label>
                <input
                  type="number"
                  name="price"
                  value={productData.price}
                  onChange={handleInputChange}
                  placeholder="14500"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Original Price (ETB)</label>
                <input
                  type="number"
                  name="original_price"
                  value={productData.original_price}
                  onChange={handleInputChange}
                  placeholder="16500"
                />
                {calculateDiscount() > 0 && (
                  <small className="discount-info">
                    🎉 You're offering {calculateDiscount()}% discount!
                  </small>
                )}
              </div>
              
              <div className="form-group">
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={productData.stock_quantity}
                  onChange={handleInputChange}
                  placeholder="8"
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Low Stock Alert</label>
                <input
                  type="number"
                  name="min_stock_alert"
                  value={productData.min_stock_alert}
                  onChange={handleInputChange}
                  placeholder="2"
                  min="1"
                />
                <small>Get notified when stock reaches this level</small>
              </div>
            </div>
            
            <div className="form-group">
              <label>Warranty Information</label>
              <input
                type="text"
                name="warranty_info"
                value={productData.warranty_info}
                onChange={handleInputChange}
                placeholder="e.g., 1 year manufacturer warranty"
              />
            </div>
            
            <div className="form-group">
              <label>Discount Information</label>
              <input
                type="text"
                name="discount_info"
                value={productData.discount_info}
                onChange={handleInputChange}
                placeholder="e.g., Special offer - Limited time discount"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h3>📸 Product Images</h3>
            <div className="image-upload-section">
              <div className="upload-area">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="image-upload"
                  className="image-input"
                />
                <label htmlFor="image-upload" className="upload-label">
                  <span className="upload-icon">📷</span>
                  <span className="upload-text">
                    Click to upload images or drag and drop
                  </span>
                  <span className="upload-hint">
                    Upload front, back, side, and accessory images
                  </span>
                </label>
              </div>
              
              {productData.images.length > 0 && (
                <div className="image-preview">
                  <h4>Uploaded Images</h4>
                  <div className="image-grid">
                    {productData.images.map((image, index) => (
                      <div key={index} className="image-item">
                        {image instanceof File ? (
                          <>
                            <img 
                              src={URL.createObjectURL(image)} 
                              alt={`Product ${index + 1}`}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="remove-image"
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <>
                            <img src={image} alt={`Product ${index + 1}`} />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="remove-image"
                            >
                              ×
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="preview-section">
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="preview-toggle"
              >
                {previewMode ? '📝 Edit Mode' : '👁️ Preview Product'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderPreview = () => {
    if (!previewMode) return null;
    
    return (
      <div className="product-preview">
        <h3>👁️ Product Preview</h3>
        <div className="preview-card">
          <div className="preview-header">
            <h2>{productData.name}</h2>
            <div className="preview-meta">
              <span className="brand">{productData.brand}</span>
              <span className="model">{productData.model}</span>
              <span className="category">{productData.category}</span>
            </div>
          </div>
          
          <div className="preview-images">
            {productData.images.length > 0 ? (
              <div className="image-grid">
                {productData.images.map((image, index) => (
                  <img 
                    key={index}
                    src={image instanceof File ? URL.createObjectURL(image) : image}
                    alt={`Preview ${index + 1}`}
                  />
                ))}
              </div>
            ) : (
              <div className="no-images">
                📷 No images uploaded yet
              </div>
            )}
          </div>
          
          <div className="preview-specs">
            <h4>Specifications</h4>
            <table>
              <tbody>
                <tr>
                  <td>RAM</td>
                  <td>{productData.ram}</td>
                </tr>
                <tr>
                  <td>Storage</td>
                  <td>{productData.storage}</td>
                </tr>
                <tr>
                  <td>Battery</td>
                  <td>{productData.battery}</td>
                </tr>
                <tr>
                  <td>Camera</td>
                  <td>{productData.camera}</td>
                </tr>
                <tr>
                  <td>Screen</td>
                  <td>{productData.screen_size}</td>
                </tr>
                <tr>
                  <td>Color</td>
                  <td>{productData.color}</td>
                </tr>
                <tr>
                  <td>Condition</td>
                  <td>{productData.condition}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="preview-pricing">
            <div className="price-info">
              <span className="current-price">ETB {productData.price.toLocaleString()}</span>
              {productData.original_price && productData.original_price > productData.price && (
                <>
                  <span className="original-price">ETB {productData.original_price.toLocaleString()}</span>
                  <span className="discount-badge">{calculateDiscount()}% OFF</span>
                </>
              )}
            </div>
            <div className="stock-info">
              <span className={`stock-status ${productData.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {productData.stock_quantity > 0 ? 
                  `✓ ${productData.stock_quantity} Available` : 
                  '✗ Out of Stock'
                }
              </span>
            </div>
          </div>
          
          <div className="preview-description">
            <h4>Description</h4>
            <p>{productData.description}</p>
          </div>
          
          {productData.warranty_info && (
            <div className="preview-warranty">
              <h4>Warranty</h4>
              <p>{productData.warranty_info}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="product-listing">
      <div className="listing-header">
        <h2>📱 List Your Product</h2>
        <p>Show customers exactly what you have in stock - like Abel from Hawassa can see before traveling to Dilla!</p>
      </div>

      <div className="step-indicator">
        <div className={`step ${step >= 1 ? 'active' : 'completed'}`}>1</div>
        <div className={`step ${step >= 2 ? 'active' : 'completed'}`}>2</div>
        <div className={`step ${step >= 3 ? 'active' : 'completed'}`}>3</div>
        <div className={`step ${step >= 4 ? 'active' : 'completed'}`}>4</div>
      </div>

      <form onSubmit={handleSubmit} className="listing-form">
        {renderStep()}
        {renderPreview()}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-actions">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="btn-secondary">
              ← Previous
            </button>
          )}
          
          {step < 4 ? (
            <button type="button" onClick={nextStep} className="btn-primary">
              Next →
            </button>
          ) : (
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? '🔄 Publishing...' : '🚀 Publish Product'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProductListing;
