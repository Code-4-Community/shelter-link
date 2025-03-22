import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Dimensions } from 'react-native';
import { bodyFont, mainColor } from '../../constants'

const SearchBar = () => {
  const [isTyping, setIsTyping] = useState(false);

  return (
    <View style={styles.searchBar}>
      <TextInput
        style={[
          styles.searchInput,
          {
            opacity: isTyping ? 1 : 0.6,
            color: mainColor,
          },
        ]}
        placeholder="SEARCH"
        placeholderTextColor={mainColor} // Use mainColor for placeholder text
        onChangeText={(text) => setIsTyping(text.length > 0)}
      />
    </View>
  );
};

const { width: screenWidth } = Dimensions.get('window');
let dynamicTabletSizes: Record<string, number> = {};
dynamicTabletSizes["searchBarHeight"] = 36;
dynamicTabletSizes["searchBarBorderWidth"] = 1;
dynamicTabletSizes["searchBarPaddingTop"] = 1;
dynamicTabletSizes["searchInputFontSize"] = 14;
dynamicTabletSizes["searchInputLineHeight"] = 19.36;
dynamicTabletSizes["searchInputPaddingTop"] = 2;

if (screenWidth > 500) {
  let widthRatio = screenWidth/500;
  for (const key in dynamicTabletSizes) {
    dynamicTabletSizes[key] = (dynamicTabletSizes[key]*widthRatio)
  }
}

const styles = StyleSheet.create({
  searchBar: {
    width: '90%',
    height: dynamicTabletSizes.searchBarHeight,
    borderRadius: 11,
    borderWidth: dynamicTabletSizes.searchBarBorderWidth,
    paddingTop: dynamicTabletSizes.searchBarPaddingTop,
    borderColor: mainColor,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    flex: 1,
    fontFamily: bodyFont,
    fontSize: dynamicTabletSizes.searchInputFontSize,
    fontWeight: '500',
    color: mainColor,
    paddingLeft: 17,
    paddingRight: 17,
    paddingTop: 2,
    lineHeight: dynamicTabletSizes.searchInputLineHeight,
    opacity: 0.6,
  },
});

export default SearchBar;
