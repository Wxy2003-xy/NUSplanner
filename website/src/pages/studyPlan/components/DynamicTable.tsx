import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './DynamicTable.css';
import PrereqTreeVisual from '../../../pages/studyPlan/components/TreeVisualization';
import { MinorDetails, CardType, DynamicTableProps, SelectedCard, PrereqTreeNode } from '../../../types/studyplan';
import MCbreakDown from './MCbreakDown';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableCard from './DraggableCard';
import DroppableColumn from './DropColumn';
import GuidedTour from './UserGuide';
import ModuleSelectionBox from './ModuleSelection';
const allPrograms = {
  'School of Computing': [
    "Computer Science", 
    "Business Analytics", 
    "Information System", 
    "Information Security"
  ],
  'College of Humanities and Sciences, Asian Studies': [
      "Chinese Language", 
      "Chinese Studies",
      "English Language and Linguistics",
      "English Literature",
      "Global Studies",
      "History",
      "Japanese Studies",
      "Malay Studies",
      "Philosophy",
      "South Asian Studie",
      "Southeast Asian Studies",
      "Theatre and Performance Studie",
  ],
  'College of Humanities and Sciences, Humanities': [
    "Anthropology",
    "Communications and New Media",
    "Economics",
    "Geography",
    "Political Science",
    "Psychology",
    "Social Work",
    "Sociology"
  ],
  'College of Humanities and Sciences, Sciences': [
    "Chemistry",
    "Data Science and Analytics",
    "Food Science and Technology",
    "Life Sciences",
    "Mathematics",
    "Pharmaceutical Science",
    "Physics",
    "Quantitative Finance",
    "Statistics"
  ],
  'College of Design and Engineering': [
    "Architecture",
    "Biomedical Engineering",
    "Chemical Engineering",
    "Civil Engineering",
    "Computer Engineering",
    "Electrical Engineering",
    "Engineering Science",
    "Environmental Engineering",
    "Industrial Design",
    "Industrial & Systems Engineering",
    "Infrastructure & Project Management",
    "Landscape Architecture",
    "Materials Science & Engineering",
    "Mechanical Engineering"
  ],
  'Business School': [
    " ",
    "Business Administration"
  ],
  'Others': [
    "Not Applicable"
  ]
};

const programOptions = [
  'Single Degree Program', 
  'Single Degree with 2nd Major Program', 
  'Double or Concurrent Degree program',
  'Single Degree Program with Minor(s)', 
  'Single Degree with 2nd Major Program with Minor(s)', 
  'Double or Concurrent Degree program with Minor(s)',
  'Others'
];

