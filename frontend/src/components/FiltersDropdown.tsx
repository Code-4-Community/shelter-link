import { useFonts } from 'expo-font';
import { bodyFont, darkMainColor } from '../../constants';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View, ScrollView } from 'react-native';
import { Modal, Text, Pressable } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';

const DropdownComponent = () => {
  useFonts({
    AvenirNext: require('../../assets/fonts/AvenirNextLTPro-Bold.otf'),
  });

  const [selected, setSelected] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [ratingFilter, setRatingFilter] = useState('Any');
  const [hoursFilter, setHoursFilter] = useState('Any');
  const [distanceFilter, setDistanceFilter] = useState('Any');
  const [additionalFilters, setAdditionalFilters] = useState<string[]>([]);

  const toggleAdditionalFilter = (filter: string) => {
    if (additionalFilters.includes(filter)) {
      setAdditionalFilters(additionalFilters.filter((item) => item !== filter));
    } else {
      setAdditionalFilters([...additionalFilters, filter]);
    }
  };

  const isFilterSelected = (category: string, value: string) => {
    switch (category) {
      case 'rating':
        return ratingFilter === value;
      case 'hours':
        return hoursFilter === value;
      case 'distance':
        return distanceFilter === value;
      case 'additional':
        return additionalFilters.includes(value);
      default:
        return false;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Filters</Text>
              </View>

              <ScrollView style={styles.scrollView}>
                {/* Rating Section */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterHeader}>Rating</Text>
                  <View style={styles.filterOptions}>
                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        isFilterSelected('rating', 'Any') &&
                          styles.selectedFilterButton,
                      ]}
                      onPress={() => setRatingFilter('Any')}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          isFilterSelected('rating', 'Any') &&
                            styles.selectedFilterButtonText,
                        ]}
                      >
                        Any
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        isFilterSelected('rating', '3.5+') &&
                          styles.selectedFilterButton,
                      ]}
                      onPress={() => setRatingFilter('3.5+')}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          isFilterSelected('rating', '3.5+') &&
                            styles.selectedFilterButtonText,
                        ]}
                      >
                        3.5+
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        isFilterSelected('rating', '4.0+') &&
                          styles.selectedFilterButton,
                      ]}
                      onPress={() => setRatingFilter('4.0+')}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          isFilterSelected('rating', '4.0+') &&
                            styles.selectedFilterButtonText,
                        ]}
                      >
                        4.0+
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        isFilterSelected('rating', '4.5+') &&
                          styles.selectedFilterButton,
                      ]}
                      onPress={() => setRatingFilter('4.5+')}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          isFilterSelected('rating', '4.5+') &&
                            styles.selectedFilterButtonText,
                        ]}
                      >
                        4.5+
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Hours Section */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterHeader}>Hours</Text>
                  <View style={styles.filterOptions}>
                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        isFilterSelected('hours', 'Any') &&
                          styles.selectedFilterButton,
                      ]}
                      onPress={() => setHoursFilter('Any')}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          isFilterSelected('hours', 'Any') &&
                            styles.selectedFilterButtonText,
                        ]}
                      >
                        Any
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        isFilterSelected('hours', 'Open now') &&
                          styles.selectedFilterButton,
                      ]}
                      onPress={() => setHoursFilter('Open now')}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          isFilterSelected('hours', 'Open now') &&
                            styles.selectedFilterButtonText,
                        ]}
                      >
                        Open now
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        isFilterSelected('hours', 'Custom') &&
                          styles.selectedFilterButton,
                      ]}
                      onPress={() => setHoursFilter('Custom')}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          isFilterSelected('hours', 'Custom') &&
                            styles.selectedFilterButtonText,
                        ]}
                      >
                        Custom
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Distance Section */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterHeader}>Distance</Text>
                  <View style={styles.filterOptions}>
                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        isFilterSelected('distance', 'Any') &&
                          styles.selectedFilterButton,
                      ]}
                      onPress={() => setDistanceFilter('Any')}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          isFilterSelected('distance', 'Any') &&
                            styles.selectedFilterButtonText,
                        ]}
                      >
                        Any
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        isFilterSelected('distance', '>5 mi') &&
                          styles.selectedFilterButton,
                      ]}
                      onPress={() => setDistanceFilter('>5 mi')}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          isFilterSelected('distance', '>5 mi') &&
                            styles.selectedFilterButtonText,
                        ]}
                      >
                        {'<5 mi'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        isFilterSelected('distance', '>15 mi') &&
                          styles.selectedFilterButton,
                      ]}
                      onPress={() => setDistanceFilter('>15 mi')}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          isFilterSelected('distance', '>15 mi') &&
                            styles.selectedFilterButtonText,
                        ]}
                      >
                        {'<15 mi'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.filterButton,
                        isFilterSelected('distance', '>30 mi') &&
                          styles.selectedFilterButton,
                      ]}
                      onPress={() => setDistanceFilter('>30 mi')}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          isFilterSelected('distance', '>30 mi') &&
                            styles.selectedFilterButtonText,
                        ]}
                      >
                        {'<30 mi'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* More Filters Section */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterHeader}>More filters</Text>
                  <View style={styles.additionalFiltersGrid}>
                    <TouchableOpacity
                      style={[
                        styles.additionalFilterButton,
                        isFilterSelected(
                          'additional',
                          'Wheelchair accessible'
                        ) && styles.selectedFilterButton,
                      ]}
                      onPress={() =>
                        toggleAdditionalFilter('Wheelchair accessible')
                      }
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          isFilterSelected(
                            'additional',
                            'Wheelchair accessible'
                          ) && styles.selectedFilterButtonText,
                        ]}
                      >
                        Wheelchair accessible
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.additionalFilterButton,
                        isFilterSelected(
                          'additional',
                          'Legal aids available'
                        ) && styles.selectedFilterButton,
                      ]}
                      onPress={() =>
                        toggleAdditionalFilter('Legal aids available')
                      }
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          isFilterSelected(
                            'additional',
                            'Legal aids available'
                          ) && styles.selectedFilterButtonText,
                        ]}
                      >
                        Legal aids available
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.additionalFilterButton,
                        isFilterSelected(
                          'additional',
                          'Free or financial support available'
                        ) && styles.selectedFilterButton,
                      ]}
                      onPress={() =>
                        toggleAdditionalFilter(
                          'Free or financial support available'
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          isFilterSelected(
                            'additional',
                            'Free or financial support available'
                          ) && styles.selectedFilterButtonText,
                        ]}
                      >
                        Free or financial support available
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.additionalFilterButton,
                        isFilterSelected('additional', 'Overnight stay') &&
                          styles.selectedFilterButton,
                      ]}
                      onPress={() => toggleAdditionalFilter('Overnight stay')}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          isFilterSelected('additional', 'Overnight stay') &&
                            styles.selectedFilterButtonText,
                        ]}
                      >
                        Overnight stay
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.additionalFilterButton,
                        isFilterSelected(
                          'additional',
                          'Specializes in Trans support'
                        ) && styles.selectedFilterButton,
                      ]}
                      onPress={() =>
                        toggleAdditionalFilter('Specializes in Trans support')
                      }
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          isFilterSelected(
                            'additional',
                            'Specializes in Trans support'
                          ) && styles.selectedFilterButtonText,
                        ]}
                      >
                        Specializes in Trans support
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.additionalFilterButton,
                        isFilterSelected('additional', 'LGBTQ+ focus') &&
                          styles.selectedFilterButton,
                      ]}
                      onPress={() => toggleAdditionalFilter('LGBTQ+ focus')}
                    >
                      <Text
                        style={[
                          styles.filterButtonText,
                          isFilterSelected('additional', 'LGBTQ+ focus') &&
                            styles.selectedFilterButtonText,
                        ]}
                      >
                        LGBTQ+ focus
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
        <Pressable
          style={[styles.button, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.selectedTextStyle}>Filters</Text>
        </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const { width: screenWidth } = Dimensions.get('window');
const dynamicTabletSizes: Record<string, number> = {};
dynamicTabletSizes['dropdownWidth'] = 87;
dynamicTabletSizes['dropdownHeight'] = 28;
dynamicTabletSizes['dropdownBorderWidth'] = 1;
dynamicTabletSizes['dropdownFontSize'] = 13;
dynamicTabletSizes['customIconWidth'] = 10;
dynamicTabletSizes['iconWidth'] = 20;

if (screenWidth > 500) {
  const widthRatio = screenWidth / 500;
  for (const key in dynamicTabletSizes) {
    dynamicTabletSizes[key] = dynamicTabletSizes[key] * widthRatio;
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '90%',
    maxWidth: 320,
    height: '80%',
    maxHeight: 600,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    position: 'relative',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: 'white',
    width: 130,
    height: 35,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 20,
    borderColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedTextStyle: {
    fontFamily: bodyFont,
    fontSize: dropdownFontSize,
    color: darkMainColor,
  },
  closeButton: {
    position: 'absolute',
    left: 15,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#BD2B34',
  },
  modalTitle: {
    fontSize: 96,
    fontWeight: '500',
    color: '#BD2B34',
    fontFamily: 'Jomhuria',
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  filterSection: {
    marginVertical: 10,
  },
  filterHeader: {
    fontSize: 20,
    fontWeight: '700',
    color: '#BD2B34',
    marginBottom: 10,
    fontFamily: 'Istok Web',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    backgroundColor: 'white',
    minWidth: 60,
    alignItems: 'center',
  },
  openFilterButton: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    backgroundColor: 'white',
    minWidth: 100, // Increase minimum width
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'visible',
  },
  selectedFilterButton: {
    backgroundColor: '#BD2B34',
    borderColor: '#BD2B34',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#BD2B34',
    fontFamily: 'Istok Web',
  },
  openButtonText: {
    fontSize: 16,
    fontWeight: 'bold', // Make it bolder
    color: '#BD2B34',
    fontFamily: 'Istok Web',
    textAlign: 'center', // Ensure it's centered
    width: '100%',
  },
  selectedFilterButtonText: {
    color: 'white',
  },
  additionalFiltersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  additionalFilterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    backgroundColor: 'white',
    minWidth: '48%',
    alignItems: 'center',
  },
});

export default DropdownComponent;
