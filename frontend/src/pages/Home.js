import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CitySelector from '../components/CitySelector';
import AdvancedSearch from '../components/AdvancedSearch';
import ShopRegistrationTop from '../components/ShopRegistrationTop';
import RegisteredShops from '../components/RegisteredShops';
import './Home.css';
import './HomeAdditional.css';
import API from '../api';

const Home = ({ user }) => {
  const navigate = useNavigate();
  
  const [selectedCity, setSelectedCity] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showShopRegistration, setShowShopRegistration] = useState(false);
  const [showRegisteredShops, setShowRegisteredShops] = useState(false);
  const [cityMessage, setCityMessage] = useState('');

  const electronicsCategories = [
    { id: 'Phones', name: 'Phones', icon: '📱', count: 0 },
    { id: 'Tablets', name: 'Tablets', icon: '📱', count: 0 },
    { id: 'Laptops', name: 'Laptops', icon: '💻', count: 0 },
    { id: 'Accessories', name: 'Accessories', icon: '🎧', count: 0 },
    { id: 'Smart Watches', name: 'Smart Watches', icon: '⌚', count: 0 },
    { id: 'Cameras', name: 'Cameras', icon: '📷', count: 0 },
    { id: 'Gaming', name: 'Gaming', icon: '🎮', count: 0 },
    { id: 'Audio', name: 'Audio', icon: '🔊', count: 0 }
  ];

  useEffect(() => {
    fetchHomeData();
  }, [selectedCity]);

  useEffect(() => {
    if (selectedCity && selectedCity !== 'all') {
      setCityMessage(`🏙️ You selected ${selectedCity}. Showing shops and products in ${selectedCity}.`);
    } else if (selectedCity === 'all') {
      setCityMessage('🌍 Showing shops and products from all cities across Ethiopia.');
    } else {
      setCityMessage('');
    }
  }, [selectedCity]);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      
      // Get all products from localStorage
      const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
      const products = [];
      
      shops.forEach(shop => {
        if (shop.products && shop.products.length > 0) {
          shop.products.forEach(product => {
            products.push({
              ...product,
              shop_name: shop.electronicsHouseName || shop.shopName,
              city_name: shop.city || 'Unknown',
              shop_id: shop.id
            });
          });
        }
      });
      
      setAllProducts(products);
      
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchParams) => {
    navigate('/search', { state: searchParams });
  };

  const handleFilter = (filters) => {
    navigate('/search', { state: { filters } });
  };

  const handleCategoryClick = (category) => {
    navigate('/search', { 
      state: { 
        category: category.id,
        city: selectedCity?.id 
      } 
    });
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleClearSearch = () => {
    // Reset search by navigating to search page with empty state
    navigate('/search', { state: {} });
  };

  const handleAdminAccess = () => {
    // Set admin user in localStorage for testing
    const adminUser = {
      id: 'admin',
      name: 'Administrator',
      email: 'admin@dilla.com',
      role: 'admin'
    };
    localStorage.setItem('user', JSON.stringify(adminUser));
    navigate('/admin-dashboard');
  };

  const handleShopRegister = (shopData) => {
    console.log('Shop registration data:', shopData);
    
    // Store registration data in localStorage
    const existingShops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
    const newShop = {
      ...shopData,
      id: shopData.id || Date.now().toString(),
      isVerified: false,
      products: [],
      orders: [],
      messages: [],
      reviews: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    // Add to existing shops
    existingShops.push(newShop);
    localStorage.setItem('registeredShops', JSON.stringify(existingShops));
    
    // Store current shop for dashboard access
    localStorage.setItem('currentShop', JSON.stringify(newShop));
    
    // Update app state to show shopkeeper dashboard
    const shopkeeperUser = {
      id: newShop.id,
      name: newShop.ownerName,
      email: `${newShop.ownerName.toLowerCase().replace(/\s/g, '')}@shop.com`,
      phone: newShop.phoneNumber,
      role: 'shopkeeper',
      shop: newShop
    };
    
    localStorage.setItem('user', JSON.stringify(shopkeeperUser));
    
    // Show success message
    alert('🎉 Shop registration submitted successfully! Your shop has been registered and you can now access your dashboard.');
    setShowShopRegistration(false);
    
    // Navigate to shopkeeper dashboard
    window.location.href = '/shopkeeper-dashboard';
  };

  const handleOpenShopRegistration = () => {
    setShowShopRegistration(true);
  };

  const handleCloseShopRegistration = () => {
    setShowShopRegistration(false);
  };

  const handleViewRegisteredShops = () => {
    setShowRegisteredShops(true);
  };

  const handleCloseRegisteredShops = () => {
    setShowRegisteredShops(false);
  };

  if (loading) {
    return (
      <div className="home-loading">
        <div className="spinner"></div>
        <p>Loading amazing deals...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Top Dashboard Buttons */}
      <div className="top-dashboard-buttons">
        <button 
          className="top-register-btn"
          onClick={handleOpenShopRegistration}
        >
          🏪 <strong>Register Your Shop</strong>
          <br />
          <span className="btn-subtitle">Join 500+ electronics shops across Ethiopia</span>
        </button>
        <button 
          className="top-shops-btn"
          onClick={handleViewRegisteredShops}
        >
          📋 <strong>View Registered Shops</strong>
          <br />
          <span className="btn-subtitle">See all registered electronics shops</span>
        </button>
        <button 
          className="top-admin-btn"
          onClick={handleAdminAccess}
        >
          👑 <strong>Admin Access</strong>
          <br />
          <span className="btn-subtitle">Website management panel</span>
        </button>
      </div>

      {/* Shop Registration Modal */}
      {showShopRegistration && (
        <ShopRegistrationTop
          onRegister={handleShopRegister}
          onClose={handleCloseShopRegistration}
        />
      )}

      {/* Registered Shops Modal */}
      {showRegisteredShops && (
        <div className="registered-shops-modal">
          <div className="modal-overlay" onClick={handleCloseRegisteredShops}></div>
          <div className="modal-content">
            <button className="modal-close-btn" onClick={handleCloseRegisteredShops}>×</button>
            <RegisteredShops />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Find Electronics Across Ethiopia</h1>
            <p>Discover best deals on phones, laptops, and accessories from verified shops in your city</p>
            
            {/* City Selection Message */}
            {cityMessage && (
              <div className="city-selection-message">
                {cityMessage}
              </div>
            )}
            
            {/* City Search Section */}
            <div className="city-search-section">
              <h3>🏙️ Search by City</h3>
              <CitySelector 
                selectedCity={selectedCity}
                onCityChange={setSelectedCity}
                showAllOption={true}
              />
            </div>
          </div>
          
          <div className="hero-image">
            <div className="image-placeholder">
              {/* Action buttons moved to top */}
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section">
        <div className="container">
          {/* Product Search Section */}
          <div className="product-search-section">
            <h3>🔍 Search by Model, Brand, or Specs</h3>
            <AdvancedSearch 
              onSearch={handleSearch}
              onFilter={handleFilter}
              selectedCity={selectedCity}
            />
          </div>
          
          <div className="search-actions">
            <button 
              className="clear-search-btn"
              onClick={handleClearSearch}
            >
              🔄 Clear All
            </button>
            <button 
              className="view-all-products-btn"
              onClick={() => navigate('/search')}
            >
              📋 All Products
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
