import React, { useState, useEffect, useRef } from 'react';
import emailjs from 'emailjs-com';
import './feedback.css';
import Layout from '../../components/Layout';

const Feedback = () => {
  const [message, setMessage] = useState('');
  const [modalText, setModalText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState(''); // State to manage feedback type

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    setCurrentDate(today.toLocaleDateString(undefined, options));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && event.target === modalRef.current) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const sendFeedback = (feedbackContent: string, feedbacktype: string) => {
    const serviceID = 'service_j372can';
    const templateID = 'template_apwji5m';
    const userID = 'PtThpNOKmxSv-C1nB';
    const templateParams = {
      message: feedbackContent,
      type: feedbacktype, // Include feedback type in the email
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
      sendFeedback(trimmedMessage, feedbackType); // Send feedback type along with the message
      setMessage(''); // Clear the message input
    }
    setIsModalOpen(true); // Show the modal in both cases
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const showForm = (type: string) => {
    setFeedbackType(type); // Set the feedback type
    setFormVisible(true);
  };

  // Determine placeholder based on feedbackType
  const getPlaceholder = () => {
    switch (feedbackType) {
      case 'Report':
        return 'Please describe the issue you encountered...';
      case 'Suggestion':
        return 'Please share your suggestions for improvement...';
      case 'Other':
        return 'Please write your feedback here...';
      default:
        return 'Write your feedback here...';
    }
  };

  return (
    <Layout>
      <div className="feedback-nav-right">
        <div className="form-group">
          <h1>Your Support Lights Our Way—Thank You!</h1>
          <p>
            NUSPlanner is a wholly student-run, non-profit initiative that thrives on the ongoing support from the NUS student community. We deeply value your involvement, whether it is through sharing your experiences, reporting issues, or suggesting enhancements. Your feedback and contributions are immensely appreciated and will be carefully considered as we strive to improve. Thank you for being an integral part of our journey!
          </p>
          
          <p className="feedback-prefix">I would like to:     
            <button className="report-button" onClick={() => showForm('Report')}>Report Issues</button>
            <button className="suggest-button" onClick={() => showForm('Suggestion')}>Suggest Improvements</button>
            <button className="other-button" onClick={() => showForm('Other')}>Give Other Feedback</button> 
          </p>
          
          {formVisible && (
            <form id="feedback-form" className="feedbackform" onSubmit={handleSubmit}>
              <h2>Feedback Form</h2>
              <textarea
                id="message"
                name="message"
                placeholder={getPlaceholder()} // Use dynamic placeholder
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button className="submit-button" type="submit">Submit</button>
            </form>
          )}
        </div>

        {isModalOpen && (
          <div id="myModal" className="modal show" ref={modalRef}>
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <p id="modal-text">{modalText}</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Feedback;
