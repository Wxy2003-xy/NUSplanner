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
  isSelected?: boolean | null;
  grade?: string | null;
  prereqTree?: PrereqTreeNode | string;
  prereqNotSatisfied?: boolean;
  color?: string;
};

const Card: React.FC<CardProps> = ({
  id, name, courseCredit, content, onClick, isSelected = false, grade, prereqTree, prereqNotSatisfied, color
}) => {
  // Use a local variable to determine the background color based on selection or prerequisite status
  const backgroundColor = 
    isSelected 
      ? prereqNotSatisfied 
        ? '#f06969'
        : '#00c99e' 
      : prereqNotSatisfied 
        ? '#ff9999' 
        : color;    // original color

  const cardClass = classnames('card', {
    'selected': isSelected,
    'prereq-not-satisfied': prereqNotSatisfied,
  });

  return (
    <div className={cardClass} onClick={onClick} style={{ backgroundColor }}>
      <div className="card-title">{name}</div>
      <div className="card-text">{content}</div>
      <div className="card-grade">{grade || ' '}</div>
    </div>
  );
};

export default Card;
