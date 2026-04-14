// Phone Verification System for Ethiopian Electronics Marketplace
class PhoneVerificationService {
  constructor() {
    this.verifications = new Map();
    this.smsTemplates = new Map();
    this.rateLimits = new Map();
    this.blacklist = new Map();
    this.ethiopianCarriers = new Map();
    this.attempts = new Map();
    
    this.initializeCarriers();
    this.initializeTemplates();
    this.initializeFromStorage();
  }

  // Initialize Ethiopian mobile carriers
  initializeCarriers() {
    const carriers = {
      'ethiotelecom': {
        id: 'ethiotelecom',
        name: 'Ethio Telecom',
        country: 'ET',
        prefixes: ['0911', '0912', '0913', '0914', '0915', '0916', '0917', '0918', '0919', '0921', '0922', '0923', '0924', '0925', '0926', '0927', '0928', '0929'],
        smsGateway: 'sms.ethiotelecom.et',
        apiEndpoint: 'https://api.ethiotelecom.et/sms',
        rateLimit: 5, // per minute
        maxRetries: 3,
        timeout: 30000
      },
      'safaricom_ethiopia': {
        id: 'safaricom_ethiopia',
        name: 'Safaricom Ethiopia',
        country: 'ET',
        prefixes: ['0700', '0701', '0702', '0703', '0704', '0705', '0706', '0707', '0708', '0709'],
        smsGateway: 'sms.safaricom.et',
        apiEndpoint: 'https://api.safaricom.et/sms',
        rateLimit: 8,
        maxRetries: 3,
        timeout: 25000
      },
      'africell_ethiopia': {
        id: 'africell_ethiopia',
        name: 'Africell Ethiopia',
        country: 'ET',
        prefixes: ['0930', '0931', '0932', '0933', '0934', '0935', '0936', '0937', '0938', '0939'],
        smsGateway: 'sms.africell.et',
        apiEndpoint: 'https://api.africell.et/sms',
        rateLimit: 6,
        maxRetries: 3,
        timeout: 28000
      },
      'telesom_ethiopia': {
        id: 'telesom_ethiopia',
        name: 'Telesom Ethiopia',
        country: 'ET',
        prefixes: ['0940', '0941', '0942', '0943', '0944', '0945', '0946', '0947', '0948', '0949'],
        smsGateway: 'sms.telesom.et',
        apiEndpoint: 'https://api.telesom.et/sms',
        rateLimit: 4,
        maxRetries: 3,
        timeout: 35000
      }
    };

    carriers.forEach((carrier, key) => {
      this.ethiopianCarriers.set(key, carrier);
    });
  }

  // Initialize SMS templates
  initializeTemplates() {
    const templates = {
      'verification': {
        message: 'Ethiopian Electronics: Your verification code is {{code}}. Valid for 10 minutes. Do not share this code.',
        length: 6,
        type: 'numeric'
      },
      'password_reset': {
        message: 'Ethiopian Electronics: Reset code is {{code}}. Valid for 5 minutes. If you didn\'t request this, ignore this message.',
        length: 6,
        type: 'numeric'
      },
      'transaction': {
        message: 'Ethiopian Electronics: Transaction OTP is {{code}}. Valid for 3 minutes. Never share your OTP.',
        length: 6,
        type: 'numeric'
      },
      'login_alert': {
        message: 'Ethiopian Electronics: New login detected. If this wasn\'t you, call +251-115-515151 immediately.',
        length: 0,
        type: 'alert'
      },
      'order_confirmation': {
        message: 'Ethiopian Electronics: Order #{{orderId}} confirmed. Track at ethiopian-electronics.com/track/{{trackingId}}',
        length: 0,
        type: 'notification'
      },
      'delivery_update': {
        message: 'Ethiopian Electronics: Your order is out for delivery! Track live at ethiopian-electronics.com/track/{{trackingId}}',
        length: 0,
        type: 'notification'
      }
    };

    templates.forEach((template, key) => {
      this.smsTemplates.set(key, template);
    });
  }

