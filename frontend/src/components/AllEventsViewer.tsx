import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View, Text } from 'react-native';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';
//import Logo from '../components/Logo'; ToRecoverIcon: uncomment this line
import FiltersDropdown from '../components/FiltersDropdown';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { backgroundColor, darkMainColor } from '../../constants';
import getEvents from '../services/eventService';
import { Event } from '../types';
import { useFonts } from 'expo-font';
import EventInfoPanel from './EventInfoPanel';

export const AllEventsViewer = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState('');

  useFonts({
    AvenirNext: require('../../assets/fonts/AvenirNextLTPro-Regular.otf'),
  });

  const fetchEvents = async () => {
    try {
      const data = await getEvents(); // Use mapService to fetch shelters
      setEvents(data);
    } catch (error) {
      console.error('Error fetching shelters:', error);
    } finally {
    }
  };

  useFonts({
    AvenirNext: require('../../assets/fonts/AvenirNextLTPro-Bold.otf'),
  });

  useEffect(() => {
    fetchEvents();
  }, [query]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Header title="Events"/>
      </View>
        {selectedEvent ? (
          <EventInfoPanel
            event={selectedEvent}
            style={styles.itemContainer}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No results found</Text>
          </View>
        )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  container: {
    flex: 1,
  },

  itemContainer: {
    marginTop: 29,
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: '10%',
    paddingBottom: '7%',
  },
  noResultsContainer: {
    flex: 1,
    paddingTop: '20%',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 20,
    color: darkMainColor,
  },
});

export default AllEventsViewer;

