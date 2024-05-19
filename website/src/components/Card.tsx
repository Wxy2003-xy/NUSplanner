import React from 'react';
import './Card.css'; // Ensure this path is correct based on your project structure
type CardProps = {
    id: number;
    name: string;
    content: string;
  };

const Card: React.FC<CardProps> = ({name, content }) => (
    <div className="card">
            <h2 className="card-title">{name}</h2>
            <p className="card-text">{content}</p>
    </div>
);

export default Card;
