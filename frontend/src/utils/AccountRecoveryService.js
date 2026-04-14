// Account Recovery System for Ethiopian Electronics Marketplace
class AccountRecoveryService {
  constructor() {
    this.recoveryRequests = new Map();
    this.recoveryMethods = new Map();
    this.securityQuestions = new Map();
    this.recoveryTokens = new Map();
    this.attempts = new Map();
    this.auditLogs = new Map();
    
    this.initializeSecurityQuestions();
    this.initializeRecoveryMethods();
    this.initializeFromStorage();
  }

  // Initialize security questions
  initializeSecurityQuestions() {
    const questions = [
      {
        id: 'pet_name',
        question: 'What was the name of your first pet?',
        category: 'personal',
        difficulty: 'easy'
      },
      {
        id: 'birth_city',
        question: 'In what city were you born?',
        category: 'personal',
        difficulty: 'easy'
      },
      {
        id: 'mother_maiden',
        question: 'What is your mother\'s maiden name?',
        category: 'family',
        difficulty: 'medium'
      },
      {
        id: 'first_school',
        question: 'What was the name of your first school?',
        category: 'education',
        difficulty: 'medium'
      },
      {
        id: 'childhood_friend',
        question: 'What is the name of your childhood best friend?',
        category: 'personal',
        difficulty: 'medium'
      },
      {
        id: 'first_job',
        question: 'What was your first job?',
        category: 'professional',
        difficulty: 'hard'
      },
      {
        id: 'favorite_teacher',
        question: 'Who was your favorite teacher in school?',
        category: 'education',
        difficulty: 'hard'
      },
      {
        id: 'childhood_street',
        question: 'What was the name of the street you grew up on?',
        category: 'personal',
        difficulty: 'hard'
      },
      {
        id: 'first_car',
        question: 'What was the make and model of your first car?',
        category: 'personal',
        difficulty: 'medium'
      },
      {
        id: 'grandmother_name',
        question: 'What is your grandmother\'s first name?',
        category: 'family',
        difficulty: 'medium'
      }
    ];

    questions.forEach(question => {
      this.securityQuestions.set(question.id, question);
    });
  }

  // Initialize recovery methods
  initializeRecoveryMethods() {
    const methods = {
      'email': {
        id: 'email',
        name: 'Email Recovery',
        description: 'Receive recovery link via email',
        enabled: true,
        priority: 1,
        verificationRequired: true,
        steps: ['verify_email', 'send_link', 'reset_password']
      },
      'phone': {
        id: 'phone',
        name: 'Phone Recovery',
        description: 'Receive verification code via SMS',
        enabled: true,
        priority: 2,
        verificationRequired: true,
        steps: ['verify_phone', 'send_code', 'reset_password']
      },
      'security_questions': {
        id: 'security_questions',
        name: 'Security Questions',
        description: 'Answer security questions to verify identity',
        enabled: true,
        priority: 3,
        verificationRequired: false,
        steps: ['answer_questions', 'reset_password']
      },
      'trusted_device': {
        id: 'trusted_device',
        name: 'Trusted Device',
        description: 'Use a trusted device to reset password',
        enabled: true,
        priority: 4,
        verificationRequired: false,
        steps: ['verify_device', 'reset_password']
      },
      'identity_document': {
        id: 'identity_document',
        name: 'Identity Document',
        description: 'Upload ID document for verification',
        enabled: true,
        priority: 5,
        verificationRequired: true,
        steps: ['upload_document', 'manual_review', 'reset_password']
      },
      'customer_support': {
        id: 'customer_support',
        name: 'Customer Support',
        description: 'Contact customer support for assistance',
        enabled: true,
        priority: 6,
        verificationRequired: false,
        steps: ['contact_support', 'verify_identity', 'reset_password']
      }
    };

    methods.forEach((method, key) => {
      this.recoveryMethods.set(key, method);
    });
  }

  // Initialize from local storage
  initializeFromStorage() {
    const recoveryRequests = this.loadFromLocalStorage('recovery_requests');
    const recoveryTokens = this.loadFromLocalStorage('recovery_tokens');
    const attempts = this.loadFromLocalStorage('recovery_attempts');
    const auditLogs = this.loadFromLocalStorage('recovery_audit_logs');
    
    if (recoveryRequests) this.recoveryRequests = new Map(Object.entries(recoveryRequests));
    if (recoveryTokens) this.recoveryTokens = new Map(Object.entries(recoveryTokens));
    if (attempts) this.attempts = new Map(Object.entries(attempts));
    if (auditLogs) this.auditLogs = new Map(Object.entries(auditLogs));
  }

