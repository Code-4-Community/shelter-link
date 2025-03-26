import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CompleteMap from '../components/CompleteMap';
import { DetailedShelterView } from '../components/DetailedShelterView';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Shelter } from '../types';
import Logo from '../components/Logo';
import { LogIn } from '../components/LogIn';


// defines type for nav stack
export type RootStackParamList = {
  'Log In': undefined;
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
          {/* logo is rendered as a sibling */}
          <View>
            <Logo />
          </View>
          {/* add other pages here in this similar way */}
          <Stack.Navigator>
            <Stack.Screen
              name="Log In"
              component={LogIn}
              options={{ headerShown: false }}
            />
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
  searchBarContainer: {
    marginVertical: '10%',
  },
  headerContainer: {
    marginTop: 20,
  },
  filtersDropdownContainer: {
    marginVertical: 10,
  },
});

export default App;
