import React from 'react';
import { Calendar, Filter, MapPin } from 'react-feather';
import Layout from '../../components/Layout';
import DynamicTimeTable from './components/DynamicTimeTable';
import './timetable.css';

const Timetable = () => (
  <Layout>
    <div className="timetable-page">
      <div className="page-heading timetable-page-heading">
        <div>
          <p className="page-eyebrow">Weekly schedule</p>
          <h1>A timetable that works around you.</h1>
          <p className="page-description">Choose the days and earliest start you prefer. We will find a clash-free arrangement from your selected courses.</p>
        </div>
        <div className="timetable-context">
          <span><Filter size={14} /> Set preferences</span>
          <span><Calendar size={14} /> Review schedule</span>
          <span><MapPin size={14} /> Plot venues</span>
        </div>
      </div>
      <section className="timetable-workspace surface-card" aria-label="Interactive timetable builder">
        <DynamicTimeTable />
      </section>
    </div>
  </Layout>
);

export default Timetable;
