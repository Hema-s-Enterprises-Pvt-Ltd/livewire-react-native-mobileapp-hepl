import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  Alert,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  SafeAreaView,
  PermissionsAndroid,
  RefreshControl,
  Platform,
  BackHandler,
  Linking,
} from 'react-native';
import {styles} from './HomeStyles';
import GlobalStyles from '../../core/GlobalStyles';
import CustomSearchInput from '../../component/CustomSearchInput';
import RenderItem from '../../component/RenderItem';
import {
  getUpcomingList,
  getPendingList,
  AcceptInvite,
  DeclineInvite,
  trainerGetById,
  getDetails,
  getWeather,
  getUpcomingListbyDate,
  getPendingListbyDate,
  getSalesReport,
  getAllNotification,
  getAppVersion,
  saveAppDownloads,
} from '../../networkClient/apifunction';
import {ActivityIndicator, Badge} from 'react-native-paper';
import InviteRender from './component/InviteRender';
import CalendarModal from '../Schedule/component/CalendarModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PendingInviteItem from '../../component/PendingInviteItem';
import TrainerDetailPopUp from '../Schedule/component/TrainerDetailPopUp';
import CancelPopup from '../../component/CancelPopUp';
import {useFocusEffect} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import Maticon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Images, Languages} from '../../common';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import crashlytics from '@react-native-firebase/crashlytics';

