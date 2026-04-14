// Two-Factor Authentication System for Ethiopian Electronics Marketplace
class TwoFactorAuthService {
  constructor() {
    this.totpSecrets = new Map();
    this.backupCodes = new Map();
    this.sessions = new Map();
    this.attempts = new Map();
    this.trustedDevices = new Map();
    this.qrCodes = new Map();
    
    this.initializeFromStorage();
  }

  // Initialize from local storage
  initializeFromStorage() {
    const totpSecrets = this.loadFromLocalStorage('totp_secrets');
    const backupCodes = this.loadFromLocalStorage('backup_codes');
    const trustedDevices = this.loadFromLocalStorage('trusted_devices');
    
    if (totpSecrets) this.totpSecrets = new Map(Object.entries(totpSecrets));
    if (backupCodes) this.backupCodes = new Map(Object.entries(backupCodes));
    if (trustedDevices) this.trustedDevices = new Map(Object.entries(trustedDevices));
  }

  // Generate TOTP secret for user
  generateTOTPSecret(userId) {
    const secret = this.generateSecret();
    const totpData = {
      userId,
      secret,
      qrCode: this.generateQRCode(userId, secret),
      backupCodes: this.generateBackupCodes(),
      createdAt: Date.now(),
      verified: false,
      enabled: false
    };

    this.totpSecrets.set(userId, totpData);
    this.backupCodes.set(userId, totpData.backupCodes);
    
    this.saveToLocalStorage('totp_secrets', this.mapToObject(this.totpSecrets));
    this.saveToLocalStorage('backup_codes', this.mapToObject(this.backupCodes));

    return {
      secret,
      qrCode: totpData.qrCode,
      backupCodes: totpData.backupCodes
    };
  }

