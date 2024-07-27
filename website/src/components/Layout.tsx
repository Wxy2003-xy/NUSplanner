import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoImage from '../images/nusplannerLogo.png';
import './Layout.css';
import Footer from './Footer';
import teleLogo from '../images/teleLogo.jpg';
import timetableImg from '../assets/timetable.png';
import homeImg from '../assets/home.png'
import plannerImg from '../assets/planner.png'
import calendarImg from '../assets/calendar.png'
import mapImg from '../assets/map.png'
import communityImg from '../assets/community.png'
import feedbackImg from '../assets/feedback.png'
import aboutImg from '../assets/about.png'

const Layout = ({ children }) => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const navigate = useNavigate();

  const buttons = [
    { path: '/', label: 'Home', className: 'home', bgImage: `url(${homeImg})` },
    { path: '/studyplan', label: 'Study Plan', className: 'studyplan', bgImage: `url(${plannerImg})` },
    { path: '/timetable', label: 'Timetable', className: 'timetable', bgImage: `url(${timetableImg})` },
    { path: '/community', label: 'Community', className: 'community', bgImage: `url(${communityImg})` },
    { path: '/reminder', label: 'Reminder', className: 'reminder', bgImage: `url(${calendarImg})` },
    { path: '/map', label: 'Map', className: 'map', bgImage: `url(${mapImg})` },
    { path: '/feedback', label: 'Feedback', className: 'feedback', bgImage: `url(${feedbackImg})` },
    { path: '/about', label: 'About us', className: 'about', bgImage: `url(${aboutImg})` }
  ];

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
        <div className="home-scroll-container">
          <div className="home-scroll-content">
            {sentences[currentSentenceIndex]}
          </div>
        </div>
        <a href="https://t.me/+c2TQvkafNAIzYmY9" className="join-us-container" target="_blank" rel="noopener noreferrer">
          <img src={teleLogo} alt="Join Us" className="join-us-icon" />
          <span className="join-us-text">Join us</span>
        </a>
        <div className="about-us-container">
          <NavLink to="/about" className="about-us-link">
            <span>About Us</span>
          </NavLink>
        </div>             
        <div className="date-container">
          <span>{currentDate}</span>
        </div>
      </header>
      <div className="content">
        <nav>
          <div className="nav-left">
            <ul className='nav-left-buttonlist'>
              {buttons.map((button, index) => (
                <li key={index} className={button.className}>
                  <button 
                    onClick={() => navigate(button.path)} 
                    className="nav-button" 
                    style={{ backgroundImage: button.bgImage }}>
                    <span>{button.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="page-content">
          {children}
        </div>
      </div>
      <div className='footer-container'>
        <Footer />
      </div>
    </div>
  );
};




export default Layout;
