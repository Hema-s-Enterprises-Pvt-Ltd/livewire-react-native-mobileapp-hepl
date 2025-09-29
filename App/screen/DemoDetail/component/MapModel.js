import React, {useState} from 'react';
import {View, Text, Button, StyleSheet,Image} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import { RFPercentage,RFValue } from 'react-native-responsive-fontsize';
import DetailItem from './DetailItem';
import Modal from 'react-native-modal';
import { Images, Languages } from '../../../common';

const MapModal = ({visible, onClose,clientName,address,longitude,latitude}) => {
  return (
    <Modal
      animationType="slide"
      isVisible={visible}
      swipeDirection={['down','left','right','up']}
      onSwipeComplete={onClose}
      propagateSwipe={true}
      onBackdropPress={onClose}
      >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{borderRadius: 10, width: '100%', height: '60%'}}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Marker
                coordinate={{
                  latitude: latitude,
                  longitude: longitude,
                }}
                title={clientName}
                description={Languages.You_are_here}
              />
            </MapView>
            <View
                style={{
                  backgroundColor: '#E6F2E6',
                  padding: 10,
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius:5
                }}>
                <Text style={styles.header}>{clientName}</Text>
              </View>
              <View style={styles.detailChildContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    height: 'auto',
                    flexWrap: 'wrap',
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}>
                  <View style={{width: '5%', alignItems: 'flex-start'}}>
                    <Image
                      source={Images.LocationGrey}
                      resizeMode="contain"
                      style={styles.locationImage}
                    />
                  </View>

                  <View
                    style={{
                      width: '90%',
                      flexDirection: 'row',
                      marginLeft: 10,
                    }}>
                    <View
                      style={{
                        flexDirection: 'column',
                        width: '100%',
                        height: 'auto',
                      }}>
                      <Text style={styles.addressText}>
                        {/* 12,Cavinville, Cenotaph Road,Rathna Nagar, Guindy,{' '}
                        Chennai-600018. */}
                        {address}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    backgroundColor: '#E6F2E680',
                    borderRadius: 5,
                    paddingLeft: 10,
                  }}>
                  <DetailItem
                    image={'Maticon-gps'}
                    title= {latitude+", "+longitude}
                    isheader={false}
                  />
                </View>
              </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  addressText:{
    fontSize: RFValue(12),
    fontWeight: '500',
    textAlign: 'left',
    color: '#666687'
  },
  locationImage:{
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight:5
  },
  detailChildContainer:{
    flexDirection: 'column',
    padding: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalView: {
    width: '90%',
    height: '50%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
   // justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '90%',
  },
  header: {
    fontSize: RFPercentage(2.0),
    fontWeight: 'bold',
    textAlign: 'left',
    //  marginTop: 10,
    paddingLeft:10,
    color: 'black',
  },
});

export default MapModal;
