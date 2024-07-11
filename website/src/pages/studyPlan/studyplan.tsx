import './studyplan.css'; 
import DynamicTable from './components/DynamicTable';
import ModuleForm from '../../data/fetchModuleInfo';
import { useState } from 'react';
import React from 'react'
import Layout from '../../components/Layout';
<<<<<<< Updated upstream

interface PrereqTreeNode {
  and?: (PrereqTreeNode | string)[];
  or?: (PrereqTreeNode | string)[];
  nOf?: [number, (PrereqTreeNode | string)[]];
}

interface CardType {
  id: number;
  name: string;
  content: string;
  courseCredit: number;
  grade?: string | null;
  prereqTree?: PrereqTreeNode | string;  
  prereqNotSatisfied?: boolean;
  color?: string;
}
=======
import { CardType } from '../../types/studyplan';
>>>>>>> Stashed changes

const StudyPlan: React.FC = () => {
  const [tempCard, setTempCard] = useState<CardType | null>(null);
  const [notice, setNotice] = useState<string | null>('');

  return (
<<<<<<< Updated upstream
    <div>
      <Layout/>
          <div className="nav-right">
=======
    <Layout notice={notice ? <div className="notice-message">{notice}</div> : null}>
          <div className="studyplan-nav-right">
>>>>>>> Stashed changes
            <div className="studyplan-container">
              <DynamicTable tempCard={tempCard} setTempCard={setTempCard} />
              <ModuleForm setTempCard={setTempCard}/>
            </div>
          </div>      
    </div>
  );
}

export default StudyPlan;
