import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { bodyFont, mainColor } from '../../constants';

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

const styles = StyleSheet.create({
  searchBar: {
    width: 360,
    height: 36,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: mainColor,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    flex: 1,
    fontFamily: bodyFont,
    fontSize: 14,
    fontWeight: '500',
    color: mainColor,
    paddingLeft: 17,
    paddingRight: 17,
    paddingTop: 2,
    lineHeight: 19.36,
    opacity: 0.6,
  },
});

export default SearchBar;
