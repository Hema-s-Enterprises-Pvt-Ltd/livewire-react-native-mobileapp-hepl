import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  Pressable,
  Alert,
  ToastAndroid,
  Animated,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {styles} from './DemoDetailStyles';
import CustomAppBar from '../../component/CustomAppBar';
import {RFValue} from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapModal from './component/MapModel';
import CustomButton from '../../component/CustomButton';
import {demoGetbyId} from '../../networkClient/apifunction';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CancelPopup from './component/CancelPopup';
import {useFocusEffect} from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomefive from 'react-native-vector-icons/FontAwesome5';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Svg, {Path} from 'react-native-svg';
import {parseJwt} from '../../utils/JWTDecode';
import Anticon from 'react-native-vector-icons/AntDesign';
import {Images, Languages} from '../../common';
import LoadingIndicator from '../../utils/LoadingIndicator';

const DemoDetailScreen = props => {
  const IsDemoHistory = props.route.params.isDemoHistory;
  const [modalVisible, setModalVisible] = useState(false);
  const [details, setDetails] = useState('');
  const [isDemoAudit, setIsDemoAudit] = useState(true);
  const [roleName, setroleName] = useState();
  const [title, setTitle] = useState('');
  const [cancelModalVisible, setcancelModalVisible] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState(false);
  const [checkOutStatus, setCheckOutStatus] = useState(false);
  const [DemoCompleteStatus, setDemoCompletedStatus] = useState(false);
  const [FeedbackStatus, setFeedbackStatus] = useState(false);
  const [selectedStep, setSelectedStep] = useState(0);
  const [isloading, setIsLoading] = useState(false);
  const progress1 = useRef(new Animated.Value(0)).current;
  const progress2 = useRef(new Animated.Value(0)).current;
  const progress3 = useRef(new Animated.Value(0)).current;
  const progress4 = useRef(new Animated.Value(0)).current;

  const start1 = () => {
    Animated.timing(progress1, {
      toValue: 60,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  };
  const start2 = () => {
    Animated.timing(progress2, {
      toValue: 60,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  };
  const start3 = () => {
    Animated.timing(progress3, {
      toValue: 60,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  };
  const start4 = () => {
    Animated.timing(progress3, {
      toValue: 60,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  };
  useFocusEffect(
    React.useCallback(() => {
      getRoleName();
      getDetails();
    }, []),
  );
const onhandleCloseSuccess=async(response)=>{
  if (response.data.statusCode == 200) {
    notifyMessage(Languages.Demo_Cancelled_Successfully);
    setcancelModalVisible(false);
    props.navigation.navigate('SalesBottomTabs');
  } else {
    Alert.alert(Languages.Alert, response.data.statusMessage);
  }
}
  const getStatusMap = demoAudits => {
    if (demoAudits.length != 0) {
      for (let i = 0; i <= demoAudits.length; i++) {
        if (demoAudits[i].stage === 1) {
          setCheckInStatus(true);
          setSelectedStep(1);
          start1();
        }
        if (demoAudits[i].stage > 2) {
          setDemoCompletedStatus(true);
          setSelectedStep(2);
          start2();
        }
        if (demoAudits[i].stage === 10) {
          setFeedbackStatus(true);
          setSelectedStep(3);
          start3();
        }
        if (demoAudits[i].stage === 12) {
          setCheckOutStatus(true);
          setSelectedStep(4);
          start4();
        }
      }
    }
  };
  const getRoleName = async () => {
    let token = await AsyncStorage.getItem('accessToken');
    //let decode = jwtDecode(token);
    let decode = parseJwt(token);
    setroleName(decode.payload.roleName);
  };

  const getDetails = async () => {
    var id = props.route.params.id;
    await demoGetbyId(id)
      .then(function (response) {
        if (response.data.statusCode == 200) {
          setDetails(response.data.data);
          if (response.data.data.demoAudits.length === 12) {
            setIsDemoAudit(true);
          } else {
            setIsDemoAudit(false);
          }
          getStatusMap(response.data.data.demoAudits);
        } else {
          Alert.alert('Alert', response.data.statusMessage);
        }
      })
      .catch(function (error) {
        //  Alert.alert('Alert', error.message);
      });
  };

  const data = [
    {
      id: 1,
      title: Languages.Check_In,
      time: '',
      startImage: Images.MenuBoard,
    },
    {
      id: 2,
      title: Languages.Demo_Completed,
      time: '',
      startImage:Images.TickSquare,
    },
    {
      id: 3,
      title: Languages.Feedback_Shared,
      time: '',
      startImage:Images.MenuBoard,
    },
    {
      id: 4,
      title: Languages.Check_Out,
      time: '',
      startImage:Images.TickSquare,
    },
  ];

  const isCurrentDate = (dateString) => {
    const date = new Date(dateString);
    const currentDate = new Date();
    date.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    return date.getTime() === currentDate.getTime();
  };

  const renderPage = rowData => {
    const item = rowData.item;
    return (
      // < VerticalTimeline data={item} />
      <Pressable
        onPress={() => {
          if (item.id == 2) {
            if (details?.demoAudits.length != 0) {
              props.navigation.navigate('DemoCompletedScreen', {
                auditDetails: details?.demoAudits,
              });
            } else {
              Alert.alert(Languages.No_Demo_Details_to_View);
            }
          } else {
            if (item.id === 3) {
              if (details?.demoAudits.length >= 9) {
                props.navigation.navigate('FeedbackDetailScreen', {
                  auditDetails: details?.demoAudits,
                  id: details?.id,
                });
              } else {
                Alert.alert(Languages.Feedback_is_not_yet_completed);
              }
            }
            if (item.id != 3) {
              if (details?.demoAudits.length != 0) {
                setTitle(item.title);
                if (item.title === 'Check In' && checkInStatus) {
                  setModalVisible(true);
                }

                if (item.title === 'Check Out' && checkOutStatus) {
                  setModalVisible(true);
                }
              } else {
                Alert.alert(Languages.No_Demo_Details_to_View);
              }
            }
          }
        }}>
        <View style={styles.timelineItem}>
          <View style={styles.timelineLeft}>
            <View
              style={[
                styles.timecircle,
                item.title === Languages.Check_In &&
                  checkInStatus && {borderColor:'#00AEEF'},
                item.title == Languages.Check_Out &&
                  checkOutStatus && {borderColor:'#00AEEF'},
                item.title == Languages.Feedback_Shared &&
                  FeedbackStatus && {borderColor:'#00AEEF'},
                item.title == Languages.Demo_Completed &&
                  DemoCompleteStatus && {borderColor:'#00AEEF'},
              ]}>
              <View style={[styles.subcircle,
                item.title === Languages.Check_In &&
                checkInStatus && {backgroundColor: '#00AEEF'},
              item.title == Languages.Check_Out &&
                checkOutStatus && {backgroundColor: '#00AEEF'},
              item.title == Languages.Feedback_Shared &&
                FeedbackStatus && {backgroundColor: '#00AEEF'},
              item.title == Languages.Demo_Completed &&
                DemoCompleteStatus && {backgroundColor: '#00AEEF'},
              ]}></View>
            </View>
            {item.id !== 4 && <View style={[styles.timeline,
              item.title === Languages.Check_In &&
              checkInStatus && {backgroundColor: '#00AEEF',borderColor:'#00AEEF'},
            item.title == Languages.Check_Out &&
              checkOutStatus && {backgroundColor: '#00AEEF',borderColor:'#00AEEF'},
            item.title == Languages.Feedback_Shared &&
              FeedbackStatus && {backgroundColor: '#00AEEF',borderColor:'#00AEEF'},
            item.title == Languages.Demo_Completed &&
              DemoCompleteStatus && {backgroundColor: '#00AEEF',borderColor:'#00AEEF'},
            ]} />}
          </View>
          <View style={styles.timelineContent}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                gap: 6,
              }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: '#fee6cd',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 5,
                }}>
                {/* <Icons name="note-multiple" size={20} color="#00AEEF" /> */}
                {item.title === Languages.Check_In ||
                item.title === Languages.Feedback_Shared ? (
                  <Icons name="note-text-outline" color="#00AEEF" size={20} />
                ) : (
                  <Anticon name="checksquareo" size={20} color="#00AEEF" />
                )}
              </View>
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.header}>{item.title}</Text>

                {item.title == Languages.Check_In && (
                  <Text style={styles.subHeader}>
                    {' '}
                    {details?.demoAudits
                      ? details?.demoAudits[0]
                        ? `${moment(details?.demoAudits[0].modifiedAt).format(
                            'hh:mm a',
                          )}`
                        : 'Not yet Checked-In'
                      : 'Not yet Checked-In'}{' '}
                  </Text>
                )}
                {item.title == Languages.Check_Out && (
                  <Text style={styles.subHeader}>
                    {' '}
                    {details?.demoAudits
                      ? details?.demoAudits[11]
                        ? `${moment(details?.demoAudits[11].modifiedAt).format(
                            'hh:mm a',
                          )}`
                        : 'Not yet Checked-Out'
                      : 'Not yet Checked-Out'}{' '}
                  </Text>
                )}
                {item.title == Languages.Feedback_Shared && (
                  <Text style={styles.subHeader}>
                    {details?.demoAudits
                      ? details?.demoAudits[10]
                        ? `${moment(details?.demoAudits[10].modifiedAt).format(
                            'hh:mm a',
                          )}`
                        : 'Feedback not yet Shared'
                      : 'Feedback not yet Shared'}{' '}
                  </Text>
                )}
                {item.title == Languages.Demo_Completed && (
                  <Text style={styles.subHeader}>
                    {details?.demoAudits
                      ? details?.demoAudits[9]
                        ? `${moment(details?.demoAudits[9].modifiedAt).format(
                            'hh:mm a',
                          )}`
                        : 'Demo not yet started'
                      : 'Demo not yet Completed'}{' '}
                  </Text>
                )}
              </View>
            </View>
            {item.title == Languages.Check_In && (
              <Anticon name="earth" size={20} color="#00AEEF" />
            )}
            {item.title == Languages.Check_Out && (
              <Anticon name="earth" size={20} color="#00AEEF" />
            )}
            {item.title == Languages.Feedback_Shared && (
              <Icon
                name={
                  details?.decisionMakerFeedbackReceived ? 'star' : 'star-o'
                }
                size={20}
                color="#00AEEF"
              />
            )}
            {item.title == Languages.Demo_Completed && (
              <FontAwesomefive
                name="external-link-alt"
                size={20}
                color="#00AEEF"
              />
            )}
          </View>
        </View>
      </Pressable>

    );
  };
  function notifyMessage(msg) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg);
    }
  }

  return (
    <SafeAreaView style={styles.viewContainer}>
      {details ? (
        <View style={styles.container}>
          <View style={{height: 10}} />
          <CustomAppBar
            title={details?.generatedDemoId}
            showImage={true}
            navigation={props.navigation}
          />
          <ScrollView
            style={{marginBottom: 80}}
            showsVerticalScrollIndicator={false}>
            <View style={{height: 20}} />
            <View style={styles.flatContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  height: 'auto',
                  flexWrap: 'wrap',
                }}>
                {roleName != 'Salesman' ? (
                  details?.salesmanUser?.profileUrl !== null ? (
                    <Image
                      source={{uri: details?.salesmanUser?.profileUrl}}
                      resizeMode="stretch"
                      style={styles.Image}
                    />
                  ) : (
                    <Image
                      source={Images.Person}
                      resizeMode="stretch"
                      style={[styles.Image, {tintColor: 'white'}]}
                    />
                  )
                ) : details?.trainerUser?.profileUrl !== null ? (
                  <Image
                    source={{uri: details?.trainerUser?.profileUrl}}
                    resizeMode="stretch"
                    style={styles.Image}
                  />
                ) : (
                  <Image
                    source={Images.Person}
                    resizeMode="stretch"
                    style={[styles.Image, {tintColor: 'white'}]}
                  />
                )}
                <View style={{width: '80%', flexDirection: 'row'}}>
                  <View
                    style={{
                      flexDirection: 'column',
                      width: '100%',
                      height: 'auto',
                    }}>
                    <Text style={[styles.header, {color: 'white'}]}>
                      {roleName != 'Salesman'
                        ? details?.salesmanUser?.firstName +
                          ' ' +
                          details?.salesmanUser?.lastName
                        : details?.trainerUser?.firstName +
                          ' ' +
                          details?.trainerUser?.lastName}
                    </Text>
                    {/* {console.log('gsdvcgshjd',details)} */}
                    
                    <Text style={[styles.subHeader, {color: 'white'}]}>
                      {roleName !== 'Salesman'
                        ? Languages.Salesman
                        : Languages.Trainer}
                    </Text>

                    {/* -----> Dinesh need to change trainer name start-----> */}
                    {/* <Text style={[styles.header, {color: 'white'}]}>
                      Assigned To: {details.trainerUser.firstName}
                    </Text> */}
                    {/* -----> Dinesh need to change trainer name end-----> */}
                  </View>
                </View>
              </View>
            </View>
            <View style={{height: 10}} />
            <View style={{paddingBottom: 10}}>
              <Text style={styles.header}>{details?.client?.clientName}</Text>
            </View>
            <View style={styles.logoBg}>
             {
              details?.client?.clientImage !=null?
              <Image
              source={{uri: details?.client?.clientImage}}
              resizeMode="contain"
              style={styles.logoImg}
            />
            :
            <Image
            source={Images.ClientImg}
            resizeMode="contain"
            style={styles.logoImg}
          />
             }
            </View>
            <View style={styles.detailContainer}>
              <View style={styles.detailChildContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    height: 'auto',
                    flexWrap: 'wrap',
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}>
                  <View style={{width: '10%', alignItems: 'flex-end'}}>
                    <Octicons name="location" size={20} color="#919EAB" />
                  </View>

                  <View style={{width: '70%', flexDirection: 'row'}}>
                    <View
                      style={{
                        flexDirection: 'column',
                        width: '100%',
                        height: 'auto',
                      }}>
                      <Text style={[styles.addressText, {marginLeft: 5}]}>
                        {/* 12,Cavinville, Cenotaph Road, {'\n'} Rathna Nagar, Guindy,{' '}
                    {'\n'} Chennai-600018. */}
                        {details?.location?.location}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate('DemoMapViewScreen', {
                        latitude: details?.location?.latitude,
                        longitude: details?.location?.longitude,
                        clientName: details?.client?.clientName,
                      })
                    }
                    style={{
                      width: '20%',
                      alignItems: 'flex-end',
                      paddingRight: 10,
                      justifyContent: 'center',
                    }}>
                    <FontAwesomefive name="route" size={20} color="#00AEEF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={[styles.detailContainer, {paddingVertical: 10}]}>
              <View
                style={[styles.detailChildContainer, {paddingHorizontal: 15}]}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    gap: 2,
                    alignItems: 'center',
                  }}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20" // Adjusted to match the previous size
                    height="20" // Adjusted to match the previous size
                    viewBox="0 0 24 24"
                    fill="none">
                    <Path
                      d="M13.4 14.6c-.19 0-.38-.07-.53-.22l-1.4-1.4a.75.75 0 0 1-.22-.53V9.66c0-.41.34-.75.75-.75s.75.34.75.75v2.48l1.18 1.18c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22Z"
                      fill="#00AEEF"
                    />
                    <Path
                      d="M12 19.25c-1.59 0-3.09-.5-4.35-1.45-.03-.02-.05-.03-.08-.05A7.243 7.243 0 0 1 4.75 12C4.75 8 8 4.75 12 4.75S19.25 8 19.25 12a7.23 7.23 0 0 1-2.79 5.72c-.03.02-.05.04-.08.06A7.2 7.2 0 0 1 12 19.25Zm-3.57-2.74c.03.02.05.03.07.05 2.03 1.57 5.01 1.56 7.03-.02.02-.02.05-.04.07-.05A5.717 5.717 0 0 0 17.75 12c0-3.17-2.58-5.75-5.75-5.75S6.25 8.83 6.25 12c0 1.77.79 3.41 2.18 4.51Z"
                      fill="#00AEEF"
                    />
                    <Path
                      d="M12.55 22.75h-1.09c-1.96 0-3.16-.97-3.67-2.98l-.5-2.47c-.04-.22.01-.45.16-.62.15-.17.36-.27.58-.27h.01c.17 0 .33.05.46.16 2.03 1.57 5.01 1.56 7.03-.02.31-.24.8-.19 1.05.12.14.17.2.4.16.62l-.51 2.47c-.53 2.02-1.73 2.99-3.68 2.99Zm-3.46-4.11.16.8c.38 1.5 1.16 1.81 2.21 1.81h1.09c1.04 0 1.82-.31 2.21-1.83l.16-.78c-1.81.8-4.01.81-5.83 0ZM16 7.62c-.17 0-.34-.06-.47-.16-2.02-1.58-5-1.59-7.03-.02-.31.24-.8.19-1.04-.11-.14-.17-.2-.4-.16-.62l.49-2.44c.51-2.05 1.71-3.02 3.67-3.02h1.09c1.95 0 3.15.97 3.66 2.96l.52 2.51c.05.22-.01.45-.15.62-.14.18-.35.28-.58.28Zm-4-2.87c1.03 0 2.01.21 2.92.61l-.17-.81c-.39-1.48-1.16-1.8-2.2-1.8h-1.09c-1.05 0-1.83.31-2.21 1.85l-.16.76c.91-.4 1.89-.61 2.91-.61Z"
                      fill="#00AEEF"
                    />
                  </Svg>
                  <Text style={[styles.innerFont, {color: '#00AEEF'}]}>
                    {moment(details?.scheduleDate).format('MMMM-DD') +
                      ' ' +
                      '(' +
                      moment(details?.scheduleTime, ['HH:mm']).format(
                        'h:mm A',
                      ) +
                      ')'}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    gap: 2,
                    alignItems: 'center',
                  }}>
                  <Icons name="cards-heart-outline" size={20} color="#666687" />
                  <Text style={[styles.innerFont]}>
                    {details?.serviceType ? details?.serviceType?.name : '--'}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    gap: 2,
                    alignItems: 'center',
                  }}>
                  <Svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none">
                    <Path
                      d="M3 8.2v7.6c0 .7.4 1.4 1 1.7l7 3.9c.6.3 1.3.3 1.9 0l7-3.9c.6-.4 1-1 1-1.7V8.2c0-.7-.4-1.4-1-1.7l-7-3.9c-.6-.3-1.3-.3-1.9 0L4 6.4c-.6.4-1 1.1-1 1.8Z"
                      stroke="#666687"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                  <Text style={[styles.innerFont]}>{details?.brand?.name}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    gap: 2,
                    alignItems: 'center',
                  }}>
                  <Icons name="hair-dryer-outline" size={20} color="#666687" />
                  <Text style={[styles.innerFont]}>
                    {details?.service?.name}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    gap: 2,
                    alignItems: 'center',
                  }}>
                  <Ionicon name="person-outline" size={20} color="#666687" />
                  <Text style={[styles.innerFont]}>
                    {`Decision Maker - ${details?.client?.decisionMakerName}`}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    gap: 2,
                    alignItems: 'center',
                  }}>
                  <Octicons name="device-mobile" size={20} color="#666687" />
                  <Text style={[styles.innerFont]}>
                    {details?.client?.decisionMakerNumber}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{paddingBottom: 10}}>
              <Text style={styles.header}>{Languages.Attachment}</Text>
            </View>
            <Pressable
              onPress={() =>
                props.navigation.navigate('PDFViewer', {
                  uri: details?.sop,
                  name: 'SOP Document',
                })
              }
              style={{
                width: '100%',
                height: 50,
                alignItems: 'center',
                padding: 10,
                flexDirection: 'row',
                borderColor: 'white',
                borderRadius: 5,
                elevation: 3,
                backgroundColor: 'white',
              }}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none">
                <Path
                  d="M15 22.75H9c-5.43 0-7.75-2.32-7.75-7.75V9c0-5.43 2.32-7.75 7.75-7.75h5c.41 0 .75.34.75.75s-.34.75-.75.75H9C4.39 2.75 2.75 4.39 2.75 9v6c0 4.61 1.64 6.25 6.25 6.25h6c4.61 0 6.25-1.64 6.25-6.25v-5c0-.41.34-.75.75-.75s.75.34.75.75v5c0 5.43-2.32 7.75-7.75 7.75Z"
                  fill="#00aeef"
                />
                <Path
                  d="M22 10.748h-4c-3.42 0-4.75-1.33-4.75-4.75v-4c0-.3.18-.58.46-.69.28-.12.6-.05.82.16l8 8a.751.751 0 0 1-.53 1.28Zm-7.25-6.94v2.19c0 2.58.67 3.25 3.25 3.25h2.19l-5.44-5.44ZM13 13.75H7c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h6c.41 0 .75.34.75.75s-.34.75-.75.75ZM11 17.75H7c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4c.41 0 .75.34.75.75s-.34.75-.75.75Z"
                  fill="#00aeef"
                />
              </Svg>
              <Text
                style={{
                  fontSize: RFValue(12),
                  fontWeight: '500',
                  textAlign: 'left',
                  color: '#666687',
                  marginLeft: 10,
                }}>
                SOP
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                props.navigation.navigate('PDFViewer', {
                  uri: details?.groomingPdf,
                  name: 'Grooming Document',
                })
              }
              style={{
                width: '100%',
                height: 50,
                alignItems: 'center',
                padding: 10,
                flexDirection: 'row',
                borderColor: 'white',
                borderRadius: 5,
                elevation: 3,
                backgroundColor: 'white',
                marginTop: 5,
              }}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none">
                <Path
                  d="M15 22.75H9c-5.43 0-7.75-2.32-7.75-7.75V9c0-5.43 2.32-7.75 7.75-7.75h5c.41 0 .75.34.75.75s-.34.75-.75.75H9C4.39 2.75 2.75 4.39 2.75 9v6c0 4.61 1.64 6.25 6.25 6.25h6c4.61 0 6.25-1.64 6.25-6.25v-5c0-.41.34-.75.75-.75s.75.34.75.75v5c0 5.43-2.32 7.75-7.75 7.75Z"
                  fill="#00aeef"
                />
                <Path
                  d="M22 10.748h-4c-3.42 0-4.75-1.33-4.75-4.75v-4c0-.3.18-.58.46-.69.28-.12.6-.05.82.16l8 8a.751.751 0 0 1-.53 1.28Zm-7.25-6.94v2.19c0 2.58.67 3.25 3.25 3.25h2.19l-5.44-5.44ZM13 13.75H7c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h6c.41 0 .75.34.75.75s-.34.75-.75.75ZM11 17.75H7c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h4c.41 0 .75.34.75.75s-.34.75-.75.75Z"
                  fill="#00aeef"
                />
              </Svg>
              <Text
                style={{
                  fontSize: RFValue(12),
                  fontWeight: '500',
                  textAlign: 'left',
                  color: '#666687',
                  marginLeft: 10,
                }}>
                Grooming
              </Text>
            </Pressable>
            <View style={{height: 10}} />
            <View style={{paddingBottom: 10}}>
              <Text style={styles.header}>{Languages.Status_Map}</Text>
            </View>
            <View style={{flexDirection: 'row', marginVertical: 10}}>
              <FlatList
                style={{flexGrow: 1}}
                data={data}
                scrollEnabled={false}
                renderItem={renderPage}
              />
            </View>

            {title === Languages.Check_In ? (
              <MapModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                latitude={
                  details?.demoAudits != undefined &&
                  details?.demoAudits.length != 0
                    ? details?.demoAudits[0]?.auditData.latitude
                    : 0
                }
                longitude={
                  details?.demoAudits != undefined &&
                  details?.demoAudits.length != 0
                    ? details?.demoAudits[0]?.auditData.longitude
                    : 0
                }
                address={
                  details?.demoAudits != undefined &&
                  details?.demoAudits.length != 0
                  ? details?.demoAudits[0]?.auditData.trainerLocation
                  : 0
                }
                clientName={
                  details?.demoAudits != undefined &&
                  details?.demoAudits.length != 0
                    ? details?.demoAudits[0]?.auditData.clientName
                    : ''
                }
              />
            ) : (
              <MapModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                latitude={
                  checkOutStatus
                    ? details?.demoAudits[11]?.auditData.latitude
                    : ''
                }
                longitude={
                  checkOutStatus
                    ? details?.demoAudits[11]?.auditData.longitude
                    : ''
                }
                address={
                 checkOutStatus
                    ? details?.demoAudits[11]?.auditData.trainerLocation
                    : ''
                }
                clientName={
                  checkOutStatus
                    ? details?.demoAudits[11]?.auditData.clientName
                    : ''
                }
              />
            )}
            {roleName === 'Trainer' &&
              !IsDemoHistory &&
              !isDemoAudit &&
              isCurrentDate(details?.scheduleDate)&& (
                <View style={{marginBottom: 10}}>
                  <CustomButton
                    text={Languages.Action}
                    onPress={() => {
                      props.navigation.navigate('ActionScreen', {
                        Details: details,
                      });
                    }}
                  />
                </View>
              )}
            {roleName === 'Salesman' &&
              (details?.demoStatus === 'CREATED' ||
              details?.demoStatus === 'INVITE_PENDING' ||
              details?.demoStatus === 'IN_PROGRESS' ||
              details?.demoStatus === 'INVITE_ACCEPTED' ? (
                <CustomButton
                  text={Languages.Cancel}
                  onPress={() => {
                    setcancelModalVisible(true);
                  }}
                />
              ) : (
                <View></View>
              ))}
          </ScrollView>
          <CancelPopup
            visible={cancelModalVisible}
            onClose={() => {
              setcancelModalVisible(false);
            }}
            id={props.route.params.id}
            onCloseSuccess={onhandleCloseSuccess}
          />
        </View>
      ) : (
        <View style={{height: '100%'}}>
          <View style={{height: 10}} />
          <LoadingIndicator />
          {/* <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '90%',
            }}>
            <ActivityIndicator color={GlobalStyles.colorSet.orange} size={30} />
          </View> */}
        </View>
      )}
    </SafeAreaView>
  );
};
export default DemoDetailScreen;
