import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ShopRegistrationBold.css';
import AdvancedGlobalNavigation from './AdvancedGlobalNavigation';

const ShopRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [showBackButton, setShowBackButton] = useState(true);
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    category: '',
    description: '',
    businessLicense: '',
    taxId: '',
    bankAccount: '',
    website: '',
    socialMedia: '',
    operatingHours: '',
    deliveryAreas: '',
    paymentMethods: [],
    shippingMethods: []
  });

  useEffect(() => {
    // Always show back button for shop registration
    setShowBackButton(true);
  }, [location]);

  const handleBack = () => {
    // Always navigate back to home
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked 
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle shop registration submission
    console.log('Shop Registration Data:', formData);
    // Navigate to shop management after successful registration
    navigate('/shop');
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const cities = [
    'Addis Ababa', 'Mekelle', 'Gondar', 'Bahir Dar', 
    'Dire Dawa', 'Adama', 'Hawassa', 'Jimma'
  ];

  const categories = [
    'Electronics', 'Mobile Phones', 'Computers', 'Accessories',
    'Gaming', 'Audio', 'Cameras', 'Smart Home'
  ];

  const paymentMethods = [
    'Cash on Delivery', 'Mobile Banking', 'Credit Card', 
    'Bank Transfer', 'Digital Wallets'
  ];

  const shippingMethods = [
    'Standard Delivery', 'Express Delivery', 
    'Same Day Delivery', 'Pickup Point'
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} handleInputChange={handleInputChange} cities={cities} categories={categories} />;
      case 2:
        return <BusinessInfoStep formData={formData} handleInputChange={handleInputChange} />;
      case 3:
        return <PaymentShippingStep formData={formData} handleInputChange={handleInputChange} paymentMethods={paymentMethods} shippingMethods={shippingMethods} />;
      case 4:
        return <ReviewStep formData={formData} />;
      default:
        return <BasicInfoStep formData={formData} handleInputChange={handleInputChange} cities={cities} categories={categories} />;
    }
  };

  return (
    <div className="shop-registration">
      {/* Advanced Back Button */}
      {showBackButton && (
        <AdvancedGlobalNavigation
          showBackButton={true}
          backText="← BACK TO HOME"
          theme="glassmorphism"
          size="medium"
          glassIntensity="medium"
          customBackAction={handleBack}
        />
      )}

      {/* Registration Header */}
      <div className="registration-header">
        <div className="header-content">
          <h1>🏪 Register Your Shop</h1>
          <p>Join 500+ electronics shops across Ethiopia</p>
        </div>
        <div className="header-image">
          <div className="shop-icon">🏪</div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="progress-steps">
        <div className="step-container">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className={`step ${currentStep >= step ? 'step--active' : 'step--inactive'}`}>
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 && 'Basic Info'}
                {step === 2 && 'Business Info'}
                {step === 3 && 'Payments & Shipping'}
                {step === 4 && 'Review'}
              </div>
            </div>
          ))}
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="registration-form">
        <form onSubmit={handleSubmit}>
          {renderStepContent()}
          
          {/* Navigation Buttons */}
          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" className="btn-back" onClick={prevStep}>
                ← Previous
              </button>
            )}
            
            {currentStep < 4 ? (
              <button type="button" className="btn-next" onClick={nextStep}>
                Next →
              </button>
            ) : (
              <button type="submit" className="btn-submit">
                Register Shop 🚀
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Additional Options */}
      <div className="registration-footer">
        <div className="footer-links">
          <a href="/shops" className="footer-link">
            📋 View Registered Shops
          </a>
          <a href="/admin" className="footer-link">
            👑 Admin Access
          </a>
        </div>
        <p className="footer-text">
          Already have a shop? <a href="/shop/login" className="login-link">Sign In</a>
        </p>
      </div>
    </div>
  );
};

