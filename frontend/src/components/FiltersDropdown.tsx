import { useFonts } from 'expo-font';
import { bodyFont, darkMainColor } from '../../constants';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';

const data = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
];

// created a multi-select component for filters
// need to add some sort of indication of what is currently selected in dropdown list
const DropdownComponent = () => {
  useFonts({
    'AvenirNext': require('../../assets/fonts/AvenirNextLTPro-Regular.otf'),
  });

  const [selected, setSelected] = useState([]);

  return (
    <View>
      <MultiSelect
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        search
        data={data}
        labelField="label"
        valueField="value"
        placeholder="Filters"
        searchPlaceholder="SEARCH"
        value={selected}
        onChange={(item) => {
          // @ts-expect-error
          setSelected(item);
        }}
      />
    </View>
  );
};
const { width: screenWidth } = Dimensions.get('window');
let dropdownWidth = 87;
let dropdownHeight = 28;
let dropdownBorderWidth = 1;
let dropdownFontSize = 13;
let customIconWidth = 10;
let iconWidth = 20;
if (screenWidth > 500) {
  dropdownWidth = dropdownWidth * (screenWidth / 500);
  dropdownHeight = dropdownHeight * (screenWidth / 500);
  dropdownBorderWidth = dropdownBorderWidth * (screenWidth / 500);
  dropdownFontSize = dropdownFontSize * (screenWidth / 500);
  customIconWidth = customIconWidth * (screenWidth / 500);
  iconWidth = iconWidth * (screenWidth / 500);
}

const styles = StyleSheet.create({
  body: {
    fontFamily: bodyFont,
    fontWeight: '400',
  },
  dropdown: {
    width: dropdownWidth,
    height: dropdownHeight,
    paddingRight: 9,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: dropdownBorderWidth,
    borderColor: darkMainColor,
  },
  placeholderStyle: {
    fontFamily: bodyFont,
    fontSize: dropdownFontSize,
    color: darkMainColor,
    marginLeft: 16,
  },
  selectedTextStyle: {
    fontFamily: bodyFont,
    fontSize: dropdownFontSize,
    color: darkMainColor,
  },
  inputSearchStyle: {
    fontFamily: bodyFont,
    fontSize: dropdownFontSize,
    color: darkMainColor,
  },
  customIcon: {
    width: customIconWidth,
    height: customIconWidth / 2,
  },
  iconStyle: {
    width: iconWidth,
    height: iconWidth,
    tintColor: darkMainColor
  },
});

export default DropdownComponent;
