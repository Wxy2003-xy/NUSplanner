// src/pages/studyPlan/index.tsx
import React from 'react';
import './studyplan.css'; 
import underConstruction from '../../images/underConstruction.jpeg'
import DynamicTable from '../../components/DynamicTable';
const StudyPlan: React.FC = () => {
  return (
    <div className="studyplan-container">
      <div className="content">
        <h2>This is the study plan page</h2>
        <DynamicTable></DynamicTable>
        <img src={underConstruction}></img>
        <p>Under Construction...</p>
      </div>
    </div>
  );
}

export default StudyPlan;
