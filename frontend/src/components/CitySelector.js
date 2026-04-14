import React, { useState, useEffect, useRef } from 'react';
import './CitySelector.css';

const CitySelector = ({ selectedCity, onCityChange, showAllOption = false }) => {
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cityShopCounts, setCityShopCounts] = useState({});
  const dropdownRef = useRef(null);

  // Ethiopian cities with initial counts
  const ethiopianCities = [
    { id: 1, name: 'Addis Abeba', name_am: 'አዲስ አበባ' },
    { id: 2, name: 'Dire Dawa', name_am: 'ድሬ ዳዋ' },
    { id: 3, name: 'Mekelle', name_am: 'መቀሌ' },
    { id: 4, name: 'Gondar', name_am: 'ጎንደር' },
    { id: 5, name: 'Bahir Dar', name_am: 'ባህር ዳር' },
    { id: 6, name: 'Hawassa', name_am: 'ሀዋሳ' },
    { id: 7, name: 'Jimma', name_am: 'ጂማ' },
    { id: 8, name: 'Jijiga', name_am: 'ጅጅጋ' },
    { id: 9, name: 'Dilla', name_am: 'ዲላ' },
    { id: 10, name: 'Adama', name_am: 'አዳማ' },
    { id: 11, name: 'Shashamane', name_am: 'ሻሸመኔ' },
    { id: 12, name: 'Arba Minch', name_am: 'አርባ ምኒጭ' },
    { id: 13, name: 'Debre Berhan', name_am: 'ደብረ ብርሃን' },
    { id: 14, name: 'Wolaita Sodo', name_am: 'ወላይታ ሶዶ' },
    { id: 15, name: 'Hossana', name_am: 'ሆሳና' }
  ];

  useEffect(() => {
    // Load cities and shop counts
    loadCitiesAndCounts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadCitiesAndCounts = () => {
    console.log('=== LOADING CITIES ===');
    
    // Load registered shops from localStorage
    let shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
    console.log('Loaded shops:', shops);
    
    // Add sample shops for testing if no shops exist
    if (shops.length === 0) {
      console.log('No shops found, adding sample shops');
      shops = [
        {
          id: '1',
          name: 'Ethiopian Electronics Center',
          city: 'Dilla',
          phone: '0912345678'
        },
        {
          id: '2', 
          name: 'Addis Electronics Store',
          city: 'Addis Abeba',
          phone: '0912345679'
        },
        {
          id: '3',
          name: 'Hossana Tech Shop', 
          city: 'Hossana',
          phone: '0912345680'
        }
      ];
      // Save sample shops to localStorage
      localStorage.setItem('registeredShops', JSON.stringify(shops));
      console.log('Sample shops saved:', shops);
    }
    
    // Calculate shop counts by city
    const counts = {};
    shops.forEach(shop => {
      if (shop.city) {
        counts[shop.city] = (counts[shop.city] || 0) + 1;
      }
    });
    console.log('City counts calculated:', counts);
    
    // Only include cities that have registered shops
    const citiesWithShops = ethiopianCities
      .filter(city => counts[city.name] > 0)  // Only cities with shops
      .map(city => ({
        ...city,
        shopCount: counts[city.name] || 0
      }));
    
    console.log('Cities with shops loaded:', citiesWithShops);
    console.log('====================');
    setCities(citiesWithShops);
    setCityShopCounts(counts);
  };

  const filteredCities = searchTerm.trim() 
    ? cities.filter(city => {
        const searchLower = searchTerm.toLowerCase().trim();
        const nameLower = city.name.toLowerCase();
        const nameAmLower = city.name_am ? city.name_am.toLowerCase() : '';
        
        // More flexible matching - prioritize starts with
        const nameStarts = nameLower.startsWith(searchLower);
        const amStarts = nameAmLower.startsWith(searchLower);
        const nameContains = nameLower.includes(searchLower);
        const amContains = nameAmLower.includes(searchLower);
        
        return nameStarts || amStarts || nameContains || amContains;
      })
    : cities; // Show all cities when search is empty

  // Sort filtered cities to prioritize matches that start with search term
  const sortedFilteredCities = searchTerm.trim()
    ? [...filteredCities].sort((a, b) => {
        const searchLower = searchTerm.toLowerCase().trim();
        const aNameLower = a.name.toLowerCase();
        const bNameLower = b.name.toLowerCase();
        const aAmLower = a.name_am ? a.name_am.toLowerCase() : '';
        const bAmLower = b.name_am ? b.name_am.toLowerCase() : '';
        
        // Check if names start with search term
        const aStarts = aNameLower.startsWith(searchLower) || aAmLower.startsWith(searchLower);
        const bStarts = bNameLower.startsWith(searchLower) || bAmLower.startsWith(searchLower);
        
        // Prioritize exact starts with matches
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        
        // Then prioritize alphabetical order
        return aNameLower.localeCompare(bNameLower);
      })
    : cities;

  // Debug logs
  console.log('=== DEBUG INFO ===');
  console.log('Search term:', searchTerm);
  console.log('All cities:', cities);
  console.log('Filtered cities:', filteredCities);
  console.log('Cities length:', cities.length);
  console.log('Filtered length:', filteredCities.length);
  
  // Test search logic manually
  if (searchTerm) {
    console.log('Testing search for:', searchTerm);
    cities.forEach(city => {
      const nameMatch = city.name.toLowerCase().includes(searchTerm.toLowerCase());
      const amharicMatch = city.name_am && city.name_am.toLowerCase().includes(searchTerm.toLowerCase());
      console.log(`City ${city.name}: nameMatch=${nameMatch}, amharicMatch=${amharicMatch}`);
    });
  }
  console.log('==================');

  const handleCitySelect = (city) => {
    onCityChange(city.name);  // Pass city name instead of city object
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleShowAll = () => {
    onCityChange('all');  // Pass 'all' instead of null
    setIsOpen(false);
    setSearchTerm('');
  };

  const displayText = selectedCity && selectedCity !== 'all' 
    ? selectedCity 
    : 'Search cities with shops...';

  return (
    <div className="city-selector" ref={dropdownRef}>
      <div 
        className={`city-selector-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="city-display">{displayText}</span>
        <svg className="dropdown-arrow" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>

      {isOpen && (
        <div className="city-dropdown">
          <div className="city-search">
            <input
              type="text"
              placeholder="Search cities with registered shops..."
              value={searchTerm}
              onChange={(e) => {
                console.log('Input changed to:', e.target.value);
                setSearchTerm(e.target.value);
              }}
              className="search-input"
            />
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <button 
              onClick={() => {
                console.log('Test button clicked - current cities:', cities);
                console.log('Current search term:', searchTerm);
              }}
              style={{margin: '5px', padding: '5px', background: '#f0f0f0', border: '1px solid #ccc'}}
            >
              Debug
            </button>
          </div>

          <div className="city-list">
            {sortedFilteredCities.map((city) => (
              <div 
                key={city.id}
                className={`city-item ${city.shopCount > 0 ? 'has-shops' : ''}`}
                onClick={() => handleCitySelect(city)}
              >
                <div className="city-info">
                  <span className="city-name">{city.name}</span>
                  {city.name_am && (
                    <span className="city-name-am">{city.name_am}</span>
                  )}
                </div>
                <div className="city-stats">
                  <span className="shop-count">{city.shopCount || 0} registered shops</span>
                </div>
              </div>
            ))}

            {sortedFilteredCities.length === 0 && cities.length > 0 && (
              <div className="no-results">No cities found matching "{searchTerm}"</div>
            )}
            
            {cities.length === 0 && (
              <div className="no-results">No cities have registered shops yet</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitySelector;
