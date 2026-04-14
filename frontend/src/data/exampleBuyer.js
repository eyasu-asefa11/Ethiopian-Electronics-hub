// Abel's Buyer Workflow
// This shows the complete process for customer journey

// Step 1: User Registration
const abelRegistration = {
  username: "abel_buyer",
  phone_numbers: ["0918765432"],
  phone_carriers: ["Ethio Telecom"],
  region: "addis_ababa",
  city: "addis_ababa",
  role: "buyer",
  preferences: {
    preferred_language: "en",
    notifications: true,
    whatsapp_updates: true
  }
};

// Step 2: Product Search Journey
const abelSearchJourney = {
  initial_search: {
    query: "smartphone under 15000 ETB",
    city: "Addis Ababa",
    category: "Phones",
    filters: {
      max_price: 15000,
      ram: "4GB",
      storage: "128GB",
      brand: "Tecno"
    }
  },
  search_results: [
    {
      id: 1,
      name: "Tecno Spark 10",
      brand: "Tecno",
      model: "KI5K",
      price: 12500,
      original_price: 14000,
      shop_name: "Abeba Electronics",
      shop_city: "Dilla",
      stock_quantity: 5,
      rating: 4.5,
      reviews: 12,
      images: ["/products/tecno-spark-10-front.jpg"],
      specifications: {
        ram: "4GB",
        storage: "128GB",
        battery: "5000mAh",
        camera: "50MP"
      },
      distance: "350km from Addis Ababa"
    },
    {
      id: 2,
      name: "Tecno Spark 10",
      brand: "Tecno",
      model: "KI5K",
      price: 13000,
      shop_name: "TechHub Addis",
      shop_city: "Addis Ababa",
      stock_quantity: 2,
      rating: 4.3,
      reviews: 8,
      images: ["/products/tecno-spark-10-front.jpg"],
      specifications: {
        ram: "4GB",
        storage: "128GB",
        battery: "5000mAh",
        camera: "50MP"
      },
      distance: "5km from current location"
    }
  ]
};

// Step 3: Product Comparison
const abelComparison = {
  comparing_products: [
    {
      shop: "Abeba Electronics (Dilla)",
      price: 12500,
      stock: 5,
      rating: 4.5,
      reviews: 12,
      shipping: "Available",
      delivery_time: "2-3 days",
      warranty: "1 year",
      contact: "0912345678",
      verified: true,
      discount: "10% off"
    },
    {
      shop: "TechHub Addis (Addis Ababa)",
      price: 13000,
      stock: 2,
      rating: 4.3,
      reviews: 8,
      shipping: "Not needed",
      delivery_time: "Same day",
      warranty: "6 months",
      contact: "0911122334",
      verified: false,
      discount: "No discount"
    }
  ],
  comparison_result: {
    best_price: "Abeba Electronics",
    best_rating: "Abeba Electronics",
    fastest_delivery: "TechHub Addis",
    best_warranty: "Abeba Electronics",
    recommendation: "Abeba Electronics - Better value despite distance"
  }
};

// Step 4: Product Details View
const abelProductView = {
  product_id: 1,
  product_name: "Tecno Spark 10",
  shop_details: {
    name: "Abeba Electronics",
    owner: "Abeba",
    city: "Dilla",
    address: "Main Street, Dilla, Ethiopia",
    phone: "0912345678",
    whatsapp: "0912345678",
    verified: true,
    rating: 4.5,
    review_count: 12,
    opening_hours: "8:00 AM - 8:00 PM",
    products_count: 25
  },
  product_specifications: {
    brand: "Tecno",
    model: "KI5K",
    ram: "4GB",
    storage: "128GB",
    battery: "5000mAh",
    camera: "50MP",
    screen_size: "6.6 inch",
    processor: "MediaTek Helio G85",
    operating_system: "Android 13",
    network: "4G LTE",
    sim_card: "Dual SIM",
    color: "Black",
    condition: "New"
  },
  pricing: {
    current_price: 12500,
    original_price: 14000,
    discount_percentage: 10,
    discount_amount: 1500
  },
  availability: {
    stock_quantity: 5,
    status: "In Stock",
    last_updated: "2026-03-11"
  },
  images: [
    {
      url: "/products/tecno-spark-10-front.jpg",
      label: "Front View"
    },
    {
      url: "/products/tecno-spark-10-back.jpg",
      label: "Back View"
    },
    {
      url: "/products/tecno-spark-10-side.jpg",
      label: "Side View"
    },
    {
      url: "/products/tecno-spark-10-interface.jpg",
      label: "Interface"
    },
    {
      url: "/products/tecno-spark-10-accessories.jpg",
      label: "Accessories"
    }
  ],
  warranty: "1 year manufacturer warranty",
  seller_notes: "Popular model, fast selling. Limited stock available."
};