  // Start account recovery
  async startAccountRecovery(userId, identifier, method) {
    // Check rate limiting
    if (!this.checkRateLimit(userId)) {
      throw new Error('Too many recovery attempts. Please try again later.');
    }

    // Validate recovery method
    const recoveryMethod = this.recoveryMethods.get(method);
    if (!recoveryMethod || !recoveryMethod.enabled) {
      throw new Error('Invalid recovery method');
    }

    // Create recovery request
    const requestId = this.generateId();
    const recoveryRequest = {
      id: requestId,
      userId,
      identifier, // email or phone
      method,
      status: 'initiated',
      createdAt: Date.now(),
      expiresAt: Date.now() + (60 * 60 * 1000), // 1 hour
      steps: recoveryMethod.steps,
      currentStep: 0,
      completedSteps: [],
      data: {},
      metadata: {
        userAgent: navigator.userAgent,
        ip: this.getClientIP(),
        location: this.getClientLocation()
      }
    };

    this.recoveryRequests.set(requestId, recoveryRequest);
    this.saveToLocalStorage('recovery_requests', this.mapToObject(this.recoveryRequests));

    // Log audit
    this.logAuditEvent('recovery_started', {
      requestId,
      userId,
      method,
      identifier,
      metadata: recoveryRequest.metadata
    });

    // Execute first step
    await this.executeRecoveryStep(requestId);

    return {
      requestId,
      method: recoveryMethod.name,
      currentStep: recoveryRequest.currentStep,
      nextStep: recoveryRequest.steps[recoveryRequest.currentStep]
    };
  }

  // Execute recovery step
  async executeRecoveryStep(requestId, stepData = {}) {
    const recoveryRequest = this.recoveryRequests.get(requestId);
    if (!recoveryRequest) {
      throw new Error('Invalid recovery request');
    }

    // Check expiration
    if (Date.now() > recoveryRequest.expiresAt) {
      recoveryRequest.status = 'expired';
      this.recoveryRequests.set(requestId, recoveryRequest);
      this.saveToLocalStorage('recovery_requests', this.mapToObject(this.recoveryRequests));
      throw new Error('Recovery request has expired');
    }

    const currentStepName = recoveryRequest.steps[recoveryRequest.currentStep];
    let stepResult;

    switch (currentStepName) {
      case 'verify_email':
        stepResult = await this.verifyEmailStep(requestId, stepData);
        break;
      case 'verify_phone':
        stepResult = await this.verifyPhoneStep(requestId, stepData);
        break;
      case 'send_link':
        stepResult = await this.sendRecoveryLinkStep(requestId);
        break;
      case 'send_code':
        stepResult = await this.sendRecoveryCodeStep(requestId);
        break;
      case 'answer_questions':
        stepResult = await this.answerSecurityQuestionsStep(requestId, stepData);
        break;
      case 'verify_device':
        stepResult = await this.verifyTrustedDeviceStep(requestId, stepData);
        break;
      case 'upload_document':
        stepResult = await this.uploadIdentityDocumentStep(requestId, stepData);
        break;
      case 'manual_review':
        stepResult = await this.manualReviewStep(requestId);
        break;
      case 'contact_support':
        stepResult = await this.contactSupportStep(requestId, stepData);
        break;
      case 'reset_password':
        stepResult = await this.resetPasswordStep(requestId, stepData);
        break;
      default:
        throw new Error('Unknown recovery step');
    }

    // Update recovery request
    if (stepResult.success) {
      recoveryRequest.completedSteps.push(currentStepName);
      recoveryRequest.data[currentStepName] = stepResult.data;
      
      // Move to next step
      if (recoveryRequest.currentStep < recoveryRequest.steps.length - 1) {
        recoveryRequest.currentStep++;
        
        // Execute next step automatically if it doesn't require user input
        const nextStepName = recoveryRequest.steps[recoveryRequest.currentStep];
        if (['send_link', 'send_code'].includes(nextStepName)) {
          await this.executeRecoveryStep(requestId);
        }
      } else {
        // Recovery completed
        recoveryRequest.status = 'completed';
        recoveryRequest.completedAt = Date.now();
        
        this.logAuditEvent('recovery_completed', {
          requestId,
          userId: recoveryRequest.userId,
          method: recoveryRequest.method
        });
      }
    }

    this.recoveryRequests.set(requestId, recoveryRequest);
    this.saveToLocalStorage('recovery_requests', this.mapToObject(this.recoveryRequests));

    return stepResult;
  }

