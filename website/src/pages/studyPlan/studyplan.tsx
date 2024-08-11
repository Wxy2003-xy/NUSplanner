import './studyplan.css'; 
import DynamicTable from './components/DynamicTable';
import { useState } from 'react';
import React from 'react'
import Layout from '../../components/Layout';

const StudyPlan: React.FC = () => {
  const [notice, setNotice] = useState<string | null>('');

  return (
    <Layout notice={notice ? <div className="notice-message">{notice}</div> : null}>
          <div className="studyplan-nav-right">
            <div></div>
            <div className="studyplan-container">
              <DynamicTable/>
              {/* <ModuleSelctionBox setTempCard={setTempCard}/> */}
            </div>
          </div>      
    </Layout>
  );
}

export default StudyPlan;
