import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// If you have an AuthContext, import and use it here:
import { useAuth } from '../hooks/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app/App';


type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SignInScreen = () => {
    const navigation = useNavigation<AppNavigationProp>();
    const { login } = useAuth(); // Uncomment if using AuthContext

    const handleSignIn = () => {
        // If you have a login function, call it here:
        const testUser = { email: 'test@example.com', name: 'Test User' };
        login(testUser);

        Alert.alert('Sign In', 'You have signed in as a test user!');
    };

    const handleGoToSignUp = () => {
        navigation.navigate('Sign Up');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mocked Login Screen</Text>

            <Button title="Sign In (Test User)" onPress={handleSignIn} />

            <View style={{ marginTop: 20 }}>
                <Button title="Go to Sign Up" onPress={handleGoToSignUp} />
            </View>
        </View>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        marginBottom: 16,
        fontSize: 20,
    },
});
