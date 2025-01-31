import {
  Image,
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
} from 'frontend/constants';
import { useFonts } from 'expo-font';
import { Shelter } from '../types';

interface Props {
  shelter: Shelter;
}

export const DetailedShelterView: React.FC<Props> = ({ shelter }) => {
  // to do: change directions button func
  // for now, this redirects to google maps based on lat and long
  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${shelter.latitude},${shelter.longitude}`;
    Linking.openURL(url);
  };

  const [fonts] = useFonts({
    IstokWebRegular: require('../../assets/fonts/IstokWebRegular.ttf'),
    JomhuriaRegular: require('../../assets/fonts/JomhuriaRegular.ttf'),
  });

  // to do: change contact button func
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.shelterNameContainer}>
        <Text style={styles.shelterNameText}>{shelter.name}</Text>
      </View>
      <View style={styles.quickInfoContainer}>
        <Text style={styles.quickInfoText}>
          {/* added availability here instead of minutes away based on shelter.entity.ts */}
          {shelter.overall_rating.toFixed(1)} STARS {/*{shelter.availability}*/}
        </Text>
        <Text style={styles.quickInfoText}>
          {shelter.address.street}, {shelter.address.city},{' '}
          {shelter.address.state}{' '}
          {/*{formatTime(shelter.opening_time)} -{' '}*/}
          {/*{formatTime(shelter.closing_time)}*/}
        </Text>
        {/* added availability here instead of short description on shelter.entity.ts */}
        <Text style={styles.quickInfoText}>{shelter.availability}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={handleDirections}
        >
          <Text style={styles.buttonText}>Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.websiteButton}>
          {/* no website field in shelter.entity.ts so no behavior yet */}
          <Text style={styles.buttonText}>Website</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
          <Text style={styles.buttonText}>Contact</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.images}>
        {shelter.picture.slice(0, 2).map((url, index) => (
          <Image
            key={index}
            source={{ uri: url }}
            style={styles.shelterImage}
          />
        ))}
      </View>
      <Text style={styles.shelterDescription}>{shelter.description}</Text>
      <View style={styles.fullReview}>
        <View style={styles.fullReviewTitleContainer}>
          <Text style={styles.fullReviewTitle}>BAGLY REVIEW</Text>
        </View>
        <View style={styles.reviews}>
          <View style={styles.traits}>
            <Text style={styles.traitText}>
              Safety: {shelter.safety_rating}/5
            </Text>
            <Text style={styles.traitText}>
              Inclusivity: {shelter.inclusivity_rating}/5
            </Text>
            {/* add other traits here */}
            {/*<Text style={styles.traitText}>Trait 3</Text>*/}
            {/*<Text style={styles.traitText}>Trait 4</Text>*/}
            {/*<Text style={styles.traitText}>Trait 5</Text>*/}
          </View>
          <Image
            style={styles.allOfThisIcon}
            source={require('frontend/assets/AllOfThisIcon.png')}
          />
          <View style={styles.sumRating}>
            <Text style={styles.sumRatingText}>
              {shelter.overall_rating.toFixed(1)}
            </Text>
            <Image
              style={styles.sumStarIcon}
              source={require('frontend/assets/teenyicons_star-solid.png')}
            />
          </View>
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
  logoContainer: {
    alignItems: 'flex-start',
    paddingLeft: 12,
    paddingTop: 9,
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
    marginTop: 19,
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
  traits: {
    width: 142,
  },
  reviews: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  traitText: {
    height: 28,
    fontSize: 15,
    fontFamily: bodyFont,
    fontWeight: '700',
    lineHeight: 21.59,
    color: descriptionFontColor,
    width: '100%',
  },
  allOfThisIcon: {
    marginLeft: 24,
  },
  sumRating: {
    flexDirection: 'row',
    marginLeft: 19,
    marginTop: 20,
  },
  sumRatingText: {
    width: 84,
    height: 82,
    fontSize: 48,
    fontFamily: bodyFont,
    fontWeight: '400',
    lineHeight: 58.09,
  },
  sumStarIcon: {
    marginTop: 14,
  },
});
