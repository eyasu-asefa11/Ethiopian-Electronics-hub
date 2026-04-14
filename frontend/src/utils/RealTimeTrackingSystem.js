// Real-time Tracking System for Ethiopian Electronics Marketplace
class RealTimeTrackingSystem {
  constructor() {
    this.trackingData = new Map();
    this.activeTrackings = new Map();
    this.trackingSubscribers = new Map();
    this.locationUpdates = new Map();
    this.deliveryEvents = new Map();
    this.ETL = new Map();
    this.geofences = new Map();
    
    this.initializeGeofences();
    this.initializeFromStorage();
  }

  // Initialize geofences
  initializeGeofences() {
    const geofences = {
      'addis_ababa_center': {
        id: 'addis_ababa_center',
        name: 'Addis Ababa City Center',
        coordinates: { lat: 9.1450, lng: 40.4897 },
        radius: 5000, // 5km
        type: 'circle',
        notifications: ['entry', 'exit'],
        actions: ['notify_customer', 'update_status']
      },
      'mekelle_hub': {
        id: 'mekelle_hub',
        name: 'Mekelle Delivery Hub',
        coordinates: { lat: 13.4967, lng: 39.4733 },
        radius: 2000, // 2km
        type: 'circle',
        notifications: ['entry'],
        actions: ['notify_customer', 'update_status']
      },
      'dire_dawa_facility': {
        id: 'dire_dawa_facility',
        name: 'Dire Dawa Facility',
        coordinates: { lat: 9.5944, lng: 41.8661 },
        radius: 1500, // 1.5km
        type: 'circle',
        notifications: ['entry'],
        actions: ['notify_customer', 'update_status']
      },
      'bahir_dar_warehouse': {
        id: 'bahir_dar_warehouse',
        name: 'Bahir Dar Warehouse',
        coordinates: { lat: 11.5761, lng: 37.3617 },
        radius: 3000, // 3km
        type: 'circle',
        notifications: ['entry'],
        actions: ['notify_customer', 'update_status']
      }
    };

    geofences.forEach((geofence, key) => {
      this.geofences.set(key, geofence);
    });
  }

  // Initialize from local storage
  initializeFromStorage() {
    const trackingData = this.loadFromLocalStorage('tracking_data');
    const activeTrackings = this.loadFromLocalStorage('active_trackings');
    const locationUpdates = this.loadFromLocalStorage('location_updates');
    
    if (trackingData) this.trackingData = new Map(Object.entries(trackingData));
    if (activeTrackings) this.activeTrackings = new Map(Object.entries(activeTrackings));
    if (locationUpdates) this.locationUpdates = new Map(Object.entries(locationUpdates));
  }

  // Start real-time tracking
  startTracking(trackingNumber, deliveryInfo) {
    const tracking = {
      trackingNumber,
      deliveryInfo,
      status: 'active',
      currentLocation: deliveryInfo.pickupLocation,
      destination: deliveryInfo.deliveryLocation,
      estimatedArrival: this.calculateEstimatedArrival(deliveryInfo),
      createdAt: Date.now(),
      lastUpdate: Date.now(),
      route: [],
      events: [],
      geofenceStatus: {},
      speed: 0,
      heading: 0,
      accuracy: 0,
      battery: 100,
      signal: 100
    };

    this.activeTrackings.set(trackingNumber, tracking);
    this.saveToLocalStorage('active_trackings', this.mapToObject(this.activeTrackings));

    // Start location simulation (in production, this would receive real GPS data)
    this.startLocationSimulation(trackingNumber);

    return tracking;
  }

  // Start location simulation
  startLocationSimulation(trackingNumber) {
    const tracking = this.activeTrackings.get(trackingNumber);
    if (!tracking) return;

    const simulationInterval = setInterval(() => {
      const currentTracking = this.activeTrackings.get(trackingNumber);
      if (!currentTracking || currentTracking.status !== 'active') {
        clearInterval(simulationInterval);
        return;
      }

      // Generate mock location update
      const locationUpdate = this.generateMockLocationUpdate(currentTracking);
      this.updateLocation(trackingNumber, locationUpdate);
    }, 5000); // Update every 5 seconds

    // Store interval ID for cleanup
    tracking.simulationInterval = simulationInterval;
  }

