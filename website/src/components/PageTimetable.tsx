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

  function onDragEnd(result:any) {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) {
      return;
    }

    const newEvents = Array.from(events);
    const [reorderedItem] = newEvents.splice(source.index, 1);
    newEvents.splice(destination.index, 0, reorderedItem);

    setEvents(newEvents);
  }

  return (
    <div className="timetable">
      <header className="table-header">
        <h1>My Timetable</h1>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="events">
            {(provided) => (
              <ul {...provided.droppableProps} ref={provided.innerRef}>
                {events.map((event, index) => (
                  <Draggable key={event.id} draggableId={event.id} index={index}>
                    {(provided) => (
                      <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <div>
                          <h4>{event.title}</h4>
                          <p>{event.location}</p>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </header>
    </div>
  );
};

export default PageTimetable;
