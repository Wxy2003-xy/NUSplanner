import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home/home';
import StudyPlan from './pages/studyPlan/studyplan';
import Timetable from './pages/timetable/timetable';
import Footer from './components/Footer';
import Feedback from './pages/feedback/feedback';
import About from './pages/about/about';
import Community from './pages/community/community';
import Reminder from './pages/reminder/reminder';
import Map from './pages/map/map';
function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetch('/')
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(err => console.error('Error fetching data:', err)); // Proper error handling
  }, []);

  return (
      <Router basename="/NUSplanner">
        <Routes>
          <Route path="/" element={<Home />} /> {/* Default route */}
          <Route path="/home" element={<Home />} />
          <Route path="/studyPlan" element={<StudyPlan />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/about" element={<About />} />
          <Route path="/community" element={<Community />} />
          <Route path="/reminder" element={<Reminder />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </Router>
  );
}

export default App;
