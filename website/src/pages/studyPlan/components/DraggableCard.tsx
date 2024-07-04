import React from 'react';
import { useDrag } from 'react-dnd';
import Card from './Card';
import {DropResult} from './DropColumn'

const DraggableCard = ({
  id, name, courseCredit, content, columnIndex, index,
  handleMoveCard, handleCardClick, selectedCard, grade,
  prereqTree, prereqNotSatisfied, color, classification
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { columnIndex, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult() as DropResult; // Cast to the correct type
      if (item && dropResult && item.columnIndex === dropResult.columnIndex) {
        handleMoveCard(item.columnIndex, item.index, dropResult.newIndex || item.index);
        // Use item.index as fallback if newIndex is undefined
      }
    }
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <Card
        id={id}
        name={name}
        courseCredit={courseCredit}
        content={content}
        onClick={() => handleCardClick(columnIndex, id)}
        isSelected={selectedCard && selectedCard.columnIndex === columnIndex && selectedCard.id === id}
        grade={grade}
        prereqTree={prereqTree}
        prereqNotSatisfied={prereqNotSatisfied}
        color={color}
        classification={classification}
      />
    </div>
  );
};

export default DraggableCard;
