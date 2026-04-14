import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';
import API from '../api';

const ProductDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [shop, setShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [activeTab, setActiveTab] = useState('specs');

  useEffect(() => {
    fetchProductDetails();
    if (user) {
      checkWishlistStatus();
    }
  }, [id, user]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const [productRes, shopRes, reviewsRes] = await Promise.all([
        API.get(`/products/${id}`),
        API.get(`/shops/${id}/shop`),
        API.get(`/products/${id}/reviews`)
      ]);
      
      setProduct(productRes.data);
      setShop(shopRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error('Error fetching product details:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await API.get(`/wishlist/check/${id}`);
      setIsWishlisted(response.data.isWishlisted);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isWishlisted) {
        await API.delete(`/wishlist/${id}`);
        setIsWishlisted(false);
      } else {
        await API.post(`/wishlist/${id}`);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const contactSeller = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowContactModal(true);
  };

  const sendMessage = async (message) => {
    try {
      await API.post('/messages', {
        receiver_id: shop.owner_id,
        product_id: product.id,
        shop_id: shop.id,
        message: message
      });
      setShowContactModal(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  const images = product.images || [product.image, product.frontImage, product.backImage].filter(img => img);
  const frontImage = images[0] || product.image || '/placeholder-product.png';
  const backImage = images[1] || images[0] || '/placeholder-product.png';
  const specs = [
    { label: 'Brand', value: product.brand },
    { label: 'Model', value: product.model || 'N/A' },
    { label: 'Category', value: product.category },
    { label: 'Condition', value: product.condition },
    { label: 'Stock Quantity', value: product.stock_quantity || 0 },
    { label: 'RAM', value: product.ram || 'N/A' },
    { label: 'Storage', value: product.storage || 'N/A' },
    { label: 'Battery', value: product.battery || 'N/A' },
    { label: 'Screen Size', value: product.screen_size || 'N/A' },
    { label: 'Screen Resolution', value: product.screen_resolution || 'N/A' },
    { label: 'Processor', value: product.processor || 'N/A' },
    { label: 'Front Camera', value: product.camera_front || 'N/A' },
    { label: 'Back Camera', value: product.camera_back || 'N/A' },
    { label: 'Color', value: product.color || 'N/A' },
    { label: 'Weight', value: product.weight || 'N/A' },
    { label: 'Dimensions', value: product.dimensions || 'N/A' },
    { label: 'Warranty', value: product.warranty_period || 'N/A' }
  ];

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="product-detail">
      <div className="product-container">
        {/* Image Gallery Section */}
        <div className="product-gallery">
          <div className="main-image">
            <img 
              src={selectedImage === 0 ? frontImage : selectedImage === 1 ? backImage : images[selectedImage]} 
              alt={product.name}
              onError={(e) => {
                e.target.src = '/placeholder-product.png';
              }}
            />
            {product.discount_percentage > 0 && (
              <div className="discount-badge">
                -{product.discount_percentage}%
              </div>
            )}
            <div className="image-view-label">
              {selectedImage === 0 ? 'Front View' : selectedImage === 1 ? 'Back View' : `Image ${selectedImage + 1}`}
            </div>
          </div>
          
          <div className="image-thumbnails">
            {/* Front Image Thumbnail */}
            <div
              className={`thumbnail ${selectedImage === 0 ? 'active' : ''}`}
              onClick={() => setSelectedImage(0)}
            >
              <img 
                src={frontImage}
                alt="Front view"
                onError={(e) => {
                  e.target.src = '/placeholder-product.png';
                }}
              />
              <span className="thumbnail-label">Front</span>
            </div>
            
            {/* Back Image Thumbnail */}
            {backImage && backImage !== frontImage && (
              <div
                className={`thumbnail ${selectedImage === 1 ? 'active' : ''}`}
                onClick={() => setSelectedImage(1)}
              >
                <img 
                  src={backImage}
                  alt="Back view"
                  onError={(e) => {
                    e.target.src = '/placeholder-product.png';
                  }}
                />
                <span className="thumbnail-label">Back</span>
              </div>
            )}
            
            {/* Additional Images */}
            {images.slice(2).map((image, index) => (
              <div
                key={index + 2}
                className={`thumbnail ${selectedImage === index + 2 ? 'active' : ''}`}
                onClick={() => setSelectedImage(index + 2)}
              >
                <img 
                  src={image}
                  alt={`View ${index + 3}`}
                  onError={(e) => {
                    e.target.src = '/placeholder-product.png';
                  }}
                />
                <span className="thumbnail-label">View {index + 3}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Product Information Section */}
        <div className="product-info">
          <div className="product-header">
            <h1>{product.name}</h1>
            <div className="product-meta">
              <span className="brand">{product.brand}</span>
              {product.model && <span className="model">Model: {product.model}</span>}
            </div>
          </div>

          <div className="price-section">
            <div className="price-row">
              <span className="current-price">{product.price.toLocaleString()} ETB</span>
              {product.original_price && product.original_price > product.price && (
                <span className="original-price">{product.original_price.toLocaleString()} ETB</span>
              )}
            </div>
            
            {product.discount_percentage > 0 && (
              <div className="discount-info">
                Save {product.discount_percentage}% - Limited time offer!
              </div>
            )}
          </div>

          <div className="product-actions">
            <button 
              className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
              onClick={toggleWishlist}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
            
            <button className="contact-btn" onClick={contactSeller}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Contact Seller
            </button>
          </div>

          <div className="stock-info">
            <span className={`stock-status ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock_quantity > 0 ? `${product.stock_quantity} units available` : 'Out of Stock'}
            </span>
          </div>

          <div className="rating-summary">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  width={20}
                  height={20}
                  viewBox="0 0 20 20"
                  fill={star <= Math.round(averageRating) ? "#fbbf24" : "#e5e7eb"}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="rating-text">{averageRating} ({reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="product-tabs">
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            Specifications
          </button>
          <button 
            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({reviews.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
          >
            Shop Information
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'specs' && (
            <div className="specs-table">
              <h3>Technical Specifications</h3>
              <div className="specs-grid">
                {specs.map((spec, index) => (
                  <div key={index} className="spec-item">
                    <span className="spec-label">{spec.label}</span>
                    <span className="spec-value">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'description' && (
            <div className="description-content">
              <h3>Product Description</h3>
              <p>{product.description || 'No description available for this product.'}</p>
              
              {product.warranty_period && (
                <div className="warranty-info">
                  <h4>Warranty Information</h4>
                  <p>Warranty Period: {product.warranty_period}</p>
                  {product.warranty_terms && <p>{product.warranty_terms}</p>}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-content">
              <h3>Customer Reviews</h3>
              {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to review this product!</p>
              ) : (
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <span className="reviewer-name">{review.username}</span>
                        <div className="review-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              width={16}
                              height={16}
                              viewBox="0 0 20 20"
                              fill={star <= review.rating ? "#fbbf24" : "#e5e7eb"}
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="review-date">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.title && <h4 className="review-title">{review.title}</h4>}
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'shop' && shop && (
            <div className="shop-content">
              <h3>Shop Information</h3>
              <div className="shop-details">
                <div className="shop-header">
                  <img src={shop.logo || '/placeholder-shop.png'} alt={shop.name} className="shop-logo" />
                  <div className="shop-info">
                    <h4>{shop.name}</h4>
                    <div className="shop-rating">
                      <span className="rating">⭐ {shop.rating || '0.0'}</span>
                      <span className="review-count">({shop.total_reviews || 0} reviews)</span>
                    </div>
                    {shop.is_verified && (
                      <div className="verification-badge">
                        ✅ Verified Shop
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="shop-contact">
                  <div className="contact-item">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>{shop.phone}</span>
                  </div>
                  
                  {shop.whatsapp && (
                    <div className="contact-item">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      <span>{shop.whatsapp}</span>
                    </div>
                  )}
                  
                  <div className="contact-item">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{shop.address}</span>
                  </div>
                </div>
                
                <div className="shop-description">
                  <p>{shop.description || 'No description available.'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal 
          shop={shop}
          product={product}
          onClose={() => setShowContactModal(false)}
          onSendMessage={sendMessage}
        />
      )}
    </div>
  );
};

const ContactModal = ({ shop, product, onClose, onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Contact Seller</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="product-info">
            <p><strong>Product:</strong> {product.name}</p>
            <p><strong>Shop:</strong> {shop.name}</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I'm interested in this product. Is it still available?"
                rows={4}
                required
              />
            </div>
            
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="send-btn">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
