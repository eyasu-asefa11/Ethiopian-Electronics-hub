import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShopOwnerRegistration.css';
import API from '../api';

const ShopOwnerRegistration = ({ user }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [shopData, setShopData] = useState({
    // Shop Information
    shop_name_en: 'Eyasu Electronics',
    shop_name_am: 'እያሱ ኤሌክትሮኒክስ',
    description: 'Quality electronics at affordable prices in Dilla',
    
    // Location
    city: 'Dilla',
    region: 'snnpr',
    address: 'Main Street, Dilla Town',
    landmark: 'Near Dilla Bus Station',
    
    // Contact
    phone: '+251911234567',
    whatsapp: '+251911234567',
    telegram: '@eyasu_electronics',
    
    // Business Details
    business_type: 'electronics',
    years_in_business: '5+',
    opening_hours: '8:00 AM - 8:00 PM',
    
    // Verification
    business_license: null,
    tax_id: null,
    trade_license: null
  });

  const ethiopianCities = [
    { id: 'addis_ababa', name: 'Addis Ababa', name_am: 'አዲስ አበባ' },
    { id: 'dilla', name: 'Dilla', name_am: 'ዲላ' },
    { id: 'hawassa', name: 'Hawassa', name_am: 'ሀዋሳ' },
    { id: 'hossana', name: 'Hossana', name_am: 'ሆሳዕና' },
    { id: 'arbaminch', name: 'Arba Minch', name_am: 'አርባ ምንጭ' },
    { id: 'jimma', name: 'Jimma', name_am: 'ጅማ' },
    { id: 'bahirdar', name: 'Bahirdar', name_am: 'ባህርዳር' },
    { id: 'gondar', name: 'Gondar', name_am: 'ጎንደር' },
    { id: 'mekelle', name: 'Mekelle', name_am: 'መቀሌ' },
    { id: 'adama', name: 'Adama', name_am: 'አዳማ' }
  ];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setShopData({ ...shopData, [name]: files[0] });
    } else {
      setShopData({ ...shopData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      
      // Add all shop data
      Object.keys(shopData).forEach(key => {
        if (shopData[key] instanceof File) {
          formData.append(key, shopData[key]);
        } else {
          formData.append(key, shopData[key]);
        }
      });

      // Add user info
      formData.append('user_id', user.id);

      const response = await API.post('/shops/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Redirect to shop dashboard
      navigate('/shop-dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Shop registration failed');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-content">
            <h3>🏪 Shop Information</h3>
            <div className="form-group">
              <label>Shop Name (English)</label>
              <input
                type="text"
                name="shop_name_en"
                value={shopData.shop_name_en}
                onChange={handleInputChange}
                placeholder="Enter your shop name in English"
                required
              />
            </div>
            <div className="form-group">
              <label>Shop Name (Amharic)</label>
              <input
                type="text"
                name="shop_name_am"
                value={shopData.shop_name_am}
                onChange={handleInputChange}
                placeholder="የሱቅልሽ ስም በአማርኛ"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={shopData.description}
                onChange={handleInputChange}
                placeholder="Tell customers about your shop and what you sell..."
                rows="4"
                required
              />
            </div>
            <div className="form-group">
              <label>Business Type</label>
              <select
                name="business_type"
                value={shopData.business_type}
                onChange={handleInputChange}
                required
              >
                <option value="electronics">Electronics</option>
                <option value="mobile_phones">Mobile Phones Only</option>
                <option value="computers">Computers & Laptops</option>
                <option value="accessories">Accessories Only</option>
                <option value="general">General Electronics</option>
              </select>
            </div>
            <div className="form-group">
              <label>Years in Business</label>
              <select
                name="years_in_business"
                value={shopData.years_in_business}
                onChange={handleInputChange}
                required
              >
                <option value="1-2">1-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3>📍 Location & Contact</h3>
            <div className="form-group">
              <label>City</label>
              <select
                name="city"
                value={shopData.city}
                onChange={handleInputChange}
                required
              >
                <option value="">Select your city</option>
                {ethiopianCities.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.name} / {city.name_am}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Region</label>
              <input
                type="text"
                name="region"
                value={shopData.region}
                onChange={handleInputChange}
                placeholder="Region"
                required
              />
            </div>
            <div className="form-group">
              <label>Shop Address</label>
              <input
                type="text"
                name="address"
                value={shopData.address}
                onChange={handleInputChange}
                placeholder="Street address or landmark"
                required
              />
            </div>
            <div className="form-group">
              <label>Landmark (Optional)</label>
              <input
                type="text"
                name="landmark"
                value={shopData.landmark}
                onChange={handleInputChange}
                placeholder="Near bus station, market, etc."
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={shopData.phone}
                onChange={handleInputChange}
                placeholder="+251 9X XXX XXXX"
                required
              />
            </div>
            <div className="form-group">
              <label>WhatsApp Number</label>
              <input
                type="tel"
                name="whatsapp"
                value={shopData.whatsapp}
                onChange={handleInputChange}
                placeholder="+251 9X XXX XXXX"
              />
            </div>
            <div className="form-group">
              <label>Telegram Username</label>
              <input
                type="text"
                name="telegram"
                value={shopData.telegram}
                onChange={handleInputChange}
                placeholder="@your_username"
              />
            </div>
            <div className="form-group">
              <label>Opening Hours</label>
              <input
                type="text"
                name="opening_hours"
                value={shopData.opening_hours}
                onChange={handleInputChange}
                placeholder="e.g., 8:00 AM - 8:00 PM"
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3>📋 Verification Documents</h3>
            <div className="verification-info">
              <p>📝 Upload your business documents to verify your shop. This helps customers trust your business.</p>
            </div>
            <div className="form-group">
              <label>Business License *</label>
              <input
                type="file"
                name="business_license"
                onChange={handleInputChange}
                accept=".pdf,.jpg,.jpeg,.png"
                required
              />
              <small>Upload your business license (PDF or Image)</small>
            </div>
            <div className="form-group">
              <label>Tax ID Document *</label>
              <input
                type="file"
                name="tax_id"
                onChange={handleInputChange}
                accept=".pdf,.jpg,.jpeg,.png"
                required
              />
              <small>Upload your tax identification document</small>
            </div>
            <div className="form-group">
              <label>Trade License (Optional)</label>
              <input
                type="file"
                name="trade_license"
                onChange={handleInputChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <small>Optional: Trade license document</small>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="shop-owner-registration">
      <div className="registration-header">
        <h2>🏪 Register Your Electronics Shop</h2>
        <p>Connect with customers across Ethiopia from your local shop in {shopData.city}</p>
      </div>

      <div className="step-indicator">
        <div className={`step ${step >= 1 ? 'active' : 'completed'}`}>1</div>
        <div className={`step ${step >= 2 ? 'active' : 'completed'}`}>2</div>
        <div className={`step ${step >= 3 ? 'active' : 'completed'}`}>3</div>
      </div>

      <form onSubmit={handleSubmit} className="registration-form">
        {renderStep()}

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
          
          {step < 3 ? (
            <button type="button" onClick={nextStep} className="btn-primary">
              Next →
            </button>
          ) : (
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? '🔄 Registering Shop...' : '🚀 Register Shop'}
            </button>
          )}
        </div>
      </form>

      <div className="benefits-section">
        <h3>🌟 Why Register Your Shop?</h3>
        <div className="benefits-grid">
          <div className="benefit">
            <span className="benefit-icon">👥</span>
            <h4>Reach More Customers</h4>
            <p>Customers from Hawassa, Addis Ababa, and all over Ethiopia can see your products</p>
          </div>
          <div className="benefit">
            <span className="benefit-icon">📱</span>
            <h4>Direct Contact</h4>
            <p>Customers call you directly when they find products they want</p>
          </div>
          <div className="benefit">
            <span className="benefit-icon">📈</span>
            <h4>Grow Your Business</h4>
            <p>Showcase your inventory and attract serious buyers</p>
          </div>
          <div className="benefit">
            <span className="benefit-icon">🔒</span>
            <h4>Build Trust</h4>
            <p>Verified badge shows customers you're a legitimate business</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerRegistration;
