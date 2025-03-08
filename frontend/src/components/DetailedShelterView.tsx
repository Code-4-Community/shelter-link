import {
  Dimensions,
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
          style={styles.button}
          onPress={handleDirections}
        >
          <Text style={styles.buttonText}>Directions</Text>
        </TouchableOpacity>
        {shelter.website && (
          <TouchableOpacity
            style={styles.button}
            onPress={handleWebsite}
          >
            <Text style={styles.buttonText}>Website</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={handleContact}>
          <Text style={styles.buttonText}>Contact</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imagesContainer}>
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
let dynamicTabletSizes: Record<string, number> = {};
dynamicTabletSizes["shelterNameTextSize"] = 64;
dynamicTabletSizes["shelterNameTextHeight"] = 64;
dynamicTabletSizes["quickInfoFontSize"] = 15;
dynamicTabletSizes["quickInfoLineHeight"] = 21.59;
dynamicTabletSizes["buttonFontSize"] = 13;
dynamicTabletSizes["buttonLineHeight"] = 15.73;
dynamicTabletSizes["shelterDescriptionFontSize"] = 15;
dynamicTabletSizes["shelterDescriptionLineHeight"] = 21.59;
dynamicTabletSizes["dayTextFontSize"] = 15;
dynamicTabletSizes["dayTextLineHeight"] = 21.59;
dynamicTabletSizes["arrowFontSize"] = 12;
dynamicTabletSizes["redArrowFontSize"] = 17;
dynamicTabletSizes["hoursTextFontSize"] = 15;
dynamicTabletSizes["hoursTextLineHeight"] = 21.59;



if (screenWidth > 500) {
  let widthRatio = screenWidth/500;
  for (const key in dynamicTabletSizes) {
    dynamicTabletSizes[key] = (dynamicTabletSizes[key]*widthRatio)
  }
}

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
    fontSize: dynamicTabletSizes.shelterNameTextSize,
    fontWeight: '400',
    lineHeight: dynamicTabletSizes.shelterNameTextHeight,
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
    fontSize: dynamicTabletSizes.quickInfoFontSize,
    fontWeight: '400',
    paddingBottom: 4,
    lineHeight: dynamicTabletSizes.quickInfoLineHeight,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
    height: screenHeight*0.06,
  },
  button: {
    width: screenWidth/4,
    height: screenHeight*0.04,
    borderRadius: 4,
    borderWidth: 1,
    marginLeft: screenWidth/32,
    marginRight: screenWidth/32,
    borderColor: mainColor,
    backgroundColor: buttonBackgroundColor,
    fontFamily: bodyFont,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: dynamicTabletSizes.buttonFontSize,
    fontFamily: bodyFont,
    fontWeight: '400',
    lineHeight: dynamicTabletSizes.buttonLineHeight,
    color: darkMainColor,
  },
  imagesContainer: {
    paddingTop: screenHeight/32,
    paddingBottom:  screenHeight/32,
    height: screenHeight/6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  shelterImage: {
    width: screenHeight/7,
    height: screenHeight/7,
    borderRadius: 10,
    borderWidth: 3,
    marginRight: 22,
    borderColor: darkMainColor,
    backgroundColor: '#D9D9D9',
  },
  shelterDescription: {
    marginLeft: screenWidth/32,
    marginRight: screenWidth/32,
    marginTop: 19,
    fontSize: dynamicTabletSizes.shelterDescriptionFontSize,
    fontFamily: bodyFont,
    fontWeight: '400',
    lineHeight: dynamicTabletSizes.shelterDescriptionLineHeight,
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
    fontSize: dynamicTabletSizes.arrowFontSize,
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
  redArrow: {
    color: darkMainColor,
    fontSize: dynamicTabletSizes.redArrowFontSize,
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
