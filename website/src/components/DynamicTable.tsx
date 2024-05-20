import React, { useState, ChangeEvent } from 'react';
import './DynamicTable.css';
import Card from './Card.tsx';

const DynamicTable: React.FC = () => {
  const [columnCount, setColumnCount] = useState<number>(8);
  const [cards, setCards] = 
  useState<Array<Array<{ id: number; name: string; content: string }>>>(new Array(8).fill([]).map(() => []));
  const [selectedCard, setSelectedCard] = useState<{ columnIndex: number; cardId: number } | null>(null);

  const handleColumnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newCount = parseInt(event.target.value);
    const newCards = new Array(newCount).fill([]).map((_, idx) => cards[idx] || []);
    setColumnCount(newCount);
    setCards(newCards);
  };

  const addCard = (columnIndex: number) => {
    const newCards = [...cards];
    const newCard = { id: Date.now(), name: `Card ${newCards[columnIndex].length + 1}`, content: `Card ${newCards[columnIndex].length + 1}` };
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

  const getMCCount = (columnCards: Array<{ id: number; name: string; content: string }>): number => {
    return columnCards.length * 4; // Each card is worth 4 MC
  };

  const getTotalMCCount = (): number => {
    return cards.reduce((total, columnCards) => total + getMCCount(columnCards), 0);
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
      <select className='dropdown-list' value={columnCount} onChange={handleColumnChange}>
        {[6, 7, 8, 9, 10, 11, 12].map(num => <option key={num} value={num}>{`${num} Semesters`}</option>)}
      </select>
      <div className='counter-box'>
        Total MC count: {getTotalMCCount()}
        <hr></hr>
        <p className='counter-box-breakdown'>
          Total MC breakdown:
        </p>
      </div>
      <div className="table">
        {cards.map((columnCards, idx) => (
          <div key={idx} className="column">
            <p className='sem-title'>{semesterCount(idx)}</p>
            <p className='sem-mc-count'>Total MC this semester: {getMCCount(columnCards)}</p>
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
            <button className='add-button' onClick={() => addCard(idx)}>Add Mod</button>
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
