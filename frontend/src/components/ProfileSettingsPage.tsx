import React from 'react';
import { User } from '../types';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
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
  header3FontSize,
} from 'frontend/constants';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/AuthContext';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  'Log In': undefined;
  'Profile Settings': { user: User };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Profile Settings'>;

export const ProfileSettingsPage: React.FC<Props> = ({ navigation, route }) => {
  const { user } = route.params;
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

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
            <Text style={styles.welcomeText}>
              Welcome, {user.first_name} {user.last_name}
            </Text>

            <Text style={styles.headerText}>Your Profile Information</Text>

            <Text style={styles.infoText}>First Name: {user.first_name}</Text>
            <Text style={styles.infoText}>Last Name: {user.last_name}</Text>
            <Text style={styles.infoText}>Email: {user.email}</Text>
            <Text style={styles.infoText}>Password: ********</Text>
            <Text style={styles.infoText}>
              Joined: {new Date(user.created_at).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
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
    color: buttonBackgroundColor,
    fontFamily: bodyFont,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: darkMainColor,
    padding: 10,
    width: 150,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonContainer: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 35,
  },
  welcomeText: {
    fontFamily: bodyFont,
    fontSize: header1FontSize,
    marginTop: 20,
    textAlign: 'center',
    padding: 20,
    fontWeight: 'bold',
    color: darkMainColor,
  },
  headerText: {
    fontFamily: bodyFont,
    fontSize: header3FontSize,
    textAlign: 'center',
    marginTop: 20,
    padding: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  infoText: {
    fontFamily: bodyFont,
    fontSize: bodyFontSize,
    textAlign: 'center',
    padding: 10,
    fontWeight: 'bold',
    color: 'black',
  },
});
