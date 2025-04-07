// App.tsx
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import Logo from '../components/Logo';
import { LogIn } from '../components/LogIn';
import CompleteMap from '../components/CompleteMap';
import DetailedShelterView from '../components/DetailedShelterView';

import { Shelter, Event, User } from '../types';
import { AuthProvider, useAuth } from '../hooks/AuthContext';

import SignUpScreen from '../components/SignUpScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import {
  backgroundColor,
  containerColor,
  darkMainColor,
  gradientColor1,
  header2FontSize,
  header3FontSize,
  headerFont,
} from 'frontend/constants';
import { ProfilePage } from '../components/ProfilePage';
import { ProfileSettingsPage } from '../components/ProfileSettingsPage';
import { BookmarkProvider } from '../hooks/BookmarkContext';
import AllEventsViewer from '../components/AllEventsViewer';
import DetailedEventView from '../components/DetailedEventView';

// defines type for nav stack
export type RootStackParamList = {
  'Log In': undefined;
  'Sign Up': undefined;
  'Map View': undefined;
  'All Events View': undefined;
  'Detailed Shelter View': { shelter: Shelter };
  'Detailed Event View': { event: Event };
  Profile: undefined;
  Map: undefined;
  'Profile Settings': { user: User };
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MapStackNavigator() {
  return (
    <Stack.Navigator>
      {/* Default screen inside the tab */}
      <Stack.Screen
        name="Map View"
        component={CompleteMap}
        options={{
          headerShown: true,
          header: () => <Logo headerText="ShelterLink" navigateTo="Map View" />,
        }}
      />
    </Stack.Navigator>
  );
}

function EventStackNavigator() {
  return (
    <Stack.Navigator>
      {/* Default screen inside the tab */}
      <Stack.Screen 
        name="All Events View" 
        component={AllEventsViewer}
        options={{
          headerShown: true,
          header: () => <Logo headerText="Events" navigateTo="Map" />,
        }}
      />
      {/* Navigates from Map to DetailedShelterView, keeping tabs visible */}
      <Stack.Screen
        name="Detailed Event View"
        component={DetailedEventView}
        options={({ route }) => ({
          headerShown: true,
          header: () => (
            <Logo
              headerText={route.params.event.event_name}
              navigateTo="Map View"
            />
          ),
        })}
        />
    </Stack.Navigator>
  );
}


function BottomTabsNavigator() {
  const { user } = useAuth();
  type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;
  const navigation = useNavigation<AppNavigationProp>();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: 'map-outline' | 'person-outline' | 'calendar-outline';
          switch (route.name) {
            case 'Map':
              iconName = 'map-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            case 'Events':
              iconName = 'calendar-outline';
              break;
            default:
              Error(`Route ${route.name} is unrecognized`);
              iconName = 'calendar-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: darkMainColor,
        tabBarInactiveTintColor: backgroundColor,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Map" component={MapStackNavigator} />
      <Tab.Screen
        name="Profile"
        component={user ? ProfilePage : LogIn}
        options={
          user
            ? {
                headerShown: true,
                header: () => (
                  <Logo
                    headerText="ShelterLink"
                    navigateTo="Map"
                    rightIcon={
                      <Ionicons
                        name="settings-outline"
                        size={24}
                        color={darkMainColor}
                        fillColor={containerColor}
                        style={{ marginRight: 15 }}
                        onPress={() => {
                          // Navigate to Profile Settings screen
                          navigation.navigate('Profile Settings', { user });
                        }}
                      />
                    }
                  />
                ),
              }
            : {
                headerShown: true,
                header: () => <Logo navigateTo="Map" />,
              }
        }
      />
      <Tab.Screen name="Events" component={EventStackNavigator} />
    </Tab.Navigator>
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
          name="Main"
          component={BottomTabsNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile Settings"
          component={ProfileSettingsPage}
          options={({ navigation, route }) => ({
            headerStyle: {
              backgroundColor: gradientColor1,
              paddingTop: 40,
            },
            headerTintColor: darkMainColor,
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: header2FontSize,
              color: darkMainColor,
              fontFamily: headerFont,
            },
            headerTitle: 'Settings',
            headerBackTitle: 'Profile',
          })}
        />
        <Stack.Screen
          name="Detailed Shelter View"
          component={DetailedShelterView}
          options={({ route }) => ({
            headerShown: true,
            headerStyle: {
              backgroundColor: gradientColor1,
            },
            headerTintColor: darkMainColor,
            headerTitleStyle: {
              fontSize: header3FontSize,
              color: darkMainColor,
              fontFamily: headerFont,
            },
            headerTitle: 'Shelterlink',
            headerBackTitle: 'Map',
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
          component={LogIn}
          options={{
            headerShown: true,
            header: () => <Logo navigateTo="Map View" />,
          }}
        />
        <Stack.Screen
          name="Sign Up"
          component={SignUpScreen}
          options={{
            headerShown: true,
            header: () => (
              <Logo headerText="ShelterLink" navigateTo="Map View" />
            ),
          }}
        />
        <Stack.Screen
          name="Main"
          component={BottomTabsNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Detailed Shelter View"
          component={DetailedShelterView}
          options={({ route }) => ({
            headerShown: true,
            headerStyle: {
              backgroundColor: gradientColor1,
            },
            headerTintColor: darkMainColor,
            headerTitleStyle: {
              fontSize: header3FontSize,
              color: darkMainColor,
              fontFamily: headerFont,
            },
            headerTitle: 'Shelterlink',
            headerBackTitle: 'Map',
          })}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

/**
 * Decides which stack to render based on whether user is logged in.
 */
function MainNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    // Loading screen while fetching user data
    return (
      <View style={styles.centeredView}>
        <Logo navigateTo="Map View" />
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
      <BookmarkProvider>
        <NavigationContainer>
          <View style={{ flex: 1 }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <MainNavigator />
            </GestureHandlerRootView>
          </View>
        </NavigationContainer>
      </BookmarkProvider>
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
