import React, { useState } from 'react';
import './CustomerRegistration.css';

const CustomerRegistration = ({ onRegister, onClose, contactAction = null, shopName = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    location: '',
    birthPlace: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^09\d{8}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid Ethiopian phone number (09xxxxxxxx)';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.birthPlace.trim()) {
      newErrors.birthPlace = 'Birth place is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Save customer data to localStorage with multiple customers support
      const customerData = {
        ...formData,
        id: Date.now().toString(),
        registeredAt: new Date().toISOString(),
        type: 'customer'
      };
      
      // Get existing customers or create empty array
      const existingCustomers = JSON.parse(localStorage.getItem('registeredCustomers') || '[]');
      
      // Add new customer to the array
      existingCustomers.push(customerData);
      
      // Save updated customers array
      localStorage.setItem('registeredCustomers', JSON.stringify(existingCustomers));
      
      // Also save single customer for backwards compatibility
      localStorage.setItem('customerData', JSON.stringify(customerData));
      
      // Call parent callback
      onRegister(customerData);
      
      setIsSubmitting(false);
    }
  };

  return (
    <div className="customer-registration-overlay">
      <div className="customer-registration-modal">
        <div className="modal-header">
          <h2>👤 Customer Registration</h2>
          <p>
            {contactAction && shopName ? (
              <>
                Register to {contactAction} <strong>{shopName}</strong>
              </>
            ) : (
              'Register to access registered electronics shops'
            )}
          </p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number *</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="09xxxxxxxx"
              className={errors.phoneNumber ? 'error' : ''}
            />
            {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Current Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your current living location"
              className={errors.location ? 'error' : ''}
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="birthPlace">Birth Place *</label>
            <input
              type="text"
              id="birthPlace"
              name="birthPlace"
              value={formData.birthPlace}
              onChange={handleChange}
              placeholder="Enter your birth place"
              className={errors.birthPlace ? 'error' : ''}
            />
            {errors.birthPlace && <span className="error-message">{errors.birthPlace}</span>}
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="register-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register & Continue'}
            </button>
          </div>
        </form>
        
        <div className="modal-footer">
          <p>🔒 Your information is secure and will only be used for shop access</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegistration;
