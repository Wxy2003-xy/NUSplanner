import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home';
import StudyPlan from './pages/studyPlan';
import Timetable from './pages/timetable';
import Footer from './components/Footer';

function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetch('/')
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(err => console.error('Error fetching data:', err)); // Proper error handling
  }, []);

  return (
    <>
    <Router>
      <Header />
      <div className="appPage-container">
        <div className="sidebar">
          <h3>Navigation</h3>
          <ul>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/studyPlan">Study Plan</Link></li>
            <li><Link to="/timetable">Timetable</Link></li>
          </ul>
        </div>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/studyPlan" element={<StudyPlan />} />
          <Route path="/timetable" element={<Timetable />} />
        </Routes>
      </div>
      
    </Router>
    <Footer />
    </>
  );
}

export default App;