const HomeScreen = props => {
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const [data, setData] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [pendingData, setPendingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filteredPendingData, setFilteredPendingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [PendingModalVisible, setPendingModalVisible] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [userName, setUserName] = useState('');
  const [reasonInput, setReasonInput] = useState('');
  const [reason, setReason] = useState('');
  const [trainerDetails, setTrainerDetails] = useState(null);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelDetail, setCancelDetail] = useState(null);
  const [inviteId, setInviteId] = useState();
  const [image, setImage] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [recentData, setRecentData] = useState();
  const [filterRecentData, setFilterRecentData] = useState();
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [prevNotificationCount, setPrevNotificationCount] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const searchInputRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      getFCMToken();
      configureFireBaseNotification();
      getUserName();
      getList();
      getPendingData();
      getNotificationCount();
    }, []),
  );
  useEffect(() => {
    crashlytics().log('HomeScreen mounted');
    getApplicationVersion();
    return () => {
      crashlytics().log('HomeScreen unmounted');
    };
  }, []);
  const getApplicationVersion = async () => {
    await getAppVersion()
      .then(function (response) {
        if (response.data.statusCode === 200) {
          let currentVersion = DeviceInfo.getVersion();
          var mosaic = response.data.data.mosaic;
          var store = response.data.data.store;
          const latestVersion =
            Platform.OS === 'ios' ? store.iosVersion : store.androidVersion;
          if (parseFloat(latestVersion) > parseFloat(currentVersion)) {
            showAlert(response.data.data, currentVersion, latestVersion);
          }
        }
      })
      .catch(function (error) {
        crashlytics().recordError(error);
      });
  };
  const showAlert = (data, version, latestVersion) => {
    // const appLink =
    //   Platform.OS === 'ios'
    //     ? data.mosaic.iosAppLink
    //     : data.mosaic.androidAppLink;
    const appLink =
      Platform.OS === 'ios' ? data.store.iosAppLink : data.store.androidAppLink;
    //     const appLink = 'market://details?id=com.citpl.raaga';
    // const fallbackUrl = 'https://play.google.com/store/apps/details?id=com.citpl.raaga';
    //const appLink = 'market://details?id=com.citpl.raaga';
    // const fallbackUrl = 'https://play.google.com/store/apps/details?id=com.citpl.raaga';
    Alert.alert(
      data.title,
      data.description,
      [
        {
          text: 'Update Now',
          onPress: async () => {
            try {
              const supported = await Linking.canOpenURL(appLink);
              if (supported) {
                await Linking.openURL(appLink)
                  .then(async () => {
                    await getAppVersion()
                      .then(function (response) {
                        if (response.data.statusCode === 200) {
                          let currentVersion = DeviceInfo.getVersion();
                          var mosaic = response.data.data.mosaic;
                          var store = response.data.data.store;
                          const latestVersion =
                            Platform.OS === 'ios'
                              ? store.iosVersion
                              : store.androidVersion;

                          if (
                            parseFloat(latestVersion) ===
                            parseFloat(currentVersion)
                          ) {
                            saveApp(currentVersion);
                          }
                        }
                      })
                      .catch(function (error) {
                        crashlytics().recordError(error);
                      });
                  })
                  .catch(err => Alert.alert('Failed to open URL', err.message));
              } else {
                //   await Linking.openURL(fallbackUrl);

                Alert.alert('App not installed', `Cannot open URL: ${appLink}`);
              }
            } catch (error) {
              crashlytics().recordError(error);
              console.error('An error occurred', error);
              Alert.alert(
                'Error',
                `An error occurred while trying to open the app: ${
                  error.message || 'Unknown error'
                }`,
              );
            }
          },
        },
      ],
      {
        cancelable: !data.store.mandatoryUpdate,
      },
    );
  };

  const saveApp = async version => {
    const body = {
      appName: 'LiveWire',
      deviceId: 'string',
      emailId: 'string',
      isStoreEnable: false,
      source: 'store', //store
      liveAndroidVersion: version, //current version
      liveIOSVersion: version, //current version
    };
    await saveAppDownloads(body)
      .then(function (response) {})
      .catch(function (error) { crashlytics().recordError(error);});
  };
  const getNotificationCount = async () => {
    await getAllNotification()
      .then(function (response) {
        if (response.data.status == 200) {
          handleNotificationData(response);
        } else {
          Alert.alert(Languages.Alert, response.data.statusMessage);
        }
      })
      .catch(function (error) {
        crashlytics().recordError(error);
        Alert.alert(Languages.Alert, error.response.data.message);
      });
  };
  const handleNotificationData = async response => {
    var count = response.data.data.length;
    var prevCount = await AsyncStorage.getItem('prevCount');
    if (response.data.data.length != 0) {
      if (response.data.data.length > prevCount) {
        setShowBadge(true);
      } else {
        setShowBadge(false);
      }
    } else {
      setShowBadge(false);
    }
    if (prevCount === null || prevCount === undefined) {
      await AsyncStorage.setItem('prevCount', count.toString());
    }
    setPrevNotificationCount(count);
  };
  useEffect(() => {
    Geolocation.setRNConfiguration({
      authorizationLevel: 'whenInUse', // Request "always" location permission
      skipPermissionRequests: false, // Prompt for permission if not granted
    });
    requestLocationPermission();
  }, []);

  useEffect(() => {
    filterData();
    filterPendingData();
    filterRecentSales();
  }, [search, data, pendingData,recentData]);

  const getFCMToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
    } catch (error) { crashlytics().recordError(error);}
  };
  // useEffect(() => {
  //   const backAction = () => {
  //     // Custom back button behavior
  //     Alert.alert("Alert!", "Are you sure you want to exit?", [
  //       {
  //         text: "Cancel",
  //         onPress: () => null,
  //         style: "cancel"
  //       },
  //       { text: "YES", onPress: () => BackHandler.exitApp() }
  //     ]);
  //     return true; // Prevent default behavior
  //   };

  //   // Add event listener for back button
  //   const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

  //   // Cleanup the event listener on component unmount
  //   return () => backHandler.remove();
  // }, []);
  const configureFireBaseNotification = () => {
    PushNotification.createChannel(
      {
        channelId: 'raagachannel', // (required)
        channelName: 'com-raaga',
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.configure({
      onRegister: function (token) {},
      onNotification: function (notification) {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      onAction: async function (notification) {
        // if(notification.action == 'Open'){
        //   var data = JSON.parse(await notification.userInfo);
        //   gotoPdf(data.path)
        // }
      },

      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      senderID: '1008678627699',

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: true,
    });
  };

  const handleToggleDetail = id => {
    setExpandedItemId(prevId => (prevId === id ? null : id));
  };

  const EmptyListMessage = ({item}) => {
    return <Text style={styles.noDataTxt}>{Languages.NoDataAvailable}</Text>;
  };

  const getTrainerDetail = async id => {
    trainerGetById(id)
      .then(function (response) {
        if (response.data.statusCode == 200) {
          const res = response.data.data;
          setTrainerDetails(res);
        } else {
          Alert.alert('Alert', response.data.data.statusMessage);
        }
      })
      .catch(function (error) {
        crashlytics().recordError(error);
        Alert.alert('Alert', error.message);
      });
  };

  const getRecentSalesList = async role => {
    var isRSM = null;
    if (role === 'RSM') {
      isRSM = true;
    } else {
      isRSM = false;
    }
    await getSalesReport(isRSM, true)
      .then(function (response) {
        if (response.data.statusCode == 200) {
          setRecentData(response.data.data);
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(function (error) {
        crashlytics().recordError(error);
        Alert.alert('Alert', error.response.data.message);
      });
  };

  const requestLocationPermission = async () => {
    if (Platform.OS == 'ios') {
      Geolocation.requestAuthorization(() => {
        getLocation();
      });
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
        }
      } catch (error) {
        crashlytics().recordError(error);
        setIsLoading(false);
      }
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        getWeatherDetails(position.coords.latitude, position.coords.longitude);
        setIsLoading(false);
      },
      error => {
        // See error code charts below.
        setIsLoading(false);
      },
      {enableHighAccuracy: false, timeout: 1500000, maximumAge: 100000},
    );
  };
  const getUserName = async () => {
    const id = await AsyncStorage.getItem('userId');
    let Id = parseInt(id, 10);
    try {
      const response = await getDetails(Id);
      if (response.data.statusCode === 200) {
        var name = `${response.data.data.firstName} ${response.data.data.lastName}`;
        setUserName(response.data.data.firstName);
        setRoleName(response.data.data.role.name);
        getRecentSalesList(response.data.data.role.name);
        setImage(response.data.data.profileUrl);
      } else {
        Alert.alert('Alert', response.data.data);
      }
    } catch (error) {
      crashlytics().recordError(error);
      Alert.alert('Alert', error.message);
    }
  };

  const getPendingData = async () => {
    await getPendingList()
      .then(function (response) {
        if (response.data.statusCode == 200) {
          setIsLoading(false);
          setPendingData(response.data.data);
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(function (error) {
        crashlytics().recordError(error);
        Alert.alert('Alert', error.response.data.message);
      });
  };

  const getList = async () => {
    await getUpcomingList()
      .then(function (response) {
        if (response.data.statusCode == 200) {
          setIsLoading(false);
          setData(response.data.data);
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(function (error) {
        crashlytics().recordError(error);
        Alert.alert('Alert', error.message);
      });
  };

  const getWeatherDetails = async (lat, lng) => {
    await getWeather(lat, lng)
      .then(function (response) {
        if (response.data.statusCode == 200) {
          setIsLoading(false);
          setWeatherData(response.data.data);
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(function (error) {
        crashlytics().recordError(error);
        Alert.alert('Alert', error.response.data.message);
      });
  };

  const filterData = () => {
    if (search === '') {
      setFilteredData(data);
    } else {      
      const filtered = data.filter(
        item=>
          item.client.clientName.toLowerCase().includes(search.toLowerCase()) ||
          item.generatedDemoId.toLowerCase().includes(search.toLowerCase()) ||
          (item.trainer?.firstName &&
            item.trainer.firstName
              .toLowerCase()
              .includes(search.toLowerCase())) ||
          item.trainer?.lastName.toLowerCase().includes(search.toLowerCase()) ||
          item.services?.name.toLowerCase().includes(search.toLowerCase()) ||
          item.brand?.brandName.toLowerCase().includes(search.toLowerCase()),
        //item.product?.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  const handleDateSelect = date => {
    setModalVisible(false);
    if (date) {
      getPendingInviteListByDate(date);
      getDemoListByDate(date);
      // Perform additional actions with the selected date
    }
  };

  const getPendingInviteListByDate = date => {
    getPendingListbyDate(date)
      .then(function (response) {
        if (response.data.statusCode == 200) {
          setIsLoading(false);
          setPendingData(response.data.data);
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(function (error) {
        crashlytics().recordError(error);
        Alert.alert('Alert', error.response.data.message);
      });
  };

  const getDemoListByDate = date => {
    getUpcomingListbyDate(date)
      .then(function (response) {
        if (response.data.statusCode == 200) {
          setIsLoading(false);
          setData(response.data.data);
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(function (error) {
        crashlytics().recordError(error);
        Alert.alert('Alert', error.response.data.message);
      });
  };

const filterPendingData = () => {
  if (search === '') {
    setFilteredPendingData(pendingData);
  } else {
    const filtered = pendingData.filter(item => {
      const clientNameMatch = item.demo.client.clientName
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const demoIdMatch = item.demo.generatedDemoId
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const trainerNameMatch =
        item.trainer && item.trainer.firstName
          ? item.trainer.firstName.toLowerCase().includes(search.toLowerCase())
          : false;
      const lastNameMatch =
        item.trainer && item.trainer.lastName
          ? item.trainer.lastName.toLowerCase().includes(search.toLowerCase())
          : false;
      const serviceNameMatch = item.demo.services?.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const brandNameMatch = item.demo.brand?.brandName
        ?.toLowerCase()
        .includes(search.toLowerCase());
      return (
        clientNameMatch ||
        demoIdMatch ||
        trainerNameMatch ||
        lastNameMatch ||
        serviceNameMatch ||
        brandNameMatch
      );
    });
    setFilteredPendingData(filtered);
  }
};

  const filterRecentSales=()=>{
    if (search === '') {
      setFilterRecentData(recentData);
    } else {
      const filtered = recentData.filter(item => {
        console.log("Data",item.demo)
        const clientNameMatch = item.client.clientName
          ?.toLowerCase()
          .includes(search.toLowerCase());
        const demoIdMatch = item.demo.generatedDemoId
          ?.toLowerCase()
          .includes(search.toLowerCase());
        const trainerNameMatch =
          item.demo.trainer && item.demo.trainer.firstName
            ? item.demo.trainer.firstName.toLowerCase().includes(search.toLowerCase())
            : false;
        const lastNameMatch =
          item.demo.trainer && item.demo.trainer.lastName
            ? item.demo.trainer.lastName.toLowerCase().includes(search.toLowerCase())
            : false;
        const serviceNameMatch = item.demo.services?.name
          ?.toLowerCase()
          .includes(search.toLowerCase());
        const brandNameMatch = item.demo.brand?.brandName
          ?.toLowerCase()
          .includes(search.toLowerCase());
          const PdtNameMatch = item.product?.name
          ?.toLowerCase()
          .includes(search.toLowerCase());
        return (
          clientNameMatch ||
          demoIdMatch ||
          trainerNameMatch ||
          lastNameMatch ||
          serviceNameMatch ||
          brandNameMatch||
          PdtNameMatch
        );
      });
      console.log('filter',filtered);
      setFilterRecentData(filtered);
    }
  };
  function notifyMessage(msg) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg);
    }
  }
  const acceptInvite = async id => {
    const data = {
      inviteId: id,
    };
    AcceptInvite(data)
      .then(function (response) {
        if (response.data.statusCode == 200) {
          notifyMessage(Languages.AcceptInvite);
          setIsLoading(true);
          getPendingData();
          getList();
        } else {
          Alert.alert('Alert', response.data.data.message);
        }
      })
      .catch(function (error) {
        crashlytics().recordError(error);
       // Alert.alert('Alert', error.message);
      });
  };

  const declineInvite = async id => {
    const data = {
      inviteId: id,
      notes: reason,
    };
    DeclineInvite(data)
      .then(function (response) {
        if (response.data.statusCode == 200) {
          notifyMessage(Languages.InviteDeclined);
          reasonInput.clear();
          setIsLoading(true);
          getPendingData();
        } else {
          Alert.alert('Alert', response.data.data.message);
        }
      })
      .catch(function (error) {
        crashlytics().recordError(error);
      //  Alert.alert('Alert', error.message);
      });
  };

  const UpcomingDemoClicked = item => {
    if (item.demoStatus === 'CANCELLED') {
      setCancelDetail(item);
      setCancelModalVisible(true);
    } else {
      props.navigation.navigate('DemoDetailScreen', {
        id: item.id,
        isDemoHistory: false,
      });
    }
  };

  const showPopUp = async id => {
    setPendingModalVisible(true);
    getTrainerDetail(id);
  };

  const Item = ({item, onToggleDetail, showDetail}) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.itemView}>
            <View style={styles.Icons}>
              <Image source={Images.Shampoo} style={styles.itemImage} />
            </View>
            <View>
              <View style={styles.itemDemoView}>
                <Text style={styles.itemDemoIdTxt}>
                  {item.demo ? item.demo.generatedDemoId : '--'}
                </Text>
                <Text style={styles.itemDemoDatetxt}>
                  {item.soldDate
                    ? moment(item.soldDate).format('MMM,DD')
                    : '--'}
                </Text>
              </View>
              <Text style={styles.demoProductName}>
                {item.product ? item.product.name : '--'}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => onToggleDetail(item.id)}>
            <Icon
              name={showDetail ? 'up-square-o' : 'down-square-o'}
              size={20}
              color={GlobalStyles.colorSet.orange}
            />
          </TouchableOpacity>
        </View>
        {showDetail && (
          <View style={styles.itemDetailsView}>
            <Text style={styles.itemQtyTxt}>
              {item.qtySold ? item.qtySold : '--'}Pcs
            </Text>
            <Text style={styles.itemAmtTxt}>
              ₹{item.amount ? item.amount : '--'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderItem = item => {
    return (
      <Item
        item={item}
        onToggleDetail={handleToggleDetail}
        showDetail={expandedItemId === item.id}
      />
    );
  };

  const renderPendingItem = item => {
    return (
      <Pressable>
        <InviteRender
          image={
            roleName === 'Salesman'
              ? {
                  uri: item.trainer != null ? item.trainer.profilePic : '',
                }
              : {
                  uri:
                    item.demo.salesman != null
                      ? item.demo.salesman.profilePic
                      : '',
                }
          }
          item={item}
          AcceptClicked={() => {
            acceptInvite(item.id);
          }}
          DeclineClicked={() => {
            declineInvite(item.id);
          }}
          Ref={val => setReasonInput(val)}
          onChangeText={text => setReason(text)}
        />
      </Pressable>
    );
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView
      style={{backgroundColor: GlobalStyles.colorSet.app_bg, flex: 1}}>
      <View style={styles.container}>
        <View style={{height: 10}} />
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 0.6, alignItems: 'flex-start'}}>
            <Image source={Images.LogoNew} style={styles.logoImage} />
          </View>

          <TouchableOpacity
            onPress={() => props.navigation.navigate('NotificationScreen')}
            style={styles.notificationView}>
            {showBadge && (
              <Badge
                size={10}
                style={{position: 'absolute', right: -1, top: 1}}
              />
            )}
            <MaterialIcon
              name="bell-outline"
              size={25}
              color={GlobalStyles.colorSet.Grey}
            />
          </TouchableOpacity>

          <View style={{flex: 0.2, alignItems: 'flex-end'}}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Profile')}>
              {image ? (
                <Image
                  source={{uri: image}}
                  style={{
                    resizeMode: 'stretch',
                    width: 40,
                    height: 40,
                    marginRight: 10,
                    borderRadius: 50,
                    borderColor: GlobalStyles.colorSet.Grey,
                    borderWidth: 2,
                  }}
                />
              ) : (
                <Image
                  source={Images.Person}
                  style={{
                    resizeMode: 'stretch',
                    width: 40,
                    height: 40,
                    marginRight: 10,
                    borderRadius: 50,
                    borderColor: GlobalStyles.colorSet.Grey,
                    borderWidth: 2,
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <View style={{height: 30}} />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{width: '50%'}}>
            <Text style={styles.header}>Welcome, {userName} !</Text>
            <Text style={styles.subHeader}>Here's your quick overview</Text>
          </View>
          <View
            style={{
              width: '40%',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            {weatherData ? (
              <Text
                style={[
                  styles.subHeader,
                  {alignItems: 'center', marginRight: 15},
                ]}>
                {weatherData.weatherStatus}
                {'\n'}{' '}
                {weatherData.currentWeather != undefined
                  ? weatherData.currentWeather.temperature
                  : ''}{' '}
                °C
              </Text>
            ) : (
              <Text
                style={[
                  styles.subHeader,
                  {alignItems: 'center', marginRight: 5},
                ]}>
                --
              </Text>
            )}
            <Image
              source={Images.Sun}
              style={{
                width: 30,
                height: 30,
                marginRight: 10,
                resizeMode: 'contain',
              }}
            />
          </View>
        </View>
        <View style={{height: 30}} />
        <CustomSearchInput
          placeholder={'Search for demos...'}
          value={search}
          onChangeText={text => {
            setSearch(text);
          }}
          ref={searchInputRef} // Pass the ref
        />
      </View>
      <View style={{flex: 1}}>
        <ScrollView style={{flexGrow: 1}}>
          {roleName === 'Trainer' && (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                }}>
                <Text style={styles.header}>Pending Invites</Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(true);
                  }}
                  style={{
                    backgroundColor: '#E6F2E633',
                    marginRight: 5,
                    padding: 5,
                    borderRadius: 5,
                  }}>
                  <Maticon
                    name="calendar-month-outline"
                    size={20}
                    color="#F78104"
                  />
                </TouchableOpacity>
              </View>
              <View
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }>
                <FlatList
                  keyExtractor={(item, index) => index.toString()}
                  data={filteredPendingData}
                  scrollEnabled={false}
                  ListEmptyComponent={EmptyListMessage}
                  renderItem={({item, index}) => renderPendingItem(item)}
                />
              </View>
            </View>
          )}
          <View style={{paddingLeft: 10, paddingBottom: 10}}>
            <Text style={styles.header}>Upcoming Demos</Text>
          </View>
          <View>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                keyExtractor={(item, index) => index}
                data={filteredData}
                scrollEnabled={false}
                ListEmptyComponent={EmptyListMessage}
                renderItem={({item, index}) => (
                  <Pressable onPress={() => UpcomingDemoClicked(item)}>
                    <RenderItem
                      image={
                        roleName === 'Salesman'
                          ? item.trainer != null
                            ? item.trainer.profilePic
                            : ''
                          : item.salesman != null
                          ? item.salesman.profilePic
                          : ''
                      }
                      name={
                        roleName === 'Salesman'
                          ? `${
                              item.trainer != null ? item.trainer.firstName : ''
                            } ${
                              item.trainer != null ? item.trainer.lastName : ''
                            }`
                          : `${item.salesman.firstName} ${item.salesman.lastName}`
                      }
                      detail={moment(item?.scheduleTime, ['HH:mm']).format(
                        'h:mm A',
                      )}
                      assignee={item.trainer.firstName}
                      demoId={item.generatedDemoId}
                      status={item.demoStatus}
                    />
                  </Pressable>
                )}
              />
            )}
          </View>
          {roleName === 'Salesman' && (
            <View>
              <View style={{paddingLeft: 10, paddingBottom: 10}}>
                <Text style={styles.header}>Pending Invite</Text>
              </View>
              <View>
                <FlatList
                  keyExtractor={(item, index) => index}
                  data={filteredPendingData}
                  scrollEnabled={false}
                  ListEmptyComponent={EmptyListMessage}
                  renderItem={({item, index}) => (
                    <Pressable
                      onPress={() => {
                        if (
                          item.status === 'SENT' ||
                          item.status === 'RESENT'
                        ) {
                          setInviteId(item.id);
                          showPopUp(item.trainer.id);
                        }
                      }}>
                      <PendingInviteItem
                        image={
                          roleName === 'Salesman'
                            ? item.trainer != null
                              ? item.trainer.profilePic
                              : ''
                            : item.demo.salesman != null
                            ? item.demo.salesman.profilePic
                            : ''
                        }
                        endImage={
                          item.status === 'SENT'
                            ?Images.Timer
                            : item.status === 'ACCEPTED'
                            ? Images.AcceptTick
                            :Images.Timer
                        }
                        status={item.status}
                        name={
                          item.trainer != null
                            ? item?.trainer.firstName +
                              ' ' +
                              item?.trainer.lastName
                            : ''
                        }
                        detail={
                          item.status === 'SENT'
                            ? 'Accept Invite Pending'
                            : item.status === 'ACCEPTED'
                            ? 'Accepted'
                            : item.status === 'RESENT'
                            ? 'Accept Invite Pending'
                            : 'Declined'
                        }
                      />
                    </Pressable>
                  )}
                />
              </View>
            </View>
          )}
          {roleName === 'ASM' && (
            <View>
              <View style={{paddingLeft: 10, paddingBottom: 10}}>
                <Text style={styles.header}>Recent Sales</Text>
              </View>
              <View>
                {isLoading ? (
                  <ActivityIndicator />
                ) : (
                  <FlatList
                    renderItem={({item, index}) => renderItem(item)}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                    data={filterRecentData}
                    ListEmptyComponent={EmptyListMessage}
                  />
                )}
              </View>
            </View>
          )}
          {roleName === 'RSM' && (
            <View>
              <View style={{paddingLeft: 10, paddingBottom: 10}}>
                <Text style={styles.header}>Recent Sales</Text>
              </View>
              <View>
                {isLoading ? (
                  <ActivityIndicator />
                ) : (
                  <FlatList
                    renderItem={({item, index}) => renderItem(item)}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                    data={filterRecentData}
                    ListEmptyComponent={EmptyListMessage}
                  />
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
      <CalendarModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onDateSelect={handleDateSelect}
      />
      <TrainerDetailPopUp
        visible={PendingModalVisible}
        onClose={() => {
          getPendingData();
          setPendingModalVisible(false);
        }}
        trainerDetails={trainerDetails}
        InviteId={inviteId}
        showButton={true}
      />
      <CancelPopup
        visible={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        details={cancelDetail}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
