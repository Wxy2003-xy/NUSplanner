import { useDrop } from 'react-dnd';
import React from 'react';
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
  const [, drop] = useDrop({
    accept: 'CARD',
    drop: (item: DragItem) => {
      const newIdx = columnCards.length;
      handleMoveCard(item.columnIndex, item.index, columnIndex, newIdx);
      return { columnIndex }; 
    },
  });

  return (
    <div ref={drop} className="vcolumns"> 
      <p className="sem-title">{semesterCount(columnIndex)}</p>
      <p className="sem-mc-count">{columnIndex === 0 ? 'Exempted:' : `Semester MC: ${getMCCount(columnCards)}`}</p>
      {children}
    </div>
  );
};

export default DroppableColumn;
