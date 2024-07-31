import { Dispatch, SetStateAction } from 'react';
import { ExamInfo } from './general';

export interface MinorDetails {
  faculty: string;
  minor: string;
}

export interface CardType {
  id: number;
  name: string;
  semester: number[];
  content: string;
  courseCredit: number;
  grade?: string | null;
  preclusionRule?: string[];
  prereqTree?: PrereqTreeNode | string;  
  prereqNotSatisfied?: boolean;
  color?: string;
  classification?: string;
  examInfo?: ExamInfo[];
}

export type CardProps = {
    id: number;
    name: string;
    semester: number[];
    courseCredit: number;
    content: string;
    onClick: () => void;
    isSelected?: boolean | null;
    grade?: string | null;
    preclusionRule?: string[];
    prereqTree?: PrereqTreeNode | string;
    prereqNotSatisfied?: boolean;
    examInfo?: ExamInfo[];
    color?: string;
  
    classification?: string;
  };

export interface SelectedCard extends CardType {
  columnIndex: number;
}

export interface PrereqTreeNode {
  and?: (PrereqTreeNode | string)[];
  or?: (PrereqTreeNode | string)[];
  nOf?: [number, (PrereqTreeNode | string)[]];
}

export interface MCbreakDownProps {
    cards: Array<Array<CardType>>;
}

export interface ShowBreakDownProps {
    counter: Array<number>;
}