  // Verify email step
  async verifyEmailStep(requestId, stepData) {
    const recoveryRequest = this.recoveryRequests.get(requestId);
    const { email } = stepData;

    if (!email) {
      return { success: false, error: 'Email is required' };
    }

    // Validate email format
    if (!this.isValidEmail(email)) {
      return { success: false, error: 'Invalid email format' };
    }

    // Check if email matches user account (mock validation)
    const userAccount = await this.getUserAccount(recoveryRequest.userId);
    if (!userAccount || userAccount.email !== email) {
      return { success: false, error: 'Email does not match account' };
    }

    return { 
      success: true, 
      data: { email },
      message: 'Email verified successfully'
    };
  }

  // Verify phone step
  async verifyPhoneStep(requestId, stepData) {
    const recoveryRequest = this.recoveryRequests.get(requestId);
    const { phone } = stepData;

    if (!phone) {
      return { success: false, error: 'Phone number is required' };
    }

    // Validate Ethiopian phone number
    const phoneService = require('./PhoneVerificationService');
    const phoneVerification = new phoneService();
    const validPhone = phoneVerification.validateEthiopianPhone(phone);

    if (!validPhone) {
      return { success: false, error: 'Invalid Ethiopian phone number' };
    }

    // Check if phone matches user account (mock validation)
    const userAccount = await this.getUserAccount(recoveryRequest.userId);
    if (!userAccount || userAccount.phone !== validPhone) {
      return { success: false, error: 'Phone number does not match account' };
    }

    return { 
      success: true, 
      data: { phone: validPhone },
      message: 'Phone number verified successfully'
    };
  }

  // Send recovery link step
  async sendRecoveryLinkStep(requestId) {
    const recoveryRequest = this.recoveryRequests.get(requestId);
    const email = recoveryRequest.data['verify_email']?.email;

    if (!email) {
      return { success: false, error: 'No verified email found' };
    }

    // Generate recovery token
    const token = this.generateRecoveryToken();
    const recoveryToken = {
      id: token,
      requestId,
      userId: recoveryRequest.userId,
      email,
      type: 'email_recovery',
      createdAt: Date.now(),
      expiresAt: Date.now() + (30 * 60 * 1000), // 30 minutes
      used: false
    };

    this.recoveryTokens.set(token, recoveryToken);
    this.saveToLocalStorage('recovery_tokens', this.mapToObject(this.recoveryTokens));

    // Send recovery email
    const emailService = require('./EmailVerificationService');
    const emailVerification = new emailService();
    
    try {
      await emailVerification.sendPasswordResetEmail(email, 'User', recoveryRequest.userId);
      
      return { 
        success: true, 
        data: { token, email },
        message: 'Recovery link sent to your email'
      };
    } catch (error) {
      return { success: false, error: 'Failed to send recovery email' };
    }
  }

  // Send recovery code step
  async sendRecoveryCodeStep(requestId) {
    const recoveryRequest = this.recoveryRequests.get(requestId);
    const phone = recoveryRequest.data['verify_phone']?.phone;

    if (!phone) {
      return { success: false, error: 'No verified phone found' };
    }

    // Generate recovery token
    const token = this.generateRecoveryToken();
    const recoveryToken = {
      id: token,
      requestId,
      userId: recoveryRequest.userId,
      phone,
      type: 'phone_recovery',
      createdAt: Date.now(),
      expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutes
      used: false
    };

    this.recoveryTokens.set(token, recoveryToken);
    this.saveToLocalStorage('recovery_tokens', this.mapToObject(this.recoveryTokens));

    // Send recovery SMS
    const phoneService = require('./PhoneVerificationService');
    const phoneVerification = new phoneService();
    
    try {
      const result = await phoneVerification.sendPasswordResetSMS(phone, recoveryRequest.userId);
      
      return { 
        success: true, 
        data: { token, phone },
        message: 'Recovery code sent to your phone'
      };
    } catch (error) {
      return { success: false, error: 'Failed to send recovery code' };
    }
  }

