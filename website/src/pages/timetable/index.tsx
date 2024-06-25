// src/pages/studyPlan/index.tsx
import React from 'react';
import './timetable.css';
import underConstruction from '../../images/underConstruction.jpeg'
const Timetable: React.FC = () => {
  const events = [
    { time: '10:00 - 11:00', name: 'Opening Ceremony', location: 'Main Hall' },
    { time: '11:00 - 12:00', name: 'Keynote Speech', location: 'Room A' }
  ];

  return (
    <div className="timetable-container">
      <div className="content">
        <h2>This is the timetable page</h2>
        <div>
            <img src={underConstruction}></img>
          <p>Under Construction...</p>
        </div>
      </div>
    </div>
  );
}

export default Timetable;
