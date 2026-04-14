import React, { useState } from 'react';
import './ShopRegistrationTop.css';

const ShopRegistrationTop = ({ onRegister, onClose }) => {
  const [formData, setFormData] = useState({
    electronicsHouseName: '',
    ownerName: '',
    phoneNumbers: [
      { operator: '', number: '' }
    ],
    city: '',
    customCity: '',
    town: '',
    shopAddress: '',
    shopLogo: null,
    shopDescription: '',
    businessLicenseNumber: 'None',
    tradeLicensePhoto: null,
    shopPhoto: null,
    ownerId: null,
    openingTime: '',
    closingTime: '',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    shopGallery: [],
    shopVideos: [],
    shopAudio: [],
    shopManuals: [],
    shopWarranties: []
  });
  
  const [language, setLanguage] = useState('en'); // 'en' or 'am'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const ethiopianCities = [
    { en: 'Addis Ababa', am: 'አዲስ አበባ' },
    { en: 'Dilla', am: 'ዲላ' },
    { en: 'Hawassa', am: 'ሀዋሳ' },
    { en: 'Mekelle', am: 'መቀሌ' },
    { en: 'Bahir Dar', am: 'ባህር ዳር' },
    { en: 'Dire Dawa', am: 'ድሬ ዳዋ' },
    { en: 'Adama', am: 'አዳማ' },
    { en: 'Gondar', am: 'ጎንደር' },
    { en: 'Jimma', am: 'ጅማ' },
    { en: 'Arba Minch', am: 'አርባ ምንጭ' },
    { en: 'Dessie', am: 'ደሴ' },
    { en: 'Shashemene', am: 'ሻሸመኔ' },
    { en: 'Debre Berhan', am: 'ደብረ ብርሃን' },
    { en: 'Nekemte', am: 'ነቀምቴ' },
    { en: 'Assosa', am: 'አሶሳ' }
  ];

  // Translations
  const translations = {
    en: {
      title: 'Create Shop Account',
      subtitle: 'Register your electronics shop on Ethiopian Electronics',
      electronicsHouseName: 'Electronics House Name',
      ownerName: 'Owner Name',
      phoneNumber: 'Phone Number',
      phoneNumbers: 'Phone Numbers',
      addPhone: 'Add Another Phone',
      removePhone: 'Remove Phone',
      phoneOperator: 'Phone Operator',
      ethiotel: 'Ethio Telecom',
      safari: 'Safari',
      optional: '(Optional)',
      city: 'City',
      town: 'Town/Area',
      shopAddress: 'Shop Address',
      shopLogo: 'Shop Logo',
      shopDescription: 'Shop Description',
      businessLicenseNumber: 'Business License Number',
      tradeLicensePhoto: 'Trade License Photo',
      shopPhoto: 'Shop Photo',
      ownerId: 'Owner ID',
      openingTime: 'Opening Time',
      closingTime: 'Closing Time',
      workingDays: 'Working Days',
      workingHours: 'Working Hours',
      shopGallery: 'Shop Gallery',
      shopVideos: 'Shop Videos',
      shopAudio: 'Shop Audio',
      shopManuals: 'Shop Manuals',
      shopWarranties: 'Warranty Documents',
      customCity: 'Or enter custom city',
      registerButton: 'Register Shop',
      registeringButton: 'Registering...',
      alreadyHaveAccount: 'Already have a shop account? Login here',
      requiredField: 'This field is required',
      validPhone: 'Please enter a valid Ethiopian phone number (09xxxxxxxx)',
      selectCityOrCustom: 'Please select a city or enter a custom city',
      successMessage: '🎉 Shop registration submitted successfully! Your shop has been registered.',
      fillAllFields: 'Please fill in all required fields'
    },
    am: {
      title: 'የክፋ መስመርር',
      subtitle: 'የኤሌትክሲዎንን በዲላ ዲላ ኤሌትክሲዎንን በዲላ',
      electronicsHouseName: 'የኤሌትክሲዎንን ቤብ',
      ownerName: 'ባለቤቱ ስም',
      phoneNumber: 'ስልክ ቁጥር',
      phoneNumbers: 'ስልክ ቁጥርታ',
      addPhone: 'ሌላ ስልክ ይጨምር',
      removePhone: 'ስልክ ያስወግ',
      phoneOperator: 'ስልክ አክሲያን',
      ethiotel: 'ኢትዮ ቴሌኮም',
      safari: 'ሳፋሪሪ',
      optional: '(አስፈጊ)',
      city: 'ከተማ',
      town: 'ከተማ/አካባቢ',
      shopAddress: 'የሱቅሲ አድራሻ',
      shopLogo: 'የሱቅሲ አርማጭ',
      shopDescription: 'የሱቅሲ ገለጽ',
      businessLicenseNumber: 'የንግድ ፈቃድ ቁጥር',
      tradeLicensePhoto: 'የንግድ ፈቃድ ፎቶ',
      shopPhoto: 'የሱቅሲ ፎቶ',
      ownerId: 'የባለቤቱ መለላያ',
      openingTime: 'የመክፋ ጊዜ',
      closingTime: 'የመዝጋ ጊዜ',
      workingDays: 'የስራ ቀናት',
      workingHours: 'የስራ ሰዓታት',
      shopGallery: 'የሱቅሲ ማስዳ',
      shopVideos: 'የሱቅሲ ቪዲዲያ',
      shopAudio: 'የሱቅሲ ድዲዲያ',
      shopManuals: 'የሱቅሲ መመልሪል',
      shopWarranties: 'የሱቅሲ ዋራራል',
      customCity: 'ወይም ሌላ ከተማ ያስገቡ',
      registerButton: 'ሱቅሲውን ይመዝገብ',
      registeringButton: 'በመመዝገብ ላል',
      alreadyHaveAccount: 'ሱቅሲውን መለላያ አለዎ? እዚር',
      requiredField: 'ይህ መስክ ግዴታ ነው',
      validPhone: 'እባክዎት ትክክ ኢትዮያዊ ስልክ ቁጥር (09xxxxxxxx)',
      selectCityOrCustom: 'እባክዎት ከተማ ይምረግ ወወም ገዋ ከተማ ያስገቡ',
      successMessage: '🎉 የሱቅሲ ምዝገብ በተሳል! ሱቅሲዎንን ተመዝገብ።',
      fillAllFields: 'እባክዎት ሁሉን የሚል መስኮታ ይሙሉ'
    }
  };

  const validatePhoneNumber = (phone, operator) => {
    if (!phone || phone.trim() === '') return { isValid: false, message: 'Phone number is required' };
    
    const cleanPhone = phone.replace(/\s/g, '');
    
    // Check if operator is selected
    if (!operator) {
      return { 
        isValid: false, 
        message: 'Please select a phone operator' 
      };
    }
    
    // Check if phone contains only numbers and optional +251 prefix
    if (!/^(\+251)?[0-9]+$/.test(cleanPhone)) {
      return { 
        isValid: false, 
        message: 'Only positive numbers and +251 prefix are allowed (e.g., +251912345678 or 0912345678)' 
      };
    }
    
    // Remove +251 prefix for validation if present
    const phoneForValidation = cleanPhone.startsWith('+251') ? cleanPhone.substring(4) : cleanPhone;
    
    // Check operator and validate format
    if (operator === 'safari') {
      // Safari format: 07XX XXX XXX (exactly 10 digits starting with 07) or +2517XXXXXXXX
      if (phoneForValidation.startsWith('7') && cleanPhone.startsWith('+251')) {
        // International format: +2517XXXXXXXX
        if (phoneForValidation.length !== 9) {
          return { 
            isValid: false, 
            message: `+2517 format needs 9 digits after +251, have ${phoneForValidation.length}` 
          };
        }
        const safariInternationalRegex = /^7[0-9]{8}$/;
        if (!safariInternationalRegex.test(phoneForValidation)) {
          return { 
            isValid: false, 
            message: 'Invalid +2517 format. Only +2517XXXXXXXX allowed' 
          };
        }
        return { 
          isValid: true, 
          operator: 'safari', 
          international: '+251' + phoneForValidation,
          domestic: '7' + phoneForValidation.substring(0, 2) + ' ' + phoneForValidation.substring(2, 5) + ' ' + phoneForValidation.substring(5)
        };
      } else if (phoneForValidation.startsWith('07')) {
        // Domestic format: 07XX XXX XXX
        if (phoneForValidation.length !== 10) {
          return { 
            isValid: false, 
            message: `Need 10 digits, have ${phoneForValidation.length}. Only 07XX XXX XXX format allowed` 
          };
        }
        const safariRegex = /^07[0-9]{8}$/;
        if (!safariRegex.test(phoneForValidation)) {
          return { 
            isValid: false, 
            message: 'Invalid Safari format. Only 07XX XXX XXX allowed' 
          };
        }
        return { 
          isValid: true, 
          operator: 'safari', 
          international: '+251 7' + phoneForValidation.substring(1),
          domestic: phoneForValidation.substring(0, 3) + ' ' + phoneForValidation.substring(3, 6) + ' ' + phoneForValidation.substring(6)
        };
      } else {
        return { 
          isValid: false, 
          message: 'Safari must start with 07 or +2517. Only +251 7X XXX XXXX or 07XX XXX XXX allowed' 
        };
      }
    } else if (operator === 'ethiotel' || operator === 'ethiotel-prepaid' || operator === 'ethiotel-postpaid') {
      // Ethio Telecom format: 09XX XXX XXX (exactly 10 digits starting with 09) or +2519XXXXXXXX
      if (phoneForValidation.startsWith('9') && cleanPhone.startsWith('+251')) {
        // International format: +2519XXXXXXXX
        if (phoneForValidation.length !== 9) {
          return { 
            isValid: false, 
            message: `+2519 format needs 9 digits after +251, have ${phoneForValidation.length}` 
          };
        }
        const ethioInternationalRegex = /^9[0-9]{8}$/;
        if (!ethioInternationalRegex.test(phoneForValidation)) {
          return { 
            isValid: false, 
            message: 'Invalid +2519 format. Only +2519XXXXXXXX allowed' 
          };
        }
        return { 
          isValid: true, 
          operator: operator, 
          international: '+251' + phoneForValidation,
          domestic: '9' + phoneForValidation.substring(0, 2) + ' ' + phoneForValidation.substring(2, 5) + ' ' + phoneForValidation.substring(5)
        };
      } else if (phoneForValidation.startsWith('09')) {
        // Domestic format: 09XX XXX XXX
        if (phoneForValidation.length !== 10) {
          return { 
            isValid: false, 
            message: `Need 10 digits, have ${phoneForValidation.length}. Only 09XX XXX XXX format allowed` 
          };
        }
        const ethioRegex = /^09[0-9]{8}$/;
        if (!ethioRegex.test(phoneForValidation)) {
          return { 
            isValid: false, 
            message: 'Invalid Ethio Telecom format. Only 09XX XXX XXX allowed' 
          };
        }
        return { 
          isValid: true, 
          operator: operator, 
          international: '+251 9' + phoneForValidation.substring(1),
          domestic: phoneForValidation.substring(0, 3) + ' ' + phoneForValidation.substring(3, 6) + ' ' + phoneForValidation.substring(6)
        };
      } else {
        return { 
          isValid: false, 
          message: 'Ethio Telecom must start with 09 or +2519. Only +251 9X XXX XXXX or 09XX XXX XXX allowed' 
        };
      }
    } else {
      return { 
        isValid: false, 
        message: 'Invalid operator selected' 
      };
    }
  };

  const handlePhoneChange = (index, field, value) => {
    const updatedPhones = [...formData.phoneNumbers];
    updatedPhones[index][field] = value;
    
    // Real-time validation for phone number
    if (field === 'number' && value && value.trim() !== '') {
      const validation = validatePhoneNumber(value, updatedPhones[index].operator);
      if (!validation.isValid) {
        updatedPhones[index].error = validation.message;
      } else {
        updatedPhones[index].error = null;
      }
    } else if (field === 'number') {
      // Clear error when user clears the input
      updatedPhones[index].error = null;
    }
    
    setFormData({ ...formData, phoneNumbers: updatedPhones });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please upload an image file (JPG, PNG, etc.)');
        setMessageType('error');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Logo file size must be less than 5MB');
        setMessageType('error');
        return;
      }
      
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, shopLogo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setFormData({ ...formData, shopLogo: null });
  };

  const handleTradeLicenseUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please upload an image file (JPG, PNG, etc.)');
        setMessageType('error');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Trade license file size must be less than 5MB');
        setMessageType('error');
        return;
      }
      
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, tradeLicensePhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveTradeLicense = () => {
    setFormData({ ...formData, tradeLicensePhoto: null });
  };

  const handleShopPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please upload an image file (JPG, PNG, etc.)');
        setMessageType('error');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Shop photo file size must be less than 5MB');
        setMessageType('error');
        return;
      }
      
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, shopPhoto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveShopPhoto = () => {
    setFormData({ ...formData, shopPhoto: null });
  };

  const handleOwnerIdUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage('Please upload an image file (JPG, PNG, etc.)');
        setMessageType('error');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Owner ID file size must be less than 5MB');
        setMessageType('error');
        return;
      }
      
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, ownerId: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveOwnerId = () => {
    setFormData({ ...formData, ownerId: null });
  };

  const handleWorkingDaysChange = (day) => {
    const updatedDays = formData.workingDays.includes(day)
      ? formData.workingDays.filter(d => d !== day)
      : [...formData.workingDays, day];
    setFormData({ ...formData, workingDays: updatedDays });
  };

  // Multimedia Upload Handlers
  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Check total files count (max 10)
      if (formData.shopGallery.length + files.length > 10) {
        setMessage('Maximum 10 images allowed in gallery');
        setMessageType('error');
        return;
      }
      
      const validFiles = [];
      for (let file of files) {
        // Check file type
        if (!file.type.startsWith('image/')) {
          setMessage(`Only image files allowed. ${file.name} is not an image.`);
          setMessageType('error');
          return;
        }
        
        // Check file size (max 5MB per file)
        if (file.size > 5 * 1024 * 1024) {
          setMessage(`File ${file.name} is too large. Maximum size is 5MB.`);
          setMessageType('error');
          return;
        }
        
        validFiles.push(file);
      }
      
      // Convert files to base64 and add to gallery
      const readers = validFiles.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              name: file.name,
              type: file.type,
              size: file.size,
              url: reader.result
            });
          };
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(readers).then(results => {
        const updatedGallery = [...formData.shopGallery, ...results];
        setFormData({ ...formData, shopGallery: updatedGallery });
      });
    }
  };

  const handleRemoveGalleryItem = (index) => {
    const updatedGallery = formData.shopGallery.filter((_, i) => i !== index);
    setFormData({ ...formData, shopGallery: updatedGallery });
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Check total files count (max 5)
      if (formData.shopVideos.length + files.length > 5) {
        setMessage('Maximum 5 videos allowed');
        setMessageType('error');
        return;
      }
      
      const validFiles = [];
      for (let file of files) {
        // Check file type
        if (!file.type.startsWith('video/')) {
          setMessage(`Only video files allowed. ${file.name} is not a video.`);
          setMessageType('error');
          return;
        }
        
        // Check file size (max 50MB per video)
        if (file.size > 50 * 1024 * 1024) {
          setMessage(`File ${file.name} is too large. Maximum size is 50MB.`);
          setMessageType('error');
          return;
        }
        
        validFiles.push(file);
      }
      
      // Convert files to base64 and add to videos
      const readers = validFiles.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              name: file.name,
              type: file.type,
              size: file.size,
              url: reader.result
            });
          };
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(readers).then(results => {
        const updatedVideos = [...formData.shopVideos, ...results];
        setFormData({ ...formData, shopVideos: updatedVideos });
      });
    }
  };

  const handleRemoveVideo = (index) => {
    const updatedVideos = formData.shopVideos.filter((_, i) => i !== index);
    setFormData({ ...formData, shopVideos: updatedVideos });
  };

  const handleAudioUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Check total files count (max 5)
      if (formData.shopAudio.length + files.length > 5) {
        setMessage('Maximum 5 audio files allowed');
        setMessageType('error');
        return;
      }
      
      const validFiles = [];
      for (let file of files) {
        // Check file type
        if (!file.type.startsWith('audio/')) {
          setMessage(`Only audio files allowed. ${file.name} is not an audio file.`);
          setMessageType('error');
          return;
        }
        
        // Check file size (max 10MB per audio)
        if (file.size > 10 * 1024 * 1024) {
          setMessage(`File ${file.name} is too large. Maximum size is 10MB.`);
          setMessageType('error');
          return;
        }
        
        validFiles.push(file);
      }
      
      // Convert files to base64 and add to audio
      const readers = validFiles.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              name: file.name,
              type: file.type,
              size: file.size,
              url: reader.result
            });
          };
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(readers).then(results => {
        const updatedAudio = [...formData.shopAudio, ...results];
        setFormData({ ...formData, shopAudio: updatedAudio });
      });
    }
  };

  const handleRemoveAudio = (index) => {
    const updatedAudio = formData.shopAudio.filter((_, i) => i !== index);
    setFormData({ ...formData, shopAudio: updatedAudio });
  };

  const handleManualUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Check total files count (max 10)
      if (formData.shopManuals.length + files.length > 10) {
        setMessage('Maximum 10 manual files allowed');
        setMessageType('error');
        return;
      }
      
      const validFiles = [];
      for (let file of files) {
        // Check file type (PDF, DOC, DOCX, TXT)
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!allowedTypes.includes(file.type)) {
          setMessage(`Only PDF, DOC, DOCX, or TXT files allowed. ${file.name} is not supported.`);
          setMessageType('error');
          return;
        }
        
        // Check file size (max 10MB per file)
        if (file.size > 10 * 1024 * 1024) {
          setMessage(`File ${file.name} is too large. Maximum size is 10MB.`);
          setMessageType('error');
          return;
        }
        
        validFiles.push(file);
      }
      
      // Convert files to base64 and add to manuals
      const readers = validFiles.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              name: file.name,
              type: file.type,
              size: file.size,
              url: reader.result
            });
          };
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(readers).then(results => {
        const updatedManuals = [...formData.shopManuals, ...results];
        setFormData({ ...formData, shopManuals: updatedManuals });
      });
    }
  };

  const handleRemoveManual = (index) => {
    const updatedManuals = formData.shopManuals.filter((_, i) => i !== index);
    setFormData({ ...formData, shopManuals: updatedManuals });
  };

  const handleWarrantyUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Check total files count (max 5)
      if (formData.shopWarranties.length + files.length > 5) {
        setMessage('Maximum 5 warranty documents allowed');
        setMessageType('error');
        return;
      }
      
      const validFiles = [];
      for (let file of files) {
        // Check file type (PDF, DOC, DOCX, TXT, Image)
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
          setMessage(`Only PDF, DOC, DOCX, TXT, or image files allowed. ${file.name} is not supported.`);
          setMessageType('error');
          return;
        }
        
        // Check file size (max 10MB per file)
        if (file.size > 10 * 1024 * 1024) {
          setMessage(`File ${file.name} is too large. Maximum size is 10MB.`);
          setMessageType('error');
          return;
        }
        
        validFiles.push(file);
      }
      
      // Convert files to base64 and add to warranties
      const readers = validFiles.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              name: file.name,
              type: file.type,
              size: file.size,
              url: reader.result
            });
          };
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(readers).then(results => {
        const updatedWarranties = [...formData.shopWarranties, ...results];
        setFormData({ ...formData, shopWarranties: updatedWarranties });
      });
    }
  };

  const handleRemoveWarranty = (index) => {
    const updatedWarranties = formData.shopWarranties.filter((_, i) => i !== index);
    setFormData({ ...formData, shopWarranties: updatedWarranties });
  };

  const formatEthiopianTime = (time24) => {
    if (!time24) return '';
    
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const minute = minutes;
    
    // Ethiopian time is 6 hours ahead of standard time
    let ethiopianHour = hour + 6;
    let period = '';
    
    // Determine period and adjust hour
    if (ethiopianHour >= 24) {
      ethiopianHour -= 24;
      period = 'Morning';
    } else if (ethiopianHour >= 12) {
      period = 'Afternoon';
    } else if (ethiopianHour >= 6) {
      period = 'Morning';
    } else {
      period = 'Night';
    }
    
    // Convert to 12-hour format
    let displayHour = ethiopianHour;
    if (ethiopianHour > 12) {
      displayHour = ethiopianHour - 12;
    } else if (ethiopianHour === 0) {
      displayHour = 12;
    }
    
    return `${displayHour}:${minute} ${period}`;
  };

  const handleTimeChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const addPhoneNumber = () => {
    setFormData({
      ...formData,
      phoneNumbers: [
        ...formData.phoneNumbers,
        { operator: '', number: '' }
      ]
    });
  };

  const removePhoneNumber = (index) => {
    if (formData.phoneNumbers.length > 1) {
      const updatedPhones = formData.phoneNumbers.filter((_, i) => i !== index);
      setFormData({ ...formData, phoneNumbers: updatedPhones });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // Validate form data
      if (!formData.electronicsHouseName || !formData.ownerName || !formData.shopAddress || !formData.town) {
        throw new Error(translations[language].fillAllFields);
      }
      
      if (!formData.customCity) {
        throw new Error(translations[language].requiredField + ' - ' + translations[language].city);
      }
      
      // Validate phone numbers (at least one should be valid)
      const validPhones = [];
      const phoneErrors = [];
      
      formData.phoneNumbers.forEach((phone, index) => {
        if (phone.number && phone.number.trim() !== '') {
          const validation = validatePhoneNumber(phone.number, phone.operator);
          if (validation.isValid) {
            validPhones.push({
              ...phone,
              ...validation
            });
          } else {
            phoneErrors.push(`Phone ${index + 1}: ${validation.message}`);
          }
        }
      });
      
      if (validPhones.length === 0 && phoneErrors.length === 0) {
        throw new Error('At least one valid phone number is required');
      }
      
      if (phoneErrors.length > 0) {
        throw new Error(phoneErrors.join('\n'));
      }
      
      // Prepare registration data
      const finalCity = formData.customCity; // Only use custom city
      const registrationData = {
        ...formData,
        shopName: formData.electronicsHouseName, // Use electronics house name as shop name
        city: finalCity,
        registrationDate: new Date().toISOString(),
        id: Date.now().toString(), // Simple ID generation
        isVerified: false,
        validatedPhones: validPhones
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call parent handler
      onRegister(registrationData);
      
      // Show success message
      setMessage(translations[language].successMessage);
      setMessageType('success');
      
      // Clear form after successful submission
      setTimeout(() => {
        setFormData({
          electronicsHouseName: '',
          ownerName: '',
          phoneNumbers: [
            { operator: '', number: '' }
          ],
          city: '',
          customCity: '',
          town: '',
          shopAddress: '',
          shopLogo: null,
          shopDescription: '',
          businessLicenseNumber: 'None',
          tradeLicensePhoto: null,
          shopPhoto: null,
          ownerId: null,
          openingTime: '',
          closingTime: '',
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          shopGallery: [],
          shopVideos: [],
          shopAudio: [],
          shopManuals: [],
          shopWarranties: []
        });
        setMessage('');
        onClose();
      }, 2000);
      
    } catch (error) {
      setMessage(error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear message when user starts typing
    if (message) {
      setMessage('');
      setMessageType('');
    }
  };

  return (
    <div className="shop-registration-top">
      <div className="registration-overlay" onClick={onClose}></div>
      <div className="registration-container">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="registration-header">
          <h2>{translations[language].title}</h2>
          <p>{translations[language].subtitle}</p>
          
          {/* Language Toggle */}
          <div className="language-toggle">
            <button 
              className={`lang-btn ${language === 'en' ? 'active' : ''}`}
              onClick={() => setLanguage('en')}
            >
              English
            </button>
            <button 
              className={`lang-btn ${language === 'am' ? 'active' : ''}`}
              onClick={() => setLanguage('am')}
            >
              አማርኛ
            </button>
          </div>
        </div>

        <div className="registration-form">
          {/* Message Display */}
          {message && (
            <div className={`message-display ${messageType}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="electronicsHouseName">{translations[language].electronicsHouseName}</label>
              <input
                type="text"
                id="electronicsHouseName"
                name="electronicsHouseName"
                value={formData.electronicsHouseName}
                onChange={handleChange}
                placeholder={translations[language].electronicsHouseName}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="ownerName">{translations[language].ownerName}</label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder={translations[language].ownerName}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="shopLogo">{translations[language].shopLogo} {translations[language].optional}</label>
              <div className="logo-upload-section">
                <div className="logo-options">
                  <div className="logo-option-buttons">
                    <button
                      type="button"
                      className={`logo-option-btn ${formData.shopLogo === null ? 'active' : ''}`}
                      onClick={() => handleRemoveLogo()}
                    >
                      🚫 None
                    </button>
                    <button
                      type="button"
                      className={`logo-option-btn ${formData.shopLogo !== null ? 'active' : ''}`}
                      onClick={() => document.getElementById('shopLogo').click()}
                    >
                      📷 Upload Logo
                    </button>
                  </div>
                  
                  {formData.shopLogo && (
                    <div className="logo-preview">
                      <img 
                        src={formData.shopLogo} 
                        alt="Shop Logo" 
                        className="logo-preview-img"
                      />
                      <button 
                        type="button" 
                        className="remove-logo-btn"
                        onClick={handleRemoveLogo}
                      >
                        × Remove
                      </button>
                    </div>
                  )}
                </div>
                
                <input
                  type="file"
                  id="shopLogo"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="logo-input"
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="shopDescription">{translations[language].shopDescription} *</label>
              <textarea
                id="shopDescription"
                name="shopDescription"
                value={formData.shopDescription}
                onChange={handleChange}
                placeholder="Example: We sell original smartphones and laptops with warranty and excellent customer service."
                className="description-textarea"
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="businessLicenseNumber">{translations[language].businessLicenseNumber} {translations[language].optional}</label>
              <div className="business-license-options">
                <div className="license-option-buttons">
                  <button
                    type="button"
                    className={`license-option-btn ${formData.businessLicenseNumber === 'None' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, businessLicenseNumber: 'None' })}
                  >
                    🚫 None
                  </button>
                  <button
                    type="button"
                    className={`license-option-btn ${formData.businessLicenseNumber !== 'None' && formData.businessLicenseNumber !== '' ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, businessLicenseNumber: '' })}
                  >
                    📝 Enter License
                  </button>
                </div>
                
                {formData.businessLicenseNumber !== 'None' && (
                  <input
                    type="text"
                    id="businessLicenseNumber"
                    name="businessLicenseNumber"
                    value={formData.businessLicenseNumber}
                    onChange={handleChange}
                    placeholder="Enter your business license number"
                    className="business-license-input"
                  />
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tradeLicensePhoto">{translations[language].tradeLicensePhoto} {translations[language].optional}</label>
              <div className="document-upload-section">
                <div className="document-options">
                  <div className="document-option-buttons">
                    <button
                      type="button"
                      className={`document-option-btn ${formData.tradeLicensePhoto === null ? 'active' : ''}`}
                      onClick={handleRemoveTradeLicense}
                    >
                      🚫 None
                    </button>
                    <button
                      type="button"
                      className={`document-option-btn ${formData.tradeLicensePhoto !== null ? 'active' : ''}`}
                      onClick={() => document.getElementById('tradeLicensePhoto').click()}
                    >
                      📄 Upload Photo
                    </button>
                  </div>
                  
                  {formData.tradeLicensePhoto && (
                    <div className="document-preview">
                      <img 
                        src={formData.tradeLicensePhoto} 
                        alt="Trade License" 
                        className="document-preview-img"
                      />
                      <button 
                        type="button" 
                        className="remove-document-btn"
                        onClick={handleRemoveTradeLicense}
                      >
                        × Remove
                      </button>
                    </div>
                  )}
                </div>
                
                <input
                  type="file"
                  id="tradeLicensePhoto"
                  accept="image/*"
                  onChange={handleTradeLicenseUpload}
                  className="document-input"
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="shopPhoto">{translations[language].shopPhoto} {translations[language].optional}</label>
              <div className="document-upload-section">
                <div className="document-options">
                  <div className="document-option-buttons">
                    <button
                      type="button"
                      className={`document-option-btn ${formData.shopPhoto === null ? 'active' : ''}`}
                      onClick={handleRemoveShopPhoto}
                    >
                      🚫 None
                    </button>
                    <button
                      type="button"
                      className={`document-option-btn ${formData.shopPhoto !== null ? 'active' : ''}`}
                      onClick={() => document.getElementById('shopPhoto').click()}
                    >
                      🏪 Upload Photo
                    </button>
                  </div>
                  
                  {formData.shopPhoto && (
                    <div className="document-preview">
                      <img 
                        src={formData.shopPhoto} 
                        alt="Shop Photo" 
                        className="document-preview-img"
                      />
                      <button 
                        type="button" 
                        className="remove-document-btn"
                        onClick={handleRemoveShopPhoto}
                      >
                        × Remove
                      </button>
                    </div>
                  )}
                </div>
                
                <input
                  type="file"
                  id="shopPhoto"
                  accept="image/*"
                  onChange={handleShopPhotoUpload}
                  className="document-input"
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="ownerId">{translations[language].ownerId} {translations[language].optional}</label>
              <div className="document-upload-section">
                <div className="document-options">
                  <div className="document-option-buttons">
                    <button
                      type="button"
                      className={`document-option-btn ${formData.ownerId === null ? 'active' : ''}`}
                      onClick={handleRemoveOwnerId}
                    >
                      🚫 None
                    </button>
                    <button
                      type="button"
                      className={`document-option-btn ${formData.ownerId !== null ? 'active' : ''}`}
                      onClick={() => document.getElementById('ownerId').click()}
                    >
                      🆔 Upload ID
                    </button>
                  </div>
                  
                  {formData.ownerId && (
                    <div className="document-preview">
                      <img 
                        src={formData.ownerId} 
                        alt="Owner ID" 
                        className="document-preview-img"
                      />
                      <button 
                        type="button" 
                        className="remove-document-btn"
                        onClick={handleRemoveOwnerId}
                      >
                        × Remove
                      </button>
                    </div>
                  )}
                </div>
                
                <input
                  type="file"
                  id="ownerId"
                  accept="image/*"
                  onChange={handleOwnerIdUpload}
                  className="document-input"
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            {/* Multimedia Upload Section */}
            <div className="form-group">
              <label>{translations[language].shopGallery} {translations[language].optional}</label>
              <div className="multimedia-upload-section">
                <div className="multimedia-options">
                  <div className="multimedia-option-buttons">
                    <button
                      type="button"
                      className={`multimedia-option-btn ${formData.shopGallery.length === 0 ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, shopGallery: [] })}
                    >
                      🚫 None
                    </button>
                    <button
                      type="button"
                      className={`multimedia-option-btn ${formData.shopGallery.length > 0 ? 'active' : ''}`}
                      onClick={() => document.getElementById('shopGallery').click()}
                    >
                      📸 Upload Images
                    </button>
                  </div>
                  
                  {formData.shopGallery.length > 0 && (
                    <div className="multimedia-preview">
                      <div className="multimedia-grid">
                        {formData.shopGallery.map((item, index) => (
                          <div key={index} className="multimedia-item">
                            <div className="multimedia-preview-wrapper">
                              {item.type.startsWith('image/') ? (
                                <img 
                                  src={item.url} 
                                  alt={item.name} 
                                  className="multimedia-preview-img"
                                />
                              ) : (
                                <div className="multimedia-placeholder">
                                  <span className="multimedia-icon">📄</span>
                                </div>
                              )}
                            </div>
                            <div className="multimedia-item-info">
                              <span className="multimedia-name">{item.name}</span>
                              <span className="multimedia-size">({(item.size / 1024).toFixed(1)}KB)</span>
                              <button 
                                className="remove-multimedia-btn"
                                onClick={() => handleRemoveGalleryItem(index)}
                              >
                                × Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <input
                  type="file"
                  id="shopGallery"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  className="multimedia-input"
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>{translations[language].shopVideos} {translations[language].optional}</label>
              <div className="multimedia-upload-section">
                <div className="multimedia-options">
                  <div className="multimedia-option-buttons">
                    <button
                      type="button"
                      className={`multimedia-option-btn ${formData.shopVideos.length === 0 ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, shopVideos: [] })}
                    >
                      🚫 None
                    </button>
                    <button
                      type="button"
                      className={`multimedia-option-btn ${formData.shopVideos.length > 0 ? 'active' : ''}`}
                      onClick={() => document.getElementById('shopVideos').click()}
                    >
                      🎬 Upload Videos
                    </button>
                  </div>
                  
                  {formData.shopVideos.length > 0 && (
                    <div className="multimedia-preview">
                      <div className="multimedia-grid">
                        {formData.shopVideos.map((item, index) => (
                          <div key={index} className="multimedia-item">
                            <div className="multimedia-preview-wrapper">
                              {item.type.startsWith('video/') ? (
                                <video 
                                  src={item.url} 
                                  controls
                                  className="multimedia-preview-video"
                                >
                                  Your browser does not support the video tag.
                                </video>
                              ) : (
                                <div className="multimedia-placeholder">
                                  <span className="multimedia-icon">🎬</span>
                                </div>
                              )}
                            </div>
                            <div className="multimedia-item-info">
                              <span className="multimedia-name">{item.name}</span>
                              <span className="multimedia-size">({(item.size / 1024).toFixed(1)}KB)</span>
                              <button 
                                className="remove-multimedia-btn"
                                onClick={() => handleRemoveVideo(index)}
                              >
                                × Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <input
                  type="file"
                  id="shopVideos"
                  accept="video/*"
                  multiple
                  onChange={handleVideoUpload}
                  className="multimedia-input"
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>{translations[language].shopAudio} {translations[language].optional}</label>
              <div className="multimedia-upload-section">
                <div className="multimedia-options">
                  <div className="multimedia-option-buttons">
                    <button
                      type="button"
                      className={`multimedia-option-btn ${formData.shopAudio.length === 0 ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, shopAudio: [] })}
                    >
                      🚫 None
                    </button>
                    <button
                      type="button"
                      className={`multimedia-option-btn ${formData.shopAudio.length > 0 ? 'active' : ''}`}
                      onClick={() => document.getElementById('shopAudio').click()}
                    >
                      🎵 Upload Audio
                    </button>
                  </div>
                  
                  {formData.shopAudio.length > 0 && (
                    <div className="multimedia-preview">
                      <div className="multimedia-grid">
                        {formData.shopAudio.map((item, index) => (
                          <div key={index} className="multimedia-item">
                            <div className="multimedia-preview-wrapper">
                              {item.type.startsWith('audio/') ? (
                                <audio 
                                  src={item.url} 
                                  controls
                                  className="multimedia-preview-audio"
                                >
                                  Your browser does not support the audio tag.
                                </audio>
                              ) : (
                                <div className="multimedia-placeholder">
                                  <span className="multimedia-icon">🎵</span>
                                </div>
                              )}
                            </div>
                            <div className="multimedia-item-info">
                              <span className="multimedia-name">{item.name}</span>
                              <span className="multimedia-size">({(item.size / 1024).toFixed(1)}KB)</span>
                              <button 
                                className="remove-multimedia-btn"
                                onClick={() => handleRemoveAudio(index)}
                              >
                                × Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <input
                  type="file"
                  id="shopAudio"
                  accept="audio/*"
                  multiple
                  onChange={handleAudioUpload}
                  className="multimedia-input"
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>{translations[language].shopManuals} {translations[language].optional}</label>
              <div className="multimedia-upload-section">
                <div className="multimedia-options">
                  <div className="multimedia-option-buttons">
                    <button
                      type="button"
                      className={`multimedia-option-btn ${formData.shopManuals.length === 0 ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, shopManuals: [] })}
                    >
                      🚫 None
                    </button>
                    <button
                      type="button"
                      className={`multimedia-option-btn ${formData.shopManuals.length > 0 ? 'active' : ''}`}
                      onClick={() => document.getElementById('shopManuals').click()}
                    >
                      📄 Upload Manuals
                    </button>
                  </div>
                  
                  {formData.shopManuals.length > 0 && (
                    <div className="multimedia-preview">
                      <div className="multimedia-grid">
                        {formData.shopManuals.map((item, index) => (
                          <div key={index} className="multimedia-item">
                            <div className="multimedia-preview-wrapper">
                              {(item.type === 'application/pdf' || item.type.includes('word') || item.type === 'text/plain') ? (
                                <div className="document-preview-wrapper">
                                  <div className="document-preview-icon">
                                    {item.type === 'application/pdf' ? '📄' : '📄'}
                                  </div>
                                  <div className="document-preview-info">
                                    <span className="document-name">{item.name}</span>
                                    <span className="document-size">({(item.size / 1024).toFixed(1)}KB)</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="multimedia-placeholder">
                                  <span className="multimedia-icon">📄</span>
                                </div>
                              )}
                            </div>
                            <div className="multimedia-item-info">
                              <span className="multimedia-name">{item.name}</span>
                              <span className="multimedia-size">({(item.size / 1024).toFixed(1)}KB)</span>
                              <button 
                                className="remove-multimedia-btn"
                                onClick={() => handleRemoveManual(index)}
                              >
                                × Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <input
                  type="file"
                  id="shopManuals"
                  accept=".pdf,.doc,.docx,.txt"
                  multiple
                  onChange={handleManualUpload}
                  className="multimedia-input"
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>{translations[language].shopWarranties} {translations[language].optional}</label>
              <div className="multimedia-upload-section">
                <div className="multimedia-options">
                  <div className="multimedia-option-buttons">
                    <button
                      type="button"
                      className={`multimedia-option-btn ${formData.shopWarranties.length === 0 ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, shopWarranties: [] })}
                    >
                      🚫 None
                    </button>
                    <button
                      type="button"
                      className={`multimedia-option-btn ${formData.shopWarranties.length > 0 ? 'active' : ''}`}
                      onClick={() => document.getElementById('shopWarranties').click()}
                    >
                      📄 Upload Warranties
                    </button>
                  </div>
                  
                  {formData.shopWarranties.length > 0 && (
                    <div className="multimedia-preview">
                      <div className="multimedia-grid">
                        {formData.shopWarranties.map((item, index) => (
                          <div key={index} className="multimedia-item">
                            <div className="multimedia-preview-wrapper">
                              {(item.type === 'application/pdf' || item.type.includes('word') || item.type === 'text/plain' || item.type.startsWith('image/')) ? (
                                <div className="document-preview-wrapper">
                                  <div className="document-preview-icon">
                                    {item.type === 'application/pdf' ? '📄' : 
                                     item.type.includes('word') ? '📄' : 
                                     item.type.startsWith('image/') ? '🖼️' : '📄'}
                                  </div>
                                  <div className="document-preview-info">
                                    <span className="document-name">{item.name}</span>
                                    <span className="document-size">({(item.size / 1024).toFixed(1)}KB)</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="multimedia-placeholder">
                                  <span className="multimedia-icon">📄</span>
                                </div>
                              )}
                            </div>
                            <div className="multimedia-item-info">
                              <span className="multimedia-name">{item.name}</span>
                              <span className="multimedia-size">({(item.size / 1024).toFixed(1)}KB)</span>
                              <button 
                                className="remove-multimedia-btn"
                                onClick={() => handleRemoveWarranty(index)}
                              >
                                × Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <input
                  type="file"
                  id="shopWarranties"
                  accept=".pdf,.doc,.docx,.txt,image/*"
                  multiple
                  onChange={handleWarrantyUpload}
                  className="multimedia-input"
                  style={{ display: 'none' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label>{translations[language].workingHours}</label>
              <div className="working-hours-section">
                {/* Ethiopian Time Display */}
                {(formData.openingTime || formData.closingTime) && (
                  <div className="ethiopian-time-display">
                    <div className="ethiopian-time-info">
                      <span className="time-label">🕐 Ethiopian Time:</span>
                      <div className="time-values">
                        {formData.openingTime && (
                          <span className="opening-ethiopian">
                            Opens: {formatEthiopianTime(formData.openingTime)}
                          </span>
                        )}
                        {formData.closingTime && (
                          <span className="closing-ethiopian">
                            Closes: {formatEthiopianTime(formData.closingTime)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="time-inputs">
                  <div className="time-input-group">
                    <label htmlFor="openingTime">{translations[language].openingTime}</label>
                    <input
                      type="time"
                      id="openingTime"
                      name="openingTime"
                      value={formData.openingTime}
                      onChange={(e) => handleTimeChange('openingTime', e.target.value)}
                      className="time-input"
                    />
                    <small className="time-hint">Select opening time</small>
                  </div>
                  <div className="time-input-group">
                    <label htmlFor="closingTime">{translations[language].closingTime}</label>
                    <input
                      type="time"
                      id="closingTime"
                      name="closingTime"
                      value={formData.closingTime}
                      onChange={(e) => handleTimeChange('closingTime', e.target.value)}
                      className="time-input"
                    />
                    <small className="time-hint">Select closing time</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>{translations[language].workingDays}</label>
              <div className="working-days-section">
                <div className="days-grid">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <label key={day} className="day-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.workingDays.includes(day)}
                        onChange={() => handleWorkingDaysChange(day)}
                        className="day-input"
                      />
                      <span className="day-label">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              {formData.phoneNumbers.map((phone, index) => (
                <div key={index} className="phone-number-group">
                  <div className="phone-operator-section">
                    <span className="operator-label">{translations[language].phoneOperator}:</span>
                    <div className="operator-select">
                      <select
                        value={phone.operator}
                        onChange={(e) => handlePhoneChange(index, 'operator', e.target.value)}
                        className="operator-dropdown"
                      >
                        <option value="">Select Operator</option>
                        <option value="safari">Safari</option>
                        <option value="ethiotel">Ethio Telecom</option>
                        <option value="ethiotel-prepaid">Ethio Telecom Prepaid</option>
                        <option value="ethiotel-postpaid">Ethio Telecom Postpaid</option>
                      </select>
                    </div>
                  </div>
                  <div className="phone-input-section">
                    <input
                      type="tel"
                      value={phone.number}
                      onChange={(e) => handlePhoneChange(index, 'number', e.target.value)}
                      placeholder={
                      phone.operator === 'safari' ? '07xxxxxxxx or +2517xxxxxxxx' : 
                      (phone.operator === 'ethiotel' || phone.operator === 'ethiotel-prepaid' || phone.operator === 'ethiotel-postpaid') ? '09xxxxxxxx or +2519xxxxxxxx' : 
                      'Select operator first'
                    }
                      className={`phone-input ${phone.error ? 'error' : ''}`}
                    />
                    {phone.error && (
                      <div className="phone-error-message">
                        {phone.error}
                      </div>
                    )}
                    {formData.phoneNumbers.length > 1 && (
                      <button
                        type="button"
                        className="remove-phone-btn"
                        onClick={() => removePhoneNumber(index)}
                        title={translations[language].removePhone}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                className="add-phone-btn"
                onClick={addPhoneNumber}
              >
                {translations[language].addPhone}
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="customCity">{translations[language].city}</label>
              <input
                type="text"
                id="customCity"
                name="customCity"
                value={formData.customCity}
                onChange={handleChange}
                placeholder={translations[language].customCity}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="town">{translations[language].town}</label>
              <input
                type="text"
                id="town"
                name="town"
                value={formData.town}
                onChange={handleChange}
                placeholder={translations[language].town}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="shopAddress">{translations[language].shopAddress}</label>
              <input
                type="text"
                id="shopAddress"
                name="shopAddress"
                value={formData.shopAddress}
                onChange={handleChange}
                placeholder={translations[language].shopAddress}
                required
              />
            </div>

            <button type="submit" className="register-shop-btn" disabled={loading}>
              {loading ? translations[language].registeringButton : translations[language].registerButton}
            </button>
          </form>
        </div>

        <div className="registration-footer">
          <p>{translations[language].alreadyHaveAccount}</p>
        </div>
      </div>
    </div>
  );
};

export default ShopRegistrationTop;