  // Answer security questions step
  async answerSecurityQuestionsStep(requestId, stepData) {
    const recoveryRequest = this.recoveryRequests.get(requestId);
    const { answers } = stepData;

    if (!answers || Object.keys(answers).length < 3) {
      return { success: false, error: 'At least 3 security questions must be answered' };
    }

    // Get user's security questions (mock data)
    const userQuestions = await this.getUserSecurityQuestions(recoveryRequest.userId);
    let correctAnswers = 0;
    const totalQuestions = Object.keys(answers).length;

    for (const [questionId, answer] of Object.entries(answers)) {
      const userAnswer = userQuestions[questionId];
      if (userAnswer && this.compareAnswers(answer, userAnswer.answer)) {
        correctAnswers++;
      }
    }

    // Require at least 80% correct answers
    const accuracy = (correctAnswers / totalQuestions) * 100;
    if (accuracy < 80) {
      return { 
        success: false, 
        error: `Incorrect answers. You answered ${correctAnswers} out of ${totalQuestions} questions correctly.` 
      };
    }

    return { 
      success: true, 
      data: { answers, accuracy },
      message: 'Security questions verified successfully'
    };
  }

  // Verify trusted device step
  async verifyTrustedDeviceStep(requestId, stepData) {
    const recoveryRequest = this.recoveryRequests.get(requestId);
    const { deviceId, verificationCode } = stepData;

    if (!deviceId) {
      return { success: false, error: 'Device ID is required' };
    }

    // Get user's trusted devices (mock data)
    const trustedDevices = await this.getUserTrustedDevices(recoveryRequest.userId);
    const device = trustedDevices.find(d => d.id === deviceId);

    if (!device) {
      return { success: false, error: 'Device not found in trusted devices' };
    }

    // Check if device is still valid
    if (Date.now() > device.expiresAt) {
      return { success: false, error: 'Trusted device has expired' };
    }

    // Generate verification code for the device
    const code = this.generateVerificationCode();
    device.verificationCode = code;
    device.verificationExpiresAt = Date.now() + (5 * 60 * 1000); // 5 minutes

    // In production, this would send the code to the device
    console.log(`Device verification code: ${code}`);

    if (!verificationCode) {
      return { 
        success: true, 
        data: { deviceId, codeSent: true },
        message: 'Verification code sent to trusted device'
      };
    }

    if (verificationCode !== code) {
      return { success: false, error: 'Invalid verification code' };
    }

    return { 
      success: true, 
      data: { deviceId },
      message: 'Trusted device verified successfully'
    };
  }

  // Upload identity document step
  async uploadIdentityDocumentStep(requestId, stepData) {
    const recoveryRequest = this.recoveryRequests.get(requestId);
    const { documentType, frontImage, backImage, selfieImage } = stepData;

    if (!documentType || !frontImage || !selfieImage) {
      return { success: false, error: 'Document type, front image, and selfie are required' };
    }

    // Validate document type
    const validTypes = ['national_id', 'passport', 'driver_license'];
    if (!validTypes.includes(documentType)) {
      return { success: false, error: 'Invalid document type' };
    }

    // Store document data for manual review
    const documentData = {
      type: documentType,
      frontImage,
      backImage,
      selfieImage,
      uploadedAt: Date.now(),
      status: 'pending_review',
      requestId
    };

    recoveryRequest.data['upload_document'] = documentData;

    return { 
      success: true, 
      data: documentData,
      message: 'Identity document uploaded successfully. Pending manual review.'
    };
  }

  // Manual review step
  async manualReviewStep(requestId) {
    const recoveryRequest = this.recoveryRequests.get(requestId);
    const documentData = recoveryRequest.data['upload_document'];

    if (!documentData) {
      return { success: false, error: 'No document found for review' };
    }

    // In production, this would trigger actual manual review
    // For now, simulate review process
    setTimeout(() => {
      // Simulate approval after 5 minutes
      documentData.status = 'approved';
      documentData.reviewedAt = Date.now();
      documentData.reviewedBy = 'support_agent_001';
      
      this.recoveryRequests.set(requestId, recoveryRequest);
      this.saveToLocalStorage('recovery_requests', this.mapToObject(this.recoveryRequests));
    }, 5 * 60 * 1000);

    return { 
      success: true, 
      data: { status: 'pending_review' },
      message: 'Document submitted for manual review. You will be notified within 24 hours.'
    };
  }

