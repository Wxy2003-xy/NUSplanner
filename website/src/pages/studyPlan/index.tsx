// src/pages/studyPlan/index.tsx
import React from 'react';
import './studyplan.css'; 
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const StudyPlan: React.FC = () => {
  return (
    <div className="studyplan-container">
      <div className="sidebar">
        <h3>Navigation</h3>
        <ul>
            <p><Link to="/page/home">Home</Link></p>
            <p><Link to="/page/studyPlan">Study Plan</Link></p>
            <p><Link to="/page/timetable">Timetable</Link></p>
        </ul>
      </div>
      <div className="content">
        <h2>This is the study plan page</h2>
        <p>More content goes here...</p>
      </div>
    </div>
  );
}

export default StudyPlan;
