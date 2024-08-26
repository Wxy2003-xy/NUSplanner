import { useDrop } from 'react-dnd';
import React, { useState } from 'react';
import { CardType } from '../../../types/studyplan';

interface DragItem {
  id: number;
  columnIndex: number;
  index: number;
}

export interface DropResult {
  columnIndex: number;
  newIndex?: number;
}

interface DroppableColumnProps {
  columnIndex: number;
  children: React.ReactNode;
  columnCards: CardType[];
  handleMoveCard: (fromColumn: number, fromIndex: number, toColumn: number, toIndex?: number) => void;
  getMCCount: (columnCards: CardType[]) => number;
  semesterCount: (index: number) => string;
}

const DroppableColumn = ({
  columnIndex,
  children,
  columnCards,
  handleMoveCard,
  getMCCount,
  semesterCount,
}: DroppableColumnProps) => {
  const [isSorted, setIsSorted] = useState(false);

  const [, drop] = useDrop({
    accept: 'CARD',
    drop: (item: DragItem, monitor) => {
      if (!monitor.didDrop()) {
        const newIdx = columnCards.length; 
        handleMoveCard(item.columnIndex, item.index, columnIndex, newIdx);
      }
      return { columnIndex }; 
    },
    hover: (item, monitor) => {
      
    }
  });

  
  const sortCardsByClassification = (cards: CardType[]) => {
    
    return cards.slice().sort((a, b) => {
      if (a.classification == undefined) return -1;
      if (b.classification == undefined) return 1;
      if (a.classification < b.classification) return -1;
      if (a.classification > b.classification) return 1;
      return 0;
    });
  };

  
  const handleSortToggle = () => {
    setIsSorted(!isSorted);
  };

  
  const displayedCards = isSorted ? sortCardsByClassification(columnCards) : columnCards;

  return (
    <div ref={drop} className="vcolumns"> 
      <p className="sem-title">{semesterCount(columnIndex)}</p>
      <p className="sem-mc-count">{columnIndex === 0 ? 'Exempted:' : `Semester MC: ${getMCCount(columnCards)}`}</p>
      {/* Render sorted or unsorted cards based on state */}
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child as React.ReactElement<any>, { card: displayedCards[index] })
      )}
    </div>
  );
};

export default DroppableColumn;
