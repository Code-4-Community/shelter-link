import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import {
  bodyFont,
  bodyFontSize,
  buttonBackgroundColor,
  caption1FontSize,
  darkMainColor,
  gradientColor1,
  gradientColor2,
} from 'frontend/constants';
import { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useAuth } from '../hooks/AuthContext';
import { Shelter, UserShelterBookmark, Event } from '../types';
import {
  getEventBookmarks,
  getShelterBookmarks,
} from '../services/userService';
import { getShelter } from '../services/mapService';
import ShelterInfoPanel from './ShelterInfoPanel';
import { useBookmarks } from '../hooks/BookmarkContext';
import EventInfoPanel from './EventInfoPanel';
import { getEvent } from '../services/eventService';

export const ProfilePage = () => {
  const [selectedButton, setSelectedButton] = useState<'shelters' | 'events'>(
    'shelters'
  );
  const { user } = useAuth();
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const {
    shelterBookmarks,
    toggleShelterBookmark,
    eventBookmarks,
    toggleEventBookmark,
  } = useBookmarks();

  useFonts({
    AvenirNext: require('../../assets/fonts/AvenirNextLTPro-Regular.otf'),
  });

  useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        const savedShelters = await Promise.all(
          shelterBookmarks.map((id: string) => getShelter(id))
        );
        setShelters(savedShelters);

        const savedEvents = await Promise.all(
          eventBookmarks.map((id: string) => getEvent(id))
        );
        setEvents(savedEvents);
      } catch (error) {
        console.error('Error fetching saved items:', error);
      }
    };

    fetchSavedItems();
  }, [user, shelterBookmarks, eventBookmarks]);

  return (
    <LinearGradient
      colors={[gradientColor1, gradientColor2]}
      style={styles.safeArea}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              selectedButton === 'shelters' && styles.selectedButton,
            ]}
            onPress={() => setSelectedButton('shelters')}
          >
            <Text
              style={[
                styles.buttonText,
                selectedButton === 'shelters' && styles.selectedButtonText,
              ]}
            >
              Saved Shelters
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              selectedButton === 'events' && styles.selectedButton,
            ]}
            onPress={() => setSelectedButton('events')}
          >
            <Text
              style={[
                styles.buttonText,
                selectedButton === 'events' && styles.selectedButtonText,
              ]}
            >
              Saved Events
            </Text>
          </TouchableOpacity>
        </View>

        {selectedButton === 'shelters' ? (
          <FlatList
            data={shelters}
            keyExtractor={(item) => item.shelterId}
            renderItem={({ item }) => (
              <ShelterInfoPanel
                shelter={item}
                user={user}
                style={{ marginTop: 20 }}
              />
            )}
            contentContainerStyle={styles.contentContainer}
            style={styles.bookmarkContainer}
          />
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.eventId}
            renderItem={({ item }) => (
              <EventInfoPanel
                event={item}
                user={user}
                style={{ marginTop: 20 }}
              />
            )}
            contentContainerStyle={styles.contentContainer}
            style={styles.bookmarkContainer}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  buttonText: {
    fontSize: caption1FontSize,
    color: darkMainColor,
    fontFamily: bodyFont,
    textAlign: 'center',
  },
  button: {
    backgroundColor: buttonBackgroundColor,
    padding: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 2,
    flex: 1,
    borderColor: darkMainColor,
    marginTop: 20,
  },
  selectedButton: {
    backgroundColor: darkMainColor,
    padding: 5,
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
  },
  selectedButtonText: {
    fontSize: caption1FontSize,
    color: buttonBackgroundColor,
    fontFamily: bodyFont,
    textAlign: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  bookmarkContainer: {
    width: '100%',
    flex: 1,
    backgroundColor: 'white',
    alignContent: 'center',
  },
  contentContainer: {
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
