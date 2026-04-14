import React, { useState, useEffect, Fragment } from 'react';
import './RegisteredShops.css';
import CustomerRegistration from './CustomerRegistration';
import '../utils/mockProducts.js';

const RegisteredShops = () => {
  const [registeredShops, setRegisteredShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShop, setSelectedShop] = useState(null);
  const [showShopDetails, setShowShopDetails] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonProduct, setComparisonProduct] = useState(null);
  
  // Advanced Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    brand: '',
    model: '',
    ram: '',
    storage: '',
    battery: '',
    camera: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    searchBy: 'all' // all, brand, model, shop, etc.
  });

  // Location-based Search States
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyShops, setNearbyShops] = useState([]);
  const [showNearbyShops, setShowNearbyShops] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Shop Analytics States
  const [shopAnalytics, setShopAnalytics] = useState({
    productViews: 0,
    mostViewedProduct: null,
    customerMessages: 0,
    wishlistSaves: 0,
    dailyVisitors: 0
  });

  // Notification System States
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Customer registration state
  const [showCustomerRegistration, setShowCustomerRegistration] = useState(false);
  const [pendingContactAction, setPendingContactAction] = useState(null);
  const [pendingShop, setPendingShop] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [pendingShopView, setPendingShopView] = useState(null);
  const [showRegistrationChoice, setShowRegistrationChoice] = useState(false);

  // Customer Notification States
  const [shopUpdates, setShopUpdates] = useState({});
  const [unseenUpdates, setUnseenUpdates] = useState({});

  // Shop View Tracking States
  const [shopViews, setShopViews] = useState({});
  const [viewHistory, setViewHistory] = useState([]);

  // Comment and Communication States
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [selectedShopForComments, setSelectedShopForComments] = useState(null);
  const [directMessage, setDirectMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedShopForMessage, setSelectedShopForMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedContent, setEditedContent] = useState('');

  // City Filtering States
  const [selectedCity, setSelectedCity] = useState('all');
  const [cityShopCounts, setCityShopCounts] = useState({});

  // Product Preview States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductPreview, setShowProductPreview] = useState(false);

  // Search Suggestions States
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Helper functions for file and image handling
  const isValidImageUrl = (url) => {
    if (!url) return false;
    
    // Check if it's a valid URL format
    try {
      new URL(url);
      return true;
    } catch {
      // If not a valid URL, check if it's a data URL or blob URL
      return url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('http');
    }
  };

  // Voice Search States
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  useEffect(() => {
    // Check if customer is registered
    const savedCustomerData = localStorage.getItem('customerData');
    if (savedCustomerData) {
      setCustomerData(JSON.parse(savedCustomerData));
    }
    
    const loadRegisteredShops = async () => {
      try {
        setLoading(true);
        
        // Load shops from localStorage
        const savedShops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
        
        // Only add sample shops if no shops exist
        if (savedShops.length === 0) {
          const sampleShops = [
            {
              id: '1',
              shopName: 'Abebe Electronics',
              ownerName: 'Abebe Tesfaye',
              email: 'abebe@electronics.com',
              phoneNumber: '+251 911 234 567',
              city: 'Dilla',
              town: 'Dilla',
              region: 'Southern Nations',
              address: 'Main Street, Building 123',
              description: 'Premier electronics shop with latest phones, laptops, and accessories',
              isVerified: true,
              isOpen: true,
              registrationDate: '2024-01-15',
              productCount: 25,
              rating: 4.8,
              reviews: 125,
              shopFrontImage: 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Abebe+Electronics+Front',
              shopBackImage: 'https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Abebe+Electronics+Back',
              productsDisplayImage: 'https://via.placeholder.com/400x300/FF9800/FFFFFF?text=Products+Display',
              shopVideo: null,
              shopVideoThumbnail: null,
              shopGalleryImages: [
                'https://via.placeholder.com/300x200/9C27B0/FFFFFF?text=Gallery+1',
                'https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Gallery+2',
                'https://via.placeholder.com/300x200/00BCD4/FFFFFF?text=Gallery+3'
              ],
              additionalImages: [
                'https://via.placeholder.com/300x200/795548/FFFFFF?text=Additional+1',
                'https://via.placeholder.com/300x200/607D8B/FFFFFF?text=Additional+2'
              ],
              products: [
                {
                  id: 'p1',
                  name: 'Samsung Galaxy A14',
                  brand: 'Samsung',
                  price: 14500,
                  image: 'https://via.placeholder.com/200x200/4CAF50/FFFFFF?text=Samsung+A14',
                  frontImage: 'https://via.placeholder.com/200x200/2196F3/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/FF9800/FFFFFF?text=Back',
                  category: 'Phones'
                },
                {
                  id: 'p2',
                  name: 'HP Laptop 15',
                  brand: 'HP',
                  price: 25000,
                  image: 'https://via.placeholder.com/200x200/9C27B0/FFFFFF?text=HP+Laptop+15',
                  frontImage: 'https://via.placeholder.com/200x200/E91E63/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/00BCD4/FFFFFF?text=Back',
                  category: 'Laptops'
                },
                {
                  id: 'p5',
                  name: 'iPhone 13',
                  brand: 'Apple',
                  price: 45000,
                  image: 'https://via.placeholder.com/200x200/FF9800/FFFFFF?text=iPhone+13',
                  frontImage: 'https://via.placeholder.com/200x200/9C27B0/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/00BCD4/FFFFFF?text=Back',
                  category: 'Phones'
                }
              ]
            },
            {
              id: '2',
              shopName: 'Mekelle Tech Center',
              ownerName: 'Mohammed Ali',
              email: 'mohammed@techcenter.com',
              phoneNumber: '+251 914 567 890',
              city: 'Mekelle',
              town: 'Mekelle',
              region: 'Tigray',
              address: 'Technology Park, Suite 45',
              description: 'Modern electronics store specializing in computers and gadgets',
              isVerified: true,
              isOpen: true,
              registrationDate: '2024-02-20',
              productCount: 18,
              rating: 4.6,
              reviews: 89,
              shopFrontImage: 'https://via.placeholder.com/400x300/FF5722/FFFFFF?text=Mekelle+Tech+Front',
              shopBackImage: 'https://via.placeholder.com/400x300/3F51B5/FFFFFF?text=Mekelle+Tech+Back',
              productsDisplayImage: 'https://via.placeholder.com/400x300/009688/FFFFFF?text=Products',
              shopVideo: null,
              shopVideoThumbnail: null,
              shopGalleryImages: [
                'https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Tech+Gallery+1',
                'https://via.placeholder.com/300x200/8BC34A/FFFFFF?text=Tech+Gallery+2'
              ],
              additionalImages: [
                'https://via.placeholder.com/300x200/673AB7/FFFFFF?text=Tech+Additional'
              ],
              products: [
                {
                  id: 'p3',
                  name: 'Dell Inspiron 14',
                  brand: 'Dell',
                  price: 28000,
                  image: 'https://via.placeholder.com/200x200/FF5722/FFFFFF?text=Dell+Inspiron',
                  frontImage: 'https://via.placeholder.com/200x200/3F51B5/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/009688/FFFFFF?text=Back',
                  category: 'Laptops'
                }
              ]
            },
            {
              id: '3',
              shopName: 'Addis Computer World',
              ownerName: 'Sara Bekele',
              email: 'sara@computerworld.com',
              phoneNumber: '+251 922 345 678',
              city: 'Addis Abeba',
              town: 'Addis Abeba',
              region: 'Addis Abeba',
              address: 'Bole Road, Kebena Building',
              description: 'Largest computer and accessories store in Addis Abeba',
              isVerified: true,
              isOpen: true,
              registrationDate: '2024-03-10',
              productCount: 42,
              rating: 4.9,
              reviews: 203,
              shopFrontImage: 'https://via.placeholder.com/400x300/E91E63/FFFFFF?text=Addis+Computer+Front',
              shopBackImage: 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Addis+Computer+Back',
              productsDisplayImage: 'https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Computer+Display',
              shopVideo: null,
              shopVideoThumbnail: null,
              shopGalleryImages: [
                'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Computer+Gallery+1',
                'https://via.placeholder.com/300x200/9C27B0/FFFFFF?text=Computer+Gallery+2',
                'https://via.placeholder.com/300x200/00BCD4/FFFFFF?text=Computer+Gallery+3',
                'https://via.placeholder.com/300x200/795548/FFFFFF?text=Computer+Gallery+4'
              ],
              additionalImages: [
                'https://via.placeholder.com/300x200/607D8B/FFFFFF?text=Computer+Additional+1',
                'https://via.placeholder.com/300x200/673AB7/FFFFFF?text=Computer+Additional+2',
                'https://via.placeholder.com/300x200/FFC107/FFFFFF?text=Computer+Additional+3'
              ],
              products: [
                {
                  id: 'p4',
                  name: 'Lenovo ThinkPad',
                  brand: 'Lenovo',
                  price: 35000,
                  image: 'https://via.placeholder.com/200x200/E91E63/FFFFFF?text=Lenovo+ThinkPad',
                  frontImage: 'https://via.placeholder.com/200x200/4CAF50/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/2196F3/FFFFFF?text=Back',
                  category: 'Laptops'
                },
                {
                  id: 'p6',
                  name: 'iPhone 13 Pro',
                  brand: 'Apple',
                  price: 55000,
                  image: 'https://via.placeholder.com/200x200/9C27B0/FFFFFF?text=iPhone+13+Pro',
                  frontImage: 'https://via.placeholder.com/200x200/00BCD4/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/795548/FFFFFF?text=Back',
                  category: 'Phones'
                }
              ]
            },
            {
              id: '4',
              shopName: 'Gonder Digital Hub',
              ownerName: 'Kassahun Berhe',
              email: 'kassahun@digitalhub.com',
              phoneNumber: '+251 933 456 789',
              city: 'Gonder',
              town: 'Gonder',
              region: 'Amhara',
              address: 'Piazza Area, Shop 12',
              description: 'Complete digital solutions with phones, computers, and accessories',
              isVerified: true,
              isOpen: true,
              registrationDate: '2024-01-20',
              productCount: 31,
              rating: 4.7,
              reviews: 156,
              shopFrontImage: 'https://via.placeholder.com/400x300/9C27B0/FFFFFF?text=Gonder+Digital+Front',
              shopBackImage: 'https://via.placeholder.com/400x300/3F51B5/FFFFFF?text=Gonder+Digital+Back',
              productsDisplayImage: 'https://via.placeholder.com/400x300/009688/FFFFFF?text=Digital+Products',
              shopGalleryImages: [
                'https://via.placeholder.com/300x200/FF5722/FFFFFF?text=Digital+Gallery+1',
                'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Digital+Gallery+2'
              ],
              additionalImages: [
                'https://via.placeholder.com/300x200/795548/FFFFFF?text=Digital+Additional'
              ],
              products: [
                {
                  id: 'p7',
                  name: 'Tecno Spark 10',
                  brand: 'Tecno',
                  price: 12000,
                  image: 'https://via.placeholder.com/200x200/9C27B0/FFFFFF?text=Tecno+Spark+10',
                  frontImage: 'https://via.placeholder.com/200x200/3F51B5/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/009688/FFFFFF?text=Back',
                  category: 'Phones'
                },
                {
                  id: 'p8',
                  name: 'Asus VivoBook',
                  brand: 'Asus',
                  price: 22000,
                  image: 'https://via.placeholder.com/200x200/FF5722/FFFFFF?text=Asus+VivoBook',
                  frontImage: 'https://via.placeholder.com/200x200/FF9800/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/795548/FFFFFF?text=Back',
                  category: 'Laptops'
                }
              ]
            },
            {
              id: '5',
              shopName: 'Hawassa Mobile Plus',
              ownerName: 'Alemu Lemma',
              email: 'alemu@mobileplus.com',
              phoneNumber: '+251 944 567 890',
              city: 'Hawassa',
              town: 'Hawassa',
              region: 'Southern Nations',
              address: 'Main Road, Building 45',
              description: 'Mobile phones and accessories specialist',
              isVerified: true,
              isOpen: true,
              registrationDate: '2024-02-15',
              productCount: 28,
              rating: 4.5,
              reviews: 98,
              shopFrontImage: 'https://via.placeholder.com/400x300/FF9800/FFFFFF?text=Hawassa+Mobile+Front',
              shopBackImage: 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Hawassa+Mobile+Back',
              productsDisplayImage: 'https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Mobile+Products',
              shopGalleryImages: [
                'https://via.placeholder.com/300x200/E91E63/FFFFFF?text=Mobile+Gallery+1',
                'https://via.placeholder.com/300x200/00BCD4/FFFFFF?text=Mobile+Gallery+2',
                'https://via.placeholder.com/300x200/9C27B0/FFFFFF?text=Mobile+Gallery+3'
              ],
              additionalImages: [
                'https://via.placeholder.com/300x200/3F51B5/FFFFFF?text=Mobile+Additional+1',
                'https://via.placeholder.com/300x200/009688/FFFFFF?text=Mobile+Additional+2'
              ],
              products: [
                {
                  id: 'p9',
                  name: 'Samsung Galaxy A24',
                  brand: 'Samsung',
                  price: 18000,
                  image: 'https://via.placeholder.com/200x200/FF9800/FFFFFF?text=Samsung+A24',
                  frontImage: 'https://via.placeholder.com/200x200/4CAF50/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/2196F3/FFFFFF?text=Back',
                  category: 'Phones'
                },
                {
                  id: 'p10',
                  name: 'Xiaomi Redmi Note 12',
                  brand: 'Xiaomi',
                  price: 13000,
                  image: 'https://via.placeholder.com/200x200/E91E63/FFFFFF?text=Xiaomi+Redmi+12',
                  frontImage: 'https://via.placeholder.com/200x200/00BCD4/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/9C27B0/FFFFFF?text=Back',
                  category: 'Phones'
                }
              ]
            },
            {
              id: '6',
              shopName: 'Bahir Dar Electronics',
              ownerName: 'Getachew Mekonnen',
              email: 'getachew@bdelectronics.com',
              phoneNumber: '+251 955 234 567',
              city: 'Bahir Dar',
              town: 'Bahir Dar',
              region: 'Amhara',
              address: 'Gish Abay Area, Shop 8',
              description: 'Quality electronics and home appliances',
              isVerified: true,
              isOpen: true,
              registrationDate: '2024-03-05',
              productCount: 35,
              rating: 4.6,
              reviews: 142,
              shopFrontImage: 'https://via.placeholder.com/400x300/00BCD4/FFFFFF?text=Bahir+Dar+Electronics+Front',
              shopBackImage: 'https://via.placeholder.com/400x300/9C27B0/FFFFFF?text=Bahir+Dar+Electronics+Back',
              productsDisplayImage: 'https://via.placeholder.com/400x300/FF5722/FFFFFF?text=Electronics+Products',
              shopGalleryImages: [
                'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Electronics+Gallery+1',
                'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Electronics+Gallery+2'
              ],
              additionalImages: [
                'https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Electronics+Additional+1',
                'https://via.placeholder.com/300x200/009688/FFFFFF?text=Electronics+Additional+2'
              ],
              products: [
                {
                  id: 'p11',
                  name: 'LG Smart TV 43"',
                  brand: 'LG',
                  price: 32000,
                  image: 'https://via.placeholder.com/200x200/00BCD4/FFFFFF?text=LG+Smart+TV',
                  frontImage: 'https://via.placeholder.com/200x200/9C27B0/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/FF9800/FFFFFF?text=Back',
                  category: 'TVs'
                },
                {
                  id: 'p12',
                  name: 'Sony PlayStation 5',
                  brand: 'Sony',
                  price: 48000,
                  image: 'https://via.placeholder.com/200x200/FF5722/FFFFFF?text=PlayStation+5',
                  frontImage: 'https://via.placeholder.com/200x200/4CAF50/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/2196F3/FFFFFF?text=Back',
                  category: 'Gaming'
                }
              ]
            },
            {
              id: '7',
              shopName: 'Jimma Tech Solutions',
              ownerName: 'Fatuma Mohammed',
              email: 'fatuma@techsolutions.com',
              phoneNumber: '+251 966 789 012',
              city: 'Jimma',
              town: 'Jimma',
              region: 'Oromia',
              address: 'Town Center, Building 22',
              description: 'Technology solutions for business and home',
              isVerified: true,
              isOpen: true,
              registrationDate: '2024-02-28',
              productCount: 22,
              rating: 4.4,
              reviews: 87,
              shopFrontImage: 'https://via.placeholder.com/400x300/FF5722/FFFFFF?text=Jimma+Tech+Front',
              shopBackImage: 'https://via.placeholder.com/400x300/00BCD4/FFFFFF?text=Jimma+Tech+Back',
              productsDisplayImage: 'https://via.placeholder.com/400x300/9C27B0/FFFFFF?text=Tech+Solutions',
              shopGalleryImages: [
                'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Jimma+Gallery+1',
                'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Jimma+Gallery+2'
              ],
              additionalImages: [
                'https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Jimma+Additional'
              ],
              products: [
                {
                  id: 'p13',
                  name: 'Canon Printer',
                  brand: 'Canon',
                  price: 8500,
                  image: 'https://via.placeholder.com/200x200/FF5722/FFFFFF?text=Canon+Printer',
                  frontImage: 'https://via.placeholder.com/200x200/00BCD4/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/9C27B0/FFFFFF?text=Back',
                  category: 'Printers'
                },
                {
                  id: 'p14',
                  name: 'HP Desktop PC',
                  brand: 'HP',
                  price: 26000,
                  image: 'https://via.placeholder.com/200x200/FF9800/FFFFFF?text=HP+Desktop',
                  frontImage: 'https://via.placeholder.com/200x200/4CAF50/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/2196F3/FFFFFF?text=Back',
                  category: 'Computers'
                }
              ]
            },
            {
              id: '8',
              shopName: 'Dire Dawa Computers',
              ownerName: 'Ahmed Yusuf',
              email: 'ahmed@diredawacomputers.com',
              phoneNumber: '+251 977 345 678',
              city: 'Dire Dawa',
              town: 'Dire Dawa',
              region: 'Dire Dawa',
              address: 'Kezira District, Shop 15',
              description: 'Computers and networking solutions',
              isVerified: true,
              isOpen: true,
              registrationDate: '2024-01-25',
              productCount: 19,
              rating: 4.3,
              reviews: 76,
              shopFrontImage: 'https://via.placeholder.com/400x300/4CAF50/FFFFFF?text=Dire+Dawa+Computers+Front',
              shopBackImage: 'https://via.placeholder.com/400x300/9C27B0/FFFFFF?text=Dire+Dawa+Computers+Back',
              productsDisplayImage: 'https://via.placeholder.com/400x300/FF5722/FFFFFF?text=Computers+Display',
              shopGalleryImages: [
                'https://via.placeholder.com/300x200/00BCD4/FFFFFF?text=Dire+Dawa+Gallery+1',
                'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Dire+Dawa+Gallery+2'
              ],
              additionalImages: [
                'https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Dire+Dawa+Additional'
              ],
              products: [
                {
                  id: 'p15',
                  name: 'TP-Link Router',
                  brand: 'TP-Link',
                  price: 3500,
                  image: 'https://via.placeholder.com/200x200/4CAF50/FFFFFF?text=TP+Link+Router',
                  frontImage: 'https://via.placeholder.com/200x200/9C27B0/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/FF5722/FFFFFF?text=Back',
                  category: 'Networking'
                },
                {
                  id: 'p16',
                  name: 'Cisco Switch',
                  brand: 'Cisco',
                  price: 15000,
                  image: 'https://via.placeholder.com/200x200/00BCD4/FFFFFF?text=Cisco+Switch',
                  frontImage: 'https://via.placeholder.com/200x200/FF9800/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/4CAF50/FFFFFF?text=Back',
                  category: 'Networking'
                }
              ]
            },
            {
              id: '9',
              shopName: 'Adama Tech Store',
              ownerName: 'Bekele Tadesse',
              email: 'bekele@techstore.com',
              phoneNumber: '+251 988 456 789',
              city: 'Adama',
              town: 'Adama',
              region: 'Oromia',
              address: 'Main Street, Building 34',
              description: 'Modern technology and gadgets store',
              isVerified: true,
              isOpen: true,
              registrationDate: '2024-03-15',
              productCount: 26,
              rating: 4.5,
              reviews: 112,
              shopFrontImage: 'https://via.placeholder.com/400x300/9C27B0/FFFFFF?text=Adama+Tech+Front',
              shopBackImage: 'https://via.placeholder.com/400x300/FF5722/FFFFFF?text=Adama+Tech+Back',
              productsDisplayImage: 'https://via.placeholder.com/400x300/00BCD4/FFFFFF?text=Tech+Store+Products',
              shopGalleryImages: [
                'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Adama+Gallery+1',
                'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Adama+Gallery+2'
              ],
              additionalImages: [
                'https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Adama+Additional'
              ],
              products: [
                {
                  id: 'p17',
                  name: 'iPad Air',
                  brand: 'Apple',
                  price: 38000,
                  image: 'https://via.placeholder.com/200x200/9C27B0/FFFFFF?text=iPad+Air',
                  frontImage: 'https://via.placeholder.com/200x200/FF5722/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/00BCD4/FFFFFF?text=Back',
                  category: 'Tablets'
                },
                {
                  id: 'p18',
                  name: 'Samsung Galaxy Tab',
                  brand: 'Samsung',
                  price: 22000,
                  image: 'https://via.placeholder.com/200x200/FF9800/FFFFFF?text=Galaxy+Tab',
                  frontImage: 'https://via.placeholder.com/200x200/4CAF50/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/2196F3/FFFFFF?text=Back',
                  category: 'Tablets'
                }
              ]
            },
            {
              id: '10',
              shopName: 'Shashamane Electronics',
              ownerName: 'Zewditu Hailu',
              email: 'zewditu@shashamenelectronics.com',
              phoneNumber: '+251 999 876 543',
              city: 'Shashamane',
              town: 'Shashamane',
              region: 'Oromia',
              address: 'Market Area, Shop 67',
              description: 'Complete electronics and mobile solutions',
              isVerified: true,
              isOpen: true,
              registrationDate: '2024-02-10',
              productCount: 33,
              rating: 4.7,
              reviews: 178,
              shopFrontImage: 'https://via.placeholder.com/400x300/00BCD4/FFFFFF?text=Shashamane+Electronics+Front',
              shopBackImage: 'https://via.placeholder.com/400x300/FF9800/FFFFFF?text=Shashamane+Electronics+Back',
              productsDisplayImage: 'https://via.placeholder.com/400x300/9C27B0/FFFFFF?text=Electronics+Display',
              shopVideo: null,
              shopVideoThumbnail: null,
              shopGalleryImages: [
                'https://via.placeholder.com/300x200/FF5722/FFFFFF?text=Shashamane+Gallery+1',
                'https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Shashamane+Gallery+2',
                'https://via.placeholder.com/300x200/2196F3/FFFFFF?text=Shashamane+Gallery+3'
              ],
              additionalImages: [
                'https://via.placeholder.com/300x200/00BCD4/FFFFFF?text=Shashamane+Additional+1',
                'https://via.placeholder.com/300x200/FF9800/FFFFFF?text=Shashamane+Additional+2'
              ],
              products: [
                {
                  id: 'p19',
                  name: 'Samsung Galaxy S24',
                  brand: 'Samsung',
                  price: 52000,
                  image: 'https://via.placeholder.com/200x200/00BCD4/FFFFFF?text=Galaxy+S24',
                  frontImage: 'https://via.placeholder.com/200x200/FF5722/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/FF9800/FFFFFF?text=Back',
                  category: 'Phones'
                },
                {
                  id: 'p20',
                  name: 'MacBook Air M2',
                  brand: 'Apple',
                  price: 68000,
                  image: 'https://via.placeholder.com/200x200/9C27B0/FFFFFF?text=MacBook+Air',
                  frontImage: 'https://via.placeholder.com/200x200/4CAF50/FFFFFF?text=Front',
                  backImage: 'https://via.placeholder.com/200x200/2196F3/FFFFFF?text=Back',
                  category: 'Laptops'
                }
              ]
            }
          ];
          
          localStorage.setItem('registeredShops', JSON.stringify(sampleShops));
          setRegisteredShops(sampleShops);
          console.log('Sample shops added:', sampleShops);
        } else {
          // Use existing shops from localStorage
          setRegisteredShops(savedShops);
          console.log('Loaded existing shops:', savedShops.length, 'shops');
          
          // Debug: Check for image data in shops
          savedShops.forEach((shop, index) => {
            console.log(`=== SHOP ${index + 1}: ${shop.shopName} ===`);
            console.log('Logo exists:', !!shop.logo, 'Type:', typeof shop.logo, 'Length:', shop.logo?.length);
            console.log('Front image exists:', !!shop.shopFrontImage, 'Type:', typeof shop.shopFrontImage, 'Length:', shop.shopFrontImage?.length);
            console.log('Back image exists:', !!shop.shopBackImage, 'Type:', typeof shop.shopBackImage, 'Length:', shop.shopBackImage?.length);
            console.log('Gallery images count:', shop.shopGalleryImages?.length || 0);
            if (shop.shopGalleryImages && shop.shopGalleryImages.length > 0) {
              shop.shopGalleryImages.forEach((img, i) => {
                console.log(`  Gallery ${i + 1}:`, !!img, typeof img, img?.length);
              });
            }
            console.log('Products count:', shop.products?.length || 0);
            if (shop.products && shop.products.length > 0) {
              shop.products.forEach((product, i) => {
                console.log(`  Product ${i + 1}: ${product.name}`);
                console.log(`    Image:`, !!product.image, typeof product.image, product.image?.length);
                console.log(`    Front:`, !!product.frontImage, typeof product.frontImage, product.frontImage?.length);
                console.log(`    Back:`, !!product.backImage, typeof product.backImage, product.backImage?.length);
              });
            }
            
            // Test if the image URL is actually valid
            if (shop.shopFrontImage) {
              console.log('Testing image URL validity...');
              const img = new Image();
              img.onload = () => console.log('✅ Image URL is valid:', shop.shopName);
              img.onerror = () => console.log('❌ Image URL is invalid:', shop.shopName, shop.shopFrontImage);
              img.src = shop.shopFrontImage;
            }
            
            console.log('=====================================');
          });
        }
        
        // Calculate city shop counts
        const cityCounts = {};
        savedShops.forEach(shop => {
          if (shop.city) {
            cityCounts[shop.city] = (cityCounts[shop.city] || 0) + 1;
          }
        });
        setCityShopCounts(cityCounts);
        console.log('City shop counts calculated:', cityCounts);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading shops:', error);
        setLoading(false);
      }
    };

    loadRegisteredShops();
    
    // Load other data
    const savedShopViews = JSON.parse(localStorage.getItem('shopViews') || '{}');
    const savedViewHistory = JSON.parse(localStorage.getItem('viewHistory') || '[]');
    setShopViews(savedShopViews);
    setViewHistory(savedViewHistory);
    
    // Load comments
    const savedComments = JSON.parse(localStorage.getItem('shopComments') || '{}');
    setComments(savedComments);
    
    // Load customer shop updates tracking
    const savedShopUpdates = JSON.parse(localStorage.getItem('customerShopUpdates') || '{}');
    const savedUnseenUpdates = JSON.parse(localStorage.getItem('customerUnseenUpdates') || '{}');
    setShopUpdates(savedShopUpdates);
    setUnseenUpdates(savedUnseenUpdates);
    
    // Check voice search support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setVoiceSupported(true);
    }
  }, []);

  const handleCallShop = (phoneNumber) => {
    // Check if phoneNumber is valid
    if (!phoneNumber) {
      alert('Phone number not available for this shop');
      return;
    }
    
    // Make phone call
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleWhatsApp = (phoneNumber, shop) => {
    // Check if phoneNumber is valid
    if (!phoneNumber) {
      alert('Phone number not available for this shop');
      return;
    }
    
    // Check if customer is registered
    if (!customerData) {
      setPendingShopView(shop);
      setShowRegistrationChoice(true);
      return;
    }
    
    // Open WhatsApp with phone number
    window.open(`https://wa.me/${phoneNumber.replace(/\D/g, '')}`, '_blank');
  };

  const handleTelegram = (phoneNumber, shop) => {
    // Check if phoneNumber is valid
    if (!phoneNumber) {
      alert('Phone number not available for this shop');
      return;
    }
    
    // Check if customer is registered
    if (!customerData) {
      setPendingShopView(shop);
      setShowRegistrationChoice(true);
      return;
    }
    
    // Open Telegram (you can customize this based on Telegram username)
    const message = encodeURIComponent('Hello! I found your shop on Ethiopian Electronics and I\'m interested in your products.');
    window.open(`https://t.me/+${phoneNumber.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  const handleSaveShop = (shop) => {
    // Check if customer is registered
    if (!customerData) {
      setPendingShopView(shop);
      setShowRegistrationChoice(true);
      return;
    }
    
    // Save shop to favorites
    let savedShops = [];
    try {
      savedShops = JSON.parse(localStorage.getItem('savedShops') || '[]');
      if (!Array.isArray(savedShops)) {
        savedShops = [];
      }
    } catch (error) {
      savedShops = [];
    }
    const isAlreadySaved = savedShops.some(savedShop => savedShop.id === shop.id);
    
    if (isAlreadySaved) {
      // Remove from saved shops
      const updatedSavedShops = savedShops.filter(savedShop => savedShop.id !== shop.id);
      localStorage.setItem('savedShops', JSON.stringify(updatedSavedShops));
      alert(`${shop.shopName} removed from favorites`);
    } else {
      // Add to saved shops
      savedShops.push(shop);
      localStorage.setItem('savedShops', JSON.stringify(savedShops));
      alert(`${shop.shopName} saved to favorites!`);
    }
  };

  // Action handlers with registration check
  const handleCallShopWithCheck = (shop) => {
    // Check if shop is disabled by admin
    if (shop.isDisabled) {
      alert('⚠️ This shop has been temporarily disabled by the administrator. You cannot contact this shop until it is re-enabled.');
      return;
    }
    
    // Check if customer is registered
    if (!customerData) {
      setPendingContactAction('call');
      setPendingShop(shop);
      setShowCustomerRegistration(true);
      return;
    }
    
    // Check if shop has phone number
    if (!shop.phoneNumber || shop.phoneNumber.trim() === '') {
      // Ask user to provide phone number for this shop
      const phoneNumber = prompt(
        `📞 ${shop.shopName} doesn't have a phone number listed.\n\n` +
        `Please enter the phone number for ${shop.shopName} to call them:`,
        '+251'
      );
      
      if (phoneNumber && phoneNumber.trim() !== '') {
        // Update the shop with the provided phone number
        const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
        const shopIndex = shops.findIndex(s => s.id === shop.id || s.shopName === shop.shopName);
        
        if (shopIndex !== -1) {
          shops[shopIndex].phoneNumber = phoneNumber.trim();
          localStorage.setItem('registeredShops', JSON.stringify(shops));
          setRegisteredShops(shops);
          
          // Now proceed with phone call
          handleCallShop(phoneNumber.trim());
          
          alert(`✅ Phone number updated for ${shop.shopName}. Calling now...`);
        } else {
          alert('❌ Could not update shop information. Please try again.');
        }
      } else {
        alert('❌ Phone number is required to call the shop.');
      }
      return;
    }
    
    handleCallShop(shop.phoneNumber);
  };

  const handleWhatsAppWithCheck = (shop) => {
    // Check if shop is disabled by admin
    if (shop.isDisabled) {
      alert('⚠️ This shop has been temporarily disabled by the administrator. You cannot contact this shop until it is re-enabled.');
      return;
    }
    
    // Check if customer is registered
    if (!customerData) {
      setPendingContactAction('whatsapp');
      setPendingShop(shop);
      setShowCustomerRegistration(true);
      return;
    }
    
    // Check if shop has phone number
    if (!shop.phoneNumber || shop.phoneNumber.trim() === '') {
      // Ask user to provide phone number for this shop
      const phoneNumber = prompt(
        `📞 ${shop.shopName} doesn't have a phone number listed.\n\n` +
        `Please enter the phone number for ${shop.shopName} to contact them via WhatsApp:`,
        '+251'
      );
      
      if (phoneNumber && phoneNumber.trim() !== '') {
        // Update the shop with the provided phone number
        const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
        const shopIndex = shops.findIndex(s => s.id === shop.id || s.shopName === shop.shopName);
        
        if (shopIndex !== -1) {
          shops[shopIndex].phoneNumber = phoneNumber.trim();
          localStorage.setItem('registeredShops', JSON.stringify(shops));
          setRegisteredShops(shops);
          
          // Now proceed with WhatsApp contact
          handleWhatsApp(phoneNumber.trim(), shops[shopIndex]);
          
          alert(`✅ Phone number updated for ${shop.shopName}. Opening WhatsApp...`);
        } else {
          alert('❌ Could not update shop information. Please try again.');
        }
      } else {
        alert('❌ Phone number is required to contact the shop via WhatsApp.');
      }
      return;
    }
    
    handleWhatsApp(shop.phoneNumber, shop);
  };

  const handleTelegramWithCheck = (shop) => {
    // Check if shop is disabled by admin
    if (shop.isDisabled) {
      alert('⚠️ This shop has been temporarily disabled by the administrator. You cannot contact this shop until it is re-enabled.');
      return;
    }
    
    // Check if customer is registered
    if (!customerData) {
      setPendingContactAction('telegram');
      setPendingShop(shop);
      setShowCustomerRegistration(true);
      return;
    }
    
    // Check if shop has phone number
    if (!shop.phoneNumber || shop.phoneNumber.trim() === '') {
      // Ask user to provide phone number for this shop
      const phoneNumber = prompt(
        `📞 ${shop.shopName} doesn't have a phone number listed.\n\n` +
        `Please enter the phone number for ${shop.shopName} to contact them via Telegram:`,
        '+251'
      );
      
      if (phoneNumber && phoneNumber.trim() !== '') {
        // Update the shop with the provided phone number
        const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
        const shopIndex = shops.findIndex(s => s.id === shop.id || s.shopName === shop.shopName);
        
        if (shopIndex !== -1) {
          shops[shopIndex].phoneNumber = phoneNumber.trim();
          localStorage.setItem('registeredShops', JSON.stringify(shops));
          setRegisteredShops(shops);
          
          // Now proceed with Telegram contact
          handleTelegram(phoneNumber.trim(), shops[shopIndex]);
          
          alert(`✅ Phone number updated for ${shop.shopName}. Opening Telegram...`);
        } else {
          alert('❌ Could not update shop information. Please try again.');
        }
      } else {
        alert('❌ Phone number is required to contact the shop via Telegram.');
      }
      return;
    }
    
    handleTelegram(shop.phoneNumber, shop);
  };

  const handleViewShopDetails = (shop) => {
    // Check if customer is registered
    if (!customerData) {
      // Store the shop they want to view and show registration choice modal
      setPendingShopView(shop);
      setShowRegistrationChoice(true);
      return;
    }
    
    // Track the shop view
    trackShopView(shop);
    
    // Track shop updates for customer notifications
    trackShopUpdates(shop);
    
    // Mark updates as seen when customer views the shop
    const shopId = shop.id || shop.shopName;
    markShopUpdatesAsSeen(shopId);
    
    setSelectedShop(shop);
    setShowShopDetails(true);
  };

  const handleCloseShopDetails = () => {
    setShowShopDetails(false);
    setSelectedShop(null);
  };

  const handleCloseComparison = () => {
    setShowComparison(false);
    setComparisonProduct(null);
  };

  // Product Preview Handler
  const handleProductPreview = (product, shop) => {
    setSelectedProduct(product);
    setShowProductPreview(true);
  };

  const handleCloseProductPreview = () => {
    setShowProductPreview(false);
    setSelectedProduct(null);
  };

  // Customer Registration Handler
  const handleCustomerRegister = (customerInfo) => {
    setCustomerData(customerInfo);
    setShowCustomerRegistration(false);
    
    // Save customer to registered customers list (server database)
    const savedCustomers = JSON.parse(localStorage.getItem('registeredCustomers') || '[]');
    
    // Check if customer already exists
    const existingCustomerIndex = savedCustomers.findIndex(
      customer => customer.phoneNumber === customerInfo.phoneNumber
    );
    
    if (existingCustomerIndex !== -1) {
      // Update existing customer
      savedCustomers[existingCustomerIndex] = customerInfo;
    } else {
      // Add new customer
      savedCustomers.push(customerInfo);
    }
    
    localStorage.setItem('registeredCustomers', JSON.stringify(savedCustomers));
    
    // Also save to customerData for current session
    localStorage.setItem('customerData', JSON.stringify(customerInfo));
    
    alert(`Registration successful! Welcome, ${customerInfo.name}! You can now access all registered shops.`);
    
    // Execute the pending contact action
    if (pendingContactAction && pendingShop) {
      switch (pendingContactAction) {
        case 'call':
          handleCallShop(pendingShop.phoneNumber);
          break;
        case 'whatsapp':
          handleWhatsApp(pendingShop.phoneNumber, pendingShop);
          break;
        case 'telegram':
          handleTelegram(pendingShop.phoneNumber, pendingShop);
          break;
        default:
          break;
      }
      
      // Clear pending action
      setPendingContactAction(null);
      setPendingShop(null);
    }
    
    setPendingShopView(null);
  };

  const handleCustomerRegistrationClose = () => {
    // Don't allow closing without registration
    // Customer must register to access shops
    // Clear pending shop view if they try to close
    setPendingShopView(null);
  };

  // Registration Choice Modal Handlers
  const handleAlreadyRegistered = () => {
    // In a real app, this would check for existing customer login
    // For now, we'll prompt for name and phone to verify against localStorage
    setShowRegistrationChoice(false);
    const customerName = prompt('Please enter your registered name:');
    const customerPhone = prompt('Please enter your registered phone number:');
    
    if (customerName && customerPhone) {
      // Check if this customer exists in localStorage (acting as server)
      const savedCustomers = JSON.parse(localStorage.getItem('registeredCustomers') || '[]');
      const existingCustomer = savedCustomers.find(customer => 
        customer.name === customerName && customer.phoneNumber === customerPhone
      );
      
      if (existingCustomer) {
        // Customer found - set as logged in and allow access to all shops
        setCustomerData(existingCustomer);
        localStorage.setItem('customerData', JSON.stringify(existingCustomer));
        alert(`Welcome back, ${existingCustomer.name}! You can now access all registered shops.`);
      } else {
        // Customer not found - ask to register
        alert('No registered customer found with these details. Please register first.');
        setShowRegistrationChoice(true);
      }
    }
  };

  const handleRegisterNew = () => {
    setShowRegistrationChoice(false);
    setShowCustomerRegistration(true);
  };

  const handleCloseRegistrationChoice = () => {
    setShowRegistrationChoice(false);
    setPendingShopView(null);
  };

  // Enhanced Login Handlers
  const handleLoginByPhone = () => {
    const phoneNumber = prompt('Please enter your registered phone number:');
    if (phoneNumber) {
      // Check if this phone number exists in localStorage
      const savedCustomers = JSON.parse(localStorage.getItem('registeredCustomers') || '[]');
      const existingCustomer = savedCustomers.find(customer => 
        customer.phoneNumber === phoneNumber
      );
      
      if (existingCustomer) {
        setCustomerData(existingCustomer);
        localStorage.setItem('customerData', JSON.stringify(existingCustomer));
        setShowRegistrationChoice(false);
        alert(`Welcome back, ${existingCustomer.name}! You can now access all shop features.`);
      } else {
        alert('No account found with this phone number. Please register first.');
      }
    }
  };

  const handleLoginByEmail = () => {
    const email = prompt('Please enter your registered email:');
    if (email) {
      // Check if this email exists in localStorage
      const savedCustomers = JSON.parse(localStorage.getItem('registeredCustomers') || '[]');
      const existingCustomer = savedCustomers.find(customer => 
        customer.email === email
      );
      
      if (existingCustomer) {
        setCustomerData(existingCustomer);
        localStorage.setItem('customerData', JSON.stringify(existingCustomer));
        setShowRegistrationChoice(false);
        alert(`Welcome back, ${existingCustomer.name}! You can now access all shop features.`);
      } else {
        alert('No account found with this email. Please register first.');
      }
    }
  };

  const proceedWithShopAction = (shop) => {
    // Track the shop view
    trackShopView(shop);
    
    // Track shop updates for customer notifications
    trackShopUpdates(shop);
    
    // Mark updates as seen when customer views the shop
    const shopId = shop.id || shop.shopName;
    markShopUpdatesAsSeen(shopId);
    
    setSelectedShop(shop);
    setShowShopDetails(true);
  };

  // Shop Update Tracking Functions
  const trackShopUpdates = (shop) => {
    if (!customerData) return;
    
    const shopId = shop.id || shop.shopName;
    const currentTime = new Date().toISOString();
    
    try {
      // Get current shop state (only store essential data to avoid quota issues)
      const currentShopState = {
        productCount: shop.products ? shop.products.length : 0,
        lastUpdated: shop.updatedAt || shop.registrationDate || currentTime,
        productIds: shop.products ? shop.products.slice(0, 10).map(p => p.id) : [], // Only store first 10 product IDs
        hash: shop.products ? generateShopHash(shop.products) : 'no-products' // Hash to detect changes
      };
      
      // Get previous shop state
      const previousShopState = shopUpdates[shopId];
      
      if (previousShopState) {
        // Check for updates
        const updates = detectShopUpdates(previousShopState, currentShopState);
        
        if (updates.hasUpdates) {
          // Add to unseen updates (limit size)
          const updatedUnseenUpdates = {
            ...unseenUpdates,
            [shopId]: {
              ...updates,
              detectedAt: currentTime,
              customerNotified: false
            }
          };
          
          // Limit unseen updates size to prevent quota issues
          const limitedUnseenUpdates = limitStorageSize(updatedUnseenUpdates);
          setUnseenUpdates(limitedUnseenUpdates);
          localStorage.setItem('customerUnseenUpdates', JSON.stringify(limitedUnseenUpdates));
          
          // Send notification to customer
          if (!updates.customerNotified) {
            sendShopUpdateNotification(shop, updates);
          }
        }
      }
      
      // Update shop state (limit size)
      const updatedShopUpdates = {
        ...shopUpdates,
        [shopId]: currentShopState
      };
      
      // Limit shop updates size to prevent quota issues
      const limitedShopUpdates = limitStorageSize(updatedShopUpdates);
      setShopUpdates(limitedShopUpdates);
      localStorage.setItem('customerShopUpdates', JSON.stringify(limitedShopUpdates));
      
    } catch (error) {
      console.error('Error tracking shop updates:', error);
      
      // If quota exceeded, clear old data and try again
      if (error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded, clearing old data...');
        localStorage.removeItem('customerShopUpdates');
        localStorage.removeItem('customerUnseenUpdates');
        setShopUpdates({});
        setUnseenUpdates({});
        
        // Try again with minimal data
        const minimalState = {
          [shopId]: {
            productCount: shop.products ? shop.products.length : 0,
            lastUpdated: currentTime,
            hash: shop.products ? generateShopHash(shop.products) : 'no-products'
          }
        };
        
        try {
          localStorage.setItem('customerShopUpdates', JSON.stringify(minimalState));
          setShopUpdates(minimalState);
        } catch (retryError) {
          console.error('Failed to save even minimal data:', retryError);
        }
      }
    }
  };

  // Helper function to generate hash for products
  const generateShopHash = (products) => {
    if (!products || products.length === 0) return 'empty';
    
    // Create a simple hash from product IDs and update times
    const hashData = products.slice(0, 5).map(p => `${p.id}:${p.updatedAt || p.createdAt || ''}`).join('|');
    return btoa(hashData).substring(0, 20); // Limit hash length
  };

  // Helper function to limit storage size
  const limitStorageSize = (data, maxItems = 50) => {
    const entries = Object.entries(data);
    if (entries.length <= maxItems) return data;
    
    // Keep only the most recent items
    const sortedEntries = entries.sort((a, b) => {
      const aTime = a[1].detectedAt || a[1].lastUpdated || '';
      const bTime = b[1].detectedAt || b[1].lastUpdated || '';
      return bTime.localeCompare(aTime);
    });
    
    const limitedData = {};
    sortedEntries.slice(0, maxItems).forEach(([key, value]) => {
      limitedData[key] = value;
    });
    
    return limitedData;
  };

  const detectShopUpdates = (previousState, currentState) => {
    const updates = {
      hasUpdates: false,
      newProducts: [],
      updatedProducts: [],
      removedProducts: [],
      totalNewProducts: 0
    };
    
    // Use hash comparison for efficient update detection
    if (previousState.hash !== currentState.hash) {
      updates.hasUpdates = true;
      
      // Calculate product count changes
      if (currentState.productCount > previousState.productCount) {
        updates.totalNewProducts = currentState.productCount - previousState.productCount;
      }
      
      // Note: We don't track individual product details anymore to save space
      // Just track that there are updates and the count difference
    }
    
    return updates;
  };

  const sendShopUpdateNotification = (shop, updates) => {
    const notification = {
      id: Date.now() + Math.random(),
      type: 'shop_update',
      title: '🏪 Shop Updated!',
      message: `${shop.shopName} has ${updates.totalNewProducts} new product${updates.totalNewProducts > 1 ? 's' : ''}!`,
      data: {
        shopId: shop.id || shop.shopName,
        shopName: shop.shopName,
        updates: updates
      },
      timestamp: new Date().toISOString(),
      read: false
    };
    
    const updatedNotifications = [notification, ...notifications];
    setNotifications(updatedNotifications);
    setUnreadCount(prev => prev + 1);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    // Update unseen updates to mark as notified
    const updatedUnseenUpdates = {
      ...unseenUpdates,
      [shop.id || shop.shopName]: {
        ...unseenUpdates[shop.id || shop.shopName],
        customerNotified: true
      }
    };
    setUnseenUpdates(updatedUnseenUpdates);
    localStorage.setItem('customerUnseenUpdates', JSON.stringify(updatedUnseenUpdates));
  };

  const markShopUpdatesAsSeen = (shopId) => {
    const updatedUnseenUpdates = { ...unseenUpdates };
    delete updatedUnseenUpdates[shopId];
    setUnseenUpdates(updatedUnseenUpdates);
    localStorage.setItem('customerUnseenUpdates', JSON.stringify(updatedUnseenUpdates));
  };

  const getUnseenUpdateCount = (shopId) => {
    const updates = unseenUpdates[shopId];
    if (!updates) return 0;
    return updates.totalNewProducts || 0;
  };

  // Shop View Tracking Functions
  const trackShopView = (shop) => {
    const shopId = shop.id || shop.shopName;
    const currentTime = new Date().toISOString();
    const viewerInfo = {
      shopId: shopId,
      shopName: shop.shopName,
      viewerName: customerData?.name || 'Guest User',
      viewerEmail: customerData?.phoneNumber || 'guest@example.com',
      viewerLocation: customerData?.location || 'Unknown',
      timestamp: currentTime,
      sessionId: Date.now()
    };

    // Update shop views
    const updatedShopViews = {
      ...shopViews,
      [shopId]: {
        totalViews: (shopViews[shopId]?.totalViews || 0) + 1,
        lastViewed: currentTime,
        viewers: [...(shopViews[shopId]?.viewers || []), viewerInfo]
      }
    };
    setShopViews(updatedShopViews);
    localStorage.setItem('shopViews', JSON.stringify(updatedShopViews));

    // Update view history
    const updatedViewHistory = [viewerInfo, ...viewHistory].slice(0, 100); // Keep last 100 views
    setViewHistory(updatedViewHistory);
    localStorage.setItem('viewHistory', JSON.stringify(updatedViewHistory));

    // Add notification for shop owner (in real app, this would be sent to the shop owner)
    addNotification(
      'shop_view',
      '👁️ Shop Viewed!',
      `${viewerInfo.viewerName} viewed your shop "${shop.shopName}"`,
      {
        shopId: shopId,
        shopName: shop.shopName,
        viewerName: viewerInfo.viewerName,
        timestamp: currentTime
      }
    );
  };

  const getShopViewStats = (shop) => {
    const shopId = shop.id || shop.shopName;
    const stats = shopViews[shopId];
    
    if (!stats) {
      return {
        totalViews: 0,
        lastViewed: null,
        recentViewers: []
      };
    }

    const recentViewers = stats.viewers
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5); // Show last 5 viewers

    return {
      totalViews: stats.totalViews,
      lastViewed: stats.lastViewed,
      recentViewers: recentViewers
    };
  };

  const formatViewTime = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const viewTime = new Date(timestamp);
    const diffMs = now - viewTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return viewTime.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: viewTime.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Comment and Communication Functions
  const handleAddComment = (shop) => {
    if (!newComment.trim()) {
      alert('Please write a comment before posting.');
      return;
    }

    const shopId = shop.id || shop.shopName;
    const comment = {
      id: Date.now(),
      shopId: shopId,
      shopName: shop.shopName,
      authorName: 'Guest User', // In real app, get from user session
      authorEmail: 'guest@example.com', // In real app, get from user session
      content: newComment.trim(),
      timestamp: new Date().toISOString(),
      replies: []
    };

    const updatedComments = {
      ...comments,
      [shopId]: [...(comments[shopId] || []), comment]
    };

    setComments(updatedComments);
    localStorage.setItem('shopComments', JSON.stringify(updatedComments));
    setNewComment('');

    // Add notification for shop owner
    addNotification(
      'comment',
      '💬 New Comment!',
      `${comment.authorName} commented on your shop "${shop.shopName}": "${comment.content.substring(0, 50)}..."`,
      {
        shopId: shopId,
        shopName: shop.shopName,
        commentId: comment.id,
        authorName: comment.authorName,
        content: comment.content
      }
    );

    alert('✅ Comment posted successfully!');
  };

  const handleReplyToComment = (shop, commentId, replyContent) => {
    if (!replyContent.trim()) {
      alert('Please write a reply before posting.');
      return;
    }

    const shopId = shop.id || shop.shopName;
    const reply = {
      id: Date.now(),
      authorName: 'Guest User', // In real app, get from user session
      authorEmail: 'guest@example.com', // In real app, get from user session
      content: replyContent.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedComments = { ...comments };
    const shopComments = updatedComments[shopId] || [];
    const commentIndex = shopComments.findIndex(c => c.id === commentId);
    
    if (commentIndex !== -1) {
      shopComments[commentIndex].replies.push(reply);
      updatedComments[shopId] = shopComments;
      
      setComments(updatedComments);
      localStorage.setItem('shopComments', JSON.stringify(updatedComments));

      // Add notification for shop owner
      addNotification(
        'comment_reply',
        '💬 Comment Reply!',
        `${reply.authorName} replied to a comment on "${shop.shopName}"`,
        {
          shopId: shopId,
          shopName: shop.shopName,
          commentId: commentId,
          replyId: reply.id,
          authorName: reply.authorName
        }
      );

      alert('✅ Reply posted successfully!');
    }
  };

  const handleOpenComments = (shop) => {
    // Check if customer is registered
    if (!customerData) {
      setPendingShopView(shop);
      setShowRegistrationChoice(true);
      return;
    }
    
    setSelectedShopForComments(shop);
    setShowComments(true);
  };

  const handleCloseComments = () => {
    setShowComments(false);
    setSelectedShopForComments(null);
    setNewComment('');
  };

  const handleOpenDirectMessage = (shop) => {
    // Check if shop is disabled by admin
    if (shop.isDisabled) {
      alert('⚠️ This shop has been temporarily disabled by the administrator. You cannot contact this shop until it is re-enabled.');
      return;
    }
    
    // Check if customer is registered
    if (!customerData) {
      setPendingShopView(shop);
      setShowRegistrationChoice(true);
      return;
    }
    
    setSelectedShopForMessage(shop);
    setShowMessageModal(true);
    setDirectMessage('');
  };

  const handleCloseDirectMessage = () => {
    setShowMessageModal(false);
    setSelectedShopForMessage(null);
    setDirectMessage('');
  };

  const handleSendDirectMessage = (shop) => {
    // Check if shop is disabled by admin
    if (shop.isDisabled) {
      alert('⚠️ This shop has been temporarily disabled by the administrator. You cannot contact this shop until it is re-enabled.');
      return;
    }
    
    if (!directMessage.trim()) {
      alert('Please write a message before sending.');
      return;
    }

    // Check if user already sent a message to this shop recently (within 5 minutes)
    const shopId = shop.id || shop.shopName;
    const existingMessages = JSON.parse(localStorage.getItem('directMessages') || '[]');
    const recentMessage = existingMessages.find(msg => 
      msg.shopId === shopId && 
      msg.senderName === 'Guest User' && 
      (Date.now() - new Date(msg.timestamp).getTime()) < 5 * 60 * 1000 // 5 minutes
    );

    if (recentMessage) {
      alert('⏰ You recently sent a message to this shop. Please wait a few minutes before sending another message.');
      return;
    }

    const message = {
      id: Date.now(),
      shopId: shopId,
      shopName: shop.shopName,
      senderName: 'Guest User', // In real app, get from user session
      senderEmail: 'guest@example.com', // In real app, get from user session
      recipientName: shop.ownerName,
      recipientEmail: shop.email || 'shop@example.com',
      content: directMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'direct_message',
      status: 'sent',
      deliveryStatus: {
        sent: true,
        delivered: false,
        seen: false,
        sentAt: new Date().toISOString(),
        deliveredAt: null,
        seenAt: null
      },
      viewCount: 0 // Track how many times customer views the conversation
    };

    // Store message in localStorage (in real app, this would go to a backend)
    const updatedMessages = [message, ...existingMessages];
    localStorage.setItem('directMessages', JSON.stringify(updatedMessages));

    // Simulate message delivery after 2 seconds
    setTimeout(() => {
      const messages = JSON.parse(localStorage.getItem('directMessages') || '[]');
      const messageIndex = messages.findIndex(m => m.id === message.id);
      if (messageIndex !== -1) {
        messages[messageIndex].deliveryStatus.delivered = true;
        messages[messageIndex].deliveryStatus.deliveredAt = new Date().toISOString();
        localStorage.setItem('directMessages', JSON.stringify(messages));
        
        // Add delivery notification
        addNotification(
          'message_delivered',
          '✅ Message Delivered!',
          `Your message to ${shop.shopName} has been delivered`,
          {
            messageId: message.id,
            shopId: shopId,
            shopName: shop.shopName,
            status: 'delivered'
          }
        );
      }
    }, 2000);

    // Simulate message seen after 5 seconds (in real app, this would be when shop owner reads it)
    setTimeout(() => {
      const messages = JSON.parse(localStorage.getItem('directMessages') || '[]');
      const messageIndex = messages.findIndex(m => m.id === message.id);
      if (messageIndex !== -1) {
        messages[messageIndex].deliveryStatus.seen = true;
        messages[messageIndex].deliveryStatus.seenAt = new Date().toISOString();
        localStorage.setItem('directMessages', JSON.stringify(messages));
        
        // Add seen notification
        addNotification(
          'message_seen',
          '👁️ Message Seen!',
          `${shop.ownerName} has seen your message`,
          {
            messageId: message.id,
            shopId: shopId,
            shopName: shop.shopName,
            status: 'seen'
          }
        );
      }
    }, 5000);

    // Add notification for shop owner
    addNotification(
      'direct_message',
      '📧 Direct Message!',
      `${message.senderName} sent you a direct message: "${message.content.substring(0, 50)}..."`,
      {
        shopId: message.shopId,
        shopName: message.shopName,
        messageId: message.id,
        senderName: message.senderName,
        content: message.content
      }
    );

    alert(`✅ Message sent to ${shop.ownerName} at ${shop.shopName}! Status: Sent`);
    handleCloseDirectMessage();
  };

  // Message Editing Functions
  const handleEditMessage = (message, shop) => {
    setEditingMessage(message);
    setEditedContent(message.content);
  };

  const handleSaveEdit = (shop) => {
    if (!editedContent.trim() || !editingMessage) {
      alert('Please write a message before saving.');
      return;
    }

    const shopId = shop.id || shop.shopName;
    const allMessages = JSON.parse(localStorage.getItem('directMessages') || '[]');
    const messageIndex = allMessages.findIndex(m => m.id === editingMessage.id);

    if (messageIndex !== -1) {
      // Create edit history
      const editHistory = allMessages[messageIndex].editHistory || [];
      editHistory.push({
        originalContent: allMessages[messageIndex].content,
        editedAt: new Date().toISOString(),
        editNumber: editHistory.length + 1
      });

      // Update message with edit info
      allMessages[messageIndex] = {
        ...allMessages[messageIndex],
        content: editedContent.trim(),
        lastEditedAt: new Date().toISOString(),
        editHistory: editHistory,
        isEdited: true
      };

      localStorage.setItem('directMessages', JSON.stringify(allMessages));

      // Add notification for shop owner about edit
      addNotification(
        'message_edited',
        '✏️ Message Edited!',
        `${allMessages[messageIndex].senderName} edited their message: "${editedContent.substring(0, 50)}..."`,
        {
          messageId: editingMessage.id,
          shopId: shopId,
          shopName: shop.shopName,
          senderName: allMessages[messageIndex].senderName,
          originalContent: allMessages[messageIndex].content,
          editedContent: editedContent.trim(),
          editedAt: new Date().toISOString()
        }
      );

      alert('✅ Message edited successfully!');
      setEditingMessage(null);
      setEditedContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditedContent('');
  };

  const handleDeleteMessage = (message, shop) => {
    // Create custom confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this message? This action cannot be undone.');
    
    if (!isConfirmed) {
      return;
    }

    const shopId = shop.id || shop.shopName;
    const allMessages = JSON.parse(localStorage.getItem('directMessages') || '[]');
    const updatedMessages = allMessages.filter(m => m.id !== message.id);

    localStorage.setItem('directMessages', JSON.stringify(updatedMessages));

    // Add notification for shop owner about deletion
    addNotification(
      'message_deleted',
      '🗑️ Message Deleted!',
      `${message.senderName} deleted their message to ${shop.shopName}`,
      {
        messageId: message.id,
        shopId: shopId,
        shopName: shop.shopName,
        senderName: message.senderName,
        deletedAt: new Date().toISOString()
      }
    );

    alert('✅ Message deleted successfully!');
  };

  const getShopComments = (shop) => {
    const shopId = shop.id || shop.shopName;
    return comments[shopId] || [];
  };

  const getMessageHistory = (shop) => {
    const shopId = shop.id || shop.shopName;
    const allMessages = JSON.parse(localStorage.getItem('directMessages') || '[]');
    return allMessages.filter(msg => msg.shopId === shopId && msg.senderName === 'Guest User');
  };

  const getDeliveryStatusIcon = (deliveryStatus) => {
    if (deliveryStatus.seen) {
      return '👁️'; // Seen
    } else if (deliveryStatus.delivered) {
      return '✅'; // Delivered
    } else if (deliveryStatus.sent) {
      return '📤'; // Sent
    }
    return '⏳'; // Pending
  };

  const getDeliveryStatusText = (deliveryStatus) => {
    if (deliveryStatus.seen) {
      return `Seen ${formatCommentTime(deliveryStatus.seenAt)}`;
    } else if (deliveryStatus.delivered) {
      return `Delivered ${formatCommentTime(deliveryStatus.deliveredAt)}`;
    } else if (deliveryStatus.sent) {
      return `Sent ${formatCommentTime(deliveryStatus.sentAt)}`;
    }
    return 'Sending...';
  };

  const formatCommentTime = (timestamp) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffMs = now - commentTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return commentTime.toLocaleDateString();
  };

  const formatLastUpdated = (shop) => {
    // Check if shop has updatedAt timestamp, otherwise use createdAt
    const timestamp = shop.updatedAt || shop.createdAt || shop.registrationDate;
    if (!timestamp) return 'Recently';
    
    const now = new Date();
    const updatedTime = new Date(timestamp);
    const diffMs = now - updatedTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleCompareProduct = (product) => {
    setComparisonProduct(product);
    setShowComparison(true);
  };

  const findSameProducts = (productName) => {
    const sameProducts = [];
    registeredShops.forEach(shop => {
      if (shop.products) {
        shop.products.forEach(product => {
          // Check if product names are similar (case-insensitive, contains check)
          if (product.name.toLowerCase().includes(productName.toLowerCase()) || 
              productName.toLowerCase().includes(product.name.toLowerCase())) {
            sameProducts.push({
              ...product,
              shopName: shop.shopName,
              shopId: shop.id,
              shopAddress: shop.shopAddress,
              shopCity: shop.city,
              shopTown: shop.town,
              shopPhone: shop.phoneNumber
            });
          }
        });
      }
    });
    return sameProducts;
  };

  const isShopSaved = (shopId) => {
    const savedShops = JSON.parse(localStorage.getItem('savedShops') || '[]');
    return savedShops.some(savedShop => savedShop.id === shopId);
  };

  const getMapUrl = (shop) => {
    // Create Google Maps URL with shop address
    const address = encodeURIComponent(`${shop.shopAddress}, ${shop.city}, ${shop.town}, Ethiopia`);
    return `https://www.google.com/maps/search/?api=1&query=${address}`;
  };

  const getDirectionsUrl = (shop) => {
    // Create Google Maps directions URL
    const address = encodeURIComponent(`${shop.shopAddress}, ${shop.city}, ${shop.town}, Ethiopia`);
    return `https://www.google.com/maps/dir/?api=1&destination=${address}`;
  };

  // Advanced Search Handlers
  const handleSearchQueryChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Generate smart suggestions
    if (query.length >= 2) {
      generateSearchSuggestions(query);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  };

  const generateSearchSuggestions = (query) => {
    const allProducts = [];
    const allShops = registeredShops;
    
    // Collect all products from all shops
    allShops.forEach(shop => {
      if (shop.products) {
        shop.products.forEach(product => {
          allProducts.push({
            ...product,
            shopName: shop.shopName,
            shopCity: shop.city,
            shopTown: shop.town
          });
        });
      }
    });
    
    // Filter products based on query
    const filteredProducts = allProducts.filter(product => {
      const lowerQuery = query.toLowerCase();
      return (
        product.name.toLowerCase().includes(lowerQuery) ||
        (product.brand && product.brand.toLowerCase().includes(lowerQuery)) ||
        (product.model && product.model.toLowerCase().includes(lowerQuery))
      );
    });
    
    // Sort by relevance (exact matches first, then starts with, then contains)
    const sortedProducts = filteredProducts.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const lowerQuery = query.toLowerCase();
      
      // Exact match gets highest priority
      if (aName === lowerQuery && bName !== lowerQuery) return -1;
      if (bName === lowerQuery && aName !== lowerQuery) return 1;
      
      // Starts with gets second priority
      if (aName.startsWith(lowerQuery) && !bName.startsWith(lowerQuery)) return -1;
      if (bName.startsWith(lowerQuery) && !aName.startsWith(lowerQuery)) return 1;
      
      // Alphabetical as fallback
      return aName.localeCompare(bName);
    });
    
    // Return top 5 suggestions
    setSearchSuggestions(sortedProducts.slice(0, 5));
  };

  const handleSuggestionClick = (product) => {
    setSearchQuery(product.name);
    setShowSuggestions(false);
    setSearchSuggestions([]);
  };

  const handleSearchBlur = () => {
    // Delay hiding suggestions to allow click on suggestion
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Voice Search Functions
  const startVoiceSearch = () => {
    if (!voiceSupported) {
      alert('Voice search is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = () => {
      setIsListening(true);
      console.log('Voice search started...');
    };
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Voice search result:', transcript);
      setSearchQuery(transcript);
      setIsListening(false);
      
      // Generate suggestions for the voice query
      if (transcript.length >= 2) {
        generateSearchSuggestions(transcript);
        setShowSuggestions(true);
      }
      
      // Show success feedback
      alert(`🎤 Voice search successful: "${transcript}"`);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'no-speech') {
        alert('🎤 No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        alert('🎤 Microphone access denied. Please allow microphone access to use voice search.');
      } else if (event.error === 'network') {
        alert('🎤 Network error. Please check your internet connection and try again.');
      } else {
        alert('🎤 Voice search failed. Please try again.');
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
      console.log('Voice search ended.');
    };
    
    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
      alert('🎤 Failed to start voice search. Please try again.');
    }
  };

  const stopVoiceSearch = () => {
    setIsListening(false);
    alert('🎤 Voice search stopped.');
  };

  const handleAdvancedFilterChange = (field, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleAdvancedSearch = () => {
    const newState = !showAdvancedSearch;
    setShowAdvancedSearch(newState);
    
    if (newState) {
      console.log('Advanced search filters opened');
      // Scroll to search section to show filters
      setTimeout(() => {
        const searchSection = document.querySelector('.search-section');
        if (searchSection) {
          searchSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    } else {
      console.log('Advanced search filters closed');
    }
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({
      brand: '',
      model: '',
      ram: '',
      storage: '',
      battery: '',
      camera: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      searchBy: 'all'
    });
    setSearchQuery('');
  };

  const filterProducts = (products) => {
    if (!products) return [];
    
    return products.filter(product => {
      // Basic search query filter
      const matchesQuery = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.model && product.model.toLowerCase().includes(searchQuery.toLowerCase()));

      // Advanced filters
      const matchesBrand = !advancedFilters.brand || 
        (product.brand && product.brand.toLowerCase() === advancedFilters.brand.toLowerCase());
      
      const matchesModel = !advancedFilters.model || 
        (product.model && product.model.toLowerCase().includes(advancedFilters.model.toLowerCase()));
      
      const matchesRAM = !advancedFilters.ram || 
        (product.ram && product.ram.toLowerCase().includes(advancedFilters.ram.toLowerCase()));
      
      const matchesStorage = !advancedFilters.storage || 
        (product.storage && product.storage.toLowerCase().includes(advancedFilters.storage.toLowerCase()));
      
      const matchesBattery = !advancedFilters.battery || 
        (product.battery && product.battery.toLowerCase().includes(advancedFilters.battery.toLowerCase()));
      
      const matchesCamera = !advancedFilters.camera || 
        (product.camera && product.camera.toLowerCase().includes(advancedFilters.camera.toLowerCase()));
      
      const matchesMinPrice = !advancedFilters.minPrice || 
        (product.price && parseFloat(product.price) >= parseFloat(advancedFilters.minPrice));
      
      const matchesMaxPrice = !advancedFilters.maxPrice || 
        (product.price && parseFloat(product.price) <= parseFloat(advancedFilters.maxPrice));
      
      const matchesCondition = !advancedFilters.condition || 
        (product.condition && product.condition.toLowerCase() === advancedFilters.condition.toLowerCase());

      return matchesQuery && matchesBrand && matchesModel && matchesRAM && 
             matchesStorage && matchesBattery && matchesCamera && 
             matchesMinPrice && matchesMaxPrice && matchesCondition;
    });
  };

  const getFilteredShops = () => {
    let filteredShops = registeredShops;
    
    // Apply city filtering
    if (selectedCity !== 'all') {
      filteredShops = filteredShops.filter(shop => shop.city === selectedCity);
    }
    
    // Apply search and advanced filters
    if (!searchQuery && !Object.values(advancedFilters).some(value => value !== '' && value !== 'all')) {
      return filteredShops;
    }

    return filteredShops.map(shop => ({
      ...shop,
      products: filterProducts(shop.products || [])
    })).filter(shop => {
      // Show shop if it has filtered products or if search matches shop info
      const hasFilteredProducts = shop.products && shop.products.length > 0;
      const shopMatchesSearch = searchQuery && (
        shop.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (shop.shopDescription && shop.shopDescription.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      return hasFilteredProducts || shopMatchesSearch;
    });
  };

  // Location-based Search Handlers
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Haversine formula to calculate distance between two points
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const getUserLocation = () => {
    setIsGettingLocation(true);
    setLocationError('');
    
    if (!navigator.geolocation) {
      const errorMsg = '📍 Geolocation is not supported by your browser. Please try Chrome or Firefox.';
      setLocationError(errorMsg);
      setIsGettingLocation(false);
      alert(errorMsg);
      return;
    }

    console.log('Requesting user location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        setUserLocation(location);
        findNearbyShops(location);
        setIsGettingLocation(false);
        console.log('Location obtained successfully:', location);
        alert(`📍 Location found! Finding nearby shops...`);
      },
      (error) => {
        let errorMessage = '📍 Unable to get your location';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '📍 Location access denied. Please enable location services in your browser settings and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '📍 Location information unavailable. Please check your internet connection.';
            break;
          case error.TIMEOUT:
            errorMessage = '📍 Location request timed out. Please try again.';
            break;
        }
        setLocationError(errorMessage);
        setIsGettingLocation(false);
        console.error('Location error:', error);
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const findNearbyShops = (userLoc) => {
    // Add mock coordinates for Ethiopian cities (in real app, this would come from backend)
    const cityCoordinates = {
      'Addis Ababa': { lat: 9.1450, lon: 40.4897 },
      'Dilla': { lat: 6.4167, lon: 38.3167 },
      'Bahir Dar': { lat: 11.5936, lon: 37.3939 },
      'Gonder': { lat: 12.6030, lon: 37.4667 },
      'Mekelle': { lat: 13.4967, lon: 39.4753 },
      'Hawassa': { lat: 7.0595, lon: 38.4758 }
    };

    const shopsWithDistance = registeredShops.map(shop => {
      let shopCoords = null;
      
      // Try to get coordinates from city
      if (cityCoordinates[shop.city]) {
        shopCoords = cityCoordinates[shop.city];
      } else {
        // Generate random coordinates for demo (in real app, use actual shop coordinates)
        shopCoords = {
          lat: 6.0 + Math.random() * 6, // Ethiopia latitude range
          lon: 35.0 + Math.random() * 8  // Ethiopia longitude range
        };
      }

      const distance = calculateDistance(
        userLoc.lat, userLoc.lon,
        shopCoords.lat, shopCoords.lon
      );

      return {
        ...shop,
        distance: distance,
        coordinates: shopCoords
      };
    });

    // Sort by distance and take nearest 10
    const sortedShops = shopsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);

    setNearbyShops(sortedShops);
    setShowNearbyShops(true);
  };

  const toggleNearbyShops = () => {
    if (!showNearbyShops) {
      console.log('Getting user location for nearby shops...');
      getUserLocation();
    } else {
      console.log('Hiding nearby shops');
      setShowNearbyShops(false);
      setLocationError('');
    }
  };

  const getDirectionsToShop = (shop) => {
    if (userLocation && shop.coordinates) {
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lon}&destination=${shop.coordinates.lat},${shop.coordinates.lon}`;
      window.open(directionsUrl, '_blank');
    }
  };

  // Analytics Handlers
  const incrementProductView = (shopId, productId) => {
    // Store product views in localStorage
    const productViews = JSON.parse(localStorage.getItem('productViews') || '{}');
    const viewKey = `${shopId}_${productId}`;
    productViews[viewKey] = (productViews[viewKey] || 0) + 1;
    localStorage.setItem('productViews', JSON.stringify(productViews));
  };

  const getShopAnalytics = (shop) => {
    const productViews = JSON.parse(localStorage.getItem('productViews') || '{}');
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
    const customerMessages = JSON.parse(localStorage.getItem('customerMessages') || '{}');
    
    // Calculate product views for this shop
    let totalViews = 0;
    let mostViewedProduct = null;
    let maxViews = 0;
    
    if (shop.products) {
      shop.products.forEach(product => {
        const viewKey = `${shop.id}_${product.id || product.name}`;
        const views = productViews[viewKey] || 0;
        totalViews += views;
        
        if (views > maxViews) {
          maxViews = views;
          mostViewedProduct = product;
        }
      });
    }
    
    // Calculate wishlist saves for this shop
    const wishlistSaves = wishlistItems.filter(item => item.shopId === shop.id).length;
    
    // Calculate customer messages for this shop
    const messageCount = customerMessages[shop.id] ? customerMessages[shop.id].length : 0;
    
    // Generate mock daily visitors (in real app, this would come from backend)
    const dailyVisitors = Math.floor(Math.random() * 50) + 10; // 10-60 visitors
    
    return {
      productViews: totalViews,
      mostViewedProduct: mostViewedProduct,
      customerMessages: messageCount,
      wishlistSaves: wishlistSaves,
      dailyVisitors: dailyVisitors
    };
  };

  const handleViewProduct = (shop, product) => {
    incrementProductView(shop.id, product.id || product.name);
    // In a real app, this would navigate to product details
    alert(`Viewing product: ${product.name}\nViews: ${getShopAnalytics(shop).productViews}`);
  };

  const handleAddToWishlist = (shop, product) => {
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
    const existingItem = wishlistItems.find(item => 
      item.shopId === shop.id && item.productId === (product.id || product.name)
    );
    
    if (!existingItem) {
      wishlistItems.push({
        shopId: shop.id,
        shopName: shop.shopName,
        productId: product.id || product.name,
        productName: product.name,
        price: product.price,
        addedAt: new Date().toISOString()
      });
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
      alert(`✅ ${product.name} added to wishlist!`);
    } else {
      alert(`❌ ${product.name} is already in your wishlist!`);
    }
  };

  const handleSendMessage = (shop) => {
    // Check if shop is disabled by admin
    if (shop.isDisabled) {
      alert('⚠️ This shop has been temporarily disabled by the administrator. You cannot contact this shop until it is re-enabled.');
      return;
    }
    
    // Check if customer is registered
    if (!customerData) {
      setPendingShopView(shop);
      setShowRegistrationChoice(true);
      return;
    }
    
    // Get customer message
    const message = prompt(`Send a message to ${shop.shopName}:`);
    if (message && message.trim()) {
      // Save message to localStorage (you can integrate with backend later)
      let savedMessages = [];
      try {
        savedMessages = JSON.parse(localStorage.getItem('customerMessages') || '[]');
        if (!Array.isArray(savedMessages)) {
          savedMessages = [];
        }
      } catch (error) {
        savedMessages = [];
      }
      const newMessage = {
        id: Date.now(),
        shopId: shop.id || shop.shopName,
        shopName: shop.shopName,
        customerName: customerData.name,
        customerPhone: customerData.phoneNumber,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
      savedMessages.push(newMessage);
      localStorage.setItem('customerMessages', JSON.stringify(savedMessages));
      
      alert(`Message sent to ${shop.shopName}! They will contact you soon.`);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not available';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Notification System Handlers
  const addNotification = (type, title, message, data = null) => {
    const notification = {
      id: Date.now() + Math.random(),
      type: type, // 'price_drop', 'restock', 'new_product', 'message'
      title: title,
      message: message,
      data: data,
      timestamp: new Date().toISOString(),
      read: false
    };

    const updatedNotifications = [notification, ...notifications];
    setNotifications(updatedNotifications);
    setUnreadCount(prev => prev + 1);

    // Store in localStorage
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        tag: notification.id
      });
    }
  };

  const markNotificationAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    );
    setNotifications(updatedNotifications);
    setUnreadCount(prev => Math.max(0, prev - 1));
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const markAllNotificationsAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const removeNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(notification => 
      notification.id !== notificationId
    );
    setNotifications(updatedNotifications);
    setUnreadCount(prev => Math.max(0, prev - 1));
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.setItem('notifications', JSON.stringify([]));
  };

  const checkForPriceDrops = () => {
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
    const previousPrices = JSON.parse(localStorage.getItem('previousPrices') || '{}');
    
    wishlistItems.forEach(wishlistItem => {
      const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
      shops.forEach(shop => {
        if (shop.products) {
          const product = shop.products.find(p => 
            (p.id || p.name) === wishlistItem.productId && 
            shop.id === wishlistItem.shopId
          );
          
          if (product) {
            const priceKey = `${wishlistItem.shopId}_${wishlistItem.productId}`;
            const previousPrice = previousPrices[priceKey];
            const currentPrice = parseFloat(product.price);
            
            if (previousPrice && currentPrice < previousPrice) {
              const priceDrop = previousPrice - currentPrice;
              const percentageDrop = ((priceDrop / previousPrice) * 100).toFixed(1);
              
              addNotification(
                'price_drop',
                '💰 Price Drop Alert!',
                `${product.name} price dropped by ETB ${priceDrop.toFixed(0)} (${percentageDrop}%) from ${wishlistItem.shopName}`,
                {
                  productId: product.id || product.name,
                  shopId: shop.id,
                  shopName: shop.shopName,
                  oldPrice: previousPrice,
                  newPrice: currentPrice,
                  priceDrop: priceDrop
                }
              );
            }
            
            // Update previous price
            previousPrices[priceKey] = currentPrice;
          }
        }
      });
    });
    
    localStorage.setItem('previousPrices', JSON.stringify(previousPrices));
  };

  const checkForRestocks = () => {
    const previousStock = JSON.parse(localStorage.getItem('previousStock') || '{}');
    const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
    
    shops.forEach(shop => {
      if (shop.products) {
        shop.products.forEach(product => {
          const stockKey = `${shop.id}_${product.id || product.name}`;
          const previousStockLevel = previousStock[stockKey];
          const currentStock = parseInt(product.stock || 0);
          
          if (previousStockLevel !== undefined && currentStock > previousStockLevel && previousStockLevel === 0) {
            addNotification(
              'restock',
              '📦 Product Restocked!',
              `${product.name} is back in stock at ${shop.shopName} (${currentStock} units available)`,
              {
                productId: product.id || product.name,
                shopId: shop.id,
                shopName: shop.shopName,
                stock: currentStock
              }
            );
          }
          
          previousStock[stockKey] = currentStock;
        });
      }
    });
    
    localStorage.setItem('previousStock', JSON.stringify(previousStock));
  };

  const checkForNewProducts = () => {
    const lastCheck = localStorage.getItem('lastProductCheck');
    const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
    
    shops.forEach(shop => {
      if (shop.products) {
        shop.products.forEach(product => {
          const productAddedTime = new Date(product.addedAt || Date.now());
          const lastCheckTime = lastCheck ? new Date(lastCheck) : new Date(0);
          
          if (productAddedTime > lastCheckTime) {
            addNotification(
              'new_product',
              '🆕 New Product Added!',
              `${product.name} added to ${shop.shopName} - ETB ${product.price}`,
              {
                productId: product.id || product.name,
                shopId: shop.id,
                shopName: shop.shopName,
                price: product.price,
                category: product.category
              }
            );
          }
        });
      }
    });
    
    localStorage.setItem('lastProductCheck', new Date().toISOString());
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  // Initialize notification system
  useEffect(() => {
    // Load existing notifications
    const savedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    setNotifications(savedNotifications);
    setUnreadCount(savedNotifications.filter(n => !n.read).length);

    // Request notification permission
    requestNotificationPermission();

    // Set up periodic checks
    const checkInterval = setInterval(() => {
      checkForPriceDrops();
      checkForRestocks();
      checkForNewProducts();
      
      // Check for shop updates for registered customers
      if (customerData && registeredShops.length > 0) {
        registeredShops.forEach(shop => {
          trackShopUpdates(shop);
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(checkInterval);
  }, [registeredShops]);

  // Check for shop updates when customer data changes or shops load
  useEffect(() => {
    if (customerData && registeredShops.length > 0) {
      registeredShops.forEach(shop => {
        trackShopUpdates(shop);
      });
    }
  }, [customerData, registeredShops]);

  if (loading) {
    return (
      <div className="registered-shops-loading">
        <div className="spinner"></div>
        <p>Loading registered shops...</p>
      </div>
    );
  }

  return (
    <div className="registered-shops">
      <div className="container">
        <div className="registered-shops-header">
          <h2>🏪 Registered Electronics Shops</h2>
          <p>Discover electronics shops and their products across Ethiopia</p>
          <div className="header-actions">
            <div className="shops-count">
              <span className="count-badge">{registeredShops.length}</span>
              <span>Total Shops</span>
            </div>
            
            {/* Notification Bell */}
            <div className="notification-section">
              <button 
                className="notification-bell"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                🔔
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </button>
              
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h4>🔔 Notifications</h4>
                    <div className="notification-actions">
                      {unreadCount > 0 && (
                        <button 
                          className="mark-all-read-btn"
                          onClick={markAllNotificationsAsRead}
                        >
                          Mark all read
                        </button>
                      )}
                      <button 
                        className="clear-all-btn"
                        onClick={clearAllNotifications}
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                  
                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="no-notifications">
                        <div className="no-notifications-icon">🔔</div>
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`notification-item ${!notification.read ? 'unread' : ''}`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="notification-content">
                            <div className="notification-title">
                              <span className="notification-icon">
                                {notification.type === 'price_drop' && '💰'}
                                {notification.type === 'restock' && '📦'}
                                {notification.type === 'new_product' && '🆕'}
                                {notification.type === 'message' && '💬'}
                              </span>
                              <span className="notification-title-text">{notification.title}</span>
                            </div>
                            <p className="notification-message">{notification.message}</p>
                            <span className="notification-time">
                              {formatDateTime(notification.timestamp)}
                            </span>
                          </div>
                          <button 
                            className="remove-notification-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* City Filtering Section */}
        <div className="city-filter-section">
          <div className="city-filter-container">
            <h3>🏙️ Filter by City</h3>
            <div className="city-filter-buttons">
              <button 
                className={`city-filter-btn ${selectedCity === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCity('all')}
              >
                All Cities ({registeredShops.length})
              </button>
              {Object.entries(cityShopCounts).map(([city, count]) => (
                <button 
                  key={city}
                  className={`city-filter-btn ${selectedCity === city ? 'active' : ''}`}
                  onClick={() => setSelectedCity(city)}
                >
                  {city} ({count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Search Section */}
        <div className="search-section">
          <div className="search-container">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by product name, brand, model, or shop name..."
                value={searchQuery}
                onChange={handleSearchQueryChange}
                onBlur={handleSearchBlur}
                className="search-input"
              />
              {voiceSupported && (
                <button 
                  className={`voice-search-btn ${isListening ? 'listening' : ''}`}
                  onClick={isListening ? stopVoiceSearch : startVoiceSearch}
                  title={isListening ? 'Stop voice search' : 'Start voice search'}
                >
                  {isListening ? '🔴' : '🎤'}
                </button>
              )}
              <button 
                className={`advanced-search-toggle ${showAdvancedSearch ? 'active' : ''}`}
                onClick={toggleAdvancedSearch}
              >
                🔍 Advanced Search
              </button>
              <button 
                className={`nearby-shops-toggle ${showNearbyShops ? 'active' : ''}`}
                onClick={toggleNearbyShops}
              >
                {isGettingLocation ? '📍 Getting Location...' : '📍 Shops Near You'}
              </button>
              {(searchQuery || Object.values(advancedFilters).some(value => value !== '' && value !== 'all')) && (
                <button className="clear-search-btn" onClick={clearAdvancedFilters}>
                  ✕ Clear
                </button>
              )}
            </div>
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="search-suggestions">
                <div className="suggestions-header">
                  <span className="suggestions-title">💡 Smart Suggestions</span>
                  <span className="suggestions-count">{searchSuggestions.length} results</span>
                </div>
                <div className="suggestions-list">
                  {searchSuggestions.map((product, index) => (
                    <div 
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(product)}
                    >
                      <div className="suggestion-product">
                        <div className="suggestion-name">{product.name}</div>
                        <div className="suggestion-details">
                          <span className="suggestion-shop">{product.shopName}</span>
                          <span className="suggestion-location">📍 {product.shopCity}, {product.shopTown}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Advanced Search Filters */}
          {showAdvancedSearch && (
            <div className="advanced-search-filters">
              <div className="filters-header">
                <h4>🔍 Advanced Filters</h4>
                <button className="toggle-filters-btn" onClick={toggleAdvancedSearch}>
                  ×
                </button>
              </div>
              <div className="filters-grid">
                <div className="filter-group">
                  <label>Brand</label>
                  <input
                    type="text"
                    placeholder="e.g., Samsung, iPhone, Nokia"
                    value={advancedFilters.brand}
                    onChange={(e) => handleAdvancedFilterChange('brand', e.target.value)}
                    className="filter-input"
                  />
                </div>

                  <div className="filter-group">
                    <label>Model</label>
                    <input
                      type="text"
                      placeholder="e.g., Galaxy S23, iPhone 14"
                      value={advancedFilters.model}
                      onChange={(e) => handleAdvancedFilterChange('model', e.target.value)}
                      className="filter-input"
                    />
                  </div>

                  <div className="filter-group">
                    <label>RAM</label>
                    <select
                      value={advancedFilters.ram}
                      onChange={(e) => handleAdvancedFilterChange('ram', e.target.value)}
                      className="filter-select"
                    >
                      <option value="">Any RAM</option>
                      <option value="2GB">2GB</option>
                      <option value="4GB">4GB</option>
                      <option value="6GB">6GB</option>
                      <option value="8GB">8GB</option>
                      <option value="12GB">12GB</option>
                      <option value="16GB">16GB</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Storage</label>
                    <select
                      value={advancedFilters.storage}
                      onChange={(e) => handleAdvancedFilterChange('storage', e.target.value)}
                      className="filter-select"
                    >
                      <option value="">Any Storage</option>
                      <option value="32GB">32GB</option>
                      <option value="64GB">64GB</option>
                      <option value="128GB">128GB</option>
                      <option value="256GB">256GB</option>
                      <option value="512GB">512GB</option>
                      <option value="1TB">1TB</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Battery</label>
                    <input
                      type="text"
                      placeholder="e.g., 5000mAh, 4000mAh"
                      value={advancedFilters.battery}
                      onChange={(e) => handleAdvancedFilterChange('battery', e.target.value)}
                      className="filter-input"
                    />
                  </div>

                  <div className="filter-group">
                    <label>Camera</label>
                    <input
                      type="text"
                      placeholder="e.g., 48MP, 108MP, Triple Camera"
                      value={advancedFilters.camera}
                      onChange={(e) => handleAdvancedFilterChange('camera', e.target.value)}
                      className="filter-input"
                    />
                  </div>

                  <div className="filter-group">
                    <label>Min Price (ETB)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={advancedFilters.minPrice}
                      onChange={(e) => handleAdvancedFilterChange('minPrice', e.target.value)}
                      className="filter-input"
                    />
                  </div>

                  <div className="filter-group">
                    <label>Max Price (ETB)</label>
                    <input
                      type="number"
                      placeholder="50000"
                      value={advancedFilters.maxPrice}
                      onChange={(e) => handleAdvancedFilterChange('maxPrice', e.target.value)}
                      className="filter-input"
                    />
                  </div>

                  <div className="filter-group">
                    <label>Condition</label>
                    <select
                      value={advancedFilters.condition}
                      onChange={(e) => handleAdvancedFilterChange('condition', e.target.value)}
                      className="filter-select"
                    >
                      <option value="">Any Condition</option>
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="refurbished">Refurbished</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

        {/* Nearby Shops Section */}
        {showNearbyShops && (
          <div className="nearby-shops-section">
            <div className="nearby-shops-header">
              <h3>📍 Shops Near You</h3>
              <p>Discover electronics shops closest to your location</p>
              {userLocation && (
                <div className="user-location-info">
                  <span className="location-coords">
                    📍 Your location: {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)}
                  </span>
                </div>
              )}
            </div>

            {locationError && (
              <div className="location-error">
                <span className="error-icon">⚠️</span>
                <span className="error-message">{locationError}</span>
              </div>
            )}

            {isGettingLocation && (
              <div className="loading-location">
                <div className="loading-spinner"></div>
                <p>Getting your location...</p>
              </div>
            )}

            {!isGettingLocation && !locationError && nearbyShops.length > 0 && (
              <div className="nearby-shops-grid">
                {nearbyShops.map((shop, index) => (
                  <div key={shop.id || index} className="nearby-shop-card">
                    <div className="distance-badge">
                      {shop.distance < 1 ? 
                        `${(shop.distance * 1000).toFixed(0)}m away` : 
                        `${shop.distance.toFixed(1)}km away`
                      }
                    </div>
                    <div className="nearby-shop-info">
                      <h4 className="nearby-shop-name">🏪 {shop.shopName}</h4>
                      <div className="nearby-shop-details">
                        <span className="nearby-shop-address">📍 {shop.city}, {shop.town}</span>
                        <span className="nearby-shop-phone">📞 {shop.phoneNumber}</span>
                        <span className="nearby-shop-owner">👤 {shop.ownerName}</span>
                        <span className="nearby-shop-updated">🔄 Updated: {formatLastUpdated(shop)}</span>
                      </div>
                      <div className="nearby-shop-actions">
                        <button 
                          className="directions-btn"
                          onClick={() => getDirectionsToShop(shop)}
                        >
                          🧭 Get Directions
                        </button>
                        <button 
                          className="call-nearby-btn"
                          onClick={() => handleCallShopWithCheck(shop)}
                        >
                          📞 Call Shop
                        </button>
                        <button 
                          className="view-nearby-btn"
                          onClick={() => handleViewShopDetails(shop)}
                        >
                          👁️ View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isGettingLocation && !locationError && nearbyShops.length === 0 && (
              <div className="no-nearby-shops">
                <div className="no-nearby-icon">📍</div>
                <h4>No shops found near your location</h4>
                <p>Try searching for shops in your area or check back later.</p>
              </div>
            )}
          </div>
        )}

        {registeredShops.length === 0 ? (
          <div className="no-shops">
            <div className="no-shops-icon">🏪</div>
            <h3>No Electronics Shops Registered Yet</h3>
            <p>Be the first to register your electronics shop!</p>
            <button 
              className="register-first-shop-btn"
              onClick={() => window.location.href = '/'}
            >
              Register Your Shop
            </button>
          </div>
        ) : (
          <>
            {/* Search Results Summary */}
            {(searchQuery || Object.values(advancedFilters).some(value => value !== '' && value !== 'all') || selectedCity !== 'all') && (
              <div className="search-results-summary">
                <span className="results-count">
                  {selectedCity !== 'all' && (
                    searchQuery || Object.values(advancedFilters).some(value => value !== '' && value !== 'all')
                      ? `Found ${getFilteredShops().length} shops in ${selectedCity} matching your criteria`
                      : `${selectedCity} has ${getFilteredShops().length} registered shops`
                  )}
                  {selectedCity === 'all' && (
                    searchQuery || Object.values(advancedFilters).some(value => value !== '' && value !== 'all')
                      ? `Found ${getFilteredShops().length} shops matching your criteria`
                      : `Showing all ${getFilteredShops().length} registered shops`
                  )}
                </span>
                {getFilteredShops().length === 0 && (
                  <span className="no-results-message">No shops found matching your criteria</span>
                )}
              </div>
            )}

            <div className={`shops-grid ${selectedCity !== 'all' ? 'horizontal-layout' : ''}`}>
              {getFilteredShops().map((shop, index) => {
                const shopId = shop.id || shop.shopName;
                const unseenCount = getUnseenUpdateCount(shopId);
                
                return (
                  <div key={shop.id || index} className={`shop-card ${unseenCount > 0 ? 'has-updates' : ''} ${shop.isDisabled ? 'disabled' : ''}`}>
                    {unseenCount > 0 && (
                      <div className="update-indicator">
                        <span className="update-badge">{unseenCount}</span>
                        <span className="update-label">NEW</span>
                      </div>
                    )}
                    {shop.isDisabled && (
                      <div className="disabled-overlay">
                        <div className="disabled-badge">
                          <span>⏸️ Shop Disabled</span>
                          <p>This shop has been temporarily disabled by the administrator</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Shop Image Section */}
                    <div className="shop-image-section">
                      {console.log('Rendering shop:', shop.shopName, 'has front image:', !!shop.shopFrontImage)}
                      {console.log('Image URL type:', typeof shop.shopFrontImage)}
                      {console.log('Image URL length:', shop.shopFrontImage?.length)}
                      
                      {/* Enhanced image validation and display */}
                      {shop.shopFrontImage && shop.shopFrontImage.length > 100 ? (
                        <img 
                          src={shop.shopFrontImage} 
                          alt={`${shop.shopName} Front View`}
                          className="shop-card-image"
                          style={{display: 'block', width: '100%', height: '200px', objectFit: 'cover'}}
                          onLoad={() => console.log('✅ Image loaded successfully:', shop.shopName)}
                          onError={(e) => {
                            console.error('❌ Image failed to load:', shop.shopName);
                            console.error('Image URL preview:', shop.shopFrontImage?.substring(0, 100) + '...');
                            console.error('Image URL type:', typeof shop.shopFrontImage);
                            console.error('Image URL length:', shop.shopFrontImage?.length);
                            
                            // Try to fix common Data URL issues
                            let fixedUrl = shop.shopFrontImage;
                            if (typeof shop.shopFrontImage === 'string') {
                              // Fix missing data URL prefix
                              if (!shop.shopFrontImage.startsWith('data:') && shop.shopFrontImage.includes('base64')) {
                                fixedUrl = 'data:image/jpeg;base64,' + shop.shopFrontImage;
                              }
                              // Fix corrupted base64
                              if (fixedUrl.startsWith('data:image')) {
                                const base64Part = fixedUrl.split(',')[1];
                                if (base64Part && base64Part.length > 0) {
                                  try {
                                    // Test if base64 is valid
                                    atob(base64Part);
                                    console.log('✅ Base64 is valid');
                                  } catch (error) {
                                    console.error('❌ Base64 is corrupted:', error);
                                    fixedUrl = null;
                                  }
                                }
                              }
                            }
                            
                            if (fixedUrl) {
                              e.target.src = fixedUrl;
                            } else {
                              // Show placeholder
                              e.target.src = `https://via.placeholder.com/400x200/FF6B6B/FFFFFF?text=${encodeURIComponent(shop.shopName)}+Image+Corrupted`;
                            }
                          }}
                        />
                      ) : (
                        <div className="shop-image-placeholder" style={{display: 'flex', width: '100%', height: '200px', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', border: '2px dashed #e2e8f0'}}>
                          <div style={{textAlign: 'center'}}>
                            <div style={{fontSize: '48px', marginBottom: '8px'}}>🏪</div>
                            <span style={{color: '#64748b'}}>No Image Available</span>
                            {shop.shopFrontImage && shop.shopFrontImage.length <= 100 && (
                              <div style={{fontSize: '12px', color: '#ef4444', marginTop: '8px'}}>
                                Image URL too short or corrupted
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Shop Status Badge */}
                      <div className="shop-status-badges">
                        {shop.isOpen !== false && (
                          <div className="status-badge open">
                            <span className="status-dot"></span>
                            Open Now
                          </div>
                        )}
                        {shop.productCount > 0 && (
                          <div className="product-count-badge">
                            📦 {shop.productCount} Products
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="shop-header">
                    <div className="shop-info">
                      <h3 className="shop-name">🏪 {shop.shopName}</h3>
                      <div className="owner-info">
                        <span className="owner-name">👤 {shop.ownerName}</span>
                      </div>
                    </div>
                    {shop.isVerified && (
                      <div className="verified-badge">
                        <span>✓ Verified</span>
                      </div>
                    )}
                  </div>

                  <div className="shop-details">
                    <div className="location-info">
                      <div className="location-item">
                        <span className="icon">📍</span>
                        <span className="text">
                          {shop.city || 'N/A'}, {shop.town || 'N/A'}
                        </span>
                      </div>
                      <div className="location-item">
                        <span className="icon">📞</span>
                        <span className="text">{shop.phoneNumber}</span>
                      </div>
                      <div className="location-item">
                        <span className="icon">🏠</span>
                        <span className="text">{shop.shopAddress}</span>
                      </div>
                      <div className="location-item">
                        <span className="icon">📅</span>
                        <span className="text">
                          Registered: {formatDateTime(shop.registrationDate)}
                        </span>
                      </div>
                      <div className="location-item">
                        <span className="icon" title="Last Updated">🔄</span>
                        <span className="text">
                          Last Updated: {formatLastUpdated(shop)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="map-preview-section">
                    <div className="map-header">
                      <span className="map-title">📍 Shop Location</span>
                    </div>
                    <div className="map-container">
                      <div className="map-placeholder">
                        <div className="map-icon">🗺️</div>
                        <div className="map-text">
                          <h5>{shop.shopName}</h5>
                          <p>{shop.shopAddress}, {shop.city}, {shop.town}</p>
                          <p>Ethiopia</p>
                        </div>
                      </div>
                      <div className="map-actions">
                        <button 
                          className="map-btn view-map-btn"
                          onClick={() => window.open(getMapUrl(shop), '_blank')}
                          title="View shop on Google Maps"
                        >
                          🗺️ View on Map
                        </button>
                        <button 
                          className="map-btn directions-btn"
                          onClick={() => window.open(getDirectionsUrl(shop), '_blank')}
                          title="Get directions to shop"
                        >
                          🧭 Get Directions
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="shop-products-preview">
                    <div className="products-header">
                      <span className="products-title">📦 Available Products</span>
                      <span className="products-count">
                        {shop.products ? shop.products.length : 0} items
                      </span>
                    </div>
                    {shop.products && shop.products.length > 0 ? (
                      <div className="products-grid">
                        {shop.products.slice(0, 4).map((product, pIndex) => (
                          <div key={pIndex} className="product-card">
                            <div className="product-header">
                              <h4 className="product-name">{product.name}</h4>
                              <span className="product-price">ETB {product.price?.toLocaleString()}</span>
                            </div>
                            <div className="product-image-container">
                              {product.images?.[0] || product.image ? (
                                <img 
                                  src={product.images?.[0] || product.image} 
                                  alt={product.name}
                                  className="product-image"
                                  style={{width: '80px', height: '80px', objectFit: 'cover'}}
                                  onError={(e) => {
                                    console.error('Product image failed:', product.name);
                                    console.log('Trying image sources:', {
                                      'images[0]': product.images?.[0],
                                      'image': product.image,
                                      'frontImage': product.frontImage,
                                      'backImage': product.backImage
                                    });
                                    
                                    // Try fallback options
                                    if (e.target.src !== product.frontImage && product.frontImage) {
                                      e.target.src = product.frontImage;
                                    } else if (e.target.src !== product.backImage && product.backImage) {
                                      e.target.src = product.backImage;
                                    } else {
                                      e.target.src = `https://via.placeholder.com/80x80/FF6B6B/FFFFFF?text=${encodeURIComponent(product.name)}`;
                                    }
                                  }}
                                  onLoad={() => {
                                    console.log('✅ Product image loaded successfully:', product.name);
                                  }}
                                />
                              ) : (
                                <div className="product-image-placeholder" style={{width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0'}}>
                                  <span style={{fontSize: '24px'}}>📦</span>
                                </div>
                              )}
                            </div>
                            <div className="product-details">
                              <span className="product-brand">{product.brand}</span>
                              <span className="product-category">{product.category}</span>
                            </div>
                            <button 
                              className="view-product-btn"
                              onClick={() => handleProductPreview(product, shop)}
                            >
                              View Details
                            </button>
                          </div>
                        ))}
                        {shop.products.length > 4 && (
                          <div className="more-products-card">
                            <div className="more-products-content">
                              <span className="more-products-count">+{shop.products.length - 4}</span>
                              <span className="more-products-text">more products</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="no-products">
                        <div className="no-products-icon">📦</div>
                        <span>No products available</span>
                      </div>
                    )}
                  </div>

                  <div className="shop-footer">
                    <div className="customer-actions">
                      <button 
                        className="action-btn call-btn"
                        onClick={() => handleCallShopWithCheck(shop)}
                        title="Call Shop"
                      >
                        📞 Call
                      </button>
                      <button 
                        className="action-btn whatsapp-btn"
                        onClick={() => handleWhatsAppWithCheck(shop)}
                        title="WhatsApp Seller"
                      >
                        � WhatsApp
                      </button>
                      <button 
                        className="action-btn telegram-btn"
                        onClick={() => handleTelegramWithCheck(shop)}
                        title="Telegram"
                      >
                        ✈️ Telegram
                      </button>
                      <button 
                        className="action-btn message-btn"
                        onClick={() => handleSendMessage(shop)}
                        title="Send Message"
                      >
                        ✉️ Message
                      </button>
                      <button 
                        className={`action-btn save-btn ${isShopSaved(shop.id) ? 'saved' : ''}`}
                        onClick={() => handleSaveShop(shop)}
                        title={isShopSaved(shop.id) ? "Remove from Favorites" : "Save Shop"}
                      >
                        {isShopSaved(shop.id) ? '💖 Saved' : '🤍 Save'}
                      </button>
                    </div>
                    <div className="shop-actions">
                      <button 
                        className="view-shop-btn"
                        onClick={() => handleViewShopDetails(shop)}
                      >
                        View Details
                      </button>
                      <button 
                        className="comment-btn"
                        onClick={() => handleOpenComments(shop)}
                        title="Write Comment"
                      >
                        💬 Comment
                      </button>
                      <button 
                        className="message-btn"
                        onClick={() => handleOpenDirectMessage(shop)}
                        title="Send Message"
                      >
                        📧 Message
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          </>
        )}

        {/* Shop Details Modal */}
        {showShopDetails && selectedShop && (
          <div className="shop-details-modal">
            <div className="modal-overlay" onClick={handleCloseShopDetails}></div>
            <div className="modal-content">
              <button className="modal-close-btn" onClick={handleCloseShopDetails}>×</button>
              <div className="shop-details-header">
                <div className="shop-header-content">
                  <div className="shop-logo-section">
                    {selectedShop.logo ? (
                      <img 
                        src={selectedShop.logo} 
                        alt={`${selectedShop.shopName} Logo`} 
                        className="shop-detail-logo"
                        style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%'}}
                        onError={(e) => {
                          console.error('Shop logo failed to load:', selectedShop.shopName);
                          e.target.src = `https://via.placeholder.com/80x80/FF6B6B/FFFFFF?text=${encodeURIComponent(selectedShop.shopName.charAt(0))}`;
                        }}
                      />
                    ) : selectedShop.shopLogo ? (
                      <img 
                        src={selectedShop.shopLogo} 
                        alt={`${selectedShop.shopName} Logo`} 
                        className="shop-detail-logo"
                        style={{width: '80px', height: '80px', objectFit: 'cover', borderRadius: '50%'}}
                        onError={(e) => {
                          console.error('Shop logo failed to load:', selectedShop.shopName);
                          e.target.src = `https://via.placeholder.com/80x80/FF6B6B/FFFFFF?text=${encodeURIComponent(selectedShop.shopName.charAt(0))}`;
                        }}
                      />
                    ) : (
                      <div className="shop-no-logo" style={{width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', border: '2px dashed #e2e8f0', borderRadius: '50%'}}>
                        <div className="no-logo-icon" style={{fontSize: '32px'}}>🏪</div>
                      </div>
                    )}
                  </div>
                  <div className="shop-info-text">
                    <div className="shop-name-marquee">
                      <marquee className="owner-name-marquee">
                        <span className="marquee-text">{selectedShop.shopName}</span>
                      </marquee>
                    </div>
                    <div className="shop-meta">
                      <span className="owner-name">👤 {selectedShop.ownerName}</span>
                      {selectedShop.isVerified && (
                        <span className="verified-badge">✓ Verified</span>
                      )}
                    </div>
                    {selectedShop.shopDescription && (
                      <p className="shop-description">{selectedShop.shopDescription}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="shop-details-body">
                {/* Shop Registration Details Section */}
                <div className="shop-registration-details">
                  <h3>📋 Shop Registration Information</h3>
                  <div className="registration-info-grid">
                    <div className="info-section">
                      <h4>🏪 Basic Information</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Shop Name:</span>
                          <span className="value">{selectedShop.shopName}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Owner Name:</span>
                          <span className="value">{selectedShop.ownerName}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Business Type:</span>
                          <span className="value">{selectedShop.businessType || 'Electronics Shop'}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">License Number:</span>
                          <span className="value">{selectedShop.licenseNumber || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Registration Date:</span>
                          <span className="value">{formatDateTime(selectedShop.registrationDate)}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Last Updated:</span>
                          <span className="value">{formatLastUpdated(selectedShop)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h4>📍 Contact Information</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Phone Number:</span>
                          <span className="value">{selectedShop.phoneNumber}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Email Address:</span>
                          <span className="value">{selectedShop.email || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Website:</span>
                          <span className="value">
                            {selectedShop.website ? (
                              <a href={selectedShop.website} target="_blank" rel="noopener noreferrer">
                                {selectedShop.website}
                              </a>
                            ) : 'N/A'}
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="label">Social Media:</span>
                          <span className="value">
                            {selectedShop.socialMedia ? (
                              <div className="social-links">
                                {selectedShop.socialMedia.facebook && (
                                  <a href={selectedShop.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                                    📘 Facebook
                                  </a>
                                )}
                                {selectedShop.socialMedia.instagram && (
                                  <a href={selectedShop.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                                    📷 Instagram
                                  </a>
                                )}
                                {selectedShop.socialMedia.telegram && (
                                  <a href={selectedShop.socialMedia.telegram} target="_blank" rel="noopener noreferrer">
                                    ✈️ Telegram
                                  </a>
                                )}
                              </div>
                            ) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h4>🏠 Location Information</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Full Address:</span>
                          <span className="value">{selectedShop.shopAddress}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">City:</span>
                          <span className="value">{selectedShop.city}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Town/Subcity:</span>
                          <span className="value">{selectedShop.town}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Region:</span>
                          <span className="value">{selectedShop.region || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Postal Code:</span>
                          <span className="value">{selectedShop.postalCode || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Coordinates:</span>
                          <span className="value">
                            {selectedShop.coordinates ? 
                              `${selectedShop.coordinates.lat}, ${selectedShop.coordinates.lon}` : 
                              'N/A'
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="info-section">
                      <h4>⏰ Business Hours</h4>
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="label">Monday - Friday:</span>
                          <span className="value">{selectedShop.businessHours?.weekdays || '9:00 AM - 6:00 PM'}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Saturday:</span>
                          <span className="value">{selectedShop.businessHours?.saturday || '9:00 AM - 4:00 PM'}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Sunday:</span>
                          <span className="value">{selectedShop.businessHours?.sunday || 'Closed'}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Holidays:</span>
                          <span className="value">{selectedShop.businessHours?.holidays || 'Closed on major holidays'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shop Media Section */}
                <div className="shop-media-section">
                  <h3>📸 Shop Images & Videos</h3>
                  <div className="media-grid">
                    {/* Shop Front Image */}
                    <div className="media-item">
                      <h4>🏪 Shop Front</h4>
                      {console.log('Shop details modal - front image:', selectedShop.shopFrontImage)}
                      {selectedShop.shopFrontImage ? (
                        <img 
                          src={selectedShop.shopFrontImage} 
                          alt={`${selectedShop.shopName} Front View`}
                          className="shop-media-image"
                          style={{width: '100%', height: '200px', objectFit: 'cover'}}
                          onLoad={() => console.log('✅ Modal front image loaded:', selectedShop.shopName)}
                          onError={(e) => {
                            console.error('❌ Modal front image failed:', selectedShop.shopName, e);
                            console.error('Failed front image URL:', selectedShop.shopFrontImage);
                            // Show fallback placeholder
                            e.target.src = `https://via.placeholder.com/400x200/FF6B6B/FFFFFF?text=${encodeURIComponent(selectedShop.shopName)}+Front+Image+Failed`;
                          }}
                        />
                      ) : (
                        <div className="no-media-placeholder" style={{display: 'flex', width: '100%', height: '200px', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', border: '2px dashed #e2e8f0'}}>
                          <div style={{textAlign: 'center'}}>
                            <div className="no-media-icon" style={{fontSize: '48px', marginBottom: '8px'}}>📷</div>
                            <span style={{color: '#64748b'}}>No front image available</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Shop Back Image */}
                    <div className="media-item">
                      <h4>🏪 Shop Back</h4>
                      {selectedShop.shopBackImage ? (
                        <img 
                          src={selectedShop.shopBackImage} 
                          alt={`${selectedShop.shopName} Back View`}
                          className="shop-media-image"
                          style={{width: '100%', height: '200px', objectFit: 'cover'}}
                          onLoad={() => console.log('✅ Modal back image loaded:', selectedShop.shopName)}
                          onError={(e) => {
                            console.error('❌ Modal back image failed:', selectedShop.shopName, e);
                            console.error('Failed back image URL:', selectedShop.shopBackImage);
                            // Show fallback placeholder
                            e.target.src = `https://via.placeholder.com/400x200/FF6B6B/FFFFFF?text=${encodeURIComponent(selectedShop.shopName)}+Back+Image+Failed`;
                          }}
                        />
                      ) : (
                        <div className="no-media-placeholder" style={{display: 'flex', width: '100%', height: '200px', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', border: '2px dashed #e2e8f0'}}>
                          <div style={{textAlign: 'center'}}>
                            <div className="no-media-icon" style={{fontSize: '48px', marginBottom: '8px'}}>📷</div>
                            <span style={{color: '#64748b'}}>No back image available</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Shop Gallery Images */}
                    <div className="media-item gallery-section">
                      <h4>🖼️ Shop Gallery</h4>
                      {selectedShop.shopGalleryImages && selectedShop.shopGalleryImages.length > 0 ? (
                        <div className="gallery-images-grid">
                          {selectedShop.shopGalleryImages.map((imageUrl, index) => (
                            imageUrl && (
                              <div key={index} className="gallery-image-item">
                                <img 
                                  src={imageUrl} 
                                  alt={`${selectedShop.shopName} Gallery ${index + 1}`}
                                  className="shop-media-image gallery-image"
                                  style={{width: '150px', height: '150px', objectFit: 'cover'}}
                                  onError={(e) => {
                                    console.error('Gallery image failed:', selectedShop.shopName, index, imageUrl);
                                    e.target.style.display = 'none';
                                    // Show placeholder
                                    const parent = e.target.parentElement;
                                    if (parent) {
                                      parent.innerHTML = `<div style="width: 150px; height: 150px; display: flex; align-items: center; justify-content: center; background-color: #f8fafc; border: 1px solid #e2e8f0; color: #64748b; font-size: 12px; text-align: center;">Gallery ${index + 1}<br>Failed</div>`;
                                    }
                                  }}
                                />
                              </div>
                            )
                          ))}
                        </div>
                      ) : (
                        <div className="no-media-placeholder" style={{display: 'flex', width: '100%', height: '200px', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', border: '2px dashed #e2e8f0'}}>
                          <div style={{textAlign: 'center'}}>
                            <div className="no-media-icon" style={{fontSize: '48px', marginBottom: '8px'}}>🖼️</div>
                            <span style={{color: '#64748b'}}>No gallery images available</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Products Display Image */}
                    <div className="media-item">
                      <h4>📦 Products Display</h4>
                      {selectedShop.productsDisplayImage ? (
                        <img 
                          src={selectedShop.productsDisplayImage} 
                          alt={`${selectedShop.shopName} Products Display`}
                          className="shop-media-image"
                        />
                      ) : (
                        <div className="no-media-placeholder">
                          <div className="no-media-icon">📷</div>
                          <span>No display image available</span>
                        </div>
                      )}
                    </div>

                    {/* Shop Video */}
                    <div className="media-item">
                      <h4>🎥 Shop Video Tour</h4>
                      {selectedShop.shopVideo ? (
                        <video 
                          src={selectedShop.shopVideo} 
                          controls
                          className="shop-media-video"
                          poster={selectedShop.shopVideoThumbnail || ''}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div className="no-media-placeholder">
                          <div className="no-media-icon">🎥</div>
                          <span>No video tour available</span>
                        </div>
                      )}
                    </div>

                    {/* Additional Images */}
                    {selectedShop.additionalImages && selectedShop.additionalImages.length > 0 && (
                      <div className="media-item full-width">
                        <h4>🖼️ Additional Images</h4>
                        <div className="additional-images-grid">
                          {selectedShop.additionalImages.map((image, index) => (
                            <img 
                              key={index}
                              src={image} 
                              alt={`${selectedShop.shopName} Additional Image ${index + 1}`}
                              className="additional-shop-image"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Analytics Section */}
                <div className="analytics-section">
                  <h3>📊 Shop Analytics</h3>
                  <div className="analytics-grid">
                    <div className="analytics-card">
                      <div className="analytics-icon">👁️</div>
                      <div className="analytics-info">
                        <span className="analytics-number">{getShopAnalytics(selectedShop).productViews}</span>
                        <span className="analytics-label">Product Views</span>
                      </div>
                    </div>
                    <div className="analytics-card">
                      <div className="analytics-icon">🔥</div>
                      <div className="analytics-info">
                        <span className="analytics-number">
                          {getShopAnalytics(selectedShop).mostViewedProduct ? 
                            getShopAnalytics(selectedShop).mostViewedProduct.name : 
                            'No views yet'
                          }
                        </span>
                        <span className="analytics-label">Most Viewed Product</span>
                      </div>
                    </div>
                    <div className="analytics-card">
                      <div className="analytics-icon">💬</div>
                      <div className="analytics-info">
                        <span className="analytics-number">{getShopAnalytics(selectedShop).customerMessages}</span>
                        <span className="analytics-label">Customer Messages</span>
                      </div>
                    </div>
                    <div className="analytics-card">
                      <div className="analytics-icon">❤️</div>
                      <div className="analytics-info">
                        <span className="analytics-number">{getShopAnalytics(selectedShop).wishlistSaves}</span>
                        <span className="analytics-label">Wishlist Saves</span>
                      </div>
                    </div>
                    <div className="analytics-card">
                      <div className="analytics-icon">👥</div>
                      <div className="analytics-info">
                        <span className="analytics-number">{getShopAnalytics(selectedShop).dailyVisitors}</span>
                        <span className="analytics-label">Daily Visitors</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shop Views Section */}
                <div className="shop-views-section">
                  <h3>👁️ Shop Views & Visitors</h3>
                  <div className="views-stats-grid">
                    <div className="views-stat-card">
                      <div className="views-stat-icon">👁️</div>
                      <div className="views-stat-info">
                        <span className="views-stat-number">{getShopViewStats(selectedShop).totalViews}</span>
                        <span className="views-stat-label">Total Shop Views</span>
                        <span className="views-stat-time">
                          Last viewed: {formatViewTime(getShopViewStats(selectedShop).lastViewed)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {getShopViewStats(selectedShop).recentViewers.length > 0 && (
                    <div className="recent-viewers">
                      <h4>👥 Recent Visitors</h4>
                      <div className="viewers-list">
                        {getShopViewStats(selectedShop).recentViewers.map((viewer, index) => (
                          <div key={viewer.sessionId} className="viewer-item">
                            <div className="viewer-info">
                              <div className="viewer-avatar">👤</div>
                              <div className="viewer-details">
                                <span className="viewer-name">{viewer.viewerName}</span>
                                <span className="viewer-email">{viewer.viewerEmail}</span>
                              </div>
                            </div>
                            <div className="viewer-time">
                              {formatViewTime(viewer.timestamp)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="shop-info-section">
                  <h3>📍 Shop Information</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">City:</span>
                      <span className="value">{selectedShop.city || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Town:</span>
                      <span className="value">{selectedShop.town || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Phone:</span>
                      <span className="value">{selectedShop.phoneNumber}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Address:</span>
                      <span className="value">{selectedShop.shopAddress}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Registered:</span>
                      <span className="value">{formatDateTime(selectedShop.registrationDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="map-preview-section">
                  <div className="map-header">
                    <span className="map-title">📍 Shop Location</span>
                  </div>
                  <div className="map-container">
                    <div className="map-placeholder">
                      <div className="map-icon">🗺️</div>
                      <div className="map-text">
                        <h5>{selectedShop.shopName}</h5>
                        <p>{selectedShop.shopAddress}, {selectedShop.city}, {selectedShop.town}</p>
                        <p>Ethiopia</p>
                      </div>
                    </div>
                    <div className="map-actions">
                      <button 
                        className="map-btn view-map-btn"
                        onClick={() => window.open(getMapUrl(selectedShop), '_blank')}
                        title="View shop on Google Maps"
                      >
                        🗺️ View on Map
                      </button>
                      <button 
                        className="map-btn directions-btn"
                        onClick={() => window.open(getDirectionsUrl(selectedShop), '_blank')}
                        title="Get directions to shop"
                      >
                        🧭 Get Directions
                      </button>
                    </div>
                  </div>
                </div>

                <div className="shop-products-section">
                  <h3>📦 Products ({selectedShop.products ? selectedShop.products.length : 0})</h3>
                  {selectedShop.products && selectedShop.products.length > 0 ? (
                    <div className="products-table">
                      <div className="table-header">
                        <span>Product Name</span>
                        <span>Price</span>
                        <span>Category</span>
                        <span>Views</span>
                        <span>Actions</span>
                      </div>
                      {selectedShop.products.map((product, index) => {
                        const viewKey = `${selectedShop.id}_${product.id || product.name}`;
                        const productViews = JSON.parse(localStorage.getItem('productViews') || '{}')[viewKey] || 0;
                        
                        return (
                          <div key={index} className="table-row">
                            <span className="product-name">{product.name}</span>
                            <span className="product-price">ETB {product.price}</span>
                            <span className="product-category">{product.category || 'N/A'}</span>
                            <span className="product-views">👁️ {productViews}</span>
                            <div className="product-actions">
                              <button 
                                className="view-product-btn"
                                onClick={() => handleViewProduct(selectedShop, product)}
                                title="View product details"
                              >
                                👁️ View
                              </button>
                              <button 
                                className="wishlist-btn"
                                onClick={() => handleAddToWishlist(selectedShop, product)}
                                title="Add to wishlist"
                              >
                                ❤️ Save
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="no-products-detailed">
                      <div className="no-products-icon">📦</div>
                      <h4>No Products Yet</h4>
                      <p>This shop hasn't uploaded any products yet.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="shop-details-footer">
                <div className="customer-actions-detailed">
                  <button 
                    className="action-btn call-btn"
                    onClick={() => handleCallShopWithCheck(selectedShop)}
                    title="Call Shop"
                  >
                    📞 Call Shop
                  </button>
                  <button 
                    className="action-btn whatsapp-btn"
                    onClick={() => handleWhatsAppWithCheck(selectedShop)}
                    title="WhatsApp Seller"
                  >
                    � WhatsApp Seller
                  </button>
                  <button 
                    className="action-btn telegram-btn"
                    onClick={() => handleTelegramWithCheck(selectedShop)}
                    title="Telegram"
                  >
                    ✈️ Telegram
                  </button>
                  <button 
                    className="action-btn message-btn"
                    onClick={() => handleSendMessage(selectedShop)}
                    title="Send Message"
                  >
                    ✉️ Send Message
                  </button>
                  <button 
                    className={`action-btn save-btn ${isShopSaved(selectedShop.id) ? 'saved' : ''}`}
                    onClick={() => handleSaveShop(selectedShop)}
                    title={isShopSaved(selectedShop.id) ? "Remove from Favorites" : "Save Shop"}
                  >
                    {isShopSaved(selectedShop.id) ? '💖 Shop Saved' : '🤍 Save Shop'}
                  </button>
                </div>
                <div className="modal-actions">
                  <button className="close-details-btn" onClick={handleCloseShopDetails}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Comparison Modal */}
        {showComparison && comparisonProduct && (
          <Fragment>
            <div className="comparison-modal">
              <div className="modal-overlay" onClick={handleCloseComparison}></div>
              <div className="modal-content">
                <button className="modal-close-btn" onClick={handleCloseComparison}>×</button>
                <div className="comparison-header">
                  <h2>⚖️ Product Comparison</h2>
                  <h3>{comparisonProduct.name}</h3>
                </div>

                <div className="comparison-body">
                  {(() => {
                    const sameProducts = findSameProducts(comparisonProduct.name);
                    if (sameProducts.length === 0) {
                      return (
                        <div className="no-comparison">
                          <div className="no-comparison-icon">🔍</div>
                          <h4>No Similar Products Found</h4>
                          <p>No other shops are currently selling this exact product.</p>
                        </div>
                      );
                    }

                    const sortedProducts = sameProducts.sort((a, b) => a.price - b.price);
                    const lowestPrice = sortedProducts[0].price;

                    return (
                      <div className="comparison-results">
                        <div className="comparison-grid">
                          {sortedProducts.map((product, index) => (
                            <div key={index} className={`comparison-card ${product.price === lowestPrice ? 'best-price' : ''}`}>
                              <div className="comparison-shop">
                                <h4>{product.shopName}</h4>
                                <p>📍 {product.shopCity}, {product.shopTown}</p>
                                <p>📞 {product.shopPhone}</p>
                              </div>
                              <div className="comparison-product">
                                <div className="comparison-product-info">
                                  <h5>{product.name}</h5>
                                  <div className="comparison-details">
                                    <span className="comparison-category">{product.category}</span>
                                    <span className={`comparison-stock ${product.stock == 0 ? 'out-of-stock' : ''}`}>
                                      {product.stock == 0 ? '❌ Out of Stock' : `Stock: ${product.stock}`}
                                    </span>
                                    {product.rating && (
                                      <span className="comparison-rating">⭐ {product.rating}</span>
                                    )}
                                  </div>
                                </div>
                                <div className="comparison-price-section">
                                  <div className="comparison-price">ETB {product.price}</div>
                                  {product.price === lowestPrice && (
                                    <div className="best-price-badge">🏆 Best Price</div>
                                  )}
                                </div>
                              </div>
                              <div className="comparison-actions">
                                <button className="contact-shop-compare-btn">
                                  📞 Contact Shop
                                </button>
                                <button className="view-shop-compare-btn">
                                  🏪 View Shop
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="comparison-footer">
                  <button className="close-comparison-btn" onClick={handleCloseComparison}>
                    Close Comparison
                  </button>
                </div>
              </div>
            </div>
          </Fragment>
        )}

        {registeredShops.length > 0 && (
          <div className="registered-shops-footer">
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">{registeredShops.length}</span>
                <span className="stat-label">Total Shops</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {registeredShops.filter(shop => shop.isVerified).length}
                </span>
                <span className="stat-label">Verified Shops</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {new Set(registeredShops.map(shop => shop.city)).size}
                </span>
                <span className="stat-label">Cities</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {registeredShops.reduce((total, shop) => total + (shop.products ? shop.products.length : 0), 0)}
                </span>
                <span className="stat-label">Total Products</span>
              </div>
            </div>
          </div>
        )}

        {/* Comments Modal */}
        {showComments && selectedShopForComments && (
          <div className="comments-modal">
            <div className="modal-overlay" onClick={handleCloseComments}></div>
            <div className="modal-content comments-modal-content">
              <button className="modal-close-btn" onClick={handleCloseComments}>×</button>
              <div className="comments-header">
                <h3>💬 Comments for {selectedShopForComments.shopName}</h3>
                <p>Share your thoughts or ask questions about this shop</p>
              </div>
              
              <div className="add-comment-section">
                <textarea
                  className="comment-input"
                  placeholder="Write your comment here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <button 
                  className="post-comment-btn"
                  onClick={() => handleAddComment(selectedShopForComments)}
                >
                  Post Comment
                </button>
              </div>

              <div className="comments-list">
                {getShopComments(selectedShopForComments).length === 0 ? (
                  <div className="no-comments">
                    <div className="no-comments-icon">💬</div>
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                ) : (
                  getShopComments(selectedShopForComments).map(comment => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <div className="comment-author">
                          <div className="author-avatar">👤</div>
                          <div className="author-info">
                            <span className="author-name">{comment.authorName}</span>
                            <span className="comment-time">{formatCommentTime(comment.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="comment-content">
                        <p>{comment.content}</p>
                      </div>
                      <div className="comment-actions">
                        <button 
                          className="reply-btn"
                          onClick={() => {
                            const replyContent = prompt('Write your reply:');
                            if (replyContent) {
                              handleReplyToComment(selectedShopForComments, comment.id, replyContent);
                            }
                          }}
                        >
                          Reply
                        </button>
                      </div>
                      
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="replies-section">
                          {comment.replies.map(reply => (
                            <div key={reply.id} className="reply-item">
                              <div className="reply-header">
                                <div className="reply-author">
                                  <div className="author-avatar">👤</div>
                                  <div className="author-info">
                                    <span className="author-name">{reply.authorName}</span>
                                    <span className="comment-time">{formatCommentTime(reply.timestamp)}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="reply-content">
                                <p>{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Direct Message Modal */}
        {showMessageModal && selectedShopForMessage && (
          <div className="message-modal">
            <div className="modal-overlay" onClick={handleCloseDirectMessage}></div>
            <div className="modal-content message-modal-content">
              <button className="modal-close-btn" onClick={handleCloseDirectMessage}>×</button>
              <div className="message-header">
                <h3>📧 Send Message to {selectedShopForMessage.shopName}</h3>
                <p>Contact {selectedShopForMessage.ownerName} directly</p>
              </div>
              
              <div className="message-form">
                <div className="shop-contact-info">
                  <div className="contact-item">
                    <span className="contact-label">Shop:</span>
                    <span className="contact-value">{selectedShopForMessage.shopName}</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">Owner:</span>
                    <span className="contact-value">{selectedShopForMessage.ownerName}</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">Phone:</span>
                    <span className="contact-value">{selectedShopForMessage.phoneNumber}</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">Location:</span>
                    <span className="contact-value">{selectedShopForMessage.city}, {selectedShopForMessage.town}</span>
                  </div>
                </div>
                
                {/* Message History Section */}
                {getMessageHistory(selectedShopForMessage).length > 0 && (
                  <div className="message-history-section">
                    <h4>📨 Message History</h4>
                    <div className="message-history-list">
                      {getMessageHistory(selectedShopForMessage).map(message => (
                        <div 
                          key={message.id} 
                          className="message-history-item"
                          data-delivery={
                            message.deliveryStatus.seen ? 'seen' : 
                            message.deliveryStatus.delivered ? 'delivered' : 
                            message.deliveryStatus.sent ? 'sent' : 'pending'
                          }
                        >
                          <div className="message-history-header">
                            <div className="message-status">
                              <span className="status-icon">
                                {getDeliveryStatusIcon(message.deliveryStatus)}
                              </span>
                              <span className="status-text">
                                {getDeliveryStatusText(message.deliveryStatus)}
                              </span>
                              {message.isEdited && (
                                <span className="edited-indicator" title={`Edited ${formatCommentTime(message.lastEditedAt)}`}>
                                  ✏️ Edited
                                </span>
                              )}
                            </div>
                            <span className="message-time">
                              {formatCommentTime(message.timestamp)}
                            </span>
                          </div>
                          <div className="message-history-content">
                            {editingMessage?.id === message.id ? (
                              <div className="edit-message-form">
                                <textarea
                                  className="edit-message-input"
                                  value={editedContent}
                                  onChange={(e) => setEditedContent(e.target.value)}
                                  rows={3}
                                  placeholder="Edit your message..."
                                />
                                <div className="edit-message-actions">
                                  <button 
                                    className="save-edit-btn"
                                    onClick={() => handleSaveEdit(selectedShopForMessage)}
                                  >
                                    💾 Save
                                  </button>
                                  <button 
                                    className="cancel-edit-btn"
                                    onClick={handleCancelEdit}
                                  >
                                    ❌ Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p>{message.content}</p>
                            )}
                          </div>
                          {message.viewCount > 0 && (
                            <div className="message-views-count">
                              Viewed {message.viewCount} time{message.viewCount > 1 ? 's' : ''}
                            </div>
                          )}
                          {editingMessage?.id !== message.id && (
                            <div className="message-actions">
                              <button 
                                className="edit-message-btn"
                                onClick={() => handleEditMessage(message, selectedShopForMessage)}
                                title="Edit message"
                              >
                                ✏️ Edit
                              </button>
                              <button 
                                className="delete-message-btn"
                                onClick={() => handleDeleteMessage(message, selectedShopForMessage)}
                                title="Delete message"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="message-input-section">
                  <label htmlFor="message-content">Your Message:</label>
                  <textarea
                    id="message-content"
                    className="message-input"
                    placeholder="Type your message here..."
                    value={directMessage}
                    onChange={(e) => setDirectMessage(e.target.value)}
                    rows={5}
                  />
                </div>
                
                <div className="message-actions">
                  <button 
                    className="send-message-btn"
                    onClick={() => handleSendDirectMessage(selectedShopForMessage)}
                  >
                    📧 Send Message
                  </button>
                  <button 
                    className="cancel-message-btn"
                    onClick={handleCloseDirectMessage}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Registration Choice Modal */}
        {showRegistrationChoice && (
          <div className="registration-choice-modal">
            <div className="modal-overlay" onClick={handleCloseRegistrationChoice}></div>
            <div className="registration-choice-content">
              <div className="registration-choice-header">
                <h2>🔐 Access Required</h2>
                <p>You need to be registered to access shop features</p>
              </div>
              
              <div className="registration-choice-body">
                <div className="choice-question">
                  <h3>Are you already registered?</h3>
                </div>
                
                <div className="choice-buttons">
                  <button 
                    className="choice-btn already-registered-btn"
                    onClick={handleAlreadyRegistered}
                  >
                    <span className="btn-icon">✅</span>
                    <span className="btn-text">I'm Already Registered</span>
                    <span className="btn-description">Login with existing account</span>
                  </button>
                  
                  <button 
                    className="choice-btn register-new-btn"
                    onClick={handleRegisterNew}
                  >
                    <span className="btn-icon">📝</span>
                    <span className="btn-text">Register to Shop</span>
                    <span className="btn-description">Create new account</span>
                  </button>
                </div>
                
                <div className="login-options">
                  <h4>🔐 Login Options</h4>
                  <div className="login-methods">
                    <button 
                      className="login-method-btn phone-login-btn"
                      onClick={() => handleLoginByPhone()}
                    >
                      <span className="login-icon">📞</span>
                      <span className="login-text">Login by Phone</span>
                    </button>
                    
                    <button 
                      className="login-method-btn email-login-btn"
                      onClick={() => handleLoginByEmail()}
                    >
                      <span className="login-icon">📧</span>
                      <span className="login-text">Login by Email</span>
                    </button>
                  </div>
                </div>
                
                <div className="choice-cancel">
                  <button 
                    className="cancel-choice-btn"
                    onClick={handleCloseRegistrationChoice}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Customer Registration Modal */}
        {showCustomerRegistration && (
          <CustomerRegistration 
            onRegister={handleCustomerRegister}
            onClose={handleCustomerRegistrationClose}
            contactAction={
              pendingContactAction === 'call' ? 'call' :
              pendingContactAction === 'whatsapp' ? 'contact via WhatsApp with' :
              pendingContactAction === 'telegram' ? 'contact via Telegram with' :
              null
            }
            shopName={pendingShop?.shopName || null}
          />
        )}
      </div>
    </div>
  );
};

export default RegisteredShops;