  // Initialize from local storage
  initializeFromStorage() {
    const verifications = this.loadFromLocalStorage('phone_verifications');
    const rateLimits = this.loadFromLocalStorage('phone_rate_limits');
    const blacklist = this.loadFromLocalStorage('phone_blacklist');
    const attempts = this.loadFromLocalStorage('phone_attempts');
    
    if (verifications) this.verifications = new Map(Object.entries(verifications));
    if (rateLimits) this.rateLimits = new Map(Object.entries(rateLimits));
    if (blacklist) this.blacklist = new Map(Object.entries(blacklist));
    if (attempts) this.attempts = new Map(Object.entries(attempts));
  }

  // Validate Ethiopian phone number
  validateEthiopianPhone(phone) {
    // Remove all non-numeric characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if it starts with Ethiopian country code or local format
    if (cleanPhone.startsWith('251')) {
      // International format: +2519...
      const localNumber = cleanPhone.substring(3);
      return this.isValidLocalNumber(localNumber) ? `+251${localNumber}` : null;
    } else if (cleanPhone.startsWith('0')) {
      // Local format: 09...
      return this.isValidLocalNumber(cleanPhone) ? cleanPhone : null;
    } else if (cleanPhone.startsWith('9') && cleanPhone.length === 9) {
      // Short format: 9...
      return `0${cleanPhone}`;
    }
    
    return null;
  }

  // Check if local number is valid
  isValidLocalNumber(localNumber) {
    if (localNumber.length !== 10 && localNumber.length !== 9) {
      return false;
    }
    
    // Check against known carrier prefixes
    for (const carrier of this.ethiopianCarriers.values()) {
      for (const prefix of carrier.prefixes) {
        if (localNumber.startsWith(prefix)) {
          return true;
        }
      }
    }
    
    return false;
  }

  // Get carrier for phone number
  getCarrierForPhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    
    for (const carrier of this.ethiopianCarriers.values()) {
      for (const prefix of carrier.prefixes) {
        if (cleanPhone.includes(prefix)) {
          return carrier;
        }
      }
    }
    
