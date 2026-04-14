import React, { useState, useEffect } from 'react';
import { ethiopianWorkingHours } from '../utils/ethiopianWorkingHours';
import './WorkingHours.css';

const WorkingHours = ({ shopHours, language = 'am', onHoursChange }) => {
  const [currentSchedule, setCurrentSchedule] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState('');
  const [editingMode, setEditingMode] = useState(false);
  const [customHours, setCustomHours] = useState({});

  useEffect(() => {
    // Initialize with shop hours or default schedule
    const schedule = shopHours || ethiopianWorkingHours.generateShopSchedule();
    setCurrentSchedule(schedule);
    setCurrentDay(ethiopianWorkingHours.getCurrentEthiopianDay());
    setIsOpen(ethiopianWorkingHours.isShopOpen(schedule));
  }, [shopHours]);

  const handleHoursChange = (day, period, value) => {
    const newHours = {
      ...customHours,
      [day]: {
        ...customHours[day],
        [period]: value
      }
    };
    setCustomHours(newHours);
    
    if (onHoursChange) {
      onHoursChange(newHours);
    }
  };

  const getDefaultHours = (day) => {
    const dayInfo = ethiopianWorkingHours.ethiopianDays[day];
    
    if (dayInfo.isWeekend) {
      if (day === 'ሰኞ') {
        return ethiopianWorkingHours.standardHours.weekend.sunday;
      } else if (day === 'ቅዳሜ') {
        return ethiopianWorkingHours.standardHours.weekend.saturday;
      }
    }
    
    return ethiopianWorkingHours.standardHours.weekdays.full;
  };

  const renderHoursDisplay = () => {
    return (
      <div className="working-hours-display">
        <div className="current-status">
          <span className={`status-badge ${isOpen ? 'open' : 'closed'}`}>
            {isOpen ? 
              (language === 'am' ? 'ክፍትል ነው' : 'Currently Open') : 
              (language === 'am' ? 'ተዘግቷል' : 'Currently Closed')
            }
          </span>
          <span className="current-day">
            {language === 'am' ? currentDay : ethiopianWorkingHours.ethiopianDays[currentDay]?.english}
          </span>
        </div>

        <div className="hours-schedule">
          {Object.keys(currentSchedule).map(day => {
            const dayInfo = ethiopianWorkingHours.ethiopianDays[day];
            const hours = currentSchedule[day];
            
            return (
              <div key={day} className={`day-schedule ${day === currentDay ? 'current-day' : ''}`}>
                <div className="day-info">
                  <span className="day-name">{language === 'am' ? day : dayInfo.english}</span>
                  {dayInfo.isWeekend && (
                    <span className="weekend-badge">
                      {language === 'am' ? 'የሰሽኛል' : 'Weekend'}
                    </span>
                  )}
                </div>
                
                <div className="hours-info">
                  <span className="hours-time">
                    {language === 'am' ? 
                      `${hours.start} - ${hours.end}` : 
                      hours.english
                    }
                  </span>
                  {day === 'ሰኞ' && (
                    <span className="special-note">
                      {language === 'am' ? 'የቤተክርስቲያን ሰዓት' : 'Church Hours'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderHoursEditor = () => {
    return (
      <div className="working-hours-editor">
        <h3>
          {language === 'am' ? 'የስራ ሰዓቶችን ያስተካክሉ' : 'Set Working Hours'}
        </h3>
        
        {Object.keys(ethiopianWorkingHours.ethiopianDays).map(day => {
          const dayInfo = ethiopianWorkingHours.ethiopianDays[day];
          const defaultHours = getDefaultHours(day);
          const currentCustomHours = customHours[day] || defaultHours;
          
          return (
            <div key={day} className="day-editor">
              <div className="day-header">
                <span className="day-name">{language === 'am' ? day : dayInfo.english}</span>
                {dayInfo.isWeekend && (
                  <span className="weekend-badge">
                    {language === 'am' ? 'የሰሽኛል' : 'Weekend'}
                  </span>
                )}
                {day === 'ሰኞ' && (
                  <span className="special-day-badge">
                    {language === 'am' ? 'ሰኞ' : 'Sunday'}
                  </span>
                )}
              </div>
              
              <div className="time-inputs">
                <div className="time-input-group">
                  <label>
                    {language === 'am' ? 'የመክፈቻ' : 'Opening'}
                  </label>
                  <select 
                    value={currentCustomHours.start}
                    onChange={(e) => handleHoursChange(day, 'start', e.target.value)}
                  >
                    <option value="6:00 ጠዋት">6:00 ጠዋት (7:00 AM)</option>
                    <option value="7:00 ጠዋት">7:00 ጠዋት (8:00 AM)</option>
                    <option value="8:00 ጠዋት">8:00 ጠዋት (9:00 AM)</option>
                    <option value="9:00 ጠዋት">9:00 ጠዋት (10:00 AM)</option>
                    <option value="10:00 ጠዋት">10:00 ጠዋት (11:00 AM)</option>
                    <option value="11:00 ጠዋት">11:00 ጠዋት (12:00 PM)</option>
                    <option value="12:00 ጠዋት">12:00 ጠዋት (1:00 PM)</option>
                  </select>
                </div>
                
                <div className="time-input-group">
                  <label>
                    {language === 'am' ? 'የመዝጻኝ' : 'Closing'}
                  </label>
                  <select 
                    value={currentCustomHours.end}
                    onChange={(e) => handleHoursChange(day, 'end', e.target.value)}
                  >
                    <option value="12:00 ከሰዓት">12:00 ከሰዓት (6:00 PM)</option>
                    <option value="1:00 ከሰዓት">1:00 ከሰዓት (7:00 PM)</option>
                    <option value="2:00 ከሰዓት">2:00 ከሰዓት (8:00 PM)</option>
                    <option value="3:00 ከሰዓት">3:00 ከሰዓት (9:00 PM)</option>
                    <option value="4:00 ከሰዓት">4:00 ከሰዓት (10:00 PM)</option>
                    <option value="5:00 ከሰዓት">5:00 ከሰዓት (11:00 PM)</option>
                  </select>
                </div>
              </div>
              
              {day === 'ሰኞ' && (
                <div className="sunday-note">
                  <p>
                    {language === 'am' ? 
                      'ሰኞ የቤተክርስቲያን ቀን ነው። ብዙሾች ሱቅሎች ከጠዋት 8:00 እስከ ከሰዓት 1:00 ይሠራሉ።' : 
                      'Sunday is a church day. Most shops open from 8:00 AM to 1:00 PM.'
                    }
                  </p>
                </div>
              )}
            </div>
          );
        })}
        
        <div className="editor-actions">
          <button className="btn btn-primary" onClick={() => setEditingMode(false)}>
            {language === 'am' ? 'አስቀምጥ' : 'Save'}
          </button>
          <button className="btn btn-secondary" onClick={() => setEditingMode(false)}>
            {language === 'am' ? 'ይቅር' : 'Cancel'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="working-hours-container">
      <div className="working-hours-header">
        <h2>
          {language === 'am' ? 'የስራ ሰዓቶች' : 'Working Hours'}
        </h2>
        <button 
          className="btn btn-edit"
          onClick={() => setEditingMode(!editingMode)}
        >
          {editingMode ? 
            (language === 'am' ? 'ይቅር' : 'Cancel') : 
            (language === 'am' ? 'አሻሽ' : 'Edit')
          }
        </button>
      </div>
      
      {editingMode ? renderHoursEditor() : renderHoursDisplay()}
    </div>
  );
};

export default WorkingHours;
