import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Shelter } from '../types';
import { bodyFont, darkMainColor } from 'frontend/constants';
import { NewShelterInput } from '../../../backend/src/dtos/newShelterDTO';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';

type ShelterInfoPanelProps = {
  shelter: Shelter;
  style?: any;
};

type RootStackParamList = {
  'Map View': undefined;
  'Detailed Shelter View': {
    shelter: Shelter;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ShelterInfoPanel = ({ shelter, style }: ShelterInfoPanelProps) => {
  const navigation = useNavigation<NavigationProp>();
  const [fonts] = useFonts({
    'IstokWebRegular': require('../../assets/fonts/IstokWebRegular.ttf'),
    'JomhuriaRegular': require('../../assets/fonts/JomhuriaRegular.ttf')
  });

  const formatAddress = (address: any) => {
    return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
  };

  return (
    <TouchableOpacity
      style={[styles.panel, style]}
      onPress={() => navigation.navigate('Detailed Shelter View', { shelter })}
    >
      <View style={styles.topRowItems}>
        <View style={styles.images}>
          {shelter.picture.slice(0, 3).map((url, index) => (
            <Image
              key={index}
              source={{ uri: url }}
              style={styles.shelterImage}
            />
          ))}
        </View>
      </View>
      <View style={styles.bookmarkContainer}>
        <Image
          style={styles.bookmarkImage}
          source={require('frontend/assets/bookmark.png')}
        />
      </View>
      <Text style={styles.shelterName}>{shelter.name}</Text>
      <Text style={styles.shelterAddressDistance}>
        {formatAddress(shelter.address)} | Distance
      </Text>

      <Text
        style={{ ...styles.shelterRatingDescription, alignItems: 'center' }}
      >
        {shelter.rating}{' '}
        <Image
          style={styles.star}
          source={require('frontend/assets/teenyicons_star-solid.png')}
        ></Image>{' '}
        | {shelter.description}
      </Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={(e) => {
            e.stopPropagation(); // don't trigger the detailed view
          }}
        >
          <Text style={styles.buttonText}>Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.learnMoreButton}
          onPress={(e) => {
            e.stopPropagation(); // don't trigger the detailed view
          }}
        >
          <Text style={styles.buttonText}>Learn More</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const panelWidth = screenWidth*0.85;
const panelHeight = (218/332)*panelWidth;


let panelBorderWidth = 2;
let shelterNameFontSize = 20;
let descriptionFontSize = 15;
let buttonFontSize = 13;
let shelterNameLineHeight = 24.2;
let shelterAddressDistanceLineHeight = 18.15;
let buttonTextLineHeight = 15.73;
let buttonBorderWidth = 1;
let starWidth = 10;
if (screenWidth > 500) {
  panelBorderWidth = panelBorderWidth*(screenWidth/500);
  shelterNameFontSize = shelterNameFontSize*(screenHeight/500);
  descriptionFontSize = descriptionFontSize*(screenHeight/500);
  buttonFontSize = buttonFontSize*(screenHeight/500);
  shelterNameLineHeight = shelterNameLineHeight*(screenHeight/500);
  shelterAddressDistanceLineHeight = shelterAddressDistanceLineHeight*(screenWidth/500);
  buttonTextLineHeight = buttonTextLineHeight*(screenHeight/500);
  buttonBorderWidth = buttonBorderWidth*(screenWidth/500);
  starWidth = starWidth*(screenWidth/500)
}

const styles = StyleSheet.create({
  star: {
    marginTop: 'auto',
    marginBottom: 'auto',
    width: starWidth,
    height: starWidth,
    tintColor: darkMainColor,
  },
  panel: {
    width: panelWidth,
    height: panelHeight,
    borderRadius: 10,
    borderWidth: panelBorderWidth,
    borderColor: darkMainColor,
    backgroundColor: 'white',
  },
  topRowItems: {
    flexDirection: 'row',
  },
  images: {
    paddingVertical: panelHeight*0.037,
    paddingLeft: panelWidth*0.045,
    flexDirection: 'row',
  },
  shelterImage: {
    width: panelWidth*0.253,
    height: panelWidth*0.253,
    borderRadius: 10,
    borderWidth: panelBorderWidth,
    marginRight: panelWidth*0.027,
    borderColor: darkMainColor,
    backgroundColor: '#D9D9D9',
  },
  bookmarkContainer: {
    position: 'absolute',
    top: panelHeight*0.037,
    right: panelWidth*0.033,
  },
  bookmarkImage: {
    tintColor: darkMainColor,
    width: panelWidth*0.06,
    height: panelWidth*0.06*(27/20),
  },
  shelterName: {
    paddingLeft: panelWidth*0.045,
    paddingTop: panelHeight*0.018,
    fontSize: shelterNameFontSize,
    fontFamily: bodyFont,
    fontWeight: '400',
    lineHeight: shelterNameLineHeight,
    color: darkMainColor
  },
  shelterAddressDistance: {
    paddingLeft: panelWidth*0.045,
    fontSize: descriptionFontSize,
    fontFamily: bodyFont,
    fontWeight: '400',
    lineHeight: shelterAddressDistanceLineHeight,
    color: darkMainColor,
  },
  shelterRatingDescription: {
    paddingLeft: panelWidth*0.045,
    fontSize: descriptionFontSize,
    fontFamily: bodyFont,
    fontWeight: '400',
    lineHeight: shelterAddressDistanceLineHeight,
    color: darkMainColor,
  },
  buttonsContainer: {
    paddingTop: panelHeight*0.047, // might need to change
    paddingLeft: panelWidth*0.045,
    flexDirection: 'row',
  },
  directionsButton: {
    width: panelWidth*0.28,
    height: panelHeight*0.13,
    borderRadius: 4,
    borderWidth: buttonBorderWidth,
    borderColor: darkMainColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  learnMoreButton: {
    width: panelWidth*0.301,
    height: panelHeight*0.131,
    borderRadius: 4,
    borderWidth: buttonBorderWidth,
    borderColor: darkMainColor,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  buttonText: {
    fontSize: buttonFontSize,
    fontFamily: bodyFont,
    fontWeight: '400',
    lineHeight: buttonTextLineHeight,
    color: darkMainColor,
  },
});

export default ShelterInfoPanel;
