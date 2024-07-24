import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout'; // Adjust the path as needed
import './home.css';
import { NavLink } from 'react-router-dom';
import logoImage from '../../images/nusplannerLogo.png';

const Home: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  const sentences = [
    <>Any upcoming deadlines on <a href="https://canvas.nus.edu.sg" target="_blank" rel="noopener noreferrer">Canvas</a>?</>,
    <>Have you checked your <a href="https://exchange.nus.edu.sg" target="_blank" rel="noopener noreferrer">email</a> today?</>,
    <>Anything pressing on <a href="https://myedurec.nus.edu.sg" target="_blank" rel="noopener noreferrer">EduRec</a>?</>,
    <>Don't forget to check your Reminder!</>
  ];

  useEffect(() => {
    const date = new Date();
    const formattedDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    setCurrentDate(formattedDate);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSentenceIndex((prevIndex) => (prevIndex + 1) % sentences.length);
    }, 5000); // Change sentence every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [sentences.length]);

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
        <div className="home-scroll-container">
          <div className="home-scroll-content">
            {sentences[currentSentenceIndex]}
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
