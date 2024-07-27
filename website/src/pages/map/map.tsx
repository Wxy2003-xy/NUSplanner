import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation } from 'react-router-dom';
import Layout from '../../components/Layout';
import './map.css';
import { ClassTimeSlotTypeUnion } from '../../types/timetable';
import { loadVenuesX, loadVenuesY } from '../../util/loadVenues';
import {Icon} from 'leaflet'
import L from 'leaflet'
// import {Icon} from 'leaflet';

const getKey = (slot: ClassTimeSlotTypeUnion): string => {
  const key = `${slot.title}${slot.lessonType}${slot.classNo}${slot.day}${slot.startTime}`;
  // console.log(key); // Debugging: Log out the keys to check for duplicates
  return key;
}

const tutIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/12034/12034802.png',
  iconSize: [38, 38],     // size of the icon
});
const labIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/2616/2616689.png',
  iconSize: [38, 38],     // size of the icon
});
const recIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/807/807281.png',
  iconSize: [38, 38],     // size of the icon
});
const lecIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/2991/2991117.png',
  iconSize: [38, 38],     // size of the icon
});
const secIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/7743/7743751.png',
  iconSize: [38, 38],     // size of the icon
});
const semIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/128/7743/7743751.png',
  iconSize: [38, 38],     // size of the icon
});
const defIcon = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [38, 38],     // size of the icon
});

const getIcon = (lessonType: string): any => {
  switch(lessonType) {
    // case 'Tutorial': return tutIcon;
    // case 'Laboratory': return labIcon;
    // case 'Lecture': return lecIcon;
    // case 'Sectional Teaching': return secIcon;    
    // case 'Seminar': return semIcon;
    // case 'Recitation': return recIcon;
    default: return defIcon;  
  }
}



const Map = () => {
  
  const location = useLocation();
  const timeSlots:ClassTimeSlotTypeUnion[] = location.state?.timeSlots || [];
  const [notice, setNotice] = useState<string | null>('');

  return (
    <Layout notice={notice ? <div className="notice-message">{notice}</div> : null}>
      
      <div className="map-nav-right">
        
        <div >
        
          <MapContainer center={[1.29495055860437, 103.77447075499941]} 
                        zoom={16} 
                        style={{ height: '900px', width: '100%' }} 
                        zoomControl={false}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {timeSlots.map(slot => (
              <>
              <Marker key={getKey(slot)} 
                      position={[loadVenuesY(JSON.stringify(slot.venue)) as number, loadVenuesX(JSON.stringify(slot.venue)) as number]} 
                      // icon={greenIcon}
                      icon={getIcon(slot.lessonType)}
                      >
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
        <div className='venue-info-list'>
      {timeSlots ? (
      timeSlots.map(slot => (
        <div key={getKey(slot)}>
          <p>{`${slot.title} classNo: ${slot.lessonType} ${slot.classNo} on ${slot.day} from ${slot.startTime} to ${slot.endTime} at ${slot.venue} `}</p>
        </div>
      ))
      ) : <p>No valid arrangement found.</p>}

      </div>
        <div className='credit-section'>
        <h3>Credit:</h3>
        <p><a href="https://www.flaticon.com/free-icons/slides" title="slides icons">Slides icons created by Freepik - Flaticon</a></p>
        <p><a href="https://www.flaticon.com/free-icons/discussion" title="discussion icons">Discussion icons created by Freepik - Flaticon</a></p>
        <p><a href="https://www.flaticon.com/free-icons/classroom" title="classroom icons">Classroom icons created by Freepik - Flaticon</a></p>
        <p><a href="https://www.flaticon.com/free-icons/chemistry" title="chemistry icons">Chemistry icons created by madness - Flaticon</a></p>
        <p><a href="https://www.flaticon.com/free-icons/discussion" title="discussion icons">Discussion icons created by Anggara - Flaticon</a></p>
        <p><a href="https://www.flaticon.com/free-icons/question" title="question icons">Question icons created by Freepik - Flaticon</a></p>
      </div>
      </div>
      
    </Layout>
  );
};

export default Map;
