import { bodyFont, darkMainColor } from '../../constants';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import {Modal, Text, Pressable} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';

const data = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
  { label: 'Item 4', value: '4' },
];


// created a multi-select component for filters
// need to add some sort of indication of what is currently selected in dropdown list
const DropdownComponent = () => {
  const [modalVisible, setModalVisible] = useState(false);
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
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {

            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Filters</Text>
                    <Text style={styles.headerDescription}>Rating</Text>
              </View>
              <View style={styles.buttonsContainer}>
                      <TouchableOpacity style={styles.directionsButton}>
                        <Text style={styles.buttonText}>Any</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.websiteButton}>
                        {/* no website field in shelter.entity.ts so no behavior yet */}
                        <Text style={styles.buttonText}>3.5+</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.contactButton}>
                        <Text style={styles.buttonText}>4.0+</Text>
                      </TouchableOpacity>
                    </View>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.selectedTextStyle}>Show Modal</Text>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainHeading: {

  },
  modalView: {
    width: '60%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  placeholderStyle: {
    fontFamily: bodyFont,
    fontSize: dynamicTabletSizes.dropdownFontSize,
    color: darkMainColor,
    marginLeft: 16,
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    verticalAlign: 'top',
    fontFamily: 'Jomhuria',
    width: 146,
    height: 78,
    top: 10,
    color: '#BD2B34',
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
  headerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  headerText: {
    fontFamily: 'Inter',
    fontSize: 36,
    fontWeight: '400',
    lineHeight: 43.57,
    textAlign: 'center',
    color: '#1E1E1E',
    marginBottom: 9,
  },
  headerDescription: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 18.15,
    textAlign: 'center',
    color: '#1E1E1E',
  },
  buttonsContainer: {
    marginTop: 4,
    alignContent: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 35.61,
  },
  directionsButton: {
    width: 156,
    height: 42,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  websiteButton: {
    width: 156,
    height: 42,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  contactButton: {
    width: 156,
    height: 42,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  buttonText: {
    fontSize: 13,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 15.73,
    color: '#1E1E1E',
  },
});

export default DropdownComponent;
