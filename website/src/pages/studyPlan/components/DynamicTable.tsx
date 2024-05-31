import React, { useState, useEffect, ChangeEvent } from 'react';
import { Dispatch, SetStateAction } from 'react';
import './DynamicTable.css';
import Card from './Card.tsx';

interface DynamicTableProps {
  tempCard: { id: number; name: string; content: string; courseCredit: number } | null;
  setTempCard: Dispatch<SetStateAction<{ id: number; name: string; content: string; courseCredit: number } | null>>;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ tempCard, setTempCard }) => {
  const [columnCount, setColumnCount] = useState<number>(8);
  const [cards, setCards] = useState<Array<Array<{ id: number; name: string; content: string; courseCredit: number }>>>(() => {
    const savedCards = localStorage.getItem('cards');
    return savedCards ? JSON.parse(savedCards) : new Array(8).fill([]).map(() => []);
  });

  const [notification, setNotification] = useState<string | null>(null);
  interface SelectedCard {
    columnIndex: number;
    cardId: number;
    name: string;  
    courseCredit: number;
  }
  
  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null);
  const handleColumnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newCount = parseInt(event.target.value);
    const newCards = new Array(newCount).fill([]).map((_, idx) => cards[idx] || []);
    setColumnCount(newCount);
    setCards(newCards);
  };

  const addCard = (columnIndex: number) => {
    if (tempCard) {
        let existingCardFound = false;

        // Search through all columns and cards
        for (let i = 0; i < cards.length; i++) {
            for (let j = 0; j < cards[i].length; j++) {
                if (cards[i][j].name === tempCard.name) {
                    // If a card with the same name exists, select it
                    setSelectedCard({
                        columnIndex: i,
                        cardId: cards[i][j].id,
                        name: cards[i][j].name,  // Also include the name for displaying in the dialog or UI
                        courseCredit: tempCard.courseCredit
                    });
                    existingCardFound = true;
                    setNotification(`Course: ${tempCard.name} is already allocated for ${semesterCount(i)}.`);
                    break;  // Break from the inner loop
                }
            }
            if (existingCardFound) break;  // Break from the outer loop if a duplicate was found
        }

        if (!existingCardFound) {
            // If no existing card is found, add the new card to the specified column
            const newCards = [...cards];
            newCards[columnIndex].push(tempCard);
            setCards(newCards);
            setTempCard(null); // Clear the temporary card after adding
            setNotification(null);  // Clear any previous notification
        }
    }
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
    const card = cards[columnIndex].find(card => card.id === cardId);
    const isSelected = selectedCard && selectedCard.cardId === cardId;
    if (isSelected) {
      setSelectedCard(null);
    } else if (card) {
      setSelectedCard({columnIndex, cardId, name: card.name, courseCredit: card.courseCredit});
    }
  };

  const getMCCount = (columnCards: Array<{ id: number; name: string; content: string; courseCredit: number }>): number => {
    return columnCards.reduce((total, card) => total + Number(card.courseCredit), 0);
  };
  
  const getTotalMCCount = (): number => {
    return cards.flat().reduce((total, card) => total + Number(card.courseCredit), 0);
  };
  
  

  const semesterDescriptions = [
    'Year 1 Sem 1', 'Year 1 Sem 2', 'Year 2 Sem 1', 'Year 2 Sem 2',
    'Year 3 Sem 1', 'Year 3 Sem 2', 'Year 4 Sem 1', 'Year 4 Sem 2',
    'Year 5 Sem 1', 'Year 5 Sem 2', 'Year 6 Sem 1', 'Year 6 Sem 2'
  ];

  const semesterCount = (idx: number): string => {
    return semesterDescriptions[idx] || ''; // Return the description or empty if out-of-bounds
  };

  useEffect(() => {
    // Store the cards in local storage whenever they change
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);  // Dependency array ensures this runs only if cards array changes

  return (
    <div>
      {notification && <div className="notification">{notification}</div>}
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
              courseCredit={card.courseCredit}
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
          <p>Are you sure you want to delete course {selectedCard.name} from {semesterCount(selectedCard.columnIndex)}?</p>
          <button onClick={removeCard}>Yes</button>
          <button onClick={() => setSelectedCard(null)}>No</button>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;