  // Contact support step
  async contactSupportStep(requestId, stepData) {
    const recoveryRequest = this.recoveryRequests.get(requestId);
    const { issue, contactMethod, contactInfo } = stepData;

    if (!issue || !contactMethod || !contactInfo) {
      return { success: false, error: 'Issue, contact method, and contact info are required' };
    }

    // Create support ticket
    const ticket = {
      id: this.generateId(),
      userId: recoveryRequest.userId,
      requestId,
      issue,
      contactMethod,
      contactInfo,
      status: 'open',
      createdAt: Date.now(),
      priority: 'high'
    };

    // In production, this would create actual support ticket
    console.log('Support ticket created:', ticket);

    return { 
      success: true, 
      data: { ticketId: ticket.id },
      message: 'Support ticket created. Our team will contact you within 24 hours.'
    };
  }

  // Reset password step
  async resetPasswordStep(requestId, stepData) {
    const recoveryRequest = this.recoveryRequests.get(requestId);
    const { newPassword, confirmPassword } = stepData;

    if (!newPassword || !confirmPassword) {
      return { success: false, error: 'Both password fields are required' };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: 'Passwords do not match' };
    }

    // Validate password strength
    if (!this.validatePasswordStrength(newPassword)) {
      return { success: false, error: 'Password does not meet security requirements' };
    }

