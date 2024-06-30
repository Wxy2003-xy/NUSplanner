import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import emailjs from 'emailjs-com';
import './timetable.css';
import logoImage from '../../images/nusplannerLogo.png';
const Timetable = () => {
   useEffect(() => {
       updateDate();
       generateTimetable();
   }, []);
   const updateDate = () => {
       const dateElement = document.getElementById('current-date');
       const options: Intl.DateTimeFormatOptions = { year: 'numeric', month:
'long', day: 'numeric' };
       const today = new Date();
       if (dateElement) {
           dateElement.textContent = today.toLocaleDateString(undefined, options);
} };
   const generateTimetable = () => {
       const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
'14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];
       const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
       let html = '<tr><th></th>';
       times.forEach(time => {
           html += `<th>${time}</th>`;
       });
       html += '</tr>';
       days.forEach(day => {
           html += `<tr><th>${day}</th>`;
           times.forEach(time => {
               const key = `${day.toLowerCase()}-${time}`;
               const value = localStorage.getItem(key) || "";
               html += `<td class="slot" data-day="${day.toLowerCase()}"
data-time="${time}"><input type="text" placeholder="Note..."
value="${value}"></td>`;
});
           html += '</tr>';
       });
const timetable = document.getElementById('timetable-body');
    if (timetable) {
        timetable.innerHTML = html;
    }
};
const saveNotes = () => {
    const slots = document.querySelectorAll('.slot input');
    slots.forEach(slot => {
        const parentElement = slot.parentElement;
        if (parentElement) {
            const day = parentElement.getAttribute('data-day');
            const time = parentElement.getAttribute('data-time');
            const key = `${day}-${time}`;
            const value = (slot as HTMLInputElement).value;
            localStorage.setItem(key, value);
} });
    alert("Notes saved!");
};
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
                <span id="current-date"></span>
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
              <li className="feedback">
                <NavLink to="/feedback" className={({ isActive }) => isActive ? "active" : ""}>✏️<span>Feedback</span></NavLink>
              </li>
              <li className="about">
                <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>ℹ️<span>About us</span></NavLink>
              </li>
            </ul>
                   </div>
                   <div className="nav-right">
                       <h2>Timetable</h2>
                       <div className="container">
                           <table className="responsive-table">
                               <tbody id="timetable-body"></tbody>
                           </table>
                       </div>
                       <button className="save-button"
onClick={saveNotes}>Save</button>
                   </div>
               </nav>
           </div>
       </div>
); };
export default Timetable;