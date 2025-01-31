import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CompleteMap } from '../components/CompleteMap';
import { DetailedShelterView } from '../components/DetailedShelterView';
import { ExampleShelters } from '../sheltersTest';

export const App = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/*<View style={styles.logoContainer}>*/}
      {/*  <Logo />*/}
      {/*</View>*/}
      {/*<View style={styles.centeredView}>*/}
      {/*  <SignUpModal />*/}
      {/*</View>*/}
      {/*<GestureHandlerRootView style={{ flex: 1 }}>*/}
      {/*  <CompleteMap />*/}
      {/*</GestureHandlerRootView>*/}

      <DetailedShelterView shelter={ExampleShelters[0]} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  searchBarContainer: {
    marginVertical: 10,
  },
  headerContainer: {
    marginTop: 20,
  },
  filtersDropdownContainer: {
    marginVertical: 10,
  },
});

export default App;
