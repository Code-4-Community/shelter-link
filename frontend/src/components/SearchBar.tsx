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
          }
        ]}
        placeholder="SEARCH"
        placeholderTextColor={mainColor} // Use mainColor for placeholder text
        onChangeText={(text) => setIsTyping(text.length > 0)}
      />

    </View>
  );
};

const { width: screenWidth } = Dimensions.get('window');
let searchBarHeight = 36;
let searchBarBorderWidth = 1;
let searchBarPaddingTop = 1;
let searchInputFontSize = 14; 
let searchInputLineHeight = 19.36;
let searchInputPaddingTop = 2;
if (screenWidth > 500) {
  searchBarHeight = searchBarHeight*(screenWidth/500);
  searchBarBorderWidth = searchBarBorderWidth*(screenWidth/500);
  searchBarPaddingTop = searchBarBorderWidth*(screenWidth/500);
  searchInputFontSize = searchInputFontSize*(screenWidth/500);
  searchInputLineHeight = searchInputLineHeight*(screenWidth/500);
  searchInputPaddingTop = searchInputPaddingTop*(screenWidth/500);
}

const styles = StyleSheet.create({
  searchBar: {
    width: '90%',
    height: searchBarHeight,
    borderRadius: 11,
    borderWidth: searchBarBorderWidth,
    paddingTop: searchBarPaddingTop,
    borderColor: mainColor,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    flex: 1,
    fontFamily: bodyFont,
    fontSize: searchInputFontSize,
    fontWeight: '500',
    color: mainColor,
    paddingLeft: 17,
    paddingRight: 17,
    paddingTop: 2,
    lineHeight: searchInputLineHeight,
    opacity: 0.6,
  },
});

export default SearchBar;
