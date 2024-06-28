import React, { useState, useEffect, ChangeEvent, Dispatch, SetStateAction } from 'react';
import './DynamicTable.css';
import Card from './Card';
import PrereqTreeVisual from '../../../pages/studyPlan/components/TreeVisualization';
import ProgramTab from './program'; 

interface CardType {
  id: number;
  name: string;
  content: string;
  courseCredit: number;
  grade?: string | null;
  prereqTree?: PrereqTreeNode | string;  
  prereqNotSatisfied?: boolean;
  color?: string;

  classification?: string;
}

interface DynamicTableProps {
  tempCard: CardType | null;
  setTempCard: Dispatch<SetStateAction<CardType | null>>;
}

interface SelectedCard extends CardType {
  columnIndex: number;
}

interface PrereqTreeNode {
  and?: (PrereqTreeNode | string)[];
  or?: (PrereqTreeNode | string)[];
  nOf?: [number, (PrereqTreeNode | string)[]];
}

const DynamicTable: React.FC<DynamicTableProps> = ({ tempCard, setTempCard }) => {
  const [columnCount, setColumnCount] = useState<number>(8);
  const [faculty, setFaculty] = useState<string>(() => localStorage.getItem('faculty') || 'School of Computing');
  const [program, setProgram] = useState<string>(() => localStorage.getItem('program') || 'School of Computing, single degree');

  const [cards, setCards] = useState<Array<Array<CardType>>>(() => {
    const savedCards = localStorage.getItem('cards');
    return savedCards ? JSON.parse(savedCards) : new Array(8).fill([]).map(() => []);
  });

  const [notification, setNotification] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null);
  const [grade, setGrade] = useState<string>('');
  const [classification, setClassification] = useState<string>('');

  const handleFacultyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFaculty(event.target.value);
  }

  const handleProgramChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setProgram(event.target.value);
  }

  const handleColumnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newCount = parseInt(event.target.value);
    const newCards = new Array(newCount + 1).fill([]).map((_, idx) => cards[idx] || []);
    setColumnCount(newCount);
    setCards(newCards);
  };

  useEffect(() => {
    const newCards = calculatePrerequisites(cards);
    if (JSON.stringify(newCards) !== JSON.stringify(cards)) {
      setCards(newCards);
    }
  }, [cards]); 

  useEffect(() => {
    localStorage.setItem('faculty', faculty);
  }, [faculty]);

  useEffect(() => {
    localStorage.setItem('program', program);
  }, [program]);

