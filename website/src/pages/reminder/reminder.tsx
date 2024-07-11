import React, { useState } from 'react';
import './reminder.css';
import Layout from '../../components/Layout';
import UnderConstruction from '../../components/UnderConstruction';


const Reminder: React.FC = () => {
  const [notice, setNotice] = useState<string | null>('');

 return (
  <Layout notice={notice ? <div className="notice-message">{notice}</div> : null}>
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
