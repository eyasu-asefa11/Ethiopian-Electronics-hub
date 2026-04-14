// Delivery Time Slots System for Ethiopian Electronics Marketplace
class DeliveryTimeSlotsSystem {
  constructor() {
    this.timeSlots = new Map();
    this.partnerSlots = new Map();
    this.bookings = new Map();
    this.availability = new Map();
    this.holidays = new Map();
    this.blackoutDates = new Map();
    
    this.initializeTimeSlots();
    thisInitializeHolidays();
    this.initializeFromStorage();
  }

  // Initialize time slots
  initializeTimeSlots() {
    const timeSlots = {
      'morning': {
        id: 'morning',
        name: 'Morning Delivery',
        slots: [
          { start: '08:00', end: '10:00', capacity: 10, price: 0 },
          { start: '10:00', end: '12:00', capacity: 10, price: 0 }
        ],
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        cutoffTime: '06:00',
        description: '8:00 AM - 12:00 PM delivery window'
      },
      'afternoon': {
        id: 'afternoon',
        name: 'Afternoon Delivery',
        slots: [
          { start: '12:00', end: '14:00', capacity: 10, price: 0 },
          { start: '14:00', end: '16:00', capacity: 10, price: 0 },
          { start: '16:00', end: '18:00', capacity: 10, price: 5 }
        ],
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        cutoffTime: '10:00',
        description: '12:00 PM - 6:00 PM delivery window'
      },
      'evening': {
        id: 'evening',
        name: 'Evening Delivery',
        slots: [
          { start: '18:00', end: '20:00', capacity: 8, price: 10 },
          { start: '20:00', end: '22:00', capacity: 5, price: 15 }
        ],
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        cutoffTime: '14:00',
        description: '6:00 PM - 10:00 PM delivery window'
      },
      'express': {
        id: 'express',
        name: 'Express Delivery',
        slots: [
          { start: '09:00', end: '11:00', capacity: 5, price: 20 },
          { start: '11:00', end: '13:00', capacity: 5, price: 20 },
          { start: '14:00', end: '16:00', capacity: 5, price: 20 },
          { start: '16:00', end: '18:00', capacity: 5, price: 25 }
        ],
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        cutoffTime: '08:00',
        description: 'Priority 2-hour delivery window'
      },
      'same_day': {
        id: 'same_day',
        name: 'Same Day Delivery',
        slots: [
          { start: '10:00', end: '12:00', capacity: 3, price: 30 },
          { start: '12:00', end: '14:00', capacity: 3, price: 30 },
          { start: '14:00', end: '16:00', capacity: 3, price: 35 },
          { start: '16:00', end: '18:00', capacity: 3, price: 35 }
        ],
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        cutoffTime: '09:00',
        description: 'Same day express delivery'
      },
      'weekend': {
        id: 'weekend',
        name: 'Weekend Delivery',
        slots: [
          { start: '09:00', end: '11:00', capacity: 8, price: 15 },
          { start: '11:00', end: '13:00', capacity: 8, price: 15 },
          { start: '14:00', end: '16:00', capacity: 8, price: 20 },
          { start: '16:00', end: '18:00', capacity: 6, price: 20 }
        ],
        workingDays: ['saturday', 'sunday'],
        cutoffTime: '08:00',
        description: 'Weekend delivery with extended hours'
      },
      'priority': {
        id: 'priority',
        name: 'Priority Delivery',
        slots: [
          { start: '08:00', end: '10:00', capacity: 2, price: 50 },
          { start: '10:00', end: '12:00', capacity: 2, price: 50 },
          { start: '14:00', end: '16:00', capacity: 2, price: 60 },
          { start: '16:00', end: '18:00', capacity: 2, price: 60 }
        ],
        workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        cutoffTime: '06:00',
        description: 'Premium priority delivery service'
      }
    };

    timeSlots.forEach((timeSlot, key) => {
      this.timeSlots.set(key, timeSlot);
    });
  }

