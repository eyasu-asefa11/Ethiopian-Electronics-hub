// SEO Optimization for Ethiopian Electronics Marketplace
class SEOManager {
  constructor() {
    this.baseTitle = 'Ethiopian Electronics Marketplace';
    this.baseDescription = 'Buy and sell electronics in Ethiopia - Phones, Laptops, Tablets and more';
    this.baseKeywords = ['ethiopian electronics', 'electronics ethiopia', 'buy electronics ethiopia', 'phones ethiopia', 'laptops ethiopia'];
    this.siteUrl = 'https://ethiopian-electronics.com';
  }

  // Generate SEO meta tags
  generateMetaTags(pageData) {
    const title = this.generateTitle(pageData);
    const description = this.generateDescription(pageData);
    const keywords = this.generateKeywords(pageData);
    const canonical = this.generateCanonical(pageData);
    const openGraph = this.generateOpenGraph(pageData);
    const twitterCard = this.generateTwitterCard(pageData);
    const structuredData = this.generateStructuredData(pageData);

    return {
      title,
      description,
      keywords,
      canonical,
      openGraph,
      twitterCard,
      structuredData,
      robots: this.generateRobots(pageData),
      language: 'en, am',
      geo: this.generateGeoTags()
    };
  }

  // Generate page title
  generateTitle(pageData) {
    if (pageData.type === 'product') {
      return `${pageData.productName} - ${pageData.brand} | ${this.baseTitle}`;
    }
    if (pageData.type === 'category') {
      return `${pageData.categoryName} | ${this.baseTitle}`;
    }
    if (pageData.type === 'shop') {
      return `${pageData.shopName} | ${this.baseTitle}`;
    }
    if (pageData.type === 'search') {
      return `Search: ${pageData.query} | ${this.baseTitle}`;
    }
    return this.baseTitle;
  }

  // Generate meta description
  generateDescription(pageData) {
    if (pageData.type === 'product') {
      return `Buy ${pageData.productName} by ${pageData.brand} in Ethiopia. ${pageData.description?.substring(0, 120) || ''} Best prices, fast delivery.`;
    }
    if (pageData.type === 'category') {
      return `Browse ${pageData.categoryName} in Ethiopia. Find the best deals on ${pageData.categoryName.toLowerCase()} from trusted sellers.`;
    }
    if (pageData.type === 'shop') {
      return `${pageData.shopName} - ${pageData.description?.substring(0, 120) || ''} Shop electronics online in Ethiopia.`;
    }
    return this.baseDescription;
  }

  // Generate keywords
  generateKeywords(pageData) {
    let keywords = [...this.baseKeywords];
    
    if (pageData.type === 'product') {
      keywords.push(
        pageData.productName?.toLowerCase(),
        pageData.brand?.toLowerCase(),
        pageData.category?.toLowerCase(),
        `${pageData.productName} ethiopia`,
        `buy ${pageData.productName}`,
        `${pageData.brand} ${pageData.productName}`
      );
    }
    
    if (pageData.type === 'category') {
      keywords.push(
        pageData.categoryName?.toLowerCase(),
        `${pageData.categoryName} ethiopia`,
        `buy ${pageData.categoryName?.toLowerCase()}`,
        `${pageData.categoryName?.toLowerCase()} prices`
      );
    }
    
    return keywords.join(', ');
  }

  // Generate structured data (JSON-LD)
  generateStructuredData(pageData) {
    if (pageData.type === 'product') {
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: pageData.productName,
        brand: pageData.brand,
        category: pageData.category,
        description: pageData.description,
        image: pageData.image,
        offers: {
          '@type': 'Offer',
          price: pageData.price,
          priceCurrency: 'ETB',
          availability: pageData.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
        }
      };
    }
    
    if (pageData.type === 'shop') {
      return {
        '@context': 'https://schema.org',
        '@type': 'Store',
        name: pageData.shopName,
        description: pageData.description,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'Ethiopia'
        }
      };
    }
    
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.baseTitle,
      url: this.siteUrl
    };
  }

  // Generate Open Graph tags
  generateOpenGraph(pageData) {
    return {
      'og:title': this.generateTitle(pageData),
      'og:description': this.generateDescription(pageData),
      'og:image': pageData.image || `${this.siteUrl}/logo.png`,
      'og:url': `${this.siteUrl}${pageData.path || ''}`,
      'og:type': pageData.type === 'product' ? 'product' : 'website',
      'og:site_name': this.baseTitle,
      'og:locale': 'en_ET'
    };
  }

  // Generate Twitter Card
  generateTwitterCard(pageData) {
    return {
      'twitter:card': 'summary_large_image',
      'twitter:site': '@ethiopian_electronics',
      'twitter:title': this.generateTitle(pageData),
      'twitter:description': this.generateDescription(pageData),
      'twitter:image': pageData.image || `${this.siteUrl}/logo.png`
    };
  }

  // Generate canonical URL
  generateCanonical(pageData) {
    return `${this.siteUrl}${pageData.path || ''}`;
  }

  // Generate robots meta
  generateRobots(pageData) {
    if (pageData.type === 'search' || pageData.type === 'category') {
      return 'index, follow';
    }
    return 'index, follow';
  }

  // Generate geo tags for Ethiopia
  generateGeoTags() {
    return {
      country: 'Ethiopia',
      region: 'Addis Ababa',
      placename: 'Ethiopia',
      position: '9.1450, 40.4897'
    };
  }

  // Generate sitemap
  generateSitemap(pages) {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${this.siteUrl}${page.path}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return sitemap;
  }

  // Generate robots.txt
  generateRobotsTxt() {
    return `User-agent: *
Allow: /
Allow: /products
Allow: /categories
Allow: /shops
Disallow: /admin
Disallow: /api
Disallow: /cart
Disallow: /checkout

Sitemap: ${this.siteUrl}/sitemap.xml`;
  }

  // Generate breadcrumb structured data
  generateBreadcrumbs(breadcrumbs) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': `${this.siteUrl}${crumb.path}`
      }))
    };
  }
}

module.exports = SEOManager;
