// Add these routes to your App.js to complete the platform

import PriceComparison from './pages/PriceComparison';
import ShopOwnerRegistration from './pages/ShopOwnerRegistration';
import ProductListing from './pages/ProductListing';
import CustomerView from './pages/CustomerView';
import SimpleDashboard from './pages/SimpleDashboard';

// In your App.js Routes component, add these routes:

const AppRoutes = () => {
  return (
    <>
      {/* Platform Core Routes */}
      <Route path="/shop-register" element={<ShopOwnerRegistration user={user} />} />
      <Route path="/add-product" element={<ProductListing user={user} />} />
      <Route path="/shop" element={<CustomerView user={user} />} />
      <Route path="/compare" element={<PriceComparison user={user} />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<SimpleDashboard user={user} />} />

      {/* Existing Routes (keep what you have) */}
      <Route path="/" element={<Home user={user} />} />
      <Route path="/auth" element={<Auth user={user} setUser={setUser} />} />
    </>
  );
};
