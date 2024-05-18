import React from 'react';
import './home.css'; // Make sure to import the CSS file for styling
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Footer from '../../Footer';
const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="sidebar">
        <h3>Navigation</h3>
        <ul>
            <p><Link to="/page/home">Home</Link></p>
            <p><Link to="/page/studyPlan">Study Plan</Link></p>
            <p><Link to="/page/timetable">Timetable</Link></p>
        </ul>
      </div>
      <div className="content">
        <h2>This is the homepage</h2>
        <p>More content goes here...</p>
      </div>
      <Footer/>
    </div>
  );
}

export default Home;
