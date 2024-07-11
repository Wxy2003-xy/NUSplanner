import React, { useState } from 'react';
import './timetable.css';
import Layout from '../../components/Layout';
import DynamicTimeTable from './components/DynamicTimeTable';
import UnderConstruction from '../../components/UnderConstruction';
const Timetable = () => {
  const [notice, setNotice] = useState<string | null>('');
   
return (
  <Layout notice={notice ? <div className="notice-message">{notice}</div> : null}>
    <div className='timetable-nav-right'>
      <UnderConstruction/>
        <div >

        <DynamicTimeTable/>

        </div>
    </div>
    </Layout>
); };
export default Timetable;