  // Initialize holidays
  initializeHolidays() {
    const holidays = {
      'new_year': {
        id: 'new_year',
        name: 'Ethiopian New Year',
        date: '2024-09-11',
        type: 'public_holiday',
        slotsAvailable: false,
        message: 'No delivery available on Ethiopian New Year'
      },
      'meskel': {
        id: 'meskel',
        name: 'Meskel',
        date: '2024-09-27',
        type: 'public_holiday',
        slotsAvailable: false,
        message: 'No delivery available on Meskel'
      },
      'eid_al_fitr': {
        id: 'eid_al_fitr',
        name: 'Eid al-Fitr',
        date: '2024-04-10',
        type: 'public_holiday',
        slotsAvailable: false,
        message: 'No delivery available on Eid al-Fitr'
      },
      'eid_al_adha': {
        id: 'eid_al_adha',
        name: 'Eid al-Adha',
        date: '2024-06-17',
        type: 'public_holiday',
        slotsAvailable: false,
        message: 'No delivery available on Eid al-Adha'
      },
      'christmas': {
        id: 'christmas',
        name: 'Christmas',
        date: '2024-01-07',
        type: 'public_holiday',
        slotsAvailable: false,
        message: 'No delivery available on Christmas'
      },
      'timkat': {
        id: 'timkat',
        name: 'Timkat',
        date: '2024-01-19',
        type: 'public_holiday',
        slotsAvailable: false,
        message: 'No delivery available on Timkat'
      },
      'good_friday': {
        id: 'good_friday',
        name: 'Good Friday',
        date: '2024-04-05',
        type: 'public_holiday',
        slotsAvailable: false,
        message: 'No delivery available on Good Friday'
      },
      'easter': {
        id: 'easter',
        name: 'Easter',
        date: '2024-04-08',
        type: 'public_holiday',
        slotsAvailable: false,
        message: 'No delivery available on Easter'
      }
    };

    holidays.forEach((holiday, key) => {
      this.holidays.set(key, holiday);
    });
  }

  // Initialize from local storage
  initializeFromStorage() {
    const bookings = this.loadFromLocalStorage('delivery_bookings');
    const availability = this.loadFromLocalStorage('slot_availability');
    
    if (bookings) this.bookings = new Map(Object.entries(bookings));
    if (availability) this.availability = new Map(Object.entries(availability));
  }

  // Get available time slots for a specific date
  getAvailableTimeSlots(date, partnerId = null, deliveryType = 'standard') {
    const dateObj = new Date(date);
    const dayOfWeek = this.getDayOfWeek(dateObj);
    const dateString = this.formatDate(dateObj);

    // Check if date is a holiday
    const holiday = this.getHoliday(dateString);
    if (holiday && !holiday.slotsAvailable) {
      return {
        available: false,
        message: holiday.message,
        slots: []
      };
    }

    // Check blackout dates
    const blackoutDate = this.getBlackoutDate(dateString);
    if (blackoutDate) {
      return {
        available: false,
        message: blackoutDate.reason,
        slots: []
      };
    }

    // Get available slots based on delivery type
    let availableSlots = [];
    
    switch (deliveryType) {
      case 'standard':
        availableSlots = this.getStandardSlots(dayOfWeek);
        break;
      case 'express':
        availableSlots = this.getExpressSlots(dayOfWeek);
        break;
      case 'same_day':
        availableSlots = this.getSameDaySlots(dayOfWeek);
        break;
      case 'priority':
        availableSlots = this.getPrioritySlots(dayOfWeek);
        break;
      case 'weekend':
        availableSlots = this.getWeekendSlots(dayOfWeek);
        break;
      default:
        availableSlots = this.getStandardSlots(dayOfWeek);
    }

    // Filter by partner if specified
    if (partnerId) {
      availableSlots = this.filterSlotsByPartner(availableSlots, partnerId);
    }

    // Check availability and capacity
    const slotsWithAvailability = availableSlots.map(slot => {
      const availability = this.getSlotAvailability(dateString, slot.id);
      return {
        ...slot,
        available: availability.available,
        bookedCount: availability.bookedCount,
        remainingCapacity: slot.capacity - availability.bookedCount,
        canBook: availability.bookedCount < slot.capacity
      };
    });

    return {
      available: true,
      date: dateString,
      dayOfWeek,
      deliveryType,
      slots: slotsWithAvailability,
      cutoffTime: this.getCutoffTime(deliveryType)
    };
  }

