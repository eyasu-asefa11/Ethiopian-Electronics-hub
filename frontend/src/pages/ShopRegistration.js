import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShopRegistration.css';
import API from '../api';
import AdvancedGlobalNavigation from '../components/AdvancedGlobalNavigation';

const ShopRegistration = ({ user }) => {
  const navigate = useNavigate();
  
  // Back to home handler
  const handleBackToHome = () => {
    navigate('/');
  };
  
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
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    city_id: '',
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
    operating_hours: '',
    business_license: '',
    social_links: '',
    shopCategory: '',
    paymentMethods: []
  });
  
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [licenseFile, setLicenseFile] = useState(null);
  const [shopFrontImage, setShopFrontImage] = useState(null);
  const [shopBackImage, setShopBackImage] = useState(null);
  const [shopGalleryImages, setShopGalleryImages] = useState([]);
  const [logo, setLogo] = useState(null);
  const [shopFrontPreview, setShopFrontPreview] = useState(null);
  const [shopBackPreview, setShopBackPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (user.role !== 'seller') {
      navigate('/');
      return;
    }
    
    fetchCities();
  }, [user, navigate]);

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

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'logo') {
      setLogo(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setLogoPreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setLogoPreview(null);
      }
    } else if (type === 'shopFront') {
      setShopFrontImage(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setShopFrontPreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setShopFrontPreview(null);
      }
    } else if (type === 'shopBack') {
      setShopBackImage(file);
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setShopBackPreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setShopBackPreview(null);
      }
    } else if (type === 'shopGallery') {
      const files = Array.from(e.target.files);
      setShopGalleryImages(files);
      
      // Create previews for all gallery images
      const previews = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => previews.push(e.target.result);
        reader.readAsDataURL(file);
      });
      setGalleryPreviews(previews);
    } else if (type === 'license') {
      setLicenseFile(file);
    }
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('Shop name is required');
      return false;
    }
    if (!formData.shopCategory) {
      setError('Shop category is required');
      return false;
    }
    if (!formData.city_id) {
      setError('City is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (!formData.description.trim()) {
      setError('Shop description is required');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Physical address is required');
      return false;
    }
    if (formData.paymentMethods.length === 0) {
      setError('Please select at least one payment method');
      return false;
    }
    setError('');
    return true;
  };

  const validateStep3 = () => {
    if (!licenseFile) {
      setError('Business license document is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Handle logo file
      let logoDataUrl = null;
      if (logo) {
        console.log('Processing logo file...');
        const reader = new FileReader();
        logoDataUrl = await new Promise((resolve) => {
          reader.onload = (e) => {
            console.log('Logo processed, length:', e.target.result?.length);
            resolve(e.target.result);
          };
          reader.onerror = (error) => {
            console.error('Error processing logo:', error);
            resolve(null);
          };
          reader.readAsDataURL(logo);
        });
      }
      
      // Handle shop front image
      let shopFrontImageUrl = null;
      if (shopFrontImage) {
        console.log('Processing front image file...');
        const reader = new FileReader();
        shopFrontImageUrl = await new Promise((resolve) => {
          reader.onload = (e) => {
            console.log('Front image processed, length:', e.target.result?.length);
            resolve(e.target.result);
          };
          reader.onerror = (error) => {
            console.error('Error processing front image:', error);
            resolve(null);
          };
          reader.readAsDataURL(shopFrontImage);
        });
      }
      
      // Handle shop back image
      let shopBackImageUrl = null;
      if (shopBackImage) {
        console.log('Processing back image file...');
        const reader = new FileReader();
        shopBackImageUrl = await new Promise((resolve) => {
          reader.onload = (e) => {
            console.log('Back image processed, length:', e.target.result?.length);
            resolve(e.target.result);
          };
          reader.onerror = (error) => {
            console.error('Error processing back image:', error);
            resolve(null);
          };
          reader.readAsDataURL(shopBackImage);
        });
      }
      
      // Handle shop gallery images
      let shopGalleryUrls = [];
      if (shopGalleryImages.length > 0) {
        console.log('Processing gallery images...');
        for (let i = 0; i < shopGalleryImages.length; i++) {
          const reader = new FileReader();
          const imageUrl = await new Promise((resolve) => {
            reader.onload = (e) => {
              console.log(`Gallery image ${i + 1} processed, length:`, e.target.result?.length);
              resolve(e.target.result);
            };
            reader.onerror = (error) => {
              console.error(`Error processing gallery image ${i + 1}:`, error);
              resolve(null);
            };
            reader.readAsDataURL(shopGalleryImages[i]);
          });
          if (imageUrl) {
            shopGalleryUrls.push(imageUrl);
          }
        }
      }
      
      console.log('All images processed successfully');
      console.log('Logo URL length:', logoDataUrl?.length);
      console.log('Front image URL length:', shopFrontImageUrl?.length);
      console.log('Back image URL length:', shopBackImageUrl?.length);
      console.log('Gallery images count:', shopGalleryUrls.length);
      
      // Create new shop object
      const newShop = {
        id: Date.now().toString(),
        ...formData,
        logo: logoDataUrl,
        shopFrontImage: shopFrontImageUrl,
        shopBackImage: shopBackImageUrl,
        shopGalleryImages: shopGalleryUrls,
        ownerId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVerified: false,
        rating: 0,
        reviewCount: 0,
        products: []
      };
      
      // Save to localStorage
      const existingShops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
      existingShops.push(newShop);
      localStorage.setItem('registeredShops', JSON.stringify(existingShops));
      localStorage.setItem('currentShop', JSON.stringify(newShop));
      
      // Redirect to shop dashboard
      navigate(`/shop/${newShop.id}`);
      
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      <div className={`step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
        <span className="step-number">1</span>
        <span className="step-label">Basic Info</span>
      </div>
      <div className={`step ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
        <span className="step-number">2</span>
        <span className="step-label">Details</span>
      </div>
      <div className={`step ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}`}>
        <span className="step-number">3</span>
        <span className="step-label">Verification</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="step-content">
      <h2>Basic Shop Information</h2>
      <p>Let's start with the essential details about your shop.</p>
      
      <div className="form-grid">
        <div className="form-group">
          <label>Shop Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your shop name"
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
            <option value="">Select shop category</option>
            {shopCategories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>City *</label>
          <select
            name="city_id"
            value={formData.city_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Select your city</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
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
            value={formData.whatsapp}
            onChange={handleInputChange}
            placeholder="+251 9X XXX XXXX (optional)"
          />
        </div>
        
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="shop@example.com (optional)"
          />
        </div>
        
        <div className="form-group">
          <label>Operating Hours</label>
          <input
            type="text"
            name="operating_hours"
            value={formData.operating_hours}
            onChange={handleInputChange}
            placeholder="e.g., Mon-Fri 9AM-6PM, Sat 10AM-4PM"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="step-content">
      <h2>Shop Details</h2>
      <p>Tell customers more about your shop and what you offer.</p>
      
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Shop Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your shop, what electronics you specialize in, and why customers should choose you..."
            rows={4}
            required
          />
        </div>
        
        <div className="form-group full-width">
          <label>Physical Address *</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter your shop's physical address"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Shop Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'logo')}
          />
          {logoPreview && (
            <div className="image-preview">
              <img src={logoPreview} alt="Shop Logo" style={{maxWidth: '100px', maxHeight: '100px', objectFit: 'cover', borderRadius: '50%'}} />
            </div>
          )}
          <small>Upload your shop logo (optional)</small>
        </div>
        
        <div className="form-group">
          <label>Social Media Links</label>
          <input
            type="text"
            name="social_links"
            value={formData.social_links}
            onChange={handleInputChange}
            placeholder="Facebook, Instagram, etc. (optional)"
          />
        </div>
        
        <div className="form-group full-width">
          <label>Payment Methods *</label>
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
        
        <div className="form-group full-width">
          <label>Shop Images</label>
          <div className="image-upload-section">
            <div className="image-upload-grid">
              <div className="image-upload-item">
                <label>Shop Front Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'shopFront')}
                />
                {shopFrontPreview && (
                  <div className="image-preview">
                    <img src={shopFrontPreview} alt="Shop Front" style={{maxWidth: '200px', maxHeight: '200px', objectFit: 'cover'}} />
                  </div>
                )}
              </div>
              
              <div className="image-upload-item">
                <label>Shop Back Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'shopBack')}
                />
                {shopBackPreview && (
                  <div className="image-preview">
                    <img src={shopBackPreview} alt="Shop Back" style={{maxWidth: '200px', maxHeight: '200px', objectFit: 'cover'}} />
                  </div>
                )}
              </div>
            </div>
            
            <div className="image-upload-item">
              <label>Shop Gallery Images (Multiple)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e, 'shopGallery')}
              />
              {galleryPreviews.length > 0 && (
                <div className="gallery-preview">
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} className="gallery-image-preview">
                      <img src={preview} alt={`Gallery ${index + 1}`} style={{width: '100px', height: '100px', objectFit: 'cover'}} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <small>Upload images of your shop to attract more customers</small>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="step-content">
      <h2>Verification</h2>
      <p>Upload your business license to verify your shop and build trust with customers.</p>
      
      <div className="verification-info">
        <div className="info-card">
          <h3>Why Verification Matters</h3>
          <ul>
            <li>✅ Builds customer trust</li>
            <li>✅ Higher visibility in search results</li>
            <li>✅ Access to premium features</li>
            <li>✅ Verified badge on your shop</li>
          </ul>
        </div>
      </div>
      
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Business License *</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e, 'license')}
            required
          />
          <small>Upload your business license document (PDF, JPG, or PNG)</small>
        </div>
        
        <div className="form-group full-width">
          <label>Business License Number</label>
          <input
            type="text"
            name="business_license"
            value={formData.business_license}
            onChange={handleInputChange}
            placeholder="Enter your business license number"
          />
        </div>
      </div>
      
      <div className="terms-confirmation">
        <label className="checkbox-label">
          <input type="checkbox" required />
          <span>
            I confirm that all information provided is accurate and I have the legal right to operate this business in Ethiopia.
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="shop-registration">
      {/* Bold Red Back to Home Button */}
      <AdvancedGlobalNavigation
        showBackButton={true}
        backText="Go Back"
        theme="glassmorphism"
        size="medium"
        glassIntensity="medium"
        customBackAction={handleBackToHome}
      />
      
      <div className="registration-container">
        <div className="registration-header">
          <h1>Register Your Shop</h1>
          <p>Join Ethiopian Electronics and reach thousands of customers across Ethiopia</p>
        </div>
        
        {renderStepIndicator()}
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="registration-form">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          
          <div className="form-actions">
            {step > 1 && (
              <button type="button" className="prev-btn" onClick={handlePrevious}>
                Previous
              </button>
            )}
            
            {step < 3 ? (
              <button type="button" className="next-btn" onClick={handleNext}>
                Next
              </button>
            ) : (
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Registering Shop...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
            )}
          </div>
        </form>
        
        <div className="registration-footer">
          <p>
            Already have a shop? <button type="button" className="link-btn" onClick={() => navigate('/profile')}>
              View Your Profile
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShopRegistration;
