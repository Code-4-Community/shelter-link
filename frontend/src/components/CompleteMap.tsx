import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View, Text } from 'react-native';
import Fuse from 'fuse.js';
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

export const CompleteMap = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['15%', '60%', '90%'], []);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [query, setQuery] = useState('');

  useFonts({
    IstokWebRegular: require('../../assets/fonts/IstokWebRegular.ttf'),
    JomhuriaRegular: require('../../assets/fonts/JomhuriaRegular.ttf'),
  });

  const fetchShelters = async () => {
    try {
      const data = await getShelters(); // Use mapService to fetch shelters
      setShelters(data);
    } catch (error) {
      console.error('Error fetching shelters:', error);
    } finally {
    }
  };

  useEffect(() => {
    fetchShelters();
  }, [query]);

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

  const filteredShelters = useMemo(() => {
    if (query === '') {
      return shelters;
    } else {
      const fuseOptions = {
        findAllMatches: true,
        keys: [
          'name',
          'address.street',
          'address.city',
          'address.state',
          'address.zip',
        ],
      };

      const fuse = new Fuse(shelters, fuseOptions);
      const searchResults = fuse.search(query);

      return searchResults.map((result) => result.item);
    }
  }, [query, shelters]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.searchBarContainer}>
        <SearchBar onSearch={setQuery} />
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
        ) : filteredShelters.length > 0 ? (
          <BottomSheetFlatList
            data={filteredShelters}
            keyExtractor={(item) =>
              `${item.name}-${item.address.street}`.replace(/\s+/g, '')
            } // creating a unique id
            renderItem={renderItem}
          />
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No results found</Text>
          </View>
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
  searchBarContainer: {
    alignItems: 'center',
    paddingBottom: '6%',
    paddingTop: '10%',
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
  noResultsContainer: {
    flex: 1,
    paddingTop: '20%',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 20,
    color: darkMainColor,
  },
});

export default CompleteMap;
