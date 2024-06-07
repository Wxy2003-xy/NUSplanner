import './studyplan.css'; 
import DynamicTable from './components/DynamicTable';
import ModuleForm from '../../data/fetchModuleInfo';
import { useState } from 'react';

const StudyPlan: React.FC = () => {
  const [tempCard, setTempCard] = useState<{ 
    id: number; 
    name: string; 
    content: string; 
    courseCredit: number; 
    prereqTree?: string | undefined | null} | null>(null);

  return (
    <div className="studyplan-container">
        <DynamicTable tempCard={tempCard} setTempCard={setTempCard} />
        <ModuleForm setTempCard={setTempCard}/>
    </div>
  );
}

export default StudyPlan;
