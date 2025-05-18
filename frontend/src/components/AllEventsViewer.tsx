import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View, Text, ScrollView } from 'react-native';
import { backgroundColor, darkMainColor, gradientColor1, gradientColor2 } from '../../constants';
import { getEvents } from '../services/eventService';
import { Event } from '../types';
import { useFonts } from 'expo-font';
import EventInfoPanel from './EventInfoPanel';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/AuthContext';

export const AllEventsViewer = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState('');
  const { user } = useAuth();

  
  useFonts({
    AvenirNext: require('../../assets/fonts/AvenirNextLTPro-Bold.otf'),
  });

  const fetchEvents = async () => {
    try {
      const data = await getEvents(); // Use eventService to fetch events

      setEvents(data);
    } catch (error) {
      console.error('Error fetching shelters:', error);
    } finally {
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [query]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[gradientColor1, gradientColor2]}
        style={styles.safeArea}
      >
        <ScrollView contentContainerStyle={styles.resultsContainer}>

          {events.length > 0 ? (
            events.map((e: Event) => (
              <EventInfoPanel key={e.eventId} event={e} style={styles.itemContainer} user={user} />
            ))
          ) : (
            <Text style={styles.noResultsText}>No results found</Text>
          )}
        </ScrollView >
      </LinearGradient>
    </SafeAreaView>
  );
};

const { height: screenHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  itemContainer: {
    marginTop: 29,
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: '10%',
    paddingBottom: '7%',
  },
  resultsContainer: {
    alignItems: 'center',
    paddingBottom: screenHeight / 10,
  },
  noResultsText: {
    paddingTop: '20%',
    fontSize: 20,
    color: darkMainColor,
  },
});

export default AllEventsViewer;
