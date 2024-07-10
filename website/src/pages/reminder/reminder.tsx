import React, { useEffect } from 'react';
import './reminder.css';
import Layout from '../../components/Layout';
import UnderConstruction from '../../components/UnderConstruction';


const Reminder: React.FC = () => {

 return (
   <Layout>
         <div className="reminder-nav-right">
          <UnderConstruction/>
           <div>
             <h2>NUSPlanner</h2>
             <p>Your Smart StudyPlan & TimeTable Designer</p>
           </div>
         </div>
    </Layout>
 );
};


export default Reminder;
