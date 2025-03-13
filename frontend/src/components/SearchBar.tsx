import React, { useState } from 'react';
import { Image, TextInput, StyleSheet, View, Dimensions } from 'react-native';
import { bodyFont, darkMainColor, mainColor } from '../../constants'
import { useFonts } from 'expo-font';

const SearchBar = () => {
  useFonts({
    'AvenirNext': require('../../assets/fonts/AvenirNextLTPro-Bold.otf'),
  });

  const [isTyping, setIsTyping] = useState(false);

  return (
    <View style={styles.searchBar}>
      <Image
        style={styles.searchIcon}
        source={require('../../assets/searchIcon.png')}
      />
      <TextInput
        style={[
          styles.searchInput,
          {
            color: mainColor,
          },
        ]}
        placeholder="Search"
        placeholderTextColor={darkMainColor} // Use mainColor for placeholder text
        onChangeText={(text) => setIsTyping(text.length > 0)}
      />
    </View>
  );
};

const { width: screenWidth } = Dimensions.get('window');
let searchBarHeight = 28;
let searchBarBorderWidth = 1;
let searchBarPaddingTop = 1;
let searchInputFontSize = 13
let searchInputPaddingTop = 2;
if (screenWidth > 500) {
  searchBarHeight = searchBarHeight * (screenWidth / 500);
  searchBarBorderWidth = searchBarBorderWidth * (screenWidth / 500);
  searchBarPaddingTop = searchBarBorderWidth * (screenWidth / 500);
  searchInputFontSize = searchInputFontSize * (screenWidth / 500);
  searchInputPaddingTop = searchInputPaddingTop * (screenWidth / 500);
}

const styles = StyleSheet.create({
  searchIcon: {
    marginTop: 'auto',
    marginBottom: 'auto',
    width: 11,
    height: 11,
    tintColor: darkMainColor,
    marginLeft: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignContent: 'center',
    marginLeft: '2%',
    width: '70%',
    height: searchBarHeight,
    borderRadius: 6,
    borderWidth: searchBarBorderWidth,
    paddingTop: searchBarPaddingTop,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    flex: 1,
    fontFamily: bodyFont,
    fontSize: searchInputFontSize,
    color: darkMainColor,
    paddingLeft: 9,
    paddingRight: 17,
  },
});

export default SearchBar;
