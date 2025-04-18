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
import { Shelter, DayOfWeek } from '../types';
import { HoursDropdown } from './HoursDropdown';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useBookmarks } from '../hooks/BookmarkContext';
import { useAuth } from '../hooks/AuthContext';

type RootStackParamList = {
  'Map View': undefined;
  'Detailed Shelter View': {
    shelter: Shelter;
  };
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Detailed Shelter View'
>;

export const DetailedShelterView: React.FC<Props> = ({ route }) => {
  const { shelter } = route.params; // get shelter from route params
  const { user } = useAuth();
  const { shelterBookmarks, toggleShelterBookmark } = useBookmarks();
  const [showHoursDropdown, setShowHoursDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState(0);
  const buttonRef = useRef<React.ElementRef<typeof View>>(null);
  const [bookmarked, setBookmarked] = useState(
    shelterBookmarks.includes(shelter.shelterId)
  );

  useFonts({
    AvenirNext: require('../../assets/fonts/AvenirNextLTPro-Bold.otf'),
  });

  // handle hours so drop down shows when button is clicked
  const handleHours = () => {
    // Measure the button's position
    buttonRef.current?.measure((_, __, ___, height, ____, pageY) => {
      setDropdownPosition(pageY + height); // Set dropdown position below the button
      setShowHoursDropdown(!showHoursDropdown); // Open the dropdown
    });
  };

  // for now, this redirects to google maps based on lat and long
  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${shelter.latitude},${shelter.longitude}`;
    Linking.openURL(url);
  };

  // website will pop up if there is one
  const handleWebsite = () => {
    if (shelter.website) {
      Linking.openURL(shelter.website);
    }
  };

  // for now, this gives the option to confirm if you want to call the shelter number
  // figure out how number/email maybe should be displayed?
  const handleContact = () => {
    Linking.openURL(`tel:${shelter.phone_number}`);
  };

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getHoursForDay = (day: DayOfWeek) => {
    if (!shelter.hours || !shelter.hours[day]) return 'Closed';
    const dayHours = shelter.hours[day];
    if (!dayHours) return 'Closed';
    return `${formatTime(dayHours.opening_time)} - ${formatTime(
      dayHours.closing_time
    )}`;
  };

  const getCurrentDay = () => {
    const today = new Date().getDay();
    const dayIndex = today === 0 ? 6 : today - 1;
    const daysEnum: DayOfWeek[] = [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ];
    return daysEnum[dayIndex];
  };

  const getCurrentDayHours = () => {
    const today = new Date().getDay();
    const dayIndex = today === 0 ? 6 : today - 1;
    const daysEnum: DayOfWeek[] = [
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
      DayOfWeek.SUNDAY,
    ];
    return getHoursForDay(daysEnum[dayIndex]);
  };

  const hoursData = Object.values(DayOfWeek).map((day) => ({
    label: `${day}: ${getHoursForDay(day)}`,
    value: day,
  }));

  const handleBookmark = async () => {
    if (user) {
      toggleShelterBookmark(shelter.shelterId);
      setBookmarked(!bookmarked);
    } else {
      alert('Please login to bookmark shelters.');
    }
  };

  return (
    <LinearGradient
      colors={[gradientColor1, gradientColor2]}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
          <View style={styles.shelterNameContainer}>
            <View style={styles.nameBookmarkContainer}>
              <Text
                style={[styles.shelterNameText, { paddingLeft: user ? 40 : 0 }]}
              >
                {shelter.name}
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
              {shelter.expanded_name && (
                <Text style={styles.shelterExpandedNameText}>
                  {shelter.expanded_name}
                </Text>
              )}
              {shelter.rating !== undefined && (
                <View style={styles.ratingContainer}>
                  <Text style={styles.quickInfoText}>
                    {shelter.rating.toFixed(1)}
                  </Text>
                  <Image
                    source={require('frontend/assets/teenyicons_star-solid.png')}
                    style={styles.starIcon}
                  />
                  <Text style={styles.quickInfoText}>
                    | {shelter.address.street}, {shelter.address.city},{' '}
                    {shelter.address.state}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              ref={buttonRef}
              style={[styles.button, shelter.website && styles.smallButton]}
              onPress={handleHours}
            >
              <Text style={styles.buttonText}>
                Hours <Text style={styles.arrow}>▾</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, shelter.website && styles.smallButton]}
              onPress={handleDirections}
            >
              <Text style={styles.buttonText}>Directions</Text>
            </TouchableOpacity>

            {shelter.website && (
              <TouchableOpacity
                style={styles.websiteButton}
                onPress={handleWebsite}
              >
                <Text style={styles.buttonText}>Website</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, shelter.website && styles.smallButton]}
              onPress={handleContact}
            >
              <Text style={styles.buttonText}>Contact</Text>
            </TouchableOpacity>
          </View>

          <HoursDropdown
            hoursData={hoursData}
            isOpen={showHoursDropdown}
            setIsOpen={setShowHoursDropdown}
            dropdownPosition={dropdownPosition}
            currentDay={getCurrentDay()}
          />

          <View style={styles.bottomContainer}>
            <View style={styles.imagesContainer}>
              {shelter.picture.length > 1 ? (
                <ScrollView
                  horizontal={true}
                  style={styles.imageScrollContainer}
                >
                  {shelter.picture.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image }}
                      style={styles.shelterImage}
                    />
                  ))}
                </ScrollView>
              ) : (
                <Image
                  source={{ uri: shelter.picture[0] }}
                  style={styles.soloShelterImage}
                />
              )}
            </View>

            <View style={styles.shelterDescriptionContainer}>
              <Text style={styles.shelterDescriptionHeader}>
                About {shelter.name}
              </Text>
              <Text style={styles.shelterDescriptionText}>
                {shelter.description}
              </Text>
            </View>

            <View style={styles.shelterTagMainContainer}>
              <Text style={styles.shelterDescriptionHeader}>
                Features and Resources
              </Text>
              {Object.entries(shelter.tags).map(([key, value]) => {
                if (value) {
                  return (
                    <View key={key} style={styles.shelterTagContainer}>
                      <Text key={key} style={styles.shelterTags}>
                        {key === 'lgbtq_focused'
                          ? (key = 'LGBTQ+ focused')
                          : key.replace(/_/g, ' ')}
                      </Text>
                    </View>
                  );
                }
                return null;
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
let dynamicTabletSizes: Record<string, number> = {};
dynamicTabletSizes['shelterNameTextSize'] = 45;
dynamicTabletSizes['shelterNameTextHeight'] = 50;
dynamicTabletSizes['quickInfoFontSize'] = 18;
dynamicTabletSizes['quickInfoLineHeight'] = 21.59;
dynamicTabletSizes['buttonFontSize'] = 15;
dynamicTabletSizes['buttonLineHeight'] = 15.73;
dynamicTabletSizes['shelterDescriptionFontSize'] = 15;
dynamicTabletSizes['shelterDescriptionLineHeight'] = 21.59;
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
  shelterNameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  shelterNameText: {
    fontFamily: headerFont,
    fontSize: 36,
    paddingTop: 20,
    paddingBottom: 15,
    color: darkMainColor,
    alignSelf: 'center',
    textAlign: 'center',
    flex: 1,
  },
  shelterExpandedNameText: {
    fontFamily: bodyFont,
    fontWeight: '700',
    fontSize: dynamicTabletSizes.shelterNameTextSize * 0.4,
    color: descriptionFontColor,
    paddingBottom: '5%',
    textAlign: 'center',
  },
  shelterDescriptionContainer: {
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
  shelterTagMainContainer: {
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
  shelterDescriptionHeader: {
    width: 340,
    fontSize: 22,
    fontFamily: bodyFont,
    fontWeight: '700',
    color: darkMainColor,
    textAlign: 'center',
    paddingBottom: 10,
  },
  shelterDescriptionText: {
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
  starIcon: {
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 3,
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
  shelterImage: {
    marginRight: screenWidth / 8,
    width: screenWidth / 1.3,
    height: screenWidth / 1.3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: darkMainColor,
    backgroundColor: '#D9D9D9',
  },
  soloShelterImage: {
    width: screenWidth / 1.3,
    height: screenWidth / 1.3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: darkMainColor,
    backgroundColor: '#D9D9D9',
  },
  shelterDescription: {
    marginLeft: screenWidth / 32,
    marginRight: screenWidth / 32,
    marginTop: 19,
    fontSize: dynamicTabletSizes.shelterDescriptionFontSize,
    fontFamily: bodyFont,
    fontWeight: '400',
    lineHeight: dynamicTabletSizes.shelterDescriptionLineHeight,
    color: descriptionFontColor,
  },
  shelterTagContainer: {
    borderWidth: 1,
    borderColor: descriptionFontColor,
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
    margin: 5,
  },
  shelterTags: {
    fontSize: dynamicTabletSizes.shelterDescriptionFontSize,
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
});

export default DetailedShelterView;
