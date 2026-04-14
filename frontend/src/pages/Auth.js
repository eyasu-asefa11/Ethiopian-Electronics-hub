import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import API from '../api';

const Auth = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    phone_numbers: [''],
    phone_carriers: [''],
    city: '',
    region: '',
    shop_name_en: '',
    shop_name_am: '',
    role: 'buyer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cities, setCities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({ lat: null, lng: null });
  const [phoneErrors, setPhoneErrors] = useState({});

  // Phone validation function
  const validateEthiopianPhone = (phone, carrierId) => {
    if (!phone) return { valid: false, error: 'Phone number is required' };
    
    const carrier = ethiopianPhoneCarriers.find(c => c.id === carrierId);
    if (!carrier) return { valid: false, error: 'Please select a carrier first' };
    
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check for international format (+251)
    if (phone.startsWith('+251')) {
      const afterCode = cleanPhone.substring(3); // Remove 251
      if (afterCode.length !== 9) {
        return { valid: false, error: 'Phone number must be 9 digits after +251' };
      }
      
      // Check carrier prefix
      const phonePrefix = afterCode.substring(0, 1);
      const expectedPrefix = carrier.prefix[0] === '09' ? '9' : '7';
      
      if (phonePrefix !== expectedPrefix) {
        return { valid: false, error: `Invalid prefix for ${carrier.name}. Expected: +251 ${expectedPrefix}XX XXX XXX` };
      }
      
      return { valid: true, error: null };
    }
    
    // Check for local format (09 or 07)
    if (phone.startsWith('09') || phone.startsWith('07')) {
      if (cleanPhone.length !== 10) {
        return { valid: false, error: 'Phone number must be 10 digits (09XX XXX XXX or 07XX XXX XXX)' };
      }
      
      // Check carrier prefix
      const phonePrefix = cleanPhone.substring(0, 2);
      if (!carrier.prefix.includes(phonePrefix)) {
        return { valid: false, error: `Invalid prefix for ${carrier.name}. Expected: ${carrier.prefix.join(' or ')}` };
      }
      
      return { valid: true, error: null };
    }
    
    return { valid: false, error: 'Phone number must start with +251, 09, or 07' };
  };

  // Phone carriers available in Ethiopia
  const ethiopianPhoneCarriers = [
    { id: 'ethio_telecom', name: 'Ethio Telecom', name_am: 'ኢትዮ ቴሌኮም', prefix: ['09', '07'] },
    { id: 'safaricom', name: 'Safaricom Ethiopia', name_am: 'ሳፋሪኮም ኢትዮጵያ', prefix: ['07'] },
    { id: 'oromotelecom', name: 'Oromo Telecom', name_am: 'ኦሮሞ ቴሌኮም', prefix: ['09'] },
    { id: 'telesom', name: 'Telesom', name_am: 'ቴለሶም', prefix: ['09'] }
  ];

  // Ethiopian regions with cities and GPS coordinates
  const ethiopianRegions = [
    {
      id: 'addis_ababa',
      name: 'Addis Ababa',
      name_am: 'አዲስ አበባ',
      lat: 9.1450,
      lng: 38.7617,
      cities: [
        { id: 'addis_ketema', name: 'Addis Ketema', name_am: 'አዲስ ከተማ', lat: 9.0333, lng: 38.7333 },
        { id: 'bole', name: 'Bole', name_am: 'ቦሌ', lat: 9.0167, lng: 38.9000 },
        { id: 'kazanchis', name: 'Kazanchis', name_am: 'ካዛንቸስ', lat: 9.0278, lng: 38.7472 },
        { id: 'mekanisa', name: 'Mekanisa', name_am: 'መካኒሳ', lat: 9.0667, lng: 38.7167 },
        { id: 'piassa', name: 'Piassa', name_am: 'ፒያሳ', lat: 9.0333, lng: 38.7500 }
      ]
    },
    {
      id: 'amhara',
      name: 'Amhara',
      name_am: 'አማራ',
      lat: 11.5806,
      lng: 37.3833,
      cities: [
        { id: 'bahir_dar', name: 'Bahir Dar', name_am: 'ባህር ዳር', lat: 11.5937, lng: 37.3908 },
        { id: 'gondar', name: 'Gondar', name_am: 'ጎንደር', lat: 12.6000, lng: 37.4667 },
        { id: 'dessie', name: 'Dessie', name_am: 'ደሴ', lat: 11.1167, lng: 39.6333 },
        { id: 'debre_markos', name: 'Debre Markos', name_am: 'ደብረ ማርቆስ', lat: 10.3333, lng: 37.7333 }
      ]
    },
    {
      id: 'oromia',
      name: 'Oromia',
      name_am: 'ኦሮሚያ',
      lat: 8.5333,
      lng: 40.0000,
      cities: [
        { id: 'adama', name: 'Adama', name_am: 'አዳማ', lat: 8.5500, lng: 39.2667 },
        { id: 'jimma', name: 'Jimma', name_am: 'ጂማ', lat: 7.6667, lng: 36.8333 },
        { id: 'negele', name: 'Negele', name_am: 'ነገሌ', lat: 5.3500, lng: 39.4667 },
        { id: 'shashamane', name: 'Shashamane', name_am: 'ሻሻማኔ', lat: 7.2000, lng: 38.6000 }
      ]
    },
    {
      id: 'tigray',
      name: 'Tigray',
      name_am: 'ትግራይ',
      lat: 13.5000,
      lng: 39.0000,
      cities: [
        { id: 'mekelle', name: 'Mekelle', name_am: 'መቀለ', lat: 13.4967, lng: 39.4758 },
        { id: 'axum', name: 'Axum', name_am: 'አክሱም', lat: 14.1311, lng: 38.7161 },
        { id: 'adigrat', name: 'Adigrat', name_am: 'አዲግራት', lat: 14.2775, lng: 39.4583 }
      ]
    },
    {
      id: 'sidama',
      name: 'Sidama Region',
      name_am: 'ሲዳማ ክልል',
      lat: 6.8500,
      lng: 38.5000,
      cities: [
        { id: 'hawassa', name: 'Hawassa', name_am: 'ሀዋሳ', lat: 7.0591, lng: 38.4766 },
        { id: 'yirgalem', name: 'Yirgalem', name_am: 'ይርጋለም', lat: 6.7500, lng: 38.4167 },
        { id: 'awasa', name: 'Awasa', name_am: 'አዋሳ', lat: 7.0591, lng: 38.4766 },
        { id: 'piassa_hawassa', name: 'Piassa', name_am: 'ፒያሳ', lat: 7.0667, lng: 38.4833 },
        { id: 'tabor', name: 'Tabor', name_am: 'ታቦር', lat: 7.0833, lng: 38.4667 },
        { id: 'menaharia', name: 'Menaharia', name_am: 'መናሀሪያ', lat: 7.0500, lng: 38.4900 },
        { id: 'gudumale', name: 'Gudumale', name_am: 'ጉዱማለ', lat: 7.0417, lng: 38.4583 },
        { id: 'aledege', name: 'Alege', name_am: 'አለደጌ', lat: 7.0750, lng: 38.4917 },
        { id: 'wondo_genet', name: 'Wondo Genet', name_am: 'ወንዶ ገኔት', lat: 7.1833, lng: 38.6333 },
        { id: 'bensa', name: 'Bensa', name_am: 'ቤንሳ', lat: 6.9167, lng: 38.5667 }
      ]
    },
    {
      id: 'south_west',
      name: 'South West Ethiopia Peoples\' Region',
      name_am: 'ደቡብ ምዕራብ ኢትዮጵያ ሕዝቦች ክልል',
      lat: 6.3333,
      lng: 36.8333,
      cities: [
        { id: 'bonga', name: 'Bonga', name_am: 'ቦንጋ', lat: 7.2833, lng: 36.2333 },
        { id: 'mizan', name: 'Mizan Teferi', name_am: 'ምዛን ተፈሪ', lat: 6.9833, lng: 35.5833 },
        { id: 'tepi', name: 'Tepi', name_am: 'ተፒ', lat: 7.0833, lng: 35.4000 },
        { id: 'guraferda', name: 'Guraferda', name_am: 'ጉራፈርዳ', lat: 6.9167, lng: 35.8333 }
      ]
    },
    {
      id: 'south_ethiopia',
      name: 'South Ethiopia Regional State',
      name_am: 'ደቡብ ኢትዮጵያ ክልል',
      lat: 5.5000,
      lng: 37.0000,
      cities: [
        { id: 'wolaita_sodo', name: 'Wolaita Sodo', name_am: 'ወላይታ ሶዶ', lat: 6.9536, lng: 37.8753 },
        { id: 'arbaminch', name: 'Arba Minch', name_am: 'አርባ ምንጭ', lat: 6.0333, lng: 37.5500 },
        { id: 'jinka', name: 'Jinka', name_am: 'ጂንካ', lat: 5.7667, lng: 36.5667 },
        { id: 'konso', name: 'Konso', name_am: 'ኮንሶ', lat: 5.2500, lng: 37.4833 }
      ]
    },
    {
      id: 'central_ethiopia',
      name: 'Central Ethiopia Regional State',
      name_am: 'ማዕከላዊ ኢትዮጵያ ክልል',
      lat: 8.0000,
      lng: 38.5000,
      cities: [
        { id: 'hosaena', name: 'Hosaena', name_am: 'ሆሳዕና', lat: 8.4667, lng: 38.0000 },
        { id: 'butajira', name: 'Butajira', name_am: 'ቡታጂራ', lat: 8.1333, lng: 38.4167 },
        { id: 'worabe', name: 'Worabe', name_am: 'ወራቤ', lat: 8.0333, lng: 38.9167 },
        { id: 'sodo', name: 'Sodo', name_am: 'ሶዶ', lat: 7.9500, lng: 38.6000 }
      ]
    },
    {
      id: 'somali',
      name: 'Somali',
      name_am: 'ሱማሌ',
      lat: 7.0000,
      lng: 42.0000,
      cities: [
        { id: 'jijiga', name: 'Jijiga', name_am: 'ጂጂጋ', lat: 9.3500, lng: 42.8000 },
        { id: 'degehabur', name: 'Degehabur', name_am: 'ደገሀቡር', lat: 8.2500, lng: 42.4333 }
      ]
    },
    {
      id: 'afar',
      name: 'Afar',
      name_am: 'አፋር',
      lat: 12.0000,
      lng: 41.0000,
      cities: [
        { id: 'samara', name: 'Samara', name_am: 'ሳማራ', lat: 11.8000, lng: 40.9000 },
        { id: 'logia', name: 'Logia', name_am: 'ሎጊያ', lat: 11.7500, lng: 41.0000 }
      ]
    },
    {
      id: 'benishangul',
      name: 'Benishangul-Gumuz',
      name_am: 'ቤኒሻንጉል-ጉሙዝ',
      lat: 10.5000,
      lng: 34.5000,
      cities: [
        { id: 'assosa', name: 'Assosa', name_am: 'አሶሳ', lat: 10.0333, lng: 34.5333 },
        { id: 'gilgel_beles', name: 'Gilgel Beles', name_am: 'ግልገል በለስ', lat: 10.7000, lng: 34.5833 }
      ]
    },
    {
      id: 'gambela',
      name: 'Gambela',
      name_am: 'ጋምቤላ',
      lat: 8.2500,
      lng: 34.5833,
      cities: [
        { id: 'gambela_town', name: 'Gambela', name_am: 'ጋምቤላ', lat: 8.2500, lng: 34.5833 },
        { id: 'itang', name: 'Itang', name_am: 'እታንግ', lat: 8.1667, lng: 34.4167 }
      ]
    },
    {
      id: 'harari',
      name: 'Harari',
      name_am: 'ሐረሪ',
      lat: 9.3167,
      lng: 42.1167,
      cities: [
        { id: 'harar', name: 'Harar', name_am: 'ሐረር', lat: 9.3167, lng: 42.1167 }
      ]
    },
    {
      id: 'dire_dawa',
      name: 'Dire Dawa',
      name_am: 'ድሬ ዳዋ',
      lat: 9.6000,
      lng: 41.8667,
      cities: [
        { id: 'dire_dawa_city', name: 'Dire Dawa', name_am: 'ድሬ ዳዋ', lat: 9.6000, lng: 41.8667 }
      ]
    }
  ];

  useEffect(() => {
    setRegions(ethiopianRegions);
    // Set default region to Addis Ababa
    setFormData(prev => ({ ...prev, region: 'addis_ababa' }));
  }, []);

  const fetchCities = async () => {
    try {
      const response = await API.get('/cities');
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'region') {
      const selectedRegion = ethiopianRegions.find(r => r.id === value);
      setSelectedLocation({ 
        lat: selectedRegion?.lat || null, 
        lng: selectedRegion?.lng || null 
      });
      setFormData({
        ...formData,
        region: value,
        city: '' // Reset city when region changes
      });
    } else if (name === 'city') {
      const selectedRegion = ethiopianRegions.find(r => r.id === formData.region);
      const selectedCity = selectedRegion?.cities.find(c => c.id === value);
      setSelectedLocation({ 
        lat: selectedCity?.lat || selectedRegion?.lat || null, 
        lng: selectedCity?.lng || selectedRegion?.lng || null 
      });
      setFormData({
        ...formData,
        [name]: value
      });
    } else if (name === 'primary_carrier') {
      // Set primary carrier only for first phone
      const newPhoneCarriers = [...formData.phone_carriers];
      newPhoneCarriers[0] = value;
      
      // Re-validate first phone number with new carrier
      if (formData.phone_numbers[0]) {
        const validation = validateEthiopianPhone(formData.phone_numbers[0], value);
        setPhoneErrors(prev => ({
          ...prev,
          phone_0: validation.error
        }));
      }
      
      setFormData({
        ...formData,
        phone_carriers: newPhoneCarriers
      });
    } else if (name.startsWith('phone_')) {
      const index = parseInt(name.split('_')[1]);
      const newPhoneNumbers = [...formData.phone_numbers];
      newPhoneNumbers[index] = value;
      
      // Validate phone number
      const carrierId = formData.phone_carriers[index] || formData.phone_carriers[0];
      const validation = validateEthiopianPhone(value, carrierId);
      
      setPhoneErrors(prev => ({
        ...prev,
        [`phone_${index}`]: validation.error
      }));
      
      setFormData({
        ...formData,
        phone_numbers: newPhoneNumbers
      });
    } else if (name.startsWith('carrier_')) {
      const index = parseInt(name.split('_')[1]);
      const newPhoneCarriers = [...formData.phone_carriers];
      newPhoneCarriers[index] = value;
      
      // Re-validate phone number with new carrier
      const phoneNumber = formData.phone_numbers[index];
      if (phoneNumber) {
        const validation = validateEthiopianPhone(phoneNumber, value);
        setPhoneErrors(prev => ({
          ...prev,
          [`phone_${index}`]: validation.error
        }));
      }
      
      setFormData({
        ...formData,
        phone_carriers: newPhoneCarriers
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const addPhoneNumber = () => {
    if (formData.phone_numbers.length < 10) {
      setFormData({
        ...formData,
        phone_numbers: [...formData.phone_numbers, ''],
        phone_carriers: [...formData.phone_carriers, ''] // Empty carrier for new phone
      });
    }
  };

  const removePhoneNumber = (index) => {
    const newPhoneNumbers = formData.phone_numbers.filter((_, i) => i !== index);
    const newPhoneCarriers = formData.phone_carriers.filter((_, i) => i !== index);
    
    // Remove error for this phone
    const newPhoneErrors = { ...phoneErrors };
    delete newPhoneErrors[`phone_${index}`];
    
    // Re-index remaining errors
    const reindexedErrors = {};
    Object.keys(newPhoneErrors).forEach((key, i) => {
      if (i < index) {
        reindexedErrors[key] = newPhoneErrors[key];
      } else {
        const newKey = `phone_${i - 1}`;
        reindexedErrors[newKey] = newPhoneErrors[key];
      }
    });
    
    setPhoneErrors(reindexedErrors);
    
    setFormData({
      ...formData,
      phone_numbers: newPhoneNumbers,
      phone_carriers: newPhoneCarriers
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login - use phone number for authentication
        const primaryPhone = formData.phone_numbers[0];
        if (!primaryPhone) {
          setError('Phone number is required for login');
          setLoading(false);
          return;
        }

        const response = await API.post('/login', {
          phone: primaryPhone
        });

        const { token } = response.data;
        localStorage.setItem('token', token);
        
        // Get user info
        const userResponse = await API.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        onLogin(userResponse.data);
        navigate('/');
      } else {
        // Register
        if (!formData.username.trim()) {
          setError('Username is required');
          setLoading(false);
          return;
        }

        if (!formData.city) {
          setError('Please select a city');
          setLoading(false);
          return;
        }

        if (formData.role === 'seller') {
          if (!formData.shop_name_en.trim() || !formData.shop_name_am.trim()) {
            setError('Shop name in both English and Amharic is required for sellers');
            setLoading(false);
            return;
          }
        }

        const validPhones = formData.phone_numbers.filter(phone => phone.trim());
        if (validPhones.length === 0) {
          setError('At least one phone number is required');
          setLoading(false);
          return;
        }

        await API.post('/register', {
          username: formData.username,
          phone_numbers: validPhones,
          city: formData.city,
          region: formData.region,
          role: formData.role,
          shop_name_en: formData.shop_name_en,
          shop_name_am: formData.shop_name_am
        });

        // Auto login after registration
        const loginResponse = await API.post('/login', {
          phone: validPhones[0]
        });

        const { token } = loginResponse.data;
        localStorage.setItem('token', token);
        
        const userResponse = await API.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        onLogin(userResponse.data);
        navigate('/');
      }
    } catch (error) {
      console.error('Registration/Login error:', error);
      
      // Handle specific error cases
      if (error.response?.data?.error) {
        const errorMessage = error.response.data.error;
        
        if (errorMessage.includes('UNIQUE constraint failed: users.username')) {
          setError('This username is already taken. Please choose a different username.');
        } else if (errorMessage.includes('phone') && errorMessage.includes('already exists')) {
          setError('This phone number is already registered. Please use a different phone number.');
        } else if (errorMessage.includes('Invalid credentials')) {
          setError('Invalid phone number. Please check and try again.');
        } else if (errorMessage.includes('User not found')) {
          setError('No account found with this phone number. Please register first.');
        } else {
          setError(errorMessage);
        }
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      username: '',
      phone_numbers: [''],
      phone_carriers: [''],
      city: '',
      region: 'addis_ababa',
      shop_name_en: '',
      shop_name_am: '',
      role: 'buyer'
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">
            <span className="logo-icon">📱</span>
            <h1>Ethiopian Electronics</h1>
          </div>
          <p>{isLogin ? 'Welcome back!' : 'Join our community'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                placeholder="Choose a username"
              />
            </div>
          )}

          <div className="form-group">
            <label>Phone Numbers</label>
            <div className="phone-carrier-section">
              <div className="carrier-selection">
                <label>Select Carrier First:</label>
                <select
                  name="primary_carrier"
                  value={formData.phone_carriers[0] || ''}
                  onChange={handleInputChange}
                  className="primary-carrier-select"
                  required
                >
                  <option value="">Select your carrier</option>
                  {ethiopianPhoneCarriers.map((carrier) => (
                    <option key={carrier.id} value={carrier.id}>
                      {carrier.name} / {carrier.name_am}
                    </option>
                  ))}
                </select>
                {formData.phone_carriers[0] && (
                  <div className="phone-format-examples">
                    <div className="format-title">Phone Formats:</div>
                    <div className="format-examples">
                      <div className="format-example">
                        <span className="format-label">Local:</span>
                        <span className="format-value">
                          {ethiopianPhoneCarriers.find(c => c.id === formData.phone_carriers[0])?.prefix[0]}XX XXX XXX
                        </span>
                      </div>
                      <div className="format-example">
                        <span className="format-label">International:</span>
                        <span className="format-value">
                          +251 {ethiopianPhoneCarriers.find(c => c.id === formData.phone_carriers[0])?.prefix[0] === '09' ? '9' : '7'}XX XXX XXX
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="phone-numbers-list">
                <label>Add Phone Numbers (up to 10):</label>
                {formData.phone_numbers.map((phone, index) => (
                  <div key={index} className="phone-input-group">
                    <div className="phone-carrier-select-wrapper">
                      <select
                        name={`carrier_${index}`}
                        value={formData.phone_carriers[index] || formData.phone_carriers[0] || ''}
                        onChange={handleInputChange}
                        className="phone-carrier-select"
                        required={index === 0}
                      >
                        <option value="">Select carrier</option>
                        {ethiopianPhoneCarriers.map((carrier) => (
                          <option key={carrier.id} value={carrier.id}>
                            {carrier.name} / {carrier.name_am}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="phone-input-wrapper">
                      <input
                        type="tel"
                        name={`phone_${index}`}
                        value={phone}
                        onChange={handleInputChange}
                        placeholder="+251 9X XXX XXXX"
                        required={index === 0}
                        className={phoneErrors[`phone_${index}`] ? 'error-input' : ''}
                      />
                      {phoneErrors[`phone_${index}`] && (
                        <div className="phone-error">
                          <span className="error-icon">❌</span>
                          <span className="error-text">{phoneErrors[`phone_${index}`]}</span>
                        </div>
                      )}
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        className="remove-phone-btn"
                        onClick={() => removePhoneNumber(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {!isLogin && formData.phone_numbers.length < 10 && (
                  <button
                    type="button"
                    className="add-phone-btn"
                    onClick={addPhoneNumber}
                  >
                    + Add Another Phone Number
                  </button>
                )}
              </div>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>I want to</label>
              <div className="role-selector">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="role"
                    value="buyer"
                    checked={formData.role === 'buyer'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-label">
                    <span className="radio-icon">🛒</span>
                    <span className="radio-text">Buy Electronics</span>
                  </span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={formData.role === 'seller'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-label">
                    <span className="radio-icon">🏪</span>
                    <span className="radio-text">Sell Electronics</span>
                  </span>
                </label>
              </div>
            </div>
          )}

          {!isLogin && (
            <>
              <div className="form-group">
                <label>Region</label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your region</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name} / {region.name_am}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>City</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your city</option>
                  {regions
                    .find(r => r.id === formData.region)
                    ?.cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name} / {city.name_am}
                      </option>
                    )) || []}
                </select>
              </div>

              {selectedLocation.lat && selectedLocation.lng && (
                <div className="gps-location">
                  <label>GPS Location</label>
                  <div className="gps-coordinates">
                    <div className="coordinate">
                      <span className="coordinate-label">Latitude:</span>
                      <span className="coordinate-value">{selectedLocation.lat.toFixed(4)}</span>
                    </div>
                    <div className="coordinate">
                      <span className="coordinate-label">Longitude:</span>
                      <span className="coordinate-value">{selectedLocation.lng.toFixed(4)}</span>
                    </div>
                  </div>
                  <div className="gps-info">
                    <span className="gps-icon">📍</span>
                    <span className="location-text">
                      {regions.find(r => r.id === formData.region)?.name} / 
                      {regions.find(r => r.id === formData.region)?.cities.find(c => c.id === formData.city)?.name}
                    </span>
                  </div>
                </div>
              )}

              {formData.role === 'seller' && (
                <>
                  <div className="form-group">
                    <label>Shop Name (English)</label>
                    <input
                      type="text"
                      name="shop_name_en"
                      value={formData.shop_name_en}
                      onChange={handleInputChange}
                      placeholder="Enter shop name in English"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Shop Name (Amharic)</label>
                    <input
                      type="text"
                      name="shop_name_am"
                      value={formData.shop_name_am}
                      onChange={handleInputChange}
                      placeholder="የሱቁት ስም በአማርኛ"
                      required
                    />
                  </div>
                </>
              )}
            </>
          )}

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button type="button" className="toggle-button" onClick={toggleMode}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {isLogin && (
          <div className="auth-divider">
            <span>or continue with</span>
          </div>
        )}

        {isLogin && (
          <div className="social-login">
            <button type="button" className="social-button google">
              <span className="social-icon">📧</span>
              Continue with Email
            </button>
            <button type="button" className="social-button phone">
              <span className="social-icon">📱</span>
              Continue with Phone
            </button>
          </div>
        )}
      </div>

      <div className="auth-info">
        <div className="info-section">
          <h3>Why Join Ethiopian Electronics?</h3>
          <div className="info-features">
            <div className="info-feature">
              <span className="feature-icon">🔍</span>
              <div>
                <h4>Smart Search</h4>
                <p>Find exact models, compare specs and prices across all shops</p>
              </div>
            </div>
            <div className="info-feature">
              <span className="feature-icon">🏪</span>
              <div>
                <h4>Verified Shops</h4>
                <p>All shops are verified and reviewed by real customers</p>
              </div>
            </div>
            <div className="info-feature">
              <span className="feature-icon">💬</span>
              <div>
                <h4>Direct Contact</h4>
                <p>Message sellers directly, no middlemen involved</p>
              </div>
            </div>
            <div className="info-feature">
              <span className="feature-icon">📍</span>
              <div>
                <h4>Local Focus</h4>
                <p>Find electronics in your city, support local businesses</p>
              </div>
            </div>
          </div>
        </div>

        <div className="test-accounts">
          <h4>Quick Test Accounts</h4>
          <div className="test-account">
            <strong>Buyer:</strong> buyer@test.com / password123
          </div>
          <div className="test-account">
            <strong>Seller:</strong> seller@test.com / password123
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
