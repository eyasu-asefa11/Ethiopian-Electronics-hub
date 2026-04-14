import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [history, setHistory] = useState([]);

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
  }, [location]);

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

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return '🏠 Home';
    if (path === '/registered-shops') return '🏪 Registered Shops';
    if (path === '/add-product') return '📦 Add Product';
    if (path === '/admin') return '⚙️ Admin Dashboard';
    if (path === '/product-categories') return '📱 Categories';
    if (path === '/customer-registration') return '👤 Customer Registration';
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
        maxWidth: "1200px",
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
              if (canGoBack) {
                e.target.style.background = "rgba(255,255,255,0.2)";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            ⬅️ Back
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
              if (canGoForward) {
                e.target.style.background = "rgba(255,255,255,0.2)";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            Forward ➡️
          </button>

          <button
            onClick={handleGoHome}
            style={{
              padding: "8px 12px",
              background: "rgba(255,255,255,0.2)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255,255,255,0.3)";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255,255,255,0.2)";
              e.target.style.transform = "translateY(0)";
            }}
          >
            🏠 Home
          </button>
        </div>

        {/* Page Title */}
        <div style={{
          color: "white",
          fontSize: "18px",
          fontWeight: "600",
          textAlign: "center"
        }}>
          {getPageTitle()}
        </div>

        {/* Navigation Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <Link 
            to="/" 
            style={{ 
              color: "white", 
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              transition: "all 0.3s ease",
              background: location.pathname === "/" ? "rgba(255,255,255,0.2)" : "transparent"
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== "/") {
                e.target.style.background = "rgba(255,255,255,0.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/") {
                e.target.style.background = "transparent";
              }
            }}
          >
            📱 Products
          </Link>

          <Link 
            to="/registered-shops"
            style={{ 
              color: "white", 
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              transition: "all 0.3s ease",
              background: location.pathname === "/registered-shops" ? "rgba(255,255,255,0.2)" : "transparent"
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== "/registered-shops") {
                e.target.style.background = "rgba(255,255,255,0.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/registered-shops") {
                e.target.style.background = "transparent";
              }
            }}
          >
            🏪 Shops
          </Link>

          <Link 
            to="/add-product" 
            style={{ 
              color: "white", 
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              transition: "all 0.3s ease",
              background: location.pathname === "/add-product" ? "rgba(255,255,255,0.2)" : "transparent"
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== "/add-product") {
                e.target.style.background = "rgba(255,255,255,0.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/add-product") {
                e.target.style.background = "transparent";
              }
            }}
          >
            📦 Add Product
          </Link>

          <Link 
            to="/admin"
            style={{ 
              color: "white", 
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "6px",
              transition: "all 0.3s ease",
              background: location.pathname === "/admin" ? "rgba(255,255,255,0.2)" : "transparent"
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== "/admin") {
                e.target.style.background = "rgba(255,255,255,0.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== "/admin") {
                e.target.style.background = "transparent";
              }
            }}
          >
            ⚙️ Admin
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;