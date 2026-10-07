import React, { useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import { Info, MapPin, Navigation } from 'react-feather';
import { useLocation } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Layout from '../../components/Layout';
import { ClassTimeSlotTypeUnion } from '../../types/timetable';
import { loadVenuesX, loadVenuesY } from '../../util/loadVenues';
import './map.css';

const lessonIcons = {
  tutorial: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/128/149/149060.png', iconSize: [38, 38] }),
  recitation: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/128/9458/9458883.png', iconSize: [38, 38] }),
  lecture: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', iconSize: [38, 38] }),
  seminar: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/128/11269/11269426.png', iconSize: [38, 38] }),
};

const getIcon = (lessonType = '') => {
  if (lessonType === 'Tutorial' || lessonType === 'Laboratory') return lessonIcons.tutorial;
  if (lessonType === 'Recitation') return lessonIcons.recitation;
  if (lessonType === 'Sectional Teaching' || lessonType === 'Seminar') return lessonIcons.seminar;
  return lessonIcons.lecture;
};

const getKey = (slot: ClassTimeSlotTypeUnion) => (
  `${slot.title}${slot.lessonType}${slot.classNo}${slot.day.join('-')}${slot.startTime.join('-')}`
);

const Map = () => {
  const location = useLocation();
  const markers = useMemo(() => {
    const timeSlots: ClassTimeSlotTypeUnion[] = location.state?.timeSlots || [];
    return timeSlots.map((slot) => {
    const venue = JSON.stringify(slot.venue);
    const latitude = Number(loadVenuesY(venue));
    const longitude = Number(loadVenuesX(venue));
    return { slot, latitude, longitude };
    }).filter(({ latitude, longitude }) => Number.isFinite(latitude) && Number.isFinite(longitude));
  }, [location.state]);

  return (
    <Layout>
      <div className="page-shell map-page">
        <div className="page-heading map-heading">
          <div>
            <p className="page-eyebrow">From timetable to campus</p>
            <h1>Know where the day takes you.</h1>
            <p className="page-description">Class locations from your generated timetable appear here automatically.</p>
          </div>
          <div className="map-location-count"><MapPin size={16} /> {markers.length} {markers.length === 1 ? 'venue' : 'venues'}</div>
        </div>

        <section className="map-workspace surface-card">
          <div className="map-toolbar">
            <div>
              <span className="map-toolbar-icon"><Navigation size={18} /></span>
              <span><strong>NUS Kent Ridge</strong><small>Interactive campus view</small></span>
            </div>
            <div className="map-legend" aria-label="Map legend">
              <span><i className="map-dot map-dot-lecture" /> Lecture</span>
              <span><i className="map-dot map-dot-class" /> Tutorial / lab</span>
              <span><i className="map-dot map-dot-seminar" /> Seminar</span>
            </div>
          </div>

          <div className="map-canvas-wrap">
            <MapContainer
              center={[1.29495055860437, 103.77447075499941]}
              zoom={16}
              className="map-canvas"
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {markers.map(({ slot, latitude, longitude }) => (
                <Marker key={getKey(slot)} position={[latitude, longitude]} icon={getIcon(slot.lessonType)}>
                  <Popup>
                    <div className="map-popup-content">
                      <strong>{slot.title} · {slot.lessonType}</strong>
                      <span>{typeof slot.venue === 'string' ? slot.venue : slot.venue?.roomName}</span>
                      <small>Class {slot.classNo}</small>
                    </div>
                  </Popup>
                </Marker>
              ))}
              <ZoomControl position="topright" />
            </MapContainer>

            {markers.length === 0 && (
              <div className="map-empty-state">
                <span><MapPin size={24} /></span>
                <h2>No timetable venues yet</h2>
                <p>Generate a timetable and choose “View map” to plot your classes here.</p>
              </div>
            )}
          </div>
        </section>

        <details className="map-credits">
          <summary><Info size={14} /> Map and marker credits</summary>
          <p>
            Map data © OpenStreetMap contributors. Marker icons by Freepik, madness, and Anggara via Flaticon.
          </p>
        </details>
      </div>
    </Layout>
  );
};

export default Map;
