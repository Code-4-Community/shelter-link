// App.tsx
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Logo from '../components/Logo';
import { LogIn } from '../components/LogIn';
import CompleteMap from '../components/CompleteMap';
import { DetailedShelterView } from '../components/DetailedShelterView';

import { Shelter } from '../types';
import { AuthProvider, useAuth } from '../hooks/AuthContext';

import SignUpScreen from '../components/SignUpScreen';
// import SignInScreen from '../components/SignInScreen';


// defines type for nav stack
export type RootStackParamList = {

  'Log In': undefined;
  // 'Sign In': undefined;
  'Sign Up': undefined;
  'Map View': undefined;
  'Detailed Shelter View': { shelter: Shelter };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Screens that require authentication:
 */
function AuthenticatedStack() {
  return (
    <>
      <View>
        <Logo />
      </View>
      <Stack.Navigator>
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
    </>

  );
}

/**
 * Screens for unauthenticated users (Sign In / Sign Up):
 */
function UnauthenticatedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Log In" component={LogIn} options={{ headerShown: false }} />
      {/* <Stack.Screen name="Sign In" component={SignInScreen} options={{ headerShown: false }} /> */}
      <Stack.Screen name="Sign Up" component={SignUpScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

/**
 * Decides which stack to render based on whether user is logged in.
 */
function MainNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    // Loading screen while fetching user data
    return <View style={styles.centeredView}><Logo /></View>;
  }

  return user ? <AuthenticatedStack /> : <UnauthenticatedStack />;
}

export const App = () => {
  if (process.env.EXPO_PUBLIC_API_URL === undefined) {
    throw new Error(
      "Environment variable 'EXPO_PUBLIC_API_URL' must be defined"
    );
  }

  return (
    // Provide the AuthContext to the entire app
    <AuthProvider>
      <NavigationContainer>

        <GestureHandlerRootView style={{ flex: 1 }}>
          <MainNavigator />
        </GestureHandlerRootView>

      </NavigationContainer>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
