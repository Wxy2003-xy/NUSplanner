import React, { useEffect } from 'react';
import './timetable.css';
import Layout from '../../components/Layout';
import DynamicTimeTable from './components/DynamicTimeTable';
import UnderConstruction from '../../components/UnderConstruction';
const Timetable = () => {
   
return (
  <div>
    <Layout/>
    <div className='nav-right'>
      <UnderConstruction/>
        <div >

        <DynamicTimeTable/>

        </div>
    </div>
  </div>
); };
export default Timetable;