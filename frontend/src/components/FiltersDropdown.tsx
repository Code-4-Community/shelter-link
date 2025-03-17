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
let dynamicTabletSizes: Record<string, number> = {};
dynamicTabletSizes["dropdownWidth"] = 87;
dynamicTabletSizes["dropdownHeight"] = 28;
dynamicTabletSizes["dropdownBorderWidth"] = 1;
dynamicTabletSizes["dropdownFontSize"] = 13;
dynamicTabletSizes["customIconWidth"] = 10;
dynamicTabletSizes["iconWidth"] = 20;

if (screenWidth > 500) {
  let widthRatio = screenWidth/500;
  for (const key in dynamicTabletSizes) {
    dynamicTabletSizes[key] = (dynamicTabletSizes[key]*widthRatio)
  }
}

const styles = StyleSheet.create({
  body: {
    fontFamily: bodyFont,
    fontWeight: '400',
  },
  dropdown: {
    width: dynamicTabletSizes.dropdownWidth,
    height: dynamicTabletSizes.dropdownHeight,
    paddingRight: 9,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: dynamicTabletSizes.dropdownBorderWidth,
    borderColor: darkMainColor,
  },
  placeholderStyle: {
    fontFamily: bodyFont,
    fontSize: dynamicTabletSizes.dropdownFontSize,
    color: darkMainColor,
    marginLeft: 16,
  },
  selectedTextStyle: {
    fontFamily: bodyFont,
    fontSize: dynamicTabletSizes.dropdownFontSize,
    color: darkMainColor,
  },
  inputSearchStyle: {
    fontFamily: bodyFont,
    fontSize: dynamicTabletSizes.dropdownFontSize,
    color: darkMainColor,
  },
  customIcon: {
    width: dynamicTabletSizes.customIconWidth,
    height: dynamicTabletSizes.customIconWidth/2,
  },
  iconStyle: {
    width: dynamicTabletSizes.iconWidth,
    height: dynamicTabletSizes.iconWidth,
    tintColor: darkMainColor
  },
});

export default DropdownComponent;
