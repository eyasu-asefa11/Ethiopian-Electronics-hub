// Shop Registration Form Component
// This appears when users click "Register Shop" from top navigation

import React, { useState } from 'react';
import './ShopRegistration.css';

const ShopRegistration = ({ onClose, onRegistrationComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    ownerName: '',
    phoneNumbers: [''],
    phoneCarriers: ['Ethio Telecom'],
    email: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Shop Information
    shopNameEn: '',
    shopNameAm: '',
    shopCategory: 'electronics',
    shopDescription: '',
    businessLicense: '',
    taxId: '',
    
    // Step 3: Location
    region: '',
    city: '',
    subCity: '',
    address: '',
    gpsLocation: {
      latitude: '',
      longitude: ''
    },
    
    // Step 4: Contact & Hours
    whatsapp: '',
    telegram: '',
    website: '',
    openingHours: {
      monday: '8:00 AM - 8:00 PM',
      tuesday: '8:00 AM - 8:00 PM',
      wednesday: '8:00 AM - 8:00 PM',
      thursday: '8:00 AM - 8:00 PM',
      friday: '8:00 AM - 8:00 PM',
      saturday: '9:00 AM - 6:00 PM',
      sunday: 'Closed'
    },
    
    // Step 5: Verification
    businessLicenseFile: null,
    taxIdFile: null,
    shopPhoto: null,
    agreeToTerms: false
  });

  const ethiopianRegions = [
    { id: 'addis_ababa', name: 'Addis Ababa', name_am: 'አዲስ አበባ' },
    { id: 'tigray', name: 'Tigray', name_am: 'ትግራይ' },
    { id: 'afar', name: 'Afar', name_am: 'አፋር' },
    { id: 'amhara', name: 'Amhara', name_am: 'አማራ' },
    { id: 'oromia', name: 'Oromia', name_am: 'ኦሮሚያ' },
    { id: 'somali', name: 'Somali', name_am: 'ሶማሌ' },
    { id: 'benishangul_gumuz', name: 'Benishangul-Gumuz', name_am: 'ቤኒሻንጉል-ጉሙዝ' },
    { id: 'snnpr', name: 'SNNPR', name_am: 'ደቡብ ብሔር ብሔር ክልላና ህዝባታት' },
    { id: 'gambela', name: 'Gambela', name_am: 'ጋምቤላ' },
    { id: 'harari', name: 'Harari', name_am: 'ሀረሪ' },
    { id: 'sidama', name: 'Sidama', name_am: 'ሲዳማ' },
    { id: 'dire_dawa', name: 'Dire Dawa', name_am: 'ድሬዳዋ' }
  ];

  const phoneCarriers = [
    'Ethio Telecom',
    'Safaricom',
    'Airtel',
    'Orange'
  ];

  const shopCategories = [
    'Electronics',
    'Mobile Phones',
    'Computers',
    'Accessories',
    'Home Appliances',
    'Gaming',
    'Audio/Video'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...formData.phoneNumbers];
    newPhones[index] = value;
    setFormData(prev => ({
      ...prev,
      phoneNumbers: newPhones
    }));
  };

  const handleCarrierChange = (index, value) => {
    const newCarriers = [...formData.phoneCarriers];
    newCarriers[index] = value;
    setFormData(prev => ({
      ...prev,
      phoneCarriers: newCarriers
    }));
  };

  const addPhoneNumber = () => {
    setFormData(prev => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, ''],
      phoneCarriers: [...prev.phoneCarriers, 'Ethio Telecom']
    }));
  };

  const removePhoneNumber = (index) => {
    if (formData.phoneNumbers.length > 1) {
      const newPhones = formData.phoneNumbers.filter((_, i) => i !== index);
      const newCarriers = formData.phoneCarriers.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        phoneNumbers: newPhones,
        phoneCarriers: newCarriers
      }));
    }
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration submission
    console.log('Shop Registration Data:', formData);
    onRegistrationComplete(formData);
  };

  const renderStep1 = () => (
    <div className="registration-step">
      <h3>👤 Step 1: Personal Information</h3>
      
      <div className="form-group">
        <label>Owner Name *</label>
        <input
          type="text"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="form-group">
        <label>Phone Numbers *</label>
        {formData.phoneNumbers.map((phone, index) => (
          <div key={index} className="phone-input-group">
            <select
              value={formData.phoneCarriers[index]}
              onChange={(e) => handleCarrierChange(index, e.target.value)}
            >
              {phoneCarriers.map(carrier => (
                <option key={carrier} value={carrier}>{carrier}</option>
              ))}
            </select>
            <input
              type="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(index, e.target.value)}
              placeholder="0912345678"
              required
            />
            {formData.phoneNumbers.length > 1 && (
              <button
                type="button"
                onClick={() => removePhoneNumber(index)}
                className="remove-btn"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addPhoneNumber}
          className="add-phone-btn"
        >
          + Add Another Phone
        </button>
      </div>

      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="your@email.com"
        />
      </div>

      <div className="form-group">
        <label>Password *</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Create a strong password"
          required
        />
      </div>

      <div className="form-group">
        <label>Confirm Password *</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Re-enter your password"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="registration-step">
      <h3>🏪 Step 2: Shop Information</h3>
      
      <div className="form-group">
        <label>Shop Name (English) *</label>
        <input
          type="text"
          name="shopNameEn"
          value={formData.shopNameEn}
          onChange={handleInputChange}
          placeholder="Abeba Electronics"
          required
        />
      </div>

      <div className="form-group">
        <label>Shop Name (Amharic) *</label>
        <input
          type="text"
          name="shopNameAm"
          value={formData.shopNameAm}
          onChange={handleInputChange}
          placeholder="አበባ ኤሌክትሮኒክስ"
          required
        />
      </div>

      <div className="form-group">
        <label>Shop Category *</label>
        <select
          name="shopCategory"
          value={formData.shopCategory}
          onChange={handleInputChange}
          required
        >
          {shopCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Shop Description</label>
        <textarea
          name="shopDescription"
          value={formData.shopDescription}
          onChange={handleInputChange}
          placeholder="Describe your shop and what you offer..."
          rows={4}
        />
      </div>

      <div className="form-group">
        <label>Business License Number *</label>
        <input
          type="text"
          name="businessLicense"
          value={formData.businessLicense}
          onChange={handleInputChange}
          placeholder="BL-2024-001"
          required
        />
      </div>

      <div className="form-group">
        <label>Tax ID Number *</label>
        <input
          type="text"
          name="taxId"
          value={formData.taxId}
          onChange={handleInputChange}
          placeholder="TAX-2024-001"
          required
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="registration-step">
      <h3>📍 Step 3: Location Information</h3>
      
      <div className="form-group">
        <label>Region *</label>
        <select
          name="region"
          value={formData.region}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Region</option>
          {ethiopianRegions.map(region => (
            <option key={region.id} value={region.id}>
              {region.name} ({region.name_am})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>City *</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          placeholder="Dilla"
          required
        />
      </div>

      <div className="form-group">
        <label>Sub City/Kebele</label>
        <input
          type="text"
          name="subCity"
          value={formData.subCity}
          onChange={handleInputChange}
          placeholder="Kebele 01"
        />
      </div>

      <div className="form-group">
        <label>Address *</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Main Street, Building 123"
          rows={3}
          required
        />
      </div>

      <div className="form-group">
        <label>GPS Location (Optional)</label>
        <div className="gps-inputs">
          <input
            type="number"
            placeholder="Latitude"
            value={formData.gpsLocation.latitude}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              gpsLocation: { ...prev.gpsLocation, latitude: e.target.value }
            }))}
          />
          <input
            type="number"
            placeholder="Longitude"
            value={formData.gpsLocation.longitude}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              gpsLocation: { ...prev.gpsLocation, longitude: e.target.value }
            }))}
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="registration-step">
      <h3>📞 Step 4: Contact & Business Hours</h3>
      
      <div className="form-group">
        <label>WhatsApp Number</label>
        <input
          type="tel"
          name="whatsapp"
          value={formData.whatsapp}
          onChange={handleInputChange}
          placeholder="0912345678"
        />
      </div>

      <div className="form-group">
        <label>Telegram Username</label>
        <input
          type="text"
          name="telegram"
          value={formData.telegram}
          onChange={handleInputChange}
          placeholder="@username"
        />
      </div>

      <div className="form-group">
        <label>Website</label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleInputChange}
          placeholder="https://yourshop.com"
        />
      </div>

      <div className="form-group">
        <label>Opening Hours</label>
        <div className="opening-hours">
          {Object.entries(formData.openingHours).map(([day, hours]) => (
            <div key={day} className="day-hours">
              <label className="day-label">{day.charAt(0).toUpperCase() + day.slice(1)}:</label>
              <input
                type="text"
                value={hours}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  openingHours: {
                    ...prev.openingHours,
                    [day]: e.target.value
                  }
                }))}
                placeholder="8:00 AM - 8:00 PM"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="registration-step">
      <h3>📋 Step 5: Verification Documents</h3>
      
      <div className="form-group">
        <label>Business License Document *</label>
        <div className="file-upload">
          <input
            type="file"
            id="businessLicenseFile"
            accept="image/*,.pdf"
            onChange={(e) => handleFileUpload(e, 'businessLicenseFile')}
            required
          />
          <label htmlFor="businessLicenseFile" className="file-upload-label">
            {formData.businessLicenseFile ? formData.businessLicenseFile.name : '📄 Upload Business License'}
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Tax ID Document *</label>
        <div className="file-upload">
          <input
            type="file"
            id="taxIdFile"
            accept="image/*,.pdf"
            onChange={(e) => handleFileUpload(e, 'taxIdFile')}
            required
          />
          <label htmlFor="taxIdFile" className="file-upload-label">
            {formData.taxIdFile ? formData.taxIdFile.name : '📄 Upload Tax ID Document'}
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Shop Photo *</label>
        <div className="file-upload">
          <input
            type="file"
            id="shopPhoto"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, 'shopPhoto')}
            required
          />
          <label htmlFor="shopPhoto" className="file-upload-label">
            {formData.shopPhoto ? formData.shopPhoto.name : '📷 Upload Shop Photo'}
          </label>
        </div>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              agreeToTerms: e.target.checked
            }))}
            required
          />
          I agree to the <a href="/terms" target="_blank">Terms and Conditions</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
        </label>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return null;
    }
  };

  return (
    <div className="shop-registration-overlay">
      <div className="shop-registration-modal">
        <div className="registration-header">
          <h2>🏪 Register Your Shop</h2>
          <p>Join Ethiopian Electronics and reach customers nationwide</p>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="progress-indicator">
          {[1, 2, 3, 4, 5].map(step => (
            <div
              key={step}
              className={`progress-step ${step <= currentStep ? 'active' : ''}`}
            >
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 && 'Personal'}
                {step === 2 && 'Shop'}
                {step === 3 && 'Location'}
                {step === 4 && 'Contact'}
                {step === 5 && 'Verify'}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="registration-form">
          {renderStepContent()}

          <div className="form-actions">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="prev-btn">
                ← Previous
              </button>
            )}
            
            {currentStep < 5 ? (
              <button type="button" onClick={nextStep} className="next-btn">
                Next →
              </button>
            ) : (
              <button type="submit" className="submit-btn">
                🎉 Complete Registration
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopRegistration;