  // Get standard slots
  getStandardSlots(dayOfWeek) {
    const slots = [];
    
    ['morning', 'afternoon', 'evening'].forEach(periodId => {
      const period = this.timeSlots.get(periodId);
      if (period && period.workingDays.includes(dayOfWeek)) {
        period.slots.forEach(slot => {
          slots.push({
            id: `${periodId}_${slot.start.replace(':', '')}`,
            period: period.name,
            start: slot.start,
            end: slot.end,
            capacity: slot.capacity,
            price: slot.price,
            type: 'standard'
          });
        });
      }
    });

    return slots;
  }

  // Get express slots
  getExpressSlots(dayOfWeek) {
    const slots = [];
    const expressPeriod = this.timeSlots.get('express');
    
    if (expressPeriod && expressPeriod.workingDays.includes(dayOfWeek)) {
      expressPeriod.slots.forEach(slot => {
        slots.push({
          id: `express_${slot.start.replace(':', '')}`,
          period: expressPeriod.name,
          start: slot.start,
          end: slot.end,
          capacity: slot.capacity,
          price: slot.price,
          type: 'express'
        });
      });
    }

    return slots;
  }

  // Get same day slots
  getSameDaySlots(dayOfWeek) {
    const slots = [];
    const sameDayPeriod = this.timeSlots.get('same_day');
    
    if (sameDayPeriod && sameDayPeriod.workingDays.includes(dayOfWeek)) {
      sameDayPeriod.slots.forEach(slot => {
        slots.push({
          id: `same_day_${slot.start.replace(':', '')}`,
          period: sameDayPeriod.name,
          start: slot.start,
          end: slot.end,
          capacity: slot.capacity,
          price: slot.price,
          type: 'same_day'
        });
      });
    }

    return slots;
  }

  // Get priority slots
  getPrioritySlots(dayOfWeek) {
    const slots = [];
    const priorityPeriod = this.timeSlots.get('priority');
    
    if (priorityPeriod && priorityPeriod.workingDays.includes(dayOfWeek)) {
      priorityPeriod.slots.forEach(slot => {
        slots.push({
          id: `priority_${slot.start.replace(':', '')}`,
          period: priorityPeriod.name,
          start: slot.start,
          end: slot.end,
          capacity: slot.capacity,
          price: slot.price,
          type: 'priority'
        });
      });
    }

    return slots;
  }

  // Get weekend slots
  getWeekendSlots(dayOfWeek) {
    const slots = [];
    const weekendPeriod = this.timeSlots.get('weekend');
    
    if (weekendPeriod && weekendPeriod.workingDays.includes(dayOfWeek)) {
      weekendPeriod.slots.forEach(slot => {
        slots.push({
          id: `weekend_${slot.start.replace(':', '')}`,
          period: weekendPeriod.name,
          start: slot.start,
          end: slot.end,
          capacity: slot.capacity,
          price: slot.price,
          type: 'weekend'
        });
      });
    }

    return slots;
  }

  // Filter slots by partner
  filterSlotsByPartner(slots, partnerId) {
    // In production, this would check partner-specific availability
    // For now, return all slots
    return slots;
  }

  // Get slot availability
  getSlotAvailability(dateString, slotId) {
    const key = `${dateString}_${slotId}`;
    const availability = this.availability.get(key);
    
    if (availability) {
      return availability;
    }

    // Initialize availability if not exists
    const newAvailability = {
      date: dateString,
      slotId,
      bookedCount: 0,
      available: true
    };

    this.availability.set(key, newAvailability);
    this.saveToLocalStorage('slot_availability', this.mapToObject(this.availability));

    return newAvailability;
  }

  // Book time slot
  bookTimeSlot(date, slotId, bookingInfo) {
    const dateString = this.formatDate(new Date(date));
    const availability = this.getSlotAvailability(dateString, slotId);
    
    if (!availability.available) {
      throw new Error('Slot not available');
    }

    const slot = this.findSlotById(slotId);
    if (!slot) {
      throw new Error('Invalid slot ID');
    }

    // Check capacity
    if (availability.bookedCount >= slot.capacity) {
      throw new Error('Slot is fully booked');
    }

    // Create booking
    const booking = {
      id: this.generateId(),
      date: dateString,
      slotId,
      slot,
      customerInfo: bookingInfo.customerInfo,
      orderInfo: bookingInfo.orderInfo,
      status: 'confirmed',
      bookedAt: Date.now(),
      price: slot.price,
      deliveryType: slot.type
    };

    // Update availability
    availability.bookedCount++;
    availability.available = availability.bookedCount < slot.capacity;
    
    // Store booking
    this.bookings.set(booking.id, booking);
    
    // Save to storage
    this.saveToLocalStorage('slot_availability', this.mapToObject(this.availability));
    this.saveToLocalStorage('delivery_bookings', this.mapToObject(this.bookings));

    return booking;
  }

