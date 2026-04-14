// Image Optimization Service
class ImageOptimizer {
  constructor() {
    this.supportedFormats = ['webp', 'avif', 'jpg', 'png'];
    this.qualitySettings = {
      thumbnail: { width: 150, height: 150, quality: 60 },
      medium: { width: 400, height: 400, quality: 75 },
      large: { width: 800, height: 800, quality: 85 }
    };
  }

  // Optimize image URL with CDN parameters
  getOptimizedUrl(originalUrl, size = 'medium', format = 'webp') {
    if (!originalUrl) return '/placeholder-product.png';
    
    const baseUrl = originalUrl.split('?')[0];
    const { width, height, quality } = this.qualitySettings[size];
    
    return `${baseUrl}?w=${width}&h=${height}&q=${quality}&f=${format}&auto=compress`;
  }

  // Generate responsive image sources
  getResponsiveSources(originalUrl) {
    return {
      thumbnail: this.getOptimizedUrl(originalUrl, 'thumbnail', 'webp'),
      medium: this.getOptimizedUrl(originalUrl, 'medium', 'webp'),
      large: this.getOptimizedUrl(originalUrl, 'large', 'webp'),
      fallback: this.getOptimizedUrl(originalUrl, 'medium', 'jpg')
    };
  }

  // Lazy load image component
  createLazyImage(src, alt, className = '') {
    return `
      <img 
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='14' fill='%23999'%3E Loading...%3C/text%3E%3C/svg%3E"
        data-src="${src}"
        alt="${alt}"
        class="${className} lazy-image"
        loading="lazy"
        onerror="this.src='/placeholder-product.png'"
      />
    `;
  }
}

module.exports = ImageOptimizer;