// Basic Information Step
const BasicInfoStep = ({ formData, handleInputChange, cities, categories }) => {
  return (
    <div className="form-step">
      <h2>Basic Shop Information</h2>
      <p>Tell us about your shop and what you sell</p>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="shopName">Shop Name *</label>
          <input
            type="text"
            id="shopName"
            name="shopName"
            value={formData.shopName}
            onChange={handleInputChange}
            placeholder="Enter your shop name"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="ownerName">Owner Name *</label>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleInputChange}
            placeholder="Your full name"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="shop@example.com"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+251 911 234 567"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="city">City *</label>
          <select
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          >
            <option value="">Select your city</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Shop Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group full-width">
          <label htmlFor="address">Shop Address *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter your shop address"
            rows={3}
            required
          />
        </div>
        
        <div className="form-group full-width">
          <label htmlFor="description">Shop Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Tell customers about your shop and what makes it special"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};

// Business Information Step
const BusinessInfoStep = ({ formData, handleInputChange }) => {
  return (
    <div className="form-step">
      <h2>Business Information</h2>
      <p>Provide your business and legal details</p>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="businessLicense">Business License Number</label>
          <input
            type="text"
            id="businessLicense"
            name="businessLicense"
            value={formData.businessLicense}
            onChange={handleInputChange}
            placeholder="Enter your business license number"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="taxId">Tax Identification Number</label>
          <input
            type="text"
            id="taxId"
            name="taxId"
            value={formData.taxId}
            onChange={handleInputChange}
            placeholder="Enter your TIN number"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="bankAccount">Bank Account Number</label>
          <input
            type="text"
            id="bankAccount"
            name="bankAccount"
            value={formData.bankAccount}
            onChange={handleInputChange}
            placeholder="Enter your bank account number"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="website">Website (Optional)</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="https://yourshop.com"
          />
        </div>
        
        <div className="form-group full-width">
          <label htmlFor="socialMedia">Social Media Links</label>
          <textarea
            id="socialMedia"
            name="socialMedia"
            value={formData.socialMedia}
            onChange={handleInputChange}
            placeholder="Facebook: https://facebook.com/yourshop\nInstagram: https://instagram.com/yourshop"
            rows={3}
          />
        </div>
        
        <div className="form-group full-width">
          <label htmlFor="operatingHours">Operating Hours</label>
          <textarea
            id="operatingHours"
            name="operatingHours"
            value={formData.operatingHours}
            onChange={handleInputChange}
            placeholder="Monday-Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed"
            rows={3}
          />
        </div>
        
        <div className="form-group full-width">
          <label htmlFor="deliveryAreas">Delivery Areas</label>
          <textarea
            id="deliveryAreas"
            name="deliveryAreas"
            value={formData.deliveryAreas}
            onChange={handleInputChange}
            placeholder="List areas where you deliver (e.g., Addis Ababa, Mekelle, Gondar)"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

// Payment & Shipping Step
const PaymentShippingStep = ({ formData, handleInputChange, paymentMethods, shippingMethods }) => {
  return (
    <div className="form-step">
      <h2>Payment & Shipping Methods</h2>
      <p>Select how you accept payments and deliver products</p>
      
      <div className="form-section">
        <h3>Payment Methods</h3>
        <div className="checkbox-group">
          {paymentMethods.map(method => (
            <label key={method} className="checkbox-label">
              <input
                type="checkbox"
                name="paymentMethods"
                value={method}
                checked={formData.paymentMethods.includes(method)}
                onChange={handleInputChange}
              />
              <span className="checkbox-text">{method}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="form-section">
        <h3>Shipping Methods</h3>
        <div className="checkbox-group">
          {shippingMethods.map(method => (
            <label key={method} className="checkbox-label">
              <input
                type="checkbox"
                name="shippingMethods"
                value={method}
                checked={formData.shippingMethods.includes(method)}
                onChange={handleInputChange}
              />
              <span className="checkbox-text">{method}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

// Review Step
const ReviewStep = ({ formData }) => {
  return (
    <div className="form-step">
      <h2>Review Your Information</h2>
      <p>Please review your shop information before submitting</p>
      
      <div className="review-section">
        <h3>Basic Information</h3>
        <div className="review-grid">
          <div className="review-item">
            <label>Shop Name:</label>
            <span>{formData.shopName || 'Not provided'}</span>
          </div>
          <div className="review-item">
            <label>Owner Name:</label>
            <span>{formData.ownerName || 'Not provided'}</span>
          </div>
          <div className="review-item">
            <label>Email:</label>
            <span>{formData.email || 'Not provided'}</span>
          </div>
          <div className="review-item">
            <label>Phone:</label>
            <span>{formData.phone || 'Not provided'}</span>
          </div>
          <div className="review-item">
            <label>City:</label>
            <span>{formData.city || 'Not provided'}</span>
          </div>
          <div className="review-item">
            <label>Category:</label>
            <span>{formData.category || 'Not provided'}</span>
          </div>
        </div>
      </div>
      
      <div className="review-section">
        <h3>Business Information</h3>
        <div className="review-grid">
          <div className="review-item">
            <label>Business License:</label>
            <span>{formData.businessLicense || 'Not provided'}</span>
          </div>
          <div className="review-item">
            <label>Tax ID:</label>
            <span>{formData.taxId || 'Not provided'}</span>
          </div>
          <div className="review-item">
            <label>Website:</label>
            <span>{formData.website || 'Not provided'}</span>
          </div>
        </div>
      </div>
      
      <div className="review-section">
        <h3>Payment Methods</h3>
        <div className="review-methods">
          {formData.paymentMethods.length > 0 ? (
            formData.paymentMethods.map(method => (
              <span key={method} className="method-tag">{method}</span>
            ))
          ) : (
            <span className="no-methods">No payment methods selected</span>
          )}
        </div>
      </div>
      
      <div className="review-section">
        <h3>Shipping Methods</h3>
        <div className="review-methods">
          {formData.shippingMethods.length > 0 ? (
            formData.shippingMethods.map(method => (
              <span key={method} className="method-tag">{method}</span>
            ))
          ) : (
            <span className="no-methods">No shipping methods selected</span>
          )}
        </div>
      </div>
      
      <div className="terms-agreement">
        <label className="checkbox-label">
          <input type="checkbox" required />
          <span className="checkbox-text">
            I agree to the <a href="/terms" className="terms-link">Terms of Service</a> and <a href="/privacy" className="terms-link">Privacy Policy</a>
          </span>
        </label>
      </div>
    </div>
  );
};

export default ShopRegistration;