  // Cancel time slot booking
  cancelTimeSlot(bookingId, reason = '') {
    const booking = this.bookings.get(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Update availability
    const availability = this.getSlotAvailability(booking.date, booking.slotId);
    availability.bookedCount--;
    availability.available = true;

    // Update booking status
    booking.status = 'cancelled';
    booking.cancelledAt = Date.now();
    booking.cancelReason = reason;

    // Save to storage
    this.saveToLocalStorage('slot_availability', this.mapToObject(this.availability));
    this.saveToLocalStorage('delivery_bookings', this.mapToObject(this.bookings));

    return booking;
  }

  // Reschedule time slot
  rescheduleTimeSlot(bookingId, newDate, newSlotId) {
    const booking = this.bookings.get(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Cancel old booking
    this.cancelTimeSlot(bookingId, 'Rescheduled');

    // Create new booking
    const newBooking = this.bookTimeSlot(newDate, newSlotId, {
      customerInfo: booking.customerInfo,
      orderInfo: booking.orderInfo
    });

    // Copy original booking info
    newBooking.originalBookingId = booking.id;
    newBooking.rescheduledFrom = booking.date;
    newBooking.rescheduledTo = newDate;

    return newBooking;
  }

  // Get customer bookings
  getCustomerBookings(customerId, status = null) {
    const bookings = Array.from(this.bookings.values())
      .filter(booking => booking.customerInfo.id === customerId)
      .filter(booking => !status || booking.status === status)
      .sort((a, b) => b.bookedAt - a.bookedAt);

    return bookings;
  }

  // Get bookings by date
  getBookingsByDate(date, status = null) {
    const dateString = this.formatDate(new Date(date));
    
    return Array.from(this.bookings.values())
      .filter(booking => booking.date === dateString)
      .filter(booking => !status || booking.status === status)
      .sort((a, b) => a.slot.start.localeCompare(b.slot.start));
  }

  // Get available dates for a period
  getAvailableDates(startDate, endDate, deliveryType = 'standard') {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      const dateString = this.formatDate(date);
      const availableSlots = this.getAvailableTimeSlots(dateString, null, deliveryType);
      
      if (availableSlots.available && availableSlots.slots.some(slot => slot.canBook)) {
        dates.push({
          date: dateString,
          dayOfWeek: this.getDayOfWeek(date),
          availableSlots: availableSlots.slots.filter(slot => slot.canBook),
          cutoffTime: availableSlots.cutoffTime
        });
      }
    }

    return dates;
  }

  // Get cutoff time for delivery type
  getCutoffTime(deliveryType) {
    const timeSlot = this.timeSlots.get(deliveryType);
    return timeSlot ? timeSlot.cutoffTime : '12:00';
  }

  // Check if booking is still possible
  canBookForDate(date, deliveryType = 'standard') {
    const now = new Date();
    const bookingDate = new Date(date);
    const cutoffTime = this.getCutoffTime(deliveryType);
    
    // Check if date is in the past
    if (bookingDate < now) {
      return false;
    }

    // Check if it's same day booking
    if (this.formatDate(bookingDate) === this.formatDate(now)) {
      const [cutoffHour, cutoffMinute] = cutoffTime.split(':').map(Number);
      const cutoffDateTime = new Date(now);
      cutoffDateTime.setHours(cutoffHour, cutoffMinute, 0, 0);
      
      return now < cutoffDateTime;
    }

    return true;
  }

  // Get next available slot
  getNextAvailableSlot(deliveryType = 'standard', partnerId = null) {
    const now = new Date();
    const maxDate = new Date(now);
    maxDate.setDate(maxDate.getDate() + 30); // Look ahead 30 days

    for (let date = new Date(now); date <= maxDate; date.setDate(date.getDate() + 1)) {
      if (!this.canBookForDate(date, deliveryType)) {
        continue;
      }

      const availableSlots = this.getAvailableTimeSlots(date, partnerId, deliveryType);
      
      if (availableSlots.available) {
        const availableSlot = availableSlots.slots.find(slot => slot.canBook);
        if (availableSlot) {
          return {
            date: this.formatDate(date),
            slot: availableSlot,
            cutoffTime: availableSlots.cutoffTime
          };
        }
      }
    }

    return null;
  }

  // Get booking statistics
  getBookingStatistics() {
    const bookings = Array.from(this.bookings.values());
    const now = new Date();
    
    return {
      totalBookings: bookings.length,
      bookingsByStatus: this.getBookingsByStatus(bookings),
      bookingsByType: this.getBookingsByType(bookings),
      bookingsByDay: this.getBookingsByDay(bookings),
      bookingsByMonth: this.getBookingsByMonth(bookings),
      revenue: this.calculateRevenue(bookings),
      utilizationRate: this.calculateUtilizationRate(),
      popularSlots: this.getPopularSlots(bookings),
      cancellationRate: this.calculateCancellationRate(bookings)
    };
  }

  getBookingsByStatus(bookings) {
    const statusCount = {};
    bookings.forEach(booking => {
      statusCount[booking.status] = (statusCount[booking.status] || 0) + 1;
    });
    return statusCount;
  }

  getBookingsByType(bookings) {
    const typeCount = {};
    bookings.forEach(booking => {
      typeCount[booking.deliveryType] = (typeCount[booking.deliveryType] || 0) + 1;
    });
    return typeCount;
  }

  getBookingsByDay(bookings) {
    const dayCount = {};
    bookings.forEach(booking => {
      const day = new Date(booking.date).getDay();
      const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][day];
      dayCount[dayName] = (dayCount[dayName] || 0) + 1;
    });
    return dayCount;
  }

