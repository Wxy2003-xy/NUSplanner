import { PrereqTreeNode } from "./studyplan";
export interface ExamInfo {
    examTime?: string;
    examDuration?: number;
}

export interface ModuleInfo {
    courseCode: string;
    courseName: string;
    courseSemester: number[];
    courseCredit: number;
    preclusions: string;
    preclusionRule: string[];
    prerequisites: string;
    prerequisiteRule: string;
    prereqTree?: PrereqTreeNode; 
    examInfo?: ExamInfo[];
}

export interface ModuleFormProps {
    setTempCard: (card: { 
        id: number; 
        name: string; 
        semester: number[];
        content: string; 
        courseCredit: number; 
        preclusionRule: string[];
        prereqTree?: PrereqTreeNode}) => void;
        examInfo?: ExamInfo[];
}