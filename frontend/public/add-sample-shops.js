// Add sample shops for testing
const sampleShops = [
  {
    id: '1',
    name: 'Ethiopian Electronics Center',
    description: 'Best electronics shop in Dilla',
    city: 'Dilla',
    address: 'Main Street, Dilla',
    phone: '0912345678',
    whatsapp: '0912345678',
    email: 'dilla@electronics.com',
    operating_hours: '8:00 AM - 8:00 PM',
    business_license: '',
    social_links: '',
    shopCategory: 'Electronics',
    paymentMethods: ['cash', 'mobile'],
    ownerId: 'user1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isVerified: false,
    rating: 0,
    reviewCount: 0,
    products: []
  },
  {
    id: '2',
    name: 'Addis Electronics Store',
    description: 'Premium electronics in Addis Abeba',
    city: 'Addis Abeba',
    address: 'Bole Road, Addis Abeba',
    phone: '0912345679',
    whatsapp: '0912345679',
    email: 'addis@electronics.com',
    operating_hours: '9:00 AM - 9:00 PM',
    business_license: '',
    social_links: '',
    shopCategory: 'Electronics',
    paymentMethods: ['cash', 'mobile', 'card'],
    ownerId: 'user2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isVerified: false,
    rating: 0,
    reviewCount: 0,
    products: []
  },
  {
    id: '3',
    name: 'Hossana Tech Shop',
    description: 'Technology solutions in Hossana',
    city: 'Hossana',
    address: 'Market Area, Hossana',
    phone: '0912345680',
    whatsapp: '0912345680',
    email: 'hossana@electronics.com',
    operating_hours: '8:30 AM - 7:30 PM',
    business_license: '',
    social_links: '',
    shopCategory: 'Electronics',
    paymentMethods: ['cash', 'mobile'],
    ownerId: 'user3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isVerified: false,
    rating: 0,
    reviewCount: 0,
    products: []
  }
];

// Save to localStorage
localStorage.setItem('registeredShops', JSON.stringify(sampleShops));
console.log('Sample shops added:', sampleShops.length);
console.log('Cities with shops:', [...new Set(sampleShops.map(shop => shop.city))]);
