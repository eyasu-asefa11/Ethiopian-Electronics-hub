import React, { useState, useEffect } from 'react';
import './MultiLanguage.css';

const MultiLanguage = ({ currentLanguage, onLanguageChange }) => {
  const [language, setLanguage] = useState(currentLanguage || 'en');
  const [translations, setTranslations] = useState({});

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'am', name: 'Amharic', flag: '🇪🇹' }
  ];

  const translationsData = {
    en: {
      // Navigation
      home: 'Home',
      products: 'Products',
      shops: 'Shops',
      about: 'About',
      contact: 'Contact',
      
      // Common
      search: 'Search',
      filter: 'Filter',
      compare: 'Compare',
      save: 'Save',
      contact: 'Contact',
      price: 'Price',
      available: 'Available',
      out_of_stock: 'Out of Stock',
      
      // Categories
      phones: 'Phones',
      tablets: 'Tablets',
      laptops: 'Laptops',
      accessories: 'Accessories',
      smart_watches: 'Smart Watches',
      cameras: 'Cameras',
      gaming: 'Gaming',
      audio: 'Audio',
      
      // Shop
      shop: 'Shop',
      verified_shop: 'Verified Shop',
      opening_hours: 'Opening Hours',
      address: 'Address',
      phone: 'Phone',
      whatsapp: 'WhatsApp',
      
      // User actions
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      profile: 'Profile',
      dashboard: 'Dashboard',
      
      // Messages
      send_message: 'Send Message',
      message_sent: 'Message sent successfully',
      
      // Welcome
      welcome: 'Welcome to Ethiopia Electronics Marketplace',
      find_electronics: 'Find electronics shops and products near you'
    },
    am: {
      // Navigation
      home: 'ቤት',
      products: 'ምርቶች',
      shops: 'ሱቅሎች',
      about: 'ስለ እኛ',
      contact: 'እውክት',
      
      // Common
      search: 'ፈልግ',
      filter: 'አጣራ',
      compare: 'አነጋገር',
      save: 'አስቀምጥ',
      price: 'ዋጋ',
      available: 'ይገኛል',
      out_of_stock: 'ከልክል',
      
      // Categories
      phones: 'ስልኮች',
      tablets: 'ታብሌቶች',
      laptops: 'ላፕቶፖች',
      accessories: 'ክለሎች',
      smart_watches: 'ዘመናዊ ሰዓቶች',
      cameras: 'ካሜራዎች',
      gaming: 'ጨዋታ',
      audio: 'ድምፅ',
      
      // Shop
      shop: 'ሱቅል',
      verified_shop: 'የተረጋገጠ ሱቅል',
      opening_hours: 'የመክፈቻ ሰዓታት',
      address: 'አድራስ',
      phone: 'ስልክ',
      whatsapp: 'ዋትስአፕ',
      
      // User actions
      login: 'ይግቡ',
      register: 'ይመዝገቡ',
      logout: 'ይውጡ',
      profile: 'መገለጽልሌ',
      dashboard: 'ዳሽቦርድ',
      
      // Messages
      send_message: 'መልእክት ይላኩ',
      message_sent: 'መልእክት ተላከ',
      
      // Welcome
      welcome: 'እንኳን ወደ ዲላ ኤሌክትሮኒክስ ገበባ በደረሳችሁ',
      find_electronics: 'ኤሌክትሮኒክስ ሱቅሎችና ምርቶች በአቅርይዎ ያግኙ'
    }
  };

  useEffect(() => {
    setTranslations(translationsData[language]);
  }, [language]);

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setTranslations(translationsData[langCode]);
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
    // Store preference in localStorage
    localStorage.setItem('preferredLanguage', langCode);
  };

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && savedLanguage !== language) {
      handleLanguageChange(savedLanguage);
    }
  }, []);

  const translate = (key) => {
    return translations[key] || key;
  };

  // Make translate function available globally
  useEffect(() => {
    window.t = translate;
  }, [translations]);

  return (
    <div className="multi-language">
      <div className="language-selector">
        <div className="language-dropdown">
          <button className="language-toggle">
            {languages.find(lang => lang.code === language)?.flag} {' '}
            {languages.find(lang => lang.code === language)?.name}
            <span className="dropdown-arrow">▼</span>
          </button>
          
          <div className="language-options">
            {languages.map(lang => (
              <button
                key={lang.code}
                className={`language-option ${lang.code === language ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <span className="flag">{lang.flag}</span>
                <span className="name">{lang.name}</span>
                {lang.code === language && <span className="check">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Export translation function for use in other components
export const useTranslation = () => {
  const [translations, setTranslations] = React.useState({});
  const [language, setLanguage] = React.useState('en');

  const translationsData = {
    en: translationsData.en,
    am: translationsData.am
  };

  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(savedLanguage);
    setTranslations(translationsData[savedLanguage]);
  }, []);

  const translate = (key) => {
    return translations[key] || key;
  };

  return { translate, language, setLanguage };
};

export default MultiLanguage;