const DynamicTable: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);  
  const [columnCount, setColumnCount] = useState<number>(8);  
  const [faculty, setFaculty] = useState(() => localStorage.getItem('faculty') || 'School of Computing');
  const [programs, setPrograms] = useState(() => localStorage.getItem('programs') || 'Single Degree Program');
  const [major, setMajor] = useState<string>(() => {
    const storedMajor = localStorage.getItem('major');
    return storedMajor && allPrograms[faculty].includes(storedMajor) 
            ? storedMajor 
            : allPrograms[faculty][0];  
  });
  const [secondFaculty, setSecondFaculty] = useState(() => localStorage.getItem('secondFaculty') || 'School of Computing');
  const [secondMajor, setSecondMajor] = useState(() => localStorage.getItem('secondMajor') || '');
  const [showSecondMajor, setShowSecondMajor] = useState(() => programs.includes('2nd Major') || programs.includes('Double or Concurrent Degree'));
  const [showMinors, setShowMinors] = useState(() => programs.includes('Minor(s)'));
  const [minors, setMinors] = useState<MinorDetails[]>(() => {
    const storedMinors = localStorage.getItem('minors');
    return storedMinors ? JSON.parse(storedMinors) : [];
  });
  const [headerTitle, setHeaderTitle] = useState('');
  const [headerSub, setHeaderSub] = useState('');
  const [isModuleSelectionVisible, setIsModuleSelectionVisible] = useState<boolean>(false);
  const [currentColumnIndex, setCurrentColumnIndex] = useState<number | null>(null);  
  const [tempCard, setTempCard] = useState<CardType | null>(null);
  const [cards, setCards] = useState<Array<Array<CardType>>>(() => {
    const savedCards = localStorage.getItem('cards');
    return savedCards ? JSON.parse(savedCards) : new Array(8).fill([]).map(() => []);
  });
  const [notification, setNotification] = useState<string | null>(null);
  const [clashNotification, setClashNotification] = useState<string | null>(null);
  const [showTour, setShowTour] = useState(() => {
    const storedShowTour = localStorage.getItem('showTourState');
    return storedShowTour === null ? true : storedShowTour === 'true';
  });
  const handleTourClose = () => {
    setShowTour(true);
    localStorage.setItem('showTourState', 'true');
  };
  useEffect(() => { 
    let timer;
    if (notification) {
      timer = setTimeout(() => {
        setNotification(null);
      }, 2000); 
    }
    return () => clearTimeout(timer);
  }, [notification]); 
  useEffect(() => { 
    let timer;
    if (clashNotification) {
      timer = setTimeout(() => {
        setClashNotification(null);
      }, 5000); 
    }
    return () => clearTimeout(timer);
  }, [notification]);
  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null);
  const [grade, setGrade] = useState<string>('');
  const [classification, setClassification] = useState<string>('');
  const toggleCollapse = () => {    
    setIsCollapsed(!isCollapsed);
  };
  const handleColumnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newCount = parseInt(event.target.value);   
    const newCards = new Array(newCount + 1)
        .fill([])
        .map((_, idx) => cards[idx] || []);  // preserve existing arrays, adding new empty arrays
    setColumnCount(newCount);   // update column count state
    setCards(newCards);         // update card table state
  };
  const handleFacultyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newFaculty = event.target.value;
    setFaculty(newFaculty);
    localStorage.setItem('faculty', newFaculty);
    const firstMajor = allPrograms[newFaculty][0];
    setMajor(firstMajor);
    localStorage.setItem('major', firstMajor);
  }
  const handleProgramChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newProgram = event.target.value;
    setPrograms(newProgram);
    localStorage.setItem('programs', newProgram);
    setShowSecondMajor(newProgram.includes('2nd Major') 
        || newProgram.includes('Double or Concurrent Degree'));
    setShowMinors(newProgram.includes('Minor(s)'));
  }
  const handleMajorChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newMajor = event.target.value;
    setMajor(newMajor);
  }
  const handleSecondMajorChange = (event: ChangeEvent<HTMLSelectElement>, type: 'faculty' | 'major') => {
    const value = event.target.value;
    if (type === 'faculty') {
      setSecondFaculty(value);
      localStorage.setItem('secondFaculty', value);
      setSecondMajor('');
    } else if (type === 'major') {
      setSecondMajor(value);
      localStorage.setItem('secondMajor', value);
    }
  };

  const addMinor = () => {
    if (minors.length < 3) {
      const newMinors = [...minors, { faculty: '', minor: '' }];
      setMinors(newMinors);
      localStorage.setItem('minors', JSON.stringify(newMinors));
    }
  };
  
  const removeMinor = (index: number) => {
    const newMinors = minors.filter((_, i) => i !== index);
    setMinors(newMinors);
    localStorage.setItem('minors', JSON.stringify(newMinors));
  };
  
  const handleMinorChange = (index: number, type: 'faculty' | 'minor', value: string) => {
    let newMinors = [...minors];
    newMinors[index][type] = value;
    setMinors(newMinors);
    localStorage.setItem('minors', JSON.stringify(newMinors));
    console.log('minor info set');
  } 

  const handleMoveCard = (fromColumn: number, fromIndex: number, toColumn: number, toIndex = null) => {
    if (fromColumn === undefined || fromIndex === undefined || toColumn === undefined || toIndex === undefined) {
      console.error("Invalid move parameters", {fromColumn, fromIndex, toColumn, toIndex});
      return;
    }
    console.log(`Moving card from Column: ${fromColumn}, Index: ${fromIndex} to Column: ${toColumn}, Index: ${toIndex}`);

    if (fromColumn === toColumn && toIndex !== null) {
      const updatedCards = Array.from(cards[fromColumn]);
      const [removed] = updatedCards.splice(fromIndex, 1);
      updatedCards.splice(toIndex, 0, removed);
      const newCards = [...cards];
      newCards[fromColumn] = updatedCards;
      setCards(newCards);
      // updateCardPrerequisites(removed, toColumn); // Update prerequisites for the moved card
      staticUpdateAllPrerequisites(cards);
      console.log(`Card moved within the same column to a new position Index: ${toIndex}`);
    } else {
      const card = cards[fromColumn][fromIndex];
      if (card === undefined) { return; }
      console.log("Moving card ID: " + card.id)
      const newCards = [...cards];
      newCards[fromColumn] = newCards[fromColumn].filter((_, index) => index !== fromIndex);
      newCards[toColumn].push(card); // Add card to the new column
      // updateCardPrerequisites(card, toColumn); // Update prerequisites for the moved card
      setCards(newCards);
      staticUpdateAllPrerequisites(cards);
      console.log(`Card moved to new Column: ${toColumn} at Index: ${newCards[toColumn].length - 1}`);
    }
};
  const navigate = useNavigate();
  const handleToTimetable = (columnIndex: number) => {
    const column:string[] = cards[columnIndex].map(card => card.name);
    const semester = (columnIndex % 2 === 1 ? 1 : 2);
    navigate("/timetable", { state: { courseList: column, semester: semester } });
  };
  
  useEffect(() => {
    const newCards = calculatePrerequisites(cards);
    if (JSON.stringify(newCards) !== JSON.stringify(cards)) {
      setCards(newCards);
    }
  }, [cards]); 

  useEffect(() => {
    localStorage.setItem('programs', programs);
  }, [programs]);

  useEffect(() => {
    localStorage.setItem('major', major);
  }, [major]);

  useEffect(() => {
    if (minors.length > 0) {
      localStorage.setItem('minors', JSON.stringify(minors));
    }
  }, [minors]);

  useEffect(() => {
    // Construct the title based on whether there's a second major and the program type includes 'Double' or '2nd'
    const title = `Study Plan for ${major}` + (secondMajor && (programs.includes('Double') || programs.includes('2nd Major')) ? ` and ${secondMajor}` : '');
  
    setHeaderTitle(title);
  }, [major, secondMajor, programs]);
  

  useEffect(() => {
    const sub = (minors.length < 1 ? '' : programs.includes('Minor(s)') 
    ? '   with minor(s) in ' + minors.map(m => m.minor).join(', ')
    : '');
    setHeaderSub(sub);
  }, [minors, programs])

  const calculatePrerequisites = (cards: Array<Array<CardType>>): Array<Array<CardType>> => {
    return cards.map((column, columnIndex) => {
      return column.map(card => {
        const isSatisfied = checkPrerequisites(card.prereqTree, columnIndex); 
        return { ...card, prereqNotSatisfied: !isSatisfied, color: isSatisfied ? '#88f7c5' : '#ff9999' };
      });
    });
  };

  /**
  * Checks if two exam time intervals overlap.
  * 
  * @param exam1 - The first exam information.
  * @param exam2 - The second exam information.
  * @returns true if the exams overlap, false otherwise.
  */
  const examsOverlap = (card1: CardType, card2: CardType): boolean => {
    if (!card1.examInfo?.length || !card2.examInfo?.length) {
      console.log("Exam info missing for one or both cards:", card1.name, card2.name);
      return false;
    }
  
    const exam1 = card1.examInfo[0];
    const exam2 = card2.examInfo[0];
  
    if (!exam1.examTime || !exam1.examDuration || !exam2.examTime || !exam2.examDuration) {
      console.log("Exam time or duration is undefined for", card1.name, exam1, card2.name, exam2);
      return false;
    }
  
    const startTime1 = new Date(exam1.examTime);
    const endTime1 = new Date(startTime1.getTime() + exam1.examDuration * 60000); // converting duration to milliseconds
    const startTime2 = new Date(exam2.examTime);
    const endTime2 = new Date(startTime2.getTime() + exam2.examDuration * 60000); // converting duration to milliseconds
  
    const overlap = startTime1 < endTime2 && startTime2 < endTime1;
    console.log(`Checking overlap between ${card1.name} and ${card2.name}: ${overlap}`);

    return overlap;
  }
  
  const showModuleSelectionBox = (columnIndex: number) => {
    if (isModuleSelectionVisible) {
      console.log('close')
        setIsModuleSelectionVisible(false);
        setCurrentColumnIndex(null);
    } else {
      console.log('on')
        setCurrentColumnIndex(columnIndex);
        setIsModuleSelectionVisible(true);
    }
};

  const handleModuleSelectionClose = () => {
    setIsModuleSelectionVisible(false);
    setCurrentColumnIndex(null);
  };

  const handleModuleConfirm = (moduleInfo: CardType) => {
    if (currentColumnIndex !== null) {
      addCard(currentColumnIndex);
    }
    handleModuleSelectionClose();
  };

  const addCard = (columnIndex: number) => {
    if (tempCard) {
      let prereqNotSatisfied = false;
      let examOverlapDetected = false;
      const sem = columnIndex % 2 === 1 ? 1 : 2;
      if (!tempCard.semester.includes(sem)) {
        setNotification(`${tempCard.name} is not offered in current semester`);
        setTempCard(null);
        return;
      }
      // Assuming tempCard.preclusion is an array of course codes that preclude the tempCard
      if (tempCard.preclusionRule && checkPreclusion(tempCard.preclusionRule, columnIndex)) {
        const existingCourse = findPreclusion(tempCard.preclusionRule, columnIndex);
        setNotification(`Course: ${tempCard.name} is precluded by ${existingCourse} in your plan.`);

        setTempCard(null);
        return; // Stop adding the course if it's precluded
      }

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
      
      // Check for exam overlaps with other cards in the same column
      cards[columnIndex].forEach(card => {
      if (card.examInfo && tempCard.examInfo && examsOverlap(card, tempCard)) {
        examOverlapDetected = true;
        console.log('clash')    
        setClashNotification(`Exam time overlap detected between ${tempCard.name} and ${card.name}`);
      }
      });

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
          setNotification(null); 
        }
        setSelectedCard({ ...newCard, columnIndex });
        updateAllPrerequisites()
        setCards(newCards);
      }
    }
  };
  
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

  const handleCardClick = (columnIndex: number, cardId: number) => {
    console.log("ID: " + cardId + " in Column Index: " + columnIndex);
    const cardIndex = cards[columnIndex].findIndex(card => card.id === cardId);
    const card = cards[columnIndex][cardIndex];

    const isSelected = selectedCard && selectedCard.id === cardId;
    if (isSelected) {
      console.log("Deselecting card at Column: " + columnIndex + ", Row: " + cardIndex);
      setSelectedCard(null);
    } else if (card) {
      console.log("Selecting card at Column: " + columnIndex + ", Row: " + cardIndex);
      setSelectedCard({
        ...card,
        columnIndex
      });
      setGrade(card.grade || '');
    }
};


  const updateGrade = (event: ChangeEvent<HTMLSelectElement>) => {
    setGrade(event.target.value);
  };

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

  const getMCCount = (columnCards: Array<CardType>): number => {
    return columnCards.reduce((total, card) => total + Number(card.courseCredit), 0);
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
    console.log('getting table cache')
    localStorage.setItem('cards', JSON.stringify(cards));
  }, [cards]);
  
  /**
  * Checks if a given course is precluded by any courses already in the timetable up to a specified semester index.
  * @param {string[]} preclusionList - List of course codes that preclude the current course.
  * @param {number} columnIdx - The current column index which represents the semester.
  * @returns {boolean} - True if the course is precluded, false otherwise.
  */
  const checkPreclusion = (preclusionList:string[], columnIdx:number):boolean => {
    // Flatten all courses up to the current semester into a single array of course names
    console.log('check preclusion')
    console.log(preclusionList)
    const takenCourses = cards.slice(0, columnIdx + 1).flat().map(card => card.name);
    console.log(takenCourses);
    // Check if any course in the taken courses list is in the preclusion list
    console.log(takenCourses.some(course => preclusionList.includes(course)))
    return takenCourses.some(course => preclusionList.includes(course));
  };

  /**
  * Checks if a given course is precluded by any courses already in the timetable up to a specified semester index.
  * @param {string[]} preclusionList - List of course codes that preclude the current course.
  * @param {number} columnIdx - The current column index which represents the semester.
  * @returns {boolean} - True if the course is precluded, false otherwise.
  */
   const findPreclusion = (preclusionList:string[], columnIdx:number):string | undefined => {
    const takenCourses = cards.slice(0, columnIdx + 1).flat().map(card => card.name);
    return takenCourses.find(course => preclusionList.includes(course));
  };

  /**
  * Check if courses prior the semester new course being added to satisfy all prerequisites of the new course 
  * @param {PrereqTreeNode | string | undefined} prereqTree - prereqTree tree, allows recursive check
  * @param {number} columnIdx - the column new card to be added, right bound of prerequisite check
  * @returns {boolean} - if all prerequisites are satisfied 
  */
  const checkPrerequisites = (prereqTree: PrereqTreeNode | string | undefined, 
                              columnIdx: number): boolean => {
    if (typeof prereqTree === 'string') {
      try {
        // Attempt to parse the string as JSON to handle complex prereq structures
        const parsedTree = JSON.parse(prereqTree);
        return checkPrerequisites(parsedTree, columnIdx);
      } catch { 
        return iterateCardByCourseCodeLeft(prereqTree, columnIdx);
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
      if (requirements.length === 1 
        && typeof requirements[0] === 'string' 
        && requirements[0].search(/\d/) === -1) {
        const countSatisfied = countCardByCourseCodeLeft(requirements[0], columnIdx);
        return countSatisfied >= n;
      } else {
        const countSatisfied = requirements.reduce((count, prereq) => 
        checkPrerequisites(prereq, columnIdx) ? count + 1 : count, 0);
        return countSatisfied >= n;
      }
    }
    // Unrecognized structure, log and return false
    console.error('Invalid prerequisite structure:', prereqTree);
    return false;
  };

  /**
  * Update all cards statue of prerequisite completion
  */
  const updateAllPrerequisites = () => {
    cards.forEach((column, columnIndex) => {
      column.forEach(card => {
        updateCardPrerequisites(card, columnIndex);
      });
    });
  };

  const staticUpdateAllPrerequisites = (cards:CardType[][]) => {
    cards.forEach((column, columnIndex) => {
      column.forEach(card => {
        updateCardPrerequisites(card, columnIndex);
      });
    });
  };
  
  /**
  * Update prerequisite statue if a single card
  * @param {CardType} card - the card to update
  * @param {number} columnIndex - the column the card to update, right bound of prerequisite check
  */
  const updateCardPrerequisites = (card:CardType, columnIndex:number) => {
    const isSatisfied = checkPrerequisites(card.prereqTree, columnIndex);
    card.prereqNotSatisfied = !isSatisfied;
    card.color = isSatisfied ? '#88f7c5' : '#ff9999';
};
  /**
  * Find a card by ID
  * @param {number} id - card ID
  * @returns {CardType} - Card if found
  */
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

  const iterateCardByCourseCodeLeft = (courseCode: string, columnIdx: number): boolean => {
    const hasWildcard = courseCode.includes('%');
    let cleanCourseCode = courseCode.split(':')[0].trim(); // Strip the ":D" suffix if present
    // If there's a wildcard, remove it and any subsequent characters for matching
    if (hasWildcard) {
        cleanCourseCode = cleanCourseCode.split('%')[0].trim();
    }
    console.log('Checking course:', cleanCourseCode);
    // Check for exact matches or prefix matches based on wildcard presence
    for (let i = 0; i < columnIdx; i++) {
        if (hasWildcard) {
            if (cards[i].some(card => card.name.startsWith(cleanCourseCode))) {
                console.log('Found match with wildcard:', cleanCourseCode);
                return true;  
            }
        } else {
            if (cards[i].some(card => card.name === cleanCourseCode)) {
                console.log('Found exact match:', cleanCourseCode);
                return true;
            }
        }
    }
    return false; 
};


  const countCardByCourseCodeLeft = (courseCode: string, columnIdx: number): number => {
    const cleanCourseCode = courseCode.split('%')[0].trim();
    let count:number = 0;
    for (let i = 0; i < columnIdx; i++) {
      if (cards[i].some(card => card.name.includes(cleanCourseCode))) {
        count++; 
      }
    }
    return count;
  }

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
        return <p>The only prerequisite is {prereqData}</p>
      } finally {
        console.log('parsing error')
        return <h3 style={{ textAlign: 'center' }}>{prereqData}</h3>
      }
    } else if (isPrereqTreeNode(prereqData)) {
      return <PrereqTreeVisual data={prereqData} />;
    }
    return <p>No prerequisite</p>;
  };
  
  
  return (
    <div className='global-container'>
      {notification && <div className="notification">{notification}</div>}
      {showTour && <GuidedTour startTour={showTour} onClose={handleTourClose} />}
      {clashNotification && <div className="clash-notification">{clashNotification}</div>}
    <button className="collapse-button"onClick={toggleCollapse}>Major Setting</button>
    <div>
      <div className="collapsible-content" style={{ display: isCollapsed ? 'none' : 'block' }}>
      <div className="dropdown-row">
        {' '}Plan for {'       '}
        <select className="dropdown-select" value={columnCount} onChange={handleColumnChange}>
          {[6, 7, 8, 9, 10, 11, 12].map(num => (
            <option key={num} value={num}>{num} Semesters</option>
          ))}
        </select>
      </div>
      {/* global state: semester; faculty and program choice */}
      <div className='dropdown-list-box'> 
        <div className="dropdown-row">
          {' '}Programme:{'    '}
          <select className="dropdown-select" value={programs} onChange={handleProgramChange}>
            {programOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="dropdown-row">
          {' '}Home faculty:{' '}
          <select className="dropdown-select" value={faculty} onChange={handleFacultyChange}>
            {Object.keys(allPrograms).map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
        <div className="dropdown-row">
          {' ——'} Primary Major:{' '}
          <select className="dropdown-select" value={major} onChange={handleMajorChange}>
            {allPrograms[faculty].map((name:string, index:number) => (
              <option key={index} value={name}>{name}</option>
            ))}
          </select>   
        </div>
    {/* Second Row: Second Faculty, Second Major, and Minors if rendered */}
    {showSecondMajor && (
      <div className='dropdown-list-box'>
        <div className="dropdown-row">
          {' ———— '} Second Major/Degree Faculty:{' '}
          <select className="dropdown-select" value={secondFaculty} onChange={e => handleSecondMajorChange(e, 'faculty')}>
            {Object.keys(allPrograms).map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
        <div className="dropdown-row">
          {' ———————— '} Second Major/Degree:{' '}
          <select className="dropdown-select" value={secondMajor} onChange={e => handleSecondMajorChange(e, 'major')}>
            {allPrograms[secondFaculty].map((major, index) => (
              <option key={index} value={major}>{major}</option>
            ))}
          </select>
        </div>
      </div>
    )}
    {/* Minors Section */}
    {showMinors && (
      <div className='dropdown-list-box'>
        {minors.map((minor, index) => (
          <div key={index} className="dropdown-row-minor">
            {' '}Minor {index + 1} :{' '}
            <select className="dropdown-select-minor" value={minor.faculty} onChange={e => handleMinorChange(index, 'faculty', e.target.value)}>
              {Object.keys(allPrograms).map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
            <select className="dropdown-select-minor" value={minor.minor} onChange={e => handleMinorChange(index, 'minor', e.target.value)}>
              {allPrograms[minor.faculty] ? allPrograms[minor.faculty].map((minorName) => (
                <option key={minorName} value={minorName}>{minorName}</option>
                )) : null}
            </select>
            <button className="remove-minor-button" onClick={() => removeMinor(index)}>Remove</button>
          </div>
        ))}
        {minors.length < 3 && <button onClick={addMinor}>Add Minor {'(up to 3)'}</button>}
      </div>
    )}
  </div>
</div>
  <h1 className='headerline'>{headerTitle}</h1>
  <h3 className='subline'>{headerSub}</h3>
  <div className='mc-breakdonw-box'>
  <MCbreakDown cards={cards}/>
  </div>
    
    <DndProvider backend={HTML5Backend}>
      <div className='table'>
        {cards.map((columnCards, columnIndex) => (
          <DroppableColumn key={columnIndex}
                           columnIndex={columnIndex}
                           columnCards={columnCards}
                           handleMoveCard={handleMoveCard}
                           getMCCount={getMCCount}
                           semesterCount={semesterCount}>
            {columnCards.map((card, index) => (
              <DraggableCard
                key={card.id}
                id={card.id? card.id : Date.now()}
                name={card.name}
                courseCredit={card.courseCredit}
                content={card.content}
                columnIndex={columnIndex}
                index={index}
                handleMoveCard={handleMoveCard}
                handleCardClick={handleCardClick}
                selectedCard={selectedCard}
                grade={card.grade}
                prereqTree={card.prereqTree}
                prereqNotSatisfied={card.prereqNotSatisfied}
                color={card.color}
                classification={card.classification}/>
            ))}
            {/* <button className="add-button" onClick={() => addCard(columnIndex)}>Add Course</button> */}
            <button className="add-button" onClick={() => showModuleSelectionBox(columnIndex)}>Add Course</button>

            <button className="to-timetable-button" onClick={() => handleToTimetable(columnIndex)}>View Timetable</button>
            {/* <button className="to-map-button" onClick={() => handleToMap(columnIndex)}>View Map</button> */}

          </DroppableColumn>
        ))}
      </div>
      <div className='info-on-select'>
      {selectedCard && (
        <div className="confirmation-dialog">
        <div className='selection-section'>
          <div className='remove-confirmation'>
            <p>Delete {selectedCard.name} from {semesterCount(selectedCard.columnIndex)}?</p>
            <button className='yes-button'onClick={removeCard}>Yes</button>
            <button className='no-button'onClick={() => setSelectedCard(null)}>No</button>
          </div>
          <div className='remove-confirmation'>
          <p>Update grade:</p>
          <select className="grade-dropdown-list"value={grade} onChange={updateGrade} required>
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
          </div>
          <div className='remove-confirmation'>
          <p>Classify course:</p>
          <select className="classification-dropdown-list"value={classification} onChange={updateClassification} required>
            <option value="">Classify as:</option>
            <option value="University level requirement">University level requirement</option>
            <option value="Faculty level requirement">Faculty level requirement</option>
            <option value="Major (towards primary degree) requirement">Major {'(towards primary degree)'} requirement</option>
            <option value="Major (towards 2nd degree/major) requirement">Major {'(towards 2nd degree/major)'} requirement</option>
            <option value="Minor requirement">Minor requirement</option>
            <option value="Unrestricted Elective">Unrestricted Elective</option>
            <option value="Specialisation Primary">Specialisation Primary</option>
            <option value="Specialisation Elective">Specialisation Elective</option>
          </select>
          <button className='update-classification-button'onClick={saveClassification}>Update Classification</button>
          </div>
          <button className='close-detail-button' onClick={() => setSelectedCard(null)}>Close Details</button>
          </div>
          <div className='all-info-container'>
            <div>
              <h3>Selected Course Details:</h3>
              <h2><strong></strong> {selectedCard.name}</h2>
              <p><strong>Course Name:</strong> {selectedCard.content}</p>
              <p><strong>Course Credit:</strong> {selectedCard.courseCredit}</p>
              <p><strong>Grade:</strong> {selectedCard.grade || 'Not Set'}</p>
              <p><strong>Exam Info:</strong> {selectedCard.examInfo? selectedCard.examInfo[0].examTime : 'No Exam'}</p>
            </div>
            <div>
              <h3>Prerequisite Tree:</h3>
              <div className='tree-container'>
                {selectedCard ? renderPrereqTreeVisual(selectedCard.prereqTree) 
                : <p>Prerequisite tree not available.</p>}
              </div>
              <p><strong>Prerequisites Satisfied:</strong> {selectedCard.prereqNotSatisfied ? 'No' : 'Yes'}</p>
            </div>
          </div>
          
          
        </div> 
      )}
      </div>
    </DndProvider>
    {isModuleSelectionVisible && (
        <div className='module-selection-overlay-table'>
          <ModuleSelectionBox setTempCard={setTempCard} onConfirm={handleModuleConfirm} />
          <button className='close-module-selection' onClick={handleModuleSelectionClose}>Close</button>
        </div>
      )}
  </div>
  <p className='notificationsite'></p>
  <p className='course-query'></p>
</div>
  );
};

export default DynamicTable;