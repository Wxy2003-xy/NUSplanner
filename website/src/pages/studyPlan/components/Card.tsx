import React from 'react';
import './Card.css';
import classnames from 'classnames';
import { PrereqTreeNode, CardProps } from '../../../types/studyplan';

const Card: React.FC<CardProps> = ({
  id, name, semester, courseCredit, content, onClick, isSelected = false, grade, prereqTree, 
  prereqNotSatisfied, color, classification
}) => {
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

  return (<div className='container'>
    <div className={cardClass} onClick={onClick} style={{ backgroundColor }}>
      <div className="card-title">{name}</div>
      <div className="card-text">{content}</div>
      <div className="card-text">{JSON.stringify(semester)}</div>

      <div className="card-mc-grade">
        {courseCredit + 'MC ' || ''} {grade?'Grade: ' + grade : ' '}
      </div>
      <div className="card-classification">{classification || ''}</div>
    </div>
    </div>
  );
};

export default Card;
