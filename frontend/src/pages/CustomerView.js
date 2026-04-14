import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerView.css';
import API from '../api';

const CustomerView = ({ user }) => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('');
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    ram: '',
    storage: ''
  });
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const ethiopianCities = [
    { id: 'dilla', name: 'Dilla', name_am: 'ዲላ', region: 'SNNPR' },
    { id: 'hawassa', name: 'Hawassa', name_am: 'ሀዋሳ', region: 'SNNPR' },
    { id: 'addis_ababa', name: 'Addis Ababa', name_am: 'አዲስ አበባ', region: 'Addis Ababa' },
    { id: 'hossana', name: 'Hossana', name_am: 'ሆሳዕና', region: 'SNNPR' },
    { id: 'arbaminch', name: 'Arba Minch', name_am: 'አርባ ምንጭ', region: 'SNNPR' },
    { id: 'jimma', name: 'Jimma', name_am: 'ጅማ', region: 'Oromia' },
    { id: 'bahirdar', name: 'Bahirdar', name_am: 'ባህርዳር', region: 'Amhara' },
    { id: 'mekelle', name: 'Mekelle', name_am: 'መቀሌ', region: 'Tigray' }
  ];

  const categories = [
    'Phones', 'Tablets', 'Laptops', 'Accessories', 
    'Smart Watches', 'Cameras', 'Gaming', 'Audio'
  ];

  const brands = [
    'Samsung', 'Apple', 'Huawei', 'Xiaomi', 'Oppo', 
    'Vivo', 'Tecno', 'Infinix', 'Nokia', 'Sony'
  ];

  useEffect(() => {
    if (selectedCity) {
      fetchProducts();
      fetchShops();
    }
  }, [selectedCity, searchTerm, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        city: selectedCity,
        q: searchTerm,
        ...filters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await API.get('/products/search', { params });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShops = async () => {
    try {
      const response = await API.get('/shops', { 
        params: { city: selectedCity } 
      });
      setShops(response.data);
    } catch (error) {
      console.error('Error fetching shops:', error);
    }
  };

  const handleCitySelect = (cityId) => {
    setSelectedCity(cityId);
    setSearchTerm('');
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      ram: '',
      storage: ''
    });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleContactShop = (shop) => {
    setSelectedProduct({ ...selectedProduct, shop });
    setShowContactModal(true);
  };

  const renderCitySelector = () => (
    <div className="city-selector">
      <h3>📍 Select Your City</h3>
      <p>Find electronics shops and products in your area</p>
      <div className="city-grid">
        {ethiopianCities.map(city => (
          <button
            key={city.id}
            onClick={() => handleCitySelect(city.id)}
            className={`city-card ${selectedCity === city.id ? 'selected' : ''}`}
          >
            <div className="city-info">
              <h4>{city.name}</h4>
              <p>{city.name_am}</p>
              <small>{city.region}</small>
            </div>
            <div className="city-icon">🏙️</div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderSearchAndFilters = () => (
    <div className="search-filters">
      <div className="search-bar">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Search for products... (e.g., Samsung A057F 4GB RAM)"
          className="search-input"
        />
      </div>

      <div className="filters-grid">
        <div className="filter-group">
          <label>Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Brand</label>
          <select
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>RAM</label>
          <select
            value={filters.ram}
            onChange={(e) => handleFilterChange('ram', e.target.value)}
          >
            <option value="">Any RAM</option>
            <option value="1GB">1GB</option>
            <option value="2GB">2GB</option>
            <option value="3GB">3GB</option>
            <option value="4GB">4GB</option>
            <option value="6GB">6GB</option>
            <option value="8GB">8GB</option>
            <option value="12GB">12GB</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Storage</label>
          <select
            value={filters.storage}
            onChange={(e) => handleFilterChange('storage', e.target.value)}
          >
            <option value="">Any Storage</option>
            <option value="16GB">16GB</option>
            <option value="32GB">32GB</option>
            <option value="64GB">64GB</option>
            <option value="128GB">128GB</option>
            <option value="256GB">256GB</option>
            <option value="512GB">512GB</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Min Price (ETB)</label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            placeholder="5000"
          />
        </div>

        <div className="filter-group">
          <label>Max Price (ETB)</label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            placeholder="50000"
          />
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="products-section">
      <div className="section-header">
        <h3>📱 Available Products in {ethiopianCities.find(c => c.id === selectedCity)?.name}</h3>
        <p>{products.length} products found</p>
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="no-products">
          <div className="no-products-icon">📦</div>
          <h4>No products found</h4>
          <p>Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card" onClick={() => handleProductClick(product)}>
              <div className="product-image">
                <img 
                  src={product.images?.[0] || '/placeholder-product.jpg'} 
                  alt={product.name}
                />
                <span className="product-category">{product.category}</span>
                {product.original_price && product.original_price > product.price && (
                  <span className="discount-badge">
                    {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                  </span>
                )}
              </div>
              
              <div className="product-info">
                <h4>{product.name}</h4>
                <p className="product-brand">{product.brand} • {product.model}</p>
                
                <div className="product-specs">
                  <span className="spec">💾 {product.ram}</span>
                  <span className="spec">📱 {product.storage}</span>
                  <span className="spec">🔋 {product.battery}</span>
                </div>
                
                <div className="product-price">
                  <span className="current-price">ETB {product.price.toLocaleString()}</span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="original-price">ETB {product.original_price.toLocaleString()}</span>
                  )}
                </div>
                
                <div className="product-stock">
                  <span className={`stock-status ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stock_quantity > 0 ? 
                      `✓ ${product.stock_quantity} available` : 
                      '✗ Out of stock'
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
      )}
    </div>
  );

  const renderProductDetail = () => {
    if (!selectedProduct) return null;

    const specs = selectedProduct.specifications ? 
      JSON.parse(selectedProduct.specifications) : {};

    return (
      <div className="product-detail-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{selectedProduct.name}</h2>
            <button onClick={() => setSelectedProduct(null)} className="close-btn">×</button>
          </div>
          
          <div className="product-detail-content">
            <div className="product-images">
              {selectedProduct.images && selectedProduct.images.length > 0 ? (
                <div className="image-gallery">
                  {JSON.parse(selectedProduct.images).map((image, index) => (
                    <img key={index} src={image} alt={`${selectedProduct.name} ${index + 1}`} />
                  ))}
                </div>
              ) : (
                <div className="no-images">No images available</div>
              )}
            </div>
            
            <div className="product-details">
              <div className="product-header">
                <h3>{selectedProduct.name}</h3>
                <p className="brand-model">{selectedProduct.brand} • {selectedProduct.model}</p>
              </div>
              
              <div className="specifications-table">
                <h4>📋 Specifications</h4>
                <table>
                  <tbody>
                    <tr>
                      <td>Brand</td>
                      <td>{selectedProduct.brand}</td>
                    </tr>
                    <tr>
                      <td>Model</td>
                      <td>{selectedProduct.model}</td>
                    </tr>
                    <tr>
                      <td>RAM</td>
                      <td>{specs.ram || selectedProduct.ram}</td>
                    </tr>
                    <tr>
                      <td>Storage</td>
                      <td>{specs.storage || selectedProduct.storage}</td>
                    </tr>
                    <tr>
                      <td>Battery</td>
                      <td>{specs.battery || selectedProduct.battery}</td>
                    </tr>
                    <tr>
                      <td>Camera</td>
                      <td>{specs.camera || selectedProduct.camera}</td>
                    </tr>
                    <tr>
                      <td>Screen</td>
                      <td>{specs.screen_size || selectedProduct.screen_size}</td>
                    </tr>
                    <tr>
                      <td>Color</td>
                      <td>{selectedProduct.color}</td>
                    </tr>
                    <tr>
                      <td>Condition</td>
                      <td>{selectedProduct.condition}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="pricing-section">
                <div className="price-info">
                  <span className="current-price">ETB {selectedProduct.price.toLocaleString()}</span>
                  {selectedProduct.original_price && selectedProduct.original_price > selectedProduct.price && (
                    <>
                      <span className="original-price">ETB {selectedProduct.original_price.toLocaleString()}</span>
                      <span className="discount-badge">
                        {Math.round((1 - selectedProduct.price / selectedProduct.original_price) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
                <div className="stock-info">
                  <span className={`stock-status ${selectedProduct.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {selectedProduct.stock_quantity > 0 ? 
                      `✓ ${selectedProduct.stock_quantity} Available` : 
                      '✗ Out of Stock'
                    }
                  </span>
                </div>
              </div>
              
              <div className="shop-section">
                <h4>🏪 Shop Information</h4>
                <div className="shop-card">
                  <h5>{selectedProduct.shop_name}</h5>
                  <p>📍 {selectedProduct.address}, {selectedProduct.city}</p>
                  <p>📱 {selectedProduct.shop_phone}</p>
                  <p>🕒 {selectedProduct.shop_hours || '8:00 AM - 8:00 PM'}</p>
                </div>
              </div>
              
              <div className="contact-section">
                <h4>📞 Contact Shop</h4>
                <div className="contact-buttons">
                  <button className="call-btn">
                    📞 Call Shop
                  </button>
                  <button className="whatsapp-btn">
                    💬 WhatsApp
                  </button>
                  <button className="telegram-btn">
                    ✈️ Telegram
                  </button>
                </div>
              </div>
              
              {selectedProduct.description && (
                <div className="description-section">
                  <h4>📝 Description</h4>
                  <p>{selectedProduct.description}</p>
                </div>
              )}
              
              {selectedProduct.warranty_info && (
                <div className="warranty-section">
                  <h4>🔒 Warranty</h4>
                  <p>{selectedProduct.warranty_info}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="customer-view">
      <div className="header">
        <h1>🇪🇹 Ethiopia Electronics Marketplace</h1>
        <p>Find electronics shops across Ethiopia before you travel</p>
      </div>

      {!selectedCity ? (
        renderCitySelector()
      ) : (
        <div className="marketplace-content">
          <div className="city-header">
            <h2>📍 Shopping in {ethiopianCities.find(c => c.id === selectedCity)?.name}</h2>
            <button onClick={() => setSelectedCity('')} className="change-city-btn">
              🔄 Change City
            </button>
          </div>

          {renderSearchAndFilters()}
          {renderProducts()}
        </div>
      )}

      {selectedProduct && renderProductDetail()}
    </div>
  );
};

export default CustomerView;
