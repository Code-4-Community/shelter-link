import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { bodyFont, darkMainColor } from '../../constants';
import { NewShelterInput } from '../../../backend/src/dtos/newShelterDTO';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Shelter } from '../types';
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
  useFonts({
    'AvenirNext': require('../../assets/fonts/AvenirNextLTPro-Bold.otf'),
  });

  const navigation = useNavigation<NavigationProp>();

  const formatAddress = (address: any) => {
    return `${address.street}, ${address.city}, ${address.state}`;
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
      <Text style={styles.shelterName}>{shelter.name}</Text>
      <Text style={styles.shelterNameExpansion}>Expansion Name Placeholder</Text>
      <Text style={{ ...styles.shelterAddressDistance, alignItems: 'center' }}>
      {shelter.rating}{' '}
        <Image
          style={styles.starIcon}
          source={require('../../assets/starIcon.png')}
        ></Image> | {formatAddress(shelter.address)} | 2 mi
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

const panelWidth = screenWidth * 0.85;
const panelHeight = (230 / 332) * panelWidth;

let panelBorderWidth = 2;
let shelterNameFontSize = 20;
let descriptionFontSize = 12;
let buttonFontSize = 13;
let shelterNameLineHeight = 24.2;
let shelterAddressDistanceLineHeight = 18.15;
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
  shelterAddressDistanceLineHeight = shelterAddressDistanceLineHeight * (screenWidth / 500);
  buttonTextLineHeight = buttonTextLineHeight * (screenHeight / 500);
  buttonBorderWidth = buttonBorderWidth * (screenWidth / 500);
  shelterNameMarginTop = shelterNameMarginTop * (screenHeight / 500);
  iconWidth = iconWidth * (screenWidth / 500)
}

const styles = StyleSheet.create({
  starIcon: {
    marginTop: 'auto',
    marginBottom: 'auto',
    width: iconWidth,
    height: iconWidth,
    tintColor: darkMainColor,
  },
  panel: {
    width: panelWidth,
    height: panelHeight,
    borderRadius: 10,
    borderWidth: panelBorderWidth,
    borderColor: darkMainColor,
    paddingTop: 5,
    backgroundColor: 'white',
  },
  topRowItems: {
    flexDirection: 'row',
  },
  images: {
    paddingVertical: panelHeight * 0.037,
    paddingLeft: panelWidth * 0.045,
    flexDirection: 'row',
  },
  shelterImage: {
    width: panelWidth * 0.284,
    height: panelWidth * 0.211,
    marginRight: panelWidth * 0.027,
    borderRadius: 11,
  },
  shelterName: {
    marginTop: shelterNameMarginTop,
    paddingLeft: panelWidth * 0.045,
    paddingTop: panelHeight * 0.018,
    fontSize: shelterNameFontSize,
    fontFamily: bodyFont,
    fontWeight: '500',
    lineHeight: shelterNameLineHeight,
    color: darkMainColor
  },
  shelterNameExpansion: {
    marginTop: shelterNameMarginTop*0.8,
    paddingLeft: panelWidth * 0.045,
    fontWeight: '500',
    fontSize: descriptionFontSize,
  },
  shelterAddressDistance: {
    marginTop: shelterNameMarginTop*0.8,
    paddingLeft: panelWidth * 0.045,
    fontSize: descriptionFontSize,
    fontFamily: bodyFont,
    fontWeight: '400',
    lineHeight: shelterAddressDistanceLineHeight,
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
  },
  learnMoreButton: {
    width: panelWidth * 0.301,
    height: panelHeight * 0.131,
    borderRadius: 5,
    borderWidth: buttonBorderWidth,
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
