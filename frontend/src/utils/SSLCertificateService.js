// SSL Certificate Setup and Security Configuration for Ethiopian Electronics Marketplace
class SSLCertificateService {
  constructor() {
    this.certificates = new Map();
    this.securityHeaders = new Map();
    this.sslConfig = new Map();
    this.securityPolicies = new Map();
    this.complianceReports = new Map();
    
    this.initializeSSLConfig();
    this.initializeSecurityHeaders();
    this.initializeSecurityPolicies();
    this.initializeFromStorage();
  }

  // Initialize SSL configuration
  initializeSSLConfig() {
    const sslConfig = {
      'production': {
        domain: 'ethiopian-electronics.com',
        certificateType: 'wildcard',
        provider: 'lets_encrypt',
        autoRenew: true,
        renewalDays: 30,
        protocols: ['TLSv1.2', 'TLSv1.3'],
        ciphers: [
          'TLS_AES_256_GCM_SHA384',
          'TLS_CHACHA20_POLY1305_SHA256',
          'TLS_AES_128_GCM_SHA256',
          'ECDHE-RSA-AES256-GCM-SHA384',
          'ECDHE-RSA-AES128-GCM-SHA256'
        ],
        hsts: {
          enabled: true,
          maxAge: 31536000, // 1 year
          includeSubDomains: true,
          preload: true
        },
        ocsp: {
          enabled: true,
          stapling: true
        },
        certificateTransparency: {
          enabled: true,
          logs: ['google_ct_log', 'cloudflare_ct_log']
        }
      },
      'staging': {
        domain: 'staging.ethiopian-electronics.com',
        certificateType: 'single',
        provider: 'lets_encrypt',
        autoRenew: true,
        renewalDays: 7,
        protocols: ['TLSv1.2', 'TLSv1.3'],
        ciphers: [
          'TLS_AES_256_GCM_SHA384',
          'TLS_CHACHA20_POLY1305_SHA256',
          'TLS_AES_128_GCM_SHA256'
        ],
        hsts: {
          enabled: true,
          maxAge: 86400, // 1 day
          includeSubDomains: false,
          preload: false
        },
        ocsp: {
          enabled: true,
          stapling: true
        },
        certificateTransparency: {
          enabled: true,
          logs: ['google_ct_log']
        }
      },
      'development': {
        domain: 'localhost',
        certificateType: 'self_signed',
        provider: 'local',
        autoRenew: false,
        renewalDays: 0,
        protocols: ['TLSv1.2', 'TLSv1.3'],
        ciphers: [
          'TLS_AES_256_GCM_SHA384',
          'TLS_CHACHA20_POLY1305_SHA256',
          'TLS_AES_128_GCM_SHA256'
        ],
        hsts: {
          enabled: false,
          maxAge: 0,
          includeSubDomains: false,
          preload: false
        },
        ocsp: {
          enabled: false,
          stapling: false
        },
        certificateTransparency: {
          enabled: false,
          logs: []
        }
      }
    };

    sslConfig.forEach((config, key) => {
      this.sslConfig.set(key, config);
    });
  }

