# Ethiopian Electronics Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![Python Version](https://img.shields.io/badge/python-%3E%3D3.7-blue)](https://www.python.org/)

A comprehensive, professional Ethiopian electronics marketplace platform built with modern web technologies. This project provides a complete solution for buying and selling electronics in Ethiopia, featuring shop management, product catalogs, search functionality, and administrative controls.

## 🌟 Features

### 🛒 Core Functionality
- **Shop Registration & Management**: Complete shop onboarding with verification
- **Product Catalog**: Extensive electronics product management with categories
- **Advanced Search**: Real-time search with filtering and sorting capabilities
- **User Authentication**: Secure login system for admins and shop owners
- **Order Management**: Full order processing and tracking system
- **Delivery System**: Integrated delivery management with Ethiopian context

### 📱 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Ethiopian Localization**: Tailored for Ethiopian market and users
- **Multi-language Support**: Amharic and English interface options
- **Contact Integration**: Direct WhatsApp, SMS, Telegram, and Facebook integration
- **Real-time Updates**: Live notifications and status updates

### 🔧 Technical Features
- **Admin Dashboard**: Comprehensive administrative interface
- **Security**: XSS protection, secure headers, and input validation
- **Performance**: Optimized loading with lazy loading and caching
- **SEO Ready**: Meta tags, structured data, and clean URLs
- **API Integration**: RESTful backend APIs for all operations

## 🚀 Quick Start

### Prerequisites
- Node.js >= 14.0.0
- Python >= 3.7 (for local development)
- SQLite3 (for database)
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/eyasu-asefa11/Ethiopian-Electronics-hub.git
   cd Ethiopian-Electronics-hub
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up the database**
   ```bash
   node add_sample_data.js
   ```

4. **Start the backend server**
   ```bash
   node index.html  # Note: This should be your main server file
   ```
   Or use the provided script:
   ```bash
   python START-SERVER.py
   ```

5. **Open the application**
   - Main Page: http://localhost:8000/index.html
   - Admin Dashboard: http://localhost:8000/admin-dashboard.html
   - Shop Registration: http://localhost:8000/register-shop-enhanced.html

## 📁 Project Structure

```
Ethiopian-Electronics-hub/
├── backend/                 # Node.js backend server
│   ├── node_modules/        # Dependencies
│   ├── database_schema.sql  # Database schema
│   ├── db.js               # Database connection
│   ├── index.html          # Main server file
│   └── *.js                # API endpoints
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   └── styles/        # CSS stylesheets
│   └── public/            # Static assets
├── mobile/                 # Mobile application (future)
├── typings/               # TypeScript definitions
├── *.html                 # Static HTML pages
├── package.json           # Project dependencies
├── README.md              # This file
└── .gitignore            # Git ignore rules
```

## 🔧 API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/shop/register` - Shop registration

### Shop Management
- `GET /api/shops` - Get all shops
- `POST /api/shops` - Create new shop
- `PUT /api/shops/:id` - Update shop
- `DELETE /api/shops/:id` - Delete shop

### Product Management
- `GET /api/products` - Get all products
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Search & Categories
- `GET /api/search` - Search products
- `GET /api/categories` - Get product categories
- `GET /api/cities` - Get Ethiopian cities

## 🌐 Deployment

### Netlify Deployment
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.
```

### Vercel Deployment
```bash
npm install -g vercel
vercel --prod
```

### Local Development Server
```bash
python -m http.server 8000
```

## 🛠️ Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

### Code Quality
- ESLint for JavaScript linting
- Prettier for code formatting
- Husky for pre-commit hooks

## 📊 Database Schema

The application uses SQLite with the following main tables:
- `shops` - Shop information
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Order management
- `users` - User accounts

See `backend/database_schema.sql` for complete schema.

## 🔒 Security

- **XSS Protection**: Content Security Policy headers
- **Authentication**: Secure JWT-based authentication
- **Input Validation**: Server-side validation and sanitization
- **HTTPS**: SSL/TLS encryption in production
- **CORS**: Configured for secure API access

## 📈 Performance

- **Lazy Loading**: Images and components load on demand
- **Caching**: Browser caching and CDN optimization
- **Minification**: CSS and JavaScript minification
- **Compression**: Gzip compression enabled
- **CDN**: Static assets served via CDN

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the Ethiopian electronics market
- Inspired by modern e-commerce platforms
- Community-driven development

## 📞 Support

For support, email eyasu-asefa11@example.com or join our [Telegram channel](https://t.me/ethioelectronics).

## 🔄 Version History

- **v1.0.0** - Initial release with core marketplace features
- **v1.1.0** - Added delivery system and mobile optimization
- **v1.2.0** - Enhanced search and Ethiopian localization

---

**Made with ❤️ for Ethiopia's electronics community**

## 📞 Support

For deployment issues or questions:
- **GitHub**: https://github.com/ethio-electronics-hub/issues
- **Email**: support@ethio-electronics-hub.com

---

**Ethio Electronics Hub** - Professional Ethiopian Electronics Marketplace
© 2024 All rights reserved.
