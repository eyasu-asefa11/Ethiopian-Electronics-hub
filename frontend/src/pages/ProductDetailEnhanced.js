import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetailEnhanced.css';
import API from '../api';

const ProductDetailEnhanced = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [shop, setShop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [activeTab, setActiveTab] = useState('specs');
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchProductDetails();
    if (user) {
      checkWishlistStatus();
    }
  }, [id, user]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const [productRes, shopRes, reviewsRes, relatedRes] = await Promise.all([
        API.get(`/products/${id}`),
        API.get(`/shops/${id}/shop`),
        API.get(`/products/${id}/reviews`),
        API.get(`/products/${id}/related`)
      ]);
      
      setProduct(productRes.data);
      setShop(shopRes.data);
      setReviews(reviewsRes.data);
      setRelatedProducts(relatedRes.data);
      
      // Track product view
      await API.post(`/products/${id}/view`);
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
      navigate('/auth');
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
      console.error('Error updating wishlist:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !user) return;

    setSendingMessage(true);
    try {
      await API.post('/messages', {
        receiver_id: shop.user_id,
        product_id: id,
        subject: `Inquiry about ${product.name}`,
        message: message
      });
      setMessage('');
      setShowContactModal(false);
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const renderSpecifications = (specs) => {
    if (!specs) return null;
    
    const specObj = typeof specs === 'string' ? JSON.parse(specs) : specs;
    
    return (
      <div className="specifications-table">
        <table>
          <tbody>
            <tr>
              <td>Brand</td>
              <td>{product.brand || '-'}</td>
            </tr>
            <tr>
              <td>Model</td>
              <td>{product.model || '-'}</td>
            </tr>
            <tr>
              <td>Category</td>
              <td>{product.category}</td>
            </tr>
            {specObj.ram && (
              <tr>
                <td>RAM</td>
                <td>{specObj.ram}</td>
              </tr>
            )}
            {specObj.storage && (
              <tr>
                <td>Storage</td>
                <td>{specObj.storage}</td>
              </tr>
            )}
            {specObj.battery && (
              <tr>
                <td>Battery</td>
                <td>{specObj.battery}</td>
              </tr>
            )}
            {specObj.camera && (
              <tr>
                <td>Camera</td>
                <td>{specObj.camera}</td>
              </tr>
            )}
            {specObj.screen && (
              <tr>
                <td>Screen Size</td>
                <td>{specObj.screen}</td>
              </tr>
            )}
            {specObj.processor && (
              <tr>
                <td>Processor</td>
                <td>{specObj.processor}</td>
              </tr>
            )}
            <tr>
              <td>Condition</td>
              <td className={`condition ${product.condition}`}>
                {product.condition}
              </td>
            </tr>
            <tr>
              <td>Color</td>
              <td>{product.color || '-'}</td>
            </tr>
            <tr>
              <td>Price</td>
              <td className="price">
                {new Intl.NumberFormat('en-ET', {
                  style: 'currency',
                  currency: 'ETB'
                }).format(product.price)}
                {product.original_price && product.original_price > product.price && (
                  <span className="original-price">
                    {new Intl.NumberFormat('en-ET', {
                      style: 'currency',
                      currency: 'ETB'
                    }).format(product.original_price)}
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>Availability</td>
              <td className={`stock ${product.stock_quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {product.stock_quantity > 0 ? 
                  `${product.stock_quantity} Available` : 
                  'Out of Stock'
                }
              </td>
            </tr>
            {product.warranty_info && (
              <tr>
                <td>Warranty</td>
                <td>{product.warranty_info}</td>
              </tr>
            )}
            {product.discount_info && (
              <tr>
                <td>Discount</td>
                <td className="discount">{product.discount_info}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (!product) {
    return <div className="not-found">Product not found</div>;
  }

  const images = product.images ? JSON.parse(product.images) : [];
  const specs = product.specifications ? JSON.parse(product.specifications) : {};

  return (
    <div className="product-detail-enhanced">
      <div className="product-container">
        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image">
            <img 
              src={images[selectedImage] || '/placeholder-product.jpg'} 
              alt={product.name}
            />
          </div>
          <div className="image-thumbnails">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} ${index + 1}`}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="product-info">
          <h1>{product.name}</h1>
          
          <div className="price-section">
            <div className="current-price">
              {new Intl.NumberFormat('en-ET', {
                style: 'currency',
                currency: 'ETB'
              }).format(product.price)}
            </div>
            {product.original_price && product.original_price > product.price && (
              <div className="discount-badge">
                {Math.round((1 - product.price / product.original_price) * 100)}% OFF
              </div>
            )}
          </div>

          <div className="stock-info">
            {product.stock_quantity > 0 ? (
              <span className="in-stock">
                ✓ {product.stock_quantity} items available
              </span>
            ) : (
              <span className="out-of-stock">
                ✗ Out of stock
              </span>
            )}
          </div>

          <div className="action-buttons">
            <button 
              className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={toggleWishlist}
            >
              {isWishlisted ? '❤️ Saved' : '🤍 Save to Wishlist'}
            </button>
            <button 
              className="contact-btn"
              onClick={() => setShowContactModal(true)}
            >
              💬 Contact Shop
            </button>
          </div>

          {/* Tabs */}
          <div className="product-tabs">
            <div className="tab-buttons">
              <button 
                className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                📋 Specifications
              </button>
              <button 
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                📝 Description
              </button>
              <button 
                className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                ⭐ Reviews ({reviews.length})
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'specs' && renderSpecifications(specs)}
              {activeTab === 'description' && (
                <div className="description">
                  <p>{product.description || 'No description available.'}</p>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="reviews-section">
                  {reviews.length > 0 ? (
                    reviews.map(review => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <strong>{review.username}</strong>
                            <div className="rating">
                              {'⭐'.repeat(review.rating)}
                            </div>
                          </div>
                          <div className="review-date">
                            {new Date(review.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        {review.title && <h4>{review.title}</h4>}
                        <p>{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet. Be the first to review!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shop Information */}
      {shop && (
        <div className="shop-section">
          <h3>Shop Information</h3>
          <div className="shop-card">
            <div className="shop-header">
              <div className="shop-info">
                <h4>{shop.name_en}</h4>
                <p>{shop.name_am}</p>
                <div className="shop-rating">
                  {'⭐'.repeat(Math.round(shop.rating))} ({shop.review_count} reviews)
                </div>
              </div>
              {shop.is_verified && (
                <div className="verified-badge">✓ Verified Shop</div>
              )}
            </div>
            
            <div className="shop-details">
              <p><strong>Address:</strong> {shop.address}, {shop.city}</p>
              <p><strong>Phone:</strong> {shop.phone}</p>
              {shop.whatsapp && (
                <p><strong>WhatsApp:</strong> {shop.whatsapp}</p>
              )}
              {shop.email && (
                <p><strong>Email:</strong> {shop.email}</p>
              )}
            </div>

            <div className="shop-actions">
              <button className="view-shop-btn">
                View All Products
              </button>
              <button className="call-btn">
                📞 Call Shop
              </button>
              {shop.whatsapp && (
                <button className="whatsapp-btn">
                  💬 WhatsApp
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h3>Related Products</h3>
          <div className="products-grid">
            {relatedProducts.map(relatedProduct => (
              <div key={relatedProduct.id} className="product-card">
                <img 
                  src={relatedProduct.images?.[0] || '/placeholder-product.jpg'} 
                  alt={relatedProduct.name}
                />
                <h4>{relatedProduct.name}</h4>
                <p className="price">
                  {new Intl.NumberFormat('en-ET', {
                    style: 'currency',
                    currency: 'ETB'
                  }).format(relatedProduct.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="modal-overlay">
          <div className="contact-modal">
            <h3>Contact Shop</h3>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows="4"
            />
            <div className="modal-actions">
              <button 
                onClick={() => setShowContactModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={sendMessage}
                disabled={sendingMessage || !message.trim()}
                className="btn-primary"
              >
                {sendingMessage ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailEnhanced;
