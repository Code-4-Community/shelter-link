import {
  backgroundColor,
  darkMainColor,
  gradientColor1,
  header1FontSize,
  headerFont,
} from '../../constants';
import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app/App';

type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Logo component that displays a logo image and an optional header text, as well as an optional icon on the far right.
 *
 * @param {string} [headerText] - The text to display below the logo.
 * @param {keyof RootStackParamList} navigateTo - The screen to navigate to when the logo is pressed.
 * @param {React.ReactNode} [rightIcon] - An optional icon to display on the right side of the logo.
 */
interface LogoProps {
  headerText?: string;
  navigateTo: keyof RootStackParamList;
  rightIcon?: React.ReactNode;
}

const Logo: React.FC<LogoProps> = ({ headerText, navigateTo, rightIcon }) => {
  const navigation = useNavigation<AppNavigationProp>();

  return (
    <View
      style={[
        styles.container,
        { justifyContent: 'center', paddingHorizontal: 20 },
      ]}
    >
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => navigation.navigate(navigateTo as any)}
      >
        <Image
          style={styles.imageStyle}
          source={require('../../assets/Logo.png')}
        />
      </TouchableOpacity>
      {headerText && <Text style={styles.headerText}>{headerText}</Text>}
      {rightIcon && (
        <TouchableOpacity style={styles.iconContainer}>
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

const { width: screenWidth } = Dimensions.get('window');

let imageWidth = 41;
let imageHeight = 37;

if (screenWidth > 500) {
  imageWidth = imageWidth * (screenWidth / 500);
  imageHeight = imageHeight * (screenWidth / 500);
}

const styles = StyleSheet.create({
  imageStyle: {
    marginTop: 25,
    marginLeft: 15,
    width: imageWidth,
    height: imageHeight,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: gradientColor1,
    justifyContent: 'center',
    paddingTop: 25,
    paddingBottom: 15,
  },
  imageContainer: {
    position: 'absolute',
    left: 5,
  },
  headerText: {
    fontFamily: headerFont,
    fontSize: 40,
    paddingTop: 5,
    color: darkMainColor,
    alignSelf: 'center',
    textAlign: 'center',
  },
  iconContainer: {
    position: 'absolute',
    right: 5,
  },
});

export default Logo;
