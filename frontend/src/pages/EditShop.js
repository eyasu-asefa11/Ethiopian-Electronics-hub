// src/pages/EditShop.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditShop.css';

function EditShop() {
  const { shopId } = useParams();
  const navigate = useNavigate();
  
  const shopCategories = [
    { value: 'mobile_phones', label: 'Mobile Phones' },
    { value: 'computers_laptops', label: 'Computers & Laptops' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'home_electronics', label: 'Home Electronics' },
    { value: 'mixed_electronics', label: 'Mixed Electronics' },
    { value: 'repair_service', label: 'Repair Service' }
  ];
  
  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'telebirr', label: 'Telebirr' },
    { value: 'cbe_birr', label: 'CBE Birr' },
    { value: 'mobile_banking', label: 'Mobile Banking' }
  ];
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const [formData, setFormData] = useState({
    electronicsHouseName: '',
    ownerName: '',
    shopCategory: '',
    paymentMethods: [],
    phoneNumbers: [{ operator: '', number: '' }],
    city: '',
    customCity: '',
    town: '',
    shopAddress: '',
    shopDescription: '',
    businessLicenseNumber: 'None',
    openingTime: '',
    closingTime: '',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    shopLogo: null,
    shopPhoto: null,
    shopGallery: []
  });

  const ethiopianCities = [
    { en: 'Addis Ababa', am: 'አዲስ አበባ' },
    { en: 'Dilla', am: 'ዲላ' },
    { en: 'Hawassa', am: 'ሀዋሳ' },
    { en: 'Mekelle', am: 'መቀሌ' },
    { en: 'Bahir Dar', am: 'ባህር ዳር' },
    { en: 'Dire Dawa', am: 'ድሬ ዳዋ' },
    { en: 'Adama', am: 'አዳማ' },
    { en: 'Gondar', am: 'ጎንደር' },
    { en: 'Jimma', am: 'ጅማ' },
    { en: 'Arba Minch', am: 'አርባ ምንጭ' },
    { en: 'Dessie', am: 'ደሴ' },
    { en: 'Shashemene', am: 'ሻሸመኔ' },
    { en: 'Debre Berhan', am: 'ደብረ ብርሃን' },
    { en: 'Nekemte', am: 'ነቀምቴ' },
    { en: 'Assosa', am: 'አሶሳ' }
  ];

  useEffect(() => {
    loadShopData();
  }, [shopId]);

  const loadShopData = () => {
    try {
      const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
      const shop = shops.find(s => s.id === shopId);
      
      if (!shop) {
        setMessage('Shop not found!');
        setMessageType('error');
        setTimeout(() => navigate('/shopkeeper-dashboard'), 2000);
        return;
      }

      // Load shop data into form
      setFormData({
        electronicsHouseName: shop.electronicsHouseName || '',
        ownerName: shop.ownerName || '',
        shopCategory: shop.shopCategory || '',
        paymentMethods: shop.paymentMethods || [],
        phoneNumbers: shop.phoneNumbers || [{ operator: '', number: '' }],
        city: shop.city || '',
        customCity: shop.customCity || '',
        town: shop.town || '',
        shopAddress: shop.shopAddress || '',
        shopDescription: shop.shopDescription || '',
        businessLicenseNumber: shop.businessLicenseNumber || 'None',
        openingTime: shop.openingTime || '',
        closingTime: shop.closingTime || '',
        workingDays: shop.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        shopLogo: shop.shopLogo || null,
        shopPhoto: shop.shopPhoto || null,
        shopGallery: shop.shopGallery || []
      });
    } catch (error) {
      console.error('Error loading shop data:', error);
      setMessage('Error loading shop data');
      setMessageType('error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.includes(method)
        ? prev.paymentMethods.filter(m => m !== method)
        : [...prev.paymentMethods, method]
    }));
  };

  const handlePhoneChange = (index, field, value) => {
    const updatedPhones = [...formData.phoneNumbers];
    updatedPhones[index][field] = value;
    setFormData(prev => ({
      ...prev,
      phoneNumbers: updatedPhones
    }));
  };

  const addPhoneNumber = () => {
    setFormData(prev => ({
      ...prev,
      phoneNumbers: [...prev.phoneNumbers, { operator: '', number: '' }]
    }));
  };

  const removePhoneNumber = (index) => {
    if (formData.phoneNumbers.length > 1) {
      const updatedPhones = formData.phoneNumbers.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        phoneNumbers: updatedPhones
      }));
    }
  };

  const handleWorkingDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [fieldName]: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Validate required fields
      if (!formData.electronicsHouseName.trim() || !formData.ownerName.trim()) {
        setMessage('Please fill in all required fields');
        setMessageType('error');
        setLoading(false);
        return;
      }

      // Get existing shops
      const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
      const shopIndex = shops.findIndex(s => s.id === shopId);

      if (shopIndex === -1) {
        setMessage('Shop not found!');
        setMessageType('error');
        setLoading(false);
        return;
      }

      // Handle logo file if changed
      let logoDataUrl = shops[shopIndex]?.logo; // Keep existing logo by default
      if (formData.shopLogo && formData.shopLogo !== shops[shopIndex]?.logo) {
        // If it's a new file (not a data URL)
        if (formData.shopLogo instanceof File) {
          const reader = new FileReader();
          await new Promise((resolve) => {
            reader.onload = (e) => {
              logoDataUrl = e.target.result;
              resolve();
            };
            reader.readAsDataURL(formData.shopLogo);
          });
        } else {
          logoDataUrl = formData.shopLogo;
        }
      }

      // Update shop data
      shops[shopIndex] = {
        ...shops[shopIndex],
        ...formData,
        logo: logoDataUrl,
        updatedAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      // Save to localStorage
      localStorage.setItem('registeredShops', JSON.stringify(shops));
      localStorage.setItem('currentShop', JSON.stringify(shops[shopIndex]));

      setMessage('✅ Shop updated successfully!');
      setMessageType('success');

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/shopkeeper-dashboard');
      }, 2000);

    } catch (error) {
      console.error('Error updating shop:', error);
      setMessage('❌ Error updating shop. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/shopkeeper-dashboard');
  };

  return (
    <div className="edit-shop-container">
      <div className="edit-shop-card">
        <div className="edit-shop-header">
          <h2>✏️ Edit Shop</h2>
          <p>Update your shop information</p>
        </div>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="edit-shop-form">
          <div className="form-section">
            <h3>🏪 Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="electronicsHouseName">Shop Name *</label>
                <input
                  type="text"
                  id="electronicsHouseName"
                  name="electronicsHouseName"
                  value={formData.electronicsHouseName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your shop name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="shopCategory">Shop Category *</label>
                <select
                  id="shopCategory"
                  name="shopCategory"
                  value={formData.shopCategory}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select shop category</option>
                  {shopCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="ownerName">Owner Name *</label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter owner name"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="shopDescription">Shop Description</label>
              <textarea
                id="shopDescription"
                name="shopDescription"
                value={formData.shopDescription}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your shop and what you offer..."
              />
            </div>

            <div className="form-group">
              <label>Payment Methods</label>
              <div className="payment-methods-grid">
                {paymentMethods.map(method => (
                  <label key={method.value} className="payment-method-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.paymentMethods.includes(method.value)}
                      onChange={() => handlePaymentMethodChange(method.value)}
                    />
                    <span className="checkmark"></span>
                    <span>{method.label}</span>
                  </label>
                ))}
              </div>
              <small>Select all payment methods you accept</small>
            </div>
          </div>

          <div className="form-section">
            <h3>📞 Contact Information</h3>
            <div className="phone-numbers">
              <label>Phone Numbers</label>
              {formData.phoneNumbers.map((phone, index) => (
                <div key={index} className="phone-row">
                  <select
                    value={phone.operator}
                    onChange={(e) => handlePhoneChange(index, 'operator', e.target.value)}
                  >
                    <option value="">Select Operator</option>
                    <option value="Ethio Telecom">Ethio Telecom</option>
                    <option value="Safari">Safari</option>
                  </select>
                  <input
                    type="tel"
                    value={phone.number}
                    onChange={(e) => handlePhoneChange(index, 'number', e.target.value)}
                    placeholder="09xxxxxxxx"
                  />
                  {formData.phoneNumbers.length > 1 && (
                    <button
                      type="button"
                      className="remove-phone-btn"
                      onClick={() => removePhoneNumber(index)}
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="add-phone-btn"
                onClick={addPhoneNumber}
              >
                ➕ Add Phone
              </button>
            </div>
          </div>

          <div className="form-section">
            <h3>📍 Location Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                >
                  <option value="">Select City</option>
                  {ethiopianCities.map((city, index) => (
                    <option key={index} value={city.en}>
                      {city.en}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="town">Town/Area</label>
                <input
                  type="text"
                  id="town"
                  name="town"
                  value={formData.town}
                  onChange={handleInputChange}
                  placeholder="Enter town or area"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="shopAddress">Shop Address</label>
              <input
                type="text"
                id="shopAddress"
                name="shopAddress"
                value={formData.shopAddress}
                onChange={handleInputChange}
                placeholder="Enter detailed shop address"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>🕐 Business Hours</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="openingTime">Opening Time</label>
                <input
                  type="time"
                  id="openingTime"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="closingTime">Closing Time</label>
                <input
                  type="time"
                  id="closingTime"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="working-days">
              <label>Working Days</label>
              <div className="days-grid">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <label key={day} className="day-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.workingDays.includes(day)}
                      onChange={() => handleWorkingDayToggle(day)}
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>📸 Shop Images</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="shopLogo">Shop Logo</label>
                <input
                  type="file"
                  id="shopLogo"
                  onChange={(e) => handleFileChange(e, 'shopLogo')}
                  accept="image/*"
                  className="file-input"
                />
                {formData.shopLogo && (
                  <div className="image-preview">
                    <img src={formData.shopLogo} alt="Shop Logo" />
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="shopPhoto">Shop Photo</label>
                <input
                  type="file"
                  id="shopPhoto"
                  onChange={(e) => handleFileChange(e, 'shopPhoto')}
                  accept="image/*"
                  className="file-input"
                />
                {formData.shopPhoto && (
                  <div className="image-preview">
                    <img src={formData.shopPhoto} alt="Shop Photo" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
              disabled={loading}
            >
              ❌ Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? '⏳ Updating...' : '✅ Update Shop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditShop;
