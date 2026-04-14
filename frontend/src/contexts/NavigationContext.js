import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);
  const [navigationStack, setNavigationStack] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Update current page when location changes
    const pathname = location.pathname;
    setCurrentPage(pathname);
    
    // Update navigation history
    setNavigationHistory(prev => {
      const newHistory = [...prev, pathname];
      // Keep only last 20 entries
      return newHistory.slice(-20);
    });

    // Update canGoBack state
    setCanGoBack(window.history.length > 1);

    // Update navigation stack
    setNavigationStack(prev => {
      const pageData = {
        path: pathname,
        title: getPageTitle(pathname),
        timestamp: Date.now()
      };
      
      // Avoid duplicates
      const filtered = prev.filter(item => item.path !== pathname);
      return [...filtered, pageData].slice(-10);
    });
  }, [location]);

  const handleBack = (fallbackPath = '/') => {
    if (navigationStack.length > 1) {
      // Go to previous page in our stack
      const previousPage = navigationStack[navigationStack.length - 2];
      navigate(previousPage.path);
      return true;
    } else if (window.history.length > 1) {
      // Use browser history
      navigate(-1);
      return true;
    } else {
      // No history, go to fallback
      navigate(fallbackPath);
      return false;
    }
  };

  const handleNavigate = (path, state = {}) => {
    navigate(path, { state: { ...state, fromNavigation: true } });
  };

  const handleReplace = (path, state = {}) => {
    navigate(path, { replace: true, state: { ...state, fromNavigation: true } });
  };

  const getPreviousPage = () => {
    if (navigationStack.length > 1) {
      return navigationStack[navigationStack.length - 2];
    }
    return null;
  };

  const getNavigationPath = () => {
    return navigationStack.map(item => item.path);
  };

  const clearHistory = () => {
    setNavigationStack([]);
    setNavigationHistory([]);
  };

  const addNavigationEntry = (path, title) => {
    const entry = {
      path,
      title: title || getPageTitle(path),
      timestamp: Date.now()
    };
    
    setNavigationStack(prev => {
      const filtered = prev.filter(item => item.path !== path);
      return [...filtered, entry].slice(-10);
    });
  };

  const value = {
    // State
    currentPage,
    canGoBack,
    navigationHistory,
    navigationStack,
    
    // Actions
    handleBack,
    handleNavigate,
    handleReplace,
    getPreviousPage,
    getNavigationPath,
    clearHistory,
    addNavigationEntry,
    
    // Utilities
    isHomePage: currentPage === '/',
    isProductPage: currentPage.startsWith('/product/'),
    isSearchPage: currentPage === '/search' || currentPage.startsWith('/search?'),
    isCheckoutPage: currentPage.startsWith('/checkout'),
    isProfilePage: currentPage.startsWith('/profile'),
    isErrorPage: currentPage.startsWith('/error') || currentPage.startsWith('/404')
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

// Helper function to get page title from path
const getPageTitle = (pathname) => {
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
    '/help': 'Help Center',
    '/login': 'Login',
    '/register': 'Register',
    '/forgot-password': 'Forgot Password'
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
  if (pathname.startsWith('/brand/')) {
    return 'Brand';
  }

  return pageMap[pathname] || 'Page';
};

export default NavigationProvider;
