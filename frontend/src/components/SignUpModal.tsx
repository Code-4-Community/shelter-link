import { useFonts } from 'expo-font';
import React, { useState } from 'react';
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
} from 'react-native';

const SignUpWizard = () => {
  useFonts({
    'AvenirNext': require('../../assets/fonts/AvenirNextLTPro-Bold.otf'),
  });

  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    question: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    question: '',
  });

  // error states
  const [errors, setErrors] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    question: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    question: '',
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [slideAnim] = useState(new Animated.Value(0));

  // password strength
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  // define steps
  const steps = [
    {
      title: 'Sign Up',
      fields: ['firstName', 'lastName', 'email', 'phoneNumber', 'password'],
    },
    {
      // can add more pages here; just filler rn
      title: 'Verification',
      fields: ['question'],
    },
  ];

  // slide animation
  const animateSlide = (direction: string) => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: direction === 'right' ? 100 : -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // validations
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(phone);
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
    return Object.values(strength).every(Boolean);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // validation error messages for sign up sheet
  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'firstName':
        return value.trim() ? '' : 'First name is required';
      case 'lastName':
        return value.trim() ? '' : 'Last name is required';
      case 'email':
        return validateEmail(value) ? '' : 'Please enter a valid email';
      case 'phoneNumber':
        return validatePhoneNumber(value)
          ? ''
          : 'Please enter a valid phone number';
      case 'password':
        return validatePassword(value)
          ? ''
          : 'Password does not meet requirements';
      default:
        return '';
    }
  };

  const validateStep = (stepIndex: number) => {
    const currentFields = steps[stepIndex].fields;
    const stepErrors: { [key: string]: string } = {};
    let isValid = true;

    currentFields.forEach((field: string) => {
      const error = validateField(
        field,
        formData[field as keyof typeof formData]
      );
      if (error) {
        stepErrors[field] = error;
        isValid = false;
      }
    });

    setErrors((prev) => ({ ...prev, ...stepErrors }));
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      animateSlide('right');
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    animateSlide('left');
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      // submit form
      console.log('Form submitted:', formData);
    }
  };

  // render form fields based on current page
  const renderFields = () => {
    const currentFields = steps[currentStep].fields;

    return (
      <Animated.View
        style={[
          styles.fieldsContainer,
          {
            transform: [
              {
                translateX: slideAnim,
              },
            ],
          },
        ]}
      >
        {currentFields.includes('firstName') && (
          <View style={styles.formFields}>
            <Text style={styles.modalFieldText}>First Name*</Text>
            <TextInput
              style={[styles.input, errors.firstName && styles.inputError]}
              value={formData.firstName}
              placeholder="Enter text here..."
              onChangeText={(text) => handleChange('firstName', text)}
              autoCapitalize="words"
              placeholderTextColor="#9C9A9A"
            />
            {errors.firstName ? (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            ) : null}
          </View>
        )}

        {currentFields.includes('lastName') && (
          <View style={styles.formFields}>
            <Text style={styles.modalFieldText}>Last Name*</Text>
            <TextInput
              style={[styles.input, errors.lastName && styles.inputError]}
              value={formData.lastName}
              placeholder="Enter text here..."
              onChangeText={(text) => handleChange('lastName', text)}
              autoCapitalize="words"
              placeholderTextColor="#9C9A9A"
            />
            {errors.lastName ? (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            ) : null}
          </View>
        )}

        {currentFields.includes('email') && (
          <View style={styles.formFields}>
            <Text style={styles.modalFieldText}>Email*</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              value={formData.email}
              placeholder="Enter text here..."
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9C9A9A"
            />
            {errors.email ? (
              <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
          </View>
        )}

        {currentFields.includes('phoneNumber') && (
          <View style={styles.formFields}>
            <Text style={styles.modalFieldText}>Phone Number</Text>
            <TextInput
              style={[styles.input, errors.phoneNumber && styles.inputError]}
              value={formData.phoneNumber}
              placeholder="Enter text here..."
              onChangeText={(text) => handleChange('phoneNumber', text)}
              keyboardType="phone-pad"
              placeholderTextColor="#9C9A9A"
            />
            {errors.phoneNumber ? (
              <Text style={styles.errorText}>{errors.phoneNumber}</Text>
            ) : null}
          </View>
        )}

        {currentFields.includes('password') && (
          <View style={styles.formFields}>
            <Text style={styles.modalFieldText}>Password*</Text>
            <View style={styles.passwordRequirements}>
              <Text
                style={[
                  styles.requirementText,
                  passwordStrength.hasMinLength ? styles.requirementMet : null,
                ]}
              >
                Password Requirements
              </Text>
              {/*can include these if we wanna list out the password reqs*/}
              {/*<Text style={[*/}
              {/*  styles.requirementText,*/}
              {/*  passwordStrength.hasUpperCase ? styles.requirementMet : null*/}
              {/*]}>• At least one uppercase letter</Text>*/}
              {/*<Text style={[*/}
              {/*  styles.requirementText,*/}
              {/*  passwordStrength.hasLowerCase ? styles.requirementMet : null*/}
              {/*]}>• At least one lowercase letter</Text>*/}
              {/*<Text style={[*/}
              {/*  styles.requirementText,*/}
              {/*  passwordStrength.hasNumber ? styles.requirementMet : null*/}
              {/*]}>• At least one number</Text>*/}
              {/*<Text style={[*/}
              {/*  styles.requirementText,*/}
              {/*  passwordStrength.hasSpecialChar ? styles.requirementMet : null*/}
              {/*]}>• At least one special character</Text>*/}
            </View>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              value={formData.password}
              placeholder="Enter text here..."
              secureTextEntry
              onChangeText={(text) => handleChange('password', text)}
              placeholderTextColor="#9C9A9A"
            />
            {errors.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
          </View>
        )}
        {currentFields.includes('question') && (
          <View style={styles.formFields}>
            <Text style={styles.modalFieldText}>Question</Text>
            <TextInput
              style={[styles.input, errors.question && styles.inputError]}
              value={formData.question}
              placeholder="Enter text here..."
              onChangeText={(text) => handleChange('question', text)}
              placeholderTextColor="#9C9A9A"
            />
            {errors.question && (
              <Text style={styles.errorText}>{errors.question}</Text>
            )}
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <Modal animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.centeredView}
      >
        <View style={styles.modalView}>
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <View style={styles.modalForm}>
              {/* progress indicator for form */}
              <View style={styles.progressContainer}>
                {steps.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.progressDot,
                      currentStep === index && styles.progressDotActive,
                      currentStep > index && styles.progressDotCompleted,
                    ]}
                  />
                ))}
              </View>

              <Text style={styles.modalTitleText}>
                {steps[currentStep].title}
              </Text>

              {renderFields()}

              <View style={styles.navigationContainer}>
                {currentStep > 0 && (
                  <TouchableOpacity
                    style={styles.navigationButton}
                    onPress={handlePrev}
                  >
                    <Text style={styles.navigationButtonText}>← Previous</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[
                    styles.navigationButton,
                    currentStep === 0 && styles.singleButton,
                  ]}
                  onPress={
                    currentStep === steps.length - 1 ? handleSubmit : handleNext
                  }
                >
                  <Text
                    style={[styles.navigationButtonText, styles.nextButtonText]}
                  >
                    {currentStep === steps.length - 1 ? 'Submit' : 'Next →'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalForm: {
    marginBottom: 23,
  },
  modalTitleText: {
    fontSize: 30,
    marginVertical: 23,
    textAlign: 'center',
    fontFamily: 'ProximaNova-Regular',
  },
  formFields: {
    marginBottom: 12,
  },
  modalFieldText: {
    fontSize: 16,
    marginBottom: 12,
    fontFamily: 'ProximaNova-Regular',
  },
  input: {
    height: 46,
    width: 270,
    marginBottom: 12,
    padding: 10,
    borderColor: '#E8E8E8',
    borderWidth: 1,
    borderRadius: 16,
  },
  inputError: {
    borderColor: '#FF4444',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 12,
  },
  passwordRequirements: {
    marginBottom: 6,
  },
  requirementText: {
    fontSize: 12,
    color: '#9C9A9A',
    marginBottom: 4,
  },
  requirementMet: {
    color: '#4CAF50',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  progressDot: {
    width: 36,
    height: 3,
    borderRadius: 16,
    backgroundColor: '#E8E8E8',
    marginHorizontal: 3,
  },
  progressDotActive: {
    backgroundColor: '#7E7D7D',
  },
  progressDotCompleted: {
    backgroundColor: '#4CAF50',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  navigationButton: {
    flex: 1,
  },
  navigationButtonText: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'ProximaNova-Regular',
  },
  nextButtonText: {
    textAlign: 'right',
  },
  singleButton: {
    flex: 1,
    alignItems: 'flex-end',
  },
  fieldsContainer: {
    width: '100%',
  },
  modalView: {
    width: 318,
    height: 658,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default SignUpWizard;