  // Initialize security headers
  initializeSecurityHeaders() {
    const headers = {
      'strict_transport_security': {
        name: 'Strict-Transport-Security',
        description: 'Enforces HTTPS connections',
        enabled: true,
        value: 'max-age=31536000; includeSubDomains; preload',
        priority: 'critical'
      },
      'content_security_policy': {
        name: 'Content-Security-Policy',
        description: 'Prevents XSS and data injection attacks',
        enabled: true,
        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://www.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.ethiopian-electronics.com; frame-ancestors 'none'; form-action 'self'; base-uri 'self'; upgrade-insecure-requests;",
        priority: 'critical'
      },
      'x_frame_options': {
        name: 'X-Frame-Options',
        description: 'Prevents clickjacking attacks',
        enabled: true,
        value: 'DENY',
        priority: 'high'
      },
      'x_content_type_options': {
        name: 'X-Content-Type-Options',
        description: 'Prevents MIME-type sniffing',
        enabled: true,
        value: 'nosniff',
        priority: 'high'
      },
      'x_xss_protection': {
        name: 'X-XSS-Protection',
        description: 'Enables XSS protection in older browsers',
        enabled: true,
        value: '1; mode=block',
        priority: 'high'
      },
      'referrer_policy': {
        name: 'Referrer-Policy',
        description: 'Controls referrer information',
        enabled: true,
        value: 'strict-origin-when-cross-origin',
        priority: 'medium'
      },
      'permissions_policy': {
        name: 'Permissions-Policy',
        description: 'Controls browser feature access',
        enabled: true,
        value: 'camera=(), microphone=(), geolocation=(), payment=()',
        priority: 'medium'
      },
      'cross_origin_embedder_policy': {
        name: 'Cross-Origin-Embedder-Policy',
        description: 'Controls cross-origin resource embedding',
        enabled: true,
        value: 'require-corp',
        priority: 'medium'
      },
      'cross_origin_opener_policy': {
        name: 'Cross-Origin-Opener-Policy',
        description: 'Controls cross-origin window access',
        enabled: true,
        value: 'same-origin',
        priority: 'medium'
      },
      'cross_origin_resource_policy': {
        name: 'Cross-Origin-Resource-Policy',
        description: 'Controls cross-origin resource access',
        enabled: true,
        value: 'same-origin',
        priority: 'medium'
      }
    };

    headers.forEach((header, key) => {
      this.securityHeaders.set(key, header);
    });
  }

  // Initialize security policies
  initializeSecurityPolicies() {
    const policies = {
      'password_policy': {
        name: 'Password Security Policy',
        description: 'Requirements for secure passwords',
        enabled: true,
        rules: {
          minLength: 8,
          maxLength: 128,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true,
          preventCommonPasswords: true,
          preventPersonalInfo: true,
          maxAge: 90, // days
          historyCount: 5,
          lockoutAttempts: 5,
          lockoutDuration: 30 // minutes
        }
      },
      'session_policy': {
        name: 'Session Security Policy',
        description: 'Requirements for secure sessions',
        enabled: true,
        rules: {
          maxDuration: 24, // hours
          absoluteTimeout: 72, // hours
          idleTimeout: 30, // minutes
          secureFlag: true,
          httpOnlyFlag: true,
          sameSitePolicy: 'strict',
          regenerateOnLogin: true,
          regenerateOnPrivilegeChange: true,
          concurrentSessions: 3,
          ipBinding: true,
          deviceBinding: true
        }
      },
      'api_security_policy': {
        name: 'API Security Policy',
        description: 'Requirements for secure API access',
        enabled: true,
        rules: {
          rateLimiting: {
            enabled: true,
            requestsPerMinute: 100,
            requestsPerHour: 1000,
            requestsPerDay: 10000
          },
          authentication: {
            required: true,
            methods: ['jwt', 'oauth2'],
            tokenExpiry: 3600 // seconds
          },
          encryption: {
            inTransit: 'TLS1.3',
            atRest: 'AES-256'
          },
          validation: {
            inputSanitization: true,
            sqlInjectionProtection: true,
            xssProtection: true,
            csrfProtection: true
          }
        }
      },
      'data_protection_policy': {
        name: 'Data Protection Policy',
        description: 'Requirements for data protection',
        enabled: true,
        rules: {
          encryption: {
            atRest: 'AES-256',
            inTransit: 'TLS1.3',
            keyManagement: 'AWS_KMS'
          },
          retention: {
            personalData: 365, // days
            financialData: 2555, // 7 years
            logs: 90 // days
          },
          access: {
            principleOfLeastPrivilege: true,
            multiFactorAuth: true,
            auditLogging: true,
            dataClassification: true
          },
          compliance: {
            gdpr: true,
            ccpa: true,
            ethiopianDataProtection: true
          }
        }
      }
    };

    policies.forEach((policy, key) => {
      this.securityPolicies.set(key, policy);
    });
  }

  // Initialize from local storage
  initializeFromStorage() {
    const certificates = this.loadFromLocalStorage('ssl_certificates');
    const complianceReports = this.loadFromLocalStorage('ssl_compliance_reports');
    
    if (certificates) this.certificates = new Map(Object.entries(certificates));
    if (complianceReports) this.complianceReports = new Map(Object.entries(complianceReports));
  }

