import React, { useState, ChangeEvent } from 'react';
import './HorizontalDynamicTable.css'; // Make sure the CSS is adapted for horizontal layout
import Card from './Card.tsx'; // Adjust the path according to your project structure

const HorizontalDynamicTable: React.FC = () => {
  const [rowCount, setRowCount] = useState<number>(5);
  const [cards, setCards] = 
        useState<Array<Array<{ id: number; name: string; content: string }>>>(new Array(5).fill([]));

  const handleRowChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newCount = parseInt(event.target.value);
    // Adjust the structure to fit the current cards or initialize empty as needed
    const newCards = new Array(newCount).fill([]).map((_, idx) => cards[idx] || []);
    setRowCount(newCount);
    setCards(newCards);
  };

  const addCard = (rowIndex: number) => {
    const newCards = [...cards];
    const newCard = { id: Date.now(), name: `User ${newCards[rowIndex].length + 1}`, 
                      content: `Card ${newCards[rowIndex].length + 1}` };

    if (newCards[rowIndex]) {
      newCards[rowIndex] = [...newCards[rowIndex], newCard];
      setCards(newCards);
    }
  };

  return (
    <div>
      <select value={rowCount} onChange={handleRowChange}>
        {[4,5,6,7].map(num => <option key={num} value={num}>{`${num} Rows`}</option>)}
      </select>

      <div className="horizontal-table">
        {cards.map((rowCards, idx) => (
          <div key={idx} className="row">
            {rowCards.map(card => (
              <Card key={card.id} id={card.id} name={card.name} content={card.content} />
            ))}
            <button onClick={() => addCard(idx)}>Add Card</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalDynamicTable;
