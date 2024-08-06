import { useEffect, useState } from 'react';
import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
import StudyPlan from './pages/studyPlan/studyplan';
import Timetable from './pages/timetable/timetable';
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
      .catch(err => console.error('Error fetching data:', err)); 
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
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
