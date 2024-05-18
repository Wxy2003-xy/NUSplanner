import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

type Event = {
  id: string;
  title: string;
  location: string;
};

const initialEvents: Event[] = [
  { id: '1', title: 'Opening Ceremony', location: 'Main Hall' },
  { id: '2', title: 'Keynote Speech', location: 'Room A' }
];

const PageTimetable: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  function onDragEnd(result:any) {    //TODO 
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    if (destination.index === source.index) {
      return;
    }

    const newEvents = Array.from(events);
    const [removed] = newEvents.splice(source.index, 1);
    newEvents.splice(destination.index, 0, removed);

    setEvents(newEvents);
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="timetable">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {events.map((event, index) => (
              <Draggable key={event.id} draggableId={event.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      marginBottom: '8px',
                      padding: '10px',
                      border: '1px solid #ccc',
                      backgroundColor: '#f8f8f8',
                      cursor: 'grab'
                    }}
                  >
                    {event.title}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default PageTimetable;
