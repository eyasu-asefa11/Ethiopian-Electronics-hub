import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CitySelector from './components/CitySelector';
import AdvancedSearch from './components/AdvancedSearch';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import ShopkeeperDashboard from './pages/ShopkeeperDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Auth from './pages/Auth';
import SearchResults from './pages/SearchResults';
import UserProfile from './pages/UserProfile';
import ShopRegistration from './pages/ShopRegistration';
import AddProduct from './pages/AddProduct';
import EditShop from './pages/EditShop';

// NEW E-COMMERCE COMPONENTS
import ShoppingCart from './components/ShoppingCart';
import Checkout from './components/Checkout';
import CustomerAuth from './components/CustomerAuth';
import CustomerDashboard from './components/CustomerDashboard';

import './App.css';
import API from './api';

function App() {
  const [user, setUser] = useState(null);
  const [customerUser, setCustomerUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {
    checkAuthStatus();
    checkCustomerAuth();
    updateCartCount();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await API.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const checkCustomerAuth = () => {
    const customerToken = localStorage.getItem('customerToken');
    if (customerToken) {
      const customerData = localStorage.getItem('customerUser');
      if (customerData) {
        setCustomerUser(JSON.parse(customerData));
      }
    }
  };

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    setCartItems(itemCount);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleCustomerLogin = (customerData) => {
    setCustomerUser(customerData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleCustomerLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerUser');
    setCustomerUser(null);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
        addedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    updateCartCount();
    
    // Show notification
    alert('Product added to cart!');
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Loading Ethiopian Electronics...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* EXISTING ROUTES */}
          <Route path="/" element={<Home user={user} addToCart={addToCart} cartItems={cartItems} />} />
          <Route path="/product/:id" element={<ProductDetail user={user} addToCart={addToCart} />} />
          <Route path="/shop/:shopId" element={<ShopkeeperDashboard user={user} />} />
          <Route path="/shopkeeper-dashboard" element={<ShopkeeperDashboard user={user} />} />
          <Route path="/admin-dashboard" element={<AdminDashboard user={user} />} />
          <Route path="/add-product" element={<AddProduct user={user} />} />
          <Route path="/shop/:shopId/edit" element={<EditShop user={user} />} />
          <Route path="/auth" element={<Auth onLogin={handleLogin} />} />
          <Route path="/search" element={<SearchResults user={user} addToCart={addToCart} />} />
          <Route path="/profile" element={<UserProfile user={user} onLogout={handleLogout} />} />
          <Route path="/register-shop" element={<ShopRegistration user={user} />} />
          
          {/* NEW E-COMMERCE ROUTES */}
          <Route path="/cart" element={<ShoppingCart addToCart={addToCart} updateCartCount={updateCartCount} />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/customer-login" element={<CustomerAuth />} />
          <Route path="/customer-register" element={<CustomerAuth />} />
          <Route path="/customer-dashboard" element={<CustomerDashboard customerUser={customerUser} onLogout={handleCustomerLogout} />} />
          
          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;