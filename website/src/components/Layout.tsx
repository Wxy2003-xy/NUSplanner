import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import logoImage from '../images/nusplannerLogo.png';

const Layout = () => {
    const [currentDate, setCurrentDate] = useState('');
    useEffect(() => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date();
        setCurrentDate(today.toLocaleDateString(undefined, options));
      }, []);
    return (
      <>
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
         <div className="content">
           <nav>
             <div className="nav-left" style={{ height: "100vh" }}>
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
              <li className="reminder">
                <NavLink to="/reminder" className={({ isActive }) => isActive ? "active" : ""}>ℹ️<span>Reminder</span></NavLink>
              </li>
              <li className="map">
                <NavLink to="/map" className={({ isActive }) => isActive ? "active" : ""}>ℹ️<span>Map</span></NavLink>
              </li>
            </ul>
         </div>
       </nav>
     </div>
    </>
    );
}

export default Layout;

