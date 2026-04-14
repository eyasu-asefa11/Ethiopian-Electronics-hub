// Complete Workflow Demonstration
// This shows how Abeba and Abel interact on the platform

import React, { useState, useEffect } from 'react';
import './WorkflowDemo.css';

const WorkflowDemo = () => {
  const [activeStep, setActiveStep] = useState('seller-registration');
  const [workflowData, setWorkflowData] = useState({
    seller: null,
    buyer: null,
    product: null,
    interaction: null
  });

  const workflowSteps = [
    {
      id: 'seller-registration',
      title: '🏪 Abeba Registers Shop',
      type: 'seller',
      description: 'Abeba creates her electronics shop account'
    },
    {
      id: 'seller-adds-product',
      title: '📦 Abeba Adds Product',
      type: 'seller',
      description: 'Tecno Spark 10 added to inventory'
    },
    {
      id: 'buyer-searches',
      title: '🔍 Abel Searches',
      type: 'buyer',
      description: 'Abel searches for smartphones under 15,000 ETB'
    },
    {
      id: 'buyer-finds-product',
      title: '📱 Abel Finds Product',
      type: 'buyer',
      description: 'Discovers Abeba\'s Tecno Spark 10'
    },
    {
      id: 'buyer-compares',
      title: '⚖️ Abel Compares Options',
      type: 'buyer',
      description: 'Compares price, quality, and delivery options'
    },
    {
      id: 'buyer-contacts-seller',
      title: '💬 Abel Contacts Abeba',
      type: 'interaction',
      description: 'Sends WhatsApp message about the phone'
    },
    {
      id: 'seller-responds',
      title: '📞 Abeba Responds',
      type: 'interaction',
      description: 'Answers questions and offers delivery'
    },
    {
      id: 'purchase-completed',
      title: '✅ Purchase Completed',
      type: 'interaction',
      description: 'Abel buys the phone with delivery'
    },
    {
      id: 'delivery-tracking',
      title: '📦 Delivery Tracking',
      type: 'interaction',
      description: 'Phone shipped from Dilla to Addis Ababa'
    },
    {
      id: 'review-left',
      title: '⭐ Review Left',
      type: 'interaction',
      description: 'Abel leaves 5-star review for Abeba'
    }
  ];

  const renderSellerRegistration = () => (
    <div className="workflow-step">
      <div className="step-header">
        <h3>🏪 Abeba's Shop Registration</h3>
        <p>Dilla, Sidama Region</p>
      </div>
      
      <div className="registration-form">
        <div className="form-section">
          <h4>👤 Personal Information</h4>
          <div className="form-row">
            <label>Owner Name:</label>
            <input type="text" value="Abeba" readOnly />
          </div>
          <div className="form-row">
            <label>Username:</label>
            <input type="text" value="abeba_electronics" readOnly />
          </div>
          <div className="form-row">
            <label>Phone:</label>
            <input type="text" value="0912345678" readOnly />
          </div>
          <div className="form-row">
            <label>Carrier:</label>
            <input type="text" value="Ethio Telecom" readOnly />
          </div>
        </div>

        <div className="form-section">
          <h4>🏪 Shop Information</h4>
          <div className="form-row">
            <label>Shop Name (English):</label>
            <input type="text" value="Abeba Electronics" readOnly />
          </div>
          <div className="form-row">
            <label>Shop Name (Amharic):</label>
            <input type="text" value="አበባ ኤሌክትሮኒክስ" readOnly />
          </div>
          <div className="form-row">
            <label>City:</label>
            <input type="text" value="Dilla" readOnly />
          </div>
          <div className="form-row">
            <label>Region:</label>
            <input type="text" value="Sidama Region" readOnly />
          </div>
          <div className="form-row">
            <label>Address:</label>
            <input type="text" value="Main Street, Dilla" readOnly />
          </div>
        </div>

        <div className="form-section">
          <h4>📍 GPS Location</h4>
          <div className="form-row">
            <label>Latitude:</label>
            <input type="text" value="6.4167" readOnly />
          </div>
          <div className="form-row">
            <label>Longitude:</label>
            <input type="text" value="38.3167" readOnly />
          </div>
        </div>

        <div className="verification-status">
          <span className="status-badge verified">✓ Shop Verified</span>
          <span className="status-badge active">🟢 Account Active</span>
        </div>
      </div>
    </div>
  );

  const renderSellerAddsProduct = () => (
    <div className="workflow-step">
      <div className="step-header">
        <h3>📦 Abeba Adds Tecno Spark 10</h3>
        <p>Product Listing Details</p>
      </div>

      <div className="product-form">
        <div className="form-section">
          <h4>📱 Basic Information</h4>
          <div className="form-row">
            <label>Product Name:</label>
            <input type="text" value="Tecno Spark 10" readOnly />
          </div>
          <div className="form-row">
            <label>Brand:</label>
            <input type="text" value="Tecno" readOnly />
          </div>
          <div className="form-row">
            <label>Model:</label>
            <input type="text" value="KI5K" readOnly />
          </div>
          <div className="form-row">
            <label>Category:</label>
            <input type="text" value="Phones" readOnly />
          </div>
        </div>

        <div className="form-section">
          <h4>⚙️ Specifications</h4>
          <div className="specs-grid">
            <div className="spec-item">
              <label>RAM:</label>
              <input type="text" value="4GB" readOnly />
            </div>
            <div className="spec-item">
              <label>Storage:</label>
              <input type="text" value="128GB" readOnly />
            </div>
            <div className="spec-item">
              <label>Battery:</label>
              <input type="text" value="5000mAh" readOnly />
            </div>
            <div className="spec-item">
              <label>Camera:</label>
              <input type="text" value="50MP" readOnly />
            </div>
            <div className="spec-item">
              <label>Screen:</label>
              <input type="text" value="6.6 inch" readOnly />
            </div>
            <div className="spec-item">
              <label>Color:</label>
              <input type="text" value="Black" readOnly />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>💰 Pricing & Stock</h4>
          <div className="pricing-grid">
            <div className="form-row">
              <label>Current Price:</label>
              <input type="text" value="12,500 ETB" readOnly />
            </div>
            <div className="form-row">
              <label>Original Price:</label>
              <input type="text" value="14,000 ETB" readOnly />
            </div>
            <div className="form-row">
              <label>Stock Quantity:</label>
              <input type="text" value="5 units" readOnly />
            </div>
            <div className="form-row">
              <label>Discount:</label>
              <input type="text" value="10% OFF" readOnly />
            </div>
          </div>
        </div>

        <div className="product-images">
          <h4>📸 Product Images</h4>
          <div className="image-grid">
            <div className="image-item">
              <div className="image-placeholder">📱 Front View</div>
            </div>
            <div className="image-item">
              <div className="image-placeholder">📱 Back View</div>
            </div>
            <div className="image-item">
              <div className="image-placeholder">📱 Side View</div>
            </div>
            <div className="image-item">
              <div className="image-placeholder">📱 Interface</div>
            </div>
            <div className="image-item">
              <div className="image-placeholder">📱 Accessories</div>
            </div>
          </div>
        </div>

        <div className="product-status">
          <span className="status-badge featured">⭐ Featured Product</span>
          <span className="status-badge active">🟢 Active</span>
          <span className="status-badge verified">✓ Verified Shop</span>
        </div>
      </div>
    </div>
  );

  const renderBuyerSearches = () => (
    <div className="workflow-step">
      <div className="step-header">
        <h3>🔍 Abel's Search Journey</h3>
        <p>Addis Ababa → Looking for smartphones</p>
      </div>

      <div className="search-interface">
        <div className="search-bar">
          <input 
            type="text" 
            value="smartphone under 15000 ETB" 
            readOnly 
            className="search-input"
          />
          <button className="search-btn">🔍 Search</button>
        </div>

        <div className="search-filters">
          <h4>🎯 Search Filters</h4>
          <div className="filter-grid">
            <div className="filter-item">
              <label>City:</label>
              <select value="all_cities" readOnly>
                <option>All Cities</option>
                <option>Addis Ababa</option>
                <option>Dilla</option>
                <option>Hawassa</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Category:</label>
              <select value="phones" readOnly>
                <option>Phones</option>
                <option>Laptops</option>
                <option>Tablets</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Max Price:</label>
              <input type="text" value="15,000 ETB" readOnly />
            </div>
            <div className="filter-item">
              <label>RAM:</label>
              <select value="4GB" readOnly>
                <option>4GB</option>
                <option>6GB</option>
                <option>8GB</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Storage:</label>
              <select value="128GB" readOnly>
                <option>64GB</option>
                <option>128GB</option>
                <option>256GB</option>
              </select>
            </div>
            <div className="filter-item">
              <label>Brand:</label>
              <select value="Tecno" readOnly>
                <option>Tecno</option>
                <option>Samsung</option>
                <option>iPhone</option>
              </select>
            </div>
          </div>
        </div>

        <div className="search-results">
          <h4>📱 Search Results (2 found)</h4>
          <div className="results-grid">
            <div className="result-item featured">
              <div className="result-header">
                <h5>Tecno Spark 10</h5>
                <span className="distance-badge">350km away</span>
              </div>
              <div className="result-details">
                <p><strong>Shop:</strong> Abeba Electronics (Dilla)</p>
                <p><strong>Price:</strong> <span className="price-highlight">12,500 ETB</span></p>
                <p><strong>Stock:</strong> 5 available</p>
                <p><strong>Rating:</strong> ⭐⭐⭐⭐⭐ (12 reviews)</p>
                <p><strong>Specs:</strong> 4GB RAM, 128GB, 5000mAh, 50MP</p>
              </div>
              <div className="result-badges">
                <span className="badge verified">✓ Verified Shop</span>
                <span className="badge discount">10% OFF</span>
                <span className="badge featured">⭐ Featured</span>
              </div>
            </div>

            <div className="result-item">
              <div className="result-header">
                <h5>Tecno Spark 10</h5>
                <span className="distance-badge nearby">5km away</span>
              </div>
              <div className="result-details">
                <p><strong>Shop:</strong> TechHub Addis (Addis Ababa)</p>
                <p><strong>Price:</strong> 13,000 ETB</p>
                <p><strong>Stock:</strong> 2 available</p>
                <p><strong>Rating:</strong> ⭐⭐⭐⭐ (8 reviews)</p>
                <p><strong>Specs:</strong> 4GB RAM, 128GB, 5000mAh, 50MP</p>
              </div>
              <div className="result-badges">
                <span className="badge local">📍 Local Shop</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComparison = () => (
    <div className="workflow-step">
      <div className="step-header">
        <h3>⚖️ Abel's Comparison</h3>
        <p>Comparing options to make the best choice</p>
      </div>

      <div className="comparison-table">
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Abeba Electronics (Dilla)</th>
              <th>TechHub Addis (Local)</th>
              <th>Winner</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>💰 Price</td>
              <td className="price-winner">12,500 ETB</td>
              <td>13,000 ETB</td>
              <td className="winner">🏆 Abeba Electronics</td>
            </tr>
            <tr>
              <td>📍 Distance</td>
              <td>350km from Addis</td>
              <td className="distance-winner">5km from current location</td>
              <td className="winner">🏆 TechHub Addis</td>
            </tr>
            <tr>
              <td>⭐ Rating</td>
              <td className="rating-winner">⭐⭐⭐⭐⭐ (12 reviews)</td>
              <td>⭐⭐⭐⭐ (8 reviews)</td>
              <td className="winner">🏆 Abeba Electronics</td>
            </tr>
            <tr>
              <td>📦 Stock</td>
              <td className="stock-winner">5 units available</td>
              <td>2 units available</td>
              <td className="winner">🏆 Abeba Electronics</td>
            </tr>
            <tr>
              <td>🛡️ Warranty</td>
              <td className="warranty-winner">1 year manufacturer</td>
              <td>6 months shop warranty</td>
              <td className="winner">🏆 Abeba Electronics</td>
            </tr>
            <tr>
              <td>✅ Verification</td>
              <td className="verified-winner">✅ Verified Shop</td>
              <td>❌ Not Verified</td>
              <td className="winner">🏆 Abeba Electronics</td>
            </tr>
            <tr>
              <td>🚚 Delivery</td>
              <td>Available (2-3 days)</td>
              <td className="delivery-winner">Same day pickup</td>
              <td className="winner">🏆 TechHub Addis</td>
            </tr>
            <tr>
              <td>💬 Discount</td>
              <td className="discount-winner">10% OFF (1,500 ETB saved)</td>
              <td>No discount</td>
              <td className="winner">🏆 Abeba Electronics</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="comparison-summary">
        <h4>📊 Comparison Summary</h4>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="winner-name">Abeba Electronics</span>
            <span className="wins">5 wins</span>
            <span className="reasons">Best price, rating, stock, warranty, verification</span>
          </div>
          <div className="summary-item">
            <span className="winner-name">TechHub Addis</span>
            <span className="wins">2 wins</span>
            <span className="reasons">Closest distance, fastest delivery</span>
          </div>
        </div>
        
        <div className="recommendation">
          <h4>🎯 Recommendation</h4>
          <p><strong>Abeba Electronics</strong> - Despite the distance, offers better overall value:</p>
          <ul>
            <li>💰 Save 1,500 ETB on price</li>
            <li>⭐ Higher rating and verified shop</li>
            <li>🛡️ Better warranty protection</li>
            <li>📦 More stock available</li>
            <li>🚚 Delivery to Addis available</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderCommunication = () => (
    <div className="workflow-step">
      <div className="step-header">
        <h3>💬 Communication Flow</h3>
        <p>Abel contacts Abeba via WhatsApp</p>
      </div>

      <div className="communication-timeline">
        <div className="message abel">
          <div className="message-header">
            <span className="sender">👤 Abel (Buyer)</span>
            <span className="time">10:30 AM - Mar 11, 2026</span>
          </div>
          <div className="message-content">
            <p>Hello! I'm interested in the Tecno Spark 10. Is it still available? Can you tell me more about the warranty?</p>
          </div>
          <div className="message-actions">
            <span className="contact-method">💬 WhatsApp</span>
            <span className="phone">0912345678</span>
          </div>
        </div>

        <div className="message abeba">
          <div className="message-header">
            <span className="sender">🏪 Abeba (Seller)</span>
            <span className="time">11:00 AM - Mar 11, 2026</span>
          </div>
          <div className="message-content">
            <p>Hello! Yes, the Tecno Spark 10 is available. It comes with 1 year manufacturer warranty. I can also arrange delivery to Addis Ababa if needed. Would you like to see more photos?</p>
          </div>
          <div className="message-actions">
            <span className="response-time">⚡ Response time: 30 minutes</span>
            <span className="rating">⭐⭐⭐⭐⭐ Professional</span>
          </div>
        </div>

        <div className="message abel">
          <div className="message-header">
            <span className="sender">👤 Abel (Buyer)</span>
            <span className="time">11:15 AM - Mar 11, 2026</span>
          </div>
          <div className="message-content">
            <p>That's great! Can you deliver to Addis Ababa? What's the delivery cost? Do you accept mobile banking payment?</p>
          </div>
        </div>

        <div className="message abeba">
          <div className="message-header">
            <span className="sender">🏪 Abeba (Seller)</span>
            <span className="time">11:30 AM - Mar 11, 2026</span>
          </div>
          <div className="message-content">
            <p>Yes, I can deliver to Addis Ababa for 500 ETB. I accept mobile banking (TeleBirr, CBE Birr, Amole). Delivery takes 2-3 days. I'll send you more photos via WhatsApp.</p>
          </div>
          <div className="message-actions">
            <span className="payment-methods">💳 Payment: TeleBirr, CBE Birr, Amole</span>
            <span className="delivery-info">🚚 Delivery: 2-3 days, 500 ETB</span>
          </div>
        </div>

        <div className="message abel">
          <div className="message-header">
            <span className="sender">👤 Abel (Buyer)</span>
            <span className="time">11:45 AM - Mar 11, 2026</span>
          </div>
          <div className="message-content">
            <p>Perfect! I'll take it. How do I proceed with payment?</p>
          </div>
        </div>

        <div className="message abeba">
          <div className="message-header">
            <span className="sender">🏪 Abeba (Seller)</span>
            <span className="time">12:00 PM - Mar 11, 2026</span>
          </div>
          <div className="message-content">
            <p>Excellent! I'll send you the payment details. Total: 12,500 + 500 delivery = 13,000 ETB. I'll ship it today!</p>
          </div>
          <div className="message-actions">
            <span className="order-status">📦 Order Confirmed</span>
            <span className="payment-status">💳 Payment Pending</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPurchaseCompleted = () => (
    <div className="workflow-step">
      <div className="step-header">
        <h3>✅ Purchase Completed</h3>
        <p>Order #ORD-2026-0311-001</p>
      </div>

      <div className="order-confirmation">
        <div className="order-details">
          <h4>📋 Order Details</h4>
          <div className="order-grid">
            <div className="order-item">
              <label>Order ID:</label>
              <span>ORD-2026-0311-001</span>
            </div>
            <div className="order-item">
              <label>Product:</label>
              <span>Tecno Spark 10 (KI5K)</span>
            </div>
            <div className="order-item">
              <label>Specifications:</label>
              <span>4GB RAM, 128GB, 5000mAh, 50MP</span>
            </div>
            <div className="order-item">
              <label>Seller:</label>
              <span>Abeba Electronics (Dilla)</span>
            </div>
            <div className="order-item">
              <label>Product Price:</label>
              <span>12,500 ETB</span>
            </div>
            <div className="order-item">
              <label>Delivery Fee:</label>
              <span>500 ETB</span>
            </div>
            <div className="order-item total">
              <label>Total Amount:</label>
              <span>13,000 ETB</span>
            </div>
          </div>
        </div>

        <div className="payment-info">
          <h4>💳 Payment Information</h4>
          <div className="payment-details">
            <div className="payment-item">
              <label>Payment Method:</label>
              <span>TeleBirr Mobile Banking</span>
            </div>
            <div className="payment-item">
              <label>Payment Status:</label>
              <span className="status completed">✅ Completed</span>
            </div>
            <div className="payment-item">
              <label>Payment Time:</label>
              <span>12:30 PM - Mar 11, 2026</span>
            </div>
            <div className="payment-item">
              <label>Transaction ID:</label>
              <span>TXN-20260311-123456</span>
            </div>
          </div>
        </div>

        <div className="delivery-info">
          <h4>🚚 Delivery Information</h4>
          <div className="delivery-details">
            <div className="delivery-item">
              <label>Delivery Address:</label>
              <span>Bole, Addis Ababa</span>
            </div>
            <div className="delivery-item">
              <label>Estimated Delivery:</label>
              <span>Mar 13, 2026 (2-3 days)</span>
            </div>
            <div className="delivery-item">
              <label>Tracking Number:</label>
              <span>TRK-123456789</span>
            </div>
            <div className="delivery-item">
              <label>Delivery Status:</label>
              <span className="status processing">📦 Shipped</span>
            </div>
          </div>
        </div>

        <div className="timeline">
          <h4>📅 Order Timeline</h4>
          <div className="timeline-events">
            <div className="event completed">
              <span className="time">10:30 AM</span>
              <span className="description">Abel contacts Abeba</span>
            </div>
            <div className="event completed">
              <span className="time">11:00 AM</span>
              <span className="description">Abeba responds with details</span>
            </div>
            <div className="event completed">
              <span className="time">12:00 PM</span>
              <span className="description">Order confirmed</span>
            </div>
            <div className="event completed">
              <span className="time">12:30 PM</span>
              <span className="description">Payment completed</span>
            </div>
            <div className="event current">
              <span className="time">2:00 PM</span>
              <span className="description">Package shipped from Dilla</span>
            </div>
            <div className="event upcoming">
              <span className="time">Mar 13</span>
              <span className="description">Expected delivery in Addis Ababa</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 'seller-registration':
        return renderSellerRegistration();
      case 'seller-adds-product':
        return renderSellerAddsProduct();
      case 'buyer-searches':
        return renderBuyerSearches();
      case 'buyer-compares':
        return renderComparison();
      case 'buyer-contacts-seller':
      case 'seller-responds':
        return renderCommunication();
      case 'purchase-completed':
      case 'delivery-tracking':
      case 'review-left':
        return renderPurchaseCompleted();
      default:
        return <div className="workflow-step"><p>Select a step to view details</p></div>;
    }
  };

  return (
    <div className="workflow-demo">
      <div className="demo-header">
        <h1>🎯 Ethiopian Electronics - Complete Workflow Demo</h1>
        <p>See how Abeba (seller) and Abel (buyer) interact on the platform</p>
      </div>

      <div className="workflow-navigation">
        <div className="steps-timeline">
          {workflowSteps.map((step, index) => (
            <button
              key={step.id}
              className={`step-button ${activeStep === step.id ? 'active' : ''} ${step.type}`}
              onClick={() => setActiveStep(step.id)}
            >
              <span className="step-number">{index + 1}</span>
              <span className="step-title">{step.title}</span>
              <span className="step-description">{step.description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="workflow-content">
        {renderStepContent()}
      </div>

      <div className="demo-footer">
        <div className="navigation-controls">
          <button 
            onClick={() => {
              const currentIndex = workflowSteps.findIndex(s => s.id === activeStep);
              if (currentIndex > 0) {
                setActiveStep(workflowSteps[currentIndex - 1].id);
              }
            }}
            disabled={workflowSteps.findIndex(s => s.id === activeStep) === 0}
          >
            ← Previous Step
          </button>
          
          <span className="step-indicator">
            Step {workflowSteps.findIndex(s => s.id === activeStep) + 1} of {workflowSteps.length}
          </span>
          
          <button 
            onClick={() => {
              const currentIndex = workflowSteps.findIndex(s => s.id === activeStep);
              if (currentIndex < workflowSteps.length - 1) {
                setActiveStep(workflowSteps[currentIndex + 1].id);
              }
            }}
            disabled={workflowSteps.findIndex(s => s.id === activeStep) === workflowSteps.length - 1}
          >
            Next Step →
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDemo;
