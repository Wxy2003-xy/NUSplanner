import './studyplan.css'; 
import DynamicTable from './components/DynamicTable';
import ModuleForm from '../../data/fetchModuleInfo';
import { useState } from 'react';
import React from 'react'
import Layout from '../../components/Layout';
import { CardType, PrereqTreeNode } from '../../types/studyplan';

const StudyPlan: React.FC = () => {
  const [tempCard, setTempCard] = useState<CardType | null>(null);
  const [notice, setNotice] = useState<string | null>('');

  return (
    <Layout notice={notice ? <div className="notice-message">{notice}</div> : null}>
          <div className="studyplan-nav-right">
            <div className="studyplan-container">
              <DynamicTable tempCard={tempCard} setTempCard={setTempCard} />
              <ModuleForm setTempCard={setTempCard}/>
            </div>
          </div>      
    </Layout>
  );
}

export default StudyPlan;
