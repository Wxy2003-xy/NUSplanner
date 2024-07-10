import React, { useState, useEffect, useRef } from 'react';
import emailjs from 'emailjs-com';
import './feedback.css';
import Layout from '../../components/Layout';
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
        <Layout/>
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
                  onChange={(e) => setMessage(e.target.value)}/> </div>
                <button type="submit">Submit</button>
            </form>
            <div id="response-message"></div>
          </div>
          <div className="new-line">
        </div>
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