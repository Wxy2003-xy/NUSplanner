import React, { useEffect } from 'react';
import './reminder.css';
import Layout from '../../components/Layout';
import UnderConstruction from '../../components/UnderConstruction';


const Reminder: React.FC = () => {

 return (
  <div>
    <Layout/>
    <div className="home-container">
       <div className="date-container">
         <span id="current-date"></span>
       </div>

         <div className="nav-right">
          <UnderConstruction/>

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
