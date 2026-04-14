// Wishlist Sharing System for Ethiopian Electronics Marketplace
class WishlistSharingSystem {
  constructor() {
    this.wishlists = new Map();
    this.sharedWishlists = new Map();
    this.sharingLinks = new Map();
    this.collaborativeWishlists = new Map();
    
    this.initializeFromStorage();
  }

  // Initialize from local storage
  initializeFromStorage() {
    const wishlists = this.loadFromLocalStorage('user_wishlists');
    const sharedWishlists = this.loadFromLocalStorage('shared_wishlists');
    const sharingLinks = this.loadFromLocalStorage('sharing_links');
    
    if (wishlists) this.wishlists = new Map(Object.entries(wishlists));
    if (sharedWishlists) this.sharedWishlists = new Map(Object.entries(sharedWishlists));
    if (sharingLinks) this.sharingLinks = new Map(Object.entries(sharingLinks));
  }

  // Create new wishlist
  createWishlist(userId, name, description = '', isPublic = false, isCollaborative = false) {
    const wishlist = {
      id: this.generateId(),
      userId,
      name,
      description,
      isPublic,
      isCollaborative,
      items: [],
      collaborators: isCollaborative ? [userId] : [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      views: 0,
      shares: 0,
      tags: [],
      category: 'general'
    };
    
    this.wishlists.set(wishlist.id, wishlist);
    this.saveToLocalStorage('user_wishlists', this.mapToObject(this.wishlists));
    
    return wishlist;
  }

  // Add item to wishlist
  addItemToWishlist(wishlistId, item) {
    const wishlist = this.wishlists.get(wishlistId);
    if (!wishlist) return false;
    
    // Check if item already exists
    const existingItem = wishlist.items.find(i => i.productId === item.productId);
    if (existingItem) return false;
    
    const wishlistItem = {
      id: this.generateId(),
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      brand: item.brand,
      category: item.category,
      addedAt: Date.now(),
      addedBy: item.addedBy || wishlist.userId,
      priority: item.priority || 'normal',
      notes: item.notes || '',
      tags: item.tags || []
    };
    
    wishlist.items.push(wishlistItem);
    wishlist.updatedAt = Date.now();
    
    this.wishlists.set(wishlistId, wishlist);
    this.saveToLocalStorage('user_wishlists', this.mapToObject(this.wishlists));
    
    return wishlistItem;
  }

  // Share wishlist
  shareWishlist(wishlistId, shareOptions = {}) {
    const wishlist = this.wishlists.get(wishlistId);
    if (!wishlist) return false;
    
    const shareToken = this.generateShareToken();
    const shareLink = this.generateShareLink(wishlistId, shareToken);
    
    const shareData = {
      wishlistId,
      shareToken,
      shareLink,
      expiresAt: Date.now() + (shareOptions.expiresIn || 30) * 24 * 60 * 60 * 1000, // Default 30 days
      allowEdit: shareOptions.allowEdit || false,
      allowComment: shareOptions.allowComment || true,
      password: shareOptions.password || null,
      maxViews: shareOptions.maxViews || null,
      currentViews: 0,
      createdAt: Date.now()
    };
    
    this.sharingLinks.set(shareToken, shareData);
    wishlist.shares++;
    wishlist.updatedAt = Date.now();
    
    this.saveToLocalStorage('sharing_links', this.mapToObject(this.sharingLinks));
    this.saveToLocalStorage('user_wishlists', this.mapToObject(this.wishlists));
    
    return {
      shareLink,
      shareToken,
      expiresAt: shareData.expiresAt
    };
  }

  // Access shared wishlist
  accessSharedWishlist(shareToken, password = null) {
    const shareData = this.sharingLinks.get(shareToken);
    if (!shareData) return false;
    
    // Check if expired
    if (Date.now() > shareData.expiresAt) {
      return { error: 'expired', message: 'This wishlist has expired' };
    }
    
    // Check password
    if (shareData.password && shareData.password !== password) {
      return { error: 'password', message: 'Incorrect password' };
    }
    
    // Check view limit
    if (shareData.maxViews && shareData.currentViews >= shareData.maxViews) {
      return { error: 'limit', message: 'View limit exceeded' };
    }
    
    const wishlist = this.wishlists.get(shareData.wishlistId);
    if (!wishlist) return false;
    
    // Increment view count
    shareData.currentViews++;
    wishlist.views++;
    
    // Create shared wishlist copy
    const sharedWishlist = {
      ...wishlist,
      isShared: true,
      shareData: {
        allowEdit: shareData.allowEdit,
        allowComment: shareData.allowComment,
        expiresAt: shareData.expiresAt,
        currentViews: shareData.currentViews,
        maxViews: shareData.maxViews
      }
    };
    
    this.sharedWishlists.set(shareToken, sharedWishlist);
    this.saveToLocalStorage('shared_wishlists', this.mapToObject(this.sharedWishlists));
    
    return sharedWishlist;
  }

  // Add collaborator to wishlist
  addCollaborator(wishlistId, userId, email, role = 'viewer') {
    const wishlist = this.wishlists.get(wishlistId);
    if (!wishlist || !wishlist.isCollaborative) return false;
    
    const collaborator = {
      id: this.generateId(),
      userId,
      email,
      role, // 'viewer', 'editor', 'admin'
      addedAt: Date.now(),
      addedBy: wishlist.userId,
      permissions: this.getRolePermissions(role)
    };
    
    wishlist.collaborators.push(collaborator);
    wishlist.updatedAt = Date.now();
    
    this.wishlists.set(wishlistId, wishlist);
    this.saveToLocalStorage('user_wishlists', this.mapToObject(this.wishlists));
    
    return collaborator;
  }

  // Add comment to shared wishlist
  addComment(wishlistId, userId, comment) {
    const wishlist = this.sharedWishlists.get(wishlistId);
    if (!wishlist) return false;
    
    const commentData = {
      id: this.generateId(),
      userId,
      comment,
      createdAt: Date.now(),
      replies: []
    };
    
    if (!wishlist.comments) {
      wishlist.comments = [];
    }
    
    wishlist.comments.push(commentData);
    wishlist.updatedAt = Date.now();
    
    this.sharedWishlists.set(wishlistId, wishlist);
    this.saveToLocalStorage('shared_wishlists', this.mapToObject(this.sharedWishlists));
    
    return commentData;
  }

  // Generate share link
  generateShareLink(wishlistId, shareToken) {
    const baseUrl = window.location.origin;
    return `${baseUrl}/wishlist/shared/${shareToken}`;
  }

  // Generate share token
  generateShareToken() {
    return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  // Get role permissions
  getRolePermissions(role) {
    const permissions = {
      viewer: {
        canView: true,
        canEdit: false,
        canDelete: false,
        canAddItems: false,
        canRemoveItems: false,
        canShare: false,
        canComment: true
      },
      editor: {
        canView: true,
        canEdit: true,
        canDelete: false,
        canAddItems: true,
        canRemoveItems: true,
        canShare: false,
        canComment: true
      },
      admin: {
        canView: true,
        canEdit: true,
        canDelete: true,
        canAddItems: true,
        canRemoveItems: true,
        canShare: true,
        canComment: true
      }
    };
    
    return permissions[role] || permissions.viewer;
  }

  // Get user wishlists
  getUserWishlists(userId) {
    return Array.from(this.wishlists.values())
      .filter(wishlist => wishlist.userId === userId)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  // Get shared wishlists for user
  getSharedWishlistsForUser(userId) {
    return Array.from(this.sharedWishlists.values())
      .filter(wishlist => 
        wishlist.collaborators && 
        wishlist.collaborators.some(collab => collab.userId === userId)
      );
  }

  // Get public wishlists
  getPublicWishlists(limit = 20, offset = 0) {
    return Array.from(this.wishlists.values())
      .filter(wishlist => wishlist.isPublic)
      .sort((a, b) => b.views - a.views)
      .slice(offset, offset + limit);
  }

  // Search wishlists
  searchWishlists(query, filters = {}) {
    const allWishlists = Array.from(this.wishlists.values());
    
    return allWishlists.filter(wishlist => {
      // Search in name and description
      const matchesQuery = !query || 
        wishlist.name.toLowerCase().includes(query.toLowerCase()) ||
        wishlist.description.toLowerCase().includes(query.toLowerCase());
      
      // Apply filters
      const matchesCategory = !filters.category || wishlist.category === filters.category;
      const matchesPublic = filters.public === undefined || wishlist.isPublic === filters.public;
      const matchesCollaborative = filters.collaborative === undefined || 
        wishlist.isCollaborative === filters.collaborative;
      
      return matchesQuery && matchesCategory && matchesPublic && matchesCollaborative;
    });
  }

  // Get wishlist statistics
  getWishlistStats(wishlistId) {
    const wishlist = this.wishlists.get(wishlistId);
    if (!wishlist) return null;
    
    const totalItems = wishlist.items.length;
    const totalPrice = wishlist.items.reduce((sum, item) => sum + item.price, 0);
    const averagePrice = totalItems > 0 ? totalPrice / totalItems : 0;
    
    const categories = [...new Set(wishlist.items.map(item => item.category))];
    const brands = [...new Set(wishlist.items.map(item => item.brand))];
    
    const priceRanges = {
      under5000: wishlist.items.filter(item => item.price < 5000).length,
      between5k15k: wishlist.items.filter(item => item.price >= 5000 && item.price < 15000).length,
      between15k50k: wishlist.items.filter(item => item.price >= 15000 && item.price < 50000).length,
      over50k: wishlist.items.filter(item => item.price >= 50000).length
    };
    
    return {
      totalItems,
      totalPrice,
      averagePrice,
      categories,
      brands,
      priceRanges,
      views: wishlist.views,
      shares: wishlist.shares,
      collaborators: wishlist.collaborators.length,
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt
    };
  }

  // Generate sharing suggestions
  generateSharingSuggestions(wishlistId) {
    const wishlist = this.wishlists.get(wishlistId);
    if (!wishlist) return [];
    
    const suggestions = [];
    
    // Suggest sharing if wishlist has multiple items
    if (wishlist.items.length > 3 && !wishlist.isPublic) {
      suggestions.push({
        type: 'share_public',
        title: 'Share with Friends',
        description: 'Your wishlist has multiple items - share it with friends!',
        action: 'share_public',
        priority: 'high'
      });
    }
    
    // Suggest collaborative shopping
    if (wishlist.items.length > 5 && !wishlist.isCollaborative) {
      suggestions.push({
        type: 'collaborative',
        title: 'Collaborative Shopping',
        description: 'Make this a collaborative wishlist for group shopping',
        action: 'make_collaborative',
        priority: 'medium'
      });
    }
    
    // Suggest price alerts
    const highValueItems = wishlist.items.filter(item => item.price > 20000);
    if (highValueItems.length > 0) {
      suggestions.push({
        type: 'price_alert',
        title: 'Set Price Alerts',
        description: `You have ${highValueItems.length} high-value items - set price alerts!`,
        action: 'set_price_alerts',
        priority: 'medium'
      });
    }
    
    return suggestions;
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

  // Convert Map to Object
  mapToObject(map) {
    const obj = {};
    for (const [key, value] of map.entries()) {
      obj[key] = value;
    }
    return obj;
  }

  // Export wishlist
  exportWishlist(wishlistId, format = 'json') {
    const wishlist = this.wishlists.get(wishlistId);
    if (!wishlist) return false;
    
    switch (format) {
      case 'json':
        return JSON.stringify(wishlist, null, 2);
      
      case 'csv':
        const headers = ['Name', 'Price', 'Brand', 'Category', 'Added Date'];
        const rows = wishlist.items.map(item => [
          item.name,
          item.price,
          item.brand,
          item.category,
          new Date(item.addedAt).toLocaleDateString()
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
      
      case 'text':
        return `Wishlist: ${wishlist.name}\n` +
               `Description: ${wishlist.description}\n` +
               `Items: ${wishlist.items.length}\n\n` +
               wishlist.items.map((item, index) => 
                 `${index + 1}. ${item.name} - ${item.price} ETB`
               ).join('\n');
      
      default:
        return false;
    }
  }

  // Import wishlist
  importWishlist(userId, data, format = 'json') {
    try {
      let items = [];
      
      switch (format) {
        case 'json':
          const imported = JSON.parse(data);
          items = imported.items || [];
          break;
          
        case 'csv':
          const lines = data.split('\n');
          const headers = lines[0].split(',');
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length >= 4) {
              items.push({
                name: values[0],
                price: parseFloat(values[1]),
                brand: values[2],
                category: values[3]
              });
            }
          }
          break;
      }
      
      // Create new wishlist
      const wishlist = this.createWishlist(userId, 'Imported Wishlist', 'Imported from external source');
      
      // Add items to wishlist
      items.forEach(item => {
        this.addItemToWishlist(wishlist.id, item);
      });
      
      return wishlist;
    } catch (error) {
      console.error('Error importing wishlist:', error);
      return false;
    }
  }
}

module.exports = WishlistSharingSystem;
