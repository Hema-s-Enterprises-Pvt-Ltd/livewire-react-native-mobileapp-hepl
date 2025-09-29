import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { Constants, Languages } from '../../common';
import CustomAppBar from '../../component/CustomAppBar';
import GlobalStyles from "../../core/GlobalStyles";

const ASPECT_RATIO = Constants.width / Constants.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const DemoMapViewScreen = (props) => {
  const { latitude = 0, longitude = 0, clientName = 'Unknown Location' } = props.route.params || {};
  return (
    <SafeAreaView style={styles.viewContainer}>
      <View style={styles.container}>
        <View style={{marginTop: 10}}/>
          <CustomAppBar title={'Location details'} showImage={true} navigation={props.navigation} />
          <MapView
              style={styles.map}
              //provider={PROVIDER_GOOGLE}
              initialRegion={{
                  latitude,
                  longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
              }}>
              <Marker
                  coordinate={{ latitude, longitude }}
                  title={clientName}
                  description={Languages.You_are_here}
              />
          </MapView>
          <View style={styles.infoContainer}>
              {/* You can add any additional UI elements here */}
          </View>
      </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  viewContainer: {
    backgroundColor: GlobalStyles.colorSet.app_bg,
    flexGrow: 1,
  },
  map: {
      width: '100%',
      height: '100%',
      marginTop: 10,
  },
  infoContainer: {
      backgroundColor: '#E6F2E6',
      padding: 10,
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
  },
});

export default DemoMapViewScreen;
