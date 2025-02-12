import {
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {
  backgroundColor,
  headerFont,
  darkMainColor,
  bodyFont,
  mainColor,
  buttonBackgroundColor,
  descriptionFontColor,
} from '../../constants';
import { useFonts } from 'expo-font';
import { NewShelterInput } from '../../../backend/src/dtos/newShelterDTO';
import { DayOfWeek } from '../../../backend/src/types';
import { ImageGallery } from './ImageGallery';
import { HoursDropdown } from './HoursDropdown';

interface Props {
  shelter: NewShelterInput;
}

export const DetailedShelterView: React.FC<Props> = ({ shelter }) => {
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

  const [fonts] = useFonts({
    IstokWebRegular: require('../../assets/fonts/IstokWebRegular.ttf'),
    JomhuriaRegular: require('../../assets/fonts/JomhuriaRegular.ttf'),
  });

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
    if (!dayHours || dayHours.is_closed) return 'Closed';
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
      <View style={styles.quickInfoContainer}>
        {shelter.rating !== undefined && (
          <Text style={styles.quickInfoText}>
            {shelter.rating.toFixed(1)} ★ ★ ★ ★ ★
          </Text>
        )}
        <Text style={styles.quickInfoText}>
          {shelter.address.street}, {shelter.address.city},{' '}
          {shelter.address.state}{' '}
        </Text>

        <View style={styles.hoursRow}>
          <Text style={styles.dayText}>{getCurrentDay()}:</Text>
          <View style={styles.hoursStatusContainer}>
            <HoursDropdown
              currentDay={getCurrentDay()}
              currentHours={getCurrentDayHours()}
              hoursData={hoursData}
            />
          </View>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.directionsButton}
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
        <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
          <Text style={styles.buttonText}>Contact</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.images}>
        <ImageGallery images={shelter.picture} />
      </View>
      <Text style={styles.shelterDescription}>{shelter.description}</Text>
      <View style={styles.fullReview}>
        <View style={styles.fullReviewTitleContainer}>
          <Text style={styles.fullReviewTitle}>BAGLY REVIEW</Text>
        </View>
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
    height: 44,
    width: '100%',
    marginLeft: 14,
    marginTop: 23,
  },
  shelterNameText: {
    fontFamily: headerFont,
    fontSize: 64,
    fontWeight: '400',
    lineHeight: 64,
    color: darkMainColor,
  },
  quickInfoContainer: {
    width: '100%',
    height: 116,
    marginLeft: 12,
    marginTop: 6,
  },
  quickInfoText: {
    fontFamily: bodyFont,
    color: descriptionFontColor,
    fontSize: 15,
    fontWeight: '400',
    paddingBottom: 4,
    lineHeight: 21.59,
  },
  buttonsContainer: {
    marginLeft: 15,
    flexDirection: 'row',
    width: '100%',
    height: 35.61,
  },
  directionsButton: {
    width: 106,
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: mainColor,
    backgroundColor: buttonBackgroundColor,
    fontFamily: bodyFont,
    alignItems: 'center',
    justifyContent: 'center',
  },
  websiteButton: {
    width: 115,
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: darkMainColor,
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
    borderColor: darkMainColor,
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
  shelterDescription: {
    width: 340,
    marginLeft: 13,
    marginTop: 19,
    fontSize: 15,
    fontFamily: bodyFont,
    fontWeight: '400',
    lineHeight: 21.59,
    color: descriptionFontColor,
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
