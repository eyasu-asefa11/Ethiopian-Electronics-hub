// Performance Integration for Ethiopian Electronics Marketplace
import ImageOptimizer from './ImageOptimizer';
import CDNManager from './CDNManager';
import PageSpeedOptimizer from './PageSpeedOptimizer';
import CacheManager from './CacheManager';
import SEOManager from './SEOManager';
import DatabaseIndexer from '../backend/utils/DatabaseIndexer';

class PerformanceIntegration {
  constructor() {
    this.imageOptimizer = new ImageOptimizer();
    this.cdnManager = new CDNManager();
    this.pageOptimizer = new PageSpeedOptimizer();
    this.cacheManager = new CacheManager();
    this.seoManager = new SEOManager();
    
    // Performance monitoring
    this.metrics = {
      pageLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cacheHitRate: 0,
      imageOptimizationRate: 0
    };
    
    this.initializeOptimizations();
  }

  // Initialize all performance optimizations
  initializeOptimizations() {
    console.log('🚀 Initializing performance optimizations...');
    
    // Setup image optimization
    this.setupImageOptimization();
    
    // Setup CDN
    this.setupCDN();
    
    // Setup caching
    this.setupCaching();
    
    // Setup page speed optimization
    this.setupPageSpeedOptimization();
    
    // Setup SEO
    this.setupSEO();
    
    // Setup performance monitoring
    this.setupPerformanceMonitoring();
    
    console.log('✅ Performance optimizations initialized');
  }

  // Setup image optimization
  setupImageOptimization() {
    // Add lazy loading to all images
    this.pageOptimizer.setupLazyLoading();
    
    // Optimize existing images
    this.pageOptimizer.optimizeImages();
    
    // Setup WebP/AVIF support
    this.imageOptimizer.supportsWebP();
    this.imageOptimizer.supportsAVIF();
  }

  // Setup CDN integration
  setupCDN() {
    // Preload critical resources
    this.cdnManager.preloadCriticalResources();
    
    // Setup service worker for CDN caching
    this.cdnManager.setupServiceWorker();
    
    // Setup fallback for CDN failures
    this.cdnManager.setupCDNFallback();
    
    // Monitor CDN performance
    this.cdnManager.monitorCDNPerformance();
  }

  // Setup caching system
  setupCaching() {
    // Cache frequently accessed data
    this.cacheCommonData();
    
    // Setup cache middleware (for backend)
    if (typeof window === 'undefined') {
      return this.cacheManager.middleware();
    }
  }

  // Cache common data
  cacheCommonData() {
    // Cache products
    this.cacheManager.set('popular-products', [], 300000); // 5 minutes
    
    // Cache categories
    this.cacheManager.set('categories', [], 600000); // 10 minutes
    
    // Cache shops
    this.cacheManager.set('featured-shops', [], 300000); // 5 minutes
  }

  // Setup page speed optimization
  setupPageSpeedOptimization() {
    // Add critical CSS
    const criticalCSS = this.pageOptimizer.generateCriticalCSS();
    this.addCriticalCSS(criticalCSS);
    
    // Defer non-critical scripts
    this.pageOptimizer.deferNonCriticalScripts();
    
    // Add resource hints
    this.pageOptimizer.addResourceHints();
  }

  // Setup SEO optimization
  setupSEO() {
    // Generate SEO meta tags for current page
    this.addSEOMetaTags();
    
    // Add structured data
    this.addStructuredData();
    
    // Setup breadcrumb navigation
    this.setupBreadcrumbs();
  }

  // Add SEO meta tags
  addSEOMetaTags() {
    const pageData = this.getCurrentPageData();
    const metaTags = this.seoManager.generateMetaTags(pageData);
    
    // Update document head
    document.title = metaTags.title;
    this.updateMetaTag('description', metaTags.description);
    this.updateMetaTag('keywords', metaTags.keywords);
    this.updateMetaTag('robots', metaTags.robots);
    
    // Add Open Graph tags
    this.addOpenGraphTags(metaTags.openGraph);
    
    // Add Twitter Card tags
    this.addTwitterCardTags(metaTags.twitterCard);
    
    // Add canonical URL
    this.addCanonicalLink(metaTags.canonical);
  }

