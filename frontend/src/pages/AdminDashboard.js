import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api";
import './AdminDashboard.css';
import AdvancedGlobalNavigation from "../components/AdvancedGlobalNavigation";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [showBackButton, setShowBackButton] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    price: "",
    category: "",
    description: ""
  });

  useEffect(() => {
    // Check if user came from another page
    const hasHistory = window.history.length > 1;
    setShowBackButton(hasHistory);
  }, [location]);

  const handleBack = () => {
    // Navigate back to previous page or home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      console.log('Admin - Products fetched:', res.data);
      setProducts(res.data || []);
      setError("");
    } catch (err) {
      console.error("Admin - Failed to fetch products:", err);
      setError("Failed to load products from database");
      // Try to get products from localStorage as fallback
      const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
      let allProducts = [];
      shops.forEach(shop => {
        if (shop.products) {
          allProducts = allProducts.concat(shop.products);
        }
      });
      setProducts(allProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        console.log('=== DELETING PRODUCT ===');
        console.log('Product ID to delete:', productId);
        
        // Try backend first
        try {
          await API.delete(`/products/${productId}`);
          console.log('✅ Product deleted from backend');
        } catch (backendErr) {
          console.log('⚠️ Backend not available, using localStorage fallback');
        }
        
        // ALWAYS delete from localStorage (complete deletion)
        console.log('🗑️ Deleting from localStorage...');
        
        // Get all shops
        const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
        console.log('📋 Found shops:', shops.length);
        
        let deletedFromShop = false;
        
        // Delete from ALL shops
        shops.forEach((shop, shopIndex) => {
          if (shop.products && shop.products.length > 0) {
            const initialCount = shop.products.length;
            shop.products = shop.products.filter(p => p.id !== productId);
            const finalCount = shop.products.length;
            
            if (finalCount < initialCount) {
              console.log(`✅ Deleted from shop: ${shop.shopName || shop.electronicsHouseName} (Shop ID: ${shop.id})`);
              deletedFromShop = true;
            }
          }
        });
        
        // Update localStorage with ALL shops
        localStorage.setItem('registeredShops', JSON.stringify(shops));
        console.log('✅ LocalStorage updated with all shops');
        
        // Update current shop if it exists
        const currentShop = JSON.parse(localStorage.getItem('currentShop') || '{}');
        if (currentShop.id) {
          const currentShopIndex = shops.findIndex(shop => shop.id === currentShop.id);
          if (currentShopIndex !== -1) {
            localStorage.setItem('currentShop', JSON.stringify(shops[currentShopIndex]));
            console.log('✅ Current shop updated');
          }
        }
        
        // Update state
        setProducts(products.filter(p => p.id !== productId));
        console.log('✅ State updated');
        
        if (deletedFromShop) {
          alert("✅ Product deleted successfully from all locations!");
        } else {
          alert("⚠️ Product not found in any shop, but state updated.");
        }
        
      } catch (err) {
        console.error('❌ Error during deletion:', err);
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        alert("❌ Error deleting product. Please try again.");
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price,
      category: product.category,
      description: product.description
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/products/${editingProduct.id}`, formData);
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...p, ...formData } : p
      ));
      setEditingProduct(null);
      alert("Product updated successfully!");
    } catch (err) {
      console.error("Failed to update product:", err);
      // Fallback: update in localStorage
      const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
      shops.forEach(shop => {
        if (shop.products) {
          shop.products = shop.products.map(p => 
            p.id === editingProduct.id ? { ...p, ...formData } : p
          );
        }
      });
      localStorage.setItem('registeredShops', JSON.stringify(shops));
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...p, ...formData } : p
      ));
      setEditingProduct(null);
      alert("Product updated in local storage!");
    }
  };

  const handleToggleStatus = async (productId) => {
    try {
      const product = products.find(p => p.id === productId);
      const newStatus = !product.is_available;
      
      await API.put(`/products/${productId}`, { is_available: newStatus });
      setProducts(products.map(p => 
        p.id === productId ? { ...p, is_available: newStatus } : p
      ));
      alert(`Product ${newStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (err) {
      console.error("Failed to toggle product status:", err);
      // Fallback: toggle in localStorage
      const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
      shops.forEach(shop => {
        if (shop.products) {
          shop.products = shop.products.map(p => 
            p.id === productId ? { ...p, is_available: !p.is_available } : p
          );
        }
      });
      localStorage.setItem('registeredShops', JSON.stringify(shops));
      const product = products.find(p => p.id === productId);
      setProducts(products.map(p => 
        p.id === productId ? { ...p, is_available: !p.is_available } : p
      ));
      alert(`Product status toggled in local storage!`);
    }
  };

  const handleAddSample = async () => {
    try {
      const sampleProduct = {
        name: `Sample Product ${Date.now().toString().slice(-4)}`,
        brand: "SampleBrand",
        price: Math.floor(Math.random() * 50000) + 5000,
        category: "Electronics",
        description: "Sample product for testing",
        is_available: true
      };
      
      await API.post("/products", sampleProduct);
      fetchProducts();
      alert("Sample product added successfully!");
    } catch (err) {
      console.error("Failed to add sample product:", err);
      // Fallback: add to localStorage
      const currentShop = JSON.parse(localStorage.getItem('currentShop') || '{}');
      if (currentShop.id) {
        const shops = JSON.parse(localStorage.getItem('registeredShops') || '[]');
        const shopIndex = shops.findIndex(shop => shop.id === currentShop.id);
        if (shopIndex !== -1) {
          if (!shops[shopIndex].products) {
            shops[shopIndex].products = [];
          }
          const newProduct = {
            id: Date.now().toString(),
            name: "Sample Product",
            brand: "Sample Brand",
            price: 999,
            category: "Electronics",
            description: "This is a sample product for testing purposes",
            shop_id: currentShop.id,
            createdAt: new Date().toISOString()
          };
          shops[shopIndex].products.push(newProduct);
          localStorage.setItem('registeredShops', JSON.stringify(shops));
          fetchProducts();
          alert("Sample product added to local storage!");
        }
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">
          <h2>Loading Admin Dashboard...</h2>
          <p>Please wait while we fetch products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Bold Red Back Button */}
      {showBackButton && (
        <AdvancedGlobalNavigation
          showBackButton={true}
          backText="← BACK"
          theme="glassmorphism"
          size="medium"
          glassIntensity="medium"
          customBackAction={handleBack}
        />
      )}

      <div className="admin-header">
        <h1>🔐 Admin Dashboard</h1>
        <div className="admin-stats">
          <div className="stat-card">
            <h3>📱 Total Products</h3>
            <span className="stat-number">{products.length}</span>
          </div>
          <div className="stat-card">
            <h3>✅ Active Products</h3>
            <span className="stat-number">{products.filter(p => p.is_available !== false).length}</span>
          </div>
          <div className="stat-card">
            <h3>⏸️ Inactive Products</h3>
            <span className="stat-number">{products.filter(p => p.is_available === false).length}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <div className="admin-actions">
        <button className="btn btn-primary" onClick={fetchProducts}>
          🔄 Refresh Products
        </button>
        <button className="btn btn-success" onClick={handleAddSample}>
          ➕ Add Sample Product
        </button>
      </div>

      {editingProduct && (
        <div className="edit-modal">
          <div className="edit-form">
            <h3>✏️ Edit Product: {editingProduct.name}</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Product Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Brand:</label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price (ETB):</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  💾 Save Changes
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingProduct(null)}>
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-section">
        <h2>📦 Products Management</h2>
        
        {products.length === 0 ? (
          <div className="no-products">
            <div className="no-products-icon">📦</div>
            <h3>No Products Found</h3>
            <p>There are no products in the system.</p>
            <button className="btn btn-primary" onClick={handleAddSample}>
              ➕ Add Sample Product
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product, index) => (
              <div key={`${product.id}-${index}`} className={`product-card ${!product.is_available ? 'inactive' : ''}`}>
                <div className="product-image">
                  <img 
                    src={product.images?.[0] || product.image || `https://picsum.photos/seed/${product.name || 'product'}/300/200.jpg`} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/seed/${product.name || 'product'}/300/200.jpg`;
                    }}
                  />
                  <div className="product-status">
                    <span className={`status-badge ${product.is_available !== false ? 'active' : 'inactive'}`}>
                      {product.is_available !== false ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-brand">🏷️ {product.brand}</p>
                  <p className="product-price">💰 ETB {product.price?.toLocaleString()}</p>
                  <p className="product-category">📂 {product.category}</p>
                  <p className="product-description">📝 {product.description || 'No description'}</p>
                </div>
                
                <div className="product-actions">
                  <button className="btn btn-edit" onClick={() => handleEdit(product)}>
                    ✏️ Edit
                  </button>
                  <button className="btn btn-delete" onClick={() => handleDelete(product.id)}>
                    🗑️ Delete
                  </button>
                  <button 
                    className={`btn ${product.is_available !== false ? 'btn-deactivate' : 'btn-activate'}`} 
                    onClick={() => handleToggleStatus(product.id)}
                  >
                    {product.is_available !== false ? '⏸️ Deactivate' : '▶️ Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;