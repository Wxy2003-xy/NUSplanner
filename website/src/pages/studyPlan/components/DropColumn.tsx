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

const DroppableColumn = ({ columnIndex, children, columnCards, handleMoveCard, getMCCount, semesterCount }) => {
  const [, drop] = useDrop({
    accept: 'CARD',
    drop: (item: DragItem, monitor) => {
      if (!monitor.didDrop()) {
        const newIdx = columnCards.length; // Default to moving to the end if no specific index is targeted
        handleMoveCard(item.columnIndex, item.index, columnIndex, newIdx);
      }
      return { columnIndex }; // Inform the drop result about the column index
    },
    hover: (item, monitor) => {
      // Optional: Handle hover to provide real-time feedback
    }
  });

  return (
    <div ref={drop} className="vcolumns">
      <p className="sem-title">{semesterCount(columnIndex)}</p>
      <p className="sem-mc-count">{columnIndex === 0 ? 'Courses exempted from:' : `Total MC this semester: ${getMCCount(columnCards)}`}</p>
      {children}
    </div>
  );
};

export default DroppableColumn;
