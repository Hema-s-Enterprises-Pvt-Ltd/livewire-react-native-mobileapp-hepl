import React from 'react';
import {View} from 'react-native';
import MapView, {Marker} from 'react-native-maps';

const MapViewScreen = () => {
  return (
    <View>
      <MapView
        style={ {width: '100%',
            height: '100%',}}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324,
          }}
          title={'Marker Title'}
          description={'Marker Description'}
        />
      </MapView>
      <View
        style={{
          backgroundColor: '#E6F2E6',
          padding: 10,
          borderBottomLeftRadius: 5,
          borderBottomRightRadius: 5,
        }}>
       
      </View>
    </View>
  );
};
export default MapViewScreen;
