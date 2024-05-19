import React, { useState, ChangeEvent } from 'react';
import './DynamicTable.css';
import Card from './Card.tsx'; // Adjust the path according to your project structure

const DynamicTable: React.FC = () => {
  // Start with 8 columns and initialize each column with an empty array
  const [columnCount, setColumnCount] = useState<number>(8);
  const [cards, setCards] = useState<Array<Array<{ id: number; name: string; content: string }>>>(new Array(8).fill([]));

  const handleColumnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newCount = parseInt(event.target.value);
    // Adjust the structure to fit the current cards or initialize empty as needed
    const newCards = new Array(newCount).fill([]).map((_, idx) => cards[idx] || []);
    setColumnCount(newCount);
    setCards(newCards);
  };

  const addCard = (columnIndex: number) => {
    const newCards = [...cards];
    const newCard = { id: Date.now(), name: `User ${newCards[columnIndex].length + 1}`, content: `Card ${newCards[columnIndex].length + 1}` };

    if (newCards[columnIndex]) {
      newCards[columnIndex] = [...newCards[columnIndex], newCard];
      setCards(newCards);
    }
  };

  const semesterCount = (idx: number):string => {
    switch(idx + 1) {
      case 1: return 'Year 1 Sem 1';
      case 2: return 'Year 1 Sem 2';
      case 3: return 'Year 2 Sem 1';
      case 4: return 'Year 2 Sem 2';
      case 5: return 'Year 3 Sem 1';
      case 6: return 'Year 3 Sem 2';
      case 7: return 'Year 4 Sem 1';
      case 8: return 'Year 4 Sem 2';
      case 9: return 'Year 5 Sem 1';
      case 10: return 'Year 5 Sem 2';
      case 11: return 'Year 6 Sem 1';
      case 12: return 'Year 6 Sem 2';
      default: return '';
    }
  }

  return (
    <div>
      <select value={columnCount} onChange={handleColumnChange}>
        {[6, 7, 8, 9, 10, 11, 12].map(num => <option key={num} value={num}>{`${num} Columns`}</option>)}
      </select>

      <div className="table">
        {cards.map((columnCards, idx) => (
          <div key={idx} className="column">
            <p>{semesterCount(idx)}</p>
            {columnCards.map(card => (
              <Card key={card.id} id={card.id} name={card.name} content={card.content} />
            ))}
            <button onClick={() => addCard(idx)}>Add Card</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicTable;
