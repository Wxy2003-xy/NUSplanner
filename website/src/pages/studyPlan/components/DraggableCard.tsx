import React from 'react';
import { useDrag } from 'react-dnd';
import { CardType, SelectedCard } from '../../../types/studyplan';
import Card from './Card';

interface DragItem {
  columnIndex: number;
  index: number;
}

interface DraggableCardProps {
  id: number;
  name: string;
  semester: number[];
  courseCredit: number;
  content: string;
  columnIndex: number;
  index: number;
  handleMoveCard: (fromColumn: number, fromIndex: number, toColumn: number, toIndex?: number) => void;
  handleCardClick: (columnIndex: number, cardId: number) => void;
  selectedCard?: SelectedCard | null;
  grade?: string | null;
  prereqTree?: CardType['prereqTree'];
  prereqNotSatisfied?: boolean;
  colorScheme?: string;
  classification?: string;
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  id,
  name,
  semester,
  courseCredit,
  content,
  columnIndex,
  index,
  handleCardClick,
  selectedCard,
  grade,
  prereqTree,
  prereqNotSatisfied,
  colorScheme,
  classification,
}) => {
  const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>(() => ({
    type: 'CARD',
    item: { columnIndex, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={(node) => { drag(node); }} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card
        id={id}
        name={name}
        semester={semester}
        courseCredit={courseCredit}
        content={content}
        onClick={() => handleCardClick(columnIndex, id)}
        isSelected={selectedCard?.columnIndex === columnIndex && selectedCard.id === id}
        grade={grade}
        prereqTree={prereqTree}
        prereqNotSatisfied={prereqNotSatisfied}
        colorScheme={colorScheme}
        classification={classification}
      />
    </div>
  );
};

export default DraggableCard;
