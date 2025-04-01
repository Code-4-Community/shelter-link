// App.tsx
import React, { useEffect } from 'react';
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
import SignInScreen from '../components/SignInScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { containerColor, darkMainColor } from 'frontend/constants';

// defines type for nav stack
export type RootStackParamList = {
  'Log In': undefined;
  'Sign Up': undefined;
  'Map View': undefined;
  'Detailed Shelter View': { shelter: Shelter };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function UnauthenticatedTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: 'map-outline' | 'person-outline';
          if (route.name === 'Map View') {
            iconName = 'map-outline';
          } else {
            iconName = 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: darkMainColor,
        tabBarInactiveTintColor: containerColor,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Map View" component={MapStackNavigator} />
    </Tab.Navigator>
  );
}

function AuthenticatedTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: 'map-outline' | 'person-outline';
          if (route.name === 'Map View') {
            iconName = 'map-outline';
          } else {
            iconName = 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: darkMainColor,
        tabBarInactiveTintColor: containerColor,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Map View" component={MapStackNavigator} />
    </Tab.Navigator>
  );
}

function MapStackNavigator() {
  return (
    <Stack.Navigator>
      {/* Default screen inside the tab */}
      <Stack.Screen
        name="Map View"
        component={CompleteMap}
        options={{
          headerShown: true,
          header: () => <Logo headerText="ShelterLink" />,
        }}
      />
      {/* Screen accessible from Map View, but still inside the tab navigator */}
      <Stack.Screen
        name="Detailed Shelter View"
        component={DetailedShelterView}
        options={({ route }) => ({
          headerShown: true,
          header: () => <Logo headerText={route.params.shelter.name} />, // Access shelter name from route params
        })}
      />
    </Stack.Navigator>
  );
}

/**
 * Screens that require authentication:
 */
function AuthenticatedStack() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Navigator>
        <Stack.Screen
          name="Map View"
          component={AuthenticatedTabs}
          options={{
            headerShown: true,
            header: () => <Logo headerText="ShelterLink" />,
          }}
        />
        <Stack.Screen
          name="Detailed Shelter View"
          component={AuthenticatedTabs}
          options={({ route }) => ({
            headerShown: true,
            header: () => <Logo headerText={route.params.shelter.name} />, // Access shelter name from route params
          })}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

/**
 * Screens for unauthenticated users (Sign In / Sign Up):
 */
function UnauthenticatedStack() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Navigator>
        <Stack.Screen
          name="Log In"
          component={UnauthenticatedTabs}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Sign Up"
          component={UnauthenticatedTabs}
          options={{
            headerShown: true,
            header: () => <Logo headerText="ShelterLink" />,
          }}
        />
        <Stack.Screen
          name="Map View"
          component={UnauthenticatedTabs}
          options={{
            headerShown: true,
            header: () => <Logo headerText="ShelterLink" />,
          }}
        />
        <Stack.Screen
          name="Detailed Shelter View"
          component={UnauthenticatedTabs}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

/**
 * Decides which stack to render based on whether user is logged in.
 */
function MainNavigator() {
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    // Force logout (for testing purposes)
    logout();
  }, []);

  if (loading) {
    // Loading screen while fetching user data
    return (
      <View style={styles.centeredView}>
        <Logo />
      </View>
    );
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
        <View style={{ flex: 1 }}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <MainNavigator />
          </GestureHandlerRootView>
        </View>
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