  // Generate secret key
  generateSecret() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  }

  // Generate QR code for TOTP
  generateQRCode(userId, secret) {
    const issuer = 'Ethiopian Electronics Marketplace';
    const account = `user_${userId}`;
    const otpauth = `otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}&digits=6&period=30`;
    
    // In production, this would generate actual QR code image
    return {
      data: otpauth,
      imageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth)}`
    };
  }

  // Generate backup codes
  generateBackupCodes() {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(this.generateBackupCode());
    }
    return codes;
  }

  // Generate single backup code
  generateBackupCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      if (i === 4) code += '-';
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Verify TOTP token
  verifyTOTPToken(userId, token) {
    const totpData = this.totpSecrets.get(userId);
    if (!totpData) {
      return { valid: false, error: 'TOTP not set up for user' };
    }

    // Check rate limiting
    const attempts = this.attempts.get(userId) || { count: 0, lastAttempt: 0 };
    const now = Date.now();
    
    if (now - attempts.lastAttempt < 30000 && attempts.count >= 3) {
      return { valid: false, error: 'Too many attempts. Please try again later.' };
    }

    // Verify token
    const isValid = this.verifyTOTP(token, totpData.secret);
    
    if (isValid) {
      // Reset attempts on success
      this.attempts.delete(userId);
      return { valid: true };
    } else {
      // Increment attempts on failure
      attempts.count++;
      attempts.lastAttempt = now;
      this.attempts.set(userId, attempts);
      
      return { 
        valid: false, 
        error: 'Invalid token',
        attemptsRemaining: Math.max(0, 3 - attempts.count)
      };
    }
  }

  // Verify TOTP using time-based algorithm
  verifyTOTP(token, secret) {
    const timeStep = 30; // 30 seconds
    const now = Math.floor(Date.now() / 1000);
    const counter = Math.floor(now / timeStep);
    
    // Check current and adjacent time steps (allow 1 step tolerance)
    for (let offset = -1; offset <= 1; offset++) {
      const testCounter = counter + offset;
      const expectedToken = this.generateTOTP(secret, testCounter);
      
      if (token === expectedToken) {
        return true;
      }
    }
    
    return false;
  }

  // Generate TOTP for given counter
  generateTOTP(secret, counter) {
    // Simplified TOTP generation (in production, use proper crypto library)
    const hash = this.simpleHash(secret + counter);
    const offset = hash[hash.length - 1] & 0x0F;
    const code = (
      ((hash[offset] & 0x7F) << 24) |
      ((hash[offset + 1] & 0xFF) << 16) |
      ((hash[offset + 2] & 0xFF) << 8) |
      (hash[offset + 3] & 0xFF)
    ) % 1000000;
    
    return code.toString().padStart(6, '0');
  }

  // Simple hash function (in production, use proper crypto)
  simpleHash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const result = new Array(8);
    for (let i = 0; i < 8; i++) {
      result[i] = (hash >> (i * 8)) & 0xFF;
    }
    
    return result;
  }

  // Verify backup code
  verifyBackupCode(userId, code) {
    const backupCodes = this.backupCodes.get(userId);
    if (!backupCodes) {
      return { valid: false, error: 'No backup codes available' };
    }

    const codeIndex = backupCodes.indexOf(code);
    if (codeIndex === -1) {
      return { valid: false, error: 'Invalid backup code' };
    }

    // Remove used backup code
    backupCodes.splice(codeIndex, 1);
    this.backupCodes.set(userId, backupCodes);
    this.saveToLocalStorage('backup_codes', this.mapToObject(this.backupCodes));

    return { valid: true, remainingCodes: backupCodes.length };
  }

  // Enable 2FA for user
  enable2FA(userId, token) {
    const verification = this.verifyTOTPToken(userId, token);
    if (!verification.valid) {
      return verification;
    }

    const totpData = this.totpSecrets.get(userId);
    if (totpData) {
      totpData.verified = true;
      totpData.enabled = true;
      totpData.enabledAt = Date.now();
      
      this.totpSecrets.set(userId, totpData);
      this.saveToLocalStorage('totp_secrets', this.mapToObject(this.totpSecrets));
    }

    return { valid: true, message: '2FA enabled successfully' };
  }

  // Disable 2FA for user
  disable2FA(userId, token, password) {
    // Verify token first
    const verification = this.verifyTOTPToken(userId, token);
    if (!verification.valid) {
      return verification;
    }

    // In production, verify password here
    
    const totpData = this.totpSecrets.get(userId);
    if (totpData) {
      totpData.enabled = false;
      totpData.disabledAt = Date.now();
      
      this.totpSecrets.set(userId, totpData);
      this.saveToLocalStorage('totp_secrets', this.mapToObject(this.totpSecrets));
    }

    // Clear trusted devices
    this.trustedDevices.delete(userId);
    this.saveToLocalStorage('trusted_devices', this.mapToObject(this.trustedDevices));

    return { valid: true, message: '2FA disabled successfully' };
  }

  // Add trusted device
  addTrustedDevice(userId, deviceInfo) {
    if (!this.trustedDevices.has(userId)) {
      this.trustedDevices.set(userId, []);
    }

    const devices = this.trustedDevices.get(userId);
    const device = {
      id: this.generateId(),
      name: deviceInfo.name || 'Unknown Device',
      userAgent: deviceInfo.userAgent,
      ip: deviceInfo.ip,
      location: deviceInfo.location,
      addedAt: Date.now(),
      lastUsed: Date.now(),
      expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
    };

    devices.push(device);
    
    // Remove expired devices
    const now = Date.now();
    devices.filter(d => d.expiresAt > now);
    
    this.trustedDevices.set(userId, devices);
    this.saveToLocalStorage('trusted_devices', this.mapToObject(this.trustedDevices));

    return device;
  }

  // Check if device is trusted
  isTrustedDevice(userId, deviceInfo) {
    const devices = this.trustedDevices.get(userId);
    if (!devices) return false;

    const now = Date.now();
    return devices.some(device => 
      device.userAgent === deviceInfo.userAgent &&
      device.ip === deviceInfo.ip &&
      device.expiresAt > now
    );
  }

  // Require 2FA for session
  require2FA(userId, sessionId, deviceInfo) {
    const totpData = this.totpSecrets.get(userId);
    if (!totpData || !totpData.enabled) {
      return false; // 2FA not enabled
    }

    // Check if device is trusted
    if (this.isTrustedDevice(userId, deviceInfo)) {
      return false; // Trusted device, no 2FA needed
    }

    // Mark session as requiring 2FA
    this.sessions.set(sessionId, {
      userId,
      requires2FA: true,
      createdAt: Date.now(),
      expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutes
    });

    return true;
  }

  // Verify 2FA for session
  verifySession2FA(sessionId, token) {
    const session = this.sessions.get(sessionId);
    if (!session || !session.requires2FA) {
      return { valid: false, error: 'Invalid session' };
    }

    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return { valid: false, error: 'Session expired' };
    }

    const verification = this.verifyTOTPToken(session.userId, token);
    if (!verification.valid) {
      return verification;
    }

    // Clear 2FA requirement
    session.requires2FA = false;
    session.verifiedAt = Date.now();
    
    return { valid: true, message: '2FA verified successfully' };
  }

  // Get user 2FA status
  getUser2FAStatus(userId) {
    const totpData = this.totpSecrets.get(userId);
    const devices = this.trustedDevices.get(userId) || [];
    const backupCodes = this.backupCodes.get(userId) || [];

    return {
      enabled: totpData ? totpData.enabled : false,
      verified: totpData ? totpData.verified : false,
      setupCompleted: totpData ? totpData.verified : false,
      trustedDevices: devices.filter(d => d.expiresAt > Date.now()),
      backupCodesRemaining: backupCodes.length,
      canSetup: !totpData || !totpData.verified
    };
  }

  // Get backup codes for user
  getBackupCodes(userId) {
    const backupCodes = this.backupCodes.get(userId);
    if (!backupCodes) {
      return [];
    }

    return [...backupCodes]; // Return copy
  }

  // Regenerate backup codes
  regenerateBackupCodes(userId, token) {
    const verification = this.verifyTOTPToken(userId, token);
    if (!verification.valid) {
      return verification;
    }

    const newBackupCodes = this.generateBackupCodes();
    this.backupCodes.set(userId, newBackupCodes);
    this.saveToLocalStorage('backup_codes', this.mapToObject(this.backupCodes));

    return { valid: true, backupCodes: newBackupCodes };
  }

  // Remove trusted device
  removeTrustedDevice(userId, deviceId) {
    const devices = this.trustedDevices.get(userId);
    if (!devices) return false;

    const index = devices.findIndex(d => d.id === deviceId);
    if (index === -1) return false;

    devices.splice(index, 1);
    this.trustedDevices.set(userId, devices);
    this.saveToLocalStorage('trusted_devices', this.mapToObject(this.trustedDevices));

    return true;
  }

  // Get 2FA statistics
  get2FAStatistics() {
    const users = Array.from(this.totpSecrets.values());
    const devices = Array.from(this.trustedDevices.values()).flat();
    
    return {
      totalUsers: users.length,
      enabledUsers: users.filter(u => u.enabled).length,
      verifiedUsers: users.filter(u => u.verified).length,
      adoptionRate: users.length > 0 ? (users.filter(u => u.enabled).length / users.length) * 100 : 0,
      totalTrustedDevices: devices.length,
      activeTrustedDevices: devices.filter(d => d.expiresAt > Date.now()).length,
      averageDevicesPerUser: users.length > 0 ? devices.length / users.length : 0
    };
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

module.exports = TwoFactorAuthService;
