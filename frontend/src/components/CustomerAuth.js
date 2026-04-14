import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerAuth.css';
import API from '../api';

const CustomerAuth = ({ language = 'am' }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    subCity: '',
    kebele: '',
    houseNumber: '',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const translations = {
    en: {
      login: 'Login',
      register: 'Register',
      welcome: 'Welcome to Ethiopian Electronics',
      loginSubtitle: 'Sign in to your account',
      registerSubtitle: 'Create your account',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone Number',
      city: 'City',
      subCity: 'Sub-City',
      kebele: 'Kebele',
      houseNumber: 'House Number',
      agreeToTerms: 'I agree to the Terms and Conditions',
      haveAccount: 'Already have an account?',
      noAccount: "Don't have an account?",
      forgotPassword: 'Forgot Password?',
      loginBtn: 'Sign In',
      registerBtn: 'Create Account',
      orContinue: 'Or continue with',
      success: 'Registration successful!',
      loginSuccess: 'Login successful!',
      error: 'An error occurred. Please try again.',
      weakPassword: 'Password must be at least 8 characters',
      passwordsNotMatch: 'Passwords do not match',
      invalidEmail: 'Please enter a valid email',
      required: 'This field is required'
    },
    am: {
      login: 'ይግቡ',
      register: 'ይመዝገቡ',
      welcome: 'እንኳን ደርሳችሁ ወደ ዲላ ኤሌክትሮኒክስ',
      loginSubtitle: 'ወደ አካውንትዎ ይግቡ',
      registerSubtitle: 'አካውንትዎን ይፍጠሩ',
      email: 'ኢሜይል አድራስ',
      password: 'የይለፍ ቃል',
      confirmPassword: 'የይለፍ ቃል ያረጋግጡ',
      firstName: 'ስም',
      lastName: 'የአባት ስም',
      phone: 'የስልክ ቁጥር',
      city: 'ከተማ',
      subCity: 'ንፍቀት ከተማ',
      kebele: 'ቀበለ',
      houseNumber: 'የቤት ቁጥር',
      agreeToTerms: 'የአገልግሎት ውልውጥና መመሪያዎችን እቀበላለሁ',
      haveAccount: 'አካውንት አለዎት?',
      noAccount: 'አካውንት የለዎትም?',
      forgotPassword: 'የይለፍ ቃል ረሳደዎት?',
      loginBtn: 'ይግቡ',
      registerBtn: 'አካውንት ይፍጠሩ',
      orContinue: 'ወይም በዚህ ይቀጥሉ',
      success: 'ምዝገባው በተሳካ ሁኔታ ተጠናቋል!',
      loginSuccess: 'መግባው በተሳካ ሁኔታ ተከናወነ!',
      error: 'ስህተት ተፈጥሯል። እባኮትን ይሞክሩ።',
      weakPassword: 'የይለፍ ቃል ቢያንሱ 8 ፊደል መሆን አለበት',
      passwordsNotMatch: 'የይለፍ ቃሎች አይዛመዱም',
      invalidEmail: 'እርስት ኢሜይል ያስገቡ',
      required: 'ይህዋ መሞላት አለበት'
    }
  };

  const t = translations[language];

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('customerToken');
    if (token) {
      navigate('/customer-dashboard');
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = t.required;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.invalidEmail;
    }

    if (!formData.password) {
      newErrors.password = t.required;
    } else if (formData.password.length < 8) {
      newErrors.password = t.weakPassword;
    }

    if (!isLogin) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = t.required;
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = t.required;
      }
      if (!formData.phone.trim()) {
        newErrors.phone = t.required;
      }
      if (!formData.city) {
        newErrors.city = t.required;
      }
      if (!formData.subCity) {
        newErrors.subCity = t.required;
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = t.required;
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t.passwordsNotMatch;
      }
      if (!formData.agreeToTerms) {
        newErrors.terms = 'You must agree to the terms and conditions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      if (isLogin) {
        // Login
        const response = await API.post('/auth/customer/login', {
          email: formData.email,
          password: formData.password
        });
        
        localStorage.setItem('customerToken', response.data.token);
        localStorage.setItem('customerUser', JSON.stringify(response.data.user));
        
        alert(t.loginSuccess);
        navigate('/customer-dashboard');
        
      } else {
        // Register
        const response = await API.post('/auth/customer/register', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          address: {
            city: formData.city,
            subCity: formData.subCity,
            kebele: formData.kebele,
            houseNumber: formData.houseNumber
          }
        });
        
        alert(t.success);
        setIsLogin(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          city: '',
          subCity: '',
          kebele: '',
          houseNumber: '',
          agreeToTerms: false
        });
      }
      
    } catch (error) {
      console.error('Auth error:', error);
      alert(t.error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      city: '',
      subCity: '',
      kebele: '',
      houseNumber: '',
      agreeToTerms: false
    });
  };

  const renderLoginForm = () => (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label>{t.email}</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={errors.email ? 'error' : ''}
          placeholder="your@email.com"
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label>{t.password}</label>
        <div className="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={errors.password ? 'error' : ''}
            placeholder="Enter your password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        {errors.password && <span className="error-message">{errors.password}</span>}
      </div>

      <div className="form-options">
        <label className="checkbox-label">
          <input type="checkbox" />
          <span>Remember me</span>
        </label>
        <button type="button" className="forgot-password">
          {t.forgotPassword}
        </button>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Please wait...' : t.loginBtn}
      </button>

      <div className="divider">
        <span>{t.orContinue}</span>
      </div>

      <div className="social-login">
        <button type="button" className="btn btn-social google">
          <span className="social-icon">📧</span>
          Continue with Google
        </button>
        <button type="button" className="btn btn-social facebook">
          <span className="social-icon">📘</span>
          Continue with Facebook
        </button>
      </div>
    </form>
  );

  const renderRegisterForm = () => (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-row">
        <div className="form-group">
          <label>{t.firstName}</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={errors.firstName ? 'error' : ''}
            placeholder="Enter your first name"
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
            placeholder="Enter your last name"
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>{t.email}</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={errors.email ? 'error' : ''}
          placeholder="your@email.com"
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
          placeholder="09XX XXX XXX"
        />
        {errors.phone && <span className="error-message">{errors.phone}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>{t.password}</label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={errors.password ? 'error' : ''}
              placeholder="Create a strong password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>{t.confirmPassword}</label>
          <div className="password-input">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>
      </div>

      <div className="address-section">
        <h3>Address Information</h3>
        <div className="form-row">
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
              placeholder="Enter sub-city"
            />
            {errors.subCity && <span className="error-message">{errors.subCity}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>{t.kebele}</label>
            <input
              type="text"
              value={formData.kebele}
              onChange={(e) => handleInputChange('kebele', e.target.value)}
              placeholder="Enter kebele"
            />
          </div>

          <div className="form-group">
            <label>{t.houseNumber}</label>
            <input
              type="text"
              value={formData.houseNumber}
              onChange={(e) => handleInputChange('houseNumber', e.target.value)}
              placeholder="Enter house number"
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
          />
          <span>{t.agreeToTerms}</span>
        </label>
        {errors.terms && <span className="error-message">{errors.terms}</span>}
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Please wait...' : t.registerBtn}
      </button>

      <div className="divider">
        <span>{t.orContinue}</span>
      </div>

      <div className="social-login">
        <button type="button" className="btn btn-social google">
          <span className="social-icon">📧</span>
          Continue with Google
        </button>
        <button type="button" className="btn btn-social facebook">
          <span className="social-icon">📘</span>
          Continue with Facebook
        </button>
      </div>
    </form>
  );

  return (
    <div className="customer-auth">
      <div className="auth-container">
        <div className="auth-header">
          <h1>{t.welcome}</h1>
          <p>{isLogin ? t.loginSubtitle : t.registerSubtitle}</p>
        </div>

        <div className="auth-content">
          <div className="auth-form-container">
            {isLogin ? renderLoginForm() : renderRegisterForm()}
          </div>

          <div className="auth-toggle">
            <p>
              {isLogin ? t.noAccount : t.haveAccount}
              <button type="button" onClick={toggleMode} className="toggle-btn">
                {isLogin ? t.register : t.login}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAuth;
