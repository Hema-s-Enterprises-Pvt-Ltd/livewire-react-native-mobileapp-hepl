import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  PermissionsAndroid,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {styles} from './ActionStyles';
import GlobalStyles from '../../core/GlobalStyles';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import PropTypes from 'prop-types';
import Anticon from 'react-native-vector-icons/AntDesign';
import {RFValue} from 'react-native-responsive-fontsize';
import {Images, Languages} from '../../common';
import { getAddressFromLatLng } from '../../networkClient/apifunction';
import CustomInput from '../../component/CustomInput';
import crashlytics from '@react-native-firebase/crashlytics';

const StepFourScreen = ({onHeaderClicked,name,Address,client,control}) => {
  const [location, setLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('StepFourScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('StepFourScreen unmounted');
    };
  }, []);

  useEffect(() => {
    Geolocation.setRNConfiguration({
      authorizationLevel: 'whenInUse', // Request "always" location permission
      skipPermissionRequests: false, // Prompt for permission if not granted
    });
    requestLocationPermission();
  }, []);
  
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
    if (Platform.OS == 'ios') {
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
  };

  if (isLoading) {
    return (
      <View
        style={{justifyContent: 'center', alignItems: 'center', height: 500}}>
        <ActivityIndicator size="large" color={GlobalStyles.colorSet.orange} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
        <Button
          title="Retry"
          onPress={() => {
            setIsLoading(true);
            requestLocationPermission();
          }}
        />
      </View>
    );
  }

  return (
    <View style={{height: 650}}>
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
            <Text style={styles.header}>{Languages.Check_Out}</Text>
          </View>
          <View
            style={{
              backgroundColor: '#00AEEF26',
              borderRadius: 20,
              padding: 8,
              marginLeft: 10,
              width: 80,
            }}>
            <Text style={styles.stepText}>{Languages.Step_12}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={{height: 10}} />
      {location && (
        <View
          style={{
            width: '100%',
            height: '60%',
            backgroundColor: 'white',
            borderRadius: 10,
            padding: 10,
          }}>
          <View style={{borderRadius: 10, width: '100%', height: '35%'}}>
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
                    <Text style={styles.addressText}>{address?address:"--"}</Text>
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
                <View style={{width: '5%', alignItems: 'flex-start',paddingLeft:5}}>
                  <Image
                    source={Images.Gps}
                    resizeMode="contain"
                    style={styles.locationImage}
                  />
                </View>
                <View
                  style={{
                    width: '90%',
                    flexDirection: 'row',
                    marginLeft: 10,
                    paddingLeft:10
                  }}>
                  <View
                    style={{
                      flexDirection: 'column',
                      width: '100%',
                      height: 'auto',
                    }}>
                    <Text style={styles.addressText}>
                    {
                    location?.coords.latitude +
                    ' , ' +
                    location?.coords.longitude
                  }
                    </Text>
                  </View>
                </View>
              </View>
            </View>
           
              <CustomInput
          title={Languages.Notes}
          name="notes"
          control={control}
          placeholder={Languages.Enter_notes}
          rules={{
            required: Languages.Notes_is_required,
            // pattern: {
            //   value: /^[A-Za-z\s]+$/,
            //   message: Languages.Only_Alphabets_are_Allowed,
            // },
          }}
        />
          </View>
        </View>
      )}
      <View style={{height: 20}} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          gap: 2,
          alignItems: 'center',
          padding: 10,
          backgroundColor: '#FEF2F3',
        }}>
        <Anticon name="exclamationcircleo" size={15} color="#000000"></Anticon>
        <Text
          style={{
            fontSize: RFValue(12),
            fontWeight: '500',
            textAlign: 'left',
            color: '#666687',
            marginLeft: 10,
          }}>
          {Languages.check_Out_Instruction}
        </Text>
      </View>
    </View>
  );
};
StepFourScreen.propTypes = {
  client: PropTypes.string,
  address: PropTypes.string,
};

export default StepFourScreen;
