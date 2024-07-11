import React, { useState } from 'react';
import './reminder.css';
import Layout from '../../components/Layout';


const Reminder: React.FC = () => {
  const [notice, setNotice] = useState<string | null>('');

 return (
<<<<<<< Updated upstream
  <div>
    <Layout/>
    <div className="home-container">
       <div className="date-container">
         <span id="current-date"></span>
       </div>

         <div className="nav-right">
=======
  <Layout notice={notice ? <div className="notice-message">{notice}</div> : null}>
         <div className="reminder-nav-right">
          <UnderConstruction/>
>>>>>>> Stashed changes
           <div>
             <h2>NUSPlanner</h2>
             <p>Your Smart StudyPlan & TimeTable Designer</p>
           </div>
         </div>
   </div>
</div>
 );
};


export default Reminder;
