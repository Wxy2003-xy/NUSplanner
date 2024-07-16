import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Layout from '../../components/Layout';
import UnderConstruction from '../../components/UnderConstruction';
import './map.css'
const MapComponent = () => {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
  }, []);

  return null;
};

const Map = () => {
  const [notice, setNotice] = useState<string | null>('');

  return (
    <Layout notice={notice ? <div className="notice-message">{notice}</div> : null}>
       <div className="map-nav-right">
            <div style={{ height: '100%' }}>
              <MapContainer center={[1.29495055860437, 103.77447075499941]} 
                            zoom={16} 
                            style={{ height: '625px', width: '100%' }} 
                            zoomControl={false}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <ZoomControl position="topright" />
              <MapComponent />
            </MapContainer>
          </div>

      </div>
    </Layout>
  );
};

export default Map;
