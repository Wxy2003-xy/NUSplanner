import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout'; // Adjust the path as needed
import './home.css';
import { NavLink } from 'react-router-dom';
import logoImage from '../../images/nusplannerLogo.png';

const Home: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>('');

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    setCurrentDate(formattedDate);
  }, []);

  return (
    <div className="home-layout">
      <header>
        <div className="header-left">
          <NavLink to="/" className="logo-link">
            <div className="logo-container">
              <img src={logoImage} alt="Logo" />
              <span>NUSPlanner</span>
            </div>
          </NavLink>
          <div className="title-container">
            <p></p>
          </div>
        </div>
        <div className="date-container">
          <span>{currentDate}</span>
        </div>
      </header>
      <div className="home-nav-right">
        <div className="content">
          <h2>Welcome to NUSPlanner</h2>
          {/*<p>Your Smart StudyPlan & TimeTable Designer</p> */}
          
          {/* Add rectangle boxes with links */}
          <div className="link-box-container">
            <NavLink to="/studyplan" className="link-box">
              <span>Study Plan</span>
            </NavLink>
            <NavLink to="/timetable" className="link-box">
              <span>Timetable</span>
            </NavLink>
            <NavLink to="/community" className="link-box">
              <span>Community</span>
            </NavLink>
            <NavLink to="/reminder" className="link-box">
              <span>Reminder</span>
            </NavLink>
            <NavLink to="/map" className="link-box">
              <span>Map</span>
            </NavLink>
            <NavLink to="/feedback" className="link-box">
              <span>Feedback</span>
            </NavLink>
            <NavLink to="/about" className="link-box">
              <span>About us</span>
            </NavLink>
          </div>
      </div>
      </div>
    </div>
  );
};

export default Home;
