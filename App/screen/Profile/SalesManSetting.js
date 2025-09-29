import React, {useState,useEffect} from 'react';
import {View, Text,Alert, SafeAreaView} from 'react-native';
import {styles} from './ProfileStyles';
import CustomAppBar from '../../component/CustomAppBar';
import SettingView from './component/SettingView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSettingDetails, updateSetting } from '../../networkClient/apifunction';
import { Languages } from '../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const SalesManSettingScreen = (props) => {
    const [triggerApiCall, setTriggerApiCall] = useState(false);
    const [isDemoAccepted, setIsDemoAccepted] = useState();
    const [isDemoReinvite, setIsDemoReinvite] = useState();
    const [isDemoReinviteReject, setIsDemoReinviteReject] = useState();
    const [isDemoCompleted, setIsDemoCompleted] = useState();
    const [isDemoRejected, setIsDemoRejected] = useState();
    const [isDemoRemainder, setIsDemoRemainder] = useState();
    const [selectedValue, setSelectedValue] = useState('');
    const onToggleisDemoAcceptedSwitch = () => {
      setIsDemoAccepted(!isDemoAccepted)
      setTriggerApiCall(true)
    };
    const onToggleisDemoRejectedSwitch = () => {
      setIsDemoRejected(!isDemoRejected)
      setTriggerApiCall(true)
    };
    const onToggleisDemoReinviteSwitch = () => {
      setIsDemoReinvite(!isDemoReinvite)
      setTriggerApiCall(true)
    };
    const onToggleisDemoReinviteRejectSwitch = () => {
      setIsDemoReinviteReject(!isDemoReinviteReject)
      setTriggerApiCall(true)
    };
    const onToggleisDemoCompletedSwitch = () => {
      setIsDemoCompleted(!isDemoCompleted)
      setTriggerApiCall(true)
    };
    const onToggleisDemoRemainderSwitch = () => {
      setIsDemoRemainder(!isDemoRemainder)
      setTriggerApiCall(true)
    };

    useEffect(() => {
      // Log that the component has mounted
      crashlytics().log('SalesManSetting mounted');
      return () => {
        // Log that the component is unmounting
        crashlytics().log('SalesManSetting unmounted');
      };
    }, []);

    const getSettingData = async () => {
      var Id = await AsyncStorage.getItem('userId');
      await getSettingDetails(Id).then(function (response) {
        if (response.data.statusCode == 200) {
         setIsDemoAccepted(response.data.data.demoAcceptance)
         setIsDemoReinvite(response.data.data.demoReInviteAccepted)
         setIsDemoRejected(response.data.data.demoRejection)
         setIsDemoReinviteReject(response.data.data.demoReInviteRejected)
         setIsDemoCompleted(response.data.data.demoCompleted)
         setIsDemoRemainder(response.data.data.demoReminder)
         if(response.data.data.demoReminderFourHour){
          setSelectedValue('4 Hrs Before')
         }
         if(response.data.data.demoReminderOneDay){
          setSelectedValue('1 Day Before')
         }
        } else {
          Alert.alert("Alert", response.data.statusMessage);
        }
      }).catch(function (error) {
        Alert.alert("Alert", error.response.data.message);
      });
    };
    const updateSettingData = async () => {
      var Id = await AsyncStorage.getItem('userId');
      var params={
         userId: Id,
         demoAcceptance: isDemoAccepted,
         demoRejection: isDemoRejected,
         demoReInviteAccepted: isDemoReinvite,
        //  evaluationRequest: true,
         demoReminder: isDemoRemainder,
         demoReminderOneDay:isDemoRemainder? selectedValue==="1 Day Before"?true:false:false,
         demoReminderFourHour:isDemoRemainder? selectedValue==="4 Hrs Before"?true:false:false,
         demoReInviteRejected:isDemoReinviteReject,
         demoCompleted:isDemoCompleted
      }
      await updateSetting(params).then(function (response) {
        if (response.data.statusCode == 200) {
         
        } else {
          Alert.alert("Alert", response.data.statusMessage);
        }
      }).catch(function (error) {
        Alert.alert("Alert", error.response.data.message);
      });
    };
    useEffect(()=>{
      getSettingData()
    },[])
    useEffect(() => {
      if (triggerApiCall) {
        updateSettingData()
        setTriggerApiCall(false);
      }
    }, [triggerApiCall]);
  return (
    <SafeAreaView style={styles.viewContainer}>
      <View style={styles.container}>
        <CustomAppBar title={Languages.Settings} showImage={true} navigation={props.navigation} />
        <View style={{height: 30}} />
        <Text
          style={{
            color: '#212B36',
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10
          }}>
          {Languages.Notification_Preferences}
        </Text>
        <SettingView
       title={Languages.Demo_Acceptance}
       value={isDemoAccepted}
       onValueChange={onToggleisDemoAcceptedSwitch}
       isDemoRemainder={false}
       />
         <SettingView
       title={Languages.Demo_Rejections}
       value={isDemoRejected}
       onValueChange={onToggleisDemoRejectedSwitch}
       isDemoRemainder={false}
       />
         <SettingView
       title={Languages.Demo_Reinvite_Accepted}
       value={isDemoReinvite}
       onValueChange={onToggleisDemoReinviteSwitch}
       isDemoRemainder={false}
       />
        <SettingView
       title={Languages.Demo_Reminder}
       value={isDemoRemainder}
       onValueChange={onToggleisDemoRemainderSwitch}
       isDemoRemainder={isDemoRemainder}
       yesStatus={selectedValue === Languages.One_Day_Before ? 'checked' : 'unchecked'}
       onYesPress={() => {
        setSelectedValue(Languages.One_Day_Before)
        setTriggerApiCall(true)
       }}
       nostatus={selectedValue === Languages.four_Hrs_Before ? 'checked' : 'unchecked'}
       onNoPress={() =>{
        setSelectedValue(Languages.four_Hrs_Before)
        setTriggerApiCall(true)
       }}
       />
        <SettingView
       title={Languages.Demo_Reinvite_Rejected}
       value={isDemoReinviteReject}
       onValueChange={onToggleisDemoReinviteRejectSwitch}
       isDemoRemainder={false}
       />
        <SettingView
       title={Languages.Demo_Completed}
       value={isDemoCompleted}
       onValueChange={onToggleisDemoCompletedSwitch}
       isDemoRemainder={false}
       />
      </View>
    </SafeAreaView>
  );
};
export default SalesManSettingScreen;
