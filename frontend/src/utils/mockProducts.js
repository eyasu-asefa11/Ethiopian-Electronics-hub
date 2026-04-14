// Mock product data for testing
const mockProducts = [
  {
    id: 1,
    name: "Tecno Spark 10",
    price: 8999,
    category: "Smartphone",
    description: "Latest Tecno smartphone with amazing features",
    uploadedAt: "2026-03-11T09:30:00Z",
    updatedAt: "2026-03-11T09:30:00Z",
    inStock: true,
    stock: 4,
    rating: 4.5,
    images: ["tecno1.jpg", "tecno2.jpg"]
  },
  {
    id: 2,
    name: "Samsung Galaxy A05",
    price: 12999,
    category: "Smartphone",
    description: "Samsung budget phone with great performance",
    uploadedAt: "2026-03-10T14:15:00Z",
    updatedAt: "2026-03-10T14:15:00Z",
    inStock: true,
    stock: 3,
    rating: 4.2,
    images: ["samsung1.jpg"]
  },
  {
    id: 3,
    name: "HP Laptop 15",
    price: 25000,
    category: "Laptop",
    description: "HP business laptop for professionals",
    uploadedAt: "2026-03-09T11:45:00Z",
    updatedAt: "2026-03-11T08:20:00Z",
    inStock: true,
    stock: 2,
    rating: 4.7,
    images: ["hp1.jpg", "hp2.jpg", "hp3.jpg"]
  },
  {
    id: 4,
    name: "AirPods Pro",
    price: 15999,
    category: "Audio",
    description: "Wireless earbuds with noise cancellation",
    uploadedAt: "2026-03-08T16:30:00Z",
    updatedAt: "2026-03-08T16:30:00Z",
    inStock: true,
    stock: 8,
    rating: 4.8,
    images: ["airpods1.jpg"]
  },
  {
    id: 5,
    name: "Canon EOS 200D",
    price: 35000,
    category: "Camera",
    description: "Professional DSLR camera",
    uploadedAt: "2026-03-07T10:00:00Z",
    updatedAt: "2026-03-11T12:15:00Z",
    inStock: true,
    stock: 1,
    rating: 4.6,
    images: ["canon1.jpg", "canon2.jpg"]
  },
  {
    id: 6,
    name: "iPhone 13",
    price: 45000,
    category: "Smartphone",
    description: "Apple iPhone 13 with excellent camera",
    uploadedAt: "2026-03-06T13:20:00Z",
    updatedAt: "2026-03-06T13:20:00Z",
    inStock: true,
    stock: 5,
    rating: 4.9,
    images: ["iphone1.jpg", "iphone2.jpg"]
  },
  {
    id: 7,
    name: "Sony WH-1000XM4",
    price: 18999,
    category: "Audio",
    description: "Premium noise-canceling headphones",
    uploadedAt: "2026-03-05T09:45:00Z",
    updatedAt: "2026-03-05T09:45:00Z",
    inStock: true,
    stock: 6,
    rating: 4.7,
    images: ["sony1.jpg"]
  },
  {
    id: 8,
    name: "Dell Inspiron 14",
    price: 28000,
    category: "Laptop",
    description: "Dell laptop for everyday use",
    uploadedAt: "2026-03-04T15:30:00Z",
    updatedAt: "2026-03-04T15:30:00Z",
    inStock: true,
    stock: 3,
    rating: 4.3,
    images: ["dell1.jpg", "dell2.jpg"]
  }
];

// Function to add mock products to existing shops
const addMockProductsToShops = () => {
  const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
  
  if (shops.length > 0) {
    // Add products to the first shop for testing
    shops[0].products = mockProducts.slice(0, 5); // First 5 products
    
    // Add fewer products to other shops if they exist
    if (shops.length > 1) {
      shops[1].products = mockProducts.slice(5, 8); // Next 3 products
    }
    
    if (shops.length > 2) {
      shops[2].products = mockProducts.slice(2, 6); // Different 4 products
    }
    
    localStorage.setItem('registeredShops', JSON.stringify(shops));
    console.log('Mock products with stock and ratings added to shops for testing');
  }
};

// Auto-add mock products when this script runs
addMockProductsToShops();
