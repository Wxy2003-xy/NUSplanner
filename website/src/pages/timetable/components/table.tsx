import React from 'react';
import { useState, useEffect} from 'react';
import './table.css';
import { ClassTimeSlotTypeUnion } from '../../../types/timetable';

interface TimetableProps {
  timeSlots: ClassTimeSlotTypeUnion[];
}

function formatTime(time: string): string {
  const hour = parseInt(time.substring(0, 2), 10);
  const minute = time.substring(2);
  return `${hour}:${minute}`;
}

function Timetable({ timeSlots }: TimetableProps) {
  const [selectedPalette, setSelectedPalette] = useState(() => localStorage.getItem('selectedPalette') || 'default');

  useEffect(() => {
    localStorage.setItem('selectedPalette', selectedPalette);
  }, [selectedPalette]);

  const handlePaletteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPalette(event.target.value);
  };
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlotsArray = Array.from({ length: 28 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const gridItems = timeSlots.flatMap(slot =>
    slot.day.flatMap((day, index) => {
      const dayIndex = daysOfWeek.indexOf(day) + 2; 
      const startHour = parseInt(slot.startTime[index].substring(0, 2), 10);
      const startMinute = parseInt(slot.startTime[index].substring(2), 10);
      const endHour = parseInt(slot.endTime[index].substring(0, 2), 10);
      const endMinute = parseInt(slot.endTime[index].substring(2), 10);

      const startRow = (startHour - 8) * 2 + (startMinute === 30 ? 1 : 0) + 2;
      const endRow = (endHour - 8) * 2 + (endMinute === 30 ? 1 : 0) + 2;
      const span = endRow - startRow;

      const formattedStartTime = formatTime(slot.startTime[index]);
      const formattedEndTime = formatTime(slot.endTime[index]);
      const weekInfoPre = JSON.stringify(slot.weeks);
      const weekInfo = weekInfoPre === '[1,2,3,4,5,6,7,8,9,10,11,12,13]' ? '' 
                          : weekInfoPre === '[3,4,5,6,7,8,9,10,11,12,13]' ? 'Week 3 - 13'
                          : weekInfoPre === '[2,3,4,5,6,7,8,9,10,11,12,13]' ? 'Week 2 - 13'
                          : 'Week: ' + weekInfoPre;
      return (
        <div
          key={`${slot.title}${slot.lessonType}${slot.classNo}${day}${slot.startTime[index]}`} 
          className="timetable-slot"
          style={{
            gridColumn: dayIndex,
            gridRow: `${startRow} / span ${span}`,
            backgroundColor: getColor(slot.lessonType ? slot.lessonType : '', selectedPalette),
          }}>
          {slot.title} - {slot.lessonType} {'['}{slot.classNo}{']'} <br />
          {formattedStartTime} - {formattedEndTime} <br />
          {slot.venue as string} <br />
          {weekInfo} <br />
        </div>
      );
    })
  );

  return (
    <div className="timetable-container">
      <div className="palette-selector">
        <label htmlFor="palette">Choose a color palette: </label>
        <select id="palette" value={selectedPalette} onChange={handlePaletteChange}>
          {Object.keys(colorPalettes).map(palette => (
            <option key={palette} value={palette}>{palette}</option>
          ))}
        </select>
      </div>
      <div className="timetable-grid">
        <div className="timetable-header">
          <div className="timetable-time-header"></div>
          {daysOfWeek.map((day) => (
            <div key={day} className="timetable-day-header">{day}</div>
          ))}
        </div>
        <div className="timetable-body">
          {timeSlotsArray.map((time, index) => (
            <div key={time} className="timetable-time-slot">
              {time}
            </div>
          ))}
          {gridItems}
        </div>
      </div>
      <p className='credit'>Credit: color palettes from NUSMOD</p>
    </div>
  );
}

const colorPalettes = {
  ashes: {
    Lecture: '#B0B6AB',
    Tutorial: '#D0D3CD',
    Laboratory: '#A9B9A3',
    Recitation: '#A3B9C1',
    "Sectional Teaching": '#A8C3D5',
    Seminar: '#C1B6C7',
    default: '#D7B9C2'
  },
  chalk: {
    Lecture: '#F0B6AC',
    Tutorial: '#E8C9A4',
    Laboratory: '#D9E3B4',
    Recitation: '#B3CFA9',
    "Sectional Teaching": '#92CEBE',
    Seminar: '#A3AFCF',
    default: '#C4B4C7'
  },
  eighties: {
    Lecture: '#F0999A',
    Tutorial: '#F5CB7C',
    Laboratory: '#A6CC8C',
    Recitation: '#78BCC9',
    "Sectional Teaching": '#9B9BCB',
    Seminar: '#A58879',
    default: '#E8A77A'
  },
  google: {
    Lecture: '#DB4437',
    Tutorial: '#F4B400',
    Laboratory: '#0F9D58',
    Recitation: '#4285F4',
    "Sectional Teaching": '#DB4C88',
    Seminar: '#F0E68C',
    default: '#F0E68C'
  },
  mocha: {
    Lecture: '#A86C6B',
    Tutorial: '#DAB18E',
    Laboratory: '#A7B384',
    Recitation: '#87B3A5',
    "Sectional Teaching": '#A2938C',
    Seminar: '#B0A3A2',
    default: '#C5A897'
  },
  monokai: {
    Lecture: '#F92672',
    Tutorial: '#FD971F',
    Laboratory: '#E6DB74',
    Recitation: '#A6E22E',
    "Sectional Teaching": '#66D9EF',
    Seminar: '#9E6FFE',
    default: '#A2A2A2'
  },
  ocean: {
    Lecture: '#AB6A5B',
    Tutorial: '#D1B29B',
    Laboratory: '#A5B2A2',
    Recitation: '#7E9AA2',
    "Sectional Teaching": '#9C94B0',
    Seminar: '#B0A3A2',
    default: '#D3B9A2'
  },
  oceanicNext: {
    Lecture: '#F77669',
    Tutorial: '#F9CE6E',
    Laboratory: '#ACD2A8',
    Recitation: '#7ECCE7',
    "Sectional Teaching": '#A8A0C9',
    Seminar: '#D1B18B',
    default: '#E0D1B0'
  },
  paraiso: {
    Lecture: '#FF3D3E',
    Tutorial: '#FE9E59',
    Laboratory: '#FAE054',
    Recitation: '#50CB89',
    "Sectional Teaching": '#3EACFF',
    Seminar: '#8959A8',
    default: '#FE3E7D'
  },
  railscasts: {
    Lecture: '#F99157',
    Tutorial: '#FAC863',
    Laboratory: '#99C794',
    Recitation: '#5FB3B3',
    "Sectional Teaching": '#6699CC',
    Seminar: '#C594C5',
    default: '#AB7967'
  },
  tomorrow: {
    Lecture: '#FF4B82',
    Tutorial: '#FFC66D',
    Laboratory: '#A6E22E',
    Recitation: '#66D9EF',
    "Sectional Teaching": '#A28DFF',
    Seminar: '#E69F66',
    default: '#F7F9F9'
  },
  twilight: {
    Lecture: '#F2777A',
    Tutorial: '#F4BF75',
    Laboratory: '#99CC99',
    Recitation: '#66CCCC',
    "Sectional Teaching": '#CC99CC',
    Seminar: '#C0C0C0',
    default: '#A896C8'
  }
};


function getColor(type: string, palette: string) {
  const typeColors = colorPalettes[palette] || colorPalettes.google;
  return typeColors[type] || 'grey';
}

export default Timetable;
