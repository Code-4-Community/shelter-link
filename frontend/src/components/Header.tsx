import { useFonts } from 'expo-font';
import { bodyFont, darkMainColor, headerFont } from '../../constants';
import React from 'react';
import { Text, StyleSheet, View, Dimensions } from 'react-native';

const Header = () => {
  useFonts({
    'AvenirNext': require('../../assets/fonts/AvenirNextLTPro-Bold.otf'),
  });

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Map</Text>
      <Text style={styles.headerDescription}>
        Brief description of map features
      </Text>
    </View>
  );
};

const { width: screenWidth } = Dimensions.get('window');
let headerTextSize = 36;
let headerLineHeight = 43.57;
let headerDescriptionSize = 17;
let headerDescriptionHeight = 18.15;
if (screenWidth > 500) {
  headerTextSize = headerTextSize * (screenWidth / 500);
  headerLineHeight = headerLineHeight * (screenWidth / 500);
  headerDescriptionSize = headerDescriptionSize * (screenWidth / 500);
  headerDescriptionHeight = headerDescriptionHeight * (screenWidth / 500);
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  headerText: {
    fontFamily: headerFont,
    fontSize: headerTextSize,
    fontWeight: '700',
    lineHeight: headerLineHeight,
    textAlign: 'center',
    color: darkMainColor,
    marginBottom: 30,
  },
  headerDescription: {
    fontFamily: bodyFont,
    fontSize: dynamicTabletSizes.headerDescriptionSize,
    fontWeight: '400',
    lineHeight: dynamicTabletSizes.headerDescriptionHeight,
    textAlign: 'center',
    color: '#1E1E1E',
  },
});

export default Header;
