import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css';
import './AddProductEnhanced.css';

const AddProduct = () => {
  const navigate = useNavigate();
  
  // Form state
  const [inputMethod, setInputMethod] = useState('writing');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [model, setModel] = useState('');
  const [stock_quantity, setStock_quantity] = useState('');
  const [ram, setRam] = useState('');
  const [storage, setStorage] = useState('');
  const [color, setColor] = useState('');
  const [condition, setCondition] = useState('');
  const [loading, setLoading] = useState(false);

  // Image states
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [frontImage, setFrontImage] = useState(null);
  const [frontImagePreview, setFrontImagePreview] = useState('');
  const [backImage, setBackImage] = useState(null);
  const [backImagePreview, setBackImagePreview] = useState('');
  const [shopGallery, setShopGallery] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [shopVideos, setShopVideos] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [warrantyDocuments, setWarrantyDocuments] = useState([]);

  // Voice input states
  const [isListening, setIsListening] = useState(false);
  const [voiceInput, setVoiceInput] = useState('');
  const recognition = useRef(null);

  // Initialize voice recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setVoiceInput(transcript);
        parseVoiceInput(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startVoiceInput = () => {
    if (recognition.current && !isListening) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  const stopVoiceInput = () => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const parseVoiceInput = (transcript) => {
    // Simple parsing logic for voice input
    const lowerTranscript = transcript.toLowerCase();
    
    // Extract brand
    const brands = ['samsung', 'apple', 'iphone', 'xiaomi', 'oppo', 'vivo', 'tecno', 'huawei', 'nokia'];
    for (const brand of brands) {
      if (lowerTranscript.includes(brand)) {
        setBrand(brand.charAt(0).toUpperCase() + brand.slice(1));
        break;
      }
    }

    // Extract price (look for numbers)
    const priceMatch = transcript.match(/\d+/);
    if (priceMatch) {
      setPrice(priceMatch[0]);
    }

    // Extract category
    const categories = ['smartphone', 'laptop', 'tablet', 'headphone', 'camera', 'gaming'];
    for (const category of categories) {
      if (lowerTranscript.includes(category)) {
        setCategory(category.charAt(0).toUpperCase() + category.slice(1));
        break;
      }
    }

    // Extract storage
    const storageMatch = transcript.match(/(\d+)\s*(gb|tb)/i);
    if (storageMatch) {
      setStorage(storageMatch[1] + storageMatch[2].toUpperCase());
    }

    // Extract RAM
    const ramMatch = transcript.match(/(\d+)\s*gb/i);
    if (ramMatch) {
      setRam(ramMatch[1] + 'GB');
    }
  };

  // Enhanced file handlers with validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('📷 Image selected:', file.name, file.type, file.size);
      
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        alert('❌ Invalid image format. Please select JPG, PNG, GIF, or WebP files.');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('❌ Image file too large. Please select an image smaller than 10MB.');
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log('✅ Image loaded successfully');
        setImagePreview(event.target.result);
      };
      reader.onerror = (error) => {
        console.error('❌ Error reading image:', error);
        alert('❌ Error reading image file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFrontImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('📷 Front image selected:', file.name, file.type, file.size);
      
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        alert('❌ Invalid image format. Please select JPG, PNG, GIF, or WebP files.');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('❌ Image file too large. Please select an image smaller than 10MB.');
        return;
      }
      
      setFrontImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log('✅ Front image loaded successfully');
        setFrontImagePreview(event.target.result);
      };
      reader.onerror = (error) => {
        console.error('❌ Error reading front image:', error);
        alert('❌ Error reading front image file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('📷 Back image selected:', file.name, file.type, file.size);
      
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        alert('❌ Invalid image format. Please select JPG, PNG, GIF, or WebP files.');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('❌ Image file too large. Please select an image smaller than 10MB.');
        return;
      }
      
      setBackImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log('✅ Back image loaded successfully');
        setBackImagePreview(event.target.result);
      };
      reader.onerror = (error) => {
        console.error('❌ Error reading back image:', error);
        alert('❌ Error reading back image file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('🖼️ Gallery files selected:', files.length, files.map(f => f.name));
    
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const validFiles = files.filter(file => {
      if (!validImageTypes.includes(file.type)) {
        console.warn('⚠️ Skipping invalid file:', file.name, file.type);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        console.warn('⚠️ Skipping large file:', file.name, file.size);
        return false;
      }
      return true;
    });
    
    if (validFiles.length === 0) {
      alert('❌ No valid images selected. Please select JPG, PNG, GIF, or WebP files smaller than 10MB.');
      return;
    }
    
    const newGalleryImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setShopGallery(prev => [...prev, ...newGalleryImages]);
    setGalleryPreviews(prev => [...prev, ...newGalleryImages.map(img => img.preview)]);
    
    console.log('✅ Gallery images added:', newGalleryImages.length);
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('🎥 Video files selected:', files.length, files.map(f => f.name));
    
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
    const validFiles = files.filter(file => {
      if (!validVideoTypes.includes(file.type)) {
        console.warn('⚠️ Skipping invalid video file:', file.name, file.type);
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        console.warn('⚠️ Skipping large video file:', file.name, file.size);
        return false;
      }
      return true;
    });
    
    if (validFiles.length === 0) {
      alert('❌ No valid videos selected. Please select MP4, WebM, OGG, MOV, or AVI files smaller than 50MB.');
      return;
    }
    
    const newVideos = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    
    setShopVideos(prev => [...prev, ...newVideos]);
    setVideoPreviews(prev => [...prev, ...newVideos.map(video => video.preview)]);
    
    console.log('✅ Videos added:', newVideos.length);
  };

  const handleWarrantyChange = (e) => {
    const files = Array.from(e.target.files);
    setWarrantyDocuments(prev => [...prev, ...files]);
  };

  const removeGalleryImage = (index) => {
    setShopGallery(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setShopVideos(prev => prev.filter((_, i) => i !== index));
    setVideoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeWarrantyDoc = (index) => {
    setWarrantyDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('=== PRODUCT SUBMISSION DEBUG ===');
      console.log('Step 1: Starting product submission...');
      
      // Check localStorage availability
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        console.log('✅ LocalStorage is available');
      } catch (storageErr) {
        console.error('❌ LocalStorage not available:', storageErr);
        alert('❌ Browser storage is not available. Please check your browser settings.');
        setLoading(false);
        return;
      }

      // Get current shop
      const currentShop = JSON.parse(localStorage.getItem('currentShop') || '{}');
      if (!currentShop.id) {
        console.error('❌ No current shop found');
        alert('❌ Please register your shop first before adding products.');
        setLoading(false);
        return;
      }

      console.log('✅ Current shop found:', currentShop.electronicsHouseName);

      // Validate required fields
      if (!name || !brand || !price || !category || !description) {
        console.error('❌ Missing required fields');
        alert('❌ Please fill in all required fields (Product Name, Brand, Price, Category, Description).');
        setLoading(false);
        return;
      }

      console.log('✅ Required fields validated');

      // Validate image
      if (imagePreview && typeof imagePreview !== 'string') {
        console.error('❌ Invalid image format');
        alert('❌ Invalid image format. Please select a valid image file.');
        setLoading(false);
        return;
      }

      console.log('✅ Image validation passed');

      // Create new product object
      const newProduct = {
        id: Date.now().toString(),
        name: name.trim(),
        brand: brand.trim(),
        price: parseFloat(price),
        category: category.trim(),
        description: description.trim(),
        model: model.trim(),
        stock_quantity: parseInt(stock_quantity) || 0,
        ram: ram.trim(),
        storage: storage.trim(),
        color: color.trim(),
        condition: condition.trim(),
        // Fix image storage - ensure proper array format
        images: [imagePreview, frontImagePreview, backImagePreview].filter(img => img),
        image: imagePreview, // Keep for backward compatibility
        frontImage: frontImagePreview,
        backImage: backImagePreview,
        shopGallery: galleryPreviews,
        shopVideos: videoPreviews,
        warrantyDocuments: warrantyDocuments,
        shop_id: currentShop.id,
        is_available: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('✅ New product object created:', newProduct);
      console.log('🖼️ Product images:', newProduct.images);

      // Get registered shops
      const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
      console.log('📋 Found shops:', shops.length);

      // Find current shop index
      const shopIndex = shops.findIndex(shop => shop.id === currentShop.id);
      if (shopIndex === -1) {
        console.error('❌ Shop not found in registered shops');
        alert('❌ Shop not found. Please register your shop again.');
        setLoading(false);
        return;
      }

      console.log('✅ Shop found at index:', shopIndex);

      // Initialize products array if it doesn't exist
      if (!shops[shopIndex].products) {
        shops[shopIndex].products = [];
        console.log('📝 Initialized products array for shop');
      }

      // Add new product
      shops[shopIndex].products.push(newProduct);
      console.log('✅ Product added to shop');

      // Check localStorage size
      const dataString = JSON.stringify(shops);
      console.log('📊 Data size:', dataString.length, 'characters');

      if (dataString.length > 4 * 1024 * 1024) { // 4MB warning
        console.warn('⚠️ Large data size detected:', dataString.length);
        alert('⚠️ Warning: Large amount of data detected. Consider removing some old products or images.');
      }

      // Save to localStorage
      try {
        localStorage.setItem('registeredShops', dataString);
        console.log('✅ Saved to localStorage successfully');
      } catch (saveErr) {
        console.error('❌ Error saving to localStorage:', saveErr);
        if (saveErr.name === 'QuotaExceededError') {
          alert('❌ Storage quota exceeded. Please remove some products or images and try again.');
        } else {
          alert('❌ Error saving product. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Update current shop
      localStorage.setItem('currentShop', JSON.stringify(shops[shopIndex]));
      console.log('✅ Current shop updated');

      console.log('🎉 Product added successfully!');
      alert('✅ Product added successfully!');

      // Reset form
      setName('');
      setBrand('');
      setPrice('');
      setCategory('');
      setDescription('');
      setModel('');
      setStock_quantity('');
      setRam('');
      setStorage('');
      setColor('');
      setCondition('');
      setImage(null);
      setImagePreview('');
      setFrontImage(null);
      setFrontImagePreview('');
      setBackImage(null);
      setBackImagePreview('');
      setShopGallery([]);
      setGalleryPreviews([]);
      setShopVideos([]);
      setVideoPreviews([]);
      setWarrantyDocuments([]);

      // Navigate to shopkeeper dashboard
      setTimeout(() => {
        navigate('/shopkeeper-dashboard');
      }, 1500);

    } catch (err) {
      console.error('❌ Error during product submission:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      
      // Provide specific error messages
      if (err.message.includes('LocalStorage')) {
        alert('❌ Storage error: Unable to save product data. Please check your browser storage settings.');
      } else if (err.message.includes('FileReader')) {
        alert('❌ Image processing error: Unable to process the selected image. Please try a different image.');
      } else if (err.message.includes('JSON')) {
        alert('❌ Data format error: Unable to process product data. Please try again.');
      } else {
        alert('❌ Error adding product: ' + err.message + '. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-card">
        <div className="add-product-header">
          <h2>📦 Add New Product</h2>
          <p>Add your electronics product to marketplace</p>
        </div>

        {/* Input Method Selection */}
        <div className="input-method-selector">
          <h3>🎤 Choose Input Method</h3>
          <div className="input-method-options">
            <button
              type="button"
              className={`input-method-btn ${inputMethod === 'writing' ? 'active' : ''}`}
              onClick={() => setInputMethod('writing')}
            >
              📝 Writing
            </button>
            <button
              type="button"
              className={`input-method-btn ${inputMethod === 'voice' ? 'active' : ''}`}
              onClick={() => setInputMethod('voice')}
            >
              🎤 Voice Input
            </button>
            <span>Speak your product details aloud</span>
          </div>
        </div>

        {inputMethod === 'voice' && (
          <div className="voice-input-section">
            <div className="voice-input-header">
              <h3>🎤 Voice Input</h3>
              <p>Speak clearly about your product. You can say things like:</p>
              <div className="voice-examples">
                <p><strong>"Add Samsung Galaxy S24, brand Samsung, price 25000, category smartphones, description 128GB storage, excellent condition, status in stock"</strong></p>
                <p><strong>"New iPhone 15 Pro by Apple, priced at 35000, smartphones category, features titanium body and A17 chip, available"</strong></p>
              </div>
            </div>
            
            <div className="voice-controls">
              {!isListening ? (
                <button
                  type="button"
                  className="voice-start-btn"
                  onClick={startVoiceInput}
                  disabled={!recognition.current}
                >
                  🎤 Start Recording
                </button>
              ) : (
                <button
                  type="button"
                  className="voice-stop-btn"
                  onClick={stopVoiceInput}
                >
                  ⏹️ Stop Recording
                </button>
              )}
              
              {isListening && (
                <div className="listening-indicator">
                  <div className="listening-dot"></div>
                  <span>Listening...</span>
                </div>
              )}
            </div>

            {voiceInput && (
              <div className="voice-result">
                <h4>📝 What I heard:</h4>
                <p className="voice-transcript">{voiceInput}</p>
              </div>
            )}

            {!recognition.current && (
              <div className="voice-warning">
                <p>⚠️ Voice recognition is not supported in your browser. Please use writing method or try Chrome/Edge browser.</p>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-product-form">
          {inputMethod === 'writing' ? (
            <>
              {/* Step 1: Basic Information */}
              <div className="form-section">
                <div className="section-header">
                  <h3>📝 Step 1: Basic Product Information</h3>
                  <p>Enter essential details about your product</p>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Product Name *</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g., Samsung Galaxy S24"
                      className="form-input"
                    />
                    <small className="form-hint">Enter exact product name</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="brand">Brand *</label>
                    <input
                      type="text"
                      id="brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      required
                      placeholder="e.g., Samsung"
                      className="form-input"
                    />
                    <small className="form-hint">Enter manufacturer brand</small>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price">Price (ETB) *</label>
                    <input
                      type="number"
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      min="0"
                      step="0.01"
                      placeholder="e.g., 25000"
                      className="form-input"
                    />
                    <small className="form-hint">Set your selling price in Ethiopian Birr</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      className="form-input"
                    >
                      <option value="">Select Category</option>
                      <option value="Smartphones">📱 Smartphones</option>
                      <option value="Laptops">💻 Laptops</option>
                      <option value="Tablets">📱 Tablets</option>
                      <option value="Smartwatches">⌚ Smartwatches</option>
                      <option value="Headphones">🎧 Headphones</option>
                      <option value="Cameras">📷 Cameras</option>
                      <option value="Gaming">🎮 Gaming</option>
                      <option value="Accessories">🔌 Accessories</option>
                      <option value="Other">📦 Other</option>
                    </select>
                    <small className="form-hint">Choose most appropriate category</small>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="model">Model</label>
                    <input
                      type="text"
                      id="model"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="e.g., S24 Ultra"
                      className="form-input"
                    />
                    <small className="form-hint">Enter specific model number</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="stock_quantity">Stock Quantity *</label>
                    <input
                      type="number"
                      id="stock_quantity"
                      value={stock_quantity}
                      onChange={(e) => setStock_quantity(e.target.value)}
                      required
                      min="0"
                      placeholder="e.g., 10"
                      className="form-input"
                    />
                    <small className="form-hint">How many units do you have in stock?</small>
                  </div>
                </div>
              </div>

              {/* Step 2: Technical Specifications */}
              <div className="form-section">
                <div className="section-header">
                  <h3>⚙️ Step 2: Technical Specifications</h3>
                  <p>Add detailed technical information about your product</p>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ram">RAM</label>
                    <input
                      type="text"
                      id="ram"
                      value={ram}
                      onChange={(e) => setRam(e.target.value)}
                      placeholder="e.g., 8GB"
                      className="form-input"
                    />
                    <small className="form-hint">Memory capacity (e.g., 4GB, 8GB, 16GB)</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="storage">Storage</label>
                    <input
                      type="text"
                      id="storage"
                      value={storage}
                      onChange={(e) => setStorage(e.target.value)}
                      placeholder="e.g., 128GB"
                      className="form-input"
                    />
                    <small className="form-hint">Internal storage capacity (e.g., 64GB, 128GB, 256GB)</small>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="color">Color</label>
                    <input
                      type="text"
                      id="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="e.g., Black"
                      className="form-input"
                    />
                    <small className="form-hint">Product color</small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="condition">Condition</label>
                    <select
                      id="condition"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="form-input"
                    >
                      <option value="">Select Condition</option>
                      <option value="New">🆕 Brand New</option>
                      <option value="Like New">✨ Like New</option>
                      <option value="Excellent">👍 Excellent</option>
                      <option value="Good">👌 Good</option>
                      <option value="Fair">📌 Fair</option>
                    </select>
                    <small className="form-hint">Product condition</small>
                  </div>
                </div>
              </div>

              {/* Step 3: Description */}
              <div className="form-section">
                <div className="section-header">
                  <h3>📄 Step 3: Product Description</h3>
                  <p>Provide detailed information about your product</p>
                </div>
                
                <div className="form-group full-width">
                  <label htmlFor="description">Description *</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows="6"
                    placeholder="Describe your product in detail. Include features, specifications, condition details, and any other relevant information..."
                    className="form-textarea"
                  />
                  <small className="form-hint">Be detailed and honest about your product's condition and features</small>
                </div>
              </div>

              {/* Step 4: Product Images */}
              <div className="form-section">
                <div className="section-header">
                  <h3>📸 Step 4: Product Images</h3>
                  <p>Add high-quality images to showcase your product</p>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="image">Main Product Image *</label>
                    <input
                      type="file"
                      id="image"
                      onChange={handleImageChange}
                      accept="image/*"
                      required
                      className="file-input"
                    />
                    <small className="form-hint">Main product image (JPG, PNG, GIF, WebP - Max 10MB)</small>
                    {imagePreview && (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Main product" />
                        <span>Main Image</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="frontImage">Front View Image</label>
                    <input
                      type="file"
                      id="frontImage"
                      onChange={handleFrontImageChange}
                      accept="image/*"
                      className="file-input"
                    />
                    <small className="form-hint">Front view of product (Optional)</small>
                    {frontImagePreview && (
                      <div className="image-preview">
                        <img src={frontImagePreview} alt="Front view" />
                        <span>Front View</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="backImage">Back View Image</label>
                    <input
                      type="file"
                      id="backImage"
                      onChange={handleBackImageChange}
                      accept="image/*"
                      className="file-input"
                    />
                    <small className="form-hint">Back view of product (Optional)</small>
                    {backImagePreview && (
                      <div className="image-preview">
                        <img src={backImagePreview} alt="Back view" />
                        <span>Back View</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 5: Additional Media */}
              <div className="form-section">
                <div className="section-header">
                  <h3>🎥 Step 5: Additional Media</h3>
                  <p>Add gallery images and videos to showcase your product better</p>
                </div>
                
                <div className="form-group full-width">
                  <label>🖼️ Shop Gallery Images</label>
                  <div className="media-upload-section">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryChange}
                      className="file-input"
                    />
                    <small className="form-hint">Upload multiple images to showcase your product from different angles (Optional)</small>
                    
                    {galleryPreviews.length > 0 && (
                      <div className="gallery-preview">
                        <h4>Gallery Preview:</h4>
                        <div className="gallery-grid">
                          {galleryPreviews.map((preview, index) => (
                            <div key={index} className="gallery-item">
                              <img src={preview} alt={`Gallery ${index + 1}`} />
                              <button 
                                type="button" 
                                className="remove-btn" 
                                onClick={() => removeGalleryImage(index)}
                              >
                                ❌
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group full-width">
                  <label>🎥 Product Videos</label>
                  <div className="media-upload-section">
                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="file-input"
                    />
                    <small className="form-hint">Upload videos to demonstrate product functionality (Optional)</small>
                    
                    {videoPreviews.length > 0 && (
                      <div className="video-preview">
                        <h4>Video Preview:</h4>
                        <div className="video-grid">
                          {videoPreviews.map((preview, index) => (
                            <div key={index} className="video-item">
                              <video controls width="200" height="150">
                                <source src={preview} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                              <button 
                                type="button" 
                                className="remove-btn" 
                                onClick={() => removeVideo(index)}
                              >
                                ❌
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="form-section">
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="submit-btn" 
                    disabled={loading}
                  >
                    {loading ? '⏳ Adding Product...' : '➕ Add Product'}
                  </button>
                  <button 
                    type="button" 
                    className="reset-btn" 
                    onClick={() => window.location.reload()}
                  >
                    🔄 Reset Form
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="voice-input-form">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g., Samsung Galaxy S24"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Brand *</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                  placeholder="e.g., Samsung"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Price (ETB) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  placeholder="e.g., 25000"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="form-input"
                >
                  <option value="">Select Category</option>
                  <option value="Smartphones">📱 Smartphones</option>
                  <option value="Laptops">💻 Laptops</option>
                  <option value="Tablets">📱 Tablets</option>
                  <option value="Smartwatches">⌚ Smartwatches</option>
                  <option value="Headphones">🎧 Headphones</option>
                  <option value="Cameras">📷 Cameras</option>
                  <option value="Gaming">🎮 Gaming</option>
                  <option value="Accessories">🔌 Accessories</option>
                  <option value="Other">📦 Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Model</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g., S24 Ultra"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Stock Quantity *</label>
                <input
                  type="number"
                  value={stock_quantity}
                  onChange={(e) => setStock_quantity(e.target.value)}
                  required
                  min="0"
                  placeholder="e.g., 10"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>RAM</label>
                <input
                  type="text"
                  value={ram}
                  onChange={(e) => setRam(e.target.value)}
                  placeholder="e.g., 8GB"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Storage</label>
                <input
                  type="text"
                  value={storage}
                  onChange={(e) => setStorage(e.target.value)}
                  placeholder="e.g., 128GB"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g., Black"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label>Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="form-input"
                >
                  <option value="">Select Condition</option>
                  <option value="New">🆕 Brand New</option>
                  <option value="Like New">✨ Like New</option>
                  <option value="Excellent">👍 Excellent</option>
                  <option value="Good">👌 Good</option>
                  <option value="Fair">📌 Fair</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="6"
                  placeholder="Describe your product in detail..."
                  className="form-textarea"
                />
              </div>
              
              <div className="form-group">
                <label>Main Product Image *</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  required
                  className="file-input"
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Main product" />
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={loading}
                >
                  {loading ? '⏳ Adding Product...' : '➕ Add Product'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
