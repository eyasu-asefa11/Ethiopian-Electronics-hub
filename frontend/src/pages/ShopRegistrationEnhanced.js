import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShopRegistration.css';
import API from '../api';

const ShopRegistration = ({ user }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [shopData, setShopData] = useState({
    name_en: '',
    name_am: '',
    description: '',
    address: '',
    city: '',
    region: '',
    phone: '',
    whatsapp: '',
    email: '',
    business_license: null,
    tax_id: null,
    trade_license: null
  });

  const ethiopianRegions = [
    { id: 'addis_ababa', name: 'Addis Ababa', name_am: 'አዲስ አበባ' },
    { id: 'amhara', name: 'Amhara', name_am: 'አማራ' },
    { id: 'oromia', name: 'Oromia', name_am: 'ኦሮሚያ' },
    { id: 'tigray', name: 'Tigray', name_am: 'ትግራይ' },
    { id: 'sidama', name: 'Sidama Region', name_am: 'ሲዳማ ክልል' },
    { id: 'somali', name: 'Somali', name_am: 'ሱማሌ' },
    { id: 'afar', name: 'Afar', name_am: 'አፋር' },
    { id: 'benishangul', name: 'Benishangul-Gumuz', name_am: 'ቤኒሻንጉል-ጉሙዝ' },
    { id: 'gambela', name: 'Gambela', name_am: 'ጋምቤላ' },
    { id: 'harari', name: 'Harari', name_am: 'ሐረሪ' },
    { id: 'dire_dawa', name: 'Dire Dawa', name_am: 'ድሬ ዳዋ' }
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
      Object.keys(shopData).forEach(key => {
        if (shopData[key] instanceof File) {
          formData.append(key, shopData[key]);
        } else {
          formData.append(key, shopData[key]);
        }
      });

      const response = await API.post('/shops/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/shop-verification-success');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
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
            <h3>Basic Information</h3>
            <div className="form-group">
              <label>Shop Name (English)</label>
              <input
                type="text"
                name="name_en"
                value={shopData.name_en}
                onChange={handleInputChange}
                placeholder="Enter shop name in English"
                required
              />
            </div>
            <div className="form-group">
              <label>Shop Name (Amharic)</label>
              <input
                type="text"
                name="name_am"
                value={shopData.name_am}
                onChange={handleInputChange}
                placeholder="የሱቅል ስም በአማርኛ"
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={shopData.description}
                onChange={handleInputChange}
                placeholder="Describe your shop and what you sell"
                rows="4"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3>Location & Contact</h3>
            <div className="form-group">
              <label>Region</label>
              <select
                name="region"
                value={shopData.region}
                onChange={handleInputChange}
                required
              >
                <option value="">Select region</option>
                {ethiopianRegions.map(region => (
                  <option key={region.id} value={region.id}>
                    {region.name} / {region.name_am}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={shopData.city}
                onChange={handleInputChange}
                placeholder="Enter city name"
                required
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={shopData.address}
                onChange={handleInputChange}
                placeholder="Street address"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
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
              <label>WhatsApp</label>
              <input
                type="tel"
                name="whatsapp"
                value={shopData.whatsapp}
                onChange={handleInputChange}
                placeholder="+251 9X XXX XXXX"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={shopData.email}
                onChange={handleInputChange}
                placeholder="shop@example.com"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3>Verification Documents</h3>
            <div className="form-group">
              <label>Business License</label>
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
              <label>Tax ID Document</label>
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
              <label>Trade License</label>
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
    <div className="shop-registration-container">
      <div className="registration-header">
        <h2>Register Your Electronics Shop</h2>
        <p>Join Ethiopia's largest electronics marketplace</p>
      </div>

      <div className="step-indicator">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
      </div>

      <form onSubmit={handleSubmit} className="shop-registration-form">
        {renderStep()}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-actions">
          {step > 1 && (
            <button type="button" onClick={prevStep} className="btn-secondary">
              Previous
            </button>
          )}
          
          {step < 3 ? (
            <button type="button" onClick={nextStep} className="btn-primary">
              Next
            </button>
          ) : (
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Registering...' : 'Register Shop'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ShopRegistration;
