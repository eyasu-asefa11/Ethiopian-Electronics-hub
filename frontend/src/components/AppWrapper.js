import React from 'react';
import { useLocation } from 'react-router-dom';
import GlobalNavigation from './GlobalNavigation';
import { useNavigation } from '../contexts/NavigationContext';

const AppWrapper = ({ children }) => {
  const location = useLocation();
  const { isHomePage, isCheckoutPage, isErrorPage } = useNavigation();

  // Determine if we should show the back button
  const showBackButton = !isHomePage;
  
  // Determine theme based on current page
  const getTheme = () => {
    if (isCheckoutPage) return 'colorful';
    if (isErrorPage) return 'error-page';
    return 'default';
  };

  // Determine position based on page type
  const getPosition = () => {
    if (isCheckoutPage) return 'top-left';
    if (location.pathname.startsWith('/product/')) return 'top-left';
    if (location.pathname.startsWith('/profile/')) return 'top-left';
    return 'top-left';
  };

  // Get back text based on context
  const getBackText = () => {
    if (location.pathname.startsWith('/product/')) return '← Back to Products';
    if (location.pathname.startsWith('/checkout')) return '← Back to Cart';
    if (location.pathname.startsWith('/profile')) return '← Back to Account';
    if (location.pathname.startsWith('/search')) return '← Back';
    return '← Back';
  };

  // Custom back action for specific pages
  const getCustomBackAction = () => {
    // Add custom logic for specific pages if needed
    return null;
  };

  return (
    <div className="app-wrapper">
      {/* Global Navigation */}
      <GlobalNavigation
        showBackButton={showBackButton}
        customBackAction={getCustomBackAction()}
        backText={getBackText()}
        position={getPosition()}
        theme={getTheme()}
        size="medium"
        showBreadcrumb={location.pathname !== '/' && location.pathname !== '/products'}
      />
      
      {/* Main Content */}
      <main className="app-main">
        {children}
      </main>
      
      {/* Loading Indicator */}
      <div className="app-loading-indicator" />
      
      {/* Page Transition Overlay */}
      <div className="page-transition-overlay" />
    </div>
  );
};

export default AppWrapper;
