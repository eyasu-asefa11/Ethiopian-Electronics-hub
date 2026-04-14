import React, { useState, useEffect } from 'react';
import './ProductCategories.css';
import API from '../api';

const ProductCategories = ({ selectedCity, onCategorySelect, onProductClick }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryStats, setCategoryStats] = useState({});

  const defaultCategories = [
    { id: 'phones', name: 'Phones', icon: '📱', description: 'Smartphones and mobile phones', color: '#3b82f6' },
    { id: 'tablets', name: 'Tablets', icon: '📱', description: 'iPad, Android tablets', color: '#10b981' },
    { id: 'laptops', name: 'Laptops', icon: '💻', description: 'Notebooks and computers', color: '#f59e0b' },
    { id: 'accessories', name: 'Accessories', icon: '🎧', description: 'Phone accessories, cases, chargers', color: '#8b5cf6' },
    { id: 'smart_watches', name: 'Smart Watches', icon: '⌚', description: 'Wearable technology', color: '#ef4444' },
    { id: 'cameras', name: 'Cameras', icon: '📷', description: 'Digital cameras and photography', color: '#06b6d4' },
    { id: 'gaming', name: 'Gaming', icon: '🎮', description: 'Gaming consoles and accessories', color: '#84cc16' },
    { id: 'audio', name: 'Audio', icon: '🔊', description: 'Headphones, speakers, audio equipment', color: '#f97316' }
  ];

  useEffect(() => {
    fetchCategories();
  }, [selectedCity]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      if (selectedCity) {
        // Fetch categories with stats for selected city
        const response = await API.get(`/cities/${selectedCity}/categories`);
        const categoriesWithStats = defaultCategories.map(cat => {
          const stats = response.data.find(s => s.category.toLowerCase() === cat.name.toLowerCase()) || {
            product_count: 0,
            shop_count: 0,
            lowest_price: 0,
            highest_price: 0
          };
          return { ...cat, ...stats };
        });
        setCategories(categoriesWithStats);
        setCategoryStats(response.data.reduce((acc, item) => {
          acc[item.category.toLowerCase()] = item;
          return acc;
        }, {}));
      } else {
        // Fetch all categories with nationwide stats
        const response = await API.get('/categories/stats');
        const categoriesWithStats = defaultCategories.map(cat => {
          const stats = response.data.find(s => s.category.toLowerCase() === cat.name.toLowerCase()) || {
            product_count: 0,
            shop_count: 0,
            lowest_price: 0,
            highest_price: 0
          };
          return { ...cat, ...stats };
        });
        setCategories(categoriesWithStats);
        setCategoryStats(response.data.reduce((acc, item) => {
          acc[item.category.toLowerCase()] = item;
          return acc;
        }, {}));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Use default categories without stats
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    if (onCategorySelect) {
      onCategorySelect(category);
    }

    // Fetch products for this category
    try {
      setLoading(true);
      const response = await API.get('/products/search', {
        params: {
          city: selectedCity,
          category: category.name,
          limit: 20
        }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching category products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const renderCategories = () => (
    <div className="categories-container">
      <div className="categories-header">
        <h2>📱 Product Categories</h2>
        <p>Browse electronics by category {selectedCity ? `in ${selectedCity}` : 'nationwide'}</p>
      </div>

      {loading ? (
        <div className="categories-loading">
          <div className="loading-spinner">🔄</div>
          <p>Loading categories...</p>
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map(category => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={`category-card ${selectedCategory?.id === category.id ? 'selected' : ''}`}
              style={{ borderLeftColor: category.color }}
            >
              <div className="category-header">
                <div className="category-icon" style={{ backgroundColor: category.color }}>
                  {category.icon}
                </div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
              </div>
              
              <div className="category-stats">
                <div className="stat-item">
                  <span className="stat-number">{category.product_count || 0}</span>
                  <span className="stat-label">Products</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{category.shop_count || 0}</span>
                  <span className="stat-label">Shops</span>
                </div>
                {category.lowest_price > 0 && (
                  <div className="stat-item">
                    <span className="stat-number">ETB {category.lowest_price.toLocaleString()}</span>
                    <span className="stat-label">From</span>
                  </div>
                )}
              </div>
              
              {category.product_count > 0 && (
                <div className="category-footer">
                  <span className="product-count">
                    {category.product_count} products available
                  </span>
                  <span className="arrow">→</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCategoryProducts = () => {
    if (!selectedCategory) return null;

    return (
      <div className="category-products">
        <div className="category-products-header">
          <div className="header-info">
            <h2>{selectedCategory.icon} {selectedCategory.name}</h2>
            <p>
              {products.length} products found {selectedCity ? `in ${selectedCity}` : 'nationwide'}
            </p>
          </div>
          <button onClick={() => setSelectedCategory(null)} className="back-btn">
            ← Back to Categories
          </button>
        </div>

        {products.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">📦</div>
            <h3>No products in {selectedCategory.name}</h3>
            <p>Try selecting a different category or city</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card" onClick={() => onProductClick?.(product)}>
                <div className="product-image">
                  <img 
                    src={product.images?.[0] || product.image || '/placeholder-product.jpg'} 
                    alt={product.name}
                    onError={(e) => {
                      console.log('Image failed to load:', product.images?.[0] || product.image);
                      // Try fallback options
                      if (e.target.src.includes('picsum')) {
                        e.target.src = '/placeholder-product.jpg';
                      } else if (product.frontImage) {
                        e.target.src = product.frontImage;
                      } else if (product.backImage) {
                        e.target.src = product.backImage;
                      } else {
                        e.target.src = '/placeholder-product.jpg';
                      }
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', product.name);
                    }}
                  />
                  <span className="product-category">{product.category}</span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="discount-badge">
                      {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                    </span>
                  )}
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
                    <span className="current-price">ETB {product.price.toLocaleString()}</span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="original-price">ETB {product.original_price.toLocaleString()}</span>
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
                    <span className="shop-location">📍 {product.shop_city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="product-categories">
      {!selectedCategory ? renderCategories() : renderCategoryProducts()}
    </div>
  );
};

export default ProductCategories;
