import './studyplan.css'; 
import DynamicTable from './components/DynamicTable';
import ModuleForm from '../../data/fetchModuleInfo';
import { useState , ReactDOM, useEffect} from 'react';
import React from 'react'
import { NavLink } from 'react-router-dom';
import logoImage from '../../images/nusplannerLogo.png';

interface PrereqTreeNode {
  and?: (PrereqTreeNode | string)[];
  or?: (PrereqTreeNode | string)[];
  nOf?: [number, (PrereqTreeNode | string)[]];
}

interface CardType {
  id: number;
  name: string;
  content: string;
  courseCredit: number;
  grade?: string | null;
  prereqTree?: PrereqTreeNode | string;  
  prereqNotSatisfied?: boolean;
  color?: string;
}

const StudyPlan: React.FC = () => {
  const [tempCard, setTempCard] = useState<CardType | null>(null);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    setCurrentDate(today.toLocaleDateString(undefined, options));
  }, []);

  return (
    <>
    <header>
       <div className="header-left">
       <a href="Home" className="logo-link">
         <div className="logo-container">
           <img src={logoImage} alt="Logo" />
           <span>NUSPlanner</span>
         </div>
       </a>
         <div className="title-container">
           <p></p>
         </div>
       </div>
       <div className="date-container">
         <span id="current-date"></span>
       </div>
     </header>
    <div className="content" style={{ height: "100vh" }}>
        <nav>
          <div className="nav-left">
            <ul>
              <li className="home">
                <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>🏠<span>Home</span></NavLink>
              </li>
              <li>
                <NavLink to="/studyplan" className={({ isActive }) => isActive ? "active" : ""}>📘<span>Study Plan</span></NavLink>
              </li>
              <li className="timetable">
                <NavLink to="/timetable" className={({ isActive }) => isActive ? "active" : ""}>📋<span>Timetable</span></NavLink>
              </li>
              <li className="community">
                <NavLink to="/community" className={({ isActive }) => isActive ? "active" : ""}>👥️<span>Community</span></NavLink>
              </li>
              <li className="feedback">
                <NavLink to="/feedback" className={({ isActive }) => isActive ? "active" : ""}>✏️<span>Feedback</span></NavLink>
              </li>
              <li className="about">
                <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>ℹ️<span>About us</span></NavLink>
              </li>
            </ul>
          </div>
          <div className="nav-right">
            <div className="studyplan-container">
              <DynamicTable tempCard={tempCard} setTempCard={setTempCard} />
              <ModuleForm setTempCard={setTempCard}/>
            </div>
          </div>
        </nav>
      </div>

      
    </>
  );
}

export default StudyPlan;
