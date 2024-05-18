import React, { useState } from 'react';
import './DynamicTable.css';

const DynamicTable = () => {
  const [columnCount, setColumnCount] = useState(3);
  const [cards, setCards] = useState(Array(3).fill([])); // Initially three columns with no cards

  const handleColumnChange = (event) => {
    const newCount = parseInt(event.target.value);
    const newCards = new Array(newCount).fill([]).map((_, idx) => cards[idx] || []);
    setColumnCount(newCount);
    setCards(newCards);
  };

  const addCard = (columnIndex) => {
    const newCards = [...cards];
    newCards[columnIndex] = [...newCards[columnIndex], `Card ${newCards[columnIndex].length + 1}`];
    setCards(newCards);
  };

  return (
    <div>
      <select value={columnCount} onChange={handleColumnChange}>
        {[3, 4, 5, 6].map(num => <option key={num} value={num}>{num} Columns</option>)}
      </select>

      <div className="table">
        {cards.map((columnCards, idx) => (
          <div key={idx} className="column">
            {columnCards.map((card, cardIdx) => (
              <div key={cardIdx} className="card">{card}</div>
            ))}
            <button onClick={() => addCard(idx)}>Add Card</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicTable;
