import { backgroundColor } from '../../constants';
import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app/App';

type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Logo: React.FC = () => {
  const navigation = useNavigation<AppNavigationProp>();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image
          style={styles.imageStyle}
          source={require('../../assets/Logo.png')}
        />
      </TouchableOpacity>
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
    backgroundColor: backgroundColor,
  },
});

export default Logo;
