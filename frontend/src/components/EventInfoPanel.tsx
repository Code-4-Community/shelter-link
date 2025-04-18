import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {
  bodyFont,
  darkMainColor,
  header1FontSize,
  header2FontSize,
} from '../../constants';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Event, User } from '../types';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { formatDateTime } from '../utils';
import { useBookmarks } from '../hooks/BookmarkContext';

type EventInfoPanelProps = {
  event: Event;
  style?: any;
  user: User | null;
};

type RootStackParamList = {
  'Map View': undefined;
  'Detailed Event View': {
    event: Event;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const EventInfoPanel = ({ event, style, user }: EventInfoPanelProps) => {
  useFonts({
    AvenirNext: require('../../assets/fonts/AvenirNextLTPro-Bold.otf'),
  });

  const { eventBookmarks, toggleEventBookmark } = useBookmarks();

  const [bookmarked, setBookmarked] = useState(
    eventBookmarks.includes(event.eventId)
  );

  const navigation = useNavigation<NavigationProp>();

  const formatAddress = (address: any) => {
    return `${address.street}, ${address.city}, ${address.state}`;
  };

  const handleBookmark = async (eventId: string) => {
    if (user) {
      toggleEventBookmark(eventId);
      setBookmarked(!bookmarked);
    } else {
      alert('Please login to bookmark shelters.');
    }
  };

  useEffect(() => {
    setBookmarked(eventBookmarks.includes(event.eventId));
  }, [eventBookmarks, event.eventId]);

  return (
    <TouchableOpacity
      style={[styles.panel, style]}
      onPress={() => navigation.navigate('Detailed Event View', { event })}
    >
      <View style={styles.topRowItems}>
        <View style={[styles.images, !event.picture && { paddingVertical: 0 }]}>
          {event.picture &&
            event.picture
              .slice(0, 3)
              .map((url, index) => (
                <Image
                  key={index}
                  source={{ uri: url }}
                  style={styles.eventImage}
                />
              ))}
        </View>
        {user && (
          <TouchableOpacity onPress={() => handleBookmark(event.eventId)}>
            <Ionicons
              name={bookmarked ? 'bookmark' : 'bookmark-outline'}
              size={header1FontSize}
              color={darkMainColor}
              style={styles.bookmarkOutline}
            />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.eventName}>{event.event_name}</Text>
      {event.date ? (
        <Text style={styles.shelterNameExpansion}>
          {formatDateTime(event.date)}
        </Text>
      ) : (
        <View style={{ height: 10 }} />
      )}
      <Text style={{ ...styles.eventLocationDistance, alignItems: 'center' }}>
        {event.location ? formatAddress(event.location) : 'Online Event'}
      </Text>
      <View style={styles.buttonsContainer}>
        {event.location && (
          <TouchableOpacity
            style={styles.directionsButton}
            onPress={(e) => {
              e.stopPropagation(); // don't trigger the detailed view
            }}
          >
            <Text style={styles.buttonText}>Directions</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.learnMoreButton}
          onPress={(e) => {
            navigation.navigate('Detailed Event View', { event });
          }}
        >
          <Text style={styles.buttonText}>Learn More</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const panelWidth = screenWidth * 0.85;
const panelHeight = (230 / 332) * panelWidth;

let panelBorderWidth = 2;
let shelterNameFontSize = 20;
let descriptionFontSize = 15;
let buttonFontSize = 14;
let shelterNameLineHeight = 24.2;
let eventLocationDistanceLineHeight = 18.15;
let buttonTextLineHeight = 15.73;
let buttonBorderWidth = 1;
let shelterNameMarginTop = 7;
let iconWidth = 10;
if (screenWidth > 500) {
  panelBorderWidth = panelBorderWidth * (screenWidth / 500);
  shelterNameFontSize = shelterNameFontSize * (screenHeight / 500);
  descriptionFontSize = descriptionFontSize * (screenHeight / 500);
  buttonFontSize = buttonFontSize * (screenHeight / 500);
  shelterNameLineHeight = shelterNameLineHeight * (screenHeight / 500);
  eventLocationDistanceLineHeight =
    eventLocationDistanceLineHeight * (screenWidth / 500);
  buttonTextLineHeight = buttonTextLineHeight * (screenHeight / 500);
  buttonBorderWidth = buttonBorderWidth * (screenWidth / 500);
  shelterNameMarginTop = shelterNameMarginTop * (screenHeight / 500);
  iconWidth = iconWidth * (screenWidth / 500);
}

const styles = StyleSheet.create({
  panel: {
    width: panelWidth,
    paddingBottom: 10,
    borderRadius: 10,
    borderWidth: panelBorderWidth,
    borderColor: darkMainColor,
    paddingTop: 5,
    backgroundColor: 'white',
  },
  topRowItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  images: {
    paddingVertical: panelHeight * 0.037,
    paddingLeft: panelWidth * 0.045,
    flexDirection: 'row',
  },
  eventImage: {
    width: panelWidth * 0.284,
    height: panelWidth * 0.211,
    marginRight: panelWidth * 0.027,
    borderRadius: 11,
  },
  eventName: {
    marginTop: shelterNameMarginTop,
    paddingLeft: panelWidth * 0.045,
    paddingTop: panelHeight * 0.018,
    fontSize: shelterNameFontSize,
    fontFamily: bodyFont,
    fontWeight: '500',
    lineHeight: shelterNameLineHeight,
    color: darkMainColor,
  },
  eventLocationDistance: {
    marginTop: shelterNameMarginTop * 0.8,
    paddingLeft: panelWidth * 0.045,
    fontSize: descriptionFontSize,
    fontFamily: bodyFont,
    fontWeight: '400',
    lineHeight: eventLocationDistanceLineHeight,
    color: 'black',
  },
  buttonsContainer: {
    paddingTop: panelHeight * 0.047, // might need to change
    paddingLeft: panelWidth * 0.045,
    flexDirection: 'row',
  },
  directionsButton: {
    width: panelWidth * 0.28,
    height: panelHeight * 0.13,
    borderRadius: 5,
    borderWidth: buttonBorderWidth,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  learnMoreButton: {
    width: panelWidth * 0.301,
    height: panelHeight * 0.131,
    borderRadius: 5,
    borderWidth: buttonBorderWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: buttonFontSize,
    fontFamily: bodyFont,
    fontWeight: '400',
    lineHeight: buttonTextLineHeight,
    color: darkMainColor,
  },
  shelterNameExpansion: {
    marginTop: shelterNameMarginTop * 0.8,
    paddingLeft: panelWidth * 0.045,
    fontWeight: '500',
    fontSize: descriptionFontSize,
  },
  bookmarkOutline: {
    marginTop: shelterNameMarginTop,
    paddingRight: 5,
    paddingTop: panelHeight * 0.018,
    fontSize: header2FontSize * 1.1,
    fontFamily: bodyFont,
    fontWeight: '500',
    color: darkMainColor,
  },
});

export default EventInfoPanel;
function toggleShelterBookmark(shelterId: string) {
  throw new Error('Function not implemented.');
}