  // Generate SSL certificate request
  generateCertificateRequest(environment = 'production') {
    const config = this.sslConfig.get(environment);
    if (!config) {
      throw new Error('Invalid environment');
    }

    const certificateRequest = {
      id: this.generateId(),
      environment,
      domain: config.domain,
      certificateType: config.certificateType,
      provider: config.provider,
      status: 'pending',
      createdAt: Date.now(),
      expiresAt: null,
      certificateData: null,
      privateKey: null,
      chain: null,
      metadata: {
        requestedBy: 'ssl_system',
        csr: this.generateCSR(config),
        protocols: config.protocols,
        ciphers: config.ciphers
      }
    };

    this.certificates.set(certificateRequest.id, certificateRequest);
    this.saveToLocalStorage('ssl_certificates', this.mapToObject(this.certificates));

    return certificateRequest;
  }

  // Generate Certificate Signing Request (CSR)
  generateCSR(config) {
    // Mock CSR generation
    const csr = {
      commonName: config.domain,
      organization: 'Ethiopian Electronics Marketplace',
      organizationalUnit: 'IT Security',
      country: 'ET',
      state: 'Addis Ababa',
      locality: 'Addis Ababa',
      email: 'security@ethiopian-electronics.com',
      subjectAlternativeNames: this.getSANs(config)
    };

    return csr;
  }

  // Get Subject Alternative Names
  getSANs(config) {
    const sans = [config.domain];
    
    if (config.certificateType === 'wildcard') {
      sans.push(`*.${config.domain}`);
    }
    
    // Add common subdomains
    const subdomains = ['www', 'api', 'admin', 'blog', 'shop', 'support', 'staging'];
    subdomains.forEach(subdomain => {
      sans.push(`${subdomain}.${config.domain}`);
    });

    return sans;
  }

  // Install SSL certificate
  async installCertificate(certificateId, certificateData, privateKey, chain = []) {
    const certificate = this.certificates.get(certificateId);
    if (!certificate) {
      throw new Error('Certificate not found');
    }

    // Validate certificate
    const validation = await this.validateCertificate(certificateData, privateKey, chain);
    if (!validation.valid) {
      throw new Error(`Certificate validation failed: ${validation.errors.join(', ')}`);
    }

    // Update certificate
    certificate.status = 'installed';
    certificate.certificateData = certificateData;
    certificate.privateKey = privateKey;
    certificate.chain = chain;
    certificate.installedAt = Date.now();
    certificate.expiresAt = this.extractExpirationDate(certificateData);
    certificate.validation = validation;

    this.certificates.set(certificateId, certificate);
    this.saveToLocalStorage('ssl_certificates', this.mapToObject(this.certificates));

    // Configure web server
    await this.configureWebServer(certificate);

    return certificate;
  }

  // Validate SSL certificate
  async validateCertificate(certificateData, privateKey, chain) {
    const validation = {
      valid: true,
      errors: [],
      warnings: [],
      metadata: {}
    };

    try {
      // Check certificate format
      if (!certificateData.startsWith('-----BEGIN CERTIFICATE-----')) {
        validation.valid = false;
        validation.errors.push('Invalid certificate format');
      }

      // Check private key format
      if (!privateKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
        validation.valid = false;
        validation.errors.push('Invalid private key format');
      }

      // Check expiration
      const expirationDate = this.extractExpirationDate(certificateData);
      if (expirationDate < Date.now()) {
        validation.valid = false;
        validation.errors.push('Certificate has expired');
      }

      // Check domain match
      const domain = this.extractDomain(certificateData);
      if (!domain) {
        validation.valid = false;
        validation.errors.push('Cannot extract domain from certificate');
      }

      // Check certificate strength
      const keySize = this.extractKeySize(privateKey);
      if (keySize < 2048) {
        validation.warnings.push('Private key size should be at least 2048 bits');
      }

      // Check chain
      if (chain.length === 0) {
        validation.warnings.push('No certificate chain provided');
      }

      validation.metadata = {
        domain,
        expirationDate,
        keySize,
        chainLength: chain.length,
        issuer: this.extractIssuer(certificateData),
        serialNumber: this.extractSerialNumber(certificateData)
      };

    } catch (error) {
      validation.valid = false;
      validation.errors.push(`Validation error: ${error.message}`);
    }

    return validation;
  }

