import React from 'react';
import './table.css';
import { ClassTimeSlotTypeUnion, CleanClassTimeSlot } from '../../../types/timetable';
interface TimetableProps {
    timeSlots: CleanClassTimeSlot[];
  }
  function formatTime(time: string): string {
    const hour = parseInt(time.substring(0, 2), 10);
    const minute = time.substring(2);
    return `${hour}:${minute}`;
  }
    function Timetable({ timeSlots }: TimetableProps) {
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    
        const gridItems = timeSlots.flatMap(slot => 
            slot.day.flatMap((day, index) => {
            const dayIndex = daysOfWeek.indexOf(day) + 1; // +1 because CSS grid starts from 1
            const startHour = parseInt(slot.startTime[index], 10) / 100;
            const endHour = parseInt(slot.endTime[index], 10) / 100;
            const duration = endHour - startHour;
            const formattedStartTime = formatTime(slot.startTime[index]);
            const formattedEndTime = formatTime(slot.endTime[index]);
                return (
                    <div
                    key={`${slot.title}${day}${slot.startTime[index]}`} // Unique key for React elements
                    className="timetable-slot"
                    style={{
                    gridColumn: dayIndex,
                    gridRow: `${startHour - 7} / span ${duration}`,
                    backgroundColor: getColor(slot.lessonType),
                    }}>
                        {slot.title} - {slot.lessonType} <br/>
                        {formattedStartTime} - {formattedEndTime} <br/>
                        {slot.venue} <br/>
                    </div>
                );
            })
        );
  
    return (
        <div>
            <div className="timetable-comp">
                {gridItems}
            </div>
        </div>
    );
  }
  
  // Utility function to assign colors based on the aclass type
  function getColor(type:string) {
    const typeColors = {
      Lecture: '#E68A81',
      Tutorial: '#8FBE6D',
      Laboratory: '#708FE3',
      Recitation: '#EEEEA9',
      "Sectional Teaching": '#E3B571',
      Seminar: '#EEEEA9'
      // Define more types and colors as needed
    };
    return typeColors[type] || 'grey'; // Default color
  }
  
  export default Timetable;