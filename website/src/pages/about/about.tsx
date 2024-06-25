import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './about.css';
import logoImage from '../../images/nusplannerLogo.png';
import image1 from '../../images/NUS.jpeg';
import image2 from '../../images/nusScience.jpeg';
import image3 from '../../images/nusSoc.jpg';
import image4 from '../../images/nusCde.jpeg';
import image5 from '../../images/nusFass.jpeg';

const About = () => {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    setCurrentDate(today.toLocaleDateString(undefined, options));
  }, []);

  useEffect(() => {
    const images = [image1, image2, image3, image4, image5];
    let currentImageIndex = 0;

    const changeBackgroundImage = () => {
      const backgrounds = document.querySelectorAll('.nav-right .background');
      const currentBackground = backgrounds[currentImageIndex % backgrounds.length] as HTMLElement;
      const nextBackground = backgrounds[(currentImageIndex + 1) % backgrounds.length] as HTMLElement;

      currentBackground.classList.add('hidden');
      nextBackground.classList.remove('hidden');

      currentImageIndex = (currentImageIndex + 1) % images.length;
      nextBackground.style.backgroundImage = `url('${images[currentImageIndex]}')`;
    };

    const intervalId = setInterval(changeBackgroundImage, 3000); // Change image every 3 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  return (
    <div>
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
      <div className="content" style={{ height: "100vh" }}>
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
              <li className="feedback">
                <NavLink to="/feedback" className={({ isActive }) => isActive ? "active" : ""}>✏️<span>Feedback</span></NavLink>
              </li>
              <li className="about">
                <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>ℹ️<span>About us</span></NavLink>
              </li>
            </ul>
          </div>
          <div className="nav-right">
            <div className="background" style={{ backgroundImage: `url(${image1})` }}></div>
            <div className="background hidden" style={{ backgroundImage: `url(${image2})` }}></div>
            <div className="background hidden" style={{ backgroundImage: `url(${image3})` }}></div>
            <div className="background hidden" style={{ backgroundImage: `url(${image4})` }}></div>
            <div className="background hidden" style={{ backgroundImage: `url(${image5})` }}></div>
            <div className="content">
              <h1>About Us</h1>
              <div className="centered-paragraph">
                <p>NUSPlanner endeavors to introduce a groundbreaking recommendation system designed to guide current and prospective NUS students in crafting their ideal course schedule tailored to their unique preferences and academic requirements. NUSPlanner will not only propose comprehensive course schedules but also offer insights into the optimal timing for each course within every semester.</p>
                <p>The next core feature of NUSPlanner would assist students in organizing their timetable and provide recommendations based on highly customizable sets of criteria for students to refer from in selecting class time slots.</p>
                <p>Beyond that, NUSPlanner would also include relevant QoL features that make the life of new students who are not yet familiar with life on campus easier, such as class reminders, maps for class locations, and more.</p>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default About;


