import React, { useState, useEffect, ChangeEvent } from "react";
import { GenericTimeSlot, Day } from '../../../types/timetable';

// Utility to map index to day names (assuming Monday start)
const dayNames: { [key: number]: Day } = {
  0: 'Monday',
  1: 'Tuesday',
  2: 'Wednesday',
  3: 'Thursday',
  4: 'Friday',
  5: 'Saturday',
  6: 'Sunday'
};

const START_TIME = 8 * 60;  // 8:00 AM in minutes
const END_TIME = 18 * 60;   // 6:00 PM in minutes
const INTERVAL = 10;        // 10 minutes


const DynamicTimeTable = () => {
  const [numOfDays, setNumOfDays] = useState<number>(() => {
    const savedDays = localStorage.getItem('numOfDays');
    return savedDays ? parseInt(savedDays) : 5;
  });


  const generateTimeSlots = () => {
    const slots = [];
    for (let time = START_TIME; time < END_TIME; time += INTERVAL) {
      const hours = Math.floor(time / 60);
      const minutes = time % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      slots.push({ startTime: timeString, endTime: `${(hours).toString().padStart(2, '0')}
      :${(minutes + INTERVAL).toString().padStart(2, '0')}`, title: 'Free Slot' });
    }
    return slots;
  };
  
  const [timetable, setTimeTable] = useState<Array<Array<GenericTimeSlot>>>(() => {
    const savedTable = localStorage.getItem('timetable');
    return savedTable ? JSON.parse(savedTable) : Array.from({ length: numOfDays }, () => generateTimeSlots());
  });
  

  const handleSettingDays = (event: ChangeEvent<HTMLSelectElement>) => {
    const rows = parseInt(event.target.value);
    setNumOfDays(rows);
    localStorage.setItem('numOfDays', rows.toString());
  };
  useEffect(() => {
    const newTable = Array.from({ length: numOfDays }, (_, idx) => timetable[idx] || generateTimeSlots());
    setTimeTable(newTable);
    localStorage.setItem('timetable', JSON.stringify(newTable));
  }, [numOfDays]);
  
  return (
    <>
      <select className="dropdown-select-days" value={numOfDays} onChange={handleSettingDays}>
        {[4, 5, 6, 7].map(num => (<option key={num} value={num}>{num + ' Days'}</option>))}
      </select>
      <div className="time-table">
        {timetable.map((daySlots, idx) => (
          <div key={idx} className="hrows">
            <h3>{dayNames[idx]}</h3>
            {daySlots.map((slot, index) => (
              <div key={index} className="time-slot">
                {slot.title} from {slot.startTime} to {slot.endTime}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
  
};

export default DynamicTimeTable;
