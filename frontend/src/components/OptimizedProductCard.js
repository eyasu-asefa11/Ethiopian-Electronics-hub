// Performance Optimized Product Card Component
import React, { useState, useEffect, useRef } from 'react';
import ImageOptimizer from '../utils/ImageOptimizer';
import CDNManager from '../utils/CDNManager';
import PageSpeedOptimizer from '../utils/PageSpeedOptimizer';
import './OptimizedProductCard.css';

const OptimizedProductCard = ({ product, onClick, className = '' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const cardRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Initialize managers
  const imageOptimizer = new ImageOptimizer();
  const cdnManager = new CDNManager();
  const pageOptimizer = new PageSpeedOptimizer();

  // Get optimized image sources
  const optimizedImages = imageOptimizer.getResponsiveSources(product.image || '/placeholder-product.png');

  return (
    <div 
      ref={cardRef}
      className={`optimized-product-card ${className}`}
      onClick={() => onClick && onClick(product)}
      itemScope="product"
      itemType="https://schema.org/Product"
    >
      {/* Optimized Product Image */}
      <div className="product-image-container">
        {inView ? (
          <picture>
            {/* AVIF Source */}
            <source
              srcSet={cdnManager.getCDNUrl(product.image, { 
                format: 'avif', 
                quality: 75, 
                width: 300 
              })}
              type="image/avif"
            />
            {/* WebP Source */}
            <source
              srcSet={cdnManager.getCDNUrl(product.image, { 
                format: 'webp', 
                quality: 80, 
                width: 300 
              })}
              type="image/webp"
            />
            {/* JPEG Fallback */}
            <img
              src={cdnManager.getCDNUrl(product.image, { 
                format: 'jpg', 
                quality: 85, 
                width: 300 
              })}
              alt={product.name}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = '/placeholder-product.png';
                console.warn('Image failed to load:', product.name);
              }}
            />
          </picture>
        ) : (
          {/* Placeholder while not in view */}
          <div className="image-placeholder">
            <div className="placeholder-spinner"></div>
          </div>
        )}
        
        {/* Stock Badge */}
        {product.stock_quantity > 0 ? (
          <div className="stock-badge out-of-stock">Out of Stock</div>
        ) : (
          <div className="stock-badge in-stock">In Stock</div>
        )}
      </div>

      {/* Product Information */}
      <div className="product-info">
        {/* Product Name with Schema.org markup */}
        <h3 itemProp="name">
          {product.name}
        </h3>
        
        {/* Brand and Category */}
        <div className="product-meta">
          <span itemProp="brand">{product.brand}</span>
          <span className="separator">•</span>
          <span itemProp="category">{product.category}</span>
        </div>

        {/* Product Price with Schema.org markup */}
        <div className="product-price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <span itemProp="price" itemScope itemType="https://schema.org/Offer">
            {product.price?.toLocaleString()} ETB
          </span>
          <meta itemProp="priceCurrency" content="ETB" />
          <meta itemProp="availability" 
                content={product.stock_quantity > 0 ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock'} />
        </div>

        {/* Key Specifications */}
        {(product.ram || product.storage) && (
          <div className="product-specs">
            {product.ram && <span className="spec">{product.ram}</span>}
            {product.storage && <span className="spec">{product.storage}</span>}
          </div>
        )}

        {/* Performance Indicators */}
        <div className="product-performance">
          {product.views && (
            <span className="metric">
              👁 {product.views} views
            </span>
          )}
          {product.inquiries && (
            <span className="metric">
              💬 {product.inquiries} inquiries
            </span>
          )}
        </div>
      </div>

      {/* Structured Data for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          brand: product.brand,
          category: product.category,
          description: product.description,
          image: cdnManager.getCDNUrl(product.image),
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'ETB',
            availability: product.stock_quantity > 0 ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock'
          }
        })
      }} />
    </div>
  );
};

export default OptimizedProductCard;
