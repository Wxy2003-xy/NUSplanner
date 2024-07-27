import React, { useState, useEffect } from 'react';
import './home.css';
import { NavLink } from 'react-router-dom';
import logoImage from '../../images/nusplannerLogo.png';
import teleLogo from '../../images/teleLogo.jpg';
import nusScience from '../../images/nusScience.jpeg';
import nusSoc from '../../images/nusSoc.jpg';
import nusFass from '../../images/nusFass.jpeg';
import nusCde from '../../images/nusCde.jpeg';
import NUS from '../../images/NUS.jpeg';
import Footer from '../../components/Footer';
import timetableImg from '../../assets/timetable.png';
import plannerImg from '../../assets/planner.png'
import calendarImg from '../../assets/calendar.png'
import mapImg from '../../assets/map.png'
import communityImg from '../../assets/community.png'
import feedbackImg from '../../assets/feedback.png'

const Home: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  {/*const [currentImageIndex, setCurrentImageIndex] = useState(0);*/}

  const sentences = [
    <>Any upcoming deadlines on <a href="https://canvas.nus.edu.sg" target="_blank" rel="noopener noreferrer">Canvas</a>?</>,
    <>Have you checked your <a href="https://exchange.nus.edu.sg" target="_blank" rel="noopener noreferrer">email</a> today?</>,
    <>Anything pressing on <a href="https://myedurec.nus.edu.sg" target="_blank" rel="noopener noreferrer">EduRec</a>?</>,
    <>Don't forget to check your Reminder!</>
  ];

  {/*const images = [NUS, nusSoc, nusScience, nusFass, nusCde];*/}
  const slides = [
    { src: NUS},
    { src: nusSoc},
    { src: nusScience},
    { src: nusFass},
    { src: nusCde}
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

  {/*
  useEffect(() => {
    const imageIntervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(imageIntervalId); // Cleanup interval on component unmount
  }, [images.length]); */}

  useEffect(() => {
    const autoSlideIntervalId = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(autoSlideIntervalId); // Cleanup interval on component unmount
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

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
        <NavLink to="https://t.me/+c2TQvkafNAIzYmY9" className="join-us-container" target="_blank" rel="noopener noreferrer">
          <img src={teleLogo} alt="Join Us" className="join-us-icon" />
          <span className="join-us-text">Join us</span>
        </NavLink>
        <div className="about-us-container">
          <NavLink to="/about" className="about-us-link">
            <span>About Us</span>
          </NavLink>
        </div>             
        <div className="date-container">
          <span>{currentDate}</span>
        </div>
      </header>
      <div className="home-main-content">
        <div className="home-left-section">
          <div className="home-left-top">
            <div className="home-slideshow-container">
              {slides.map((slide, index) => (
                <img
                  key={index}
                  src={slide.src}
                  alt={`Slide ${index + 1}`}
                  className={`home-slideshow-image ${currentSlideIndex === index ? '' : 'hidden'}`}
                />
              ))}
              <div className="home-slideshow-navigation">
                <button onClick={prevSlide}>‹</button>
                <button onClick={nextSlide}>›</button>
              </div>
            </div>
          </div>
          <div className="home-left-bottom">
            <NavLink to="/studyplan" className="home-leftbottom-title">
              Study Plan
            </NavLink>           
            <hr className='hr-line'></hr>
            <p className="home-leftbottom-content">
              Plan your courses effortlessly with our intuitive Study Plan feature, which organizes your courses, tracks prerequisites, and avoids exam clashes, all with a user-friendly interface. Focus on your academic goals without the stress of manual planning.
            </p>
            <NavLink to="/timetable" className="home-leftbottom-title">
              Timetable
            </NavLink>
            <hr className='hr-line'></hr>
            <p className="home-leftbottom-content">
              But that's not all! Elevate your planning with our Timetable Recommendation feature. We create a personalized timetable for each semester, tailored to your preferences like free days and preferred start times, ensuring a balanced and efficient schedule with minimal adjustments.
            </p>
            <NavLink to="/map" className="home-leftbottom-title">
              Map
            </NavLink>
            <hr className='hr-line'></hr>
            <p className="home-leftbottom-content">
              Additionally, our Map feature guides you directly from your timetable to a map page showing the locations of all your classes. This ensures you know exactly where to go, saving time and reducing campus navigation stress.
            </p>
          </div>
        </div>
        <div className="home-right-section">
          <div className="home-right-content">
            {/*<h2>Welcome to NUSPlanner</h2>*/}
            {/*<p>Your Smart StudyPlan & TimeTable Designer</p> */}
          
            {/* Add rectangle boxes with links */}
            <div className="link-box-container">
              <NavLink to="/studyplan" className="link-box" style={{ backgroundImage: `url(${plannerImg})` }}>
                <span>Study Plan</span>
              </NavLink>
              <NavLink to="/timetable" className="link-box" style={{ backgroundImage: `url(${timetableImg})` }}>
                <span>Timetable</span>
              </NavLink>
              <NavLink to="/community" className="link-box" style={{ backgroundImage: `url(${communityImg})` }}>
                <span>Community</span>
              </NavLink>
              <NavLink to="/reminder" className="link-box" style={{ backgroundImage: `url(${calendarImg})` }}>
                <span>Reminder</span>
              </NavLink>
              <NavLink to="/map" className="link-box" style={{ backgroundImage: `url(${mapImg})` }}>
                <span>Map</span>
              </NavLink>
              <NavLink to="/feedback" className="link-box" style={{ backgroundImage: `url(${feedbackImg})` }}>
                <span>Feedback</span>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <div className='footer-container'>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default Home;