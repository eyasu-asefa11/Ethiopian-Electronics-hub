// Ethiopian Working Hours System
// Handles Ethiopian calendar, AM/PM times, and special day schedules

const ethiopianWorkingHours = {
  // Ethiopian days of the week
  ethiopianDays: {
    'ሰኞ': { english: 'Sunday', isWeekend: true, specialHours: true },
    'ማነዲ': { english: 'Monday', isWeekend: false, specialHours: false },
    'ማክሰኞ': { english: 'Tuesday', isWeekend: false, specialHours: false },
    'ረቡዕ': { english: 'Wednesday', isWeekend: false, specialHours: false },
    'ሐሙስ': { english: 'Thursday', isWeekend: false, specialHours: false },
    'ዓርብ': { english: 'Friday', isWeekend: false, specialHours: false },
    'ቅዳሜ': { english: 'Saturday', isWeekend: true, specialHours: true }
  },

  // Standard working hours in Ethiopian time
  standardHours: {
    weekdays: {
      morning: { start: '6:00 ጠዋት', end: '12:00 ከሰዓት', english: '6:00 AM - 12:00 PM' },
      afternoon: { start: '1:00 ከሰዓት', end: '9:00 ከሰዓት', english: '1:00 PM - 9:00 PM' },
      full: { start: '6:00 ጠዋት', end: '9:00 ከሰዓት', english: '6:00 AM - 9:00 PM' }
    },
    weekend: {
      sunday: { start: '8:00 ጠዋት', end: '1:00 ከሰዓት', english: '8:00 AM - 1:00 PM' },
      saturday: { start: '9:00 ጠዋት', end: '5:00 ከሰዓት', english: '9:00 AM - 5:00 PM' }
    }
  },

  // Special Ethiopian holidays (major ones)
  holidays: [
    'አደዋ በላ፣', // Ethiopian Christmas
    'ጥምት አክልደ', // Timkat (Epiphany)
    'እግዜር ትውልደ', // Ethiopian Easter
    'መስቀል አደዋ', // Finding of the True Cross
    'እንግዲደር', // Ethiopian New Year
    'መስቀል ገብርያይ', // Meskel
    'ገና እግዜር', // Christmas Eve
    'ጥምት አክልደ ዐልደ', // Timkat Eve
    'ቅዳሜ ሰማዕት', // Good Friday
    'ሰማዕት ቅዳሜ'  // Holy Saturday
  ],

  // Convert Ethiopian time to international format
  ethiopianToInternational: (ethiopianTime) => {
    const timeMap = {
      '1:00 ጠዋት': '7:00 AM',
      '2:00 ጠዋት': '8:00 AM',
      '3:00 ጠዋት': '9:00 AM',
      '4:00 ጠዋት': '10:00 AM',
      '5:00 ጠዋት': '11:00 AM',
      '6:00 ጠዋት': '12:00 PM',
      '7:00 ጠዋት': '1:00 PM',
      '8:00 ጠዋት': '2:00 PM',
      '9:00 ጠዋት': '3:00 PM',
      '10:00 ጠዋት': '4:00 PM',
      '11:00 ጠዋት': '5:00 PM',
      '12:00 ጠዋት': '6:00 PM',
      '1:00 ከሰዓት': '7:00 PM',
      '2:00 ከሰዓት': '8:00 PM',
      '3:00 ከሰዓት': '9:00 PM',
      '4:00 ከሰዓት': '10:00 PM',
      '5:00 ከሰዓት': '11:00 PM',
      '6:00 ከሰዓት': '12:00 AM',
      '7:00 ከሰዓት': '1:00 AM',
      '8:00 ከሰዓት': '2:00 AM',
      '9:00 ከሰዓት': '3:00 AM',
      '10:00 ከሰዓት': '4:00 AM',
      '11:00 ከሰዓት': '5:00 AM',
      '12:00 ከሰዓት': '6:00 AM'
    };
    return timeMap[ethiopianTime] || ethiopianTime;
  },

  // Get current Ethiopian day
  getCurrentEthiopianDay: () => {
    const now = new Date();
    const dayIndex = now.getDay();
    const ethiopianDays = ['ሰኞ', 'ማነዲ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'];
    return ethiopianDays[dayIndex];
  },

  // Format working hours for display
  formatWorkingHours: (day, hours, language = 'am') => {
    const dayInfo = ethiopianWorkingHours.ethiopianDays[day];
    if (!dayInfo) return '';

    let displayHours = '';
    
    if (dayInfo.isWeekend) {
      if (day === 'ሰኞ') {
        displayHours = hours.sunday || ethiopianWorkingHours.standardHours.weekend.sunday;
      } else if (day === 'ቅዳሜ') {
        displayHours = hours.saturday || ethiopianWorkingHours.standardHours.weekend.saturday;
      }
    } else {
      displayHours = hours.weekdays || ethiopianWorkingHours.standardHours.weekdays.full;
    }

    if (language === 'am') {
      return `${day}: ${displayHours.start} - ${displayHours.end}`;
    } else {
      return `${dayInfo.english}: ${displayHours.english}`;
    }
  },

  // Check if shop is currently open
  isShopOpen: (workingHours) => {
    const currentDay = ethiopianWorkingHours.getCurrentEthiopianDay();
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${currentHour}:${currentMinute.toString().padStart(2, '0')}`;

    const dayHours = workingHours[currentDay];
    if (!dayHours) return false;

    // Convert Ethiopian times to check against current time
    const ethiopianStart = ethiopianWorkingHours.ethiopianToInternational(dayHours.start);
    const ethiopianEnd = ethiopianWorkingHours.ethiopianToInternational(dayHours.end);

    // Simple time comparison (in real app, would need more sophisticated logic)
    return true; // Simplified for demo
  },

  // Generate working hours schedule for a shop
  generateShopSchedule: (customHours = {}) => {
    const schedule = {};
    
    Object.keys(ethiopianWorkingHours.ethiopianDays).forEach(day => {
      const dayInfo = ethiopianWorkingHours.ethiopianDays[day];
      
      if (dayInfo.isWeekend) {
        if (day === 'ሰኞ') {
          schedule[day] = customHours.sunday || ethiopianWorkingHours.standardHours.weekend.sunday;
        } else if (day === 'ቅዳሜ') {
          schedule[day] = customHours.saturday || ethiopianWorkingHours.standardHours.weekend.saturday;
        }
      } else {
        schedule[day] = customHours.weekdays || ethiopianWorkingHours.standardHours.weekdays.full;
      }
    });

    return schedule;
  },

  // Get working hours in both languages
  getBilingualHours: (schedule) => {
    const bilingual = {};
    
    Object.keys(schedule).forEach(day => {
      const dayInfo = ethiopianWorkingHours.ethiopianDays[day];
      bilingual[day] = {
        amharic: `${day}: ${schedule[day].start} - ${schedule[day].end}`,
        english: `${dayInfo.english}: ${schedule[day].english}`,
        isOpen: ethiopianWorkingHours.isShopOpen(schedule)
      };
    });

    return bilingual;
  }
};

// Export for use in components
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ethiopianWorkingHours;
}

// Make available globally for browser
if (typeof window !== 'undefined') {
  window.ethiopianWorkingHours = ethiopianWorkingHours;
}
