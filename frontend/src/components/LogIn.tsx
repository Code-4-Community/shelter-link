import { useNavigation } from '@react-navigation/native';
import {
  backgroundColor,
  headerFont,
  darkMainColor,
  bodyFont,
  mainColor,
  buttonBackgroundColor,
  descriptionFontColor,
  gradientColor1,
  gradientColor2,
} from '../../constants';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app/App';
import { LinearGradient } from 'expo-linear-gradient';

type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const LogIn = () => {
  const navigation = useNavigation<AppNavigationProp>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const validateField = (field: 'username' | 'password', value: string) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: value.trim()
        ? undefined
        : `${field === 'username' ? 'Username' : 'Password'} is required`,
    }));
  };

  const validateAndLogin = () => {
    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password.trim()) newErrors.password = 'Password is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Logging in with:', { username, password });
      // auth nav call here
    }
  };
  return (
    <LinearGradient
      colors={[gradientColor1, gradientColor2]}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Welcome to ShelterLink!</Text>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginHeading}>Log In</Text>

          <View style={styles.usernameContainer}>
            <Text style={styles.usernameHeading}>Username</Text>
            <TextInput
              style={[styles.input, errors.username && styles.inputError]}
              placeholder="Email"
              value={username}
              onChangeText={setUsername}
              onBlur={() => validateField('username', username)}
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}
          </View>

          <View style={styles.passwordContainer}>
            <Text style={styles.passwordHeading}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onBlur={() => validateField('password', password)}
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>
          <View style={styles.signUpRedirection}>
            <Text>New to ShelterLink? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Sign Up')}>
              <Text style={styles.signUpRedirectionClickable}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.loginButton,
            (!username || !password) && styles.disabledButton,
          ]}
          onPress={validateAndLogin}
          disabled={!username || !password} //disabled till both fields are filled
        >
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipLogin}
          onPress={() => navigation.navigate('Map View')}
        >
          <Text style={styles.skipLoginText}>Skip login for now</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
let dynamicTabletSizes: Record<string, number> = {};
dynamicTabletSizes['headingContainer'] = 343;
dynamicTabletSizes['buttonFontSize'] = 13;
dynamicTabletSizes['loginButtonWidth'] = 270;
dynamicTabletSizes['shelterDescriptionFontSize'] = 15;
dynamicTabletSizes['shelterDescriptionLineHeight'] = 21.59;
dynamicTabletSizes['dayTextFontSize'] = 15;
dynamicTabletSizes['dayTextLineHeight'] = 21.59;
dynamicTabletSizes['arrowFontSize'] = 12;
dynamicTabletSizes['redArrowFontSize'] = 17;
dynamicTabletSizes['hoursTextFontSize'] = 15;
dynamicTabletSizes['hoursTextLineHeight'] = 21.59;
dynamicTabletSizes['quickInfoTextPaddingBottom'] = 4;
dynamicTabletSizes['fullReviewMarginTop'] = 40;
dynamicTabletSizes['fullReviewMarginLeft'] = 13;
dynamicTabletSizes['loginWidth'] = 270;

if (screenWidth > 500) {
  let widthRatio = screenWidth / 500;
  for (const key in dynamicTabletSizes) {
    dynamicTabletSizes[key] = dynamicTabletSizes[key] * widthRatio;
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  headingContainer: {
    width: dynamicTabletSizes.headingContainer,
    alignSelf: 'center',
  },
  heading: {
    fontSize: 36,
    color: darkMainColor,
    fontWeight: 700,
    alignSelf: 'center',
    marginBottom: 48,
    paddingHorizontal: 27,
  },
  loginContainer: {
    width: dynamicTabletSizes.loginWidth,
    height: screenHeight * 0.43,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 24,
    borderRadius: 8,
    borderColor: descriptionFontColor,
    borderWidth: 1,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    //  shadow property
    elevation: 5,
    marginBottom: 24,
  },
  loginHeading: {
    fontSize: 24,
    color: darkMainColor,
    fontWeight: 500,
    alignSelf: 'center',
    marginBottom: 48,
  },
  usernameContainer: {
    marginBottom: 24,
  },
  usernameHeading: {
    color: descriptionFontColor,
    fontSize: 18,
    fontFamily: bodyFont,
    fontWeight: 600,
    marginBottom: 12,
  },
  passwordContainer: {
    marginBottom: 24,
  },
  passwordHeading: {
    color: descriptionFontColor,
    fontSize: 18,
    fontFamily: bodyFont,
    fontWeight: 600,
    marginBottom: 12,
  },
  input: {
    width: '100%',
    height: screenHeight * 0.04,
    borderColor: '#E8E8E8',
    borderWidth: 1,
    paddingLeft: 16,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  inputError: { borderColor: 'red' },
  errorText: { color: 'red', fontSize: 12, marginTop: 4 },
  signUpRedirection: {
    color: '#000',
    alignSelf: 'center',
    fontSize: 14,
    fontFamily: bodyFont,
    fontWeight: 400,
    flexDirection: 'row',
    marginTop: 10,
  },
  signUpRedirectionClickable: {
    textDecorationLine: 'underline',
  },
  loginButton: {
    width: dynamicTabletSizes.loginButtonWidth,
    height: screenHeight * 0.05,
    backgroundColor: darkMainColor,
    borderRadius: 8,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: 'white',
    fontFamily: bodyFont,
    fontSize: 20,
    fontWeight: 500,
    alignSelf: 'center',
  },
  disabledButton: { backgroundColor: '#A9A9A9' }, // greyed-out when disabled
  skipLogin: { alignSelf: 'center' },
  skipLoginText: {
    color: '#000',
    fontSize: 14,
    fontFamily: bodyFont,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
});
