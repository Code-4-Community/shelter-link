import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { DayOfWeek } from '../types';
import {
  bodyFont,
  darkMainColor,
  descriptionFontColor,
  mainColor,
} from '../../constants';
import { useFonts } from 'expo-font';

interface HoursDropdownProps {
  hoursData: Array<{ label: string; value: string }>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  dropdownPosition: number;
  currentDay: DayOfWeek;
}

export const HoursDropdown = ({
  hoursData,
  isOpen,
  setIsOpen,
  dropdownPosition,
  currentDay,
}: HoursDropdownProps) => {
  useFonts({
    AvenirNext: require('../../assets/fonts/AvenirNextLTPro-Bold.otf'),
  });

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="none"
      onRequestClose={() => setIsOpen(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setIsOpen(false)}
      >
        <View
          style={[
            styles.dropdownContainer,
            {
              position: 'absolute',
              top: dropdownPosition + 38,
              left: 25,
            },
          ]}
        >
          {hoursData.map((item, index) => (
            <View
              key={index}
              style={[
                styles.dropdownItem,
                item.value === currentDay && styles.currentDay,
              ]}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  item.value === currentDay && styles.boldText,
                ]}
              >
                {item.label}
              </Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
let dynamicTabletSizes: Record<string, number> = {};
dynamicTabletSizes['dropdownHeaderMinWidth'] = 120;
dynamicTabletSizes['dropdownHeaderPaddingHorizontal'] = 12;
dynamicTabletSizes['dropdownHeaderPaddingRight'] = 50;
dynamicTabletSizes['currentHoursFontSize'] = 15;
dynamicTabletSizes['currentHoursMarginRight'] = 8;
dynamicTabletSizes['dropdownContainerMinWidth'] = 200;
dynamicTabletSizes['dropdownItemPadding'] = 12;
dynamicTabletSizes['dropdownItemFontSize'] = 15;

if (screenWidth > 500) {
  let widthRatio = screenWidth / 500;
  for (const key in dynamicTabletSizes) {
    dynamicTabletSizes[key] = dynamicTabletSizes[key] * widthRatio;
  }
}

const styles = StyleSheet.create({
  dropdownHeader: {
    height: screenHeight * 0.053,
    minWidth: dynamicTabletSizes.dropdownHeaderMinWidth,
    paddingHorizontal: dynamicTabletSizes.dropdownHeaderPaddingHorizontal,
    paddingRight: dynamicTabletSizes.dropdownHeaderPaddingRight,
    justifyContent: 'center',
  },
  hoursStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentDay: {
    backgroundColor: mainColor,
  },
  boldText: {
    fontFamily: bodyFont,
    color: darkMainColor,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderColor: darkMainColor,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 5,
    minWidth: dynamicTabletSizes.dropdownContainerMinWidth,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    padding: dynamicTabletSizes.dropdownItemPadding,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  dropdownItemText: {
    fontFamily: bodyFont,
    fontSize: dynamicTabletSizes.dropdownItemFontSize,
    color: darkMainColor,
  },
});
