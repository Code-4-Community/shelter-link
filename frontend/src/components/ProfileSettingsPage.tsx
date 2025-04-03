import React from 'react';
import { DynamoDBUser } from '../types';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  bodyFont,
  bodyFontSize,
  buttonBackgroundColor,
  caption1FontSize,
  containerColor,
  darkMainColor,
  gradientColor1,
  gradientColor2,
  header1FontSize,
  header2FontSize,
} from 'frontend/constants';
import { LinearGradient } from 'expo-linear-gradient';

type RootStackParamList = {
  'Profile Settings': { user: DynamoDBUser };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Profile Settings'>;

export const ProfileSettingsPage: React.FC<Props> = ({ route }) => {
  const { user } = route.params;
  console.log('User in ProfileSettingsPage:', user.email.S);

  return (
    <LinearGradient
      colors={[gradientColor1, gradientColor2]}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={styles.safeArea}
        >
          <View>
            <Text style={styles.infoText}>
              Welcome, {user.first_name.S} {user.last_name.S}
            </Text>

            <Text style={styles.infoText}>
              Your Profile Information Email: {user.email.S}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              //   onPress={() => console.log('Edit Profile Pressed')}
            >
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  buttonText: {
    fontSize: bodyFontSize,
    color: 'black',
    fontFamily: bodyFont,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: buttonBackgroundColor,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: darkMainColor,
  },
  buttonContainer: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 35,
  },
  infoText: {
    fontFamily: bodyFont,
    fontSize: header1FontSize,
    textAlign: 'center',
    padding: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});
