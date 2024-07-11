import { Dispatch, SetStateAction } from 'react';
import { ExamInfo } from './general';

export interface MinorDetails {
  faculty: string;
  minor: string;
}

export interface CardType {
  id: number;
  name: string;
  content: string;
  courseCredit: number;
  grade?: string | null;
  prereqTree?: PrereqTreeNode | string;  
  prereqNotSatisfied?: boolean;
  color?: string;
  classification?: string;
  examInfo?: ExamInfo[];
}

export type CardProps = {
    id: number;
    name: string;
    courseCredit: number;
    content: string;
    onClick: () => void;
    isSelected?: boolean | null;
    grade?: string | null;
    prereqTree?: PrereqTreeNode | string;
    prereqNotSatisfied?: boolean;
    examInfo?: ExamInfo[];
    color?: string;
  
    classification?: string;
  };

export interface DynamicTableProps {
  tempCard: CardType | null;
  setTempCard: Dispatch<SetStateAction<CardType | null>>;
}

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