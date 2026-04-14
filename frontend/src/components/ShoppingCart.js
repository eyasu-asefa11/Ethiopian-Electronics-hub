import React, { useState, useEffect, useContext } from 'react';
import './ShoppingCart.css';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const ShoppingCart = ({ language = 'am' }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const translations = {
    en: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      product: 'Product',
      price: 'Price',
      quantity: 'Quantity',
      total: 'Total',
      remove: 'Remove',
      saveForLater: 'Save for Later',
      proceedToCheckout: 'Proceed to Checkout',
      subtotal: 'Subtotal',
      discount: 'Discount',
      shipping: 'Shipping',
      grandTotal: 'Grand Total',
      couponCode: 'Coupon Code',
      applyCoupon: 'Apply Coupon',
      savedForLater: 'Saved for Later',
      moveToCart: 'Move to Cart',
      removeSaved: 'Remove from Saved',
      continueShopping: 'Continue Shopping',
      itemAdded: 'Item added to cart',
      itemRemoved: 'Item removed from cart',
      cartUpdated: 'Cart updated',
      couponApplied: 'Coupon applied successfully',
      invalidCoupon: 'Invalid coupon code'
    },
    am: {
      title: '��ግዢ መጋዣ',
      empty: 'የግዢዎ ባዶ ነው',
      product: 'ምርት',
      price: '��ጋ',
      quantity: 'ብዛት',
      total: 'ድምር',
      remove: 'አስወግድ',
      saveForLater: 'ለኋላ አስቀምጥ',
      proceedToCheckout: 'ወደ መግዢ ቀጥል',
      subtotal: 'ንዑስ ድምር',
      discount: 'ቅናሽ',
      shipping: 'ወረፋድ',
      grandTotal: 'ዋጋ ድምር',
      couponCode: 'የቅናሽ ኮድ',
      applyCoupon: 'ቅናሽ ተጠቀም',
      savedForLater: 'ለኋላ የተቀመጡ',
      moveToCart: 'ወደ ግዢ ውሰድ',
      removeSaved: 'ከተቀመጡት አስወግድ',
      continueShopping: 'ግዢን ቀጥል',
      itemAdded: 'እቃው ወደ ግዢ ተጨምረዋል',
      itemRemoved: 'እቃው ከግዢ ተወግዷል',
      cartUpdated: 'ግዢው ተዘምኗል',
      couponApplied: 'ቅናሹ በተሳካ ሁኔታ ተጠቀም',
      invalidCoupon: 'የተሳሳተ የቅናሽ ኮድ'
    }
  };

  const t = translations[language];

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCart = (newCart) => {
    localStorage.setItem('shoppingCart', JSON.stringify(newCart));
    setCart(newCart);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    saveCart(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    saveCart(newCart);
    showNotification(t.itemRemoved);
  };

  const saveForLater = (productId) => {
    const itemToSave = cart.find(item => item.id === productId);
    if (itemToSave) {
      const savedItems = JSON.parse(localStorage.getItem('savedForLater') || '[]');
      savedItems.push(itemToSave);
      localStorage.setItem('savedForLater', JSON.stringify(savedItems));
      removeFromCart(productId);
      showNotification('Item saved for later');
    }
  };

  const applyCoupon = () => {
    if (couponCode === 'SAVE10') {
      setDiscount(0.1);
      showNotification(t.couponApplied);
    } else if (couponCode === 'SAVE20') {
      setDiscount(0.2);
      showNotification(t.couponApplied);
    } else {
      showNotification(t.invalidCoupon);
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 1000 ? 0 : 50; // Free shipping over 1000 ETB
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping();
    const discountAmount = subtotal * discount;
    return subtotal + shipping - discountAmount;
  };

  const showNotification = (message) => {
    // Simple notification - you can replace with a better notification system
    alert(message);
  };

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      showNotification('Your cart is empty');
      return;
    }
    navigate('/checkout', { state: { cart, discount } });
  };

  if (cart.length === 0) {
    return (
      <div className="shopping-cart empty-cart">
        <div className="empty-cart-content">
          <div className="empty-cart-icon">🛒</div>
          <h2>{t.empty}</h2>
          <p>{language === 'am' ? 'የመልካም ምርቶችን ይመልከቱ' : 'Browse our amazing products'}</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            {t.continueShopping}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shopping-cart">
      <div className="cart-header">
        <h1>{t.title}</h1>
        <button 
          className="btn btn-outline"
          onClick={() => navigate('/products')}
        >
          {t.continueShopping}
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img 
                  src={item.images?.[0] || item.image || '/placeholder-product.jpg'} 
                  alt={item.name}
                />
              </div>
              
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-shop">{item.shopName || 'Shop Name'}</p>
                <p className="item-brand">{item.brand}</p>
              </div>

              <div className="item-price">
                <span className="price-amount">ETB {item.price}</span>
              </div>

              <div className="item-quantity">
                <div className="quantity-controls">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="item-total">
                <span className="total-amount">ETB {(item.price * item.quantity).toFixed(2)}</span>
              </div>

              <div className="item-actions">
                <button 
                  className="btn btn-text"
                  onClick={() => saveForLater(item.id)}
                >
                  {t.saveForLater}
                </button>
                <button 
                  className="btn btn-text danger"
                  onClick={() => removeFromCart(item.id)}
                >
                  {t.remove}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h3>{t.title} {t.total}</h3>
            
            <div className="summary-row">
              <span>{t.subtitle}</span>
              <span>ETB {calculateSubtotal().toFixed(2)}</span>
            </div>

            {discount > 0 && (
              <div className="summary-row discount">
                <span>{t.discount} ({(discount * 100).toFixed(0)}%)</span>
                <span>-ETB {(calculateSubtotal() * discount).toFixed(2)}</span>
              </div>
            )}

            <div className="summary-row">
              <span>{t.shipping}</span>
              <span>{calculateShipping() === 0 ? 'FREE' : `ETB ${calculateShipping()}`}</span>
            </div>

            <div className="summary-row total">
              <span>{t.grandTotal}</span>
              <span className="total-amount">ETB {calculateTotal().toFixed(2)}</span>
            </div>

            <div className="coupon-section">
              <div className="coupon-input-group">
                <input
                  type="text"
                  placeholder={t.couponCode}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="coupon-input"
                />
                <button 
                  className="btn btn-outline"
                  onClick={applyCoupon}
                >
                  {t.applyCoupon}
                </button>
              </div>
              <small>Try: SAVE10 or SAVE20</small>
            </div>

            <button 
              className="btn btn-primary checkout-btn"
              onClick={proceedToCheckout}
            >
              {t.proceedToCheckout}
            </button>

            <div className="trust-badges">
              <div className="badge">
                <span className="badge-icon">🔒</span>
                <span>Secure Payment</span>
              </div>
              <div className="badge">
                <span className="badge-icon">🚚</span>
                <span>Fast Delivery</span>
              </div>
              <div className="badge">
                <span className="badge-icon">↩️</span>
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
