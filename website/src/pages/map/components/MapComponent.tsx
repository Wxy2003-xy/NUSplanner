import React, { useEffect } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';

const MapComponent = ({ timeSlots, venues }) => {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize(); 
  }, [timeSlots]);

  return (
    <>
      {timeSlots.map((slot, index) => {
        const venue = venues[slot.venue];
        return venue ? (
          <Marker key={index} position={[venue.location.y, venue.location.x]}>
            <Popup>
              {slot.title} - {slot.lessonType} <br />
              {venue.roomName}
            </Popup>
          </Marker>
        ) : null;
      })}
    </>
  );
};

export default MapComponent;