const calculatePrerequisites = (cards: Array<Array<CardType>>): Array<Array<CardType>> => {
  return cards.map((column, columnIndex) => {
    return column.map(card => {
      const isSatisfied = checkPrerequisites(card.prereqTree, columnIndex); // Ensure this function is also optimized
      return { ...card, prereqNotSatisfied: !isSatisfied, color: isSatisfied ? '#88f7c5' : '#ff9999' };
    });
  });
};


  // Add a card to the table
  const addCard = (columnIndex: number) => {
    if (tempCard) {
      let prereqNotSatisfied = false;
  
      if (tempCard.prereqTree) {
        try {
          const prereqTree:PrereqTreeNode | string = tempCard.prereqTree;
          console.log(JSON.stringify(prereqTree))
          if (!checkPrerequisites(prereqTree, columnIndex)) {
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
              ...cards[i][columnIndex],
              columnIndex: i,
              courseCredit: newCard.courseCredit
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
        setSelectedCard({ ...newCard, columnIndex });
        // Check prerequisites for all existing cards in columns left to the newly added card
        updateAllPrerequisites()
        setCards(newCards);
      }
    }
  };
  

  // Remove a card from the table
  const removeCard = () => {
    if (selectedCard) {
        console.log('Removing card:', selectedCard);
        const { columnIndex, id } = selectedCard;
        const newCards = [...cards];
        const filteredCards = newCards[columnIndex].filter(card => card.id !== id);

        if (newCards[columnIndex].length === filteredCards.length) {
            console.log('No card found to remove with id:', id);
        } else {
            console.log('Card removed, updating state.');
            newCards[columnIndex] = filteredCards;
            setCards(newCards);
            setSelectedCard(null);

            // Update prerequisites for all remaining cards in the affected and subsequent columns
            for (let i = columnIndex; i < newCards.length; i++) {
                newCards[i].forEach(card => {
                    const isSatisfied = checkPrerequisites(card.prereqTree, i);
                    card.prereqNotSatisfied = !isSatisfied;
                    card.color = isSatisfied ? '#88f7c5' : '#ff9999';
                });
            }
            setCards(newCards);
        }
    } else {
        console.log('No selected card to remove.');
    }
};

  

  // Handle card click event
  const handleCardClick = (columnIndex: number, cardId: number) => {
    const card = cards[columnIndex].find(card => card.id === cardId);
    const isSelected = selectedCard && selectedCard.id === cardId;
    if (isSelected) {
      setSelectedCard(null);
    } else if (card) {
      setSelectedCard({
        ...card,
        columnIndex
      });
      console.log(card.prereqTree)
      console.log(typeof(card.prereqTree))
      setGrade(card.grade || '');
    }
  };

  // Update the grade state
  const updateGrade = (event: ChangeEvent<HTMLSelectElement>) => {
    setGrade(event.target.value);
  };

  // Save the updated grade
  const saveGrade = () => {
    if (selectedCard) {
      const { columnIndex, id } = selectedCard;
      const newCards = [...cards];
      const cardIndex = newCards[columnIndex].findIndex(card => card.id === id);
      if (cardIndex !== -1) {
        newCards[columnIndex][cardIndex].grade = grade;
        setCards(newCards);
      }
    }
  };

  const updateClassification = (event: ChangeEvent<HTMLSelectElement>) => {
    setClassification(event.target.value);
  };

  const saveClassification = () => {
    if (selectedCard) {
      const { columnIndex, id } = selectedCard;
      const newCards = [...cards];
      const cardIndex = newCards[columnIndex].findIndex(card => card.id === id);
      if (cardIndex !== -1) {
        newCards[columnIndex][cardIndex].classification = classification;
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
    // Start from the second column, assuming columns are 0-indexed
    return cards.slice(1).reduce((total, column) => {
      return total + column.reduce((colTotal, card) => colTotal + Number(card.courseCredit), 0);
    }, 0);
  };
  

  // Semester descriptions
  const semesterDescriptions = [
    'Exemptions',
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
  const checkPrerequisites = (prereqTree: PrereqTreeNode | string | undefined, columnIdx: number): boolean => {
    if (typeof prereqTree === 'string') {
      try {
        // Attempt to parse the string as JSON to handle complex prereq structures
        const parsedTree = JSON.parse(prereqTree);
        return checkPrerequisites(parsedTree, columnIdx);
      } catch {
        // If parsing fails, assume it's a single course code string
        return getCardByCourseCodeLeft(prereqTree, columnIdx);
      }
    }
  
    if (!prereqTree) return true;  // If no prereqTree, return true (no prerequisites)
  
    // Handling 'and' logic
    if (prereqTree.and) {
      return prereqTree.and.reduce((acc, prereq) => 
        acc && checkPrerequisites(prereq, columnIdx), true);
    }
  
    // Handling 'or' logic
    if (prereqTree.or) {
      return prereqTree.or.reduce((acc, prereq) => 
        acc || checkPrerequisites(prereq, columnIdx), false);
    }
  
    // Handling 'nOf' logic
    if (prereqTree.nOf) {
      const [n, requirements] = prereqTree.nOf;
      const countSatisfied = requirements.reduce((count, prereq) => 
        checkPrerequisites(prereq, columnIdx) ? count + 1 : count, 0);
      return countSatisfied >= n;
    }
  
    // Unrecognized structure, log and return false
    console.error('Invalid prerequisite structure:', prereqTree);
    return false;
  };
  

  const updateAllPrerequisites = () => {
    cards.forEach((column, columnIndex) => {
      column.forEach(card => {
        updateCardPrerequisites(card, columnIndex);
      });
    });
  };
  
  // Called after a card is removed or added to update its display based on prerequisites
  const updateCardPrerequisites = (card:CardType, columnIndex:number) => {
    const isSatisfied = checkPrerequisites(card.prereqTree, columnIndex);
    card.prereqNotSatisfied = !isSatisfied;
    card.color = isSatisfied ? '#88f7c5' : '#ff9999';
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
  const getCardByCourseCodeLeft = (courseCode: string, columnIdx: number): boolean => {
    const cleanCourseCode = courseCode.split(':')[0].trim();
    for (let i = 0; i < columnIdx; i++) {
      if (cards[i].some(card => card.name === cleanCourseCode)) {
        console.log(`${cleanCourseCode} found in column ${i}`);
        return true;  
      }
    }
    console.log(`${cleanCourseCode} not found`);
    return false; 
  };

  function isPrereqTreeNode(tree: PrereqTreeNode | string | undefined): tree is PrereqTreeNode {
    return (typeof tree !== 'string') && (tree !== undefined);
  }

  const renderPrereqTreeVisual = (prereqData: PrereqTreeNode | string | undefined) => {
    if (typeof prereqData === 'string') {
      try {
        const treeData = JSON.parse(prereqData);
        if (isPrereqTreeNode(treeData)) {
          return <PrereqTreeVisual data={treeData} />;
        }
      } catch (error) {
        console.error("Failed to parse prerequisite data:", error);
        return <p>Error displaying prerequisites. Invalid data format.</p>;
      }
    } else if (isPrereqTreeNode(prereqData)) {
      return <PrereqTreeVisual data={prereqData} />;
    }
    return <p>No prerequisite</p>;
  };
  
  
  return (
    <div>
{/* notification */}
      {notification && <div className="notification">{notification}</div>}
{/* global state: semester; faculty and program choice */}
      <div className='dropdown-list-box'>
        <select className="semester-dropdown-list" value={columnCount} onChange={handleColumnChange}>
          {[6, 7, 8, 9, 10, 11, 12].map(num => (
            <option key={num} value={num}>{`${num} Semesters`}</option>
          ))}
        </select>
        <select className="faculty-dropdown-list" value={faculty} onChange={handleFacultyChange}>
          {['School of Computing', 

            'College of Humanities and Sciences, Asian Studies', 
            'College of Humanities and Sciences, Humanities', 
            'College of Humanities and Sciences, Sciences', 

            'College of Design and Engineering',
            'Business School',
            'Others'].map(faculty => (
            <option key={faculty} value={faculty}>{`${faculty}`}</option>
          ))}
        </select>
        <select className="program-dropdown-list" value={program} onChange={handleProgramChange}>
          {['Single Degree Program', 
            'Single Degree with 2nd Major Program', 
            'Double or Concurrent Degree program',
            'Single Degree Program with Minor(s)', 
            'Single Degree with 2nd Major Program with Minor(s)', 
            'Double or Concurrent Degree program with Minor(s)',
            'Others'
            ].map(program => (
            <option key={program} value={program}>{`${program}`}</option>
          ))}
        </select> 
      </div>        
      <ProgramTab 
        faculty={faculty}
        program={program}
        
        />
      <div className="counter-box">
        Total MC count: {getTotalMCCount()}
        <hr />
        <p className="counter-box-breakdown">Total MC breakdown:</p>
      </div>
      <div className="table">
        {cards.map((columnCards, idx) => (idx === 0 ? 
          <div key={idx} className="vcolumns">
          <p className="sem-title">{semesterCount(idx)}</p>
          <p className="sem-mc-count">Courses exempted from:</p>
          {columnCards.map(card => (
            <Card
              key={card.id}
              id={card.id}
              name={card.name}
              courseCredit={card.courseCredit}
              content={card.content}
              onClick={() => handleCardClick(idx, card.id)}
              isSelected={selectedCard && selectedCard.columnIndex === idx && selectedCard.id === card.id}
              grade={card.grade}
              prereqTree={card.prereqTree}
              prereqNotSatisfied={card.prereqNotSatisfied}
              color={card.color} // Pass the custom color
              classification={card.classification}
            />
          ))}
          <button className="add-button" onClick={() => addCard(idx)}>Add Course</button>
      </div>
        :
          <div key={idx} className="vcolumns">
            <p className="sem-title">{semesterCount(idx)}</p>
            <p className="sem-mc-count">Total MC this semester: {getMCCount(columnCards)}</p>
{/* course card display */}
            {columnCards.map(card => (
              <Card
                key={card.id}
                id={card.id}
                name={card.name}
                courseCredit={card.courseCredit}
                content={card.content}
                onClick={() => handleCardClick(idx, card.id)}
                isSelected={selectedCard && selectedCard.columnIndex === idx && selectedCard.id === card.id}
                grade={card.grade}
                prereqTree={card.prereqTree}
                prereqNotSatisfied={card.prereqNotSatisfied}
                color={card.color} 
                classification={card.classification}
              />
            ))}
            <button className="add-button" onClick={() => addCard(idx)}>Add Course</button>
          </div>
        ))}
      </div>
      {selectedCard && (
        <div className="confirmation-dialog">
{/* option to delete course from table */}
          <p>Delete course {selectedCard.name} from {semesterCount(selectedCard.columnIndex)}?</p>
          <button className='yes-button'onClick={removeCard}>Yes</button>
          <button className='no-button'onClick={() => setSelectedCard(null)}>No</button>
{/* update course grade */}
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
          <button className='update-grade-button'onClick={saveGrade}>Update Grade</button>
{/* update course classification */}
          <p>Classify course:</p>
          <select value={classification} onChange={updateClassification} required>
            <option value="">Classify as:</option>
            <option value="University level requirement">University level requirement</option>
            <option value="Faculty level requirement">Faculty level requirement</option>
            <option value="Major (towards primary degree) requirement">Major {'(towards primary degree)'} requirement</option>
            <option value="Major (towards 2nd degree/major) requirement">Major {'(towards 2nd degree/major)'} requirement</option>
            <option value="Minor requirement">Minor requirement</option>
            <option value="Unrestricted Elective">Unrestricted Elective</option>

          </select>
          <button className='update-classification-button'onClick={saveClassification}>Update Classification</button>
{/* course info on selection */}
          <h3>Selected Course Details:</h3>
          {/* <p><strong>ID:</strong> {selectedCard.id}</p> */}
          <h2><strong></strong> {selectedCard.name}</h2>
          <p><strong>Course Name:</strong> {selectedCard.content}</p>
          <p><strong>Course Credit:</strong> {selectedCard.courseCredit}</p>
          <p><strong>Grade:</strong> {selectedCard.grade || 'Not Set'}</p>
          <h3>Prerequisite Tree:</h3>
          <div className='tree-container'>
            {selectedCard ? renderPrereqTreeVisual(selectedCard.prereqTree) 
            : <p>Prerequisite tree not available.</p>}
          </div>
          <p><strong>Prerequisites Satisfied:</strong> {selectedCard.prereqNotSatisfied ? 'No' : 'Yes'}</p>
          <button onClick={() => setSelectedCard(null)}>Close Details</button>
        </div>
        
      )}
    </div>
  );
};

export default DynamicTable;
