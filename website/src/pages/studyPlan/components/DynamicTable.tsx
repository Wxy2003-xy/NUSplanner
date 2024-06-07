import React, { useState, useEffect, ChangeEvent, Dispatch, SetStateAction } from 'react';
import './DynamicTable.css';
import Card from './Card';

interface CardType {
  id: number;
  name: string;
  content: string;
  courseCredit: number;
  grade?: string | null;
  prereqTree?: string | undefined | null;
  prereqNotSatisfied?: boolean; 
  color?: string; // defaulting in css
}

interface DynamicTableProps {
  tempCard: CardType | null;
  setTempCard: Dispatch<SetStateAction<CardType | null>>;
}

interface SelectedCard {
  columnIndex: number;
  cardId: number;
  name: string;
  courseCredit: number;
}

interface PrereqTreeNode {
  and?: (PrereqTreeNode | string)[];
  or?: (PrereqTreeNode | string)[];
}

const DynamicTable: React.FC<DynamicTableProps> = ({ tempCard, setTempCard }) => {
  const [columnCount, setColumnCount] = useState<number>(8);
  const [cards, setCards] = useState<Array<Array<CardType>>>(() => {
    const savedCards = localStorage.getItem('cards');
    return savedCards ? JSON.parse(savedCards) : new Array(8).fill([]).map(() => []);
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null);
  const [grade, setGrade] = useState<string>('');

  // Handle the column change event
  const handleColumnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newCount = parseInt(event.target.value);
    const newCards = new Array(newCount).fill([]).map((_, idx) => cards[idx] || []);
    setColumnCount(newCount);
    setCards(newCards);
  };

  // Add a card to the table
  const addCard = (columnIndex: number) => {
    if (tempCard) {
      let prereqNotSatisfied = false;
  
      if (tempCard.prereqTree) {
        try {
          const prereqTree = JSON.parse(tempCard.prereqTree);
          if (!checkPrerequisites(prereqTree)) {
            prereqNotSatisfied = true;
            console.log("not satisfied, labelled");
          }
        } catch (error) {
          setNotification(`Error parsing prerequisites for course: ${tempCard.name}`);
          return;
        }
      }
  
      const newCard = { ...tempCard, prereqNotSatisfied }; 
      let existingCardFound = false;
  
      for (let i = 0; i < cards.length; i++) {
        for (let j = 0; j < cards[i].length; j++) {
          if (cards[i][j].name === newCard.name) {
            setSelectedCard({
              columnIndex: i,
              cardId: cards[i][j].id,
              name: cards[i][j].name,
              courseCredit: newCard.courseCredit,
            });
            existingCardFound = true;
            setNotification(`Course: ${newCard.name} is already allocated for ${semesterCount(i)}.`);
            break;
          }
        }
        if (existingCardFound) break;
      }
  
      if (!existingCardFound) {
        const newCards = [...cards];
        newCards[columnIndex].push(newCard);
        setCards(newCards);
        setTempCard(null);
        if (prereqNotSatisfied) {
          setNotification(`Course: ${newCard.name} does not have all its prerequisites satisfied`);
        } else {
          setNotification(null); // Clear notification
        }
      }
    }
  };
  
  

  // Remove a card from the table
  const removeCard = () => {
    if (selectedCard) {
      const { columnIndex, cardId } = selectedCard;
      const newCards = [...cards];
      newCards[columnIndex] = newCards[columnIndex].filter(card => card.id !== cardId);
      setCards(newCards);
      setSelectedCard(null);
    }
  };

  // Handle card click event
  const handleCardClick = (columnIndex: number, cardId: number) => {
    const card = cards[columnIndex].find(card => card.id === cardId);
    const isSelected = selectedCard && selectedCard.cardId === cardId;
    if (isSelected) {
      setSelectedCard(null);
    } else if (card) {
      setSelectedCard({ columnIndex, cardId, name: card.name, courseCredit: card.courseCredit });
      setGrade(card.grade || '');
    }
  };

  const changeCardColor = (cardId: number, newColor: string) => {
    const newCards = cards.map(column =>
      column.map(card =>
        card.id === cardId ? { ...card, color: newColor } : card
      )
    );
    setCards(newCards);
  };
  

  // Update the grade state
  const updateGrade = (event: ChangeEvent<HTMLSelectElement>) => {
    setGrade(event.target.value);
  };

  // Save the updated grade
  const saveGrade = () => {
    if (selectedCard) {
      const { columnIndex, cardId } = selectedCard;
      const newCards = [...cards];
      const cardIndex = newCards[columnIndex].findIndex(card => card.id === cardId);
      if (cardIndex !== -1) {
        newCards[columnIndex][cardIndex].grade = grade;
        setCards(newCards);
      }
    }
  };

  // Get the MC count for a column
  const getMCCount = (columnCards: Array<CardType>): number => {
    return columnCards.reduce((total, card) => total + Number(card.courseCredit), 0);
  };

  // Get the total MC count
  const getTotalMCCount = (): number => {
    return cards.flat().reduce((total, card) => total + Number(card.courseCredit), 0);
  };

  // Semester descriptions
  const semesterDescriptions = [
    'Year 1 Sem 1', 'Year 1 Sem 2', 'Year 2 Sem 1', 'Year 2 Sem 2',
    'Year 3 Sem 1', 'Year 3 Sem 2', 'Year 4 Sem 1', 'Year 4 Sem 2',
    'Year 5 Sem 1', 'Year 5 Sem 2', 'Year 6 Sem 1', 'Year 6 Sem 2',
  ];

  // Get the semester description for an index
  const semesterCount = (idx: number): string => {
    return semesterDescriptions[idx] || '';
  };

  // Save the cards state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);

  // Iterate over all cards (for debugging purposes)
  const iterateAllCards = () => {
    cards.forEach((column, columnIndex) => {
      column.forEach(card => {
        console.log(`Column ${columnIndex}:`, card);
      });
    });
  };

  // Check if prerequisites are satisfied
  const checkPrerequisites = (prereqTree: PrereqTreeNode | string): boolean => {
    if (typeof prereqTree === 'string') {
      return getCardByCourseCode(prereqTree.split(':')[0]) !== undefined;
    } else if (prereqTree.and) {
      return prereqTree.and.every(checkPrerequisites);
    } else if (prereqTree.or) {
      return prereqTree.or.some(checkPrerequisites);
    }
    return true;
  };

  // Get a card by its ID
  const getCardById = (id: number): CardType | undefined => {
    for (let column of cards) {
      for (let card of column) {
        if (card.id === id) {
          return card;
        }
      }
    }
    return undefined;
  };

  // Get a card by its course code
  const getCardByCourseCode = (courseName: string): CardType | undefined => {
    for (let column of cards) {
      for (let card of column) {
        if (card.name === courseName) {
          return card;
        }
      }
    }
    return undefined;
  };

  return (
    <div>
      {notification && <div className="notification">{notification}</div>}
      <select className="dropdown-list" value={columnCount} onChange={handleColumnChange}>
        {[6, 7, 8, 9, 10, 11, 12].map(num => (
          <option key={num} value={num}>{`${num} Semesters`}</option>
        ))}
      </select>
      <div className="counter-box">
        Total MC count: {getTotalMCCount()}
        <hr />
        <p className="counter-box-breakdown">Total MC breakdown:</p>
      </div>
      <div className="table">
        {cards.map((columnCards, idx) => (
          <div key={idx} className="vcolumns">
            <p className="sem-title">{semesterCount(idx)}</p>
            <p className="sem-mc-count">Total MC this semester: {getMCCount(columnCards)}</p>
            {columnCards.map(card => (
              <Card
                key={card.id}
                id={card.id}
                name={card.name}
                courseCredit={card.courseCredit}
                content={card.content}
                onClick={() => handleCardClick(idx, card.id)}
                isSelected={selectedCard && selectedCard.columnIndex === idx && selectedCard.cardId === card.id}
                grade={card.grade}
                prereqTree={card.prereqTree}
                prereqNotSatisfied={card.prereqNotSatisfied}
                color={card.color} // Pass the custom color
              />
            ))}
            <button className="add-button" onClick={() => addCard(idx)}>Add Course</button>
          </div>
        ))}
      </div>
      {selectedCard && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to delete course {selectedCard.name} from {semesterCount(selectedCard.columnIndex)}?</p>
          <button onClick={removeCard}>Yes</button>
          <button onClick={() => setSelectedCard(null)}>No</button>
          <p>Update grade:</p>
          <select value={grade} onChange={updateGrade} required>
            <option value="">Select Grade</option>
            <option value="A+">A+</option>
            <option value="A">A</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B">B</option>
            <option value="B-">B-</option>
            <option value="C+">C+</option>
            <option value="C">C</option>
            <option value="C-">C-</option>
            <option value="D+">D+</option>
            <option value="D">D</option>
            <option value="F">F</option>
          </select>
          <button onClick={saveGrade}>Update Grade</button>
        </div>
      )}
    </div>
  );
  
};

export default DynamicTable;