// Step 5: Contact and Communication
const abelCommunication = {
  initial_contact: {
    type: "WhatsApp Message",
    message: "Hello, I'm interested in the Tecno Spark 10. Is it still available? Can you tell me more about the warranty?",
    sent_at: "2026-03-11 10:30 AM",
    shop_response_time: "30 minutes"
  },
  shop_reply: {
    message: "Hello! Yes, the Tecno Spark 10 is available. It comes with 1 year manufacturer warranty. I can also arrange delivery to Addis Ababa if needed. Would you like to see more photos?",
    sent_at: "2026-03-11 11:00 AM"
  },
  follow_up_questions: [
    "Can you deliver to Addis Ababa?",
    "What's the delivery cost?",
    "Do you accept mobile payment?",
    "Can I see more photos?",
    "Is the price negotiable?"
  ]
};

// Step 6: Purchase Decision
const abelPurchaseDecision = {
  decision_factors: {
    price_savings: 1500, // ETB saved compared to local shop
    shop_reputation: 4.5, // High rating
    product_availability: 5, // Good stock
    warranty_protection: "1 year",
    delivery_option: "Available",
    communication_quality: "Excellent"
  },
  final_decision: {
    action: "Proceed with purchase",
    shop: "Abeba Electronics",
    reason: "Best value despite distance - great price + warranty + good reputation",
    payment_method: "Mobile Banking",
    delivery_preference: "Door delivery to Addis Ababa",
    estimated_delivery: "2-3 days"
  }
};

// Step 7: Post-Purchase Experience
const abelPostPurchase = {
  order_confirmation: {
    order_id: "ORD-2026-0311-001",
    product: "Tecno Spark 10",
    price: 12500,
    delivery_fee: 500,
    total: 13000,
    estimated_delivery: "2026-03-13",
    tracking_number: "TRK-123456789"
  },
  delivery_tracking: [
    {
      date: "2026-03-11",
      status: "Order Confirmed",
      location: "Dilla"
    },
    {
      date: "2026-03-12",
      status: "Shipped",
      location: "Dilla"
    },
    {
      date: "2026-03-13",
      status: "In Transit",
      location: "Addis Ababa"
    },
    {
      date: "2026-03-13",
      status: "Delivered",
      location: "Addis Ababa"
    }
  ],
  product_review: {
    rating: 5,
    title: "Excellent Purchase Experience",
    comment: "Perfect phone, exactly as described. Abeba was very helpful and delivery was fast. Highly recommend!",
    review_date: "2026-03-15",
    would_recommend: true
  }
};

// Step 8: Long-term Relationship
const abelLoyalty = {
  wishlist_items: [
    {
      name: "Samsung Galaxy A05",
      shop: "Abeba Electronics",
      price: 14500,
      added_date: "2026-03-20"
    }
  ],
  saved_shops: [
    {
      name: "Abeba Electronics",
      city: "Dilla",
      rating: 4.5,
      saved_date: "2026-03-11"
    }
  ],
  stock_alerts: [
    {
      product_name: "Tecno Spark 20",
      shop: "Abeba Electronics",
      alert_type: "available",
      created_date: "2026-03-25"
    }
  ],
  search_history: [
    "smartphone under 15000 ETB",
    "Tecno Spark 10",
    "Samsung Galaxy A05",
    "4GB RAM phones",
    "5000mAh battery phones"
  ]
};

// Export for use in components
export {
  abelRegistration,
  abelSearchJourney,
  abelComparison,
  abelProductView,
  abelCommunication,
  abelPurchaseDecision,
  abelPostPurchase,
  abelLoyalty
};
