import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Layout from '../../components/Layout';

const MapComponent = () => {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
  }, []);

  return null;
};

const Map = () => {
  return (
    <div>
      <Layout />
      <div className="map-container"style={{ height: '100%' }}>
        <MapContainer style={{ height: '100%' }} center={[1.29495055860437, 103.77447075499941]} zoom={16} style={{ height: '625px', width: '100%' }} zoomControl={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <ZoomControl position="topright" />
          <MapComponent />
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
