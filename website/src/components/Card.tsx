import React from 'react';
import './Card.css'; // Ensure styles are imported

type CardProps = {
  id: number;
  name: string;
  content: string;
  onClick: () => void;
  isSelected?: boolean | undefined | null; // Make isSelected optional with "?"
};

const Card: React.FC<CardProps> = ({ id, name, content, onClick, isSelected = false }) => { // Default isSelected to false if not provided
  const cardClass = isSelected ? 'card selected' : 'card';

  return (
    <div className={cardClass} onClick={onClick}>
      <div className="card-title">{name}</div>
      <div className="card-text">{content}</div>
    </div>
  );
};

export default Card;
