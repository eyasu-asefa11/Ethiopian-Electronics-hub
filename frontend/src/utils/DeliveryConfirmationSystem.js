// Delivery Confirmation System for Ethiopian Electronics Marketplace
class DeliveryConfirmationSystem {
  constructor() {
    this.confirmations = new Map();
    this.signatures = new Map();
    this.photos = new Map();
    this.proofs = new Map();
    this.notifications = new Map();
    this.templates = new Map();
    
    this.initializeTemplates();
    this.initializeFromStorage();
  }

  // Initialize confirmation templates
  initializeTemplates() {
    const templates = {
      'standard_delivery': {
        id: 'standard_delivery',
        name: 'Standard Delivery Confirmation',
        fields: [
          { id: 'customer_name', label: 'Customer Name', type: 'text', required: true },
          { id: 'customer_phone', label: 'Customer Phone', type: 'text', required: true },
          { id: 'delivery_address', label: 'Delivery Address', type: 'text', required: true },
          { id: 'package_condition', label: 'Package Condition', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Damaged'], required: true },
          { id: 'delivery_notes', label: 'Delivery Notes', type: 'textarea', required: false },
          { id: 'customer_signature', label: 'Customer Signature', type: 'signature', required: true },
          { id: 'delivery_photo', label: 'Delivery Photo', type: 'photo', required: false }
        ],
        autoGenerate: ['delivery_time', 'delivery_date', 'tracking_number'],
        notifications: ['email', 'sms', 'push']
      },
      'express_delivery': {
        id: 'express_delivery',
        name: 'Express Delivery Confirmation',
        fields: [
          { id: 'customer_name', label: 'Customer Name', type: 'text', required: true },
          { id: 'customer_phone', label: 'Customer Phone', type: 'text', required: true },
          { id: 'delivery_address', label: 'Delivery Address', type: 'text', required: true },
          { id: 'package_condition', label: 'Package Condition', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Damaged'], required: true },
          { id: 'delivery_notes', label: 'Delivery Notes', type: 'textarea', required: false },
          { id: 'customer_signature', label: 'Customer Signature', type: 'signature', required: true },
          { id: 'delivery_photo', label: 'Delivery Photo', type: 'photo', required: true },
          { id: 'id_verification', label: 'ID Verification', type: 'photo', required: false }
        ],
        autoGenerate: ['delivery_time', 'delivery_date', 'tracking_number', 'delivery_agent'],
        notifications: ['email', 'sms', 'push', 'whatsapp']
      },
      'same_day_delivery': {
        id: 'same_day_delivery',
        name: 'Same Day Delivery Confirmation',
        fields: [
          { id: 'customer_name', label: 'Customer Name', type: 'text', required: true },
          { id: 'customer_phone', label: 'Customer Phone', type: 'text', required: true },
          { id: 'delivery_address', label: 'Delivery Address', type: 'text', required: true },
          { id: 'package_condition', label: 'Package Condition', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Damaged'], required: true },
          { id: 'delivery_notes', label: 'Delivery Notes', type: 'textarea', required: false },
          { id: 'customer_signature', label: 'Customer Signature', type: 'signature', required: true },
          { id: 'delivery_photo', label: 'Delivery Photo', type: 'photo', required: true },
          { id: 'id_verification', label: 'ID Verification', type: 'photo', required: true },
          { id: 'time_stamp', label: 'Time Stamp', type: 'timestamp', required: true }
        ],
        autoGenerate: ['delivery_time', 'delivery_date', 'tracking_number', 'delivery_agent', 'route_id'],
        notifications: ['email', 'sms', 'push', 'whatsapp', 'instant']
      },
      'pickup_confirmation': {
        id: 'pickup_confirmation',
        name: 'Pickup Confirmation',
        fields: [
          { id: 'sender_name', label: 'Sender Name', type: 'text', required: true },
          { id: 'sender_phone', label: 'Sender Phone', type: 'text', required: true },
          { id: 'pickup_address', label: 'Pickup Address', type: 'text', required: true },
          { id: 'package_condition', label: 'Package Condition', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Damaged'], required: true },
          { id: 'pickup_notes', label: 'Pickup Notes', type: 'textarea', required: false },
          { id: 'sender_signature', label: 'Sender Signature', type: 'signature', required: true },
          { id: 'pickup_photo', label: 'Pickup Photo', type: 'photo', required: true }
        ],
        autoGenerate: ['pickup_time', 'pickup_date', 'tracking_number', 'pickup_agent'],
        notifications: ['email', 'sms']
      },
      'return_confirmation': {
        id: 'return_confirmation',
        name: 'Return Confirmation',
        fields: [
          { id: 'customer_name', label: 'Customer Name', type: 'text', required: true },
          { id: 'customer_phone', label: 'Customer Phone', type: 'text', required: true },
          { id: 'return_address', label: 'Return Address', type: 'text', required: true },
          { id: 'return_reason', label: 'Return Reason', type: 'select', options: ['Defective', 'Wrong Item', 'Not as Described', 'Changed Mind', 'Other'], required: true },
          { id: 'package_condition', label: 'Package Condition', type: 'select', options: ['Excellent', 'Good', 'Fair', 'Damaged'], required: true },
          { id: 'return_notes', label: 'Return Notes', type: 'textarea', required: false },
          { id: 'customer_signature', label: 'Customer Signature', type: 'signature', required: true },
          { id: 'return_photo', label: 'Return Photo', type: 'photo', required: true }
        ],
        autoGenerate: ['return_time', 'return_date', 'return_id', 'return_agent'],
        notifications: ['email', 'sms', 'push']
      }
    };

    templates.forEach((template, key) => {
      this.templates.set(key, template);
    });
  }

  // Initialize from local storage
  initializeFromStorage() {
    const confirmations = this.loadFromLocalStorage('delivery_confirmations');
    const signatures = this.loadFromLocalStorage('delivery_signatures');
    const photos = this.loadFromLocalStorage('delivery_photos');
    const proofs = this.loadFromLocalStorage('delivery_proofs');
    
    if (confirmations) this.confirmations = new Map(Object.entries(confirmations));
    if (signatures) this.signatures = new Map(Object.entries(signatures));
    if (photos) this.photos = new Map(Object.entries(photos));
    if (proofs) this.proofs = new Map(Object.entries(proofs));
  }

  // Create delivery confirmation
  async createConfirmation(confirmationData) {
    const {
      deliveryId,
      orderId,
      templateId,
      deliveryInfo,
      agentInfo,
      customerInfo,
      options = {}
    } = confirmationData;

    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error('Invalid confirmation template');
    }

    const confirmation = {
      id: this.generateId(),
      deliveryId,
      orderId,
      templateId,
      template,
      deliveryInfo,
      agentInfo,
      customerInfo,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      fields: {},
      signatures: {},
      photos: {},
      autoGenerated: {},
      notifications: [],
      location: {
        latitude: deliveryInfo.latitude,
        longitude: deliveryInfo.longitude,
        accuracy: deliveryInfo.accuracy || 10
      },
      device: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        timestamp: Date.now()
      },
      verification: {
        verified: false,
        verifiedAt: null,
        verifiedBy: null,
        verificationMethod: null
      }
    };

    // Initialize fields
    template.fields.forEach(field => {
      confirmation.fields[field.id] = {
        value: null,
        required: field.required,
        type: field.type,
        label: field.label,
        options: field.options || [],
        completed: false,
        timestamp: null
      };
    });

    // Generate auto fields
    template.autoGenerate.forEach(field => {
      confirmation.autoGenerated[field] = this.generateAutoField(field, confirmationData);
    });

    // Store confirmation
    this.confirmations.set(confirmation.id, confirmation);
    this.saveToLocalStorage('delivery_confirmations', this.mapToObject(this.confirmations));

    return confirmation;
  }

  // Update confirmation field
  async updateConfirmationField(confirmationId, fieldId, value, metadata = {}) {
    const confirmation = this.confirmations.get(confirmationId);
    if (!confirmation) {
      throw new Error('Confirmation not found');
    }

    const field = confirmation.fields[fieldId];
    if (!field) {
      throw new Error('Field not found');
    }

    // Update field value
    field.value = value;
    field.completed = true;
    field.timestamp = Date.now();
    field.metadata = metadata;

    // Handle special field types
    if (field.type === 'signature') {
      await this.handleSignatureField(confirmationId, fieldId, value);
    } else if (field.type === 'photo') {
      await this.handlePhotoField(confirmationId, fieldId, value);
    }

    // Update confirmation
    confirmation.updatedAt = Date.now();
    confirmation.status = this.calculateConfirmationStatus(confirmation);

    this.confirmations.set(confirmationId, confirmation);
    this.saveToLocalStorage('delivery_confirmations', this.mapToObject(this.confirmations));

    return confirmation;
  }

  // Handle signature field
  async handleSignatureField(confirmationId, fieldId, signatureData) {
    const signature = {
      id: this.generateId(),
      confirmationId,
      fieldId,
      data: signatureData,
      timestamp: Date.now(),
      verified: false,
      metadata: {
        device: navigator.userAgent,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        inputMethod: signatureData.inputMethod || 'touch'
      }
    };

    this.signatures.set(signature.id, signature);
    this.saveToLocalStorage('delivery_signatures', this.mapToObject(this.signatures));

    return signature;
  }

  // Handle photo field
  async handlePhotoField(confirmationId, fieldId, photoData) {
    const photo = {
      id: this.generateId(),
      confirmationId,
      fieldId,
      data: photoData,
      timestamp: Date.now(),
      verified: false,
      metadata: {
        device: navigator.userAgent,
        platform: navigator.platform,
        fileSize: photoData.size || 0,
        mimeType: photoData.type || 'image/jpeg',
        dimensions: photoData.dimensions || { width: 0, height: 0 },
        location: photoData.location || { latitude: 0, longitude: 0 },
        timestamp: photoData.timestamp || Date.now()
      }
    };

    this.photos.set(photo.id, photo);
    this.saveToLocalStorage('delivery_photos', this.mapToObject(this.photos));

    return photo;
  }

  // Complete confirmation
  async completeConfirmation(confirmationId, finalData = {}) {
    const confirmation = this.confirmations.get(confirmationId);
    if (!confirmation) {
      throw new Error('Confirmation not found');
    }

    // Update final data
    Object.assign(confirmation, finalData);
    
    // Set completion timestamp
    confirmation.completedAt = Date.now();
    confirmation.status = 'completed';

    // Generate proof of delivery
    const proof = await this.generateProofOfDelivery(confirmation);
    confirmation.proofId = proof.id;

    // Send notifications
    await this.sendConfirmationNotifications(confirmation);

    // Update confirmation
    this.confirmations.set(confirmationId, confirmation);
    this.saveToLocalStorage('delivery_confirmations', this.mapToObject(this.confirmations));

    return {
      confirmation,
      proof,
      notifications: confirmation.notifications
    };
  }

  // Generate proof of delivery
  async generateProofOfDelivery(confirmation) {
    const proof = {
      id: this.generateId(),
      confirmationId: confirmation.id,
      deliveryId: confirmation.deliveryId,
      orderId: confirmation.orderId,
      templateId: confirmation.templateId,
      customerInfo: confirmation.customerInfo,
      agentInfo: confirmation.agentInfo,
      deliveryInfo: confirmation.deliveryInfo,
      fields: confirmation.fields,
      signatures: this.getConfirmationSignatures(confirmation.id),
      photos: this.getConfirmationPhotos(confirmation.id),
      autoGenerated: confirmation.autoGenerated,
      location: confirmation.location,
      device: confirmation.device,
      createdAt: confirmation.createdAt,
      completedAt: confirmation.completedAt,
      status: 'active',
      verified: false,
      qrCode: this.generateQRCode(confirmation.id),
      blockchainHash: this.generateBlockchainHash(confirmation),
      metadata: {
        version: '1.0',
        format: 'digital',
        compliance: ['ethiopian_delivery_standards'],
        auditTrail: this.generateAuditTrail(confirmation)
      }
    };

    this.proofs.set(proof.id, proof);
    this.saveToLocalStorage('delivery_proofs', this.mapToObject(this.proofs));

    return proof;
  }

  // Get confirmation signatures
  getConfirmationSignatures(confirmationId) {
    const signatures = [];
    
    for (const [id, signature] of this.signatures.entries()) {
      if (signature.confirmationId === confirmationId) {
        signatures.push(signature);
      }
    }

    return signatures;
  }

  // Get confirmation photos
  getConfirmationPhotos(confirmationId) {
    const photos = [];
    
    for (const [id, photo] of this.photos.entries()) {
      if (photo.confirmationId === confirmationId) {
        photos.push(photo);
      }
    }

    return photos;
  }

  // Send confirmation notifications
  async sendConfirmationNotifications(confirmation) {
    const notifications = [];

    // Email notification
    if (confirmation.template.notifications.includes('email')) {
      const emailNotification = await this.sendEmailNotification(confirmation);
      notifications.push(emailNotification);
    }

    // SMS notification
    if (confirmation.template.notifications.includes('sms')) {
      const smsNotification = await this.sendSMSNotification(confirmation);
      notifications.push(smsNotification);
    }

    // Push notification
    if (confirmation.template.notifications.includes('push')) {
      const pushNotification = await this.sendPushNotification(confirmation);
      notifications.push(pushNotification);
    }

    // WhatsApp notification
    if (confirmation.template.notifications.includes('whatsapp')) {
      const whatsappNotification = await this.sendWhatsAppNotification(confirmation);
      notifications.push(whatsappNotification);
    }

    // Store notifications
    confirmation.notifications = notifications;
    this.saveToLocalStorage('delivery_confirmations', this.mapToObject(this.confirmations));

    return notifications;
  }

  // Send email notification
  async sendEmailNotification(confirmation) {
    const notification = {
      id: this.generateId(),
      type: 'email',
      confirmationId: confirmation.id,
      recipient: confirmation.customerInfo.email,
      subject: `Delivery Confirmation - Order #${confirmation.orderId}`,
      message: this.generateEmailMessage(confirmation),
      template: 'delivery_confirmation',
      sentAt: Date.now(),
      status: 'sent',
      metadata: {
        provider: 'sendgrid',
        messageId: this.generateId()
      }
    };

    console.log('📧 Sending email notification:', notification);
    return notification;
  }

  // Send SMS notification
  async sendSMSNotification(confirmation) {
    const notification = {
      id: this.generateId(),
      type: 'sms',
      confirmationId: confirmation.id,
      recipient: confirmation.customerInfo.phone,
      message: this.generateSMSMessage(confirmation),
      sentAt: Date.now(),
      status: 'sent',
      metadata: {
        provider: 'twilio',
        messageId: this.generateId()
      }
    };

    console.log('📱 Sending SMS notification:', notification);
    return notification;
  }

  // Send push notification
  async sendPushNotification(confirmation) {
    const notification = {
      id: this.generateId(),
      type: 'push',
      confirmationId: confirmation.id,
      recipient: confirmation.customerInfo.id,
      title: 'Delivery Confirmed!',
      body: `Your order #${confirmation.orderId} has been delivered successfully.`,
      data: {
        confirmationId: confirmation.id,
        orderId: confirmation.orderId,
        deliveryId: confirmation.deliveryId,
        type: 'delivery_confirmed'
      },
      sentAt: Date.now(),
      status: 'sent',
      metadata: {
        provider: 'firebase',
        messageId: this.generateId()
      }
    };

    console.log('🔔 Sending push notification:', notification);
    return notification;
  }

  // Send WhatsApp notification
  async sendWhatsAppNotification(confirmation) {
    const notification = {
      id: this.generateId(),
      type: 'whatsapp',
      confirmationId: confirmation.id,
      recipient: confirmation.customerInfo.phone,
      message: this.generateWhatsAppMessage(confirmation),
      template: 'delivery_confirmation',
      sentAt: Date.now(),
      status: 'sent',
      metadata: {
        provider: 'twilio',
        messageId: this.generateId()
      }
    };

    console.log('💬 Sending WhatsApp notification:', notification);
    return notification;
  }

  // Generate email message
  generateEmailMessage(confirmation) {
    return `
      <h2>Delivery Confirmation</h2>
      <p>Dear ${confirmation.customerInfo.name},</p>
      <p>Your order #${confirmation.orderId} has been successfully delivered.</p>
      <p><strong>Delivery Details:</strong></p>
      <ul>
        <li>Delivery ID: ${confirmation.deliveryId}</li>
        <li>Delivered At: ${new Date(confirmation.completedAt).toLocaleString()}</li>
        <li>Delivered By: ${confirmation.agentInfo.name}</li>
        <li>Location: ${confirmation.deliveryInfo.address}</li>
      </ul>
      <p>Thank you for choosing Ethiopian Electronics Marketplace!</p>
    `;
  }

  // Generate SMS message
  generateSMSMessage(confirmation) {
    return `Your order #${confirmation.orderId} has been delivered successfully. Delivery ID: ${confirmation.deliveryId}. Thank you for shopping with Ethiopian Electronics Marketplace!`;
  }

  // Generate WhatsApp message
  generateWhatsAppMessage(confirmation) {
    return `✅ Your order #${confirmation.orderId} has been delivered successfully!\n\n📦 Delivery ID: ${confirmation.deliveryId}\n🚚 Delivered by: ${confirmation.agentInfo.name}\n📍 Location: ${confirmation.deliveryInfo.address}\n\nThank you for choosing Ethiopian Electronics Marketplace!`;
  }

  // Calculate confirmation status
  calculateConfirmationStatus(confirmation) {
    const fields = confirmation.fields;
    const requiredFields = Object.values(fields).filter(field => field.required);
    const completedRequiredFields = requiredFields.filter(field => field.completed);

    if (completedRequiredFields.length === 0) {
      return 'pending';
    } else if (completedRequiredFields.length < requiredFields.length) {
      return 'in_progress';
    } else {
      return 'ready';
    }
  }

  // Generate auto field value
  generateAutoField(field, confirmationData) {
    const now = new Date();

    switch (field) {
      case 'delivery_time':
        return now.toLocaleTimeString();
      case 'delivery_date':
        return now.toLocaleDateString();
      case 'pickup_time':
        return now.toLocaleTimeString();
      case 'pickup_date':
        return now.toLocaleDateString();
      case 'return_time':
        return now.toLocaleTimeString();
      case 'return_date':
        return now.toLocaleDateString();
      case 'tracking_number':
        return confirmationData.deliveryInfo.trackingNumber || this.generateTrackingNumber();
      case 'delivery_agent':
        return confirmationData.agentInfo.name;
      case 'pickup_agent':
        return confirmationData.agentInfo.name;
      case 'return_agent':
        return confirmationData.agentInfo.name;
      case 'route_id':
        return this.generateRouteId();
      case 'return_id':
        return this.generateReturnId();
      case 'time_stamp':
        return now.toISOString();
      default:
        return '';
    }
  }

  // Generate QR code
  generateQRCode(confirmationId) {
    return `QR_${confirmationId}_${Date.now()}`;
  }

  // Generate blockchain hash
  generateBlockchainHash(confirmation) {
    // Mock blockchain hash generation
    return `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  }

  // Generate audit trail
  generateAuditTrail(confirmation) {
    return [
      {
        action: 'created',
        timestamp: confirmation.createdAt,
        user: confirmation.agentInfo.id,
        details: 'Confirmation created'
      },
      {
        action: 'updated',
        timestamp: confirmation.updatedAt,
        user: confirmation.agentInfo.id,
        details: 'Confirmation updated'
      },
      {
        action: 'completed',
        timestamp: confirmation.completedAt,
        user: confirmation.agentInfo.id,
        details: 'Confirmation completed'
      }
    ];
  }

  // Generate tracking number
  generateTrackingNumber() {
    return `ET${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }

  // Generate route ID
  generateRouteId() {
    return `ROUTE_${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }

  // Generate return ID
  generateReturnId() {
    return `RET_${Date.now()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }

  // Get confirmation by ID
  getConfirmation(confirmationId) {
    return this.confirmations.get(confirmationId);
  }

  // Get confirmations by delivery
  getConfirmationsByDelivery(deliveryId) {
    const confirmations = [];
    
    for (const [id, confirmation] of this.confirmations.entries()) {
      if (confirmation.deliveryId === deliveryId) {
        confirmations.push(confirmation);
      }
    }

    return confirmations;
  }

  // Get proof by ID
  getProof(proofId) {
    return this.proofs.get(proofId);
  }

  // Get proof by confirmation
  getProofByConfirmation(confirmationId) {
    for (const [id, proof] of this.proofs.entries()) {
      if (proof.confirmationId === confirmationId) {
        return proof;
      }
    }
    return null;
  }

  // Verify confirmation
  async verifyConfirmation(confirmationId, verificationData) {
    const confirmation = this.confirmations.get(confirmationId);
    if (!confirmation) {
      throw new Error('Confirmation not found');
    }

    const verification = {
      verified: true,
      verifiedAt: Date.now(),
      verifiedBy: verificationData.verifiedBy,
      verificationMethod: verificationData.method || 'manual',
      verificationData: verificationData.data || {}
    };

    confirmation.verification = verification;
    this.confirmations.set(confirmationId, confirmation);
    this.saveToLocalStorage('delivery_confirmations', this.mapToObject(this.confirmations));

    return verification;
  }

  // Get confirmation statistics
  getConfirmationStatistics() {
    const confirmations = Array.from(this.confirmations.values());
    const proofs = Array.from(this.proofs.values());
    
    return {
      totalConfirmations: confirmations.length,
      confirmationsByStatus: this.getConfirmationsByStatus(confirmations),
      confirmationsByTemplate: this.getConfirmationsByTemplate(confirmations),
      confirmationsByDay: this.getConfirmationsByDay(confirmations),
      averageCompletionTime: this.calculateAverageCompletionTime(confirmations),
      verificationRate: this.calculateVerificationRate(confirmations),
      popularTemplates: this.getPopularTemplates(confirmations),
      totalProofs: proofs.length,
      proofsByStatus: this.getProofsByStatus(proofs)
    };
  }

  getConfirmationsByStatus(confirmations) {
    const statusCount = {};
    confirmations.forEach(confirmation => {
      statusCount[confirmation.status] = (statusCount[confirmation.status] || 0) + 1;
    });
    return statusCount;
  }

  getConfirmationsByTemplate(confirmations) {
    const templateCount = {};
    confirmations.forEach(confirmation => {
      templateCount[confirmation.templateId] = (templateCount[confirmation.templateId] || 0) + 1;
    });
    return templateCount;
  }

  getConfirmationsByDay(confirmations) {
    const dayCount = {};
    confirmations.forEach(confirmation => {
      const day = new Date(confirmation.createdAt).getDay();
      const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][day];
      dayCount[dayName] = (dayCount[dayName] || 0) + 1;
    });
    return dayCount;
  }

  calculateAverageCompletionTime(confirmations) {
    const completedConfirmations = confirmations.filter(c => c.completedAt);
    if (completedConfirmations.length === 0) return 0;

    const totalTime = completedConfirmations.reduce((sum, confirmation) => {
      return sum + (confirmation.completedAt - confirmation.createdAt);
    }, 0);

    return totalTime / completedConfirmations.length;
  }

  calculateVerificationRate(confirmations) {
    const verifiedConfirmations = confirmations.filter(c => c.verification && c.verification.verified);
    return confirmations.length > 0 ? (verifiedConfirmations.length / confirmations.length) * 100 : 0;
  }

  getPopularTemplates(confirmations) {
    const templateCount = {};
    confirmations.forEach(confirmation => {
      templateCount[confirmation.templateId] = (templateCount[confirmation.templateId] || 0) + 1;
    });

    return Object.entries(templateCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([templateId, count]) => ({
        templateId,
        templateName: this.templates.get(templateId)?.name || templateId,
        count
      }));
  }

  getProofsByStatus(proofs) {
    const statusCount = {};
    proofs.forEach(proof => {
      statusCount[proof.status] = (statusCount[proof.status] || 0) + 1;
    });
    return statusCount;
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

module.exports = DeliveryConfirmationSystem;
