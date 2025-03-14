
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';
//import Logo from '../components/Logo'; ToRecoverIcon: uncomment this line
import Map from '../components/Map';
import FiltersDropdown from '../components/FiltersDropdown';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import ShelterInfoPanel from '../components/ShelterInfoPanel';
import { Shelter } from '../types';
import { darkMainColor } from '../../constants';
import getShelters from '../services/mapService';
import { useFonts } from 'expo-font';


/*If you desire to put the icon back search "ToRecoverIcon" in this document and follow the instructions*/
export const CompleteMap = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['15%', '60%', '90%'], []);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [fonts] = useFonts({
    'IstokWebRegular': require('../../assets/fonts/IstokWebRegular.ttf'),
    'JomhuriaRegular': require('../../assets/fonts/JomhuriaRegular.ttf')
  });

  const fetchShelters = async () => {
    try {
      const data = await getShelters(); // Use mapService to fetch shelters
      setShelters(data);
    } catch (error) {
      console.error('Error fetching shelters:', error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, []);

  const handleMarkerPress = useCallback((shelter: Shelter) => {
    setSelectedShelter(shelter);
    sheetRef.current?.snapToIndex(1);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Shelter }) => (
      <ShelterInfoPanel shelter={item} style={styles.itemContainer} />
    ),
    []
  );

  /*Note: The logo may be brought back later replaced with c4c or something, 
  but I (sam) am removing it for now since it's not in the figma 
  ToRecoverIcon: as the first child of SafeAreaView component, add:
  <View style={styles.logoContainer}>
    <Logo />
  <View> */
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <View style={styles.headerContainer}>
        <Header />
      </View>
      <View style={styles.filtersDropdownContainer}>
        <FiltersDropdown />
      </View>
      <Map onMarkerPress={handleMarkerPress} />
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        style={styles.bottomSheet}
      >
        {selectedShelter ? (
          <ShelterInfoPanel
            shelter={selectedShelter}
            style={styles.itemContainer}
          />
        ) : (
          <BottomSheetFlatList
            data={shelters}
            keyExtractor={(item) =>
              `${item.name}-${item.address.street}`.replace(/\s+/g, '')
            } // creating a unique id
            renderItem={renderItem}
          />
        )}
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E2E2F0',
  },
  container: {
    flex: 1,
  },
  
  itemContainer: {
    marginTop: 29,
  },
  /* logoContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 11,
    paddingBottom: 18,
  },*/
  searchBarContainer: {
    alignItems: 'center',
    paddingBottom: '6%',
    paddingTop: '10%', //ToRecoverIcon: Remove this line if you want the icon back
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: '10%',
    paddingBottom: '7%',
    paddingTop: '3%',
  },
  filtersDropdownContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: '3%',
    paddingBottom: '3%',
    borderStyle: 'solid',
    borderBottomWidth: 4,
    borderColor: darkMainColor,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  bottomSheet: {
    borderTopLeftRadius: 33,
    borderTopRightRadius: 33,
    alignItems: 'center',
    backgroundColor: '#FFFFF',
    paddingBottom: 500,
  },
});

export default CompleteMap;
