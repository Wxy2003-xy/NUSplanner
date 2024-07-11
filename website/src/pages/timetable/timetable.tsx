import React, { useState } from 'react';
import './timetable.css';
import Layout from '../../components/Layout';
import DynamicTimeTable from './components/DynamicTimeTable';
const Timetable = () => {
  const [notice, setNotice] = useState<string | null>('');
   
return (
<<<<<<< Updated upstream
  <div>
    <Layout/>
    <div className='nav-right'>
=======
  <Layout notice={notice ? <div className="notice-message">{notice}</div> : null}>
    <div className='timetable-nav-right'>
      <UnderConstruction/>
>>>>>>> Stashed changes
        <div >

        <DynamicTimeTable/>

        </div>
    </div>
  </div>
); };
export default Timetable;