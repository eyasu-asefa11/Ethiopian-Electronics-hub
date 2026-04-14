import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AdvancedGlobalNavigation.css';

const AdvancedGlobalNavigation = ({ 
  showBackButton = true, 
  customBackAction = null,
  backText = '← Back',
  position = 'top-left',
  theme = 'glassmorphism',
  size = 'medium',
  showBreadcrumb = false,
  customStyle = {},
  showMobileMenu = true,
  glassIntensity = 'medium'
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [canGoBack, setCanGoBack] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Check device type and screen size
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
    };

    // Check history
    const checkHistory = () => {
      const hasHistory = window.history.length > 1;
      setCanGoBack(hasHistory);
    };

    // Handle scroll for glassmorphism effect
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Handle mouse movement for dynamic effects
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    checkDevice();
    checkHistory();
    handleScroll();
    
    window.addEventListener('resize', checkDevice);
    window.addEventListener('popstate', checkHistory);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('popstate', checkHistory);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [location]);

  useEffect(() => {
    // Close mobile menu when clicking outside
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleBack = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setShowTooltip(false);
    setMobileMenuOpen(false);

    // Create advanced ripple effect
    createAdvancedRipple();

    // Execute back action
    if (customBackAction) {
      customBackAction();
    } else if (canGoBack) {
      navigate(-1);
    } else {
      navigate('/');
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const createAdvancedRipple = () => {
    const ripple = document.createElement('div');
    ripple.className = 'advanced-nav-ripple';
    ripple.style.left = `${mousePosition.x}px`;
    ripple.style.top = `${mousePosition.y}px`;
    document.body.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 800);
  };

  const getBackButtonClasses = () => {
    const classes = [
      'advanced-global-back-button',
      `advanced-global-back-button--${position}`,
      `advanced-global-back-button--${theme}`,
      `advanced-global-back-button--${size}`,
      `advanced-global-back-button--glass-${glassIntensity}`,
      isAnimating ? 'advanced-global-back-button--animating' : '',
      !canGoBack ? 'advanced-global-back-button--disabled' : '',
      isMobile ? 'advanced-global-back-button--mobile' : 'advanced-global-back-button--desktop',
      scrollY > 50 ? 'advanced-global-back-button--scrolled' : ''
    ].filter(Boolean).join(' ');

    return classes;
  };

  const getMenuClasses = () => {
    const classes = [
      'advanced-mobile-menu',
      `advanced-mobile-menu--${theme}`,
      `advanced-mobile-menu--glass-${glassIntensity}`,
      mobileMenuOpen ? 'advanced-mobile-menu--open' : 'advanced-mobile-menu--closed',
      isMobile ? 'advanced-mobile-menu--mobile' : 'advanced-mobile-menu--desktop'
    ].filter(Boolean).join(' ');

    return classes;
  };

  const getTooltipText = () => {
    if (!canGoBack) return 'Go to Home';
    return 'Go back to previous page';
  };

  const menuItems = [
    { 
      icon: '🏠', 
      label: 'Home', 
      path: '/', 
      action: () => navigate('/') 
    },
    { 
      icon: '🔍', 
      label: 'Search', 
      path: '/search', 
      action: () => navigate('/search') 
    },
    { 
      icon: '🛒', 
      label: 'Cart', 
      path: '/cart', 
      action: () => navigate('/cart') 
    },
    { 
      icon: '👤', 
      label: 'Profile', 
      path: '/profile', 
      action: () => navigate('/profile') 
    },
    { 
      icon: '📦', 
      label: 'Orders', 
      path: '/orders', 
      action: () => navigate('/orders') 
    },
    { 
      icon: '⚙️', 
      label: 'Settings', 
      path: '/settings', 
      action: () => navigate('/settings') 
    },
    { 
      icon: '💬', 
      label: 'Help', 
      path: '/help', 
      action: () => navigate('/help') 
    },
    { 
      icon: '📞', 
      label: 'Contact', 
      path: '/contact', 
      action: () => navigate('/contact') 
    }
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      createAdvancedRipple();
    }
  };

  const handleMenuItemClick = (item) => {
    item.action();
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Advanced Back Button */}
      {showBackButton && (
        <button
          ref={buttonRef}
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
          
          {/* Glassmorphism Glow Effect */}
          <div className="glass-glow"></div>
          
          {/* Advanced Tooltip */}
          {showTooltip && (
            <div className="advanced-tooltip">
              <div className="tooltip-content">
                {getTooltipText()}
              </div>
              <div className="tooltip-arrow"></div>
            </div>
          )}
        </button>
      )}

      {/* Mobile Menu Button (3 dots) */}
      {showMobileMenu && isMobile && (
        <button
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label="Menu"
          aria-expanded={mobileMenuOpen}
        >
          <div className="menu-dots">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
          <div className="menu-glow"></div>
        </button>
      )}

      {/* Advanced Mobile Menu */}
      {showMobileMenu && (
        <div className={getMenuClasses()} ref={menuRef}>
          <div className="menu-header">
            <h3>Navigation</h3>
            <button 
              className="menu-close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="menu-items">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`menu-item ${location.pathname === item.path ? 'menu-item--active' : ''}`}
                onClick={() => handleMenuItemClick(item)}
              >
                <span className="menu-item-icon">{item.icon}</span>
                <span className="menu-item-label">{item.label}</span>
                {location.pathname === item.path && (
                  <span className="menu-item-indicator"></span>
                )}
              </button>
            ))}
          </div>
          
          <div className="menu-footer">
            <div className="user-info">
              <div className="user-avatar">
                <img src="/api/placeholder/40/40" alt="User" />
              </div>
              <div className="user-details">
                <span className="user-name">Guest User</span>
                <span className="user-status">Not logged in</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Overlay */}
      {mobileMenuOpen && (
        <div className="menu-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Advanced Breadcrumb (Optional) */}
      {showBreadcrumb && !isMobile && (
        <div className="advanced-breadcrumb">
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

      {/* Advanced Progress Indicator */}
      <div className="advanced-progress-indicator">
        <div className="progress-bar"></div>
        <div className="progress-glow"></div>
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

  if (pathname.startsWith('/product/')) return 'Product Details';
  if (pathname.startsWith('/category/')) return 'Category';
  if (pathname.startsWith('/seller/')) return 'Seller Profile';
  if (pathname.startsWith('/order/')) return 'Order Details';

  return pageMap[pathname] || 'Page';
};

export default AdvancedGlobalNavigation;
