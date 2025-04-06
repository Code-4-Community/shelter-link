import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Shelter } from '../types';
import { useEffect, useState } from 'react';
import { getShelters } from '../services/mapService';

const Map = ({
  onMarkerPress,
}: {
  onMarkerPress: (shelter: Shelter) => void;
}) => {
  const [shelters, setShelters] = useState<Shelter[]>([]);

  const fetchShelters = async () => {
    try {
      const data = await getShelters();
      setShelters(data);
    } catch (error) {
      console.error('Error fetching shelters:', error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, []);

  return (
    <MapContainer
      center={[42.3601, -71.0589]}
      zoom={13}
      style={{
        height: '100%',
        width: '100%',
        borderRadius: 1,
        zIndex: -1000,
      }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {shelters.map((shelter) => {
        const customIcon = L.divIcon({
          className: 'custom-marker',
          // html: `<div style="font-size: 30px;">${shelter.emoji}</div>`,
        });

        return (
          <Marker
            key={shelter.shelterId}
            position={[shelter.latitude, shelter.longitude]}
            icon={customIcon}
            eventHandlers={{
              click: () => {
                onMarkerPress(shelter);
              },
            }}
          />
        );
      })}
    </MapContainer>
  );
};

export default Map;
