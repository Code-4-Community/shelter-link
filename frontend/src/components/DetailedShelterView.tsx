import {
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import {
  backgroundColor,
  headerFont,
  darkMainColor,
  bodyFont,
  mainColor,
  buttonBackgroundColor,
  descriptionFontColor,
} from '../../constants';
import { Shelter, DayOfWeek } from '../types';
import { ImageGallery } from './ImageGallery';
import { HoursDropdown } from './HoursDropdown';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

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
  const [showHoursDropdown, setShowHoursDropdown] = useState(false);

  // handle hours so drop down shows when button is clicked
  const handleHours = () => {
    setShowHoursDropdown(!showHoursDropdown);
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shelterNameContainer}>
        <Text style={styles.shelterNameText}>{shelter.name}</Text>
      </View>
      <View style={styles.shelterDescriptionContainer}>
        <Text style={styles.shelterDescriptionText}>{shelter.description}</Text>
      </View>
      <View style={styles.quickInfoContainer}>
        {shelter.rating !== undefined && (
          <View style={styles.ratingContainer}>
            <Text style={styles.quickInfoText}>
              {shelter.rating.toFixed(1)} 
            </Text>
            <Image style={styles.starImage} source={require('frontend/assets/teenyicons_star-solid.png')} />
            <Text style={styles.quickInfoText}>
              | {shelter.address.street}, {shelter.address.city}, {shelter.address.state}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.hoursButton, shelter.website && styles.smallButton]}
          onPress={handleHours}
        >
          <Text style={styles.buttonText}>Hours</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.directionsButton, shelter.website && styles.smallButton]}
          onPress={handleDirections}
        >
          <Text style={styles.buttonText}>Directions</Text>
        </TouchableOpacity>

        {shelter.website && (
          <TouchableOpacity style={styles.websiteButton} onPress={handleWebsite}>
            <Text style={styles.buttonText}>Website</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.contactButton, shelter.website && styles.smallButton]}
          onPress={handleContact}
        >
          <Text style={styles.buttonText}>Contact</Text>
        </TouchableOpacity>
      </View>

      {showHoursDropdown && (
        <View style={styles.allHoursContainer}>
          <HoursDropdown currentDay={DayOfWeek.MONDAY} currentHours={getHoursForDay(DayOfWeek.MONDAY)} hoursData={hoursData} />
        </View>
      )}

      <View style={styles.images}>
        <ImageGallery images={shelter.picture} />
      </View>
      <View style={styles.fullReview}>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: backgroundColor,
  },
  shelterNameContainer: {
    minHeight: 44,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shelterNameText: {
    fontFamily: headerFont,
    fontSize: 36,
    color: darkMainColor,
    fontWeight: 700,
  },
  shelterDescriptionContainer: {
    minHeight: 44,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shelterDescriptionText: {
    width: 340,
    fontSize: 18,
    fontFamily: bodyFont,
    fontWeight: '600',
    color: descriptionFontColor,
    textAlign: 'center',
    marginTop: 24,
  },
  starImage: {
    marginTop: 15,
  },
  quickInfoContainer: {
    width: '100%',
    minHeight: 44,
    marginLeft: 24,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickInfoText: {
    fontFamily: bodyFont,
    color: descriptionFontColor,
    fontSize: 16,
    fontWeight: '400',
    marginTop: 48,
    marginBottom: 32,
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 35.61,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButton: {
    width: 80, 
  },
  hoursButton: {
    width: 106,
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: descriptionFontColor,
    backgroundColor: buttonBackgroundColor,
    fontFamily: bodyFont,
    alignItems: 'center',
    justifyContent: 'center',
  },
  directionsButton: {
    width: 106,
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: descriptionFontColor,
    backgroundColor: buttonBackgroundColor,
    fontFamily: bodyFont,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  websiteButton: {
    width: 80,
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: descriptionFontColor,
    backgroundColor: buttonBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  contactButton: {
    width: 115,
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: descriptionFontColor,
    backgroundColor: buttonBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  buttonText: {
    fontSize: 13,
    fontFamily: bodyFont,
    fontWeight: '400',
    lineHeight: 15.73,
    color: darkMainColor,
  },
  images: {
    width: '90%',
    height: 150,
    marginTop: 30.39,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  shelterImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    borderWidth: 3,
    marginRight: 22,
    borderColor: darkMainColor,
    backgroundColor: '#D9D9D9',
  },
  fullReview: {
    marginTop: 40,
    marginLeft: 13,
    width: 330,
    height: 176,
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
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 8,
    marginTop: 4,
  },
  closedText: {
    fontFamily: bodyFont,
    color: darkMainColor,
    fontWeight: 700,
  },
  arrow: {
    color: mainColor,
    fontSize: 12,
  },
  dayText: {
    fontFamily: bodyFont,
    fontSize: 15,
    fontWeight: '700',
    color: descriptionFontColor,
    marginRight: 14,
    lineHeight: 21.59,
  },
  hoursText: {
    fontFamily: bodyFont,
    fontWeight: '700',
    fontSize: 15,
    color: mainColor,
    lineHeight: 21.59,
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
  redArrow: {
    color: darkMainColor,
    fontSize: 17,
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
});
