import React from 'react';
import './Card.css';
import classnames from 'classnames';

interface PrereqTreeNode {
  and?: (PrereqTreeNode | string)[];
  or?: (PrereqTreeNode | string)[];
  nOf?: [number, (PrereqTreeNode | string)[]];
}

type CardProps = {
  id: number;
  name: string;
  courseCredit: number;
  content: string;
  onClick: () => void;
  isSelected?: boolean | undefined | null;
  grade?: string | null;
  prereqTree?: PrereqTreeNode | string;
  prereqNotSatisfied?: boolean;
  color?: string; // Add the color prop
};

const Card: React.FC<CardProps> = ({ id, name, courseCredit, content, onClick, isSelected = false, grade, prereqTree, prereqNotSatisfied, color }) => {
  const cardClass = classnames('card', {
    'selected': isSelected,
    'prereq-not-satisfied': prereqNotSatisfied, // Apply different class if prereqNotSatisfied is true
  });

  return (
    <div className={cardClass} onClick={onClick} style={{ backgroundColor: color }}> {}
      <div className="card-title">{name}</div>
      <div className="card-text">{content}</div>
      <div className="card-grade">{grade || ' '}</div>
    </div>
  );
};

export default Card;
