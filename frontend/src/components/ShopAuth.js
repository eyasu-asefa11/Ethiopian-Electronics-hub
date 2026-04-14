// Simple Shop Registration and Login Component
// This provides the exact form layout you specified

import React, { useState } from 'react';
import './ShopAuth.css';

const ShopAuth = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    // Registration fields
    shopName: '',
    ownerName: '',
    phoneNumber: '',
    city: '',
    shopAddress: '',
    password: '',
    confirmPassword: '',
    
    // Login fields (reuse phoneNumber and password)
  });

  const ethiopianCities = [
    'Addis Ababa',
    'Hawassa',
    'Dilla',
    'Bahir Dar',
    'Hossana',
    'Jimma',
    'Mekelle',
    'Gondar',
    'Adama',
    'Dire Dawa',
    'Jijiga',
    'Gambela',
    'Arba Minch',
    'Weldiya',
    'Shashemene',
    'Nekemte',
    'Debre Birhan',
    'Sodo',
    'Assosa'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.shopName || !formData.ownerName || !formData.phoneNumber || 
        !formData.city || !formData.shopAddress || !formData.password) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Registration data
    const registrationData = {
      shopName: formData.shopName,
      ownerName: formData.ownerName,
      phoneNumber: formData.phoneNumber,
      city: formData.city,
      shopAddress: formData.shopAddress,
      password: formData.password
    };

    console.log('Shop Registration:', registrationData);
    
    // Call registration callback
    if (onRegister) {
      onRegister(registrationData);
    } else {
      alert('Shop registered successfully!');
      // Switch to login after successful registration
      setIsLogin(true);
      // Clear form except phone number
      setFormData(prev => ({
        ...prev,
        shopName: '',
        ownerName: '',
        city: '',
        shopAddress: '',
        confirmPassword: ''
      }));
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.phoneNumber || !formData.password) {
      alert('Please enter phone number and password');
      return;
    }

    // Login data
    const loginData = {
      phoneNumber: formData.phoneNumber,
      password: formData.password
    };

    console.log('Shop Login:', loginData);
    
    // Call login callback
    if (onLogin) {
      onLogin(loginData);
    } else {
      alert('Login successful!');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    // Clear password fields when switching
    setFormData(prev => ({
      ...prev,
      password: '',
      confirmPassword: ''
    }));
  };

  return (
    <div className="shop-auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>
            {isLogin ? '🔐 Login to Your Account' : '🏪 Create Shop Account'}
          </h1>
          <div className="auth-subtitle">
            {isLogin 
              ? 'Welcome back! Login to manage your shop' 
              : 'Register your electronics shop on Ethiopian Electronics'
            }
          </div>
        </div>

        {isLogin ? (
          // Login Form
          <form onSubmit={handleLogin} className="auth-form login-form">
            <div className="form-divider">
              <span>Login to Your Account</span>
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="0912345678"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="********"
                required
                className="form-input"
              />
            </div>

            <button type="submit" className="auth-btn login-btn">
              🔑 Login
            </button>

            <div className="auth-footer">
              <span>Don't have a shop?</span>
              <button 
                type="button" 
                onClick={toggleForm}
                className="toggle-btn"
              >
                🏪 Register Shop
              </button>
            </div>
          </form>
        ) : (
          // Registration Form
          <form onSubmit={handleRegister} className="auth-form register-form">
            <div className="form-divider">
              <span>Create Shop Account</span>
            </div>

            <div className="form-group">
              <label htmlFor="shopName">Shop Name</label>
              <input
                type="text"
                id="shopName"
                name="shopName"
                value={formData.shopName}
                onChange={handleInputChange}
                placeholder="Abeba Electronics"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="ownerName">Owner Name</label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                placeholder="Abeba"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="0912345678"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">City</label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="form-input"
              >
                <option value="">Select City</option>
                {ethiopianCities.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="shopAddress">Shop Address</label>
              <input
                type="text"
                id="shopAddress"
                name="shopAddress"
                value={formData.shopAddress}
                onChange={handleInputChange}
                placeholder="Dilla Main Road"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="********"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="********"
                required
                className="form-input"
              />
            </div>

            <button type="submit" className="auth-btn register-btn">
              🏪 Register Shop
            </button>

            <div className="auth-footer">
              <span>Already have a shop?</span>
              <button 
                type="button" 
                onClick={toggleForm}
                className="toggle-btn"
              >
                🔑 Login
              </button>
            </div>
          </form>
        )}

        <div className="auth-features">
          <div className="feature-item">
            <span className="feature-icon">🛡️</span>
            <span className="feature-text">Secure & Verified Shops</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🇪🇹</span>
            <span className="feature-text">Reach Customers Nationwide</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📱</span>
            <span className="feature-text">Manage Products Easily</span>
          </div>
        </div>
      </div>

      <div className="auth-background">
        <div className="bg-pattern"></div>
      </div>
    </div>
  );
};

export default ShopAuth;
