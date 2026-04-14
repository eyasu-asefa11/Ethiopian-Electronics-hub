// CDN Integration for Ethiopian Electronics Marketplace
class CDNManager {
  constructor() {
    this.cdnConfig = {
      primary: 'https://cdn.ethiopian-electronics.com',
      fallback: 'https://backup-cdn.ethiopian-electronics.com',
      local: '/uploads',
      cacheVersion: Date.now(), // Cache busting
      supportedFormats: ['webp', 'avif', 'jpg', 'png', 'svg']
    };
    
    this.geoLocations = {
      'ethiopia': 'et-cdn.ethiopian-electronics.com',
      'kenya': 'ke-cdn.ethiopian-electronics.com',
      'nigeria': 'ng-cdn.ethiopian-electronics.com',
      'default': 'cdn.ethiopian-electronics.com'
    };
  }

  // Get optimal CDN URL based on user location
  getOptimalCDN(userCountry = 'ethiopia') {
    return this.geoLocations[userCountry] || this.geoLocations.default;
  }

  // Generate CDN URL for static assets
  getCDNUrl(localPath, options = {}) {
    const {
      width,
      height,
      quality = 85,
      format = 'auto',
      crop = 'smart'
    } = options;

    // Determine best format
    const bestFormat = this.getBestFormat(format);
    
    // Build CDN URL with optimization parameters
    let cdnUrl = `${this.cdnConfig.primary}${localPath}`;
    
    if (width || height || quality !== 85 || format !== 'auto') {
      const params = new URLSearchParams();
      
      if (width) params.append('w', width);
      if (height) params.append('h', height);
      if (quality !== 85) params.append('q', quality);
      if (format !== 'auto') params.append('f', bestFormat);
      if (crop !== 'smart') params.append('c', crop);
      
      // Add cache busting
      params.append('v', this.cdnConfig.cacheVersion);
      
      cdnUrl = `${cdnUrl}?${params.toString()}`;
    }

    return cdnUrl;
  }

  // Determine best image format for browser
  getBestFormat(requestedFormat) {
    if (requestedFormat !== 'auto') return requestedFormat;
    
    // Check browser support
    if (this.supportsWebP() && this.cdnConfig.supportedFormats.includes('webp')) {
      return 'webp';
    }
    
    if (this.supportsAVIF() && this.cdnConfig.supportedFormats.includes('avif')) {
      return 'avif';
    }
    
    return 'jpg'; // Fallback
  }

