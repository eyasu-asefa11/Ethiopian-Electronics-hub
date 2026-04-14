import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';
import API from '../api';

const Checkout = ({ language = 'am' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, discount } = location.state || { cart: [], discount: 0 };

  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    subCity: '',
    kebele: '',
    houseNumber: '',
    landmark: '',
    
    // Delivery Options
    deliveryMethod: 'standard',
    deliveryDate: '',
    deliveryTime: '',
    
    // Payment Information
    paymentMethod: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
    bankAccount: '',
    telebirrNumber: '',
    
    // Order Notes
    orderNotes: '',
    
    // Terms
    agreeToTerms: false,
    agreeToPrivacy: false
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const translations = {
    en: {
      title: 'Checkout',
      shipping: 'Shipping Information',
      delivery: 'Delivery Options',
      payment: 'Payment Method',
      review: 'Review Order',
      placeOrder: 'Place Order',
      back: 'Back',
      next: 'Next',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      city: 'City',
      subCity: 'Sub-City',
      kebele: 'Kebele',
      houseNumber: 'House Number',
      landmark: 'Landmark',
      deliveryMethod: 'Delivery Method',
      standard: 'Standard Delivery (3-5 days)',
      express: 'Express Delivery (1-2 days)',
      sameDay: 'Same Day Delivery',
      deliveryDate: 'Delivery Date',
      deliveryTime: 'Delivery Time',
      morning: 'Morning (9AM - 12PM)',
      afternoon: 'Afternoon (12PM - 5PM)',
      evening: 'Evening (5PM - 8PM)',
      paymentMethod: 'Payment Method',
      telebirr: 'Telebirr',
      cbeBirr: 'CBE Birr',
      bankTransfer: 'Bank Transfer',
      cashOnDelivery: 'Cash on Delivery',
      cardPayment: 'Card Payment',
      cardNumber: 'Card Number',
      cardName: 'Name on Card',
      cardExpiry: 'Expiry Date',
      cardCVV: 'CVV',
      bankAccount: 'Bank Account Number',
      telebirrNumber: 'Telebirr Number',
      orderNotes: 'Order Notes',
      agreeToTerms: 'I agree to the Terms and Conditions',
      agreeToPrivacy: 'I agree to the Privacy Policy',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      discount: 'Discount',
      shipping: 'Shipping',
      tax: 'Tax',
      total: 'Total',
      processingOrder: 'Processing your order...',
      orderSuccess: 'Order placed successfully!',
      orderNumber: 'Order Number',
      emailConfirmation: 'You will receive an email confirmation shortly.',
      continueShopping: 'Continue Shopping',
      viewOrders: 'View Orders'
    },
    am: {
      title: 'የመግዢ ሂደት',
      shipping: 'የመላክ መረጃ',
      delivery: 'የመድረሻ ምርጫዎች',
      payment: 'የክፍያ ዘዴ',
      review: 'ትዕዛዛ መግምገማ',
      placeOrder: 'ትዕዛዛ ይስጡ',
      back: 'ወደ ኋላ',
      next: 'ወደ ፊት',
      firstName: 'ስም',
      lastName: 'የአባት ስም',
      email: 'ኢሜይል አድራስ',
      phone: 'የስልክ ቁጥር',
      city: 'ከተማ',
      subCity: 'ንፍቀት ከተማ',
      kebele: 'ቀበለ',
      houseNumber: 'የቤት ቁጥር',
      landmark: 'አስርዮ',
      deliveryMethod: 'የመድረሻ ዘዴ',
      standard: 'መደበኛ መድረሻ (3-5 ቀናት)',
      express: 'ፈጣን መድረሻ (1-2 ቀናት)',
      sameDay: 'በዚያው ቀን መድረሻ',
      deliveryDate: 'የመድረሻ ቀን',
      deliveryTime: 'የመድረሻ ጊዜ',
      morning: 'ጠዋት (9ሰዓ - 12ሰዓ)',
      afternoon: 'ከሰዓት (12ሰዓ - 5ሰዓ)',
      evening: 'ምሽት (5ሰዓ - 8ሰዓ)',
      paymentMethod: 'የክፍያ ዘዴ',
      telebirr: 'ቴለብር',
      cbeBirr: 'ሲቢኢ ብር',
      bankTransfer: 'የባንክ ዝውውር',
      cashOnDelivery: 'በመድረሻ ጊዜ ክፍያ',
      cardPayment: 'በካርድ ክፍያ',
      cardNumber: 'የካርድ ቁጥር',
      cardName: 'ስም በካርድ ላይ',
      cardExpiry: 'የመጨረሻ ቀን',
      cardCVV: 'ሲቪቪ',
      bankAccount: 'የባንክ መለያ ቁጥር',
      telebirrNumber: 'የቴለብር ቁጥር',
      orderNotes: 'የትዕዛዛ ማስታወሻዎች',
      agreeToTerms: 'የአገልግሎት ውልውጥና መመሪያዎችን እቀበላለሁ',
      agreeToPrivacy: 'የግላጭነት ፖሊሲን እቀበላለሁ',
      orderSummary: 'የትዕዛዛ ማጠቃለያ',
      subtotal: 'ንዑስ ድምር',
      discount: 'ቅናሽ',
      shipping: 'የመላክ ክፍያ',
      tax: 'ታክስ',
      total: 'ዋጋ ድምር',
      processingOrder: 'ትዕዛዛዎን በማስኬድ ላይ...',
      orderSuccess: 'ትዕዛዛ በተሳካ ሁኔታ ተሰጠ!',
      orderNumber: 'የትዕዛዛ ቁጥር',
      emailConfirmation: 'በቅርብ የኢሜይል ማረጋገጫ ያገኛሉ።',
      continueShopping: 'ግዢን ቀጥል',
      viewOrders: 'ትዕዛዛዎችን ይመልከቱ'
    }
  };

  const t = translations[language];

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    if (formData.deliveryMethod === 'express') return 100;
    if (formData.deliveryMethod === 'sameDay') return 150;
    return subtotal > 1000 ? 0 : 50; // Free shipping over 1000 ETB
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.15; // 15% VAT
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    const tax = calculateTax();
    const discountAmount = subtotal * discount;
    return subtotal + shipping + tax - discountAmount;
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.subCity) newErrors.subCity = 'Sub-city is required';
    }

    if (step === 2) {
      if (!formData.deliveryMethod) newErrors.deliveryMethod = 'Delivery method is required';
      if (!formData.deliveryDate) newErrors.deliveryDate = 'Delivery date is required';
      if (!formData.deliveryTime) newErrors.deliveryTime = 'Delivery time is required';
    }

    if (step === 3) {
      if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
      
      if (formData.paymentMethod === 'card') {
        if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
        if (!formData.cardName.trim()) newErrors.cardName = 'Name on card is required';
        if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry date is required';
        if (!formData.cardCVV.trim()) newErrors.cardCVV = 'CVV is required';
      }
      
      if (formData.paymentMethod === 'telebirr') {
        if (!formData.telebirrNumber.trim()) newErrors.telebirrNumber = 'Telebirr number is required';
      }
      
      if (formData.paymentMethod === 'bank') {
        if (!formData.bankAccount.trim()) newErrors.bankAccount = 'Bank account is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    if (!formData.agreeToTerms) {
      setErrors({ terms: 'You must agree to the terms and conditions' });
      return;
    }

    setLoading(true);
    
    try {
      const orderData = {
        items: cart,
        shipping: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: {
            city: formData.city,
            subCity: formData.subCity,
            kebele: formData.kebele,
            houseNumber: formData.houseNumber,
            landmark: formData.landmark
          }
        },
        delivery: {
          method: formData.deliveryMethod,
          date: formData.deliveryDate,
          time: formData.deliveryTime
        },
        payment: {
          method: formData.paymentMethod,
          // Add payment details based on method
        },
        pricing: {
          subtotal: calculateSubtotal(),
          shipping: calculateShipping(),
          tax: calculateTax(),
          discount: calculateSubtotal() * discount,
          total: calculateTotal()
        },
        notes: formData.orderNotes,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Save order to backend
      const response = await API.post('/orders', orderData);
      
      // Clear cart
      localStorage.removeItem('shoppingCart');
      
      // Redirect to success page
      navigate('/order-success', { 
        state: { 
          order: response.data,
          orderNumber: response.data.orderNumber 
        } 
      });
      
    } catch (error) {
      console.error('Order submission error:', error);
      setErrors({ submit: 'Failed to place order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderShippingForm = () => (
    <div className="checkout-section">
      <h2>{t.shipping}</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>{t.firstName}</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={errors.firstName ? 'error' : ''}
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label>{t.lastName}</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={errors.lastName ? 'error' : ''}
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <label>{t.email}</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>{t.phone}</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label>{t.city}</label>
          <select
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={errors.city ? 'error' : ''}
          >
            <option value="">Select City</option>
            <option value="addis-ababa">Addis Ababa</option>
            <option value="dilla">Dilla</option>
            <option value="hawassa">Hawassa</option>
            <option value="mekelle">Mekelle</option>
            <option value="bahirdar">Bahir Dar</option>
            <option value="gondar">Gondar</option>
            <option value="dire-dawa">Dire Dawa</option>
          </select>
          {errors.city && <span className="error-message">{errors.city}</span>}
        </div>

        <div className="form-group">
          <label>{t.subCity}</label>
          <input
            type="text"
            value={formData.subCity}
            onChange={(e) => handleInputChange('subCity', e.target.value)}
            className={errors.subCity ? 'error' : ''}
          />
          {errors.subCity && <span className="error-message">{errors.subCity}</span>}
        </div>

        <div className="form-group">
          <label>{t.kebele}</label>
          <input
            type="text"
            value={formData.kebele}
            onChange={(e) => handleInputChange('kebele', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>{t.houseNumber}</label>
          <input
            type="text"
            value={formData.houseNumber}
            onChange={(e) => handleInputChange('houseNumber', e.target.value)}
          />
        </div>

        <div className="form-group full-width">
          <label>{t.landmark}</label>
          <input
            type="text"
            value={formData.landmark}
            onChange={(e) => handleInputChange('landmark', e.target.value)}
            placeholder="e.g., Near Meskel Square, Behind Edna Mall"
          />
        </div>
      </div>
    </div>
  );

  const renderDeliveryForm = () => (
    <div className="checkout-section">
      <h2>{t.delivery}</h2>
      
      <div className="delivery-options">
        <div className="option-card">
          <input
            type="radio"
            id="standard"
            name="deliveryMethod"
            value="standard"
            checked={formData.deliveryMethod === 'standard'}
            onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
          />
          <label htmlFor="standard">
            <div className="option-content">
              <h3>{t.standard}</h3>
              <p>ETB 50</p>
            </div>
          </label>
        </div>

        <div className="option-card">
          <input
            type="radio"
            id="express"
            name="deliveryMethod"
            value="express"
            checked={formData.deliveryMethod === 'express'}
            onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
          />
          <label htmlFor="express">
            <div className="option-content">
              <h3>{t.express}</h3>
              <p>ETB 100</p>
            </div>
          </label>
        </div>

        <div className="option-card">
          <input
            type="radio"
            id="sameDay"
            name="deliveryMethod"
            value="sameDay"
            checked={formData.deliveryMethod === 'sameDay'}
            onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
          />
          <label htmlFor="sameDay">
            <div className="option-content">
              <h3>{t.sameDay}</h3>
              <p>ETB 150</p>
            </div>
          </label>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>{t.deliveryDate}</label>
          <input
            type="date"
            value={formData.deliveryDate}
            onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className={errors.deliveryDate ? 'error' : ''}
          />
          {errors.deliveryDate && <span className="error-message">{errors.deliveryDate}</span>}
        </div>

        <div className="form-group">
          <label>{t.deliveryTime}</label>
          <select
            value={formData.deliveryTime}
            onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
            className={errors.deliveryTime ? 'error' : ''}
          >
            <option value="">Select Time</option>
            <option value="morning">{t.morning}</option>
            <option value="afternoon">{t.afternoon}</option>
            <option value="evening">{t.evening}</option>
          </select>
          {errors.deliveryTime && <span className="error-message">{errors.deliveryTime}</span>}
        </div>
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="checkout-section">
      <h2>{t.payment}</h2>
      
      <div className="payment-options">
        <div className="option-card">
          <input
            type="radio"
            id="telebirr"
            name="paymentMethod"
            value="telebirr"
            checked={formData.paymentMethod === 'telebirr'}
            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
          />
          <label htmlFor="telebirr">
            <div className="option-content">
              <div className="payment-icon">📱</div>
              <h3>{t.telebirr}</h3>
              <p>Pay with Telebirr mobile money</p>
            </div>
          </label>
        </div>

        <div className="option-card">
          <input
            type="radio"
            id="cbe-birr"
            name="paymentMethod"
            value="cbe-birr"
            checked={formData.paymentMethod === 'cbe-birr'}
            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
          />
          <label htmlFor="cbe-birr">
            <div className="option-content">
              <div className="payment-icon">🏦</div>
              <h3>{t.cbeBirr}</h3>
              <p>Pay with CBE Birr mobile banking</p>
            </div>
          </label>
        </div>

        <div className="option-card">
          <input
            type="radio"
            id="bank-transfer"
            name="paymentMethod"
            value="bank-transfer"
            checked={formData.paymentMethod === 'bank-transfer'}
            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
          />
          <label htmlFor="bank-transfer">
            <div className="option-content">
              <div className="payment-icon">🏛️</div>
              <h3>{t.bankTransfer}</h3>
              <p>Direct bank transfer</p>
            </div>
          </label>
        </div>

        <div className="option-card">
          <input
            type="radio"
            id="cash-on-delivery"
            name="paymentMethod"
            value="cash-on-delivery"
            checked={formData.paymentMethod === 'cash-on-delivery'}
            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
          />
          <label htmlFor="cash-on-delivery">
            <div className="option-content">
              <div className="payment-icon">💵</div>
              <h3>{t.cashOnDelivery}</h3>
              <p>Pay when you receive your order</p>
            </div>
          </label>
        </div>
      </div>

      {formData.paymentMethod === 'telebirr' && (
        <div className="payment-details">
          <div className="form-group">
            <label>{t.telebirrNumber}</label>
            <input
              type="tel"
              value={formData.telebirrNumber}
              onChange={(e) => handleInputChange('telebirrNumber', e.target.value)}
              placeholder="09XX XXX XXX"
              className={errors.telebirrNumber ? 'error' : ''}
            />
            {errors.telebirrNumber && <span className="error-message">{errors.telebirrNumber}</span>}
          </div>
        </div>
      )}

      {formData.paymentMethod === 'cbe-birr' && (
        <div className="payment-details">
          <div className="form-group">
            <label>{t.telebirrNumber}</label>
            <input
              type="tel"
              value={formData.telebirrNumber}
              onChange={(e) => handleInputChange('telebirrNumber', e.target.value)}
              placeholder="09XX XXX XXX"
            />
          </div>
        </div>
      )}

      {formData.paymentMethod === 'bank-transfer' && (
        <div className="payment-details">
          <div className="form-group">
            <label>{t.bankAccount}</label>
            <input
              type="text"
              value={formData.bankAccount}
              onChange={(e) => handleInputChange('bankAccount', e.target.value)}
              className={errors.bankAccount ? 'error' : ''}
            />
            {errors.bankAccount && <span className="error-message">{errors.bankAccount}</span>}
          </div>
        </div>
      )}

      <div className="form-group full-width">
        <label>{t.orderNotes}</label>
        <textarea
          value={formData.orderNotes}
          onChange={(e) => handleInputChange('orderNotes', e.target.value)}
          rows="3"
          placeholder="Special instructions for your order..."
        />
      </div>
    </div>
  );

  const renderOrderReview = () => (
    <div className="checkout-section">
      <h2>{t.review}</h2>
      
      <div className="order-review">
        <div className="review-section">
          <h3>Order Items</h3>
          {cart.map(item => (
            <div key={item.id} className="review-item">
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>Quantity: {item.quantity} × ETB {item.price}</p>
              </div>
              <div className="item-total">ETB {(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="review-section">
          <h3>Shipping Address</h3>
          <p>
            {formData.firstName} {formData.lastName}<br />
            {formData.phone}<br />
            {formData.email}<br />
            {formData.city}, {formData.subCity}<br />
            {formData.kebele}, {formData.houseNumber}<br />
            {formData.landmark}
          </p>
        </div>

        <div className="review-section">
          <h3>Delivery & Payment</h3>
          <p>
            <strong>Delivery:</strong> {formData.deliveryMethod}<br />
            <strong>Date:</strong> {formData.deliveryDate}<br />
            <strong>Time:</strong> {formData.deliveryTime}<br />
            <strong>Payment:</strong> {formData.paymentMethod}
          </p>
        </div>

        <div className="review-section">
          <h3>{t.orderSummary}</h3>
          <div className="summary-row">
            <span>{t.subtotal}</span>
            <span>ETB {calculateSubtotal().toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="summary-row discount">
              <span>{t.discount}</span>
              <span>-ETB {(calculateSubtotal() * discount).toFixed(2)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>{t.shipping}</span>
            <span>ETB {calculateShipping().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>{t.tax}</span>
            <span>ETB {calculateTax().toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>{t.total}</span>
            <span>ETB {calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        <div className="terms-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
            />
            <span>{t.agreeToTerms}</span>
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.agreeToPrivacy}
              onChange={(e) => handleInputChange('agreeToPrivacy', e.target.checked)}
            />
            <span>{t.agreeToPrivacy}</span>
          </label>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="checkout-loading">
        <div className="spinner"></div>
        <p>{t.processingOrder}</p>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="checkout-header">
        <h1>{t.title}</h1>
        <div className="progress-bar">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-title">{t.shipping}</span>
          </div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-title">{t.delivery}</span>
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-title">{t.payment}</span>
          </div>
          <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-title">{t.review}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        {currentStep === 1 && renderShippingForm()}
        {currentStep === 2 && renderDeliveryForm()}
        {currentStep === 3 && renderPaymentForm()}
        {currentStep === 4 && renderOrderReview()}

        <div className="checkout-actions">
          {currentStep > 1 && (
            <button type="button" onClick={handleBack} className="btn btn-outline">
              {t.back}
            </button>
          )}
          
          {currentStep < 4 && (
            <button type="button" onClick={handleNext} className="btn btn-primary">
              {t.next}
            </button>
          )}
          
          {currentStep === 4 && (
            <button type="submit" className="btn btn-success" disabled={loading}>
              {t.placeOrder}
            </button>
          )}
        </div>

        {errors.submit && (
          <div className="error-message global">{errors.submit}</div>
        )}
      </form>
    </div>
  );
};

export default Checkout;
