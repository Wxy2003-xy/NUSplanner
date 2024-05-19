import React, { useState, ChangeEvent } from 'react';
import './DynamicTable.css';
import Card from './Card.tsx';

const DynamicTable: React.FC = () => {
  const [columnCount, setColumnCount] = useState<number>(8);
  const [cards, setCards] = useState<Array<Array<{ id: number; name: string; content: string }>>>(new Array(8).fill([]).map(() => []));
  const [selectedCard, setSelectedCard] = useState<{ columnIndex: number; cardId: number } | null>(null);
  const [MCcount, setMCcount] = useState<number>(0);  // Assuming MCcount should be stateful if it's dynamic
  const MCbreakDown:string = 'ssss';
  const handleColumnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newCount = parseInt(event.target.value);
    const newCards = new Array(newCount).fill([]).map((_, idx) => cards[idx] || []);
    setColumnCount(newCount);
    setCards(newCards);
  };

  const addCard = (columnIndex: number) => {
    const newCards = [...cards];
    const newCard = { id: Date.now(), name: `User ${newCards[columnIndex].length + 1}`, content: `Card ${newCards[columnIndex].length + 1}` };
    newCards[columnIndex].push(newCard);
    setCards(newCards);
  };

  const removeCard = () => {
    if (selectedCard) {
      const { columnIndex, cardId } = selectedCard;
      const newCards = [...cards];
      newCards[columnIndex] = newCards[columnIndex].filter(card => card.id !== cardId);
      setCards(newCards);
      setSelectedCard(null);  // Clear the selection after deleting
    }
  };

  const handleCardClick = (columnIndex: number, cardId: number) => {
    const isSelected = selectedCard && selectedCard.columnIndex === columnIndex && selectedCard.cardId === cardId;
    setSelectedCard(isSelected ? null : { columnIndex, cardId });
  };

  const semesterDescriptions = [
    'Year 1 Sem 1', 'Year 1 Sem 2', 'Year 2 Sem 1', 'Year 2 Sem 2',
    'Year 3 Sem 1', 'Year 3 Sem 2', 'Year 4 Sem 1', 'Year 4 Sem 2',
    'Year 5 Sem 1', 'Year 5 Sem 2', 'Year 6 Sem 1', 'Year 6 Sem 2'
  ];

  const semesterCount = (idx: number): string => {
    return semesterDescriptions[idx] || ''; // Return the description or empty if out-of-bounds
  };

  return (
    <div>
      <select value={columnCount} onChange={handleColumnChange}>
        {[6, 7, 8, 9, 10, 11, 12].map(num => <option key={num} value={num}>{`${num} Semesters`}</option>)}
      </select>
      <div className='counter-box'>
        {MCcount}
        <hr></hr>
        <p className='counter-box-breakdown'>
          {MCbreakDown}
        </p>
      </div>
      <div className="table">
        {cards.map((columnCards, idx) => (
          <div key={idx} className="column">
            {columnCards.map(card => (
              <Card
              key={card.id}
              id={card.id}
              name={card.name}
              content={card.content}
              onClick={() => handleCardClick(idx, card.id)}
              isSelected={selectedCard && selectedCard.columnIndex === idx 
                && selectedCard.cardId === card.id}
            />
            ))}
            <button onClick={() => addCard(idx)}>Add Mod</button>
          </div>
        ))}
      </div>
      {selectedCard && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to delete this card?</p>
          <button onClick={removeCard}>Yes</button>
          <button onClick={() => setSelectedCard(null)}>No</button>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;