  // Generate mock location update
  generateMockLocationUpdate(tracking) {
    const progress = this.calculateProgress(tracking);
    const currentLocation = this.interpolateLocation(tracking.currentLocation, tracking.destination, progress);
    
    // Add some randomness for realism
    const randomOffset = {
      lat: (Math.random() - 0.5) * 0.001,
      lng: (Math.random() - 0.5) * 0.001
    };

    return {
      latitude: currentLocation.lat + randomOffset.lat,
      longitude: currentLocation.lng + randomOffset.lng,
      accuracy: 10 + Math.random() * 20,
      speed: 20 + Math.random() * 40, // 20-60 km/h
      heading: this.calculateHeading(tracking.currentLocation, currentLocation),
      timestamp: Date.now(),
      battery: Math.max(20, tracking.battery - Math.random() * 2),
      signal: Math.max(30, 90 + Math.random() * 10)
    };
  }

  // Update location
  updateLocation(trackingNumber, locationUpdate) {
    const tracking = this.activeTrackings.get(trackingNumber);
    if (!tracking) return;

    const previousLocation = { ...tracking.currentLocation };
    
    // Update tracking data
    tracking.currentLocation = {
      lat: locationUpdate.latitude,
      lng: locationUpdate.longitude
    };
    tracking.lastUpdate = locationUpdate.timestamp;
    tracking.speed = locationUpdate.speed;
    tracking.heading = locationUpdate.heading;
    tracking.accuracy = locationUpdate.accuracy;
    tracking.battery = locationUpdate.battery;
    tracking.signal = locationUpdate.signal;

    // Add to route
    tracking.route.push({
      location: { ...tracking.currentLocation },
      timestamp: locationUpdate.timestamp,
      speed: locationUpdate.speed,
      heading: locationUpdate.heading
    });

    // Check geofences
    this.checkGeofences(trackingNumber, previousLocation, tracking.currentLocation);

    // Update estimated arrival
    tracking.estimatedArrival = this.calculateEstimatedArrival({
      ...tracking.deliveryInfo,
      currentLocation: tracking.currentLocation
    });

    // Store location update
    this.locationUpdates.set(`${trackingNumber}_${locationUpdate.timestamp}`, {
      trackingNumber,
      location: tracking.currentLocation,
      timestamp: locationUpdate.timestamp,
      speed: locationUpdate.speed,
      heading: locationUpdate.heading
    });

    // Notify subscribers
    this.notifySubscribers(trackingNumber, 'location_update', {
      location: tracking.currentLocation,
      speed: locationUpdate.speed,
      heading: locationUpdate.heading,
      estimatedArrival: tracking.estimatedArrival,
      progress: this.calculateProgress(tracking)
    });

    // Check if delivery is complete
    if (this.isNearDestination(tracking)) {
      this.completeDelivery(trackingNumber);
    }

    this.saveToLocalStorage('active_trackings', this.mapToObject(this.activeTrackings));
    this.saveToLocalStorage('location_updates', this.mapToObject(this.locationUpdates));
  }

  // Check geofences
  checkGeofences(trackingNumber, previousLocation, currentLocation) {
    const tracking = this.activeTrackings.get(trackingNumber);
    if (!tracking) return;

    this.geofences.forEach((geofence, geofenceId) => {
      const wasInside = this.isPointInGeofence(previousLocation, geofence);
      const isInside = this.isPointInGeofence(currentLocation, geofence);

      // Entry event
      if (!wasInside && isInside) {
        this.handleGeofenceEvent(trackingNumber, geofenceId, 'entry');
      }

      // Exit event
      if (wasInside && !isInside) {
        this.handleGeofenceEvent(trackingNumber, geofenceId, 'exit');
      }
    });
  }

  // Check if point is in geofence
  isPointInGeofence(location, geofence) {
    const distance = this.calculateDistance(location, geofence.coordinates);
    return distance <= geofence.radius;
  }

  // Handle geofence event
  handleGeofenceEvent(trackingNumber, geofenceId, eventType) {
    const tracking = this.activeTrackings.get(trackingNumber);
    const geofence = this.geofences.get(geofenceId);
    
    if (!tracking || !geofence) return;

    const event = {
      id: this.generateId(),
      trackingNumber,
      geofenceId,
      geofenceName: geofence.name,
      eventType,
      location: { ...tracking.currentLocation },
      timestamp: Date.now()
    };

    // Add to tracking events
    tracking.events.push(event);

    // Update geofence status
    tracking.geofenceStatus[geofenceId] = eventType;

    // Execute actions
    if (geofence.notifications.includes(eventType)) {
      this.notifySubscribers(trackingNumber, 'geofence_event', {
        geofenceId,
        geofenceName: geofence.name,
        eventType,
        location: tracking.currentLocation,
        message: `Delivery ${eventType} ${geofence.name}`
      });
    }

    if (geofence.actions.includes(eventType)) {
      this.executeGeofenceActions(trackingNumber, geofenceId, eventType);
    }
  }

