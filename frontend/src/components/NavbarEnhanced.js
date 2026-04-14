import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [history, setHistory] = useState([]);
  const [cartItems, setCartItems] = useState(0);
  const [customerUser, setCustomerUser] = useState(null);

  useEffect(() => {
    // Track navigation history
    const currentPath = location.pathname;
    setHistory(prev => {
      const newHistory = [...prev];
      // Remove current path if it already exists (to avoid duplicates)
      const existingIndex = newHistory.findIndex(item => item.path === currentPath);
      if (existingIndex > -1) {
        newHistory.splice(existingIndex, 1);
      }
      // Add current path
      newHistory.push({ path: currentPath, timestamp: Date.now() });
      // Keep only last 10 items
      return newHistory.slice(-10);
    });

    // Check if we can go back/forward
    setCanGoBack(window.history.length > 1);
    setCanGoForward(false); // Browser forward history is complex to track
    
    // Update cart count
    updateCartCount();
    
    // Check customer authentication
    checkCustomerAuth();
  }, [location]);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    setCartItems(itemCount);
  };

  const checkCustomerAuth = () => {
    const customerToken = localStorage.getItem('customerToken');
    if (customerToken) {
      const customerData = localStorage.getItem('customerUser');
      if (customerData) {
        setCustomerUser(JSON.parse(customerData));
      }
    }
  };

  const handleGoBack = () => {
    if (canGoBack) {
      navigate(-1);
    }
  };

  const handleGoForward = () => {
    if (canGoForward) {
      navigate(1);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleCustomerLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerUser');
    setCustomerUser(null);
    navigate('/');
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return '🏠 Home';
    if (path === '/registered-shops') return '🏪 Registered Shops';
    if (path === '/add-product') return '📦 Add Product';
    if (path === '/admin-dashboard') return '⚙️ Admin Dashboard';
    if (path === '/product-categories') return '📱 Categories';
    if (path === '/customer-registration') return '👤 Customer Registration';
    if (path === '/cart') return '🛒 Shopping Cart';
    if (path === '/checkout') return '💳 Checkout';
    if (path === '/customer-login' || path === '/customer-register') return '👤 Customer Account';
    if (path === '/customer-dashboard') return '📊 Customer Dashboard';
    return '🌐 Ethiopian Electronics';
  };

  return (
    <div style={{ 
      padding: "15px 20px", 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        {/* Navigation Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={handleGoBack}
            disabled={!canGoBack}
            style={{
              padding: "8px 12px",
              background: canGoBack ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "6px",
              cursor: canGoBack ? "pointer" : "not-allowed",
              fontSize: "14px",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
            onMouseEnter={(e) => {
              if (canGoBack) {
                e.target.style.background = "rgba(255,255,255,0.3)";
                e.target.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.background = canGoBack ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            ← Back
          </button>
          <button
            onClick={handleGoForward}
            disabled={!canGoForward}
            style={{
              padding: "8px 12px",
              background: canGoForward ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "6px",
              cursor: canGoForward ? "pointer" : "not-allowed",
              fontSize: "14px",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
            onMouseEnter={(e) => {
              if (canGoForward) {
                e.target.style.background = "rgba(255,255,255,0.3)";
                e.target.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.background = canGoForward ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Forward →
          </button>
        </div>

        {/* Page Title */}
        <div style={{ 
          color: "white", 
          fontSize: "18px", 
          fontWeight: "600",
          textAlign: "center",
          flex: 1
        }}>
          {getPageTitle()}
        </div>

        {/* Right Side Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {/* Shopping Cart */}
          <Link
            to="/cart"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "white",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.3)",
              transition: "all 0.3s ease",
              position: "relative"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255,255,255,0.2)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255,255,255,0.1)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            🛒 Cart
            {cartItems > 0 && (
              <span style={{
                position: "absolute",
                top: "-8px",
                right: "-8px",
                background: "#ff4757",
                color: "white",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "bold"
              }}>
                {cartItems}
              </span>
            )}
          </Link>

          {/* Customer Account */}
          {customerUser ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link
                to="/customer-dashboard"
                style={{
                  color: "white",
                  textDecoration: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  transition: "all 0.3s ease",
                  fontSize: "14px"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.2)";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.1)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                📊 Dashboard
              </Link>
              <button
                onClick={handleCustomerLogout}
                style={{
                  color: "white",
                  background: "rgba(255,71,87,0.2)",
                  border: "1px solid rgba(255,71,87,0.5)",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,71,87,0.3)";
                  e.target.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255,71,87,0.2)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                🚪 Logout
              </button>
            </div>
          ) : (
            <Link
              to="/customer-login"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "rgba(76,175,80,0.2)",
                border: "1px solid rgba(76,175,80,0.5)",
                transition: "all 0.3s ease",
                fontSize: "14px"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(76,175,80,0.3)";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(76,175,80,0.2)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              👤 Login / Register
            </Link>
          )}

          {/* Home Button */}
          <button
            onClick={handleGoHome}
            style={{
              color: "white",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255,255,255,0.2)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255,255,255,0.1)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
