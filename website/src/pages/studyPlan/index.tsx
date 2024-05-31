// src/pages/studyPlan/index.tsx
import './studyplan.css'; 
import underConstruction from '../../images/underConstruction.jpeg'
import DynamicTable from './components/DynamicTable';
import Container from '../../components/Container';
import generatePrereqTree, { PrereqTreeMap } from '../../../scrapers/nus-v2/src/services/requisite-tree/index.ts';
import { PrereqTree } from '../../../../../../Downloads/nusmod/nusmods-master/website/src/types/modules';
import { PreloadedState } from 'redux';
import parseString from '../../../scrapers/nus-v2/src/services/requisite-tree/parseString';
import ModuleForm from '../../data/fetchModuleInfo';
import { useState } from 'react';
import PrereqTreeComponent from '../../util/visualiser.tsx';

const StudyPlan: React.FC = () => {
  const [tempCard, setTempCard] = useState<{ id: number; name: string; content: string; courseCredit: number} | null>(null);
  // In StudyPlan component
  const [prereqTree, setPrereqTree] = useState<PrereqTree | null>(null);

  return (
    <div className="studyplan-container">
        <ModuleForm setTempCard={setTempCard}/>
        <DynamicTable tempCard={tempCard} setTempCard={setTempCard} />
    </div>
);

}

export default StudyPlan;
