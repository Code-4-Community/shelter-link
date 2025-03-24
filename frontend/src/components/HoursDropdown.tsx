import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import { DayOfWeek } from '../types';
import {
  bodyFont,
  darkMainColor,
  descriptionFontColor,
  mainColor,
} from '../../constants';
import { useFonts } from 'expo-font';

interface HoursDropdownProps {
  currentDay: DayOfWeek;
  currentHours: string;
  hoursData: Array<{ label: string; value: string }>;
}

export const HoursDropdown = ({
  currentHours,
  hoursData,
}: HoursDropdownProps) => {
  useFonts({
    'AvenirNext': require('../../assets/fonts/AvenirNextLTPro-Bold.otf'),
  });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setIsOpen(!isOpen)}
      >
        <View style={styles.hoursStatusContainer}>
          <Text
            style={[
              styles.currentHours,
              currentHours === 'Closed' && styles.closedText,
            ]}
          >
            {currentHours}
          </Text>
          <Text style={styles.redArrow}>▼</Text>
        </View>
      </TouchableOpacity>

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
                top: 150,
              },
            ]}
          >
            {hoursData.map((item, index) => (
              <View key={index} style={styles.dropdownItem}>
                <Text
                  style={[
                    styles.dropdownItemText,
                    item.label.includes('Closed') && styles.closedText,
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
let dynamicTabletSizes: Record<string, number> = {};
dynamicTabletSizes["dropdownHeaderMinWidth"] = 120;
dynamicTabletSizes["dropdownHeaderPaddingHorizontal"] = 12;
dynamicTabletSizes["dropdownHeaderPaddingRight"] = 50;
dynamicTabletSizes["currentHoursFontSize"] = 15;
dynamicTabletSizes["currentHoursMarginRight"] = 8;
dynamicTabletSizes["redArrowFontSize"] = 17;
dynamicTabletSizes["dropdownContainerMinWidth"] = 200;
dynamicTabletSizes["dropdownItemPadding"] = 12;
dynamicTabletSizes["dropdownItemFontSize"] = 15;

if (screenWidth > 500) {
  let widthRatio = screenWidth/500;
  for (const key in dynamicTabletSizes) {
    dynamicTabletSizes[key] = (dynamicTabletSizes[key]*widthRatio)
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  dropdownHeader: {
    height: screenHeight*0.053,
    minWidth: dynamicTabletSizes.dropdownHeaderMinWidth,
    paddingHorizontal: dynamicTabletSizes.dropdownHeaderPaddingHorizontal,
    paddingRight: dynamicTabletSizes.dropdownHeaderPaddingRight,
    justifyContent: 'center',
  },
  hoursStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentHours: {
    fontFamily: bodyFont,
    fontSize: dynamicTabletSizes.currentHoursFontSize,
    color: mainColor,
    marginRight: dynamicTabletSizes.currentHoursMarginRight,
  },
  closedText: {
    fontFamily: bodyFont,
    color: darkMainColor,
    fontWeight: '700',
  },
  redArrow: {
    color: darkMainColor,
    fontSize: dynamicTabletSizes.redArrowFontSize,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderColor: mainColor,
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
    color: descriptionFontColor,
  },
});
