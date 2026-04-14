// Email Verification System for Ethiopian Electronics Marketplace
class EmailVerificationService {
  constructor() {
    this.verifications = new Map();
    this.emailTemplates = new Map();
    this.smtpConfig = null;
    this.rateLimits = new Map();
    this.blacklist = new Map();
    
    this.initializeTemplates();
    this.initializeSMTP();
    this.initializeFromStorage();
  }

  // Initialize email templates
  initializeTemplates() {
    const templates = {
      'verification': {
        subject: 'Verify Your Email - Ethiopian Electronics Marketplace',
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 32px;">Ethiopian Electronics Marketplace</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Verify Your Email Address</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello {{name}},</h2>
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Thank you for registering with Ethiopian Electronics Marketplace! To complete your registration and start shopping, please verify your email address by clicking the button below:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{verificationLink}}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:<br>
                <a href="{{verificationLink}}" style="color: #667eea;">{{verificationLink}}</a>
              </p>
              
              <p style="color: #999; font-size: 12px; margin-top: 30px;">
                This verification link will expire in 24 hours. If you didn't create an account, please ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; color: #999; font-size: 12px; padding: 20px;">
              <p>&copy; 2024 Ethiopian Electronics Marketplace. All rights reserved.</p>
              <p>Bole, Addis Ababa, Ethiopia</p>
            </div>
          </div>
        `,
        text: `
          Ethiopian Electronics Marketplace - Verify Your Email
          
          Hello {{name}},
          
          Thank you for registering with Ethiopian Electronics Marketplace! To complete your registration, please verify your email address by visiting this link:
          
          {{verificationLink}}
          
          This verification link will expire in 24 hours. If you didn't create an account, please ignore this email.
          
          © 2024 Ethiopian Electronics Marketplace
          Bole, Addis Ababa, Ethiopia
        `
      },
      'password_reset': {
        subject: 'Reset Your Password - Ethiopian Electronics Marketplace',
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 32px;">Ethiopian Electronics Marketplace</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Reset Your Password</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
              <h2 style="color: #333; margin-bottom: 20px;">Hello {{name}},</h2>
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                We received a request to reset your password for your Ethiopian Electronics Marketplace account. Click the button below to reset your password:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{resetLink}}" style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Reset Password
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:<br>
                <a href="{{resetLink}}" style="color: #667eea;">{{resetLink}}</a>
              </p>
              
              <p style="color: #999; font-size: 12px; margin-top: 30px;">
                This reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; color: #999; font-size: 12px; padding: 20px;">
              <p>&copy; 2024 Ethiopian Electronics Marketplace. All rights reserved.</p>
              <p>Bole, Addis Ababa, Ethiopia</p>
            </div>
          </div>
        `,
        text: `
          Ethiopian Electronics Marketplace - Reset Your Password
          
          Hello {{name}},
          
          We received a request to reset your password. Click the link below to reset your password:
          
          {{resetLink}}
          
          This reset link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
          
          © 2024 Ethiopian Electronics Marketplace
          Bole, Addis Ababa, Ethiopia
        `
      },
      'account_confirmation': {
        subject: 'Account Confirmed - Ethiopian Electronics Marketplace',
        html: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 32px;">Ethiopian Electronics Marketplace</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Account Confirmed!</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
              <h2 style="color: #333; margin-bottom: 20px;">Welcome to Ethiopian Electronics Marketplace!</h2>
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                Congratulations {{name}}! Your account has been successfully verified. You can now start shopping for the best electronics in Ethiopia.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{{loginLink}}" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                  Start Shopping
                </a>
              </div>
              
              <div style="background: #fff; padding: 20px; border-radius: 10px; border-left: 4px solid #28a745; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">What's Next?</h3>
                <ul style="color: #666; line-height: 1.6;">
                  <li>Browse thousands of electronics products</li>
                  <li>Compare prices from multiple sellers</li>
                  <li>Enjoy secure payment options</li>
                  <li>Get fast delivery across Ethiopia</li>
                </ul>
              </div>
            </div>
            
            <div style="text-align: center; color: #999; font-size: 12px; padding: 20px;">
              <p>&copy; 2024 Ethiopian Electronics Marketplace. All rights reserved.</p>
              <p>Bole, Addis Ababa, Ethiopia</p>
            </div>
          </div>
        `,
        text: `
          Ethiopian Electronics Marketplace - Account Confirmed
          
          Welcome to Ethiopian Electronics Marketplace!
          
          Congratulations {{name}}! Your account has been successfully verified. You can now start shopping for the best electronics in Ethiopia.
          
          What's Next?
          - Browse thousands of electronics products
          - Compare prices from multiple sellers
          - Enjoy secure payment options
          - Get fast delivery across Ethiopia
          
          Start shopping: {{loginLink}}
          
          © 2024 Ethiopian Electronics Marketplace
          Bole, Addis Ababa, Ethiopia
        `
      }
    };

    templates.forEach((template, key) => {
      this.emailTemplates.set(key, template);
    });
  }

  // Initialize SMTP configuration
  initializeSMTP() {
    this.smtpConfig = {
      host: 'smtp.gmail.com', // Ethiopian email provider
      port: 587,
      secure: false,
      auth: {
        user: 'noreply@ethiopian-electronics.com',
        pass: 'your-app-password'
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 5
    };
  }

  // Initialize from local storage
  initializeFromStorage() {
    const verifications = this.loadFromLocalStorage('email_verifications');
    const rateLimits = this.loadFromLocalStorage('email_rate_limits');
    const blacklist = this.loadFromLocalStorage('email_blacklist');
    
    if (verifications) this.verifications = new Map(Object.entries(verifications));
    if (rateLimits) this.rateLimits = new Map(Object.entries(rateLimits));
    if (blacklist) this.blacklist = new Map(Object.entries(blacklist));
  }

  // Send verification email
  async sendVerificationEmail(email, name, userId) {
    // Check rate limiting
    if (!this.checkRateLimit(email)) {
      throw new Error('Too many verification requests. Please try again later.');
    }

    // Check blacklist
    if (this.isBlacklisted(email)) {
      throw new Error('Email address is not allowed');
    }

    // Generate verification token
    const token = this.generateVerificationToken();
    const verificationData = {
      userId,
      email,
      name,
      token,
      type: 'verification',
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      attempts: 0,
      verified: false
    };

    this.verifications.set(token, verificationData);
    this.saveToLocalStorage('email_verifications', this.mapToObject(this.verifications));

    // Send email
    const verificationLink = `${window.location.origin}/verify-email?token=${token}`;
    const template = this.emailTemplates.get('verification');
    
    const emailData = {
      to: email,
      subject: template.subject,
      html: this.renderTemplate(template.html, { name, verificationLink }),
      text: this.renderTemplate(template.text, { name, verificationLink })
    };

    try {
      await this.sendEmail(emailData);
      return { success: true, message: 'Verification email sent' };
    } catch (error) {
      throw new Error('Failed to send verification email');
    }
  }

  // Verify email token
  verifyEmailToken(token) {
    const verification = this.verifications.get(token);
    if (!verification) {
      return { valid: false, error: 'Invalid or expired token' };
    }

    // Check expiration
    if (Date.now() > verification.expiresAt) {
      this.verifications.delete(token);
      this.saveToLocalStorage('email_verifications', this.mapToObject(this.verifications));
      return { valid: false, error: 'Token has expired' };
    }

    // Check if already verified
    if (verification.verified) {
      return { valid: false, error: 'Email already verified' };
    }

    // Mark as verified
    verification.verified = true;
    verification.verifiedAt = Date.now();
    
    this.verifications.set(token, verification);
    this.saveToLocalStorage('email_verifications', this.mapToObject(this.verifications));

    // Send confirmation email
    this.sendConfirmationEmail(verification.email, verification.name, verification.userId);

    return { 
      valid: true, 
      userId: verification.userId,
      email: verification.email,
      message: 'Email verified successfully'
    };
  }

  // Send confirmation email
  async sendConfirmationEmail(email, name, userId) {
    const loginLink = `${window.location.origin}/login`;
    const template = this.emailTemplates.get('account_confirmation');
    
    const emailData = {
      to: email,
      subject: template.subject,
      html: this.renderTemplate(template.html, { name, loginLink }),
      text: this.renderTemplate(template.text, { name, loginLink })
    };

    try {
      await this.sendEmail(emailData);
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(email, name, userId) {
    // Check rate limiting
    if (!this.checkRateLimit(email)) {
      throw new Error('Too many reset requests. Please try again later.');
    }

    // Generate reset token
    const token = this.generateVerificationToken();
    const resetData = {
      userId,
      email,
      name,
      token,
      type: 'password_reset',
      createdAt: Date.now(),
      expiresAt: Date.now() + (60 * 60 * 1000), // 1 hour
      attempts: 0,
      used: false
    };

    this.verifications.set(token, resetData);
    this.saveToLocalStorage('email_verifications', this.mapToObject(this.verifications));

    // Send email
    const resetLink = `${window.location.origin}/reset-password?token=${token}`;
    const template = this.emailTemplates.get('password_reset');
    
    const emailData = {
      to: email,
      subject: template.subject,
      html: this.renderTemplate(template.html, { name, resetLink }),
      text: this.renderTemplate(template.text, { name, resetLink })
    };

    try {
      await this.sendEmail(emailData);
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      throw new Error('Failed to send password reset email');
    }
  }

  // Verify password reset token
  verifyPasswordResetToken(token) {
    const verification = this.verifications.get(token);
    if (!verification) {
      return { valid: false, error: 'Invalid or expired token' };
    }

    // Check expiration
    if (Date.now() > verification.expiresAt) {
      this.verifications.delete(token);
      this.saveToLocalStorage('email_verifications', this.mapToObject(this.verifications));
      return { valid: false, error: 'Token has expired' };
    }

    // Check if already used
    if (verification.used) {
      return { valid: false, error: 'Token has already been used' };
    }

    return { 
      valid: true, 
      userId: verification.userId,
      email: verification.email
    };
  }

  // Mark password reset token as used
  markPasswordResetTokenAsUsed(token) {
    const verification = this.verifications.get(token);
    if (verification) {
      verification.used = true;
      verification.usedAt = Date.now();
      
      this.verifications.set(token, verification);
      this.saveToLocalStorage('email_verifications', this.mapToObject(this.verifications));
    }
  }

  // Resend verification email
  async resendVerificationEmail(email) {
    // Find existing verification
    let existingVerification = null;
    for (const [token, verification] of this.verifications.entries()) {
      if (verification.email === email && verification.type === 'verification' && !verification.verified) {
        existingVerification = { token, verification };
        break;
      }
    }

    if (!existingVerification) {
      throw new Error('No pending verification found for this email');
    }

    // Check rate limiting
    if (!this.checkRateLimit(email)) {
      throw new Error('Too many verification requests. Please try again later.');
    }

    // Update verification
    existingVerification.verification.token = this.generateVerificationToken();
    existingVerification.verification.createdAt = Date.now();
    existingVerification.verification.expiresAt = Date.now() + (24 * 60 * 60 * 1000);
    existingVerification.verification.attempts++;

    this.verifications.set(existingVerification.token, existingVerification.verification);
    this.saveToLocalStorage('email_verifications', this.mapToObject(this.verifications));

    // Send email
    const verificationLink = `${window.location.origin}/verify-email?token=${existingVerification.token}`;
    const template = this.emailTemplates.get('verification');
    
    const emailData = {
      to: email,
      subject: template.subject,
      html: this.renderTemplate(template.html, { 
        name: existingVerification.verification.name, 
        verificationLink 
      }),
      text: this.renderTemplate(template.text, { 
        name: existingVerification.verification.name, 
        verificationLink 
      })
    };

    try {
      await this.sendEmail(emailData);
      return { success: true, message: 'Verification email resent' };
    } catch (error) {
      throw new Error('Failed to resend verification email');
    }
  }

  // Send email (mock implementation)
  async sendEmail(emailData) {
    console.log('📧 Sending email:', {
      to: emailData.to,
      subject: emailData.subject
    });

    // In production, this would use actual SMTP service
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate email sending
        if (Math.random() > 0.1) { // 90% success rate
          resolve({ messageId: this.generateId(), status: 'sent' });
        } else {
          reject(new Error('SMTP server error'));
        }
      }, 2000);
    });
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
  checkRateLimit(email) {
    const now = Date.now();
    const rateLimit = this.rateLimits.get(email);
    
    if (!rateLimit) {
      this.rateLimits.set(email, {
        count: 1,
        firstRequest: now,
        lastRequest: now
      });
      return true;
    }

    // Reset if more than 1 hour has passed
    if (now - rateLimit.firstRequest > 60 * 60 * 1000) {
      this.rateLimits.set(email, {
        count: 1,
        firstRequest: now,
        lastRequest: now
      });
      return true;
    }

    // Check if exceeding limit (max 5 emails per hour)
    if (rateLimit.count >= 5) {
      return false;
    }

    // Increment count
    rateLimit.count++;
    rateLimit.lastRequest = now;
    this.rateLimits.set(email, rateLimit);
    
    return true;
  }

  // Check if email is blacklisted
  isBlacklisted(email) {
    const blacklistEntry = this.blacklist.get(email);
    if (!blacklistEntry) return false;

    // Check if blacklist has expired
    if (Date.now() > blacklistEntry.expiresAt) {
      this.blacklist.delete(email);
      this.saveToLocalStorage('email_blacklist', this.mapToObject(this.blacklist));
      return false;
    }

    return true;
  }

  // Add email to blacklist
  addToBlacklist(email, reason = 'Spam complaints') {
    this.blacklist.set(email, {
      email,
      reason,
      addedAt: Date.now(),
      expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year
    });
    
    this.saveToLocalStorage('email_blacklist', this.mapToObject(this.blacklist));
  }

  // Remove email from blacklist
  removeFromBlacklist(email) {
    this.blacklist.delete(email);
    this.saveToLocalStorage('email_blacklist', this.mapToObject(this.blacklist));
  }

  // Get verification status
  getVerificationStatus(email) {
    for (const [token, verification] of this.verifications.entries()) {
      if (verification.email === email && verification.type === 'verification') {
        return {
          verified: verification.verified,
          verifiedAt: verification.verifiedAt,
          createdAt: verification.createdAt,
          expiresAt: verification.expiresAt
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
      this.saveToLocalStorage('email_verifications', this.mapToObject(this.verifications));
    }
    
    return expiredTokens.length;
  }

  // Get email statistics
  getEmailStatistics() {
    const verifications = Array.from(this.verifications.values());
    const now = Date.now();
    
    return {
      totalVerifications: verifications.length,
      verifiedEmails: verifications.filter(v => v.verified).length,
      pendingVerifications: verifications.filter(v => !v.verified && v.expiresAt > now).length,
      expiredVerifications: verifications.filter(v => v.expiresAt <= now).length,
      verificationRate: verifications.length > 0 ? 
        (verifications.filter(v => v.verified).length / verifications.length) * 100 : 0,
      blacklistedEmails: this.blacklist.size,
      rateLimitedEmails: this.rateLimits.size,
      verificationsByType: this.getVerificationsByType(verifications),
      verificationsByDay: this.getVerificationsByDay(verifications)
    };
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

  // Generate verification token
  generateVerificationToken() {
    return this.generateId() + this.generateId();
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

module.exports = EmailVerificationService;
