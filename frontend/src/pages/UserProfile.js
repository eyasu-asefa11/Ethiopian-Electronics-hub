import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';
import API from '../api';

const UserProfile = ({ user, onLogout }) => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [wishlist, setWishlist] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city_id: user?.city_id || '',
    address: user?.address || ''
  });
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchCities();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const [wishlistRes, reviewsRes, messagesRes] = await Promise.all([
        API.get('/wishlist'),
        API.get('/users/reviews'),
        API.get('/messages')
      ]);
      
      setWishlist(wishlistRes.data);
      setReviews(reviewsRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await API.get('/cities');
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put('/users/profile', profileData);
      setEditingProfile(false);
      // Update user context if needed
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const removeFromWishlist = async (productId) => {
    try {
      await API.delete(`/wishlist/${productId}`);
      setWishlist(wishlist.filter(item => item.product_id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const markMessageAsRead = async (messageId) => {
    try {
      await API.patch(`/messages/${messageId}/read`);
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await API.delete(`/messages/${messageId}`);
        setMessages(messages.filter(msg => msg.id !== messageId));
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  if (!user) {
    return (
      <div className="user-profile-not-logged">
        <div className="not-logged-content">
          <h2>Please Login</h2>
          <p>You need to be logged in to view your profile.</p>
          <button onClick={() => navigate('/auth')} className="login-btn">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-info">
          <div className="avatar">
            <span className="avatar-text">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="user-details">
            <h1>{user.username}</h1>
            <p className="user-email">{user.email}</p>
            <div className="user-role">
              <span className={`role-badge ${user.role}`}>
                {user.role === 'seller' ? '🏪 Seller' : '🛒 Buyer'}
              </span>
              {user.is_verified && (
                <span className="verified-badge">✅ Verified</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="profile-actions">
          <button 
            className="logout-btn"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('wishlist')}
        >
          Wishlist ({wishlist.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          My Reviews ({reviews.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          Messages ({messages.filter(m => !m.is_read).length})
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Profile Information</h2>
              <button 
                className="edit-btn"
                onClick={() => setEditingProfile(!editingProfile)}
              >
                {editingProfile ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
            
            {editingProfile ? (
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      placeholder="+251 9X XXX XXXX"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>City</label>
                    <select
                      name="city_id"
                      value={profileData.city_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Select your city</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-group full-width">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Your address..."
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-display">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Username</label>
                    <span>{user.username}</span>
                  </div>
                  <div className="info-item">
                    <label>Email</label>
                    <span>{user.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone</label>
                    <span>{user.phone || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <label>City</label>
                    <span>{user.city_name || 'Not selected'}</span>
                  </div>
                  <div className="info-item">
                    <label>Address</label>
                    <span>{user.address || 'Not provided'}</span>
                  </div>
                  <div className="info-item">
                    <label>Member Since</label>
                    <span>{new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="wishlist-section">
            <h2>My Wishlist</h2>
            {wishlist.length > 0 ? (
              <div className="wishlist-grid">
                {wishlist.map((item) => (
                  <div key={item.id} className="wishlist-item">
                    <div className="product-image">
                      <img 
                        src={item.image || '/placeholder-product.png'} 
                        alt={item.name}
                        onClick={() => navigate(`/product/${item.product_id}`)}
                      />
                    </div>
                    <div className="product-info">
                      <h3 onClick={() => navigate(`/product/${item.product_id}`)}>
                        {item.name}
                      </h3>
                      <p className="product-brand">{item.brand}</p>
                      <div className="product-price">
                        <span>{item.price.toLocaleString()} ETB</span>
                      </div>
                      <p className="shop-name">{item.shop_name}</p>
                    </div>
                    <div className="wishlist-actions">
                      <button 
                        className="view-product-btn"
                        onClick={() => navigate(`/product/${item.product_id}`)}
                      >
                        View Product
                      </button>
                      <button 
                        className="remove-btn"
                        onClick={() => removeFromWishlist(item.product_id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-wishlist">
                <div className="empty-icon">❤️</div>
                <h3>Your wishlist is empty</h3>
                <p>Start adding products you love!</p>
                <button 
                  className="browse-btn"
                  onClick={() => navigate('/')}
                >
                  Browse Products
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="reviews-section">
            <h2>My Reviews</h2>
            {reviews.length > 0 ? (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <div className="product-info">
                        <h4>{review.product_name}</h4>
                        <p className="shop-name">{review.shop_name}</p>
                      </div>
                      <div className="review-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={star <= review.rating ? 'star filled' : 'star'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    {review.title && <h5 className="review-title">{review.title}</h5>}
                    <p className="review-comment">{review.comment}</p>
                    <div className="review-meta">
                      <span className="review-date">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-reviews">
                <div className="empty-icon">⭐</div>
                <h3>No reviews yet</h3>
                <p>Share your experience with products you've purchased!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="messages-section">
            <h2>Messages</h2>
            {messages.length > 0 ? (
              <div className="messages-list">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`message-item ${!message.is_read ? 'unread' : ''}`}
                  >
                    <div className="message-header">
                      <div className="sender-info">
                        <span className="sender-name">
                          {message.sender_username || message.receiver_username}
                        </span>
                        <span className="message-type">
                          {message.message_type}
                        </span>
                      </div>
                      <div className="message-meta">
                        <span className="message-date">
                          {new Date(message.created_at).toLocaleDateString()}
                        </span>
                        {!message.is_read && (
                          <span className="unread-indicator">New</span>
                        )}
                      </div>
                    </div>
                    {message.product_name && (
                      <p className="product-reference">Re: {message.product_name}</p>
                    )}
                    <p className="message-content">{message.message}</p>
                    <div className="message-actions">
                      {!message.is_read && (
                        <button 
                          className="mark-read-btn"
                          onClick={() => markMessageAsRead(message.id)}
                        >
                          Mark as Read
                        </button>
                      )}
                      <button 
                        className="delete-btn"
                        onClick={() => deleteMessage(message.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-messages">
                <div className="empty-icon">💬</div>
                <h3>No messages</h3>
                <p>Your conversations will appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
