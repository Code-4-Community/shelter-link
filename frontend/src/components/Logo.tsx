import {
  backgroundColor,
  darkMainColor,
  gradientColor1,
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

const Logo: React.FC<{ headerText?: string }> = ({ headerText }) => {
  const navigation = useNavigation<AppNavigationProp>();

  return (
    <View style={[styles.container, { justifyContent: 'center' }]}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => navigation.navigate('Map View')}
      >
        <Image
          style={styles.imageStyle}
          source={require('../../assets/Logo.png')}
        />
      </TouchableOpacity>
      {headerText && <Text style={styles.headerText}>{headerText}</Text>}
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
    fontSize: 36,
    paddingTop: 5,
    color: darkMainColor,
    alignSelf: 'center',
    textAlign: 'center',
  },
});

export default Logo;
