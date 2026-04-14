import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CitySearch.css';
import API from '../api';

const CitySearch = ({ user, onCitySelect }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [showAllCities, setShowAllCities] = useState(false);
  const [cityStats, setCityStats] = useState({});

  const ethiopianCities = [
    { id: 'addis_ababa', name: 'Addis Ababa', name_am: 'አዲስ አበባ', region: 'Addis Ababa', population: '5M+', shops: 0, products: 0 },
    { id: 'hawassa', name: 'Hawassa', name_am: 'ሀዋሳ', region: 'SNNPR', population: '400K+', shops: 0, products: 0 },
    { id: 'dilla', name: 'Dilla', name_am: 'ዲላ', region: 'SNNPR', population: '100K+', shops: 0, products: 0 },
    { id: 'hossana', name: 'Hossana', name_am: 'ሆሳዕና', region: 'SNNPR', population: '150K+', shops: 0, products: 0 },
    { id: 'bahirdar', name: 'Bahir Dar', name_am: 'ባህርዳር', region: 'Amhara', population: '400K+', shops: 0, products: 0 },
    { id: 'adama', name: 'Adama', name_am: 'አዳማ', region: 'Oromia', population: '350K+', shops: 0, products: 0 },
    { id: 'jimma', name: 'Jimma', name_am: 'ጅማ', region: 'Oromia', population: '200K+', shops: 0, products: 0 },
    { id: 'mekelle', name: 'Mekelle', name_am: 'መቀሌ', region: 'Tigray', population: '300K+', shops: 0, products: 0 },
    { id: 'arbaminch', name: 'Arba Minch', name_am: 'አርባ ምንጭ', region: 'SNNPR', population: '200K+', shops: 0, products: 0 },
    { id: 'gondar', name: 'Gondar', name_am: 'ጎንደር', region: 'Amhara', population: '150K+', shops: 0, products: 0 },
    { id: 'dire_dawa', name: 'Dire Dawa', name_am: 'ድሬ ዳዋ', region: 'Dire Dawa', population: '300K+', shops: 0, products: 0 },
    { id: 'shashamene', name: 'Shashamene', name_am: 'ሻሻሜኔ', region: 'Oromia', population: '200K+', shops: 0, products: 0 }
  ];

  const majorCities = ethiopianCities.slice(0, 6); // Top 6 major cities
  const allCities = ethiopianCities;

  useEffect(() => {
    fetchCityStats();
  }, []);

  const fetchCityStats = async () => {
    try {
      const response = await API.get('/cities/stats');
      setCityStats(response.data);
    } catch (error) {
      console.error('Error fetching city stats:', error);
    }
  };

  const filteredCities = (showAllCities ? allCities : majorCities).filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.name_am.includes(searchTerm) ||
    city.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    if (onCitySelect) {
      onCitySelect(city);
    }
  };

  const handleViewAllCities = () => {
    setShowAllCities(!showAllCities);
  };

  const handleViewAllProducts = () => {
    if (onCitySelect) {
      onCitySelect(null); // null means all cities
    }
  };

  const getCityWithStats = (city) => {
    const stats = cityStats[city.id] || { shops: 0, products: 0 };
    return { ...city, ...stats };
  };

  return (
    <div className="city-search">
      <div className="search-header">
        <h1>🇪🇹 Ethiopia Electronics Marketplace</h1>
        <p>Find electronics shops and products in your city</p>
      </div>

      <div className="search-container">
        <div className="search-bar">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for your city..."
              className="search-input"
            />
          </div>
        </div>

        <div className="view-options">
          <button 
            onClick={handleViewAllProducts}
            className="view-all-btn"
          >
            🌍 View All Products Nationwide
          </button>
          <button 
            onClick={handleViewAllCities}
            className="toggle-cities-btn"
          >
            {showAllCities ? '📍 Show Major Cities Only' : '🌍 Show All Cities'}
          </button>
        </div>
      </div>

      <div className="cities-container">
        {filteredCities.length === 0 ? (
          <div className="no-cities">
            <div className="no-cities-icon">🏙️</div>
            <h3>No cities found</h3>
            <p>Try searching with different keywords</p>
          </div>
        ) : (
          <div className="cities-grid">
            {filteredCities.map(city => {
              const cityWithStats = getCityWithStats(city);
              return (
                <div
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                  className={`city-card ${selectedCity?.id === city.id ? 'selected' : ''}`}
                >
                  <div className="city-header">
                    <div className="city-info">
                      <h3>{city.name}</h3>
                      <p>{city.name_am}</p>
                      <span className="city-region">{city.region}</span>
                    </div>
                    <div className="city-icon">🏙️</div>
                  </div>
                  
                  <div className="city-stats">
                    <div className="stat-item">
                      <span className="stat-number">{cityWithStats.shops}</span>
                      <span className="stat-label">Shops</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{cityWithStats.products}</span>
                      <span className="stat-label">Products</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{city.population}</span>
                      <span className="stat-label">Population</span>
                    </div>
                  </div>
                  
                  <div className="city-footer">
                    <span className="shop-count">
                      {cityWithStats.shops > 0 ? 
                        `${cityWithStats.shops} shops available` : 
                        'No shops yet'
                      }
                    </span>
                    <span className="arrow">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedCity && (
        <div className="selected-city-info">
          <div className="selected-city-header">
            <h2>📍 Selected: {selectedCity.name}</h2>
            <button onClick={() => setSelectedCity(null)} className="change-city-btn">
              🔄 Change City
            </button>
          </div>
          <div className="selected-city-details">
            <p>Browsing electronics in {selectedCity.name}, {selectedCity.region}</p>
            <p>Showing shops and products available in this location</p>
          </div>
        </div>
      )}

      <div className="popular-searches">
        <h3>🔥 Popular Searches</h3>
        <div className="popular-searches-grid">
          <button className="popular-search-btn">
            📱 Phones in Addis Ababa
          </button>
          <button className="popular-search-btn">
            💻 Laptops in Hawassa
          </button>
          <button className="popular-search-btn">
            ⌚ Smart Watches in Dilla
          </button>
          <button className="popular-search-btn">
            🎧 Audio in Bahir Dar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitySearch;
