import React from 'react';
import { useLocation } from 'react-router-dom';
import AdvancedGlobalNavigation from './AdvancedGlobalNavigation';
import { useNavigation } from '../contexts/NavigationContext';

const AdvancedAppWrapper = ({ children }) => {
  const location = useLocation();
  const { isHomePage, isCheckoutPage, isErrorPage } = useNavigation();

  // Determine if we should show the back button
  const showBackButton = !isHomePage;
  
  // Determine theme based on current page
  const getTheme = () => {
    if (isCheckoutPage) return 'glass-gradient';
    if (isErrorPage) return 'glass-dark';
    return 'glassmorphism';
  };

  // Determine glass intensity
  const getGlassIntensity = () => {
    if (location.pathname.startsWith('/product/')) return 'light';
    if (location.pathname.startsWith('/checkout')) return 'medium';
    return 'medium';
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
    if (location.pathname.startsWith('/product/')) return '← Back';
    if (location.pathname.startsWith('/checkout')) return '← Back';
    if (location.pathname.startsWith('/profile')) return '← Back';
    if (location.pathname.startsWith('/search')) return '← Back';
    return '← Back';
  };

  // Custom back action for specific pages
  const getCustomBackAction = () => {
    // Add custom logic for specific pages if needed
    return null;
  };

  return (
    <div className="advanced-app-wrapper">
      {/* Advanced Global Navigation */}
      <AdvancedGlobalNavigation
        showBackButton={showBackButton}
        customBackAction={getCustomBackAction()}
        backText={getBackText()}
        position={getPosition()}
        theme={getTheme()}
        size="medium"
        showBreadcrumb={location.pathname !== '/' && location.pathname !== '/products'}
        showMobileMenu={true}
        glassIntensity={getGlassIntensity()}
      />
      
      {/* Main Content */}
      <main className="advanced-app-main">
        {children}
      </main>
      
      {/* Advanced Loading Indicator */}
      <div className="advanced-loading-indicator" />
      
      {/* Page Transition Overlay */}
      <div className="advanced-page-transition-overlay" />
      
      {/* Glass Morphism Background */}
      <div className="glass-background">
        <div className="glass-orb glass-orb-1"></div>
        <div className="glass-orb glass-orb-2"></div>
        <div className="glass-orb glass-orb-3"></div>
      </div>
    </div>
  );
};

export default AdvancedAppWrapper;