  // Check WebP support
  supportsWebP() {
    if (typeof window !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  }

  // Check AVIF support
  supportsAVIF() {
    if (typeof window !== 'undefined') {
      const avif = new Image();
      return avif.src && avif.src.startsWith('data:image/avif');
    }
    return false;
  }

  // Generate responsive image sources
  getResponsiveImageSources(localPath, alt = '') {
    const sources = [];
    
    // AVIF source (best compression)
    sources.push({
      srcset: `${this.getCDNUrl(localPath, { format: 'avif', quality: 75 })} 1x,
                         ${this.getCDNUrl(localPath, { format: 'avif', quality: 75, width: 400 })} 400w,
                         ${this.getCDNUrl(localPath, { format: 'avif', quality: 75, width: 800 })} 800w`,
      type: 'image/avif',
      sizes: '(max-width: 800px) 400px, 800px'
    });

    // WebP source (good compression)
    sources.push({
      srcset: `${this.getCDNUrl(localPath, { format: 'webp', quality: 80 })} 1x,
                         ${this.getCDNUrl(localPath, { format: 'webp', quality: 80, width: 400 })} 400w,
                         ${this.getCDNUrl(localPath, { format: 'webp', quality: 80, width: 800 })} 800w`,
      type: 'image/webp',
      sizes: '(max-width: 800px) 400px, 800px'
    });

    // JPEG fallback (universal support)
    sources.push({
      srcset: `${this.getCDNUrl(localPath, { format: 'jpg', quality: 85 })} 1x,
                         ${this.getCDNUrl(localPath, { format: 'jpg', quality: 85, width: 400 })} 400w,
                         ${this.getCDNUrl(localPath, { format: 'jpg', quality: 85, width: 800 })} 800w`,
      type: 'image/jpeg',
      sizes: '(max-width: 800px) 400px, 800px'
    });

    return { sources, alt };
  }

  // Generate picture element with CDN optimization
  createOptimizedPicture(localPath, alt = '', className = '') {
    const { sources, alt: imgAlt } = this.getResponsiveImageSources(localPath, alt);
    
    return `
      <picture class="${className}">
        ${sources.map(source => 
          `<source srcset="${source.srcset}" 
                   type="${source.type}" 
                   sizes="${source.sizes}">`
        ).join('\n        ')}
        <img src="${this.getCDNUrl(localPath, { format: 'jpg' })}" 
             alt="${imgAlt}" 
             loading="lazy"
             decoding="async">
      </picture>
    `;
  }

  // Preload critical resources from CDN
  preloadCriticalResources() {
    const criticalResources = [
      { href: '/fonts/noto-sans-ethiopic.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
      { href: '/css/critical.css', as: 'style' },
      { href: '/js/critical.js', as: 'script' },
      { href: '/images/logo.webp', as: 'image', type: 'image/webp' }
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = this.getCDNUrl(resource.href);
      link.as = resource.as;
      if (resource.type) link.type = resource.type;
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
      document.head.appendChild(link);
    });
  }

  // Setup service worker for CDN caching
  setupServiceWorker() {
    const swCode = `
      const CDN_BASE = '${this.cdnConfig.primary}';
      const CACHE_NAME = 'ethiopian-electronics-cdn-v1';
      const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

      self.addEventListener('install', event => {
        event.waitUntil(
          caches.open(CACHE_NAME).then(cache => {
            return cache.addAll([
              '/',
              '/manifest.json',
              CDN_BASE + '/css/main.css',
              CDN_BASE + '/js/main.js'
            ]);
          })
        );
      });

      self.addEventListener('fetch', event => {
        const request = event.request;
        const url = new URL(request.url);

        // Serve from CDN cache if available
        if (url.origin.includes('ethiopian-electronics.com')) {
          event.respondWith(
            caches.match(request)
              .then(response => response || fetch(request))
          );
          return;
        }

        // For other requests, fetch normally
        event.respondWith(fetch(request));
      });

      // Background sync for offline support
      self.addEventListener('sync', event => {
        if (event.tag === 'background-sync') {
          event.waitUntil(doBackgroundSync());
        }
      });
    `;

    const blob = new Blob([swCode], { type: 'application/javascript' });
    const swUrl = URL.createObjectURL(blob);
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(swUrl)
        .then(registration => console.log('✅ Service Worker registered'))
        .catch(error => console.error('❌ Service Worker registration failed:', error));
    }
  }

  // Monitor CDN performance
  monitorCDNPerformance() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach(entry => {
          if (entry.name.includes('ethiopian-electronics')) {
            console.log('📊 CDN Performance:', {
              url: entry.name,
              duration: entry.duration,
              size: entry.transferSize,
              cached: entry.transferSize === 0
            });
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  }

  // Fallback to local if CDN fails
  setupCDNFallback() {
    const images = document.querySelectorAll('img[src*="ethiopian-electronics.com"]');
    
    images.forEach(img => {
      img.addEventListener('error', () => {
        const originalSrc = img.src;
        const localPath = originalSrc.replace(this.cdnConfig.primary, this.cdnConfig.local);
        
        console.warn('⚠️ CDN failed, falling back to local:', localPath);
        img.src = localPath;
      });
    });
  }

  // Get CDN statistics
  getCDNStats() {
    return {
      primaryCDN: this.cdnConfig.primary,
      fallbackCDN: this.cdnConfig.fallback,
      cacheVersion: this.cdnConfig.cacheVersion,
      supportedFormats: this.cdnConfig.supportedFormats,
      geoLocations: Object.keys(this.geoLocations),
      webPSupport: this.supportsWebP(),
      avifSupport: this.supportsAVIF()
    };
  }
}

module.exports = CDNManager;