  // Extract expiration date from certificate
  extractExpirationDate(certificateData) {
    // Mock extraction - in production, use proper certificate parsing
    const now = Date.now();
    return now + (365 * 24 * 60 * 60 * 1000); // 1 year from now
  }

  // Extract domain from certificate
  extractDomain(certificateData) {
    // Mock extraction - in production, use proper certificate parsing
    return 'ethiopian-electronics.com';
  }

  // Extract key size from private key
  extractKeySize(privateKey) {
    // Mock extraction - in production, use proper key parsing
    return 2048;
  }

  // Extract issuer from certificate
  extractIssuer(certificateData) {
    // Mock extraction - in production, use proper certificate parsing
    return 'Let\'s Encrypt Authority X3';
  }

  // Extract serial number from certificate
  extractSerialNumber(certificateData) {
    // Mock extraction - in production, use proper certificate parsing
    return '0x123456789ABCDEF';
  }

  // Configure web server with SSL
  async configureWebServer(certificate) {
    const config = this.sslConfig.get(certificate.environment);
    
    const serverConfig = {
      ssl: {
        enabled: true,
        certificate: certificate.certificateData,
        privateKey: certificate.privateKey,
        chain: certificate.chain,
        protocols: config.protocols,
        ciphers: config.ciphers.join(':'),
        preferServerCiphers: true,
        honorCipherOrder: true
      },
      hsts: config.hsts,
      ocsp: config.ocsp,
      certificateTransparency: config.certificateTransparency
    };

    // In production, this would configure actual web server (nginx, apache, etc.)
    console.log('🔒 Configuring web server with SSL:', serverConfig);

    return serverConfig;
  }

  // Get security headers for response
  getSecurityHeaders(environment = 'production') {
    const headers = {};
    
    for (const [key, header] of this.securityHeaders.entries()) {
      if (header.enabled) {
        headers[header.name] = header.value;
      }
    }

    // Environment-specific adjustments
    if (environment === 'development') {
      // Less strict headers for development
      headers['Content-Security-Policy'] = headers['Content-Security-Policy'].replace('upgrade-insecure-requests;', '');
    }

    return headers;
  }

  // Check SSL certificate status
  checkCertificateStatus(certificateId) {
    const certificate = this.certificates.get(certificateId);
    if (!certificate) {
      return { status: 'not_found' };
    }

    const now = Date.now();
    const thirtyDaysFromNow = now + (30 * 24 * 60 * 60 * 1000);

    let status = 'valid';
    let warnings = [];

    if (certificate.expiresAt < now) {
      status = 'expired';
    } else if (certificate.expiresAt < thirtyDaysFromNow) {
      status = 'expiring_soon';
      warnings.push('Certificate expires within 30 days');
    }

    if (certificate.status !== 'installed') {
      status = 'not_installed';
    }

    return {
      status,
      domain: certificate.domain,
      environment: certificate.environment,
      provider: certificate.provider,
      expiresAt: certificate.expiresAt,
      daysUntilExpiration: Math.ceil((certificate.expiresAt - now) / (24 * 60 * 60 * 1000)),
      installedAt: certificate.installedAt,
      warnings,
      validation: certificate.validation
    };
  }

  // Renew SSL certificate
  async renewCertificate(certificateId) {
    const certificate = this.certificates.get(certificateId);
    if (!certificate) {
      throw new Error('Certificate not found');
    }

    // Check if renewal is needed
    const now = Date.now();
    const renewalThreshold = certificate.expiresAt - (30 * 24 * 60 * 60 * 1000);
    
    if (now < renewalThreshold) {
      throw new Error('Certificate does not need renewal yet');
    }

    // Generate new certificate request
    const newCertificateRequest = this.generateCertificateRequest(certificate.environment);
    
    // In production, this would integrate with certificate provider
    console.log('🔄 Renewing SSL certificate:', newCertificateRequest);

    return newCertificateRequest;
  }

