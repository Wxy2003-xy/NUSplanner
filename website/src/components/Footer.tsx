import './Footer.css';
import React from 'react';

function Footer() {
  return (
    <footer className="site-footer">
      <p>Built by NUS students, for NUS students.</p>
      <p>© {new Date().getFullYear()} NUSPlanner</p>
    </footer>
  );
}

export default Footer;
