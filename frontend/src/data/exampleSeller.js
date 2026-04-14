// Abeba's Shop Registration Workflow
// This shows the complete process for shop owner registration

// Step 1: User Registration
const abebaRegistration = {
  username: "abeba_electronics",
  phone_numbers: ["0912345678"],
  phone_carriers: ["Ethio Telecom"],
  region: "sidama",
  city: "dilla",
  role: "seller",
  shop_name_en: "Abeba Electronics",
  shop_name_am: "አበባ ኤሌክትሮኒክስ"
};

// Step 2: Shop Details
const abebaShopDetails = {
  name_en: "Abeba Electronics",
  name_am: "አበባ ኤሌክትሮኒክስ",
  owner_name: "Abeba",
  city: "Dilla",
  region: "Sidama Region",
  phone: "0912345678",
  whatsapp: "0912345678",
  email: "abeba@electronics.com",
  address: "Main Street, Dilla, Ethiopia",
  description: "Quality electronics at affordable prices",
  business_license: "BL-2024-001",
  tax_id: "TAX-2024-001",
  opening_hours: "8:00 AM - 8:00 PM",
  gps_location: {
    latitude: 6.4167,
    longitude: 38.3167
  }
};

// Step 3: Product Addition
const tecnoSpark10 = {
  name: "Tecno Spark 10",
  brand: "Tecno",
  model: "KI5K",
  category: "Phones",
  specifications: {
    ram: "4GB",
    storage: "128GB",
    battery: "5000mAh",
    camera: "50MP",
    screen_size: "6.6 inch",
    processor: "MediaTek Helio G85",
    operating_system: "Android 13",
    network: "4G LTE",
    sim_card: "Dual SIM"
  },
  color: "Black",
  condition: "New",
  price: 12500,
  original_price: 14000,
  stock_quantity: 5,
  original_stock: 5,
  description: "Latest Tecno Spark 10 with powerful features",
  warranty_info: "1 year manufacturer warranty",
  discount_info: "10% off - Limited time offer",
  seller_notes: "Popular model, fast selling",
  images: [
    "/products/tecno-spark-10-front.jpg",
    "/products/tecno-spark-10-back.jpg",
    "/products/tecno-spark-10-side.jpg",
    "/products/tecno-spark-10-interface.jpg",
    "/products/tecno-spark-10-accessories.jpg"
  ],
  tags: ["smartphone", "4G", "dual-sim", "large-battery"],
  is_featured: true,
  status: "active"
};

// Step 4: Daily Updates
const abebaDailyUpdates = {
  date: "2026-03-11",
  stock_updates: [
    {
      product_id: 1,
      product_name: "Tecno Spark 10",
      previous_stock: 8,
      current_stock: 5,
      change: -3,
      reason: "Sales"
    }
  ],
  price_updates: [
    {
      product_id: 1,
      product_name: "Tecno Spark 10",
      previous_price: 14000,
      new_price: 12500,
      change: -1500,
      reason: "Promotion"
    }
  ],
  new_products: [
    {
      name: "Samsung Galaxy A05",
      brand: "Samsung",
      model: "A057F",
      price: 14500,
      stock: 3
    }
  ],
  sold_products: [
    {
      product_name: "Tecno Spark 10",
      quantity: 3,
      revenue: 37500
    }
  ]
};

// Step 5: Shop Performance Tracking
const abebaShopMetrics = {
  overview: {
    totalProducts: 25,
    totalViews: 1250,
    totalMessages: 45,
    totalSales: 18,
    totalRevenue: 285000,
    productsGrowth: 15,
    viewsGrowth: 25,
    messagesGrowth: 30,
    revenueGrowth: 20
  },
  topProducts: [
    {
      id: 1,
      name: "Tecno Spark 10",
      views: 450,
      inquiries: 28,
      sold: 8,
      performance_score: 85
    },
    {
      id: 2,
      name: "Samsung Galaxy A05",
      views: 320,
      inquiries: 15,
      sold: 5,
      performance_score: 75
    }
  ],
  customerEngagement: {
    totalMessages: 45,
    responseRate: 95,
    avgResponseTime: "2 hours",
    avgRating: 4.5,
    reviewCount: 12
  }
};

// Export for use in components
export {
  abebaRegistration,
  abebaShopDetails,
  tecnoSpark10,
  abebaDailyUpdates,
  abebaShopMetrics
};
