import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Shelter } from '../types';
import { getShelters } from '../services/mapService';
import CustomMarker from './CustomMarker'; // Import the custom marker component

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
    }
  };

  useEffect(() => {
    fetchShelters();
  }, []);

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
          <Marker
            key={shelter.shelterId}
            coordinate={{
              latitude: shelter.latitude,
              longitude: shelter.longitude,
            }}
            onPress={() => onMarkerPress(shelter)}
            tracksViewChanges={false}
          >
            <CustomMarker />
          </Marker>
        ))}
      </MapView>
    </View>
  );
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
});

export default Map;
