import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CompleteMap } from './frontend/src/components/CompleteMap'; // Ensure this path is correct and the file exists
import { DetailedShelterView } from './frontend/src/components/DetailedShelterView';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Shelter } from './frontend/src/types';

// defines type for nav stack
type RootStackParamList = {
  'Map View': undefined;
  'Detailed Shelter View': {
    shelter: Shelter;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const App = () => {
  if (process.env.EXPO_PUBLIC_API_URL === undefined) {
    throw new Error(
      "Environment variable 'EXPO_PUBLIC_API_URL' must be defined"
    );
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.safeArea}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack.Navigator id={undefined}>
            <Stack.Screen
              name="Map View"
              component={CompleteMap}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Detailed Shelter View"
              component={DetailedShelterView}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </GestureHandlerRootView>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  searchBarContainer: {
    marginVertical: 10,
  },
  headerContainer: {
    marginTop: 20,
  },
  filtersDropdownContainer: {
    marginVertical: 10,
  },
});

export default App;
