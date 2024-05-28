// src/pages/studyPlan/index.tsx
import React from 'react';
import './studyplan.css'; 
import underConstruction from '../../images/underConstruction.jpeg'
import DynamicTable from '../../components/DynamicTable';
import Container from '../../components/Container';
import ModuleForm from '../../data/fetchModuleInfo';
const StudyPlan: React.FC = () => {
  return (
    <div className="studyplan-container">
      <div className="content">
        <h2>This is the study plan page</h2>
        <Container><DynamicTable></DynamicTable></Container>
        <ModuleForm></ModuleForm>
        <img src={underConstruction}></img>
        <p>Under Construction...</p>
      </div>
    </div>
  );
}

export default StudyPlan;
