import { useFonts } from 'expo-font';
import { LinearGradient } from 'expo-linear-gradient';
import {
  bodyFont,
  bodyFontSize,
  buttonBackgroundColor,
  caption1FontSize,
  containerColor,
  darkMainColor,
  gradientColor1,
  gradientColor2,
} from 'frontend/constants';
import { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export const ProfilePage = () => {
  const [selectedButton, setSelectedButton] = useState<'shelters' | 'events'>(
    'shelters'
  );

  useFonts({
    AvenirNext: require('../../assets/fonts/AvenirNextLTPro-Regular.otf'),
  });

  return (
    <LinearGradient
      colors={[gradientColor1, gradientColor2]}
      style={styles.safeArea}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={styles.container}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                selectedButton === 'shelters' && styles.selectedButton,
              ]}
              onPress={() => setSelectedButton('shelters')}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedButton === 'shelters' && styles.selectedButtonText,
                ]}
              >
                Saved Shelters
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                selectedButton === 'events' && styles.selectedButton,
              ]}
              onPress={() => setSelectedButton('events')}
            >
              <Text
                style={[
                  styles.buttonText,
                  selectedButton === 'events' && styles.selectedButtonText,
                ]}
              >
                Saved Events
              </Text>
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
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
  },
  buttonText: {
    fontSize: caption1FontSize,
    color: darkMainColor,
    fontFamily: bodyFont,
    textAlign: 'center',
  },
  button: {
    backgroundColor: buttonBackgroundColor,
    padding: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginVertical: 20,
    borderWidth: 2,
    flex: 1,
    borderColor: darkMainColor,
  },
  selectedButton: {
    backgroundColor: darkMainColor,
    padding: 5,
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
  },
  selectedButtonText: {
    fontSize: caption1FontSize,
    color: buttonBackgroundColor,
    fontFamily: bodyFont,
    textAlign: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'stretch',
  },
});
