import { bodyFont, darkMainColor, headerFont } from '../../constants';
import React from 'react';
import { Text, StyleSheet, View, Dimensions } from 'react-native';

const Header = () => {
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
let dynamicTabletSizes: Record<string, number> = {};
dynamicTabletSizes["headerTextSize"] = 84;
dynamicTabletSizes["headerLineHeight"] = 43.57;
dynamicTabletSizes["headerDescriptionSize"] = 17;
dynamicTabletSizes["headerDescriptionHeight"] = 18.15;

if (screenWidth > 500) {
  let widthRatio = screenWidth/500;
  for (const key in dynamicTabletSizes) {
    dynamicTabletSizes[key] = (dynamicTabletSizes[key]*widthRatio)
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  headerText: {
    fontFamily: headerFont,
    fontSize: dynamicTabletSizes.headerTextSize,
    fontWeight: '400',
    lineHeight: dynamicTabletSizes.headerLineHeight,
    textAlign: 'center',
    color: darkMainColor,
    marginBottom: 9,
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
