import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './GlobalNavigation.css';

const GlobalNavigation = ({ 
  showBackButton = true, 
  customBackAction = null,
  backText = '← Back',
  position = 'top-left',
  theme = 'default',
  size = 'medium',
  showBreadcrumb = false,
  customStyle = {}
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Check if there's a previous page in history
    const checkHistory = () => {
      const historyLength = window.history.length;
      const hasHistory = historyLength > 1;
      setCanGoBack(hasHistory);
    };

    checkHistory();
    
    // Listen for history changes
    window.addEventListener('popstate', checkHistory);
    
    return () => {
      window.removeEventListener('popstate', checkHistory);
    };
  }, [location]);

  const handleBack = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setShowTooltip(false);

    // Add ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'nav-ripple';
    document.body.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);

    // Execute back action
    if (customBackAction) {
      customBackAction();
    } else if (canGoBack) {
      navigate(-1);
    } else {
      // No previous page, go to home
      navigate('/');
    }

    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const getBackButtonClasses = () => {
    const classes = [
      'global-back-button',
      `global-back-button--${position}`,
      `global-back-button--${theme}`,
      `global-back-button--${size}`,
      isAnimating ? 'global-back-button--animating' : '',
      !canGoBack ? 'global-back-button--disabled' : ''
    ].filter(Boolean).join(' ');

    return classes;
  };

  const getTooltipText = () => {
    if (!canGoBack) return 'Go to Home';
    return 'Go back to previous page';
  };

  return (
    <>
      {/* Global Back Button */}
      {showBackButton && (
        <button
          className={getBackButtonClasses()}
          onClick={handleBack}
          disabled={isAnimating}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label={getTooltipText()}
          title={getTooltipText()}
          style={customStyle}
        >
          <span className="back-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
              <line x1="22" y1="12" x2="9" y2="12"></line>
            </svg>
          </span>
          <span className="back-text">{backText}</span>
          
          {/* Tooltip */}
          {showTooltip && (
            <div className="back-tooltip">
              {getTooltipText()}
              <div className="tooltip-arrow"></div>
            </div>
          )}
        </button>
      )}

      {/* Breadcrumb Navigation (Optional) */}
      {showBreadcrumb && (
        <div className="global-breadcrumb">
          <nav aria-label="Breadcrumb">
            <ol className="breadcrumb-list">
              <li className="breadcrumb-item">
                <a href="/" className="breadcrumb-link">Home</a>
              </li>
              {location.pathname !== '/' && (
                <>
                  <li className="breadcrumb-separator">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </li>
                  <li className="breadcrumb-item">
                    <span className="breadcrumb-current">
                      {getCurrentPageName(location.pathname)}
                    </span>
                  </li>
                </>
              )}
            </ol>
          </nav>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="nav-progress-indicator">
        <div className="progress-bar"></div>
      </div>
    </>
  );
};

// Helper function to get current page name
const getCurrentPageName = (pathname) => {
  const pageMap = {
    '/': 'Home',
    '/products': 'Products',
    '/search': 'Search',
    '/cart': 'Shopping Cart',
    '/checkout': 'Checkout',
    '/profile': 'My Profile',
    '/orders': 'My Orders',
    '/settings': 'Settings',
    '/about': 'About Us',
    '/contact': 'Contact',
    '/help': 'Help Center'
  };

  // Check for dynamic routes
  if (pathname.startsWith('/product/')) {
    return 'Product Details';
  }
  if (pathname.startsWith('/category/')) {
    return 'Category';
  }
  if (pathname.startsWith('/seller/')) {
    return 'Seller Profile';
  }
  if (pathname.startsWith('/order/')) {
    return 'Order Details';
  }

  return pageMap[pathname] || 'Page';
};

export default GlobalNavigation;
