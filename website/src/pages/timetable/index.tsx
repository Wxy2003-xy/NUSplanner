// src/pages/studyPlan/index.tsx
import React from 'react';
import './timetable.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; 
import Footer from '../../Footer';

const Timetable: React.FC = () => {
  return (
    <div className="timetable-container">
      <div className="sidebar">
        <h3>Navigation</h3>
        <ul>
          <p><Link to="/page/home">Home</Link></p>
          <p><Link to="/page/studyPlan">Study Plan</Link></p>
          <p><Link to="/page/timetable">Timetable</Link></p>
        </ul>
      </div>
      <div className="content">
        <h2>This is the timetable page</h2>
        <p>More content goes here...</p>
      </div>
      <Footer/>
    </div>
  );
}

export default Timetable;