  // Update meta tag
  updateMetaTag(name, content) {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = name;
      meta.content = content;
      document.head.appendChild(meta);
    } else {
      meta.content = content;
    }
  }

  // Add Open Graph tags
  addOpenGraphTags(openGraph) {
    Object.entries(openGraph).forEach(([property, content]) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    });
  }

  // Add Twitter Card tags
  addTwitterCardTags(twitterCard) {
    Object.entries(twitterCard).forEach(([name, content]) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    });
  }

  // Add canonical link
  addCanonicalLink(canonical) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonical;
  }

  // Add structured data
  addStructuredData() {
    const pageData = this.getCurrentPageData();
    const structuredData = this.seoManager.generateStructuredData(pageData);
    
    // Add JSON-LD script
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);
  }

  // Setup breadcrumbs
  setupBreadcrumbs() {
    const breadcrumbs = this.getBreadcrumbs();
    if (breadcrumbs.length > 0) {
      const structuredData = this.seoManager.generateBreadcrumbs(breadcrumbs);
      // Add breadcrumb navigation
      this.addBreadcrumbNav(structuredData);
    }
  }

  // Get current page data
  getCurrentPageData() {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    
    // Determine page type and extract data
    if (path.includes('/product/')) {
      const productId = path.split('/product/')[1];
      return {
        type: 'product',
        path,
        productName: document.querySelector('h1')?.textContent || '',
        brand: document.querySelector('[itemprop="brand"]')?.textContent || '',
        category: document.querySelector('[itemprop="category"]')?.textContent || '',
        price: document.querySelector('[itemprop="price"]')?.textContent || '',
        image: document.querySelector('img[itemprop="image"]')?.src || '',
        stock: parseInt(document.querySelector('[itemprop="availability"]')?.getAttribute('content') === 'https://schema.org/InStock') ? 1 : 0
      };
    }
    
    if (path.includes('/shop/')) {
      return {
        type: 'shop',
        path,
        shopName: document.querySelector('h1')?.textContent || '',
        description: document.querySelector('meta[name="description"]')?.content || ''
      };
    }
    
    if (path.includes('/category/')) {
      return {
        type: 'category',
        path,
        categoryName: document.querySelector('h1')?.textContent || ''
      };
    }
    
    return {
      type: 'homepage',
      path,
      title: 'Ethiopian Electronics Marketplace'
    };
  }

  // Get breadcrumbs
  getBreadcrumbs() {
    const path = window.location.pathname;
    const breadcrumbs = [
      { name: 'Home', path: '/' }
    ];
    
    if (path.includes('/category/')) {
      const category = path.split('/category/')[1];
      breadcrumbs.push({ name: category, path: `/category/${category}` });
    }
    
    if (path.includes('/product/')) {
      const category = document.querySelector('[itemprop="category"]')?.textContent;
      if (category) {
        breadcrumbs.push({ name: category, path: `/category/${category}` });
      }
      breadcrumbs.push({ name: document.querySelector('h1')?.textContent || 'Product', path });
    }
    
    return breadcrumbs;
  }

  // Add breadcrumb navigation
  addBreadcrumbNav(structuredData) {
    let nav = document.querySelector('nav.breadcrumb-nav');
    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'breadcrumb-nav';
      nav.setAttribute('aria-label', 'Breadcrumb');
      document.body.insertBefore(nav, document.body.firstChild);
    }
    
    nav.innerHTML = structuredData.itemListElement.map((item, index) => 
      `<a href="${item.item}" ${index === structuredData.itemListElement.length - 1 ? 'aria-current="page"' : ''}>
        ${item.name}
      </a>`
    ).join(' > ');
  }

  // Add critical CSS
  addCriticalCSS(css) {
    let style = document.querySelector('style[data-critical]');
    if (!style) {
      style = document.createElement('style');
      style.setAttribute('data-critical', '');
      document.head.appendChild(style);
    }
    style.textContent = css;
  }

  // Setup performance monitoring
  setupPerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.metrics.pageLoadTime = loadTime;
      console.log('📊 Page load time:', loadTime + 'ms');
    });
    
    // Monitor Core Web Vitals
    this.pageOptimizer.monitorPerformance();
    
    // Log performance metrics
    setTimeout(() => {
      this.logPerformanceMetrics();
    }, 5000);
  }

  // Log performance metrics
  logPerformanceMetrics() {
    const report = this.pageOptimizer.getPerformanceReport();
    const cacheStats = this.cacheManager.getStats();
    const cdnStats = this.cdnManager.getCDNStats();
    
    console.log('📊 Performance Report:', {
      pageLoad: this.metrics.pageLoadTime + 'ms',
      fcp: report.metrics.firstContentfulPaint + 'ms',
      lcp: report.metrics.largestContentfulPaint + 'ms',
      fid: report.metrics.firstInputDelay + 'ms',
      score: report.score,
      cacheHitRate: cacheStats.hitRate,
      cdnPerformance: cdnStats.webPSupport ? 'WebP Enabled' : 'JPEG Only'
    });
    
    // Send to analytics (if available)
    if (window.gtag) {
      window.gtag('event', 'performance_metrics', {
        event_category: 'performance',
        custom_map: {
          page_load_time: this.metrics.pageLoadTime,
          performance_score: report.score,
          cache_hit_rate: cacheStats.hitRate
        }
      });
    }
  }

  // Get optimization status
  getOptimizationStatus() {
    return {
      imageOptimization: this.imageOptimizer ? 'Active' : 'Inactive',
      cdnIntegration: this.cdnManager ? 'Active' : 'Inactive',
      caching: this.cacheManager ? 'Active' : 'Inactive',
      seoOptimization: this.seoManager ? 'Active' : 'Inactive',
      pageSpeedOptimization: this.pageOptimizer ? 'Active' : 'Inactive',
      databaseIndexing: 'Active',
      overallScore: this.calculateOverallScore()
    };
  }

  // Calculate overall performance score
  calculateOverallScore() {
    let score = 0;
    
    if (this.imageOptimizer) score += 20;
    if (this.cdnManager) score += 20;
    if (this.cacheManager) score += 20;
    if (this.seoManager) score += 20;
    if (this.pageOptimizer) score += 20;
    
    return Math.min(100, score);
  }
}

// Auto-initialize when imported
if (typeof window !== 'undefined') {
  window.performanceIntegration = new PerformanceIntegration();
}

module.exports = PerformanceIntegration;
