import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  ActivityIndicator,
  Platform
} from 'react-native';
import {styles} from './ActionStyles';
import GlobalStyles from '../../core/GlobalStyles';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Anticon from 'react-native-vector-icons/AntDesign';
import { RFValue } from 'react-native-responsive-fontsize';
import { Images, Languages } from '../../common';
import { getAddressFromLatLng } from '../../networkClient/apifunction';
import Octicons from 'react-native-vector-icons/Octicons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import crashlytics from '@react-native-firebase/crashlytics';

const StepOneScreen = ({onHeaderClicked,name,Address,client}) => {
  const [location, setLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('StepOneScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('StepOneScreen unmounted');
    };
  }, []);

  useEffect(()=>{
    Geolocation.setRNConfiguration({
      authorizationLevel: "whenInUse", // Request "always" location permission
      skipPermissionRequests: false, // Prompt for permission if not granted
    });
    requestLocationPermission();
  },[])

  const requestPermission = () => {
    if(Platform.OS == 'ios'){
           Geolocation.requestAuthorization(()=>{
        getLocation();
      })
    } else {
      requestLocationPermission();
    }
  }

  const requestLocationPermission = async () => {
    if(Platform.OS == 'ios'){
    getLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: Languages.GeolocationPermission,
            message: Languages.AccessLocation,
            buttonNeutral: Languages.AskMeLater,
            buttonNegative: Languages.Cancel,
            buttonPositive: Languages.Ok,
          },
        );
        if (granted === Languages.Granted) {
          getLocation();
        } else {
          setError(Languages.PermissionDenied);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        setIsLoading(false);
        return;
      }
    }
  };
  const fetchAddress = async (position) => {
    const result = await getAddressFromLatLng( position?.coords.latitude,  position?.coords.longitude);
    Address(result)
    setAddress(result);
  };
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation(position);
        fetchAddress(position)
        setIsLoading(false);
      },
      error => {
        // See error code charts below.
        setLocation(false);
        setIsLoading(false);
        switch (error.code) {
          case 1:
            requestPermission()
            break;
          case 2:
            console.error('Position unavailable');
            break;
          case 3:
            getLocation()
            break;
          default:
            console.error('Unknown error');
        }
      },
      {enableHighAccuracy: false, timeout: 1500000, maximumAge: 100000},
    );
  }
  if (isLoading) {
    return (
      <View style={{justifyContent:'center',alignItems:'center',height:500}}>
        <ActivityIndicator size="large" color={GlobalStyles.colorSet.orange} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
        <Button title="Retry" onPress={() => {
          setIsLoading(true);
          requestLocationPermission();
        }} />
      </View>
    );
  }
  return (
    <View style={{height: 600}}>
      <TouchableOpacity
        style={styles.parentContainer}
        onPress={onHeaderClicked}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 5,
            paddingBottom: 5,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={Images.Receipt}
              resizeMode="contain"
              style={{width: 20, height: 20, resizeMode: 'contain'}}
            />
            <Text style={styles.header}>{Languages.Check_In}</Text>
          </View>
          <View
            style={{
              backgroundColor: '#00AEEF26',
              borderRadius: 20,
              padding: 8,
              marginLeft: 10,
              width: 80,
            }}>
            <Text style={styles.stepText}>{Languages.Step_One}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={{height: 10}} />
      {location && (
        <View style={styles.modalView}>
          <View style={{borderRadius: 10, width: '100%', height: '60%'}}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location?.coords.latitude,
                longitude: location?.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Marker
                coordinate={{
                  latitude: location?.coords.latitude,
                  longitude: location?.coords.longitude,
                }}
                title={name}
                description={Languages.You_are_here}
              />
            </MapView>
            <View
              style={{
                backgroundColor: '#E6F2E6',
                padding: 10,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
              }}>
              <Text style={styles.header}>{client}</Text>
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
                <View style={{ flexDirection:'row', justifyContent:'flex-start', alignItems: 'center',paddingLeft:5}}>
                <Octicons name="location" size={25} color="#919EAB" />
                <View
                  style={{
                    width: '90%',
                    flexDirection: 'row',
                    marginLeft: 10,
                    flexWrap:'wrap'
                  }}>
                   <Text style={styles.addressText}>
                      {/* 12,Cavinville, Cenotaph Road,Rathna Nagar, Guindy,
                    Chennai-600018. */}
                     {address?address:"--"}
                    </Text>
                </View>
                </View>
                
              </View>
              <View
                style={{
                  backgroundColor: '#E6F2E680',
                  flexDirection: 'row',
                  height: 'auto',
                  flexWrap: 'wrap',
                  paddingTop: 10,
                  paddingBottom: 10,
                }}>
                <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems: 'flex-start',paddingLeft:5}}>
                <Icons name="crosshairs-gps" size={25} color="#919EAB" />
                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft:10,
                  }}>
                     <Text style={styles.addressText}>
                    {
                    location?.coords.latitude +
                    ' , ' +
                    location?.coords.longitude
                  }
                    </Text>
                  {/* <View
                    style={{
                      flexDirection: 'column',
                      width: '100%',
                      height: 'auto',
                    }}>
                   
                  </View> */}
                </View>
                </View>
                
              </View>
              <View style={{height: 20}} />
      <View
        style={{
          backgroundColor: '#FEF2F3',
          borderRadius: 5,
          paddingLeft: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            gap: 2,
            alignItems: 'center',
            padding: 10,
          }}>
          <Anticon
            name="exclamationcircleo"
            size={15}
            color="#000000"></Anticon>
          <Text
            style={{
              fontSize: RFValue(12),
              fontWeight: '500',
              textAlign: 'left',
              color: '#666687',
              marginLeft: 10,
            }}>
            {Languages.check_In_Instruction}
          </Text>
        </View>
      </View>
             
            </View>
          </View>
        </View>
      )}
      
    </View>
  );
};
export default StepOneScreen;