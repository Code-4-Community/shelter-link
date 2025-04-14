import {
  Dimensions,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, { useRef, useState } from 'react';
import {
  headerFont,
  darkMainColor,
  bodyFont,
  mainColor,
  buttonBackgroundColor,
  descriptionFontColor,
  containerColor,
  gradientColor1,
  gradientColor2,
  header2FontSize,
  header1FontSize,
} from '../../constants';
import { Event } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/AuthContext';
import { useBookmarks } from '../hooks/BookmarkContext';
import { Ionicons } from '@expo/vector-icons';
import { formatDate, formatDateTime, formatTime } from '../utils';

type RootStackParamList = {
  'Map View': undefined;
  'Detailed Event View': {
    event: Event;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Detailed Event View'>;

export const DetailedeventView: React.FC<Props> = ({ route }) => {
  const { event } = route.params; // get event from route params
  const { user } = useAuth();
  const { eventBookmarks, toggleEventBookmark } = useBookmarks();
  const [bookmarked, setBookmarked] = useState(
    eventBookmarks.includes(event.eventId)
  );

  useFonts({
    AvenirNext: require('../../assets/fonts/AvenirNextLTPro-Bold.otf'),
  });

  // Redirects based on address (no lat or long for events)
  const handleDirections = () => {
    if (event.location) {
      let url = `https://www.google.com/maps/dir/?api=1&destination=
            ${event.location.street.replace(' ', '+')},
            +${event.location.city.replace(' ', '+')},
            +${event.location.state}+${event.location.zipCode}`;
      if (event.location.country) {
        url += `,+${event.location.country.replace(' ', '+')}`;
      }
      Linking.openURL(url);
    }
  };

  // website will pop up if there is one
  const handleWebsite = () => {
    if (event.website) {
      Linking.openURL(event.website);
      console.log('handleWebsite tried something');
    }
    console.log('handlewebsite did nothing');
  };

  // for now, this gives the option to confirm if you want to call the event number
  // figure out how number/email maybe should be displayed?
  const handleRegister = () => {
    if (event.registration_link) {
      Linking.openURL(event.registration_link);
      console.log('handleRegister tried something');
    }
    console.log('handleRegister did nothing');
  };

  const handleBookmark = async () => {
    if (user) {
      toggleEventBookmark(event.eventId);
      setBookmarked(!bookmarked);
    } else {
      alert('Please login to bookmark events.');
    }
  };

  return (
    <LinearGradient
      colors={[gradientColor1, gradientColor2]}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
          <View style={styles.eventNameContainer}>
            <View style={styles.nameBookmarkContainer}>
              <Text
                style={[styles.eventNameText, { paddingLeft: user ? 40 : 0 }]}
              >
                {event.event_name}
              </Text>
              {user && (
                <TouchableOpacity onPress={() => handleBookmark()}>
                  <Ionicons
                    name={bookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={header2FontSize}
                    color={darkMainColor}
                    style={styles.bookmarkOutline}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.quickInfoContainer}>
              <View style={styles.ratingContainer}>
                <Text style={styles.quickInfoText}>
                  {formatDateTime(event.date)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            {event.location && event.location.street !== '' && (
              <TouchableOpacity
                style={[styles.button, event.website && styles.smallButton]}
                onPress={handleDirections}
              >
                <Text style={styles.buttonText}>Directions</Text>
              </TouchableOpacity>
            )}

            {event.website && event.website !== '' && (
              <TouchableOpacity
                style={styles.websiteButton}
                onPress={handleWebsite}
              >
                <Text style={styles.buttonText}>Website</Text>
              </TouchableOpacity>
            )}

            {event.registration_link && event.registration_link !== '' && (
              <TouchableOpacity
                style={[styles.button, event.website && styles.smallButton]}
                onPress={handleRegister}
              >
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.bottomContainer}>
            {event.picture && (
              <View style={styles.imagesContainer}>
                {event.picture.length > 1 ? (
                  <ScrollView
                    horizontal={true}
                    style={styles.imageScrollContainer}
                  >
                    {event.picture.map((image, index) => (
                      <Image
                        key={index}
                        source={{ uri: image }}
                        style={styles.eventImage}
                      />
                    ))}
                  </ScrollView>
                ) : (
                  <Image
                    source={{ uri: event.picture[0] }}
                    style={styles.soloEventImage}
                  />
                )}
              </View>
            )}
            <View style={styles.eventDescriptionContainer}>
              <Text style={styles.eventDescriptionHeader}>About</Text>
              <Text style={styles.eventDescriptionText}>
                {event.description}
              </Text>
            </View>

            <View style={styles.eventDescriptionContainer}>
              <Text style={styles.eventDescriptionHeader}>
                Additional Information
              </Text>
              <Text style={styles.eventDescriptionText}>
                {event.host_name && `Name of Host: ${event.host_name}\n\n`}
                {event.phone_number &&
                  `Host Contact: ${event.phone_number}\n\n`}
                Date: {formatDate(event.date)}
                {`\n\n`}
                Time: {formatTime(event.date)}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
let dynamicTabletSizes: Record<string, number> = {};
dynamicTabletSizes['eventNameTextSize'] = 45;
dynamicTabletSizes['eventNameTextHeight'] = 50;
dynamicTabletSizes['quickInfoFontSize'] = 18;
dynamicTabletSizes['quickInfoLineHeight'] = 21.59;
dynamicTabletSizes['buttonFontSize'] = 15;
dynamicTabletSizes['buttonLineHeight'] = 15.73;
dynamicTabletSizes['eventDescriptionFontSize'] = 15;
dynamicTabletSizes['eventDescriptionLineHeight'] = 21.59;
dynamicTabletSizes['dayTextFontSize'] = 15;
dynamicTabletSizes['dayTextLineHeight'] = 21.59;
dynamicTabletSizes['arrowFontSize'] = 18;
dynamicTabletSizes['hoursTextFontSize'] = 15;
dynamicTabletSizes['hoursTextLineHeight'] = 21.59;
dynamicTabletSizes['quickInfoTextPaddingBottom'] = 4;
dynamicTabletSizes['fullReviewMarginTop'] = 40;
dynamicTabletSizes['fullReviewMarginLeft'] = 13;
dynamicTabletSizes['fullReviewWidth'] = 330;

if (screenWidth > 500) {
  let widthRatio = screenWidth / 500;
  for (const key in dynamicTabletSizes) {
    dynamicTabletSizes[key] = dynamicTabletSizes[key] * widthRatio;
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  eventNameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  eventNameText: {
    fontFamily: headerFont,
    fontSize: 36,
    paddingTop: 20,
    paddingBottom: 15,
    color: darkMainColor,
    alignSelf: 'center',
    textAlign: 'center',
    flex: 1,
  },
  eventExpandedNameText: {
    fontFamily: bodyFont,
    fontWeight: '700',
    fontSize: dynamicTabletSizes.eventNameTextSize * 0.4,
    color: descriptionFontColor,
    paddingBottom: '5%',
    textAlign: 'center', // Ensures text is centered when it wraps
  },
  eventDescriptionContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: '5%',
    borderWidth: 1,
    borderColor: darkMainColor,
    borderRadius: 10,
    backgroundColor: containerColor,
    paddingVertical: 10,
    marginBottom: 20,
    width: '95%',
  },
  eventTagMainContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    borderWidth: 1,
    borderColor: darkMainColor,
    borderRadius: 10,
    backgroundColor: containerColor,
    width: '95%',
  },
  eventDescriptionHeader: {
    width: 340,
    fontSize: 22,
    fontFamily: bodyFont,
    fontWeight: '700',
    color: darkMainColor,
    textAlign: 'center',
    paddingBottom: 10,
  },
  eventDescriptionText: {
    width: 340,
    fontSize: 18,
    fontFamily: bodyFont,
    color: descriptionFontColor,
    textAlign: 'left',
  },
  quickInfoContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickInfoText: {
    fontFamily: bodyFont,
    color: descriptionFontColor,
    fontSize: dynamicTabletSizes.quickInfoFontSize,
    fontWeight: '400',
  },
  smallButton: {
    width: screenWidth / 5,
    marginLeft: screenWidth / 75,
    marginRight: screenWidth / 75,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 24,
    paddingBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: darkMainColor,
  },
  button: {
    width: screenWidth / 4,
    height: screenHeight * 0.04,
    borderRadius: 4,
    borderWidth: 1,
    marginLeft: screenWidth / 32,
    marginRight: screenWidth / 32,
    borderColor: darkMainColor,
    backgroundColor: buttonBackgroundColor,
    fontFamily: bodyFont,
    alignItems: 'center',
    justifyContent: 'center',
  },
  websiteButton: {
    width: screenWidth / 5,
    height: screenHeight * 0.04,
    borderRadius: 4,
    borderWidth: 1,
    marginLeft: screenWidth / 75,
    marginRight: screenWidth / 75,
    borderColor: darkMainColor,
    backgroundColor: buttonBackgroundColor,
    fontFamily: bodyFont,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: dynamicTabletSizes.buttonFontSize,
    fontFamily: bodyFont,
    fontWeight: '400',
    color: darkMainColor,
    textAlign: 'center',
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 15,
  },
  imagesContainer: {
    paddingTop: screenHeight / 28,
    paddingBottom: screenHeight / 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  eventImage: {
    marginRight: screenWidth / 8,
    width: screenWidth / 1.3,
    height: screenWidth / 1.3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: darkMainColor,
    backgroundColor: '#D9D9D9',
  },
  eventDescription: {
    marginLeft: screenWidth / 32,
    marginRight: screenWidth / 32,
    marginTop: 19,
    fontSize: dynamicTabletSizes.eventDescriptionFontSize,
    fontFamily: bodyFont,
    fontWeight: '400',
    lineHeight: dynamicTabletSizes.eventDescriptionLineHeight,
    color: descriptionFontColor,
  },
  eventTagContainer: {
    borderWidth: 1,
    borderColor: descriptionFontColor,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
    margin: 5,
  },
  eventTags: {
    fontSize: dynamicTabletSizes.eventDescriptionFontSize,
    fontFamily: bodyFont,
    fontWeight: '700',
    color: descriptionFontColor,
  },
  fullReview: {
    marginTop: dynamicTabletSizes.fullReviewMarginTop,
    marginLeft: dynamicTabletSizes.fullReviewMarginLeft,
    width: dynamicTabletSizes.fullReviewWidth,
    height: screenHeight * (2 / 5),
  },
  fullReviewTitleContainer: {
    width: '100%',
    height: 40,
  },
  fullReviewTitle: {
    fontSize: 64,
    fontFamily: headerFont,
    fontWeight: '400',
    lineHeight: 64,
    color: darkMainColor,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allHoursContainer: {
    backgroundColor: '#000000',
    borderRadius: 20,
    padding: 8,
    marginTop: 4,
  },
  closedText: {
    fontFamily: bodyFont,
    color: darkMainColor,
    fontWeight: 700,
  },
  dayText: {
    fontFamily: bodyFont,
    fontSize: dynamicTabletSizes.dayTextFontSize,
    fontWeight: '700',
    color: descriptionFontColor,
    marginRight: 14,
    lineHeight: dynamicTabletSizes.dayTextLineHeight,
  },
  hoursText: {
    fontFamily: bodyFont,
    fontWeight: '700',
    fontSize: dynamicTabletSizes.hoursTextFontSize,
    color: mainColor,
    lineHeight: dynamicTabletSizes.hoursTextLineHeight,
  },
  hoursStatusContainer: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursDropdown: {
    height: 36,
    minWidth: 120,
    paddingHorizontal: 12,
    paddingRight: 50,
  },
  arrow: {
    color: darkMainColor,
    fontSize: dynamicTabletSizes.arrowFontSize,
    marginLeft: 4,
  },
  placeholderStyle: {
    fontFamily: bodyFont,
    fontSize: 15,
    color: darkMainColor,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderColor: '#007AFF',
    borderWidth: 1,
    marginTop: 4,
  },
  nameBookmarkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  bookmarkOutline: {
    fontSize: header1FontSize,
    fontFamily: bodyFont,
    fontWeight: '500',
    color: darkMainColor,
  },
  imageScrollContainer: {
    paddingLeft: screenWidth / 9,
    paddingRight: screenWidth / 9,
    paddingBottom: 10,
  },
  soloEventImage: {
    width: screenWidth / 1.3,
    height: screenWidth / 1.3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: darkMainColor,
    backgroundColor: '#D9D9D9',
  },
});

export default DetailedeventView;
