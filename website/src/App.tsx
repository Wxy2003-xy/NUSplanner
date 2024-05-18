import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/home';
import StudyPlan from './pages/studyPlan';
import Timetable from './pages/timetable';
import Footer from './Footer';


function App() {
  const [message, setMessage] = useState<string>('message');

  useEffect(() => {
    fetch('/')
      .then(response => response.text())
      .then(data => setMessage(data))
      .catch(err => console.error('Error fetching data:', err)); // Proper error handling
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <nav>
          <Link to="/page/home"><button>Home</button></Link>
          <Link to="/page/studyPlan"><button>Study Plan</button></Link>
          <Link to="/page/timetable"><button>Timetable</button></Link>
        </nav>
        <Routes>
          <Route path="/page/home" element={<Home />} />
          <Route path="/page/studyPlan" element={<StudyPlan />} />
          <Route path="/page/timetable" element={<Timetable />} />
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
}

export default App;
