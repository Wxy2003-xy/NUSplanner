// Card.tsx
import React from 'react';
import './Card.css';
import classnames from 'classnames';

type CardProps = {
  id: number;
  name: string;
  courseCredit: number;
  content: string;
  onClick: () => void;
  isSelected?: boolean | undefined | null;
  grade?: string | null;
};

const Card: React.FC<CardProps> = ({ id, name, courseCredit, content, onClick, isSelected = false, grade }) => {
  const cardClass = isSelected ? 'card selected' : 'card';

  return (
    <div className={cardClass} onClick={onClick}>
      <div className="card-title">{name}</div>
      <div className="card-text">{content}</div>
      <div className="card-grade">{grade || ' '}</div>
    </div>
  );
};

export default Card;
