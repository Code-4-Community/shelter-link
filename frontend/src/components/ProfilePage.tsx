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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                selectedButton === 'shelters' && styles.selectedButton,
              ]}
              onPress={() => setSelectedButton('shelters')}
            >
              <Text style={styles.buttonText}>Saved Shelters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                selectedButton === 'events' && styles.selectedButton,
              ]}
              onPress={() => setSelectedButton('events')}
            >
              <Text style={styles.buttonText}>Saved Events</Text>
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
  container: {
    flex: 1,
  },
  buttonText: {
    fontSize: caption1FontSize,
    color: darkMainColor,
    fontFamily: bodyFont,
    textAlign: 'center',
  },
  button: {
    backgroundColor: buttonBackgroundColor,
    padding: 10,
    borderRadius: 5,
    marginVertical: 20,
  },
  selectedButton: {
    backgroundColor: containerColor,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: darkMainColor,
  },
  buttonContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
});