  // Execute geofence actions
  executeGeofenceActions(trackingNumber, geofenceId, eventType) {
    const tracking = this.activeTrackings.get(trackingNumber);
    const geofence = this.geofences.get(geofenceId);
    
    if (!tracking || !geofence) return;

    // Update status based on geofence
    if (eventType === 'entry') {
      if (geofenceId === tracking.destination.id) {
        tracking.status = 'arrived';
        this.notifySubscribers(trackingNumber, 'status_update', {
          status: 'arrived',
          message: `Delivery has arrived at ${geofence.name}`
        });
      }
    }

    // Store delivery event
    this.deliveryEvents.set(`${trackingNumber}_${geofenceId}_${eventType}`, {
      trackingNumber,
      geofenceId,
      eventType,
      timestamp: Date.now(),
      location: tracking.currentLocation
    });
  }

  // Subscribe to tracking updates
  subscribe(trackingNumber, callback) {
    if (!this.trackingSubscribers.has(trackingNumber)) {
      this.trackingSubscribers.set(trackingNumber, new Set());
    }
    
    this.trackingSubscribers.get(trackingNumber).add(callback);
    
    // Return unsubscribe function
    return () => {
      const subscribers = this.trackingSubscribers.get(trackingNumber);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          this.trackingSubscribers.delete(trackingNumber);
        }
      }
    };
  }

  // Notify subscribers
  notifySubscribers(trackingNumber, eventType, data) {
    const subscribers = this.trackingSubscribers.get(trackingNumber);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback({
            eventType,
            trackingNumber,
            timestamp: Date.now(),
            data
          });
        } catch (error) {
          console.error('Error notifying subscriber:', error);
        }
      });
    }
  }

  // Get real-time tracking data
  getTrackingData(trackingNumber) {
    const tracking = this.activeTrackings.get(trackingNumber);
    if (!tracking) {
      // Check history
      const history = this.getTrackingHistory(trackingNumber);
      return history[history.length - 1] || null;
    }

    return {
      trackingNumber,
      status: tracking.status,
      currentLocation: tracking.currentLocation,
      destination: tracking.destination,
      estimatedArrival: tracking.estimatedArrival,
      progress: this.calculateProgress(tracking),
      speed: tracking.speed,
      heading: tracking.heading,
      accuracy: tracking.accuracy,
      battery: tracking.battery,
      signal: tracking.signal,
      lastUpdate: tracking.lastUpdate,
      route: tracking.route,
      events: tracking.events,
      geofenceStatus: tracking.geofenceStatus
    };
  }

  // Get tracking history
  getTrackingHistory(trackingNumber, limit = 100) {
    const history = [];
    
    // Get from active tracking
    const active = this.activeTrackings.get(trackingNumber);
    if (active) {
      history.push(active);
    }

    // Get from stored data
    for (const [key, data] of this.trackingData.entries()) {
      if (key.startsWith(trackingNumber)) {
        history.push(data);
      }
    }

    return history
      .sort((a, b) => b.lastUpdate - a.lastUpdate)
      .slice(0, limit);
  }

  // Get location updates
  getLocationUpdates(trackingNumber, limit = 50) {
    const updates = [];
    
    for (const [key, update] of this.locationUpdates.entries()) {
      if (key.startsWith(trackingNumber)) {
        updates.push(update);
      }
    }

    return updates
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  // Calculate progress
  calculateProgress(tracking) {
    const totalDistance = this.calculateDistance(tracking.deliveryInfo.pickupLocation, tracking.destination);
    const coveredDistance = this.calculateCoveredDistance(tracking.route);
    return Math.min(100, (coveredDistance / totalDistance) * 100);
  }

  // Calculate covered distance
  calculateCoveredDistance(route) {
    if (route.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < route.length; i++) {
      totalDistance += this.calculateDistance(route[i-1].location, route[i].location);
    }

    return totalDistance;
  }

  // Calculate estimated arrival
  calculateEstimatedArrival(deliveryInfo) {
    const now = Date.now();
    const baseTime = 2 * 60 * 60 * 1000; // 2 hours base
    const distance = this.calculateDistance(deliveryInfo.currentLocation || deliveryInfo.pickupLocation, deliveryInfo.deliveryLocation);
    const distanceFactor = distance / 50; // Adjust based on distance
    const estimatedTime = now + (baseTime * (1 + distanceFactor));
    
    return new Date(estimatedTime);
  }

  // Calculate distance between two points
  calculateDistance(point1, point2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLon = this.toRadians(point2.lng - point1.lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Interpolate location between two points
  interpolateLocation(start, end, progress) {
    return {
      lat: start.lat + (end.lat - start.lat) * progress,
      lng: start.lng + (end.lng - start.lng) * progress
    };
  }

  // Calculate heading
  calculateHeading(from, to) {
    const dLon = this.toRadians(to.lng - from.lng);
    const lat1 = this.toRadians(from.lat);
    const lat2 = this.toRadians(to.lat);
    
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    
    let heading = Math.atan2(y, x) * (180 / Math.PI);
    heading = (heading + 360) % 360;
    
    return Math.round(heading);
  }

  // Convert degrees to radians
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Check if near destination
  isNearDestination(tracking) {
    const distance = this.calculateDistance(tracking.currentLocation, tracking.destination);
    return distance <= 0.5; // Within 500 meters
  }

  // Complete delivery
  completeDelivery(trackingNumber) {
    const tracking = this.activeTrackings.get(trackingNumber);
    if (!tracking) return;

    tracking.status = 'completed';
    tracking.completedAt = Date.now();
    
    // Move to history
    this.trackingData.set(trackingNumber, tracking);
    this.activeTrackings.delete(trackingNumber);
    
    // Clean up simulation
    if (tracking.simulationInterval) {
      clearInterval(tracking.simulationInterval);
    }

    // Notify subscribers
    this.notifySubscribers(trackingNumber, 'delivery_completed', {
      completedAt: tracking.completedAt,
      finalLocation: tracking.currentLocation,
      message: 'Delivery completed successfully'
    });

    this.saveToLocalStorage('active_trackings', this.mapToObject(this.activeTrackings));
    this.saveToLocalStorage('tracking_data', this.mapToObject(this.trackingData));
  }

  // Get delivery statistics
  getTrackingStatistics() {
    const active = Array.from(this.activeTrackings.values());
    const history = Array.from(this.trackingData.values());
    
    return {
      totalTrackings: active.length + history.length,
      activeTrackings: active.length,
      completedTrackings: history.length,
      averageSpeed: this.calculateAverageSpeed(active, history),
      averageAccuracy: this.calculateAverageAccuracy(active, history),
      geofenceEvents: this.deliveryEvents.size,
      trackingByStatus: this.getTrackingByStatus(active, history),
      popularGeofences: this.getPopularGeofences()
    };
  }

  getTrackingByStatus(active, history) {
    const allTrackings = [...active, ...history];
    const breakdown = {};
    
    allTrackings.forEach(tracking => {
      breakdown[tracking.status] = (breakdown[tracking.status] || 0) + 1;
    });
    
    return breakdown;
  }

  calculateAverageSpeed(active, history) {
    const allTrackings = [...active, ...history];
    if (allTrackings.length === 0) return 0;
    
    const totalSpeed = allTrackings.reduce((sum, tracking) => {
      if (tracking.route && tracking.route.length > 0) {
        const avgSpeed = tracking.route.reduce((sum, point) => sum + point.speed, 0) / tracking.route.length;
        return sum + avgSpeed;
      }
      return sum;
    }, 0);
    
    return totalSpeed / allTrackings.length;
  }

  calculateAverageAccuracy(active, history) {
    const allTrackings = [...active, ...history];
    if (allTrackings.length === 0) return 0;
    
    const totalAccuracy = allTrackings.reduce((sum, tracking) => sum + tracking.accuracy, 0);
    return totalAccuracy / allTrackings.length;
  }

  getPopularGeofences() {
    const geofenceCounts = {};
    
    this.deliveryEvents.forEach((event, key) => {
      geofenceCounts[event.geofenceId] = (geofenceCounts[event.geofenceId] || 0) + 1;
    });

    return Object.entries(geofenceCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([id, count]) => ({
        id,
        count,
        name: this.geofences.get(id)?.name || id
      }));
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

module.exports = RealTimeTrackingSystem;
