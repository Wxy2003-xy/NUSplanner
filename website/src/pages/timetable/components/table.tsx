import React, { useState, useEffect } from 'react';
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
  const [courseColors, setCourseColors] = useState<{ [courseCode: string]: string }>({});

  useEffect(() => {
    localStorage.setItem('selectedPalette', selectedPalette);

    // Generate colors for course codes
    const uniqueCourseCodes = [...new Set(timeSlots.map(slot => slot.title))];
    const assignedColors: { [courseCode: string]: string } = {};

    uniqueCourseCodes.forEach((courseCode, index) => {
      assignedColors[courseCode] = getColor(courseCode, selectedPalette, index);
    });

    setCourseColors(assignedColors);
  }, [selectedPalette, timeSlots]);

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

      const courseColor = courseColors[slot.title] || 'grey';

      return (
        <div
          key={`${slot.title}${slot.lessonType}${slot.classNo}${day}${slot.startTime[index]}`} 
          className="timetable-slot"
          style={{
            gridColumn: dayIndex,
            gridRow: `${startRow} / span ${span}`,
            backgroundColor: courseColor,
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
          {timeSlotsArray.map((time) => (
            <div key={time} className="timetable-time-slot">
              {time}
            </div>
          ))}
          {gridItems}
        </div>
      </div>
      <p className='credit-timetable'>Credit: color palettes from NUSMOD</p>
    </div>
  );
}

const colorPalettes: Record<string, string[]> = {
  ashes: ['#B0B6AB', '#D0D3CD', '#A9B9A3', '#A3B9C1', '#A8C3D5', '#C1B6C7', '#D7B9C2'],
  chalk: ['#F0B6AC', '#E8C9A4', '#D9E3B4', '#B3CFA9', '#92CEBE', '#A3AFCF', '#C4B4C7'],
  eighties: ['#F0999A', '#F5CB7C', '#A6CC8C', '#78BCC9', '#9B9BCB', '#A58879', '#E8A77A'],
  google: ['#DB4437', '#F4B400', '#0F9D58', '#4285F4', '#DB4C88', '#F0E68C', '#F0E68C'],
  mocha: ['#A86C6B', '#DAB18E', '#A7B384', '#87B3A5', '#A2938C', '#B0A3A2', '#C5A897'],
  monokai: ['#F92672', '#FD971F', '#E6DB74', '#A6E22E', '#66D9EF', '#9E6FFE', '#A2A2A2'],
  ocean: ['#AB6A5B', '#D1B29B', '#A5B2A2', '#7E9AA2', '#9C94B0', '#B0A3A2', '#D3B9A2'],
  oceanicNext: ['#F77669', '#F9CE6E', '#ACD2A8', '#7ECCE7', '#A8A0C9', '#D1B18B', '#E0D1B0'],
  paraiso: ['#FF3D3E', '#FE9E59', '#FAE054', '#50CB89', '#3EACFF', '#8959A8', '#FE3E7D'],
  railscasts: ['#F99157', '#FAC863', '#99C794', '#5FB3B3', '#6699CC', '#C594C5', '#AB7967'],
  tomorrow: ['#FF4B82', '#FFC66D', '#A6E22E', '#66D9EF', '#A28DFF', '#E69F66', '#F7F9F9'],
  twilight: ['#F2777A', '#F4BF75', '#99CC99', '#66CCCC', '#CC99CC', '#C0C0C0', '#A896C8']
};

function getColor(courseCode: string, palette: string, index: number): string {
  const paletteColors = colorPalettes[palette] || colorPalettes.eighties;
  return paletteColors[index % paletteColors.length] || 'grey';
}

export default Timetable;
