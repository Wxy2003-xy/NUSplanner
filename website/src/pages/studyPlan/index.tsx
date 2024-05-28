// src/pages/studyPlan/index.tsx
import React from 'react';
import './studyplan.css'; 
import underConstruction from '../../images/underConstruction.jpeg'
import DynamicTable from '../../components/DynamicTable';
import Container from '../../components/Container';
import ModuleForm from '../../data/fetchModuleInfo';
import generatePrereqTree, { PrereqTreeMap } from '../../../scrapers/nus-v2/src/services/requisite-tree/index.ts';
import { PrereqTree } from '../../../../../../Downloads/nusmod/nusmods-master/website/src/types/modules';
import { PreloadedState } from 'redux';
import parseString from '../../../scrapers/nus-v2/src/services/requisite-tree/parseString';

const StudyPlan: React.FC = () => {
  return (
    <div className="studyplan-container">
      <div className="content">
        <h2>This is the study plan page</h2>
        <Container><DynamicTable></DynamicTable></Container>
        <ModuleForm ></ModuleForm>
        
              
        <img src={underConstruction}></img>
        <p>Under Construction...</p>
      </div>
    </div>
  );
}

export default StudyPlan;
