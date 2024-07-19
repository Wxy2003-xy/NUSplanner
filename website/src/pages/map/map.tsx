import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from 'react-router-dom';
import Layout from '../../components/Layout';
import './map.css';
import { ClassTimeSlotTypeUnion } from '../../types/timetable';
import { loadVenuesX, loadVenuesY } from '../../util/loadVenues';

const getKey = (slot: ClassTimeSlotTypeUnion): string => {
  const key = `${slot.title}${slot.lessonType}${slot.classNo}${slot.day}${slot.startTime}`;
  // console.log(key); // Debugging: Log out the keys to check for duplicates
  return key;
}
const MapComponent = ({ timeSlots }) => {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    // Optionally, adjust map to show all markers
  }, [timeSlots]);

  return (
    <>
      {timeSlots.map((slot:ClassTimeSlotTypeUnion) => (
        <Marker key={getKey(slot)} position={[loadVenuesX(JSON.stringify(slot.venue)), loadVenuesY(JSON.stringify(slot.venue))]}>
          <Popup>
            {slot.title} - {slot.lessonType} <br />
            {slot.venue.roomName}
          </Popup>
        </Marker>
      ))}
    </>
  );
};



const Map = () => {
  const location = useLocation();
  const timeSlots:ClassTimeSlotTypeUnion[] = location.state?.timeSlots || [];
  const [notice, setNotice] = useState<string | null>('');

  return (
    <Layout notice={notice ? <div className="notice-message">{notice}</div> : null}>
      
      <div className="map-nav-right">
        
        <div style={{ height: '100%' }}>
        <div>
      {timeSlots ? (
      timeSlots.map(slot => (
        <div key={getKey(slot)}>
          <p>{`${slot.title} classNo: ${slot.lessonType} ${slot.classNo} on ${slot.day} from ${slot.startTime} to ${slot.endTime} at ${slot.venue} ${loadVenuesX(JSON.stringify(slot.venue))}, ${loadVenuesY(JSON.stringify(slot.venue))}`}</p>
        </div>
      ))
      ) : <p>No valid arrangement found.</p>}

      </div>
          <MapContainer center={[1.29495055860437, 103.77447075499941]} 
                        zoom={16} 
                        style={{ height: '625px', width: '100%' }} 
                        zoomControl={false}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {timeSlots.map(slot => (
              <>
              <Marker key={getKey(slot)} position={[loadVenuesY(JSON.stringify(slot.venue)) as number, loadVenuesX(JSON.stringify(slot.venue)) as number]}>
                <Popup>
                  {slot.title} - {slot.lessonType} <br />
                  {slot.venue} <br />
                  {/* {JSON.stringify(slot.venue?.roomName)}<br /> */}
                  {/* {loadVenuesX(JSON.stringify(slot.venue))}, {loadVenuesY(JSON.stringify(slot.venue))} */}
                </Popup>
              </Marker>
              </>
            ))}
            <ZoomControl position="topright" />
          </MapContainer>
        </div>
      </div>
    </Layout>
  );
};

export default Map;
