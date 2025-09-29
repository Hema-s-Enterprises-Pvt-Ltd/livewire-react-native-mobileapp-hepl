import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {styles} from './ClientStyles';
import GlobalStyles from '../../core/GlobalStyles';
import CustomAppBar from '../../component/CustomAppBar';
import Icon from 'react-native-vector-icons/Ionicons';
import DetailItem from '../DemoDetail/component/DetailItem';
import ClientDemoHistoryScreen from './ClientDemoHistory';
import SalesHistory from './SalesHistory';
import NotesScreen from './NotesScreen';
import {getDemoClientDetails, TogglePin} from '../../networkClient/apifunction';
import { Images } from '../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const ClientDetailScreen = props => {
  const ClientId = props.route.params.id;
  const [showDetail, setShowDetils] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [demoData, setDemoData] = useState(0);
  const segments = ['Demo History', 'Sales', 'Notes'];
  const handleChange = event => {
    const index = event.nativeEvent.selectedSegmentIndex;
    setSelectedIndex(index);
  };
  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('ClientDetailScreen mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('ClientDetailScreen unmounted');
    };
  }, []);
  useEffect(() => {
    getDetails();
  }, []);
  const getDetails = async () => {
    await getDemoClientDetails(ClientId)
      .then(function (response) {
        if (response.data.statusCode === 200) {
          setDemoData(response.data.data);
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert('Alert', error.response.data.message);
      });
  };

  const togglePinClicked = async () => {
    await TogglePin(ClientId)
      .then(function (response) {
        if (response.data.statusCode === 200) {
          Alert.alert(response.data.statusMessage);
          getDetails();
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(function (error) {
        Alert.alert('Alert', error.response.data.message);
      });
  };
  return (
    <SafeAreaView
      style={{backgroundColor: GlobalStyles.colorSet.app_bg, flexGrow: 1}}>
      <View style={styles.container}>
        <CustomAppBar
          title={demoData ? demoData.clientName : '--'}
          showImage={true}
          navigation={props.navigation}
        />
        <View style={{height: 30}} />
        <View style={{backgroundColor: 'white', borderRadius: 10, padding: 10}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#00AEEF1A',
              padding: 10,
              borderRadius: 10,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity onPress={togglePinClicked}>
                <Image
                  source={demoData ? demoData.isPined ?Images.UnPin:Images.Pin:Images.Pin}
                  style={{width: 20, height: 20,color:GlobalStyles.colorSet.light_grey}}
                />
              </TouchableOpacity>
              <Text
                style={{
                  color: '#000000',
                  fontWeight: '500',
                  fontSize: 16,
                  marginLeft: 10,
                  flexWrap:'wrap',
                  flex:0.7,
                 
                }}>
                {demoData ? demoData.clientName : '--'}
              </Text>
              <Text
                style={{
                  color: '#101828',
                  fontWeight: '500',
                  fontSize: 12,
                  marginLeft: 10,
                  flexWrap:'wrap',
                  flex:0.25,
                 textAlign:'right'
                }}>
                {demoData ? demoData.clientCode : '--'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowDetils(!showDetail);
              }}>
              <Icon
                name={
                  showDetail ? 'chevron-up-outline' : 'chevron-down-outline'
                }
                size={20}
                color="#98A2B3"
              />
            </TouchableOpacity>
          </View>
          {showDetail && (
            <View>
              <View style={styles.detailContainer}>
                <View style={styles.detailChildContainer}>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: 'auto',
                      flexWrap: 'wrap',
                      paddingTop: 10,
                      paddingBottom: 10,
                      alignItems: 'center',
                    }}>
                    <View style={{width: '5%', alignItems: 'flex-end'}}>
                      <Image
                        source={Images.LocationGrey}
                        resizeMode="contain"
                        style={styles.locationImage}
                      />
                    </View>

                    <View style={{width: '75%', flexDirection: 'row'}}>
                      <View
                        style={{
                          flexDirection: 'column',
                          width: '100%',
                          height: 'auto',
                          marginLeft: 5,
                        }}>
                        <Text style={styles.addressText}>
                          {demoData ? demoData.location : '--'}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        width: '20%',
                        alignItems: 'flex-end',
                        paddingRight: 10,
                        justifyContent: 'center',
                      }}>
                      <Image
                        source={Images.Routing}
                        style={{
                          tintColor: GlobalStyles.colorSet.orange,
                          width: 20,
                          height: 20,
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <DetailItem
                image={'Ionicon-person'}
                title={`Decision Maker - ${
                  demoData ? demoData.decisionMakerName : '--'
                }`}
                isheader={false}
              />
              <DetailItem
                image={'Octicons-mobile'}
                title={demoData ? demoData.decisionMakerNumber : '--'}
                isheader={false}
              />
            </View>
          )}
        </View>
        <View style={{padding: 10}}>
          <View style={styles.customSegmentLabels}>
            {segments&&
            segments.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedIndex(index)}
                style={[
                  styles.segmentButton,
                  {
                    backgroundColor:
                      index === selectedIndex
                        ? GlobalStyles.colorSet.orange
                        : '#E6F2E633',
                  },
                ]}>
                <Text
                  style={[
                    styles.segmentText,
                    {
                      color:
                        index === selectedIndex
                          ? '#ffffff'
                          : GlobalStyles.colorSet.orange,
                    }, // Text color based on selection
                  ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.content}>
            {selectedIndex === 0 && (
              <ClientDemoHistoryScreen clientId={ClientId} screenProps={props} showDetail={showDetail} />
            )}
            {selectedIndex === 1 && <SalesHistory clientId={ClientId} showDetail={showDetail}/>}
            {selectedIndex === 2 && <NotesScreen clientId={ClientId} showDetail={showDetail}/>}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ClientDetailScreen;
