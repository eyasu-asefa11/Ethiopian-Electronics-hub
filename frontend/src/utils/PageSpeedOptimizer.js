// Page Speed Optimization for Ethiopian Electronics Marketplace
class PageSpeedOptimizer {
  constructor() {
    this.criticalCSS = new Set();
    this.loadedScripts = new Map();
    this.loadedStyles = new Map();
    this.performanceMetrics = {
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0
    };
  }

  // Minify CSS
  minifyCSS(css) {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/;\s*}/g, '}') // Remove semicolons before closing braces
      .replace(/\s*{\s*/g, '{') // Collapse spaces around braces
      .replace(/;\s*/g, ';') // Remove spaces after semicolons
      .trim();
  }

  // Minify JavaScript
  minifyJS(js) {
    return js
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\/\/.*$/gm, '') // Remove single-line comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/;\s*}/g, '}') // Clean up semicolons
      .trim();
  }

  // Generate critical CSS for above-the-fold content
  generateCriticalCSS() {
    return `
      /* Critical CSS for immediate rendering */
      body { margin: 0; font-family: 'Noto Sans Ethiopic', sans-serif; }
      .app-loading { display: flex; justify-content: center; align-items: center; height: 100vh; }
      .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; animation: spin 1s linear infinite; }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      .navbar { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px 20px; }
      .product-card { border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); }
      .btn { padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; }
    `;
  }

  // Lazy load images with intersection observer
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.classList.remove('lazy-image');
              observer.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Observe all lazy images
      document.querySelectorAll('.lazy-image').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Preload critical resources
  preloadCriticalResources() {
    const criticalResources = [
      { href: '/fonts/noto-sans-ethiopic.woff2', as: 'font', type: 'font/woff2' },
      { href: '/css/critical.css', as: 'style' },
      { href: '/js/critical.js', as: 'script' }
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      document.head.appendChild(link);
    });
  }

  // Optimize images with WebP support
  optimizeImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      const webpSrc = img.dataset.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      
      // Check WebP support
      if (this.supportsWebP()) {
        img.src = webpSrc;
      } else {
        img.src = img.dataset.src;
      }
    });
  }

  // Check WebP support
  supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // Defer non-critical JavaScript
  deferNonCriticalScripts() {
    const scripts = document.querySelectorAll('script[data-defer]');
    scripts.forEach(script => {
      if (script.dataset.src) {
        const newScript = document.createElement('script');
        newScript.src = script.dataset.src;
        newScript.defer = true;
        document.body.appendChild(newScript);
        script.remove();
      }
    });
  }

  // Implement resource hints
  addResourceHints() {
    const hints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//cdnjs.cloudflare.com' },
      { rel: 'preconnect', href: '//fonts.gstatic.com' },
      { rel: 'preconnect', href: '//api.ethiopian-electronics.com' }
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      document.head.appendChild(link);
    });
  }

  // Monitor performance metrics
  monitorPerformance() {
    if ('PerformanceObserver' in window) {
      // Monitor First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.performanceMetrics.firstContentfulPaint = entries[0].startTime;
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Monitor Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.performanceMetrics.largestContentfulPaint = entries[entries.length - 1].startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.performanceMetrics.firstInputDelay = entries[0].processingStart - entries[0].startTime;
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    }
  }

  // Generate service worker for caching
  generateServiceWorker() {
    return `
      const CACHE_NAME = 'ethiopian-electronics-v1';
      const urlsToCache = [
        '/',
        '/css/main.css',
        '/js/main.js',
        '/fonts/noto-sans-ethiopic.woff2',
        '/images/logo.png'
      ];

      self.addEventListener('install', event => {
        event.waitUntil(
          caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
        );
      });

      self.addEventListener('fetch', event => {
        event.respondWith(
          caches.match(event.request)
            .then(response => response || fetch(event.request))
        );
      });
    `;
  }

  // Get performance report
  getPerformanceReport() {
    return {
      metrics: this.performanceMetrics,
      recommendations: this.getRecommendations(),
      score: this.calculatePerformanceScore()
    };
  }

  // Get optimization recommendations
  getRecommendations() {
    const recommendations = [];
    
    if (this.performanceMetrics.firstContentfulPaint > 2000) {
      recommendations.push('Reduce server response time - First Contentful Paint is slow');
    }
    
    if (this.performanceMetrics.largestContentfulPaint > 2500) {
      recommendations.push('Optimize images - Largest Contentful Paint is slow');
    }
    
    if (this.performanceMetrics.firstInputDelay > 100) {
      recommendations.push('Reduce JavaScript execution time - First Input Delay is high');
    }
    
    return recommendations;
  }

  // Calculate performance score
  calculatePerformanceScore() {
    let score = 100;
    
    if (this.performanceMetrics.firstContentfulPaint > 2000) score -= 20;
    if (this.performanceMetrics.largestContentfulPaint > 2500) score -= 20;
    if (this.performanceMetrics.firstInputDelay > 100) score -= 15;
    
    return Math.max(0, score);
  }
}

module.exports = PageSpeedOptimizer;
