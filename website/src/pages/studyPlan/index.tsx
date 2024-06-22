import './studyplan.css'; 
import DynamicTable from './components/DynamicTable';
import ModuleForm from '../../data/fetchModuleInfo';
import { useState } from 'react';

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

const StudyPlan: React.FC = () => {
  const [tempCard, setTempCard] = useState<CardType | null>(null);

  return (
    <div className="studyplan-container">
        <DynamicTable tempCard={tempCard} setTempCard={setTempCard} />
        <ModuleForm setTempCard={setTempCard}/>
    </div>
  );
}

export default StudyPlan;
