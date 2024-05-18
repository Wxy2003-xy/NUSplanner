import React from 'react';
import './home.css'; // Make sure to import the CSS file for styling
import Like from './components/Like'
const Home: React.FC = () => {
  return (
    <>
    <div className="home-container">
      <div className="content">
        <h2>This is the homepage</h2>
        <p><Like/></p>
        <p>More content goes here...</p>
      </div>
    </div>
    </>
  );
}

export default Home;