  // Run SSL compliance check
  async runComplianceCheck(environment = 'production') {
    const checkId = this.generateId();
    const config = this.sslConfig.get(environment);
    
    const complianceCheck = {
      id: checkId,
      environment,
      timestamp: Date.now(),
      status: 'running',
      checks: {},
      overallScore: 0,
      recommendations: [],
      passed: false
    };

    try {
      // Check certificate installation
      const certificateCheck = await this.checkCertificateInstallation(environment);
      complianceCheck.checks.certificate = certificateCheck;

      // Check security headers
      const headersCheck = await this.checkSecurityHeaders(environment);
      complianceCheck.checks.headers = headersCheck;

      // Check SSL configuration
      const configCheck = await this.checkSSLConfiguration(config);
      complianceCheck.checks.configuration = configCheck;

      // Check compliance standards
      const standardsCheck = await this.checkComplianceStandards(config);
      complianceCheck.checks.standards = standardsCheck;

      // Calculate overall score
      const scores = [
        certificateCheck.score,
        headersCheck.score,
        configCheck.score,
        standardsCheck.score
      ];
      complianceCheck.overallScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      complianceCheck.passed = complianceCheck.overallScore >= 80;

      // Generate recommendations
      complianceCheck.recommendations = this.generateRecommendations(complianceCheck.checks);

      complianceCheck.status = 'completed';

    } catch (error) {
      complianceCheck.status = 'error';
      complianceCheck.error = error.message;
    }

    this.complianceReports.set(checkId, complianceCheck);
    this.saveToLocalStorage('ssl_compliance_reports', this.mapToObject(this.complianceReports));

    return complianceCheck;
  }

  // Check certificate installation
  async checkCertificateInstallation(environment) {
    const check = {
      name: 'Certificate Installation',
      status: 'pass',
      score: 100,
      issues: [],
      details: {}
    };

    try {
      // Find installed certificate for environment
      let installedCertificate = null;
      for (const [id, cert] of this.certificates.entries()) {
        if (cert.environment === environment && cert.status === 'installed') {
          installedCertificate = cert;
          break;
        }
      }

      if (!installedCertificate) {
        check.status = 'fail';
        check.score = 0;
        check.issues.push('No SSL certificate installed');
        return check;
      }

      // Check expiration
      const now = Date.now();
      if (installedCertificate.expiresAt < now) {
        check.status = 'fail';
        check.score = 0;
        check.issues.push('SSL certificate has expired');
      } else if (installedCertificate.expiresAt < now + (30 * 24 * 60 * 60 * 1000)) {
        check.status = 'warning';
        check.score = 70;
        check.issues.push('SSL certificate expires within 30 days');
      }

      check.details = {
        domain: installedCertificate.domain,
        provider: installedCertificate.provider,
        expiresAt: installedCertificate.expiresAt,
        daysUntilExpiration: Math.ceil((installedCertificate.expiresAt - now) / (24 * 60 * 60 * 1000))
      };

    } catch (error) {
      check.status = 'error';
      check.score = 0;
      check.issues.push(`Error checking certificate: ${error.message}`);
    }

    return check;
  }

  // Check security headers
  async checkSecurityHeaders(environment) {
    const check = {
      name: 'Security Headers',
      status: 'pass',
      score: 100,
      issues: [],
      details: {}
    };

    const headers = this.getSecurityHeaders(environment);
    const requiredHeaders = ['Strict-Transport-Security', 'Content-Security-Policy', 'X-Frame-Options'];
    
    for (const headerName of requiredHeaders) {
      if (!headers[headerName]) {
        check.status = 'warning';
        check.score -= 25;
        check.issues.push(`Missing security header: ${headerName}`);
      }
    }

    check.details = {
      configuredHeaders: Object.keys(headers),
      headerCount: Object.keys(headers).length
    };

    return check;
  }

  // Check SSL configuration
  async checkSSLConfiguration(config) {
    const check = {
      name: 'SSL Configuration',
      status: 'pass',
      score: 100,
      issues: [],
      details: {}
    };

    // Check protocols
    if (!config.protocols.includes('TLSv1.3')) {
      check.status = 'warning';
      check.score -= 10;
      check.issues.push('TLS 1.3 not enabled');
    }

    if (config.protocols.includes('TLSv1.0') || config.protocols.includes('TLSv1.1')) {
      check.status = 'fail';
      check.score -= 30;
      check.issues.push('Insecure TLS versions enabled');
    }

    // Check ciphers
    const weakCiphers = ['RC4', 'DES', '3DES', 'MD5'];
    const hasWeakCiphers = config.ciphers.some(cipher => 
      weakCiphers.some(weak => cipher.includes(weak))
    );

    if (hasWeakCiphers) {
      check.status = 'fail';
      check.score -= 20;
      check.issues.push('Weak cipher suites enabled');
    }

    check.details = {
      protocols: config.protocols,
      cipherCount: config.ciphers.length,
      hstsEnabled: config.hsts.enabled,
      ocspEnabled: config.ocsp.enabled
    };

    return check;
  }

