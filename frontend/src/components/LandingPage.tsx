import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app/App';
import {
    darkMainColor,
    gradientColor1,
    gradientColor2,
    headerFont,
    bodyFont,
    containerColor,
    header1FontSize,
    bodyFontSize,
    caption1FontSize,
} from '../../constants';

type LandingPageNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LandingPage = () => {
    const navigation = useNavigation<LandingPageNavigationProp>();
    const fadeAnim = new Animated.Value(0);
    const slideAnim = new Animated.Value(50);
    const buttonAnim = new Animated.Value(0);

    useEffect(() => {
        // Fade in main content
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        // Slide up main content
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
        }).start();

        // Fade in buttons with delay
        Animated.timing(buttonAnim, {
            toValue: 1,
            duration: 800,
            delay: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <LinearGradient
            colors={[gradientColor1, gradientColor2]}
            style={styles.container}
        >
            <View style={styles.topSection}>
                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={styles.iconBubble}>
                        <Ionicons name="home" size={40} color={darkMainColor} />
                    </View>
                    <Text style={styles.title}>ShelterLink</Text>
                    <Text style={styles.subtitle}>
                        Connecting LGBTQ+ individuals with safe shelters throughout Boston
                    </Text>
                </Animated.View>
            </View>

            <Animated.View
                style={[
                    styles.buttonsContainer,
                    {
                        opacity: buttonAnim,
                    },
                ]}
            >
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('Sign Up')}
                >
                    <Text style={styles.primaryButtonText}>Create Account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('Log In')}
                >
                    <Text style={styles.secondaryButtonText}>Log In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tertiaryButton}
                    onPress={() => navigation.navigate('Main')}
                >
                    <Text style={styles.tertiaryButtonText}>Continue as Guest</Text>
                </TouchableOpacity>
            </Animated.View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    topSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconBubble: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: containerColor,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    title: {
        fontFamily: headerFont,
        fontSize: header1FontSize,
        color: darkMainColor,
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: bodyFont,
        fontSize: bodyFontSize,
        color: '#333',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: '90%',
    },
    buttonsContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    primaryButton: {
        backgroundColor: darkMainColor,
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    primaryButtonText: {
        fontFamily: headerFont,
        fontSize: bodyFontSize,
        color: '#fff',
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    secondaryButtonText: {
        fontFamily: headerFont,
        fontSize: bodyFontSize,
        color: darkMainColor,
        fontWeight: '600',
    },
    tertiaryButton: {
        paddingVertical: 8,
    },
    tertiaryButtonText: {
        fontFamily: bodyFont,
        fontSize: caption1FontSize,
        color: darkMainColor,
        fontWeight: '500',
    },
});

export default LandingPage;