import React, { useEffect } from 'react';
import './home.css';
import logoImage from '../../images/nusplannerLogo.png';
import { NavLink } from 'react-router-dom';


const Home: React.FC = () => {
 useEffect(() => {
   function updateDate() {
     const dateElement = document.getElementById('current-date');
     const options: Intl.DateTimeFormatOptions = {
       year: 'numeric',
       month: 'long',
       day: 'numeric'
     };
     const today = new Date();
     dateElement!.textContent = today.toLocaleDateString(undefined, options);
   }
   updateDate();
 }, []);


 return (
   <div className="home-container">
     <header>
       <div className="header-left">
       <a href="Home" className="logo-link">
         <div className="logo-container">
           <img src={logoImage} alt="Logo" />
           <span>NUSPlanner</span>
         </div>
       </a>
         <div className="title-container">
           <p></p>
         </div>
       </div>
       <div className="date-container">
         <span id="current-date"></span>
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
           </ul>
         </div>
         <div className="nav-right">
           <div>
             <h2>NUSPlanner</h2>
             <p>Your Smart StudyPlan & TimeTable Designer</p>
           </div>
         </div>
       </nav>
     </div>
   </div>
 );
};


export default Home;