  // Check compliance standards
  async checkComplianceStandards(config) {
    const check = {
      name: 'Compliance Standards',
      status: 'pass',
      score: 100,
      issues: [],
      details: {}
    };

    // Check PCI DSS compliance
    if (!config.protocols.includes('TLSv1.2')) {
      check.status = 'warning';
      check.score -= 20;
      check.issues.push('PCI DSS requires TLS 1.2 or higher');
    }

    // Check GDPR compliance
    if (!config.certificateTransparency.enabled) {
      check.status = 'warning';
      check.score -= 10;
      check.issues.push('Certificate transparency recommended for GDPR compliance');
    }

    check.details = {
      pciDssCompliant: config.protocols.includes('TLSv1.2'),
      gdprCompliant: config.certificateTransparency.enabled,
      ethiopianCompliant: true
    };

    return check;
  }

  // Generate recommendations
  generateRecommendations(checks) {
    const recommendations = [];

    Object.values(checks).forEach(check => {
      check.issues.forEach(issue => {
        if (issue.includes('expired')) {
          recommendations.push('Renew SSL certificate immediately');
        } else if (issue.includes('expires within 30 days')) {
          recommendations.push('Plan SSL certificate renewal');
        } else if (issue.includes('Missing security header')) {
          recommendations.push('Implement missing security headers');
        } else if (issue.includes('TLS 1.3')) {
          recommendations.push('Enable TLS 1.3 for better security');
        } else if (issue.includes('weak cipher')) {
          recommendations.push('Remove weak cipher suites');
        }
      });
    });

    return [...new Set(recommendations)]; // Remove duplicates
  }

  // Get SSL statistics
  getSSLStatistics() {
    const certificates = Array.from(this.certificates.values());
    const reports = Array.from(this.complianceReports.values());
    
    return {
      totalCertificates: certificates.length,
      installedCertificates: certificates.filter(c => c.status === 'installed').length,
      expiredCertificates: certificates.filter(c => this.checkCertificateStatus(c.id).status === 'expired').length,
      certificatesByEnvironment: this.getCertificatesByEnvironment(certificates),
      certificatesByProvider: this.getCertificatesByProvider(certificates),
      averageCertificateAge: this.calculateAverageCertificateAge(certificates),
      totalComplianceChecks: reports.length,
      averageComplianceScore: this.calculateAverageComplianceScore(reports),
      lastComplianceCheck: reports.length > 0 ? Math.max(...reports.map(r => r.timestamp)) : null,
      securityHeadersCount: this.securityHeaders.size,
      enabledSecurityHeaders: Array.from(this.securityHeaders.values()).filter(h => h.enabled).length
    };
  }

  getCertificatesByEnvironment(certificates) {
    const envCount = {};
    certificates.forEach(cert => {
      envCount[cert.environment] = (envCount[cert.environment] || 0) + 1;
    });
    return envCount;
  }

  getCertificatesByProvider(certificates) {
    const providerCount = {};
    certificates.forEach(cert => {
      providerCount[cert.provider] = (providerCount[cert.provider] || 0) + 1;
    });
    return providerCount;
  }

  calculateAverageCertificateAge(certificates) {
    const installedCerts = certificates.filter(c => c.status === 'installed');
    if (installedCerts.length === 0) return 0;

    const totalAge = installedCerts.reduce((sum, cert) => {
      return sum + (Date.now() - cert.installedAt);
    }, 0);

    return totalAge / installedCerts.length;
  }

  calculateAverageComplianceScore(reports) {
    if (reports.length === 0) return 0;
    const totalScore = reports.reduce((sum, report) => sum + report.overallScore, 0);
    return totalScore / reports.length;
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Local storage helpers
  saveToLocalStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  loadFromLocalStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }

  mapToObject(map) {
    const obj = {};
    for (const [key, value] of map.entries()) {
      obj[key] = value;
    }
    return obj;
  }
}

module.exports = SSLCertificateService;