    return null;
  }

  // Send verification SMS
  async sendVerificationSMS(phone, userId, type = 'verification') {
    // Validate phone number
    const validPhone = this.validateEthiopianPhone(phone);
    if (!validPhone) {
      throw new Error('Invalid Ethiopian phone number');
    }

    // Check rate limiting
    if (!this.checkRateLimit(validPhone)) {
      throw new Error('Too many SMS requests. Please try again later.');
    }

    // Check blacklist
    if (this.isBlacklisted(validPhone)) {
      throw new Error('Phone number is not allowed');
    }

    // Get carrier
    const carrier = this.getCarrierForPhone(validPhone);
    if (!carrier) {
      throw new Error('Unsupported mobile carrier');
    }

    // Generate verification code
    const template = this.smsTemplates.get(type);
    const code = this.generateVerificationCode(template.length, template.type);
    const token = this.generateVerificationToken();

    // Store verification data
    const verificationData = {
      userId,
      phone: validPhone,
      carrier: carrier.id,
      code,
      token,
      type,
      createdAt: Date.now(),
      expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutes
      attempts: 0,
      verified: false,
      sentAt: Date.now()
    };

    this.verifications.set(token, verificationData);
    this.saveToLocalStorage('phone_verifications', this.mapToObject(this.verifications));

    // Send SMS
    const message = this.renderTemplate(template.message, { code });
    
    try {
      await this.sendSMS(validPhone, message, carrier);
      return { 
        success: true, 
        token,
        message: 'Verification code sent',
        carrier: carrier.name
      };
    } catch (error) {
      // Remove verification if SMS failed
      this.verifications.delete(token);
      this.saveToLocalStorage('phone_verifications', this.mapToObject(this.verifications));
      throw new Error('Failed to send verification SMS');
    }
  }

  // Verify SMS code
  verifySMSCode(token, code) {
    const verification = this.verifications.get(token);
    if (!verification) {
      return { valid: false, error: 'Invalid or expired verification code' };
    }

    // Check expiration
    if (Date.now() > verification.expiresAt) {
      this.verifications.delete(token);
      this.saveToLocalStorage('phone_verifications', this.mapToObject(this.verifications));
      return { valid: false, error: 'Verification code has expired' };
    }

    // Check if already verified
    if (verification.verified) {
      return { valid: false, error: 'Code already verified' };
    }

    // Increment attempts
    verification.attempts++;
    
    // Check attempts limit
    if (verification.attempts > 3) {
      this.verifications.delete(token);
      this.saveToLocalStorage('phone_verifications', this.mapToObject(this.verifications));
      return { valid: false, error: 'Too many failed attempts. Please request a new code.' };
    }

    // Verify code
    if (verification.code !== code) {
      this.verifications.set(token, verification);
      this.saveToLocalStorage('phone_verifications', this.mapToObject(this.verifications));
      return { 
        valid: false, 
        error: 'Invalid verification code',
        attemptsRemaining: 3 - verification.attempts
      };
    }

    // Mark as verified
    verification.verified = true;
    verification.verifiedAt = Date.now();
    
    this.verifications.set(token, verification);
    this.saveToLocalStorage('phone_verifications', this.mapToObject(this.verifications));

    return { 
      valid: true, 
      userId: verification.userId,
      phone: verification.phone,
      message: 'Phone number verified successfully'
    };
  }

  // Resend verification SMS
  async resendVerificationSMS(token) {
    const verification = this.verifications.get(token);
    if (!verification) {
      throw new Error('Invalid verification request');
    }

    // Check if already verified
    if (verification.verified) {
      throw new Error('Phone number already verified');
    }

    // Check rate limiting
    if (!this.checkRateLimit(verification.phone)) {
      throw new Error('Too many SMS requests. Please try again later.');
    }

    // Generate new code
    const template = this.smsTemplates.get(verification.type);
    const newCode = this.generateVerificationCode(template.length, template.type);

    // Update verification
    verification.code = newCode;
    verification.createdAt = Date.now();
    verification.expiresAt = Date.now() + (10 * 60 * 1000);
    verification.sentAt = Date.now();

    this.verifications.set(token, verification);
    this.saveToLocalStorage('phone_verifications', this.mapToObject(this.verifications));

    // Send SMS
    const message = this.renderTemplate(template.message, { code: newCode });
    const carrier = this.ethiopianCarriers.get(verification.carrier);
    
    try {
      await this.sendSMS(verification.phone, message, carrier);
      return { 
        success: true, 
        message: 'Verification code resent',
        carrier: carrier.name
      };
    } catch (error) {
      throw new Error('Failed to resend verification SMS');
    }
  }

  // Send SMS (mock implementation)
  async sendSMS(phone, message, carrier) {
    console.log('📱 Sending SMS:', {
      to: phone,
      carrier: carrier.name,
      message: message
    });

    // In production, this would integrate with actual SMS gateway
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate SMS sending
        if (Math.random() > 0.05) { // 95% success rate
          resolve({ messageId: this.generateId(), status: 'sent' });
        } else {
          reject(new Error('SMS gateway error'));
        }
      }, 2000);
    });
  }

  // Send password reset SMS
  async sendPasswordResetSMS(phone, userId) {
    const validPhone = this.validateEthiopianPhone(phone);
    if (!validPhone) {
      throw new Error('Invalid Ethiopian phone number');
    }

    return await this.sendVerificationSMS(validPhone, userId, 'password_reset');
  }

  // Send transaction OTP
  async sendTransactionOTP(phone, userId, amount) {
    const validPhone = this.validateEthiopianPhone(phone);
    if (!validPhone) {
      throw new Error('Invalid Ethiopian phone number');
    }

    const result = await this.sendVerificationSMS(validPhone, userId, 'transaction');
    
    // Store transaction info
    const verification = this.verifications.get(result.token);
    if (verification) {
      verification.amount = amount;
      verification.type = 'transaction';
      verification.expiresAt = Date.now() + (3 * 60 * 1000); // 3 minutes for transactions
      this.verifications.set(result.token, verification);
      this.saveToLocalStorage('phone_verifications', this.mapToObject(this.verifications));
    }

    return result;
  }

  // Verify transaction OTP
  verifyTransactionOTP(token, code, amount) {
    const verification = this.verifications.get(token);
    if (!verification || verification.type !== 'transaction') {
      return { valid: false, error: 'Invalid transaction verification' };
    }

    // Check amount matches
    if (verification.amount !== amount) {
      return { valid: false, error: 'Amount mismatch' };
    }

    return this.verifySMSCode(token, code);
  }

  // Send login alert
  async sendLoginAlert(phone, location, device) {
    const validPhone = this.validateEthiopianPhone(phone);
    if (!validPhone) {
      return; // Silently fail for invalid phones
    }

    const template = this.smsTemplates.get('login_alert');
    const message = this.renderTemplate(template.message, { location, device });
    const carrier = this.getCarrierForPhone(validPhone);
    
    if (carrier) {
      try {
        await this.sendSMS(validPhone, message, carrier);
      } catch (error) {
        console.error('Failed to send login alert:', error);
      }
    }
  }

  // Send order confirmation SMS
  async sendOrderConfirmationSMS(phone, orderId, trackingId) {
    const validPhone = this.validateEthiopianPhone(phone);
    if (!validPhone) {
      return;
    }

    const template = this.smsTemplates.get('order_confirmation');
    const message = this.renderTemplate(template.message, { orderId, trackingId });
    const carrier = this.getCarrierForPhone(validPhone);
    
    if (carrier) {
      try {
        await this.sendSMS(validPhone, message, carrier);
      } catch (error) {
        console.error('Failed to send order confirmation:', error);
      }
    }
  }

  // Send delivery update SMS
  async sendDeliveryUpdateSMS(phone, trackingId) {
    const validPhone = this.validateEthiopianPhone(phone);
    if (!validPhone) {
      return;
    }

    const template = this.smsTemplates.get('delivery_update');
    const message = this.renderTemplate(template.message, { trackingId });
    const carrier = this.getCarrierForPhone(validPhone);
    
    if (carrier) {
      try {
        await this.sendSMS(validPhone, message, carrier);
      } catch (error) {
        console.error('Failed to send delivery update:', error);
      }
    }
  }

  // Generate verification code
  generateVerificationCode(length, type = 'numeric') {
    if (type === 'numeric') {
      let code = '';
      for (let i = 0; i < length; i++) {
        code += Math.floor(Math.random() * 10);
      }
      return code;
    } else if (type === 'alphanumeric') {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    }
    
    return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
  }

  // Generate verification token
  generateVerificationToken() {
    return this.generateId() + this.generateId();
  }

  // Render template with variables
  renderTemplate(template, variables) {
    let rendered = template;
    
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      rendered = rendered.replace(new RegExp(placeholder, 'g'), value);
    }
    
    return rendered;
  }

  // Check rate limiting
  checkRateLimit(phone) {
    const now = Date.now();
    const rateLimit = this.rateLimits.get(phone);
    
    if (!rateLimit) {
      this.rateLimits.set(phone, {
        count: 1,
        firstRequest: now,
        lastRequest: now
      });
      return true;
    }

    // Reset if more than 1 hour has passed
    if (now - rateLimit.firstRequest > 60 * 60 * 1000) {
      this.rateLimits.set(phone, {
        count: 1,
        firstRequest: now,
        lastRequest: now
      });
      return true;
    }

    // Check if exceeding limit (max 5 SMS per hour)
    if (rateLimit.count >= 5) {
      return false;
    }

    // Increment count
    rateLimit.count++;
    rateLimit.lastRequest = now;
    this.rateLimits.set(phone, rateLimit);
    
    return true;
  }

  // Check if phone is blacklisted
  isBlacklisted(phone) {
    const blacklistEntry = this.blacklist.get(phone);
    if (!blacklistEntry) return false;

    // Check if blacklist has expired
    if (Date.now() > blacklistEntry.expiresAt) {
      this.blacklist.delete(phone);
      this.saveToLocalStorage('phone_blacklist', this.mapToObject(this.blacklist));
      return false;
    }

    return true;
  }

  // Add phone to blacklist
  addToBlacklist(phone, reason = 'Spam complaints') {
    this.blacklist.set(phone, {
      phone,
      reason,
      addedAt: Date.now(),
      expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year
    });
    
    this.saveToLocalStorage('phone_blacklist', this.mapToObject(this.blacklist));
  }

  // Remove phone from blacklist
  removeFromBlacklist(phone) {
    this.blacklist.delete(phone);
    this.saveToLocalStorage('phone_blacklist', this.mapToObject(this.blacklist));
  }

  // Get verification status
  getVerificationStatus(phone) {
    for (const [token, verification] of this.verifications.entries()) {
      if (verification.phone === phone && verification.type === 'verification') {
        return {
          verified: verification.verified,
          verifiedAt: verification.verifiedAt,
          createdAt: verification.createdAt,
          expiresAt: verification.expiresAt,
          carrier: verification.carrier
        };
      }
    }
    
    return null;
  }

  // Clean up expired verifications
  cleanupExpiredVerifications() {
    const now = Date.now();
    const expiredTokens = [];
    
    for (const [token, verification] of this.verifications.entries()) {
      if (now > verification.expiresAt) {
        expiredTokens.push(token);
      }
    }
    
    expiredTokens.forEach(token => {
      this.verifications.delete(token);
    });
    
    if (expiredTokens.length > 0) {
      this.saveToLocalStorage('phone_verifications', this.mapToObject(this.verifications));
    }
    
    return expiredTokens.length;
  }

  // Get phone verification statistics
  getPhoneVerificationStatistics() {
    const verifications = Array.from(this.verifications.values());
    const now = Date.now();
    
    return {
      totalVerifications: verifications.length,
      verifiedPhones: verifications.filter(v => v.verified).length,
      pendingVerifications: verifications.filter(v => !v.verified && v.expiresAt > now).length,
      expiredVerifications: verifications.filter(v => v.expiresAt <= now).length,
      verificationRate: verifications.length > 0 ? 
        (verifications.filter(v => v.verified).length / verifications.length) * 100 : 0,
      blacklistedPhones: this.blacklist.size,
      rateLimitedPhones: this.rateLimits.size,
      verificationsByCarrier: this.getVerificationsByCarrier(verifications),
      verificationsByType: this.getVerificationsByType(verifications),
      verificationsByDay: this.getVerificationsByDay(verifications)
    };
  }

  getVerificationsByCarrier(verifications) {
    const carrierCount = {};
    verifications.forEach(verification => {
      carrierCount[verification.carrier] = (carrierCount[verification.carrier] || 0) + 1;
    });
    return carrierCount;
  }

  getVerificationsByType(verifications) {
    const typeCount = {};
    verifications.forEach(verification => {
      typeCount[verification.type] = (typeCount[verification.type] || 0) + 1;
    });
    return typeCount;
  }

  getVerificationsByDay(verifications) {
    const dayCount = {};
    verifications.forEach(verification => {
      const day = new Date(verification.createdAt).toDateString();
      dayCount[day] = (dayCount[day] || 0) + 1;
    });
    return dayCount;
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

module.exports = PhoneVerificationService;
