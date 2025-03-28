import React, { useState, useEffect } from 'react';
import {
  Modal,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  SafeAreaView,
  Keyboard,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradientColor1, gradientColor2, labelColor } from 'frontend/constants';
import { useFonts } from 'expo-font';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app/App';
import { createUser } from '../services/userService';


type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SignUpScreen = () => {
  const navigation = useNavigation<AppNavigationProp>();
  const { height: screenHeight } = Dimensions.get('window');


  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useFonts({
    AvenirNext: require('../../assets/fonts/AvenirNextLTPro-Bold.otf'),
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // Password strength states
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [slideAnim] = useState(new Animated.Value(0));

  // Add keyboard listeners
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardVisible(true);
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  // -------------------------
  // Validation Functions
  // -------------------------
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const strength = {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordStrength(strength);
    // Returns true only if all conditions are met
    return Object.values(strength).every(Boolean);
  };

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'firstName':
        return value.trim() ? '' : 'First name is required';
      case 'lastName':
        return value.trim() ? '' : 'Last name is required';
      case 'email':
        return validateEmail(value) ? '' : 'Please enter a valid email';
      case 'password':
        return validatePassword(value)
          ? ''
          : 'Password does not meet requirements';
      default:
        return '';
    }
  };

  // -------------------------
  // Handlers
  // -------------------------
  interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }

  interface Errors {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }));
    setErrors((prev: Errors) => ({ ...prev, [field]: '' }));

    // Update password strength when password field changes
    if (field === 'password') {
      validatePassword(value);
    }
  };

  const handleSubmit = async () => {
    // Validate all fields
    let isValid = true;
    const newErrors = { ...errors };

    Object.keys(formData).forEach((field) => {
      const typedField = field as keyof typeof formData;
      const errMsg = validateField(field, formData[typedField]);
      if (errMsg) {
        newErrors[typedField] = errMsg;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      try {
        const user = await createUser({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
        });
        console.log('User signed up successfully:', user);
        // Navigate to a confirmation screen or log in the user automatically.
      } catch (err) {
        console.error('Sign up failed:', err);
        // Optionally, set an error message in the UI.
      }
    } else {
      handleInvalidSubmit();
    }
  };


  // Animate slide (optional) for an invalid submit "shake"
  const animateSlide = () => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 10,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleInvalidSubmit = () => {
    animateSlide();
  };

  // Function to dismiss keyboard when tapping outside inputs
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <LinearGradient
      colors={[gradientColor1, gradientColor2]}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              { minHeight: screenHeight * 0.9 }
            ]}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              style={styles.contentWrapper}
              activeOpacity={1}
              onPress={dismissKeyboard}
            >
              <Animated.View
                style={[
                  styles.formContainer,
                  { transform: [{ translateX: slideAnim }] },
                ]}
              >
                <Text style={styles.title}>Sign Up</Text>
                {/* First Name */}
                <Text style={styles.label}>First Name*</Text>
                <TextInput
                  style={[styles.input, errors.firstName && styles.inputError]}
                  value={formData.firstName}
                  placeholder="Enter text here..."
                  onChangeText={(text) => handleChange('firstName', text)}
                  autoCapitalize="words"
                  placeholderTextColor="#999"
                />
                {errors.firstName ? (
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                ) : null}

                {/* Last Name */}
                <Text style={styles.label}>Last Name*</Text>
                <TextInput
                  style={[styles.input, errors.lastName && styles.inputError]}
                  value={formData.lastName}
                  placeholder="Enter text here..."
                  onChangeText={(text) => handleChange('lastName', text)}
                  autoCapitalize="words"
                  placeholderTextColor="#999"
                />
                {errors.lastName ? (
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                ) : null}

                {/* Email */}
                <Text style={styles.label}>Email*</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  value={formData.email}
                  placeholder="abc@gmail.com"
                  onChangeText={(text) => handleChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />
                {errors.email ? (
                  <Text style={styles.errorText}>{errors.email}</Text>
                ) : null}

                {/* Password */}
                <Text style={styles.label}>Password*</Text>
                <TextInput
                  style={[styles.input, errors.password && styles.inputError]}
                  value={formData.password}
                  placeholder="7nUhDASB*125"
                  secureTextEntry
                  onChangeText={(text) => handleChange('password', text)}
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />
                {errors.password ? (
                  <Text style={styles.errorText}>{errors.password}</Text>
                ) : null}

                {/* Password Requirements List */}
                <View style={styles.passwordRequirements}>
                  <Text style={styles.passwordRequirementsTitle}>Password Requirements:</Text>
                  <View style={styles.requirementItem}>
                    <Text style={[
                      styles.requirementText,
                      passwordStrength.hasMinLength ? styles.requirementMet : styles.requirementNotMet
                    ]}>
                      {passwordStrength.hasMinLength ? "✓" : "✗"} At least 8 characters
                    </Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <Text style={[
                      styles.requirementText,
                      passwordStrength.hasUpperCase ? styles.requirementMet : styles.requirementNotMet
                    ]}>
                      {passwordStrength.hasUpperCase ? "✓" : "✗"} At least one uppercase letter
                    </Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <Text style={[
                      styles.requirementText,
                      passwordStrength.hasLowerCase ? styles.requirementMet : styles.requirementNotMet
                    ]}>
                      {passwordStrength.hasLowerCase ? "✓" : "✗"} At least one lowercase letter
                    </Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <Text style={[
                      styles.requirementText,
                      passwordStrength.hasNumber ? styles.requirementMet : styles.requirementNotMet
                    ]}>
                      {passwordStrength.hasNumber ? "✓" : "✗"} At least one number
                    </Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <Text style={[
                      styles.requirementText,
                      passwordStrength.hasSpecialChar ? styles.requirementMet : styles.requirementNotMet
                    ]}>
                      {passwordStrength.hasSpecialChar ? "✓" : "✗"} At least one special character (!@#$%^&*,.?)
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => {
                    const allValid = Object.values(errors).every((e) => e === '');
                    handleSubmit();
                    if (!allValid) handleInvalidSubmit();
                  }}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.loginLink}
                  onPress={() => navigation.navigate('Sign In')}
                >
                  <Text style={styles.label}>Already have an account?</Text>
                </TouchableOpacity>
              </Animated.View>

              {/* Add extra space at the bottom when keyboard is visible */}
              {keyboardVisible && (
                <View style={{ height: Platform.OS === 'android' ? keyboardHeight * 0.5 : 20 }} />
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  gradientBackground: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: labelColor,
    marginVertical: 20,
    textAlign: 'center',
    fontFamily: 'AvenirNext',
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255, 1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#000000',
    fontFamily: 'ProximaNova-Regular',
  },
  input: {
    height: 50, // Increased height for better touch targets
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    fontSize: 16, // Slightly larger font
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
    marginBottom: 8,
  },
  passwordNote: {
    color: '#666666',
    fontSize: 12,
    marginBottom: 8,
  },
  passwordRequirements: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  passwordRequirementsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  requirementText: {
    fontSize: 13,
    marginLeft: 5,
  },
  requirementMet: {
    color: '#27ae60',
    fontWeight: '500',
  },
  requirementNotMet: {
    color: '#e74c3c',
  },
  submitButton: {
    backgroundColor: '#e3e3e3',
    borderRadius: 10,
    paddingVertical: 15, // Increased height
    alignItems: 'center',
  },
  submitButtonText: {
    color: labelColor,
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8, // Better tap target
  },
});