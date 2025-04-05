import {
    Dimensions,
    Linking,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';
import React, { useRef, useState } from 'react';
import {
    headerFont,
    darkMainColor,
    bodyFont,
    mainColor,
    buttonBackgroundColor,
    descriptionFontColor,
    containerColor,
    gradientColor1,
    gradientColor2,
} from '../../constants';
import { Event } from '../types';
import { ImageGallery } from './ImageGallery';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

type RootStackParamList = {
    'Map View': undefined;
    'Detailed Event View': {
        event: Event;
    };
};

type Props = NativeStackScreenProps<
    RootStackParamList,
    'Detailed Event View'
>;

export const DetailedShelterView: React.FC<Props> = ({ route }) => {
    const { event } = route.params; // get shelter from route params

    useFonts({
        AvenirNext: require('../../assets/fonts/AvenirNextLTPro-Bold.otf'),
    });

    // Redirects based on address (no lat or long for events)
    const handleDirections = () => {
        if (event.location) {
            let url = `https://www.google.com/maps/dir/?api=1&destination=
            ${event.location.street.replace(' ', '+')},
            +${event.location.city.replace(' ', '+')},
            +${event.location.state}+${event.location.zipCode}`;
            if (event.location.country) {
                url += `,+${event.location.country.replace(' ', '+')}`
            }
            Linking.openURL(url);
        }
    };

    // website will pop up if there is one
    const handleWebsite = () => {
        if (event.website) {
            Linking.openURL(event.website);
        }
    };

    // for now, this gives the option to confirm if you want to call the shelter number
    // figure out how number/email maybe should be displayed?
    const handleContact = () => {
        Linking.openURL(`tel:${event.phone_number}`);
    };

    return (
        <LinearGradient
            colors={[gradientColor1, gradientColor2]}
            style={styles.gradientBackground}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
                    <View style={styles.shelterNameContainer}>
                        <View style={styles.quickInfoContainer}>
                            <Text style={styles.shelterExpandedNameText}>
                                {event.event_name}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.buttonsContainer}>
                    {event.location && 
                        <TouchableOpacity
                            style={[styles.button, event.website && styles.smallButton]}
                            onPress={handleDirections}
                        >
                            <Text style={styles.buttonText}>Directions</Text>
                        </TouchableOpacity>}

                        {event.website && (
                            <TouchableOpacity
                                style={styles.websiteButton}
                                onPress={handleWebsite}
                            >
                                <Text style={styles.buttonText}>Website</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.button, event.website && styles.smallButton]}
                            onPress={handleContact}
                        >
                            <Text style={styles.buttonText}>Contact</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bottomContainer}>
                        {event.picture &&
                            <View style={styles.imagesContainer}>
                                <ImageGallery images={event.picture} />
                            </View>
                        }
                        <View style={styles.shelterDescriptionContainer}>
                            <Text style={styles.shelterDescriptionHeader}>
                                About {event.event_name}
                            </Text>
                            <Text style={styles.shelterDescriptionText}>
                                {event.description}
                            </Text>
                        </View>

                        <View style={styles.shelterTagMainContainer}>
                            <Text style={styles.shelterDescriptionHeader}>
                                Features and Resources
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
let dynamicTabletSizes: Record<string, number> = {};
dynamicTabletSizes['shelterNameTextSize'] = 45;
dynamicTabletSizes['shelterNameTextHeight'] = 50;
dynamicTabletSizes['quickInfoFontSize'] = 18;
dynamicTabletSizes['quickInfoLineHeight'] = 21.59;
dynamicTabletSizes['buttonFontSize'] = 15;
dynamicTabletSizes['buttonLineHeight'] = 15.73;
dynamicTabletSizes['shelterDescriptionFontSize'] = 15;
dynamicTabletSizes['shelterDescriptionLineHeight'] = 21.59;
dynamicTabletSizes['dayTextFontSize'] = 15;
dynamicTabletSizes['dayTextLineHeight'] = 21.59;
dynamicTabletSizes['arrowFontSize'] = 18;
dynamicTabletSizes['hoursTextFontSize'] = 15;
dynamicTabletSizes['hoursTextLineHeight'] = 21.59;
dynamicTabletSizes['quickInfoTextPaddingBottom'] = 4;
dynamicTabletSizes['fullReviewMarginTop'] = 40;
dynamicTabletSizes['fullReviewMarginLeft'] = 13;
dynamicTabletSizes['fullReviewWidth'] = 330;

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
    shelterNameContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
        alignSelf: 'center',
    },
    shelterNameText: {
        fontFamily: headerFont,
        fontSize: 36,
        paddingTop: 5,
        color: darkMainColor,
        alignSelf: 'center',
        textAlign: 'center', // Ensures text is centered when it wraps
    },
    shelterExpandedNameText: {
        fontFamily: bodyFont,
        fontWeight: '700',
        fontSize: dynamicTabletSizes.shelterNameTextSize * 0.4,
        color: descriptionFontColor,
        paddingBottom: '5%',
        textAlign: 'center', // Ensures text is centered when it wraps
    },
    shelterDescriptionContainer: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingHorizontal: '5%',
        borderWidth: 1,
        borderColor: darkMainColor,
        borderRadius: 10,
        backgroundColor: containerColor,
        paddingVertical: 10,
        marginBottom: 20,
        width: '95%',
    },
    shelterTagMainContainer: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
        borderWidth: 1,
        borderColor: darkMainColor,
        borderRadius: 10,
        backgroundColor: containerColor,
        width: '95%',
    },
    shelterDescriptionHeader: {
        width: 340,
        fontSize: 22,
        fontFamily: bodyFont,
        fontWeight: '700',
        color: darkMainColor,
        textAlign: 'center',
        paddingBottom: 10,
    },
    shelterDescriptionText: {
        width: 340,
        fontSize: 18,
        fontFamily: bodyFont,
        color: descriptionFontColor,
        textAlign: 'left',
    },
    quickInfoContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        marginLeft: 4,
        marginRight: 4,
        marginBottom: 3,
    },
    quickInfoText: {
        fontFamily: bodyFont,
        color: descriptionFontColor,
        fontSize: dynamicTabletSizes.quickInfoFontSize,
        fontWeight: '400',
    },
    smallButton: {
        width: screenWidth / 5,
        marginLeft: screenWidth / 75,
        marginRight: screenWidth / 75,
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 24,
        paddingBottom: 20,
        borderBottomWidth: 3,
        borderBottomColor: darkMainColor,
    },
    button: {
        width: screenWidth / 4,
        height: screenHeight * 0.04,
        borderRadius: 4,
        borderWidth: 1,
        marginLeft: screenWidth / 32,
        marginRight: screenWidth / 32,
        borderColor: darkMainColor,
        backgroundColor: buttonBackgroundColor,
        fontFamily: bodyFont,
        alignItems: 'center',
        justifyContent: 'center',
    },
    websiteButton: {
        width: screenWidth / 5,
        height: screenHeight * 0.04,
        borderRadius: 4,
        borderWidth: 1,
        marginLeft: screenWidth / 75,
        marginRight: screenWidth / 75,
        borderColor: darkMainColor,
        backgroundColor: buttonBackgroundColor,
        fontFamily: bodyFont,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: dynamicTabletSizes.buttonFontSize,
        fontFamily: bodyFont,
        fontWeight: '400',
        color: darkMainColor,
        textAlign: 'center',
    },
    bottomContainer: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 15,
    },
    imagesContainer: {
        paddingTop: screenHeight / 28,
        paddingBottom: screenHeight / 28,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '100%',
    },
    shelterImage: {
        borderRadius: 10,
        borderWidth: 3,
        marginRight: 22,
        borderColor: darkMainColor,
        backgroundColor: '#D9D9D9',
    },
    shelterDescription: {
        marginLeft: screenWidth / 32,
        marginRight: screenWidth / 32,
        marginTop: 19,
        fontSize: dynamicTabletSizes.shelterDescriptionFontSize,
        fontFamily: bodyFont,
        fontWeight: '400',
        lineHeight: dynamicTabletSizes.shelterDescriptionLineHeight,
        color: descriptionFontColor,
    },
    shelterTagContainer: {
        borderWidth: 1,
        borderColor: descriptionFontColor,
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 10,
        margin: 5,
    },
    shelterTags: {
        fontSize: dynamicTabletSizes.shelterDescriptionFontSize,
        fontFamily: bodyFont,
        fontWeight: '700',
        color: descriptionFontColor,
    },
    fullReview: {
        marginTop: dynamicTabletSizes.fullReviewMarginTop,
        marginLeft: dynamicTabletSizes.fullReviewMarginLeft,
        width: dynamicTabletSizes.fullReviewWidth,
        height: screenHeight * (2 / 5),
    },
    fullReviewTitleContainer: {
        width: '100%',
        height: 40,
    },
    fullReviewTitle: {
        fontSize: 64,
        fontFamily: headerFont,
        fontWeight: '400',
        lineHeight: 64,
        color: darkMainColor,
    },
    hoursRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    allHoursContainer: {
        backgroundColor: '#000000',
        borderRadius: 20,
        padding: 8,
        marginTop: 4,
    },
    closedText: {
        fontFamily: bodyFont,
        color: darkMainColor,
        fontWeight: 700,
    },
    dayText: {
        fontFamily: bodyFont,
        fontSize: dynamicTabletSizes.dayTextFontSize,
        fontWeight: '700',
        color: descriptionFontColor,
        marginRight: 14,
        lineHeight: dynamicTabletSizes.dayTextLineHeight,
    },
    hoursText: {
        fontFamily: bodyFont,
        fontWeight: '700',
        fontSize: dynamicTabletSizes.hoursTextFontSize,
        color: mainColor,
        lineHeight: dynamicTabletSizes.hoursTextLineHeight,
    },
    hoursStatusContainer: {
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
    },
    hoursDropdown: {
        height: 36,
        minWidth: 120,
        paddingHorizontal: 12,
        paddingRight: 50,
    },
    arrow: {
        color: darkMainColor,
        fontSize: dynamicTabletSizes.arrowFontSize,
        marginLeft: 4,
    },
    placeholderStyle: {
        fontFamily: bodyFont,
        fontSize: 15,
        color: darkMainColor,
    },
    dropdownContainer: {
        backgroundColor: 'white',
        borderColor: '#007AFF',
        borderWidth: 1,
        marginTop: 4,
    },
});

export default DetailedShelterView;