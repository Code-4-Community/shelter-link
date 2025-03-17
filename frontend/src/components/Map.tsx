import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { MapContainer, TileLayer, Marker as WebMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapView, { Marker as NativeMarker } from 'react-native-maps';
import { Shelter } from '../types';
import getShelters from '../services/mapService';

const Map = ({
  onMarkerPress,
}: {
  onMarkerPress: (shelter: Shelter) => void;
}) => {
  const [shelters, setShelters] = useState<Shelter[]>([]);

  const fetchShelters = async () => {
    try {
      const data = await getShelters(); // Use mapService to fetch shelters
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

  if (Platform.OS === 'web') {
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
            <WebMarker
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
  } else {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 42.3601,
            longitude: -71.0589,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {shelters.map((shelter) => (
            <NativeMarker
              key={shelter.shelterId}
              coordinate={{
                latitude: shelter.latitude,
                longitude: shelter.longitude,
              }}
              onPress={() => onMarkerPress(shelter)}
            >
              {/* <Text style={styles.customMarker}>{shelter.emoji}</Text> */}
            </NativeMarker>
          ))}
        </MapView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    borderRadius: 1,
    width: '100%',
    height: '100%',
  },
  customMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    fontSize: 30,
  },
});

export default Map;
