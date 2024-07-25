import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import logoImage from '../images/nusplannerLogo.png';
import './Layout.css';
import Footer from './Footer';
import teleLogo from '../images/teleLogo.jpg'

const Layout = ({ children }) => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  const sentences = [
    <>Any upcoming deadlines on <a href="https://canvas.nus.edu.sg" target="_blank" rel="noopener noreferrer">Canvas</a>?</>,
    <>Have you checked your <a href="https://exchange.nus.edu.sg" target="_blank" rel="noopener noreferrer">email</a> today?</>,
    <>Anything pressing on <a href="https://myedurec.nus.edu.sg" target="_blank" rel="noopener noreferrer">EduRec</a>?</>,
    <>Don't forget to check your Reminder!</>
  ];

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    setCurrentDate(today.toLocaleDateString(undefined, options));
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSentenceIndex((prevIndex) => (prevIndex + 1) % sentences.length);
    }, 5000); // Change sentence every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [sentences.length]);

  return (
    <div className="layout">
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
        <NavLink to="https://t.me/+c2TQvkafNAIzYmY9" className="join-us-container" target="_blank" rel="noopener noreferrer">
          <img src={teleLogo} alt="Join Us" className="join-us-icon" />
          <span className="join-us-text">Join us</span>
        </NavLink>
        <div className="scroll-container">
          <div className="scroll-content">
            {sentences[currentSentenceIndex]}
          </div>
        </div>
        <div className="date-container">
          <span>{currentDate}</span>
        </div>
      </header>
      <div className="content">
        <nav>
          <div className="nav-left">
            <ul>
              <li className="home">
                <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>🏠<span>Home</span></NavLink>
              </li>
              <li>
                <NavLink to="/studyplan" className={({ isActive }) => isActive ? "active" : ""}>📘<span>Study Plan</span></NavLink>
              </li>
              <li className="timetable">
                <NavLink to="/timetable" className={({ isActive }) => isActive ? "active" : ""}>📋<span>Timetable</span></NavLink>
              </li>
              <li className="community">
                <NavLink to="/community" className={({ isActive }) => isActive ? "active" : ""}>👥️<span>Community</span></NavLink>
              </li>
              <li className="reminder">
                <NavLink to="/reminder" className={({ isActive }) => isActive ? "active" : ""}>🗓️<span>Reminder</span></NavLink>
              </li>
              <li className="map">
                <NavLink to="/map" className={({ isActive }) => isActive ? "active" : ""}>🗺️<span>Map</span></NavLink>
              </li>
              <li className="feedback">
                <NavLink to="/feedback" className={({ isActive }) => isActive ? "active" : ""}>✏️<span>Feedback</span></NavLink>
              </li>
              <li className="about">
                <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>ℹ️<span>About us</span></NavLink>
              </li>
            </ul>
          </div>
        </nav>
        <div className="page-content">
          {children}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Layout;
