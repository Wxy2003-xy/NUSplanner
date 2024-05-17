// src/components/Header.js
import React from 'react';
import './Header.css'; // Ensure this path is correct
import logoImage from '../images/logoImage.jpeg'; // Adjust the path if necessary

function Header() {
  return (
    <header className="Header">
      <img src={logoImage} alt="Logo" className="App-logo" style={{ marginRight: 'auto' }} />
    
      <div className='title-container'>
        <h1>Welcome to NUSPlanner</h1>
        <h3>This is a simple React application with a Node.js backend.</h3>
      </div>
    </header>
  );
}

export default Header;