    // Update user password (mock implementation)
    try {
      await this.updateUserPassword(recoveryRequest.userId, newPassword);
      
      // Log successful password reset
      this.logAuditEvent('password_reset', {
        requestId,
        userId: recoveryRequest.userId,
        method: recoveryRequest.method,
        timestamp: Date.now()
      });

      // Clear recovery request
      this.recoveryRequests.delete(requestId);
      this.saveToLocalStorage('recovery_requests', this.mapToObject(this.recoveryRequests));

      return { 
        success: true, 
        message: 'Password reset successfully'
      };
    } catch (error) {
      return { success: false, error: 'Failed to reset password' };
    }
  }

  // Get available recovery methods for user
  async getAvailableRecoveryMethods(userId) {
    const userAccount = await this.getUserAccount(userId);
    const availableMethods = [];

    for (const [methodId, method] of this.recoveryMethods.entries()) {
      if (!method.enabled) continue;

      let isAvailable = false;
      let reason = '';

      switch (methodId) {
        case 'email':
          isAvailable = userAccount && userAccount.email;
          reason = isAvailable ? '' : 'No email address on file';
          break;
        case 'phone':
          isAvailable = userAccount && userAccount.phone;
          reason = isAvailable ? '' : 'No phone number on file';
          break;
        case 'security_questions':
          const questions = await this.getUserSecurityQuestions(userId);
          isAvailable = questions && Object.keys(questions).length >= 3;
          reason = isAvailable ? '' : 'Insufficient security questions';
          break;
        case 'trusted_device':
          const devices = await this.getUserTrustedDevices(userId);
          isAvailable = devices && devices.length > 0;
          reason = isAvailable ? '' : 'No trusted devices';
          break;
        case 'identity_document':
          isAvailable = true; // Always available
          break;
        case 'customer_support':
          isAvailable = true; // Always available
          break;
      }

      availableMethods.push({
        ...method,
        available: isAvailable,
        reason
      });
    }

    return availableMethods.sort((a, b) => a.priority - b.priority);
  }

  // Check rate limiting
  checkRateLimit(userId) {
    const now = Date.now();
    const attempts = this.attempts.get(userId);
    
    if (!attempts) {
      this.attempts.set(userId, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now
      });
      return true;
    }

    // Reset if more than 24 hours has passed
    if (now - attempts.firstAttempt > 24 * 60 * 60 * 1000) {
      this.attempts.set(userId, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now
      });
      return true;
    }

    // Check if exceeding limit (max 3 attempts per 24 hours)
    if (attempts.count >= 3) {
      return false;
    }

    // Increment count
    attempts.count++;
    attempts.lastAttempt = now;
    this.attempts.set(userId, attempts);
    
    return true;
  }

  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  validatePasswordStrength(password) {
    // Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number, 1 special character
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  // Compare answers with tolerance for common variations
  compareErrors(answer1, answer2) {
    if (!answer1 || !answer2) return false;
    
    // Normalize answers (remove spaces, convert to lowercase)
    const normalized1 = answer1.replace(/\s/g, '').toLowerCase();
    const normalized2 = answer2.replace(/\s/g, '').toLowerCase();
    
    return normalized1 === normalized2;
  }

  // Generate verification code
  generateVerificationCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Generate recovery token
  generateRecoveryToken() {
    return this.generateId() + this.generateId();
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Get client IP (mock implementation)
  getClientIP() {
    return '192.168.1.1'; // In production, get actual IP
  }

  // Get client location (mock implementation)
  getClientLocation() {
    return {
      country: 'ET',
      city: 'Addis Ababa',
      latitude: 9.1450,
      longitude: 40.4897
    };
  }

  // Log audit event
  logAuditEvent(eventType, data) {
    const auditLog = {
      id: this.generateId(),
      eventType,
      data,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      ip: this.getClientIP(),
      location: this.getClientLocation()
    };

    this.auditLogs.set(auditLog.id, auditLog);
    this.saveToLocalStorage('recovery_audit_logs', this.mapToObject(this.auditLogs));
  }

  // Mock methods (would integrate with actual services)
  async getUserAccount(userId) {
    // Mock user data
    return {
      id: userId,
      email: 'user@example.com',
      phone: '0912345678'
    };
  }

  async getUserSecurityQuestions(userId) {
    // Mock security questions
    return {
      'pet_name': { answer: 'buddy' },
      'birth_city': { answer: 'addis ababa' },
      'mother_maiden': { answer: 'tesfaye' }
    };
  }

  async getUserTrustedDevices(userId) {
    // Mock trusted devices
    return [
      {
        id: 'device_001',
        name: 'iPhone 12',
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  async updateUserPassword(userId, newPassword) {
    // Mock password update
    console.log(`Password updated for user ${userId}`);
    return true;
  }

  // Get recovery statistics
  getRecoveryStatistics() {
    const requests = Array.from(this.recoveryRequests.values());
    const tokens = Array.from(this.recoveryTokens.values());
    const auditLogs = Array.from(this.auditLogs.values());
    
    return {
      totalRequests: requests.length,
      completedRequests: requests.filter(r => r.status === 'completed').length,
      expiredRequests: requests.filter(r => r.status === 'expired').length,
      requestsByMethod: this.getRequestsByMethod(requests),
      requestsByDay: this.getRequestsByDay(requests),
      totalTokens: tokens.length,
      usedTokens: tokens.filter(t => t.used).length,
      expiredTokens: tokens.filter(t => Date.now() > t.expiresAt).length,
      totalAuditLogs: auditLogs.length,
      auditLogsByType: this.getAuditLogsByType(auditLogs),
      averageCompletionTime: this.calculateAverageCompletionTime(requests)
    };
  }

  getRequestsByMethod(requests) {
    const methodCount = {};
    requests.forEach(request => {
      methodCount[request.method] = (methodCount[request.method] || 0) + 1;
    });
    return methodCount;
  }

  getRequestsByDay(requests) {
    const dayCount = {};
    requests.forEach(request => {
      const day = new Date(request.createdAt).toDateString();
      dayCount[day] = (dayCount[day] || 0) + 1;
    });
    return dayCount;
  }

  getAuditLogsByType(auditLogs) {
    const typeCount = {};
    auditLogs.forEach(log => {
      typeCount[log.eventType] = (typeCount[log.eventType] || 0) + 1;
    });
    return typeCount;
  }

  calculateAverageCompletionTime(requests) {
    const completedRequests = requests.filter(r => r.status === 'completed' && r.completedAt);
    if (completedRequests.length === 0) return 0;

    const totalTime = completedRequests.reduce((sum, request) => {
      return sum + (request.completedAt - request.createdAt);
    }, 0);

    return totalTime / completedRequests.length;
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

module.exports = AccountRecoveryService;
