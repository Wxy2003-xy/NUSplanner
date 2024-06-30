import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import emailjs from 'emailjs-com';
import './feedback.css';
import logoImage from '../../images/nusplannerLogo.png';
const Feedback = () => {
 const [message, setMessage] = useState('');
 const [modalText, setModalText] = useState('');
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [currentDate, setCurrentDate] = useState('');
 const modalRef = useRef<HTMLDivElement>(null);
 useEffect(() => {
   const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long',
day: 'numeric' };
   const today = new Date();
   setCurrentDate(today.toLocaleDateString(undefined, options));
}, []);
 useEffect(() => {
   const handleClickOutside = (event: MouseEvent) => {
     if (modalRef.current && event.target === modalRef.current) {
       setIsModalOpen(false);
} };
   window.addEventListener('click', handleClickOutside);
   return () => {
     window.removeEventListener('click', handleClickOutside);
   };
}, []);
 const sendFeedback = (feedbackContent: string) => {
   const serviceID = 'service_j372can';
   const templateID = 'template_apwji5m';
   const userID = 'PtThpNOKmxSv-C1nB';
   const templateParams = {
     message: feedbackContent,
     to_email: 'nusplanner2024@gmail.com',
    };
    emailjs.send(serviceID, templateID, templateParams, userID)
      .then((response) => {
        console.log('Feedback sent successfully!', response.status, response.text);
      }, (error) => {
        console.error('Failed to send feedback.', error);
      });
    };
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      const trimmedMessage = message.trim();
      if (!trimmedMessage) {
        setModalText('Please provide your feedback before submitting.');
      } else {
        setModalText('Thank you for your feedback!');
        sendFeedback(trimmedMessage);
        setMessage(''); // Clear the message input
    }
      setIsModalOpen(true); // Show the modal in both cases
    };
    const closeModal = () => {
      setIsModalOpen(false);
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
            </ul>
    </div>
    <div className="nav-right">
      <div>
        <h2>Feedback Form</h2>
        <form id="feedback-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              id="message"
              name="message"
              placeholder="Write your feedback here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
    /> </div>
          <button type="submit">Submit</button>
          </form>
             <div id="response-message"></div>
           </div>
         </div>
       </nav>
     </div>
     {isModalOpen && (
       <div id="myModal" className="modal show" ref={modalRef}>
         <div className="modal-content">
           <span className="close" onClick={closeModal}>&times;</span>
           <p id="modal-text">{modalText}</p>
         </div>
</div> )}
</div> );
};
export default Feedback;