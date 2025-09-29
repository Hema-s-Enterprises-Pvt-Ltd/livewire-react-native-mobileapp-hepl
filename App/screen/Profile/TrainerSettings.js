import React, {useEffect, useState} from 'react';
import {View, Text,Alert, SafeAreaView} from 'react-native';
import {styles} from './ProfileStyles';
import CustomAppBar from '../../component/CustomAppBar';
import SettingView from './component/SettingView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSettingDetails, updateSetting } from '../../networkClient/apifunction';
import { Languages } from '../../common';
import crashlytics from '@react-native-firebase/crashlytics';

const TrainerSettingScreen = (props) => {
  const [data,setData]=useState()
  const [isRemainderOn, setIsRemainderOn] = useState();
  const [isInviteOn, setIsInviteOn] = useState();
  const [isReinviteOn, setIsReinviteOn] = useState();
  const [isBlockOn, setIsBlockOn] = useState();
  const [isRejectOn, setIsRejectOn] = useState();
  const [isApproveOn, setIsApproveOn] = useState();
  const [isCancelOn, setIsCancelOn] = useState();
  const [selectedValue, setSelectedValue] = useState();
  const [triggerApiCall, setTriggerApiCall] = useState(false);

  const onToggleDemoSwitch = () => {
    setIsRemainderOn(!isRemainderOn)
    setTriggerApiCall(true)
  };

  const onToggleInviteSwitch = () => {
    setIsInviteOn(!isInviteOn)
    setTriggerApiCall(true)
  };

  const onToggleReInviteSwitch = () => {
    setIsReinviteOn(!isReinviteOn)
    setTriggerApiCall(true)
  };

  const onToggleBlockSwitch = () => {
    setIsBlockOn(!isBlockOn)
    setTriggerApiCall(true)
  };

  const onToggleRejectSwitch = () => {
    setIsRejectOn(!isRejectOn)
    setTriggerApiCall(true)
  };

  const onToggleApproveSwitch = () => {
    setIsApproveOn(!isApproveOn)
    setTriggerApiCall(true)
  };

  const onToggleCancelSwitch = () => {
    setIsCancelOn(!isCancelOn)
    setTriggerApiCall(true)
  };

  const getSettingData = async () => {
    var Id = await AsyncStorage.getItem('userId');
    await getSettingDetails(Id).then(function (response) {
      if (response.data.statusCode == 200) {
       setData(response.data.data)
       setIsRemainderOn(response.data.data.demoReminder)
       setIsInviteOn(response.data.data.demoInvite)
       setIsReinviteOn(response.data.data.demoReInvite)
       setIsBlockOn(response.data.data.envolutionBlocked)
       setIsRejectOn(response.data.data.envolutionRejected)
       setIsApproveOn(response.data.data.envolutionApproved)
       setIsCancelOn(response.data.data.demoCancelled)
       if(response.data.data.demoReminderFourHour){
        setSelectedValue(Languages.four_Hrs_Before)
       }
       if(response.data.data.demoReminderOneDay){
        setSelectedValue(Languages.One_Day_Before)
       }
       
      } else {
        Alert.alert(Languages.Alert, response.data.statusMessage);
      }
    }).catch(function (error) {
      Alert.alert(Languages.Alert, error.response.data.message);
    });
  };
  const updateSettingData = async () => {
    var Id = await AsyncStorage.getItem('userId');
    var params={
       userId: Id,
       envolutionBlocked: isBlockOn,
       envolutionRejected: isRejectOn,
       envolutionApproved: isApproveOn,
       demoReInvite: isReinviteOn,
       demoCancelled: isCancelOn,
       demoInvite: isInviteOn,
       demoReminder: isRemainderOn,
       demoReminderOneDay:isRemainderOn? selectedValue===Languages.One_Day_Before?true:false:false,
       demoReminderFourHour:isRemainderOn? selectedValue===Languages.four_Hrs_Before?true:false:false
     
    }
    await updateSetting(params).then(function (response) {
      if (response.data.statusCode == 200) {
       
      } else {
        Alert.alert(Languages.Alert, response.data.statusMessage);
      }
    }).catch(function (error) {
      Alert.alert(Languages.Alert, error.response.data.message);
    });
  };

  useEffect(() => {
    // Log that the component has mounted
    crashlytics().log('TrainerSettings mounted');
    return () => {
      // Log that the component is unmounting
      crashlytics().log('TrainerSettings unmounted');
    };
  }, []);

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
        <CustomAppBar title={Languages.Settings} showImage={true} navigation={props.navigation}/>
        <View style={{height: 30}} />
        <Text
          style={{
            color: '#212B36',
            fontSize: 18,
            fontWeight: 'bold',
          }}>
          {Languages.Notification_Preferences}
        </Text>
       <SettingView
       title={Languages.Demo_Reminder}
       value={isRemainderOn}
       onValueChange={onToggleDemoSwitch}
       isDemoRemainder={isRemainderOn}
       yesStatus={selectedValue === Languages.One_Day_Before ? 'checked' : 'unchecked'}
       onYesPress={() =>{
        setSelectedValue(Languages.One_Day_Before)
        setTriggerApiCall(true)
       }}
       nostatus={selectedValue === Languages.four_Hrs_Before ? 'checked' : 'unchecked'}
       onNoPress={() => {
        setSelectedValue(Languages.four_Hrs_Before)
        setTriggerApiCall(true)
       }}
       />
         <SettingView
       title={Languages.Demo_Invite_Received}
       value={isInviteOn}
       onValueChange={onToggleInviteSwitch}
       isDemoRemainder={false}
       />
        <SettingView
       title={Languages.Demo_Reinvite_Received}
       value={isReinviteOn}
       onValueChange={onToggleReInviteSwitch}
       isDemoRemainder={false}
       />
           <SettingView
       title={Languages.Evaluation_Blocked}
       value={isBlockOn}
       onValueChange={onToggleBlockSwitch}
       isDemoRemainder={false}
       />
        <SettingView
       title={Languages.Evaluation_Rejected}
       value={isRejectOn}
       onValueChange={onToggleRejectSwitch}
       isDemoRemainder={false}
       />
       <SettingView
       title={Languages.Evaluation_Approved}
       value={isApproveOn}
       onValueChange={onToggleApproveSwitch}
       isDemoRemainder={false}
       />
         <SettingView
       title={Languages.Demo_Cancelled}
       value={isCancelOn}
       onValueChange={onToggleCancelSwitch}
       isDemoRemainder={false}
       />
      </View>

    </SafeAreaView>
  );
};
export default TrainerSettingScreen;
