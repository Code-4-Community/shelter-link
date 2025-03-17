import { backgroundColor, bodyFont, darkMainColor } from '../../constants';
import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app/App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Logo: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Map View')}>
        <Image
          style={{
            marginTop: 25,
            marginLeft: 15,
          }}
          source={require('frontend/assets/Logo.png')}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: backgroundColor,
  },
});

export default Logo;
