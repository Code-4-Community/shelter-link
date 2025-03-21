import { mainColor } from 'frontend/constants';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
const CustomMarker = () => {
    const primaryColor = mainColor;
    const secondaryColor = '#FFFFFF'; // White

    return (
        <View style={styles.markerContainer}>
            {/* Pin with shelter symbol */}
            <Svg height="40" width="30" viewBox="0 0 30 40">
                {/* Main pin shape */}
                <Path
                    d="M15,0 C6.75,0 0,6.75 0,15 C0,25.5 15,40 15,40 C15,40 30,25.5 30,15 C30,6.75 23.25,0 15,0 Z"
                    fill={primaryColor}
                    stroke={secondaryColor}
                    strokeWidth="1.5"
                />

                {/* House/shelter icon */}
                <Path
                    d="M8,14 L22,14 L22,25 L8,25 Z"
                    fill={secondaryColor}
                />
                <Path
                    d="M7,14 L15,7 L23,14"
                    fill="none"
                    stroke={secondaryColor}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />

                {/* Door */}
                <Path
                    d="M13,25 L13,20 L17,20 L17,25"
                    fill="none"
                    stroke={primaryColor}
                    strokeWidth="1.5"
                />

                {/* Window */}
                <Circle
                    cx="15"
                    cy="16"
                    r="2"
                    fill={primaryColor}
                />
            </Svg>

            {/* Drop shadow for the marker */}
            <View style={styles.shadow} />
        </View>
    );
};

const styles = StyleSheet.create({
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 40,
        position: 'relative',
    },
    shadow: {
        position: 'absolute',
        bottom: -2,
        width: 20,
        height: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 10,
        zIndex: -1,
    },
});

export default CustomMarker;