  getBookingsByMonth(bookings) {
    const monthCount = {};
    bookings.forEach(booking => {
      const month = new Date(booking.date).getMonth();
      const monthName = ['january', 'february', 'march', 'april', 'may', 'june', 
                        'july', 'august', 'september', 'october', 'november', 'december'][month];
      monthCount[monthName] = (monthCount[monthName] || 0) + 1;
    });
    return monthCount;
  }

  calculateRevenue(bookings) {
    return bookings
      .filter(booking => booking.status === 'confirmed')
      .reduce((total, booking) => total + booking.price, 0);
  }

  calculateUtilizationRate() {
    let totalCapacity = 0;
    let totalBooked = 0;

    this.availability.forEach(availability => {
      const slot = this.findSlotById(availability.slotId);
      if (slot) {
        totalCapacity += slot.capacity;
        totalBooked += availability.bookedCount;
      }
    });

    return totalCapacity > 0 ? (totalBooked / totalCapacity) * 100 : 0;
  }

  getPopularSlots(bookings) {
    const slotCount = {};
    bookings.forEach(booking => {
      const slotKey = `${booking.slot.period} - ${booking.slot.start}`;
      slotCount[slotKey] = (slotCount[slotKey] || 0) + 1;
    });

    return Object.entries(slotCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([slot, count]) => ({ slot, count }));
  }

  calculateCancellationRate(bookings) {
    const totalBookings = bookings.length;
    const cancelledBookings = bookings.filter(booking => booking.status === 'cancelled').length;
    
    return totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0;
  }

  // Helper methods
  findSlotById(slotId) {
    const [type, time] = slotId.split('_');
    const period = this.timeSlots.get(type);
    
    if (period) {
      return period.slots.find(slot => slot.start.replace(':', '') === time);
    }

    return null;
  }

  getDayOfWeek(date) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getHoliday(dateString) {
    for (const [key, holiday] of this.holidays.entries()) {
      if (holiday.date === dateString) {
        return holiday;
      }
    }
    return null;
  }

  getBlackoutDate(dateString) {
    return this.blackoutDates.get(dateString) || null;
  }

  // Add blackout date
  addBlackoutDate(date, reason) {
    this.blackoutDates.set(date, {
      date,
      reason,
      addedAt: Date.now()
    });
    
    this.saveToLocalStorage('blackout_dates', this.mapToObject(this.blackoutDates));
  }

  // Remove blackout date
  removeBlackoutDate(date) {
    this.blackoutDates.delete(date);
    this.saveToLocalStorage('blackout_dates', this.mapToObject(this.blackoutDates));
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

module.exports = DeliveryTimeSlotsSystem;
